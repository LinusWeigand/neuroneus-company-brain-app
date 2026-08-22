import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db.js';
import { hashPassword, hashToken, json } from '../_lib/auth.js';

/** Matches the floor enforced by scripts/create-user.mjs. */
const MIN_PASSWORD = 12;

/**
 * POST /api/auth/reset — complete a password reset.
 *
 * Consumes the token, sets the new password, and revokes every existing
 * session for that account. That last part matters: if someone reset their
 * password because they believe it was compromised, leaving the attacker's
 * session alive would defeat the entire exercise.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) ?? {};
  const token = String(body.token ?? '');
  const password = String(body.password ?? '');

  if (!token) return json(res, 400, { error: 'This reset link is not valid.' });
  if (password.length < MIN_PASSWORD) {
    return json(res, 400, { error: `Password must be at least ${MIN_PASSWORD} characters.` });
  }

  try {
    const sql = db();
    const rows = (await sql`
      select id, user_id from app_password_reset
      where token_hash = ${hashToken(token)} and used_at is null and expires_at > now()
      limit 1
    `) as { id: number; user_id: number }[];

    const reset = rows[0];
    // Expired, already used, or never existed — all indistinguishable, and all
    // the same to the person holding a stale link.
    if (!reset) {
      return json(res, 400, { error: 'This reset link has expired or already been used.' });
    }

    await sql`
      update app_user set password_hash = ${await hashPassword(password)}
      where id = ${reset.user_id}
    `;
    await sql`update app_password_reset set used_at = now() where id = ${reset.id}`;
    // Sign out everywhere, including whoever prompted the reset.
    await sql`delete from app_session where user_id = ${reset.user_id}`;

    return json(res, 200, { ok: true });
  } catch (err) {
    console.error('password reset failed:', err);
    return json(res, 500, { error: 'Could not reset your password. Please try again later.' });
  }
}
