const fs = require('fs');
const path = require('path');

const targetDirs = [
  'src',
  'public',
  'footballhub-backend',
];

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

for (const dir of targetDirs) {
  walkDir(path.join(__dirname, dir));
}

// Add specific root files
const rootFiles = ['package.json', 'index.html', '.env', 'README.md', 'eslint.config.js', 'vite.config.js'];
for (const file of rootFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    filesToProcess.push(fullPath);
  }
}

let modifiedCount = 0;

for (const file of filesToProcess) {
  if (file.endsWith('.svg') || file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.ico')) {
    // Only touch text files
    if (!file.endsWith('.svg')) continue;
  }
  
  let originalContent;
  try {
    originalContent = fs.readFileSync(file, 'utf8');
  } catch (e) {
    continue;
  }
  
  let newContent = originalContent;
  
  // Replacements
  newContent = newContent.replace(/FootballHub/g, 'Dribbl.net');
  newContent = newContent.replace(/Football Hub/g, 'Dribbl.net');
  newContent = newContent.replace(/footballhub/g, 'Dribbl.net');
  
  // also check if "football-hub" exists? User didn't specify, but backend firebase might use it. 
  // "football-hub-5bd9c" is a firebase project ID. The instructions say "Leave technical identifiers only if renaming them would break imports or functionality."
  // Firebase project ID should probably NOT be renamed because it will break the backend connection.
  
  if (newContent !== originalContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated: ${file}`);
    modifiedCount++;
  }
}

console.log(`Replaced in ${modifiedCount} files.`);
