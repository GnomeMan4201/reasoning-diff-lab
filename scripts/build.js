import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('.', import.meta.url).pathname, '..');
const dist = path.join(root, 'dist');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name), d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist, { recursive: true });
copyDir(path.join(root, 'src'), path.join(dist, 'src'));
copyDir(path.join(root, 'fixtures'), path.join(dist, 'fixtures'));
for (const f of ['index.html', 'app.js', 'styles.css']) {
  fs.copyFileSync(path.join(root, 'web', f), path.join(dist, f));
}
console.log(`Built static site into ${dist}`);
