import { createHash, randomBytes } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export type Provider = 'google' | 'microsoft';

export const isProvider = (v: unknown): v is Provider =>
  v === 'google' || v === 'microsoft';

type ProviderConfig = {
  authorizeUrl: string;
  tokenUrl: string;
  scope: string;
  clientId: () => string | undefined;
  clientSecret: () => string | undefined;
  /** Validate the `iss` claim. Microsoft is multitenant, so its issuer varies
   *  by tenant and has to be checked against the token's own tid. */
  checkIssuer: (iss: unknown, claims: IdTokenClaims) => boolean;
};

export const PROVIDERS: Record<Provider, ProviderConfig> = {
  google: {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    scope: 'openid email profile',
    clientId: () => process.env.GOOGLE_CLIENT_ID,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
    checkIssuer: (iss) => iss === 'https://accounts.google.com' || iss === 'accounts.google.com',
  },
  microsoft: {
    // `common` accepts both organisational and personal accounts, matching the
    // "Any Entra ID Tenant + Personal Microsoft accounts" registration.
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    scope: 'openid email profile',
    clientId: () => process.env.MICROSOFT_CLIENT_ID,
    clientSecret: () => process.env.MICROSOFT_CLIENT_SECRET,
    checkIssuer: (iss, claims) =>
      typeof iss === 'string' &&
      typeof claims.tid === 'string' &&
      iss === `https://login.microsoftonline.com/${claims.tid}/v2.0`,
  },
};

export type IdTokenClaims = {
  iss?: unknown;
  aud?: unknown;
  exp?: unknown;
  nonce?: unknown;
  sub?: unknown;
  email?: unknown;
  name?: unknown;
  /** Google: whether the address is verified. */
  email_verified?: unknown;
  /** Microsoft: immutable object id, and the tenant it belongs to. */
  oid?: unknown;
  tid?: unknown;
  /** Microsoft: tenant provably owns the email's domain. */
  xms_edov?: unknown;
};

const b64url = (b: Buffer) => b.toString('base64url');

export const randomToken = () => b64url(randomBytes(32));

/** PKCE: the challenge is what leaves the browser, the verifier stays here. */
export const codeChallenge = (verifier: string) =>
  b64url(createHash('sha256').update(verifier).digest());

/** Origin of this deployment, from the forwarded headers so it is correct on
 *  Vercel, on preview URLs, and on `vercel dev` without any configuration. */
export function origin(req: VercelRequest): string {
  const proto = ((req.headers['x-forwarded-proto'] as string) ?? 'https').split(',')[0];
  const host = (req.headers['x-forwarded-host'] as string) ?? req.headers.host ?? '';
  return `${proto}://${host}`;
}

export const redirectUri = (req: VercelRequest, provider: Provider) =>
  `${origin(req)}/api/auth/callback/${provider}`;

/* --- transient flow state ---------------------------------------------- */

const FLOW_COOKIE = 'orakis_oauth';
/** Long enough to sign in, short enough that a stale tab cannot replay. */
const FLOW_TTL_SECONDS = 600;

export type FlowState = { provider: Provider; state: string; verifier: string; nonce: string };

export function setFlowCookie(req: VercelRequest, res: VercelResponse, flow: FlowState) {
  const value = Buffer.from(JSON.stringify(flow)).toString('base64url');
  const parts = [
    `${FLOW_COOKIE}=${value}`,
    'Path=/',
    'HttpOnly',
    // Lax still arrives on the provider's top-level redirect back to us,
    // while keeping the cookie off cross-site sub-requests.
    'SameSite=Lax',
    `Max-Age=${FLOW_TTL_SECONDS}`,
  ];
  if (origin(req).startsWith('https://')) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function readFlowCookie(req: VercelRequest): FlowState | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k !== FLOW_COOKIE) continue;
    try {
      const parsed = JSON.parse(Buffer.from(v.join('='), 'base64url').toString());
      if (isProvider(parsed?.provider) && parsed.state && parsed.verifier && parsed.nonce) {
        return parsed as FlowState;
      }
    } catch {
      return null;
    }
  }
  return null;
}

export function clearFlowCookie(req: VercelRequest, res: VercelResponse, extra: string[] = []) {
  const parts = [`${FLOW_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (origin(req).startsWith('https://')) parts.push('Secure');
  res.setHeader('Set-Cookie', [parts.join('; '), ...extra]);
}

/* --- token exchange ------------------------------------------------------ */

export async function exchangeCode(
  provider: Provider,
  code: string,
  verifier: string,
  uri: string,
): Promise<{ id_token?: string }> {
  const cfg = PROVIDERS[provider];
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: uri,
    client_id: cfg.clientId() ?? '',
    client_secret: cfg.clientSecret() ?? '',
    code_verifier: verifier,
  });
  const res = await fetch(cfg.tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!res.ok) {
    throw new Error(`token exchange failed (${res.status}): ${(await res.text()).slice(0, 300)}`);
  }
  return (await res.json()) as { id_token?: string };
}

/**
 * Decode and validate an ID token.
 *
 * The signature is not re-verified, and that is deliberate rather than a
 * shortcut: OIDC Core 3.1.3.7 permits skipping it when the token arrives over
 * a direct TLS-protected call to the provider's own token endpoint, which is
 * exactly how `exchangeCode` obtains it. TLS already authenticates the issuer.
 * Every other check — issuer, audience, expiry, nonce — is enforced here.
 */
export function verifyIdToken(
  provider: Provider,
  idToken: string,
  expectedNonce: string,
): IdTokenClaims {
  const segments = idToken.split('.');
  if (segments.length !== 3) throw new Error('malformed id_token');

  const claims = JSON.parse(
    Buffer.from(segments[1]!, 'base64url').toString(),
  ) as IdTokenClaims;

  const cfg = PROVIDERS[provider];
  if (!cfg.checkIssuer(claims.iss, claims)) throw new Error('unexpected issuer');

  const audience = cfg.clientId();
  const aud = claims.aud;
  const audOk = Array.isArray(aud) ? aud.includes(audience) : aud === audience;
  if (!audOk) throw new Error('token was not issued for this client');

  if (typeof claims.exp !== 'number' || claims.exp * 1000 <= Date.now()) {
    throw new Error('token expired');
  }
  // Binds this token to the login we started, so one captured elsewhere cannot
  // be replayed into our callback.
  if (claims.nonce !== expectedNonce) throw new Error('nonce mismatch');

  return claims;
}

export type ResolvedIdentity = {
  /** Stable, provider-assigned id. Never an email. */
  subject: string;
  tenant: string;
  email: string | null;
  /** Whether the provider vouches for the email. Governs first-time linking. */
  emailVerified: boolean;
  name: string | null;
};

/** Reduce provider-specific claims to the shape the callback needs. */
export function resolveIdentity(provider: Provider, claims: IdTokenClaims): ResolvedIdentity {
  const email = typeof claims.email === 'string' ? claims.email.toLowerCase() : null;
  const name = typeof claims.name === 'string' ? claims.name : null;

  if (provider === 'google') {
    if (typeof claims.sub !== 'string') throw new Error('missing sub');
    return {
      subject: claims.sub,
      tenant: '',
      email,
      // Google sends this as a boolean or the string "true" depending on age.
      emailVerified: claims.email_verified === true || claims.email_verified === 'true',
      name,
    };
  }

  // Microsoft: oid is immutable within a tenant; the pair identifies a person.
  const oid = typeof claims.oid === 'string' ? claims.oid : null;
  const tid = typeof claims.tid === 'string' ? claims.tid : null;
  if (!oid || !tid) throw new Error('missing oid/tid');

  return {
    subject: oid,
    tenant: tid,
    email,
    /* A missing xms_edov must fail exactly like a false one. Without it, any
       tenant could assert any address and take over the matching account. */
    emailVerified: claims.xms_edov === true || claims.xms_edov === 'true',
    name,
  };
}
