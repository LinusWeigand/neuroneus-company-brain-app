import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  PROVIDERS, codeChallenge, isProvider, randomToken, redirectUri, setFlowCookie,
} from '../../_lib/oauth.js';

/**
 * GET /api/auth/start/:provider — begin an OAuth login.
 *
 * Mints the three one-time values the flow depends on and parks them in a
 * short-lived cookie: `state` (proves the callback belongs to this browser),
 * `verifier` (PKCE, proves it belongs to this request), and `nonce` (binds the
 * returned ID token to this attempt). Only their public halves travel onward.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  const provider = String(req.query.provider ?? '');
  if (!isProvider(provider)) return res.status(404).json({ error: 'Unknown provider' });

  const cfg = PROVIDERS[provider];
  if (!cfg.clientId() || !cfg.clientSecret()) {
    // Misconfiguration, not a user error: say so in the logs, stay vague outside.
    console.error(`${provider} OAuth is not configured (missing client id or secret)`);
    return res.redirect(302, '/?error=oauth_unavailable');
  }

  const state = randomToken();
  const verifier = randomToken();
  const nonce = randomToken();
  setFlowCookie(req, res, { provider, state, verifier, nonce });

  const params = new URLSearchParams({
    client_id: cfg.clientId()!,
    redirect_uri: redirectUri(req, provider),
    response_type: 'code',
    scope: cfg.scope,
    state,
    nonce,
    code_challenge: codeChallenge(verifier),
    code_challenge_method: 'S256',
  });

  // Ask Google for a stable account chooser rather than silently reusing one.
  if (provider === 'google') params.set('prompt', 'select_account');

  return res.redirect(302, `${cfg.authorizeUrl}?${params}`);
}
