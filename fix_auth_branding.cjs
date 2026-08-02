const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/features/auth/components');
const files = [
  'desktop/AuthPageDesktop.jsx',
  'mobile/AuthPageMobile.jsx',
  'tablet/AuthPageTablet.jsx'
];

files.forEach(file => {
  const fullPath = path.join(dir, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf-8');
  let changed = false;

  if (content.includes('import Logo from "../../../../components/Logo";')) {
    content = content.replace(
      'import Logo from "../../../../components/Logo";', 
      'import BrandLogo from "../../../../components/BrandLogo";'
    );
    changed = true;
  }

  // Replace <Logo ... /> with <BrandLogo size="hero" ... />
  // We'll use regex for this
  const logoRegex = /<Logo\s+size="[^"]*"\s+style=\{\{\s*filter:\s*"[^"]*"\s*\}\}\s*\/>/g;
  if (logoRegex.test(content)) {
    content = content.replace(
      logoRegex,
      '<BrandLogo size="hero" style={{ filter: "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3))" }} clickable={false} />'
    );
    changed = true;
  }

  // Check if Dribbl.net text is there, the user mentioned it's fine as long as the logo is the official one, but let's check what the plan was.
  // "Replace the plain text Dribbl.net and simple icons with a centered, prominent BrandLogo size='hero'."
  // It's already there! We just replaced Logo with BrandLogo size="hero".

  if (changed) {
    fs.writeFileSync(fullPath, content);
    console.log('Fixed auth branding in', file);
  }
});
