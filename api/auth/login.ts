import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db.js';
import {
  SESSION_DAYS, burnTime, clientHash, hashToken, json, newSessionToken,
  setSessionCookie, verifyPassword,
} from '../_lib/auth.js';

/** Login attempts allowed per window, per caller. */
const MAX_ATTEMPTS = 10;
const WINDOW_MINUTES = 15;

/** One message for every failure. Distinguishing "no such user" from "wrong
 *  password" would turn this endpoint into an account-existence oracle. */
const GENERIC_FAILURE = 'Wrong email or password.';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const body = (typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body) ?? {};
  const email = String(body.email ?? '').trim().toLowerCase().slice(0, 255);
  const password = String(body.password ?? '').slice(0, 512);

  if (!email || !password) return json(res, 400, { error: 'Email and password are required.' });

  try {
    const sql = db();
    const who = clientHash(req);

    // Throttle first: brute force should be cheap to refuse, not cheap to run.
    await sql`
      delete from app_login_attempt
      where created_at < now() - make_interval(mins => ${WINDOW_MINUTES})
    `;
    const recent = (await sql`
      select count(*)::int as n from app_login_attempt
      where client_hash = ${who} and kind = 'login'
    `) as { n: number }[];
    if ((recent[0]?.n ?? 0) >= MAX_ATTEMPTS) {
      return json(res, 429, { error: 'Too many attempts. Please try again in a few minutes.' });
    }
    await sql`insert into app_login_attempt (client_hash, kind) values (${who}, 'login')`;

    const users = (await sql`
      select id, email, name, password_hash from app_user where email = ${email} limit 1
    `) as { id: number; email: string; name: string; password_hash: string }[];
    const user = users[0];

    if (!user) {
      // Spend comparable time so timing does not reveal whether the account exists.
      await burnTime(password);
      return json(res, 401, { error: GENERIC_FAILURE });
    }
    if (!(await verifyPassword(password, user.password_hash))) {
      return json(res, 401, { error: GENERIC_FAILURE });
    }

    const token = newSessionToken();
    await sql`
      insert into app_session (user_id, token_hash, expires_at)
      values (${user.id}, ${hashToken(token)}, now() + make_interval(days => ${SESSION_DAYS}))
    `;
    // Successful login clears the throttle for this caller.
    await sql`delete from app_login_attempt where client_hash = ${who} and kind = 'login'`;

    setSessionCookie(req, res, token);
    return json(res, 200, { user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    console.error('login failed:', err);
    return json(res, 500, { error: 'Could not sign you in right now. Please try again later.' });
  }
}
