import type { VercelRequest, VercelResponse } from '@vercel/node';
import { currentUser, json } from '../_lib/auth.js';

/** GET /api/auth/session — who is signed in, if anyone. */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });
  // A session check must never be cached: a stale 200 would let a signed-out
  // browser believe it is still signed in.
  res.setHeader('Cache-Control', 'no-store');
  try {
    const user = await currentUser(req);
    if (!user) return json(res, 401, { error: 'Not authenticated' });
    return json(res, 200, { user });
  } catch (err) {
    console.error('session lookup failed:', err);
    return json(res, 500, { error: 'Could not verify your session.' });
  }
}
