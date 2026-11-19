import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const port = Number(process.env.PORT || 4173);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid PORT');
const server = createServer(async (request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (!['/', '/cv/', '/cv/index.html', '/index.html'].includes(pathname) || request.method !== 'GET') {
    response.writeHead(404).end('Not found');
    return;
  }
  try {
    const html = await readFile(new URL('../docs/index.html', import.meta.url));
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }).end(html);
  } catch {
    response.writeHead(503).end('Build the CV with npm run build first.');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`CV preview: http://127.0.0.1:${port}`));
