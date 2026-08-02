const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  if (content.includes('../../../../components/')) {
    content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/components\//g, '../../../../../components/');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Fixed imports in', filePath);
  }
}

const dirs = ['desktop', 'mobile', 'tablet'];
dirs.forEach(d => {
  replaceInFile(path.join(__dirname, `src/features/marketplace/components/messages/${d}/Messages${d.charAt(0).toUpperCase() + d.slice(1)}.jsx`));
});
