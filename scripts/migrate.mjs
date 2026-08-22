/**
 * Applies db/schema.sql. Every statement in it is written to be idempotent
 * (create ... if not exists / add column if not exists), so this is safe to
 * re-run against a live database.
 *
 *   node scripts/migrate.mjs
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { neon } from '@neondatabase/serverless';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

// Minimal .env reader so this works without adding a dotenv dependency.
for (const line of readFileSync(join(root, '.env'), 'utf8').split('\n')) {
  const m = /^([A-Z_]+)=(.*)$/.exec(line.trim());
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const sql = neon(url);
const text = readFileSync(join(root, 'db', 'schema.sql'), 'utf8')
  .replace(/^\s*--.*$/gm, ''); // strip comment-only lines

const statements = text.split(';').map((s) => s.trim()).filter(Boolean);

let applied = 0;
for (const statement of statements) {
  try {
    await sql.query(statement);
    applied += 1;
  } catch (err) {
    console.error(`\nfailed: ${statement.slice(0, 90)}…\n  ${err.message}`);
    process.exit(1);
  }
}
console.log(`applied ${applied} statements`);
