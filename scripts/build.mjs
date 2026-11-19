import { build } from 'esbuild';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { validateCv } from './validate.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const [source, styles, clientScript] = await Promise.all([
  readFile(path.join(root, 'data/cv.json'), 'utf8'),
  readFile(path.join(root, 'src/styles.css'), 'utf8'),
  readFile(path.join(root, 'src/client.js'), 'utf8'),
]);
const data = JSON.parse(source);
validateCv(data);
await mkdir(path.join(root, '.build'), { recursive: true });
await build({
  entryPoints: [path.join(root, 'scripts/render.jsx')],
  outfile: path.join(root, '.build/render.mjs'),
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  jsx: 'automatic',
  logLevel: 'warning',
});
const { render } = await import(pathToFileURL(path.join(root, '.build/render.mjs')).href);
const output = render({ data, styles, clientScript });
await mkdir(path.join(root, 'docs'), { recursive: true });
await writeFile(path.join(root, 'docs/index.html'), output, 'utf8');
console.log(`Built docs/index.html (${Buffer.byteLength(output)} bytes) from data/cv.json`);
