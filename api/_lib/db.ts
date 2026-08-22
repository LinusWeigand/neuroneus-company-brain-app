import { neon } from '@neondatabase/serverless';

/**
 * Neon connection, created per invocation. The serverless driver speaks HTTP
 * rather than holding a TCP pool, so there is no connection to leak when the
 * function is frozen or discarded between requests.
 */
export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  return neon(url);
}
