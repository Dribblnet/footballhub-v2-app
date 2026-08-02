const fs = require('fs');
const path = require('path');

const profilePath = path.join(__dirname, 'src/features/tactics/Pitch.jsx');
let content = fs.readFileSync(profilePath, 'utf8');

const returnMatch = content.match(/  return \(\r?\n    <div\r?\n      ref=\{pitchRef\}/);
if (!returnMatch) {
  console.log("Could not find return statement");
  process.exit(1);
}
const returnIndex = returnMatch.index;

const beforeReturn = content.substring(0, returnIndex);
const jsxContent = content.substring(returnIndex);

const propsList = [
  "matchId", "teamA", "teamB", "updatePlayerPosition", "pitchRef",
  "handleDragStart", "handleDragOver", "handleDrop", "renderPlayer"
];

const propsDestructuring = `  const {
${propsList.map(p => `    ${p},`).join('\n')}
  } = props;`;

const componentTemplate = (name) => `import React from "react";

export default function ${name}(props) {
${propsDestructuring}

${jsxContent}`;

const componentsDir = path.join(__dirname, 'src/features/tactics/components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
const mobileDir = path.join(componentsDir, 'mobile');
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir);
const tabletDir = path.join(componentsDir, 'tablet');
if (!fs.existsSync(tabletDir)) fs.mkdirSync(tabletDir);
const desktopDir = path.join(componentsDir, 'desktop');
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir);

fs.writeFileSync(path.join(mobileDir, 'PitchMobile.jsx'), componentTemplate('PitchMobile'));
fs.writeFileSync(path.join(tabletDir, 'PitchTablet.jsx'), componentTemplate('PitchTablet'));
fs.writeFileSync(path.join(desktopDir, 'PitchDesktop.jsx'), componentTemplate('PitchDesktop'));

const controllerPropsObject = `  const controllerProps = {
${propsList.map(p => `    ${p}`).join(',\n')}
  };`;

const newReturn = `
${controllerPropsObject}

  return (
    <ResponsiveView
      mobile={<PitchMobile {...controllerProps} />}
      tablet={<PitchTablet {...controllerProps} />}
      desktop={<PitchDesktop {...controllerProps} />}
    />
  );
}
`;

let newContent = beforeReturn + newReturn;

const importsToAdd = `import ResponsiveView from "../../components/layout/ResponsiveView";
import PitchMobile from "./components/mobile/PitchMobile";
import PitchTablet from "./components/tablet/PitchTablet";
import PitchDesktop from "./components/desktop/PitchDesktop";
`;
const lastImportIndex = newContent.lastIndexOf('import ');
const nextLineIndex = newContent.indexOf('\\n', lastImportIndex);
newContent = newContent.substring(0, nextLineIndex + 1) + importsToAdd + newContent.substring(nextLineIndex + 1);

fs.writeFileSync(profilePath, newContent);
console.log("Refactored Pitch.jsx");
