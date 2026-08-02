const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixImports(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixImports(fullPath);
    } else if (file.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let modified = false;

      // Remove unused import from Controller files
      if (file === 'AuthPage.jsx' || file === 'Settings.jsx') {
        const lines = content.split('\n');
        const newLines = lines.filter(l => !l.includes('import CountrySelector'));
        if (lines.length !== newLines.length) {
          content = newLines.join('\n');
          modified = true;
        }
      }

      // Fix import in AuthPage components
      if (['AuthPageMobile.jsx', 'AuthPageTablet.jsx', 'AuthPageDesktop.jsx'].includes(file)) {
        content = content.replace(/import CountrySelector from ".*?";/, 'import CountrySelector from "../settings/CountrySelector";');
        modified = true;
      }
      
      // Fix import in Settings components
      if (['SettingsMobile.jsx', 'SettingsTablet.jsx', 'SettingsDesktop.jsx'].includes(file)) {
        content = content.replace(/import CountrySelector from ".*?";/, 'import CountrySelector from "../../CountrySelector";');
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Fixed", fullPath);
      }
    }
  }
}

fixImports(srcDir);
