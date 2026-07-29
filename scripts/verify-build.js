import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const publicDirectory = path.join(root, 'public');
const indexFile = path.join(publicDirectory, 'index.html');

function fail(message) {
  console.error(`Build verification failed: ${message}`);
  process.exit(1);
}

if (!existsSync(indexFile)) fail('public/index.html does not exist.');

const html = readFileSync(indexFile, 'utf8');
if (/\/(?:src)\//i.test(html)) {
  fail('index.html still references development source files under /src/.');
}

const references = [...html.matchAll(/(?:src|href)=["'](\/assets\/[^"'#?]+)(?:[?#][^"']*)?["']/g)]
  .map((match) => match[1]);

if (references.length === 0) fail('index.html contains no built /assets references.');

for (const reference of references) {
  const localPath = path.join(publicDirectory, ...reference.split('/').filter(Boolean));
  if (!existsSync(localPath) || !statSync(localPath).isFile()) {
    fail(`index.html references a missing file: ${reference}`);
  }
}

console.log(`Build verified: ${references.length} referenced asset(s) exist.`);
