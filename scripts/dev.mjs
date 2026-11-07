import { spawn } from 'node:child_process';

const build = spawn(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
build.on('error', (error) => {
  console.error('Unable to start the portfolio build:', error);
  process.exitCode = 1;
});
build.on('exit', (code) => {
  if (code !== 0) {
    process.exitCode = code ?? 1;
    return;
  }

  const server = spawn(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
const root = process.cwd();
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml' };
createServer((request, response) => {
  let pathname;
  try { pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname); }
  catch { response.writeHead(400).end('Bad request'); return; }
  const file = resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + sep)) { response.writeHead(403).end('Forbidden'); return; }
  try {
    const target = statSync(file).isDirectory() ? resolve(file, 'index.html') : file;
    response.writeHead(200, { 'Content-Type': types[extname(target)] ?? 'application/octet-stream' });
    createReadStream(target).pipe(response);
  } catch (error) {
    if (error.code === 'ENOENT') { response.writeHead(404).end('Not found'); return; }
    console.error(error);
    response.writeHead(500).end('Server error');
  }
}).listen(4173, () => console.log('Portfolio ready at http://localhost:4173'));`,
    ],
    { stdio: 'inherit' },
  );
  server.on('error', (error) => {
    console.error('Unable to start the portfolio server:', error);
    process.exitCode = 1;
  });
});
