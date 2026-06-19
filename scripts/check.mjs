import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from './build.mjs';
import { runPrivacyAudit } from './privacy-check.mjs';
import { syncDocs } from './sync-docs.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await listFiles(full, out);
    else out.push(full);
  }
  return out;
}

function cleanBasePath(basePath = '') {
  if (!basePath || basePath === '/') return '';
  const withSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withSlash.replace(/\/+$/, '');
}

function htmlAttributeValues(html) {
  const values = [];
  const pattern = /\s(?:href|src)="([^"]+)"/g;
  let match;
  while ((match = pattern.exec(html))) values.push(match[1]);
  return values;
}

function decodeEntity(value) {
  return value.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function localTargetFromUrl(url, basePath) {
  const clean = decodeEntity(url).split('#')[0].split('?')[0];
  if (!clean || clean.startsWith('#')) return null;
  if (/^(https?:)?\/\//.test(clean) || /^(mailto|tel|data):/.test(clean)) return null;

  let pathname = clean;
  if (basePath && pathname === basePath) pathname = '/';
  if (basePath && pathname.startsWith(`${basePath}/`)) pathname = pathname.slice(basePath.length);
  if (!pathname.startsWith('/')) return null;
  return pathname;
}

async function pathExistsForUrl(pathname) {
  let target = path.join(DIST, decodeURIComponent(pathname));
  if (pathname.endsWith('/')) target = path.join(target, 'index.html');
  if (await exists(target)) return true;
  if (!path.extname(target) && await exists(path.join(target, 'index.html'))) return true;
  return false;
}

const result = await build();
const basePath = cleanBasePath(result.site.basePath || '');
const failures = [];

const required = [
  'index.html',
  'about/index.html',
  'group/index.html',
  'essays/index.html',
  'projects/index.html',
  'cv/index.html',
  'photos/index.html',
  '404.html',
  'sitemap.xml',
  'feed.xml',
  'assets/main.css',
  'assets/main.js'
];

for (const file of required) {
  if (!(await exists(path.join(DIST, file)))) failures.push(`Missing required output: ${file}`);
}

const htmlFiles = (await listFiles(DIST)).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  for (const url of htmlAttributeValues(html)) {
    const pathname = localTargetFromUrl(url, basePath);
    if (!pathname) continue;
    if (!(await pathExistsForUrl(pathname))) {
      failures.push(`${path.relative(DIST, file)} links to missing local path: ${url}`);
    }
  }
}

if (failures.length) {
  console.error('Check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

try {
  const sourceAudit = await runPrivacyAudit({ roots: ['src', 'public', 'dist'] });
  await syncDocs();
  const docsAudit = await runPrivacyAudit({ roots: ['docs'] });
  console.log(`Privacy check passed. Audited ${sourceAudit.filesChecked + docsAudit.filesChecked} website files.`);
} catch (error) {
  console.error(error.message || error);
  process.exit(1);
}

console.log(`Check passed. Generated ${htmlFiles.length} HTML files in dist/ and synced docs/.`);
