import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CONTENT_ROOTS = ['src', 'public', 'dist', 'docs'];
const TEXT_EXTENSIONS = new Set([
  '.html', '.css', '.js', '.mjs', '.json', '.md', '.txt', '.xml', '.svg',
  '.yaml', '.yml', '.toml', '.cff', '.webmanifest'
]);
const FORBIDDEN_PUBLIC_EXTENSIONS = new Set([
  '.pdf', '.zip', '.pem', '.key', '.p12', '.pfx', '.sqlite', '.db'
]);
const FORBIDDEN_PATH_PATTERNS = [
  /(^|[\/._-])owner([\/._-]|$)/i,
  /private[_-]?master/i,
  /private[_-]?access/i,
  /anonymous[_-]?review/i,
  /owner[_-]?union/i,
  /owner[_-]?only/i,
  /private[_-]?key/i,
  /payload[_-]?key/i,
  /ed25519[_-]?private/i,
];
const FORBIDDEN_TEXT_PATTERNS = [
  { label: 'private-key material', regex: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i },
  { label: 'owner-only marker', regex: /\bOWNER[_ -]?ONLY\b/i },
  { label: 'owner-union marker', regex: /\bOWNER[_ -]?UNION\b/i },
  { label: 'private-master marker', regex: /\bPRIVATE[_ -]?MASTER\b/i },
  { label: 'anonymous-review marker', regex: /\bANONYMOUS[_ -]?REVIEW\b/i },
  { label: 'controlled-internal marker', regex: /\bcontrolled internal material\b/i },
  { label: 'red-hold marker', regex: /\bRED HOLD\b/i },
  { label: 'owner archive reference', regex: /\bOwner\.zip\b/i },
  { label: 'owner key filename', regex: /VeriQSM_QSMBench_OWNER_ONLY_(?:ED25519_PRIVATE_KEY|PRIVATE_PAYLOAD_KEY)/i },
  { label: 'internal proposal title', regex: /FINAL CORE-CONFERENCE PUBLICATION PLAN/i },
  { label: 'internal venue lock', regex: /Locked core venue set/i },
  { label: 'local owner path', regex: /\/mnt\/data\/(?:_owner_unpack|Owner)/i },
  { label: 'local user path', regex: /\/Users\/kemalozkirsehirli\//i },
  { label: 'phone number', regex: /(?:\+?1[ .-]?)?917[ .-]?609[ .-]?8156/i },
];

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dir, out = []) {
  if (!(await exists(dir))) return out;
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await listFiles(full, out);
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

function relative(file) {
  return path.relative(ROOT, file).replaceAll(path.sep, '/');
}

export async function runPrivacyAudit({ roots = CONTENT_ROOTS } = {}) {
  const failures = [];
  const files = [];
  for (const rootName of roots) {
    files.push(...await listFiles(path.join(ROOT, rootName)));
  }

  for (const file of files) {
    const rel = relative(file);
    const lowerRel = rel.toLowerCase();
    const ext = path.extname(file).toLowerCase();

    if (FORBIDDEN_PATH_PATTERNS.some((pattern) => pattern.test(rel))) {
      failures.push(`${rel}: owner/private path marker is forbidden in the website repository`);
    }

    if ((lowerRel.startsWith('public/') || lowerRel.startsWith('dist/') || lowerRel.startsWith('docs/'))
        && FORBIDDEN_PUBLIC_EXTENSIONS.has(ext)) {
      failures.push(`${rel}: ${ext} files are forbidden in published website trees`);
    }

    if (!TEXT_EXTENSIONS.has(ext) && path.basename(file) !== 'CNAME') continue;
    const text = await fs.readFile(file, 'utf8');
    for (const item of FORBIDDEN_TEXT_PATTERNS) {
      if (item.regex.test(text)) failures.push(`${rel}: contains forbidden ${item.label}`);
    }

    if (/\b(?:href|src)=["'](?:file:|\/\/localhost|http:\/\/localhost)/i.test(text)) {
      failures.push(`${rel}: contains a local-only published link`);
    }
  }

  const sitePath = path.join(ROOT, 'src', 'data', 'site.json');
  if (await exists(sitePath)) {
    const site = JSON.parse(await fs.readFile(sitePath, 'utf8'));
    if (site.resumePdf !== null && site.resumePdf !== undefined && site.resumePdf !== '') {
      failures.push('src/data/site.json: resumePdf must remain null; no downloadable résumé PDF may be published');
    }
  }

  if (failures.length) {
    const error = new Error(`Public-content privacy audit failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
    error.failures = failures;
    throw error;
  }

  return { filesChecked: files.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runPrivacyAudit()
    .then(({ filesChecked }) => console.log(`Privacy check passed. Audited ${filesChecked} website files.`))
    .catch((error) => {
      console.error(error.message || error);
      process.exit(1);
    });
}
