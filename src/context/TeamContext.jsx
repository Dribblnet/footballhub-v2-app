import { createContext, useState, useContext } from "react";

const TeamContext = createContext();

export function TeamProvider({ children }) {
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem("v2_teams");
    return saved ? JSON.parse(saved) : [];
  });

  const saveTeams = (newTeams) => {
    setTeams(newTeams);
    localStorage.setItem("v2_teams", JSON.stringify(newTeams));
  };

  const commitMatchStatsToTeams = (matchData) => {
    let updatedTeams = [...teams];

    const processTeam = (teamData, opponentScore) => {
      let tIndex = updatedTeams.findIndex(t => t.name === teamData.name);
      
      if (tIndex === -1) {
        const newTeam = {
          id: crypto.randomUUID(),
          name: teamData.name,
          stats: { matches: 0, wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0, cleanSheets: 0 },
          matchHistory: []
        };
        updatedTeams.push(newTeam);
        tIndex = updatedTeams.length - 1;
      }

      const t = { ...updatedTeams[tIndex] };
      
      t.stats.matches += 1;
      t.stats.goalsFor += teamData.score;
      t.stats.goalsAgainst += opponentScore;
      
      if (opponentScore === 0) t.stats.cleanSheets += 1;

      t.matchHistory.push({
        matchId: matchData.id,
        date: Date.now(),
        opponent: teamData.name === matchData.teamA.name ? matchData.teamB.name : matchData.teamA.name,
        result: teamData.score > opponentScore ? "W" : teamData.score < opponentScore ? "L" : "D",
        score: `${teamData.score}-${opponentScore}`
      });

      if (teamData.score > opponentScore) t.stats.wins += 1;
      else if (teamData.score < opponentScore) t.stats.losses += 1;
      else t.stats.draws += 1;

      updatedTeams[tIndex] = t;
    };

    processTeam(matchData.teamA, matchData.teamB.score);
    processTeam(matchData.teamB, matchData.teamA.score);

    saveTeams(updatedTeams);
  };

  const createTeam = (name, bio, color, turf) => {
    const newTeam = {
      id: crypto.randomUUID(),
      name,
      bio,
      color,
      turf,
      stats: { matches: 0, wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0, cleanSheets: 0 },
      matchHistory: []
    };
    saveTeams([...teams, newTeam]);
    return newTeam.id;
  };

  return (
    <TeamContext.Provider value={{ teams, commitMatchStatsToTeams, createTeam }}>
      {children}
    </TeamContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTeams = () => useContext(TeamContext);
