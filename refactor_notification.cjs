const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'src/components/layout/NotificationPanel.jsx');
let content = fs.readFileSync(profilePath, 'utf8');

const returnMatch = content.match(/  return \(\r?\n    <div style=\{containerStyle\}>/);
if (!returnMatch) {
  console.log("Could not find return statement");
  process.exit(1);
}
const returnIndex = returnMatch.index;

const beforeReturn = content.substring(0, returnIndex);
const jsxContent = content.substring(returnIndex);

const propsList = [
  "isOpen", "notifications", "markAllRead", "clearAll",
  "notificationsEnabled", "setNotificationsEnabled", "isMobile", "containerStyle"
];

const propsDestructuring = `  const {
${propsList.map(p => `    ${p},`).join('\n')}
  } = props;`;

const componentTemplate = (name) => `import React from "react";
import { Bell, BellOff } from "lucide-react";

export default function ${name}(props) {
${propsDestructuring}

${jsxContent}`;

const componentsDir = path.join(__dirname, 'src/components/layout/notifications');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
const mobileDir = path.join(componentsDir, 'mobile');
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir);
const tabletDir = path.join(componentsDir, 'tablet');
if (!fs.existsSync(tabletDir)) fs.mkdirSync(tabletDir);
const desktopDir = path.join(componentsDir, 'desktop');
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir);

fs.writeFileSync(path.join(mobileDir, 'NotificationPanelMobile.jsx'), componentTemplate('NotificationPanelMobile'));
fs.writeFileSync(path.join(tabletDir, 'NotificationPanelTablet.jsx'), componentTemplate('NotificationPanelTablet'));
fs.writeFileSync(path.join(desktopDir, 'NotificationPanelDesktop.jsx'), componentTemplate('NotificationPanelDesktop'));

const controllerPropsObject = `  const controllerProps = {
${propsList.map(p => `    ${p}`).join(',\n')}
  };`;

const newReturn = `
${controllerPropsObject}

  return (
    <ResponsiveView
      mobile={<NotificationPanelMobile {...controllerProps} />}
      tablet={<NotificationPanelTablet {...controllerProps} />}
      desktop={<NotificationPanelDesktop {...controllerProps} />}
    />
  );
}
`;

let newContent = beforeReturn + newReturn;

const importsToAdd = `import ResponsiveView from "./ResponsiveView";
import NotificationPanelMobile from "./notifications/mobile/NotificationPanelMobile";
import NotificationPanelTablet from "./notifications/tablet/NotificationPanelTablet";
import NotificationPanelDesktop from "./notifications/desktop/NotificationPanelDesktop";
`;
const lastImportIndex = newContent.lastIndexOf('import ');
const nextLineIndex = newContent.indexOf('\\n', lastImportIndex);
newContent = newContent.substring(0, nextLineIndex + 1) + importsToAdd + newContent.substring(nextLineIndex + 1);

fs.writeFileSync(profilePath, newContent);
console.log("Refactored NotificationPanel.jsx");
