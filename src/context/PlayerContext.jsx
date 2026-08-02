import { createContext, useState, useContext } from "react";

const PlayerContext = createContext();

export function PlayerProvider({ children }) {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem("v2_players");
    return saved ? JSON.parse(saved) : [];
  });

  const [playerEvents, setPlayerEvents] = useState(() => {
    const saved = localStorage.getItem("v2_player_events");
    return saved ? JSON.parse(saved) : [];
  });

  const savePlayers = (newPlayers) => {
    setPlayers(newPlayers);
    localStorage.setItem("v2_players", JSON.stringify(newPlayers));
  };

  const savePlayerEvents = (newEvents) => {
    setPlayerEvents(newEvents);
    localStorage.setItem("v2_player_events", JSON.stringify(newEvents));
  };

  const registerPlayer = (playerData) => {
    // Destructure with defaults to support both old calls (if missed) and new object schema
    const {
      name,
      displayName,
      position = "Unassigned",
      phone = null,
      phoneNumber = null,
      phoneCountryCode = "+91",
      phoneVerified = false,
      email = null,
      emailVerified = false,
      isVerified = false,
      dob = null,
      age = null,
      country = "",
      city = "",
      teamName = "",
      preferredFoot = "",
      authMethod = "EMAIL",
      firstName = "",
      lastName = "",
      gender = "Unspecified",
      bio = "Football enthusiast.",
      username = ""
    } = typeof playerData === 'object' ? playerData : {
      name: arguments[0],
      position: arguments[1] || "Unassigned",
      phone: arguments[2] || null,
      email: arguments[3] || null,
      isVerified: arguments[4] || false,
      dob: arguments[5] || null,
      age: arguments[6] || null
    };

    const finalName = name || displayName || "Player";
    const finalPhone = phoneNumber || phone;
    const autoUsername = `@${finalName.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 1000)}`;

    const newPlayer = {
      id: crypto.randomUUID(),
      name: finalName,
      username: username || autoUsername,
      bio,
      displayName: displayName || finalName,
      phone: finalPhone, // Keep for backward compatibility
      phoneNumber: finalPhone,
      phoneCountryCode,
      phoneVerified,
      email,
      emailVerified,
      authMethod,
      isVerified: isVerified || emailVerified || phoneVerified,
      position,
      dob,
      age,
      country,
      city,
      teamName,
      preferredFoot,
      firstName,
      lastName,
      gender,
      createdAt: Date.now(),
      stats: {
        appearances: 0,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        ownGoals: 0,
        cleanSheets: 0,
        motm: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        saves: 0,
        goalsConceded: 0,
        tackles: 0,
        interceptions: 0,
        aerialWins: 0,
        passes: 0,
        chancesCreated: 0,
        captainAppearances: 0,
        captainWins: 0,
        captainLosses: 0,
        captainDraws: 0,
        highestGoalsInMatch: 0,
        penaltyShootoutGoals: 0,
        penaltyShootoutSaves: 0
      },
      matchHistory: []
    };
    savePlayers([...players, newPlayer]);
    return newPlayer;
  };

  const commitMatchStats = (matchData) => {
    // This will be called by MatchEngine when match is FINISHED
    let updatedPlayers = [...players];

    const processTeamStats = (team, opponentScore, teamPens, oppPens) => {
      team.players.forEach(matchPlayer => {
        let pIndex = updatedPlayers.findIndex(p => p.id === matchPlayer.id);

        if (pIndex === -1) {
          // Auto-register if not found
          const newP = {
            id: matchPlayer.id,
            name: matchPlayer.name,
            displayName: matchPlayer.name,
            phone: matchPlayer.phone || null,
            phoneNumber: matchPlayer.phone || null,
            phoneCountryCode: "+91",
            phoneVerified: false,
            email: matchPlayer.email || null,
            emailVerified: false,
            authMethod: matchPlayer.authMethod || "EMAIL",
            position: matchPlayer.position || "Unassigned",
            isVerified: matchPlayer.isVerified || false,
            username: matchPlayer.username || `@${matchPlayer.name.replace(/\s+/g, '').toLowerCase()}${Math.floor(Math.random() * 1000)}`,
            bio: "Football enthusiast.",
            gender: "Unspecified",
            createdAt: Date.now(),
            stats: {
              appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, ownGoals: 0, cleanSheets: 0, motm: 0, wins: 0, losses: 0, draws: 0,
              saves: 0, goalsConceded: 0, tackles: 0, interceptions: 0, aerialWins: 0, passes: 0, chancesCreated: 0, captainAppearances: 0, captainWins: 0, captainLosses: 0, captainDraws: 0, highestGoalsInMatch: 0, penaltyShootoutGoals: 0, penaltyShootoutSaves: 0
            },
            matchHistory: []
          };
          updatedPlayers.push(newP);
          pIndex = updatedPlayers.length - 1;
        }

        const p = { ...updatedPlayers[pIndex] };

        if (matchPlayer.position && matchPlayer.position !== "UNASSIGNED") {
          p.position = matchPlayer.position;
        }

        // ONLY update stats if the player is VERIFIED
        if (p.isVerified) {
          p.stats.appearances += 1; // Basic rule: if in players array, counts as appearance
          p.stats.goals += (matchPlayer.stats?.goals || 0);
          p.stats.assists += (matchPlayer.stats?.assists || 0);
          p.stats.yellowCards += (matchPlayer.stats?.yellowCards || 0);
          p.stats.redCards += (matchPlayer.stats?.redCards || 0);
          p.stats.ownGoals += (matchPlayer.stats?.ownGoals || 0);

          // Advanced stats updates if they exist in match stats
          p.stats.saves += (matchPlayer.stats?.saves || 0);
          p.stats.tackles += (matchPlayer.stats?.tackles || 0);
          p.stats.interceptions += (matchPlayer.stats?.interceptions || 0);
          p.stats.aerialWins += (matchPlayer.stats?.aerialWins || 0);
          p.stats.passes += (matchPlayer.stats?.passes || 0);
          p.stats.chancesCreated += (matchPlayer.stats?.chancesCreated || 0);

          if ((matchPlayer.stats?.goals || 0) > p.stats.highestGoalsInMatch) {
            p.stats.highestGoalsInMatch = matchPlayer.stats.goals;
          }

          if (opponentScore === 0) p.stats.cleanSheets += 1;
          p.stats.goalsConceded += opponentScore;

          const myPenGoals = teamPens.filter(pen => pen.playerId === p.id && pen.isGoal).length;
          p.stats.penaltyShootoutGoals = (p.stats.penaltyShootoutGoals || 0) + myPenGoals;
          
          if (p.position === "GK") {
            const myPenSaves = oppPens.filter(pen => pen.result === "Saved").length;
            p.stats.penaltyShootoutSaves = (p.stats.penaltyShootoutSaves || 0) + myPenSaves;
          }

          const isWin = team.score > opponentScore || (team.score === opponentScore && teamPens.filter(pen => pen.isGoal).length > oppPens.filter(pen => pen.isGoal).length);
          const isLoss = team.score < opponentScore || (team.score === opponentScore && teamPens.filter(pen => pen.isGoal).length < oppPens.filter(pen => pen.isGoal).length);
          

          p.matchHistory.push({
            matchId: matchData.id,
            date: Date.now(),
            teamName: team.name,
            result: isWin ? "W" : isLoss ? "L" : "D",
            score: `${team.score}-${opponentScore}${teamPens.length > 0 || oppPens.length > 0 ? ` (${teamPens.filter(pen => pen.isGoal).length}-${oppPens.filter(pen => pen.isGoal).length})` : ""}`
          });

          if (isWin) p.stats.wins += 1;
          else if (isLoss) p.stats.losses += 1;
          else p.stats.draws += 1;

          if (matchPlayer.isCaptain) {
            p.stats.captainAppearances += 1;
            if (isWin) p.stats.captainWins += 1;
            else if (isLoss) p.stats.captainLosses += 1;
            else p.stats.captainDraws += 1;
          }
        }

        updatedPlayers[pIndex] = p;
      });
    };

    processTeamStats(matchData.teamA, matchData.teamB.score, matchData.penaltiesA || [], matchData.penaltiesB || []);
    processTeamStats(matchData.teamB, matchData.teamA.score, matchData.penaltiesB || [], matchData.penaltiesA || []);

    savePlayers(updatedPlayers);
  };

  const getPlayerByPhone = (phone) => {
    if (!phone) return null;
    return players.find(p => p.phone === phone);
  };

  const getPlayerByEmail = (email) => {
    if (!email) return null;
    return players.find(p => p.email === email);
  };

  const updatePlayerIdentity = (playerId, identityUpdates) => {
    setPlayers(prev => prev.map(p =>
      p.id === playerId ? { ...p, ...identityUpdates } : p
    ));
  };

  // Live Stat Linking function
  const recordPlayerEvent = (playerId, matchId, eventType, data = {}) => {
    const newEvent = {
      id: crypto.randomUUID(),
      playerId,
      matchId,
      type: eventType, // e.g., 'GOAL', 'ASSIST', 'YELLOW_CARD', 'SAVE'
      timestamp: Date.now(),
      data
    };
    savePlayerEvents([...playerEvents, newEvent]);
  };

  const getPlayerStats = (playerId, filterPosition = null) => {
    const defaultStats = {
      appearances: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, ownGoals: 0, cleanSheets: 0, motm: 0, wins: 0, losses: 0, draws: 0, saves: 0, goalsConceded: 0, tackles: 0, interceptions: 0, aerialWins: 0, passes: 0, chancesCreated: 0, captainAppearances: 0, captainWins: 0, captainLosses: 0, captainDraws: 0, highestGoalsInMatch: 0, penaltyShootoutGoals: 0, penaltyShootoutSaves: 0,
      minutesPlayed: 0, blocks: 0, clearances: 0, foulsCommitted: 0, foulsWon: 0, penaltyGoals: 0, freeKickGoals: 0, shots: 0,
      averageRating: 0, bestRating: 0, last10Ratings: [], hatTricks: 0, fourGoalMatches: 0, fiveGoalMatches: 0, winPercentage: 0
    };
    
    const player = players.find(p => p.id === playerId);
    if (!player) return defaultStats;

    let events = playerEvents.filter(e => e.playerId === playerId);
    
    // Position Filtering
    if (filterPosition) {
       events = events.filter(e => e.data && (e.data.position === filterPosition || e.data.position === "ANY"));
    }

    if (events.length === 0 && player.stats && player.stats.appearances > 0 && !filterPosition) {
       return { ...defaultStats, ...player.stats };
    }

    const calculatedStats = { ...defaultStats };
    const matchGoals = {}; 
    const ratings = [];

    events.forEach(e => {
       const amount = e.data?.amount || 1;
       
       if (e.type === 'GOAL') {
           calculatedStats.goals += amount;
           matchGoals[e.matchId] = (matchGoals[e.matchId] || 0) + amount;
           if (matchGoals[e.matchId] > calculatedStats.highestGoalsInMatch) {
               calculatedStats.highestGoalsInMatch = matchGoals[e.matchId];
           }
           if (e.data?.isPenalty) calculatedStats.penaltyGoals += amount;
           if (e.data?.isFreeKick) calculatedStats.freeKickGoals += amount;
       }
       if (e.type === 'ASSIST') calculatedStats.assists += amount;
       if (e.type === 'YELLOW_CARD') calculatedStats.yellowCards += amount;
       if (e.type === 'RED_CARD') calculatedStats.redCards += amount;
       if (e.type === 'SAVE') {
           calculatedStats.saves += amount;
           if (e.data?.isPenalty) calculatedStats.penaltyShootoutSaves += amount; // Simplified mapping
       }
       if (e.type === 'CLEAN_SHEET') calculatedStats.cleanSheets += amount;
       if (e.type === 'APPEARANCE') {
           calculatedStats.appearances += amount;
           calculatedStats.minutesPlayed += (e.data?.minutes || 0);
       }
       if (e.type === 'OWN_GOAL') calculatedStats.ownGoals += amount;
       
       if (e.type === 'TACKLE') calculatedStats.tackles += amount;
       if (e.type === 'INTERCEPTION') calculatedStats.interceptions += amount;
       if (e.type === 'BLOCK') calculatedStats.blocks += amount;
       if (e.type === 'CLEARANCE') calculatedStats.clearances += amount;
       if (e.type === 'FOUL_COMMITTED') calculatedStats.foulsCommitted += amount;
       if (e.type === 'FOUL_WON') calculatedStats.foulsWon += amount;
       if (e.type === 'SHOT') calculatedStats.shots += amount;
       if (e.type === 'MOTM') calculatedStats.motm += amount;

       if (e.type === 'RATING') {
           ratings.push(e.data.rating);
           if (e.data.rating > calculatedStats.bestRating) {
               calculatedStats.bestRating = e.data.rating;
           }
       }
       
       if (e.type === 'MATCH_END') {
           if (e.data?.result === 'W') calculatedStats.wins += 1;
           if (e.data?.result === 'L') calculatedStats.losses += 1;
           if (e.data?.result === 'D') calculatedStats.draws += 1;
           if (e.data?.goalsConceded) calculatedStats.goalsConceded += e.data.goalsConceded;
           if (e.data?.isCaptain) {
               calculatedStats.captainAppearances += 1;
               if (e.data.result === 'W') calculatedStats.captainWins += 1;
               if (e.data.result === 'L') calculatedStats.captainLosses += 1;
               if (e.data.result === 'D') calculatedStats.captainDraws += 1;
           }
       }
    });

    // Post-calculations
    Object.values(matchGoals).forEach(g => {
        if (g === 3) calculatedStats.hatTricks += 1;
        if (g === 4) calculatedStats.fourGoalMatches += 1;
        if (g >= 5) calculatedStats.fiveGoalMatches += 1;
    });

    if (calculatedStats.appearances > 0) {
        calculatedStats.winPercentage = ((calculatedStats.wins / calculatedStats.appearances) * 100).toFixed(1);
    }
    
    if (ratings.length > 0) {
        calculatedStats.averageRating = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        calculatedStats.last10Ratings = ratings.slice(-10);
    }

    return calculatedStats;
  };

  const evaluateAchievements = (playerId) => {
      const stats = getPlayerStats(playerId);
      const unlocked = [];
      
      if (stats.goals >= 1) unlocked.push({ id: 'first_goal', name: 'First Goal', icon: '⚽', desc: 'Scored your first goal' });
      if (stats.goals >= 50) unlocked.push({ id: '50_goals', name: 'Half Century', icon: '🔥', desc: 'Scored 50 career goals' });
      if (stats.assists >= 1) unlocked.push({ id: 'first_assist', name: 'First Assist', icon: '🤝', desc: 'Provided your first assist' });
      if (stats.hatTricks >= 1) unlocked.push({ id: 'hat_trick', name: 'Hat-trick Hero', icon: '🎩', desc: 'Scored a hat-trick in a match' });
      if (stats.appearances >= 100) {
          unlocked.push({ id: '100_matches', name: '100 Matches', icon: '💯', desc: 'Played 100 matches' });
          unlocked.push({ id: 'iron_man', name: 'Iron Man', icon: '🤖', desc: 'Made 100 consecutive appearances' });
      }
      if (stats.cleanSheets >= 25) unlocked.push({ id: '25_cs', name: 'Brick Wall', icon: '🧱', desc: 'Kept 25 clean sheets' });
      if (stats.captainAppearances >= 1) unlocked.push({ id: 'captain', name: 'Captain Leader', icon: '©️', desc: 'Captained the team' });
      if (stats.penaltyGoals >= 5) unlocked.push({ id: 'pen_specialist', name: 'Penalty Specialist', icon: '🎯', desc: 'Scored 5 penalties' });
      if (stats.saves >= 50) unlocked.push({ id: 'golden_glove', name: 'Golden Glove', icon: '🧤', desc: 'Made 50 saves' });

      return unlocked;
  };

  return (
    <PlayerContext.Provider value={{ players, playerEvents, registerPlayer, commitMatchStats, getPlayerByPhone, getPlayerByEmail, updatePlayerIdentity, recordPlayerEvent, getPlayerStats, evaluateAchievements }}>
      {children}
    </PlayerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const usePlayers = () => useContext(PlayerContext);
