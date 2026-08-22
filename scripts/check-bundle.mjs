/**
 * Fails the build if workspace content reached the public bundle.
 *
 *   node scripts/check-bundle.mjs
 *
 * Nothing in api/_data may be imported from src/. That rule is invisible in
 * review — a stray `import { MEMBERS } from './data'` still compiles, still
 * renders, and quietly serves the whole workspace to anyone who loads the
 * login page. Static analysis cannot tell content that may ship from content
 * that may not, but these strings can: they exist only in the sample content,
 * so finding one in dist/ means the boundary broke.
 *
 * Replacing the sample content means replacing these. Pick strings that are
 * distinctive and that no dependency would ever contain.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const SENTINELS = [
  'Alex Morgan',
  'Sarah Kim',
  'Daniel Ross',
  'Emma Clarke',
  'Raj Patel',
  'Northwind',
  'Meridian',
  'Maximilianstra', // Maximilianstraße, matched short of the ß to dodge encoding
];

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

let files;
try {
  files = walk(dist);
} catch {
  console.error('dist/ not found — run the build first.');
  process.exit(1);
}

const hits = [];
for (const file of files) {
  const text = readFileSync(file, 'latin1');
  for (const needle of SENTINELS) {
    if (text.includes(needle)) hits.push(`${relative(root, file)}: ${needle}`);
  }
}

if (hits.length > 0) {
  console.error('\nWorkspace content is in the public bundle:\n');
  for (const hit of hits) console.error(`  ${hit}`);
  console.error(
    '\nSomething under src/ is importing content that belongs in api/_data.'
    + '\nThe fix is to read it through useWorkspace(), not to widen this check.\n',
  );
  process.exit(1);
}

console.log(`bundle clean — ${files.length} files, none containing workspace content`);
