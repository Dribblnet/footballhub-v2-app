const fs = require('fs');
const path = require('path');

const marketplacePath = path.join(__dirname, 'src/features/marketplace/Marketplace.jsx');
let content = fs.readFileSync(marketplacePath, 'utf8');

const returnMatch = content.match(/  return \(\r?\n    <div style=\{\{ maxWidth: "800px"/);
if (!returnMatch) {
  console.log("Could not find return statement");
  process.exit(1);
}
const returnIndex = returnMatch.index;

const beforeReturn = content.substring(0, returnIndex);
const jsxContent = content.substring(returnIndex);

const propsList = [
  "navigate", "requests", "addRequest", "deleteRequest", "unreadMessagesCount",
  "toast", "user", "players", "isCreating", "setIsCreating",
  "deleteModalId", "setDeleteModalId", "filterCity", "setFilterCity",
  "filterFormat", "setFilterFormat", "filterSkill", "setFilterSkill",
  "filterSurface", "setFilterSurface", "filterEnvironment", "setFilterEnvironment",
  "filterType", "setFilterType", "formType", "setFormType",
  "formMatchType", "setFormMatchType", "formSkill", "setFormSkill",
  "formTurf", "setFormTurf", "formCity", "setFormCity",
  "formDate", "setFormDate", "formTime", "setFormTime",
  "formDuration", "setFormDuration", "formPositions", "setFormPositions",
  "formPlayersNeeded", "setFormPlayersNeeded", "formEnvironment", "setFormEnvironment",
  "formSurface", "setFormSurface", "formRefNeeded", "setFormRefNeeded",
  "formSubsAllowed", "setFormSubsAllowed", "formEntryFee", "setFormEntryFee",
  "formPrizeInfo", "setFormPrizeInfo", "togglePosition", "handleSubmit",
  "filteredRequests"
];

const propsDestructuring = `  const {
${propsList.map(p => `    ${p},`).join('\n')}
  } = props;`;

const componentTemplate = (name) => `import React from "react";
import { Plus, MapPin, Target, MessageSquare, Shield, Clock, Trash2 } from "lucide-react";
import VerifiedBadge from "../../../components/VerifiedBadge";
import { INDIAN_CITIES } from "../../../core/cities";

const POSITIONS = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];

export default function ${name}(props) {
${propsDestructuring}

${jsxContent}`;

const componentsDir = path.join(__dirname, 'src/features/marketplace/components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
const mobileDir = path.join(componentsDir, 'mobile');
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir);
const tabletDir = path.join(componentsDir, 'tablet');
if (!fs.existsSync(tabletDir)) fs.mkdirSync(tabletDir);
const desktopDir = path.join(componentsDir, 'desktop');
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir);

fs.writeFileSync(path.join(mobileDir, 'MarketplaceMobile.jsx'), componentTemplate('MarketplaceMobile'));
fs.writeFileSync(path.join(tabletDir, 'MarketplaceTablet.jsx'), componentTemplate('MarketplaceTablet'));
fs.writeFileSync(path.join(desktopDir, 'MarketplaceDesktop.jsx'), componentTemplate('MarketplaceDesktop'));

const controllerPropsObject = `  const controllerProps = {
${propsList.map(p => `    ${p}`).join(',\n')}
  };`;

const newReturn = `
${controllerPropsObject}

  return (
    <ResponsiveView
      mobile={<MarketplaceMobile {...controllerProps} />}
      tablet={<MarketplaceTablet {...controllerProps} />}
      desktop={<MarketplaceDesktop {...controllerProps} />}
    />
  );
}
`;

let newContent = beforeReturn + newReturn;

const importsToAdd = `import ResponsiveView from "../../components/layout/ResponsiveView";
import MarketplaceMobile from "./components/mobile/MarketplaceMobile";
import MarketplaceTablet from "./components/tablet/MarketplaceTablet";
import MarketplaceDesktop from "./components/desktop/MarketplaceDesktop";
`;
const lastImportIndex = newContent.lastIndexOf('import ');
const nextLineIndex = newContent.indexOf('\\n', lastImportIndex);
newContent = newContent.substring(0, nextLineIndex + 1) + importsToAdd + newContent.substring(nextLineIndex + 1);

fs.writeFileSync(marketplacePath, newContent);
console.log("Refactored Marketplace.jsx");
