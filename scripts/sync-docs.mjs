import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DOCS = path.join(ROOT, 'docs');

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  for (const entry of await fs.readdir(src, { withFileTypes: true })) {
    const source = path.join(src, entry.name);
    const target = path.join(dest, entry.name);
    if (entry.isDirectory()) await copyDir(source, target);
    else if (entry.isFile()) await fs.copyFile(source, target);
  }
}

export async function syncDocs() {
  await fs.rm(DOCS, { recursive: true, force: true });
  await copyDir(DIST, DOCS);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncDocs()
    .then(() => console.log('Synced dist/ to docs/.'))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
