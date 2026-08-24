import {
  createHash, randomBytes, scrypt as scryptCb, timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from './db.js';

const scrypt = promisify(scryptCb) as (
  password: string | Buffer,
  salt: string | Buffer,
  keylen: number,
  options: { N: number; r: number; p: number },
) => Promise<Buffer>;

/* scrypt is memory-hard, which is what makes it expensive to attack with GPUs.
   The parameters are stored alongside each hash so they can be raised later
   without invalidating passwords already in the database. */
const SCRYPT = { N: 16384, r: 8, p: 1 } as const;
const KEY_LEN = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('hex')}$${key.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, n, r, p, saltHex, hashHex] = parts;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length, {
    N: Number(n), r: Number(r), p: Number(p),
  });
  // Constant-time: a plain === leaks how much of the hash matched via timing.
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** A hash of a password that does not exist, to spend the same time on a
 *  missing account as on a real one. Without this, response timing reveals
 *  which email addresses are registered. */
export async function burnTime(password: string): Promise<void> {
  await scrypt(password, randomBytes(16), KEY_LEN, SCRYPT);
}

export const SESSION_COOKIE = 'neuroneus_session';
export const SESSION_DAYS = 30;

export const hashToken = (token: string) => createHash('sha256').update(token).digest('hex');

/** Opaque session token. Only its SHA-256 is ever persisted. */
export const newSessionToken = () => randomBytes(32).toString('base64url');

/** Salted hash of the caller's IP, for rate limiting without storing an IP. */
export function clientHash(req: VercelRequest): string {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  const ip = (raw ?? '').split(',')[0]?.trim() || 'unknown';
  const salt = process.env.THROTTLE_SALT ?? 'neuroneus-app-fallback-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex');
}

/** Vercel terminates TLS upstream, so trust the forwarded protocol. Omitting
 *  Secure on http keeps the cookie working against a local dev server. */
const isHttps = (req: VercelRequest) =>
  (req.headers['x-forwarded-proto'] as string | undefined)?.split(',')[0] === 'https';

export function setSessionCookie(req: VercelRequest, res: VercelResponse, token: string) {
  const parts = [
    `${SESSION_COOKIE}=${token}`,
    'Path=/',
    'HttpOnly',                       // unreadable from JavaScript, so XSS cannot steal it
    'SameSite=Lax',                   // not sent on cross-site POSTs, blunting CSRF
    `Max-Age=${SESSION_DAYS * 24 * 60 * 60}`,
  ];
  if (isHttps(req)) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(req: VercelRequest, res: VercelResponse) {
  const parts = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Max-Age=0'];
  if (isHttps(req)) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function readSessionToken(req: VercelRequest): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === SESSION_COOKIE) return v.join('=') || null;
  }
  return null;
}

export type SessionUser = { id: number; email: string; name: string };

/**
 * Resolve the caller's session, or null. Expired rows are deleted on the way
 * past so the table prunes itself without a scheduled job.
 */
export async function currentUser(req: VercelRequest): Promise<SessionUser | null> {
  const token = readSessionToken(req);
  if (!token) return null;
  const sql = db();
  await sql`delete from app_session where expires_at < now()`;
  const rows = (await sql`
    select u.id, u.email, u.name
    from app_session s
    join app_user u on u.id = s.user_id
    where s.token_hash = ${hashToken(token)} and s.expires_at > now()
    limit 1
  `) as SessionUser[];
  return rows[0] ?? null;
}

export const json = (res: VercelResponse, status: number, body: unknown) =>
  res.status(status).json(body);
