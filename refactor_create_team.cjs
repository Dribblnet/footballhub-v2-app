const fs = require('fs');
const path = require('path');

const createTeamPath = path.join(__dirname, 'src/features/teams/CreateTeam.jsx');
let content = fs.readFileSync(createTeamPath, 'utf8');

const returnMatch = content.match(/  return \(\r?\n    <div style=\{\{ maxWidth: "600px"/);
if (!returnMatch) {
  console.log("Could not find return statement");
  process.exit(1);
}
const returnIndex = returnMatch.index;

const beforeReturn = content.substring(0, returnIndex);
const jsxContent = content.substring(returnIndex);

const propsList = [
  "navigate", "createTeam", "toast", "name", "setName",
  "bio", "setBio", "color", "setColor", "turf", "setTurf", "handleCreate"
];

const propsDestructuring = `  const {
${propsList.map(p => `    ${p},`).join('\n')}
  } = props;`;

const componentTemplate = (name) => `import React from "react";
import { Shield, ArrowLeft, PaintBucket, MapPin, AlignLeft } from "lucide-react";

export default function ${name}(props) {
${propsDestructuring}

${jsxContent}`;

const componentsDir = path.join(__dirname, 'src/features/teams/components/create');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
const mobileDir = path.join(componentsDir, 'mobile');
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir);
const tabletDir = path.join(componentsDir, 'tablet');
if (!fs.existsSync(tabletDir)) fs.mkdirSync(tabletDir);
const desktopDir = path.join(componentsDir, 'desktop');
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir);

fs.writeFileSync(path.join(mobileDir, 'CreateTeamMobile.jsx'), componentTemplate('CreateTeamMobile'));
fs.writeFileSync(path.join(tabletDir, 'CreateTeamTablet.jsx'), componentTemplate('CreateTeamTablet'));
fs.writeFileSync(path.join(desktopDir, 'CreateTeamDesktop.jsx'), componentTemplate('CreateTeamDesktop'));

const controllerPropsObject = `  const controllerProps = {
${propsList.map(p => `    ${p}`).join(',\n')}
  };`;

const newReturn = `
${controllerPropsObject}

  return (
    <ResponsiveView
      mobile={<CreateTeamMobile {...controllerProps} />}
      tablet={<CreateTeamTablet {...controllerProps} />}
      desktop={<CreateTeamDesktop {...controllerProps} />}
    />
  );
}
`;

let newContent = beforeReturn + newReturn;

const importsToAdd = `import ResponsiveView from "../../components/layout/ResponsiveView";
import CreateTeamMobile from "./components/create/mobile/CreateTeamMobile";
import CreateTeamTablet from "./components/create/tablet/CreateTeamTablet";
import CreateTeamDesktop from "./components/create/desktop/CreateTeamDesktop";
`;
const lastImportIndex = newContent.lastIndexOf('import ');
const nextLineIndex = newContent.indexOf('\\n', lastImportIndex);
newContent = newContent.substring(0, nextLineIndex + 1) + importsToAdd + newContent.substring(nextLineIndex + 1);

fs.writeFileSync(createTeamPath, newContent);
console.log("Refactored CreateTeam.jsx");
