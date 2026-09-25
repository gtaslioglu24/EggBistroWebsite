import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
const ROOT = '/Users/gokay/Desktop/EggBistroWebsite/dist';
const T = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8',
  '.svg':'image/svg+xml', '.webp':'image/webp', '.png':'image/png', '.woff2':'font/woff2',
  '.json':'application/json', '.webmanifest':'application/manifest+json', '.xml':'application/xml', '.txt':'text/plain; charset=utf-8' };
http.createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join(ROOT, normalize(p).replace(/^(\.\.[/\\])+/, ''));
  try { if ((await stat(f)).isDirectory()) f = join(f, 'index.html'); } catch {}
  try {
    let body = await readFile(f);
    // Dev only: stamp asset URLs so the preview pane cannot serve a stale stylesheet.
    if (extname(f) === '.html') {
      const v = Date.now();
      body = Buffer.from(String(body).replace(/(href|src)="(\/(?:style\.css|script\.js))"/g, `$1="$2?v=${v}"`));
    }
    res.writeHead(200, { 'Content-Type': T[extname(f)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(body);
  } catch {
    try {
      const body = await readFile(join(ROOT, '404.html'));
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      res.end(body);
    } catch { res.writeHead(404).end('not found'); }
  }
}).listen(8777, () => console.log('no-cache server on 8777'));
