#!/usr/bin/env node
/**
 * Create (or update) an app account.
 *
 *   DATABASE_URL='postgres://...' node scripts/create-user.mjs alex@meridian.co "Alex Morgan"
 *
 * The password is prompted for rather than passed as an argument, so it never
 * lands in your shell history or the process list.
 *
 * There is intentionally no public signup endpoint: accounts are made here.
 */
import { createInterface } from 'node:readline';
import { randomBytes, scrypt as scryptCb } from 'node:crypto';
import { promisify } from 'node:util';
import { neon } from '@neondatabase/serverless';

const scrypt = promisify(scryptCb);

// Must stay in step with api/_lib/auth.ts. The hash carries its own parameters,
// so raising these later will not invalidate existing passwords.
const SCRYPT = { N: 16384, r: 8, p: 1 };
const KEY_LEN = 64;

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN, SCRYPT);
  return `scrypt$${SCRYPT.N}$${SCRYPT.r}$${SCRYPT.p}$${salt.toString('hex')}$${key.toString('hex')}`;
}

function prompt(question, muted = false) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (muted) {
      // readline's own hook: echo a star per keystroke instead of the character.
      rl._writeToOutput = function (str) {
        if (str.includes(question)) this.output.write(str);
        else this.output.write('*');
      };
    }
    rl.question(question, (answer) => {
      rl.close();
      // The masked characters left the cursor mid-line.
      if (muted) process.stdout.write('\n');
      resolve(answer);
    });
  });
}

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL is not set.');
  process.exit(1);
}

const [emailArg, nameArg] = process.argv.slice(2);
const email = (emailArg ?? (await prompt('Email: '))).trim().toLowerCase();
const name = (nameArg ?? (await prompt('Name: '))).trim();

if (!email || !name) {
  console.error('Email and name are required.');
  process.exit(1);
}

const password = await prompt('Password: ', true);
if (password.length < 12) {
  console.error('Password must be at least 12 characters.');
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);
await sql`
  insert into app_user (email, name, password_hash)
  values (${email}, ${name}, ${await hashPassword(password)})
  on conflict (email) do update
    set name = excluded.name, password_hash = excluded.password_hash
`;

// Any existing sessions were issued against the old password.
await sql`
  delete from app_session
  where user_id = (select id from app_user where email = ${email})
`;

console.log(`Account ready: ${email}`);
console.log('Existing sessions for this account were revoked.');
