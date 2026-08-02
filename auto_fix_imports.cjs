const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function findFileByName(startDir, fileName) {
    let result = null;
    const files = fs.readdirSync(startDir);
    for (const file of files) {
        const fullPath = path.join(startDir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
            result = findFileByName(fullPath, fileName);
            if (result) return result;
        } else if (file === fileName || file === fileName + '.jsx' || file === fileName + '.js' || file === fileName + '.tsx' || file === fileName + '.ts') {
            return fullPath;
        }
    }
    return result;
}

async function fixImports() {
    let hasErrors = true;
    let iterations = 0;
    while (hasErrors && iterations < 10) {
        iterations++;
        hasErrors = false;
        try {
            console.log(`Running build (iteration ${iterations})...`);
            execSync('npm run build', { stdio: 'pipe' });
            console.log('Build succeeded. All imports resolved.');
            break;
        } catch (error) {
            hasErrors = true;
            const output = error.stderr ? error.stderr.toString() : (error.stdout ? error.stdout.toString() : error.message);
            
            // Parse [UNRESOLVED_IMPORT] errors
            const lines = output.split('\n');
            const fixes = [];
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                if (line.includes('[UNRESOLVED_IMPORT]')) {
                    // [UNRESOLVED_IMPORT] Error: Could not resolve '../../components/VerifiedBadge' in src/features/auth/components/settings/tablet/SettingsTablet.jsx
                    const match = line.match(/Could not resolve '([^']+)' in ([^\s]+)/);
                    if (match) {
                        const brokenImportPath = match[1];
                        const sourceFile = match[2].trim();
                        
                        const importName = brokenImportPath.split('/').pop();
                        console.log(`Missing import: ${importName} in ${sourceFile}`);
                        
                        const resolvedPath = findFileByName('src', importName);
                        if (resolvedPath) {
                            const sourceDir = path.dirname(path.resolve(sourceFile));
                            let relativePath = path.relative(sourceDir, resolvedPath).replace(/\\/g, '/');
                            if (!relativePath.startsWith('.')) {
                                relativePath = './' + relativePath;
                            }
                            // Strip extension
                            relativePath = relativePath.replace(/\.(jsx|js|tsx|ts)$/, '');
                            
                            fixes.push({
                                file: sourceFile,
                                oldPath: brokenImportPath,
                                newPath: relativePath
                            });
                        } else {
                            console.log(`COULD NOT FIND FILE FOR: ${importName}`);
                        }
                    }
                }
            }
            
            if (fixes.length === 0) {
                console.log('Build failed for reasons other than unresolved imports or could not find targets.');
                console.log(output.substring(0, 2000));
                break;
            }
            
            // Apply fixes
            let filesUpdated = new Set();
            for (const fix of fixes) {
                if (filesUpdated.has(fix.file)) continue; // One fix per file per iteration to avoid conflict
                filesUpdated.add(fix.file);
                
                let content = fs.readFileSync(fix.file, 'utf8');
                // Regex to find import statement
                // Ex: import VerifiedBadge from "../../components/VerifiedBadge";
                const regex = new RegExp(`from\\s+['"]${fix.oldPath}['"]`, 'g');
                if (content.match(regex)) {
                    content = content.replace(regex, `from "${fix.newPath}"`);
                    fs.writeFileSync(fix.file, content);
                    console.log(`Fixed import in ${fix.file}: ${fix.oldPath} -> ${fix.newPath}`);
                }
            }
        }
    }
}

fixImports().catch(console.error);
