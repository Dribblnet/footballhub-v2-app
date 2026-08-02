const fs = require('fs');
const path = require('path');

const targetDirs = ['src', 'public', 'footballhub-backend'];
const filesToProcess = [];

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === 'dist' || file === '.git' || file === 'package-lock.json') continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else {
      filesToProcess.push(fullPath);
    }
  }
}

for (const dir of targetDirs) walkDir(path.join(__dirname, dir));

const rootFiles = ['package.json', 'index.html', '.env', 'README.md'];
for (const file of rootFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) filesToProcess.push(fullPath);
}

const terms = [/matchday\s*hub/i, /\bV2\b/];
let out = '';

for (const file of filesToProcess) {
  if (!file.endsWith('.svg') && !file.endsWith('.png') && !file.endsWith('.jpg')) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, i) => {
        let match = false;
        for (const term of terms) {
          if (term.test(line)) {
            match = true;
            break;
          }
        }
        if (match) {
          out += `${file}:${i + 1}: ${line.trim()}\n`;
        }
      });
    } catch (e) {}
  }
}
fs.writeFileSync('matches.txt', out);
