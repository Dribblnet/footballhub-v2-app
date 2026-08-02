const fs = require('fs');
const path = require('path');

const matchViewPath = path.join(__dirname, 'src/features/match/MatchView.jsx');
let content = fs.readFileSync(matchViewPath, 'utf8');

// Find the return statement
const returnMatch = content.match(/  return \(\r?\n    <div style=\{\{ maxWidth: "800px"/);
if (!returnMatch) {
  console.log("Could not find return statement");
  process.exit(1);
}
const returnIndex = returnMatch.index;

const beforeReturn = content.substring(0, returnIndex);
const jsxContent = content.substring(returnIndex);

// Define all the props that need to be passed
const propsList = [
  "id", "navigate", "match", "activeTab", "setActiveTab",
  "timer", "setTimer", "matchMinute", "momentumValue", "isSpectator",
  "extraTimeModal", "setExtraTimeModal", "extraTimeInput", "setExtraTimeInput",
  "goalModal", "setGoalModal", "penaltyWizard", "setPenaltyWizard",
  "subModal", "setSubModal", "saveModal", "setSaveModal",
  "editPlayerModal", "setEditPlayerModal", "foulModal", "setFoulModal",
  "stoppageModal", "setStoppageModal", "highlightUndo", "setHighlightUndo",
  "undoModal", "setUndoModal", "customFormationName", "setCustomFormationName",
  "savedFormations", "setSavedFormations", 
  "handleCard", "confirmGoal", "submitFoul", "submitSave",
  "handleEditPlayerSubmit", "executeSub", "handleSaveCustomFormation", "renderLineup",
  "updateMatchState", "setMatchHalf", "addStoppageTime", "markStoppagePromptShown",
  "editPlayer", "setCaptain", "setGoalkeeper", "addEvent", "finishMatch",
  "changeFormation", "substitute", "addPlayerToBench", "removePlayer",
  "matchEventOverlay", "addExtraTime", "recordPenaltyShootout", "undoEvent", "redoEvent",
  "processTournamentMatch", "getPlayerByPhone", "registerPlayer", "players", "toast",
  "isMobile", "previousPastStatesRef"
];

const propsDestructuring = `  const {
${propsList.map(p => `    ${p},`).join('\n')}
  } = props;`;

const componentTemplate = (name) => `import React from "react";
import { ArrowLeft, Play, StopCircle, Clock, Crown, Undo, Redo } from "lucide-react";
import Pitch from "../../tactics/Pitch";
import VerifiedBadge from "../../../components/VerifiedBadge";

export default function ${name}(props) {
${propsDestructuring}

${jsxContent}`;

// Create directories
const componentsDir = path.join(__dirname, 'src/features/match/components');
if (!fs.existsSync(componentsDir)) fs.mkdirSync(componentsDir, { recursive: true });
const mobileDir = path.join(componentsDir, 'mobile');
if (!fs.existsSync(mobileDir)) fs.mkdirSync(mobileDir);
const tabletDir = path.join(componentsDir, 'tablet');
if (!fs.existsSync(tabletDir)) fs.mkdirSync(tabletDir);
const desktopDir = path.join(componentsDir, 'desktop');
if (!fs.existsSync(desktopDir)) fs.mkdirSync(desktopDir);

// Write component files
fs.writeFileSync(path.join(mobileDir, 'MatchViewMobile.jsx'), componentTemplate('MatchViewMobile'));
fs.writeFileSync(path.join(tabletDir, 'MatchViewTablet.jsx'), componentTemplate('MatchViewTablet'));
fs.writeFileSync(path.join(desktopDir, 'MatchViewDesktop.jsx'), componentTemplate('MatchViewDesktop'));

// Update MatchView.jsx
const controllerPropsObject = `  const controllerProps = {
${propsList.map(p => `    ${p}`).join(',\n')}
  };`;

const newReturn = `
${controllerPropsObject}

  return (
    <ResponsiveView
      mobile={<MatchViewMobile {...controllerProps} />}
      tablet={<MatchViewTablet {...controllerProps} />}
      desktop={<MatchViewDesktop {...controllerProps} />}
    />
  );
}
`;

let newContent = beforeReturn + newReturn;

// Add ResponsiveView and the components to the imports
if (!newContent.includes('ResponsiveView')) {
  newContent = `import ResponsiveView from "../../components/layout/ResponsiveView";\n` + 
               `import MatchViewMobile from "./components/mobile/MatchViewMobile";\n` +
               `import MatchViewTablet from "./components/tablet/MatchViewTablet";\n` +
               `import MatchViewDesktop from "./components/desktop/MatchViewDesktop";\n` + newContent;
}

fs.writeFileSync(matchViewPath, newContent);

console.log("Refactored MatchView.jsx");
