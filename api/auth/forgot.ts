import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db.js';
import { clientHash, hashToken, json, newSessionToken } from '../_lib/auth.js';
import { resetEmail, sendMail } from '../_lib/mail.js';
import { origin } from '../_lib/oauth.js';

const TTL_MINUTES = 60;
/** Requests allowed per caller per window, to stop the endpoint being used as
 *  a way to spam someone's inbox. */
const MAX_REQUESTS = 5;
const WINDOW_MINUTES = 15;

/**
 * POST /api/auth/forgot — start a password reset.
 *
 * Always answers 200, whether or not the address exists. Anything else turns
 * this into an account-existence oracle: an attacker could enumerate customers
 * by watching which addresses come back different.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) ?? {};
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 255);

  // Same shape for every outcome below.
  const ok = () => json(res, 200, { ok: true });
  if (!email) return ok();

  try {
    const sql = db();
    const who = clientHash(req);

    await sql`
      delete from app_login_attempt
      where created_at < now() - make_interval(mins => ${WINDOW_MINUTES})
    `;
    const recent = (await sql`
      select count(*)::int as n from app_login_attempt
      where client_hash = ${who} and kind = 'reset'
    `) as { n: number }[];
    if ((recent[0]?.n ?? 0) >= MAX_REQUESTS) return ok();
    await sql`insert into app_login_attempt (client_hash, kind) values (${who}, 'reset')`;

    const users = (await sql`
      select id, email, name from app_user where email = ${email} limit 1
    `) as { id: number; email: string; name: string }[];
    const user = users[0];
    if (!user) return ok();

    // Any earlier link becomes useless the moment a new one is issued.
    await sql`
      update app_password_reset set used_at = now()
      where user_id = ${user.id} and used_at is null
    `;

    const token = newSessionToken();
    await sql`
      insert into app_password_reset (user_id, token_hash, expires_at)
      values (${user.id}, ${hashToken(token)}, now() + make_interval(mins => ${TTL_MINUTES}))
    `;

    const url = `${origin(req)}/reset?token=${encodeURIComponent(token)}`;
    const { text, html } = resetEmail(user.name, url, TTL_MINUTES);
    await sendMail(user.email, 'Reset your Orakis password', text, html);

    return ok();
  } catch (err) {
    // Log the real reason; still answer identically so nothing is revealed.
    console.error('password reset request failed:', err);
    return ok();
  }
}
