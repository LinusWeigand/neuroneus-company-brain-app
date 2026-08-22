import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../../_lib/db.js';
import { SESSION_DAYS, hashToken, newSessionToken, setSessionCookie } from '../../_lib/auth.js';
import {
  clearFlowCookie, exchangeCode, isProvider, readFlowCookie, redirectUri,
  resolveIdentity, verifyIdToken,
} from '../../_lib/oauth.js';

/** Send the browser back to the login screen with a code it can explain. */
function fail(req: VercelRequest, res: VercelResponse, code: string) {
  clearFlowCookie(req, res);
  return res.redirect(302, `/?error=${encodeURIComponent(code)}`);
}

/**
 * GET /api/auth/callback/:provider — finish an OAuth login.
 *
 * Sign-in only: an identity that matches no existing account is turned away
 * rather than provisioned. There is no public signup, and auto-creating
 * accounts here would quietly make the app open to anyone with a Google login.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const provider = String(req.query.provider ?? '');
  if (!isProvider(provider)) return res.status(404).json({ error: 'Unknown provider' });

  // The provider reports user-side refusals (consent declined, admin block) here.
  if (req.query.error) {
    console.warn(`${provider} returned ${String(req.query.error)}`);
    return fail(req, res, 'oauth_denied');
  }

  const flow = readFlowCookie(req);
  const code = typeof req.query.code === 'string' ? req.query.code : null;
  const state = typeof req.query.state === 'string' ? req.query.state : null;

  // A missing or mismatched state means this callback did not originate from a
  // login this browser started — the CSRF check.
  if (!flow || !code || !state || flow.provider !== provider || flow.state !== state) {
    return fail(req, res, 'oauth_state');
  }

  try {
    const tokens = await exchangeCode(provider, code, flow.verifier, redirectUri(req, provider));
    if (!tokens.id_token) throw new Error('no id_token in token response');

    const claims = verifyIdToken(provider, tokens.id_token, flow.nonce);
    const identity = resolveIdentity(provider, claims);

    const sql = db();

    // 1. Already-linked identity: match on the provider's immutable subject.
    //    Email plays no part here, so personal accounts keep working forever.
    const linked = (await sql`
      select u.id, u.email, u.name
      from app_oauth_identity i
      join app_user u on u.id = i.user_id
      where i.provider = ${provider} and i.subject = ${identity.subject}
        and i.tenant = ${identity.tenant}
      limit 1
    `) as { id: number; email: string; name: string }[];

    let userId = linked[0]?.id ?? null;

    // 2. First time for this identity: link it to an existing account by email,
    //    but only if the provider vouches the address is verified. This is the
    //    one moment a spoofed email could hijack an account, so it is strict.
    if (!userId) {
      if (!identity.email || !identity.emailVerified) {
        console.warn(`${provider} login rejected: email not provider-verified`);
        return fail(req, res, 'email_unverified');
      }
      const found = (await sql`
        select id from app_user where email = ${identity.email} limit 1
      `) as { id: number }[];
      if (!found[0]) return fail(req, res, 'no_account');

      userId = found[0].id;
      await sql`
        insert into app_oauth_identity (user_id, provider, subject, tenant)
        values (${userId}, ${provider}, ${identity.subject}, ${identity.tenant})
        on conflict (provider, subject, tenant) do nothing
      `;
    }

    const token = newSessionToken();
    await sql`
      insert into app_session (user_id, token_hash, expires_at)
      values (${userId}, ${hashToken(token)}, now() + make_interval(days => ${SESSION_DAYS}))
    `;

    // Clear the transient flow cookie and set the session in one header.
    clearFlowCookie(req, res);
    setSessionCookie(req, res, token);
    return res.redirect(302, '/');
  } catch (err) {
    console.error(`${provider} callback failed:`, err);
    return fail(req, res, 'oauth_failed');
  }
}
