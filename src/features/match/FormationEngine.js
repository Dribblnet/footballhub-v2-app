export const calculateFormationCoordinates = (formationStr, isBottomHalf) => {
  if (formationStr.startsWith("custom_")) {
    const saved = JSON.parse(localStorage.getItem("v2_custom_formations") || "{}");
    if (saved[formationStr]) {
      return saved[formationStr].map(c => ({
        ...c,
        top: isBottomHalf ? (100 - parseFloat(c.top)) + "%" : c.top // Invert Y if bottom half
      }));
    }
  }

  const parseFormation = (str) => {
    if (str === "5v5") return [1, 2, 1];
    if (str === "7v7") return [2, 3, 1];
    return str.split("-").map(Number);
  };

  const lines = parseFormation(formationStr);
  const coords = [];
  
  // Goalkeeper
  coords.push({ position: "GK", top: isBottomHalf ? "95%" : "5%", left: "50%" });

  // Distribute over the 40% of the active half closest to the goal
  const verticalSpacing = 35 / lines.length; 
  
  lines.forEach((numPlayersInLine, lineIndex) => {
    let yPercent;
    if (!isBottomHalf) {
       yPercent = 15 + (lineIndex * verticalSpacing);
    } else {
       yPercent = 85 - (lineIndex * verticalSpacing);
    }
    
    // Spread players horizontally
    const horizontalSpacing = 80 / (numPlayersInLine + 1);
    
    for (let i = 0; i < numPlayersInLine; i++) {
      let xPercent = 10 + ((i + 1) * horizontalSpacing);
      
      let position;
      if (lineIndex === 0) position = "DEF";
      else if (lineIndex === lines.length - 1) position = "FWD";
      else position = "MID";

      coords.push({
        position,
        top: `${yPercent}%`,
        left: `${xPercent}%`
      });
    }
  });

  return coords;
};

export const applyFormationToTeam = (teamData, formationStr, isBottomHalf) => {
  const coords = calculateFormationCoordinates(formationStr, isBottomHalf);
  
  return {
    ...teamData,
    formation: formationStr,
    players: teamData.players.map((p, index) => {
      // If we run out of coordinates (e.g. 11 players but 5v5 selected), just stack them or keep existing
      if (index < coords.length) {
        return {
          ...p,
          top: coords[index].top,
          left: coords[index].left,
          position: coords[index].position || p.position
        };
      }
      return p;
    })
  };
};
