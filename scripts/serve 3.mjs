import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.webmanifest': 'application/manifest+json; charset=utf-8'
};

async function fileExists(file) {
  try {
    const stat = await fs.stat(file);
    return stat.isFile();
  } catch {
    return false;
  }
}

function safeJoin(root, requestPath) {
  const decoded = decodeURIComponent(requestPath.split('?')[0].split('#')[0]);
  const normalized = path.normalize(decoded).replace(/^(\.\.[/\\])+/, '');
  const joined = path.join(root, normalized);
  if (!joined.startsWith(root)) return null;
  return joined;
}

export function startServer({ directory = 'dist', port = 4173 } = {}) {
  const root = path.resolve(ROOT, directory);
  const server = http.createServer(async (req, res) => {
    try {
      const requestUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
      let filePath = safeJoin(root, requestUrl.pathname);
      if (!filePath) {
        res.writeHead(403).end('Forbidden');
        return;
      }

      try {
        const stat = await fs.stat(filePath);
        if (stat.isDirectory()) filePath = path.join(filePath, 'index.html');
      } catch {
        if (!path.extname(filePath)) filePath = path.join(filePath, 'index.html');
      }

      if (!(await fileExists(filePath))) {
        const notFound = path.join(root, '404.html');
        if (await fileExists(notFound)) {
          const body = await fs.readFile(notFound);
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(body);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Not found');
        }
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const body = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(body);
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(error instanceof Error ? error.message : 'Server error');
    }
  });

  server.listen(port, () => {
    console.log(`Serving ${path.relative(ROOT, root) || '.'} at http://localhost:${port}`);
  });

  return server;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const directory = process.argv[2] || 'dist';
  const port = Number(process.argv[3] || 4173);
  startServer({ directory, port });
}
