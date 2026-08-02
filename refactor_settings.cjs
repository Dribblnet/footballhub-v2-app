const fs = require('fs');
const path = require('path');

const settingsPath = path.join(__dirname, 'src/features/auth/Settings.jsx');
let content = fs.readFileSync(settingsPath, 'utf8');

const returnMatch = content.match(/  return \(\r?\n    <div className="animate-fade-in"/);
if (!returnMatch) {
  console.log("Could not find return statement");
  process.exit(1);
}
const returnIndex = returnMatch.index;

const beforeReturn = content.substring(0, returnIndex);
const jsxContent = content.substring(returnIndex);

const propsList = [
  "user", "updateUser", "updatePlayerIdentity", "getPlayerByPhone", "getPlayerByEmail",
  "players", "navigate", "toast", "fullPlayer", "linkModal", "setLinkModal",
  "linkInput", "setLinkInput", "linkCountryCode", "setLinkCountryCode", "handleLinkAccount"
];

const propsDestructuring = `  const {
${propsList.map(p => `    ${p},`).join('\n')}
  } = props;`;

const componentTemplate = (name) => `import React from "react";
import { ArrowLeft, Phone, Mail, Link as LinkIcon, ShieldCheck } from "lucide-react";
import CountrySelector from "./CountrySelector";
import VerifiedBadge from "../../components/VerifiedBadge";

export default function ${name}(props) {
${propsDestructuring}

${jsxContent}`;

const componentsDir = path.join(__dirname, 'src/features/auth/components/settings');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
const mobileDir = path.join(componentsDir, 'mobile');
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir);
const tabletDir = path.join(componentsDir, 'tablet');
if (!fs.existsSync(tabletDir)) fs.mkdirSync(tabletDir);
const desktopDir = path.join(componentsDir, 'desktop');
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir);

fs.writeFileSync(path.join(mobileDir, 'SettingsMobile.jsx'), componentTemplate('SettingsMobile'));
fs.writeFileSync(path.join(tabletDir, 'SettingsTablet.jsx'), componentTemplate('SettingsTablet'));
fs.writeFileSync(path.join(desktopDir, 'SettingsDesktop.jsx'), componentTemplate('SettingsDesktop'));

const controllerPropsObject = `  const controllerProps = {
${propsList.map(p => `    ${p}`).join(',\n')}
  };`;

const newReturn = `
${controllerPropsObject}

  return (
    <ResponsiveView
      mobile={<SettingsMobile {...controllerProps} />}
      tablet={<SettingsTablet {...controllerProps} />}
      desktop={<SettingsDesktop {...controllerProps} />}
    />
  );
}
`;

let newContent = beforeReturn + newReturn;

const importsToAdd = `import ResponsiveView from "../../components/layout/ResponsiveView";
import SettingsMobile from "./components/settings/mobile/SettingsMobile";
import SettingsTablet from "./components/settings/tablet/SettingsTablet";
import SettingsDesktop from "./components/settings/desktop/SettingsDesktop";
`;
const lastImportIndex = newContent.lastIndexOf('import ');
const nextLineIndex = newContent.indexOf('\\n', lastImportIndex);
newContent = newContent.substring(0, nextLineIndex + 1) + importsToAdd + newContent.substring(nextLineIndex + 1);

fs.writeFileSync(settingsPath, newContent);
console.log("Refactored Settings.jsx");
