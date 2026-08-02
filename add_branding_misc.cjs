const fs = require('fs');
const path = require('path');

const dirs = ['desktop', 'tablet', 'mobile'];
dirs.forEach(dir => {
  const p = path.join(__dirname, `src/features/marketplace/components/messages/${dir}/Messages${dir.charAt(0).toUpperCase() + dir.slice(1)}.jsx`);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    if (!content.includes('BrandLogo')) {
      content = content.replace(
        'import ProfilePreviewModal from',
        'import BrandLogo from "../../../../../components/BrandLogo";\nimport ProfilePreviewModal from'
      );
      // Let's replace the empty state icon with BrandLogo if they are using a MessageSquare or something
      const emptyStateRegex = /<MessageSquare size=\{[46][84]\}\s*color="[^"]*"\s*style=\{\{ opacity: 0\.5, marginBottom: "[^"]*" \}\}\s*\/>/;
      if (emptyStateRegex.test(content)) {
        content = content.replace(emptyStateRegex, '<BrandLogo size="medium" style={{ opacity: 0.5, marginBottom: "15px", filter: "grayscale(100%)" }} clickable={false} />');
      }

      fs.writeFileSync(p, content);
    }
  }
});

// Settings & Profile
const profileMobile = path.join(__dirname, 'src/features/teams/components/mobile/PlayerProfileMobile.jsx');
const settingsMobile = path.join(__dirname, 'src/features/auth/components/settings/mobile/SettingsMobile.jsx');

// For Profile, let's inject it into the header
if (fs.existsSync(profileMobile)) {
  let content = fs.readFileSync(profileMobile, 'utf-8');
  if (!content.includes('BrandLogo')) {
    content = content.replace('import ResponsiveProfileHeader', 'import BrandLogo from "../../../../components/BrandLogo";\nimport ResponsiveProfileHeader');
    content = content.replace(
      '<h2 style={{ margin: 0, flex: 1, fontSize: "20px" }}>Player Profile</h2>',
      '<h2 style={{ margin: 0, flex: 1, fontSize: "20px" }}>Player Profile</h2>\n        <BrandLogo size="small" style={{ height: "24px" }} clickable={false} />'
    );
    fs.writeFileSync(profileMobile, content);
  }
}

if (fs.existsSync(settingsMobile)) {
  let content = fs.readFileSync(settingsMobile, 'utf-8');
  if (!content.includes('BrandLogo')) {
    content = content.replace('import CountrySelector', 'import BrandLogo from "../../../../../components/BrandLogo";\nimport CountrySelector');
    content = content.replace(
      '<h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Settings</h2>',
      '<h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Settings</h2>\n        <BrandLogo size="small" style={{ height: "24px" }} clickable={false} />'
    );
    fs.writeFileSync(settingsMobile, content);
  }
}

