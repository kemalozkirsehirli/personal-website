import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';
import { startServer } from './serve.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WATCH_DIRS = ['src', 'public'].map((dir) => path.join(ROOT, dir));
let timer = null;
let building = false;

async function runBuild(reason = 'initial') {
  if (building) return;
  building = true;
  try {
    await build();
    console.log(`Build complete (${reason}).`);
  } catch (error) {
    console.error('Build failed:');
    console.error(error);
  } finally {
    building = false;
  }
}

function collectDirectories(dir, output = []) {
  if (!fs.existsSync(dir)) return output;
  output.push(dir);
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) collectDirectories(path.join(dir, entry.name), output);
  }
  return output;
}

function watch() {
  const watched = new Set();
  for (const base of WATCH_DIRS) {
    for (const dir of collectDirectories(base)) {
      if (watched.has(dir)) continue;
      watched.add(dir);
      fs.watch(dir, { persistent: true }, (_event, filename) => {
        if (!filename) return;
        clearTimeout(timer);
        timer = setTimeout(() => runBuild(`changed ${filename}`), 150);
      });
    }
  }
}

await runBuild();
startServer({ directory: 'dist', port: Number(process.env.PORT || 4173) });
watch();
console.log('Watching src/ and public/. Refresh the browser after edits.');
