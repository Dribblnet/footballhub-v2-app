const babel = require('@babel/core');
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
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      results.push(fullPath);
    }
  }
  return results;
}

const files = walk('./src');
let found = false;

for (const file of files) {
  const code = fs.readFileSync(file, 'utf8');
  try {
    const ast = babel.parseSync(code, {
      filename: file,
      presets: ['@babel/preset-react'],
      sourceType: 'module'
    });

    babel.traverse(ast, {
      Identifier(path) {
        if (path.node.name === 'border') {
          // If it's a property key and shorthand is true
          if (path.parentPath.isObjectProperty() && path.parentPath.node.shorthand) {
             console.log(`[SHORTHAND FOUND] ${file}:${path.node.loc.start.line} -> { border }`);
             found = true;
          }
          // If it's a Reference (variable usage) that is NOT a property key
          else if (path.isReferencedIdentifier()) {
             console.log(`[REFERENCE FOUND] ${file}:${path.node.loc.start.line} -> border`);
             found = true;
          }
        }
      }
    });
  } catch (e) {
    console.error(`Error parsing ${file}:`, e.message);
  }
}

if (!found) {
  console.log("No usage of 'border' as a variable found in AST.");
}
