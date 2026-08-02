const fs = require('fs');
const path = require('path');

// 1. ProfileMenu
const profileMenuPath = path.join(__dirname, 'src/components/layout/ProfileMenu.jsx');
let pmContent = fs.readFileSync(profileMenuPath, 'utf-8');
if (!pmContent.includes('BrandLogo')) {
  pmContent = pmContent.replace(
    'import { User, Activity, Users, Settings, Bell, LogOut } from "lucide-react";',
    'import { User, Activity, Users, Settings, Bell, LogOut } from "lucide-react";\nimport BrandLogo from "../BrandLogo";'
  );
  pmContent = pmContent.replace(
    '<div style={{ padding: "8px" }}>',
    '<div style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "center" }}><BrandLogo size="small" /></div>\n      <div style={{ padding: "8px" }}>'
  );
  fs.writeFileSync(profileMenuPath, pmContent);
}

// 2. NotificationPanel Desktop/Tablet/Mobile
const notifDirs = ['desktop', 'tablet', 'mobile'];
notifDirs.forEach(dir => {
  const notifName = `NotificationPanel${dir.charAt(0).toUpperCase() + dir.slice(1)}.jsx`;
  const p = path.join(__dirname, `src/components/layout/notifications/${dir}/${notifName}`);
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    if (!content.includes('BrandLogo')) {
      content = content.replace(
        'import { Bell, BellOff } from "lucide-react";',
        'import { Bell, BellOff } from "lucide-react";\nimport BrandLogo from "../../../BrandLogo";'
      );
      content = content.replace(
        '<h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>',
        '<h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>\n          <BrandLogo size="small" style={{ height: "20px" }} clickable={false} /> '
      );
      fs.writeFileSync(p, content);
    }
  }
});
