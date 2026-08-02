const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;

  // Reduce large padding
  const paddingMap = {
    'padding: "30px"': 'padding: "15px"',
    'padding: "25px"': 'padding: "15px"',
    'padding: "20px"': 'padding: "12px"',
    'padding: "20px 10px"': 'padding: "10px 5px"',
  };

  // Reduce large gaps
  const gapMap = {
    'gap: "30px"': 'gap: "15px"',
    'gap: "25px"': 'gap: "15px"',
    'gap: "20px"': 'gap: "12px"',
  };

  for (const [key, value] of Object.entries(paddingMap)) {
    if (content.includes(key)) {
      content = content.split(key).join(value);
      changed = true;
    }
  }

  for (const [key, value] of Object.entries(gapMap)) {
    if (content.includes(key)) {
      content = content.split(key).join(value);
      changed = true;
    }
  }

  // Ensure root elements have overflowX hidden, but this is harder to do safely without parsing AST.
  // We'll rely on the manual fixes and this broad stroke for padding/gaps.

  if (changed) {
    fs.writeFileSync(filePath, content);
    console.log('Reduced padding/gaps in', filePath);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else {
      if (fullPath.endsWith('Mobile.jsx')) {
        replaceInFile(fullPath);
      }
    }
  });
}

walkDir(path.join(__dirname, 'src/features'));
