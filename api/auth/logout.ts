import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../_lib/db.js';
import { clearSessionCookie, hashToken, json, readSessionToken } from '../_lib/auth.js';

/** POST /api/auth/logout — revoke this session server-side, then clear the cookie. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  try {
    const token = readSessionToken(req);
    if (token) {
      // Delete the row, not just the cookie: a copied token must stop working.
      await db()`delete from app_session where token_hash = ${hashToken(token)}`;
    }
  } catch (err) {
    console.error('logout cleanup failed:', err);
    // Fall through: the cookie is cleared regardless.
  }
  clearSessionCookie(req, res);
  return json(res, 200, { ok: true });
}
