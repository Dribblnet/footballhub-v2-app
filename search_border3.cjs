const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!fullPath.includes('node_modules') && !fullPath.includes('dist') && !fullPath.includes('.git')) {
        results = results.concat(walk(fullPath));
      }
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}
for (const file of walk('.')) {
  if (file === 'search_border.cjs' || file === 'search_border2.cjs' || file === 'search_border3.cjs') continue;
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('border')) {
     const lines = content.split('\n');
     for(let i=0; i<lines.length; i++) {
        const l = lines[i];
        if (l.includes('border') && !l.includes('border:') && !l.includes('border-') && !l.includes('"border"') && !l.includes("'border'") && !l.includes('var(--border)')) {
           console.log(file + ':' + (i+1) + ':' + l.trim());
        }
     }
  }
}
