#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
    else if (e.isFile() && full.endsWith('.js')) fixFile(full);
  }
}

function fixFile(filePath) {
  let src = fs.readFileSync(filePath, 'utf8');
  src = src.replace(/(from\s+['"])(\.\/|\.\.\/[^'"\n]*?)(['"])/g, (m, p1, p2, p3) => {
    const imp = p2;
    if (/\.[a-z0-9]+$/i.test(imp) || imp.endsWith('/')) return m;
    return p1 + imp + '.js' + p3;
  });
  src = src.replace(/(import\(\s*['"])(\.\/|\.\.\/[^'"\n]*?)(['"]\s*\))/g, (m, p1, p2, p3) => {
    const imp = p2;
    if (/\.[a-z0-9]+$/i.test(imp) || imp.endsWith('/')) return m;
    return p1 + imp + '.js' + p3;
  });
  fs.writeFileSync(filePath, src, 'utf8');
}

const dist = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(dist)) {
  console.error('dist directory not found, run tsc first');
  process.exit(1);
}
walk(dist);
console.log('Fixed relative import extensions in dist');
