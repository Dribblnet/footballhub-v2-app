const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'src/features/teams/PlayerProfile.jsx');
let content = fs.readFileSync(profilePath, 'utf8');

const returnMatch = content.match(/  return \(\r?\n    <div style=\{\{ maxWidth: "800px"/);
if (!returnMatch) {
  console.log("Could not find return statement");
  process.exit(1);
}
const returnIndex = returnMatch.index;

const beforeReturn = content.substring(0, returnIndex);
const jsxContent = content.substring(returnIndex);

const propsList = [
  "player", "navigate", "filterPosition", "setFilterPosition",
  "stats", "achievements", "position", "renderPositionStats",
  "getCaptainWinRate", "bestDuo", "matches", "isMobile"
];

const propsDestructuring = `  const {
${propsList.map(p => `    ${p},`).join('\n')}
  } = props;`;

const componentTemplate = (name) => `import React from "react";
import { ArrowLeft, User, Crown, Filter, MessageSquare, Calendar, ShieldCheck, Footprints, MapPin, Swords } from "lucide-react";
import VerifiedBadge from "../../../components/VerifiedBadge";
import ResponsiveProfileHeader from "../../../components/responsive/ResponsiveProfileHeader";

const StatBox = ({ label, value, color }) => (
  <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px" }}>
    <span style={{ fontSize: "28px", fontWeight: "800", color: color || "var(--text-main)" }}>{value}</span>
    <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px", textAlign: "center" }}>{label}</span>
  </div>
);

export default function ${name}(props) {
${propsDestructuring}

${jsxContent}`;

const componentsDir = path.join(__dirname, 'src/features/teams/components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
const mobileDir = path.join(componentsDir, 'mobile');
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir);
const tabletDir = path.join(componentsDir, 'tablet');
if (!fs.existsSync(tabletDir)) fs.mkdirSync(tabletDir);
const desktopDir = path.join(componentsDir, 'desktop');
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir);

fs.writeFileSync(path.join(mobileDir, 'PlayerProfileMobile.jsx'), componentTemplate('PlayerProfileMobile'));
fs.writeFileSync(path.join(tabletDir, 'PlayerProfileTablet.jsx'), componentTemplate('PlayerProfileTablet'));
fs.writeFileSync(path.join(desktopDir, 'PlayerProfileDesktop.jsx'), componentTemplate('PlayerProfileDesktop'));

const controllerPropsObject = `  const controllerProps = {
${propsList.map(p => `    ${p}`).join(',\n')}
  };`;

const newReturn = `
${controllerPropsObject}

  return (
    <ResponsiveView
      mobile={<PlayerProfileMobile {...controllerProps} />}
      tablet={<PlayerProfileTablet {...controllerProps} />}
      desktop={<PlayerProfileDesktop {...controllerProps} />}
    />
  );
}
`;

let newContent = beforeReturn + newReturn;

const importsToAdd = `import ResponsiveView from "../../components/layout/ResponsiveView";
import PlayerProfileMobile from "./components/mobile/PlayerProfileMobile";
import PlayerProfileTablet from "./components/tablet/PlayerProfileTablet";
import PlayerProfileDesktop from "./components/desktop/PlayerProfileDesktop";
`;
// Insert imports after the last import statement
const lastImportIndex = newContent.lastIndexOf('import ');
const nextLineIndex = newContent.indexOf('\\n', lastImportIndex);
newContent = newContent.substring(0, nextLineIndex + 1) + importsToAdd + newContent.substring(nextLineIndex + 1);

fs.writeFileSync(profilePath, newContent);
console.log("Refactored PlayerProfile.jsx");
