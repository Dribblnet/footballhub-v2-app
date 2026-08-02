const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('dist')) {
        results = results.concat(walk(fullPath));
      }
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      results.push(fullPath);
    }
  }
  return results;
}
for (const file of walk('src')) {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/\bborder\b/.test(line)) {
      if (!/border:/.test(line) && !/border-/.test(line) && !/['"]border['"]/.test(line) && !/border[A-Z]/.test(line) && !/var\(--border\)/.test(line)) {
         console.log(file + ':' + (i+1) + ':' + line.trim());
      }
    }
  }
}
