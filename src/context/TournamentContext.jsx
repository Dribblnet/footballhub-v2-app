import { createContext, useState, useContext, useEffect } from "react";

const INITIAL_TOURNAMENTS = [
  {
    id: "demo-1",
    name: "Ahmedabad Sunday League",
    type: "LEAGUE",
    status: "ACTIVE",
    rules: { win: 3, draw: 1, loss: 0 },
    teams: [
      { id: "t1", name: "FC Lightning", stats: { p: 5, w: 4, d: 1, l: 0, gf: 14, ga: 4, gd: 10, pts: 13, form: ["W", "W", "D", "W", "W"] } },
      { id: "t2", name: "Thunder City", stats: { p: 5, w: 3, d: 1, l: 1, gf: 11, ga: 6, gd: 5, pts: 10, form: ["L", "W", "W", "D", "W"] } },
      { id: "t3", name: "Mumbai FA", stats: { p: 5, w: 2, d: 2, l: 1, gf: 8, ga: 7, gd: 1, pts: 8, form: ["D", "L", "W", "W", "D"] } },
      { id: "t4", name: "Koramangala Kings", stats: { p: 5, w: 1, d: 1, l: 3, gf: 5, ga: 12, gd: -7, pts: 4, form: ["L", "L", "L", "W", "D"] } },
      { id: "t5", name: "Navrangpura FC", stats: { p: 4, w: 1, d: 0, l: 3, gf: 4, ga: 9, gd: -5, pts: 3, form: ["L", "W", "L", "L"] } },
      { id: "t6", name: "Vastrapur United", stats: { p: 4, w: 0, d: 1, l: 3, gf: 2, ga: 6, gd: -4, pts: 1, form: ["D", "L", "L", "L"] } }
    ],
    playerStats: {
      "p1": { id: "p1", name: "Alex R.", team: "FC Lightning", goals: 8, assists: 3, saves: 0, cleanSheets: 2, motm: 3, yellowCards: 1, redCards: 0, position: "ST" },
      "p2": { id: "p2", name: "Rahul M.", team: "Thunder City", goals: 6, assists: 1, saves: 0, cleanSheets: 1, motm: 2, yellowCards: 2, redCards: 0, position: "LW" },
      "p3": { id: "p3", name: "Vikram S.", team: "FC Lightning", goals: 0, assists: 0, saves: 24, cleanSheets: 3, motm: 1, yellowCards: 0, redCards: 0, position: "GK" },
      "p4": { id: "p4", name: "David K.", team: "Mumbai FA", goals: 4, assists: 5, saves: 0, cleanSheets: 1, motm: 1, yellowCards: 0, redCards: 0, position: "CAM" },
      "p5": { id: "p5", name: "Arjun P.", team: "Koramangala Kings", goals: 3, assists: 0, saves: 0, cleanSheets: 0, motm: 0, yellowCards: 1, redCards: 0, position: "ST" },
      "p6": { id: "p6", name: "Sameer J.", team: "Thunder City", goals: 0, assists: 0, saves: 18, cleanSheets: 2, motm: 0, yellowCards: 0, redCards: 0, position: "GK" },
      "p7": { id: "p7", name: "Kunal D.", team: "Navrangpura FC", goals: 2, assists: 2, saves: 0, cleanSheets: 0, motm: 1, yellowCards: 0, redCards: 0, position: "CM" }
    },
    fixtures: [
      { id: "fix-101", matchday: "Matchday 6", teamA: "FC Lightning", teamB: "Vastrapur United", date: "Tonight", time: "20:00" },
      { id: "fix-102", matchday: "Matchday 6", teamA: "Thunder City", teamB: "Navrangpura FC", date: "Tonight", time: "21:30" }
    ],
    completedMatches: [
      { id: "cm-1", matchday: "Matchday 5", teamA: "FC Lightning", teamB: "Mumbai FA", scoreA: 3, scoreB: 1, date: "May 15" },
      { id: "cm-2", matchday: "Matchday 5", teamA: "Thunder City", teamB: "Koramangala Kings", scoreA: 2, scoreB: 0, date: "May 15" }
    ],
    matches: [],
    knockoutBracket: []
  },
  {
    id: "demo-2",
    name: "Turf Champions Cup",
    type: "KNOCKOUT",
    status: "ACTIVE",
    rules: { win: 3, draw: 1, loss: 0 },
    teams: [
      { id: "n1", name: "Neon Strikers", stats: { p: 2, w: 2, d: 0, l: 0, gf: 6, ga: 2, gd: 4, pts: 6, form: ["W", "W"] } },
      { id: "n2", name: "Shadow FC", stats: { p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, gd: -2, pts: 0, form: ["L"] } },
      { id: "n3", name: "Midnight Runners", stats: { p: 1, w: 1, d: 0, l: 0, gf: 2, ga: 0, gd: 2, pts: 3, form: ["W"] } },
      { id: "n4", name: "Urban Legends", stats: { p: 1, w: 0, d: 0, l: 1, gf: 0, ga: 2, gd: -2, pts: 0, form: ["L"] } },
      { id: "n5", name: "Rogue Elite", stats: { p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 3, gd: -2, pts: 0, form: ["L"] } }
    ],
    playerStats: {
      "tcc1": { id: "tcc1", name: "Leo V.", team: "Neon Strikers", goals: 4, assists: 1, saves: 0, cleanSheets: 0, motm: 2, yellowCards: 0, redCards: 0, position: "ST" },
      "tcc2": { id: "tcc2", name: "Max T.", team: "Midnight Runners", goals: 2, assists: 0, saves: 0, cleanSheets: 1, motm: 1, yellowCards: 0, redCards: 0, position: "RW" },
      "tcc3": { id: "tcc3", name: "Sam G.", team: "Neon Strikers", goals: 0, assists: 0, saves: 11, cleanSheets: 0, motm: 0, yellowCards: 0, redCards: 0, position: "GK" }
    },
    fixtures: [
      { id: "fix-201", matchday: "Semi-Final", teamA: "Neon Strikers", teamB: "Midnight Runners", date: "Tomorrow", time: "18:00" }
    ],
    completedMatches: [
      { id: "cm-201", matchday: "Quarter-Final", teamA: "Neon Strikers", teamB: "Shadow FC", scoreA: 3, scoreB: 1, date: "May 10" },
      { id: "cm-202", matchday: "Quarter-Final", teamA: "Midnight Runners", teamB: "Urban Legends", scoreA: 2, scoreB: 0, date: "May 11" }
    ],
    matches: [],
    knockoutBracket: [
      [
        { nodeId: 1, tA: "Neon Strikers", tB: "Shadow FC", matchId: "m1", winner: "Neon Strikers" },
        { nodeId: 2, tA: "Midnight Runners", tB: "Urban Legends", matchId: "m2", winner: "Midnight Runners" },
        { nodeId: 3, tA: "Rogue Elite", tB: "Neon Strikers", matchId: "m3", winner: "Neon Strikers" },
        { nodeId: 4, tA: "Bye", tB: "TBD", matchId: null, winner: null }
      ],
      [
        { nodeId: 5, tA: "Neon Strikers", tB: "Midnight Runners", matchId: null, winner: null },
        { nodeId: 6, tA: "Neon Strikers", tB: null, matchId: null, winner: null }
      ]
    ]
  },
  {
    id: "demo-3",
    name: "Weekend Knockout Series",
    type: "KNOCKOUT",
    status: "ACTIVE",
    rules: { win: 3, draw: 1, loss: 0 },
    teams: [
      { id: "w1", name: "Bandra Boys", stats: { p: 1, w: 1, d: 0, l: 0, gf: 3, ga: 0, gd: 3, pts: 3, form: ["W"] } },
      { id: "w2", name: "South Bombay FC", stats: { p: 1, w: 1, d: 0, l: 0, gf: 2, ga: 1, gd: 1, pts: 3, form: ["W"] } },
      { id: "w3", name: "Andheri Allstars", stats: { p: 1, w: 0, d: 0, l: 1, gf: 1, ga: 2, gd: -1, pts: 0, form: ["L"] } },
      { id: "w4", name: "Juhu Invincibles", stats: { p: 1, w: 0, d: 0, l: 1, gf: 0, ga: 3, gd: -3, pts: 0, form: ["L"] } }
    ],
    playerStats: {
      "wk1": { id: "wk1", name: "Aryan K.", team: "Bandra Boys", goals: 3, assists: 1, saves: 0, cleanSheets: 1, motm: 1, yellowCards: 0, redCards: 0, position: "ST" },
      "wk2": { id: "wk2", name: "Kabir M.", team: "South Bombay FC", goals: 2, assists: 0, saves: 0, cleanSheets: 0, motm: 1, yellowCards: 1, redCards: 0, position: "CAM" },
      "wk3": { id: "wk3", name: "Yash R.", team: "Bandra Boys", goals: 0, assists: 0, saves: 14, cleanSheets: 1, motm: 1, yellowCards: 0, redCards: 0, position: "GK" }
    },
    fixtures: [
      { id: "fix-301", matchday: "Final", teamA: "Bandra Boys", teamB: "South Bombay FC", date: "Saturday", time: "19:00" }
    ],
    completedMatches: [
      { id: "cm-301", matchday: "Semi-Final", teamA: "Bandra Boys", teamB: "Juhu Invincibles", scoreA: 3, scoreB: 0, date: "May 14" },
      { id: "cm-302", matchday: "Semi-Final", teamA: "South Bombay FC", teamB: "Andheri Allstars", scoreA: 2, scoreB: 1, date: "May 14" }
    ],
    matches: [],
    knockoutBracket: [
      [
        { nodeId: 1, tA: "Bandra Boys", tB: "Juhu Invincibles", matchId: "cm-301", winner: "Bandra Boys" },
        { nodeId: 2, tA: "South Bombay FC", tB: "Andheri Allstars", matchId: "cm-302", winner: "South Bombay FC" }
      ],
      [
        { nodeId: 3, tA: "Bandra Boys", tB: "South Bombay FC", matchId: "fix-301", winner: null }
      ]
    ]
  },
  {
    id: "demo-4",
    name: "Friday Night Football League",
    type: "LEAGUE",
    status: "ACTIVE",
    rules: { win: 3, draw: 1, loss: 0 },
    teams: [
      { id: "f1", name: "Night Owls", stats: { p: 6, w: 5, d: 1, l: 0, gf: 18, ga: 5, gd: 13, pts: 16, form: ["W", "W", "W", "D", "W"] } },
      { id: "f2", name: "Dark Knights", stats: { p: 6, w: 4, d: 0, l: 2, gf: 12, ga: 8, gd: 4, pts: 12, form: ["L", "W", "W", "L", "W"] } },
      { id: "f3", name: "Lunar Eclipse", stats: { p: 6, w: 3, d: 2, l: 1, gf: 9, ga: 6, gd: 3, pts: 11, form: ["W", "D", "D", "W", "L"] } },
      { id: "f4", name: "Stars FC", stats: { p: 6, w: 2, d: 1, l: 3, gf: 7, ga: 10, gd: -3, pts: 7, form: ["L", "L", "W", "D", "W"] } }
    ],
    playerStats: {
      "fn1": { id: "fn1", name: "Zaid F.", team: "Night Owls", goals: 9, assists: 4, saves: 0, cleanSheets: 2, motm: 4, yellowCards: 0, redCards: 0, position: "ST" },
      "fn2": { id: "fn2", name: "Tariq A.", team: "Dark Knights", goals: 6, assists: 2, saves: 0, cleanSheets: 1, motm: 2, yellowCards: 1, redCards: 0, position: "LW" },
      "fn3": { id: "fn3", name: "Rishabh S.", team: "Lunar Eclipse", goals: 4, assists: 5, saves: 0, cleanSheets: 2, motm: 1, yellowCards: 0, redCards: 0, position: "CAM" },
      "fn4": { id: "fn4", name: "Imran H.", team: "Night Owls", goals: 0, assists: 0, saves: 28, cleanSheets: 2, motm: 1, yellowCards: 0, redCards: 0, position: "GK" }
    },
    fixtures: [
      { id: "fix-401", matchday: "Matchday 7", teamA: "Night Owls", teamB: "Dark Knights", date: "Friday", time: "22:00" },
      { id: "fix-402", matchday: "Matchday 7", teamA: "Lunar Eclipse", teamB: "Stars FC", date: "Friday", time: "23:00" }
    ],
    completedMatches: [
      { id: "cm-401", matchday: "Matchday 6", teamA: "Night Owls", teamB: "Lunar Eclipse", scoreA: 2, scoreB: 2, date: "Last Friday" },
      { id: "cm-402", matchday: "Matchday 6", teamA: "Dark Knights", teamB: "Stars FC", scoreA: 3, scoreB: 1, date: "Last Friday" }
    ],
    matches: [],
    knockoutBracket: []
  },
  {
    id: "demo-5",
    name: "Local Derby Championship",
    type: "LEAGUE",
    status: "ACTIVE",
    rules: { win: 3, draw: 1, loss: 0 },
    teams: [
      { id: "ld1", name: "City Rivals", stats: { p: 3, w: 3, d: 0, l: 0, gf: 7, ga: 2, gd: 5, pts: 9, form: ["W", "W", "W"] } },
      { id: "ld2", name: "United Locals", stats: { p: 3, w: 1, d: 1, l: 1, gf: 4, ga: 4, gd: 0, pts: 4, form: ["W", "D", "L"] } },
      { id: "ld3", name: "Metro FC", stats: { p: 3, w: 0, d: 2, l: 1, gf: 3, ga: 5, gd: -2, pts: 2, form: ["D", "D", "L"] } },
      { id: "ld4", name: "Suburban Kings", stats: { p: 3, w: 0, d: 1, l: 2, gf: 1, ga: 4, gd: -3, pts: 1, form: ["D", "L", "L"] } }
    ],
    playerStats: {
      "ldp1": { id: "ldp1", name: "Karan V.", team: "City Rivals", goals: 4, assists: 1, saves: 0, cleanSheets: 1, motm: 2, yellowCards: 0, redCards: 0, position: "ST" },
      "ldp2": { id: "ldp2", name: "Dev M.", team: "United Locals", goals: 2, assists: 0, saves: 0, cleanSheets: 0, motm: 1, yellowCards: 1, redCards: 0, position: "CM" },
      "ldp3": { id: "ldp3", name: "Surya P.", team: "City Rivals", goals: 0, assists: 0, saves: 16, cleanSheets: 1, motm: 1, yellowCards: 0, redCards: 0, position: "GK" }
    },
    fixtures: [
      { id: "fix-501", matchday: "Matchday 4", teamA: "City Rivals", teamB: "Metro FC", date: "Sunday", time: "17:00" },
      { id: "fix-502", matchday: "Matchday 4", teamA: "United Locals", teamB: "Suburban Kings", date: "Sunday", time: "18:30" }
    ],
    completedMatches: [
      { id: "cm-501", matchday: "Matchday 3", teamA: "City Rivals", teamB: "United Locals", scoreA: 2, scoreB: 1, date: "Sunday" }
    ],
    matches: [],
    knockoutBracket: []
  }
];

const TournamentContext = createContext();

export function TournamentProvider({ children }) {
  const [tournaments, setTournaments] = useState(() => {
    const saved = localStorage.getItem("v2_tournaments");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("v2_tournaments", JSON.stringify(tournaments));
  }, [tournaments]);

  const createTournament = (tournamentData) => {
    const { name, type = "LEAGUE", rules = { win: 3, draw: 1, loss: 0 }, ...otherConfig } = tournamentData;
    const newTournament = {
      id: crypto.randomUUID(),
      name,
      type, // 'LEAGUE', 'KNOCKOUT', 'GROUP_STAGE', 'FRIENDLY'
      status: "DRAFT", // DRAFT, ACTIVE, COMPLETED
      rules,
      config: otherConfig,
      teams: [],
      playerStats: {},
      matches: [],
      knockoutBracket: [],
      fixtures: [],
      completedMatches: []
    };
    setTournaments(prev => [...prev, newTournament]);
    return newTournament.id;
  };

  const startTournament = (tournamentId) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      let bracket = [];
      let newFixtures = t.fixtures || [];
      
      if (t.type === "KNOCKOUT") {
        const numTeams = t.teams.length;
        const numRounds = Math.log2(numTeams);
        let matchCounter = 1;
        for (let r = 0; r < numRounds; r++) {
          const matchesInRound = numTeams / Math.pow(2, r + 1);
          let roundMatches = [];
          for (let m = 0; m < matchesInRound; m++) {
            roundMatches.push({
              nodeId: matchCounter++,
              tA: r === 0 ? t.teams[m * 2]?.name : null,
              tB: r === 0 ? t.teams[m * 2 + 1]?.name : null,
              matchId: null,
              winner: null
            });
          }
          bracket.push(roundMatches);
        }
      } else if (t.type === "LEAGUE" && (!t.fixtures || t.fixtures.length === 0)) {
        // Generate simple round-robin
        const teams = t.teams;
        let matchCount = 1;
        for (let i = 0; i < teams.length; i++) {
          for (let j = i + 1; j < teams.length; j++) {
            newFixtures.push({
              id: crypto.randomUUID(),
              matchday: `Matchday ${matchCount++}`,
              teamA: teams[i].name,
              teamB: teams[j].name,
              date: "TBD",
              time: "TBD"
            });
          }
        }
      }
      return { ...t, status: "ACTIVE", knockoutBracket: bracket, fixtures: newFixtures };
    }));
  };

  const addTeamToTournament = (tournamentId, teamData) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId) {
        if (!t.teams.find(tm => tm.name === teamData.name)) {
          return {
            ...t,
            teams: [...t.teams, {
              id: teamData.id || crypto.randomUUID(),
              name: teamData.name,
              stats: { p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] }
            }]
          };
        }
      }
      return t;
    }));
  };

  const addMatchToTournament = (tournamentId, matchId) => {
    setTournaments(prev => prev.map(t => {
      if (t.id === tournamentId && !t.matches.includes(matchId)) {
        return { ...t, matches: [...t.matches, matchId] };
      }
      return t;
    }));
  };

  const processTournamentMatch = (tournamentId, matchData) => {
    setTournaments(prev => prev.map(t => {
      if (t.id !== tournamentId) return t;
      
      const isMatchAlreadyProcessed = t.matches.includes(matchData.id); // For deduplication
      
      const updatedTeams = t.teams.map(team => {
        const isTeamA = matchData.teamA.name === team.name;
        const isTeamB = matchData.teamB.name === team.name;
        
        if (!isTeamA && !isTeamB) return team;

        const myScore = isTeamA ? matchData.teamA.score : matchData.teamB.score;
        const oppScore = isTeamA ? matchData.teamB.score : matchData.teamA.score;
        
        let isWin = myScore > oppScore;
        let isDraw = myScore === oppScore;
        let isLoss = myScore < oppScore;

        if (isDraw && (matchData.penaltiesA || matchData.penaltiesB)) {
          const myPens = isTeamA ? (matchData.penaltiesA || []).filter(p => p.isGoal).length : (matchData.penaltiesB || []).filter(p => p.isGoal).length;
          const oppPens = isTeamA ? (matchData.penaltiesB || []).filter(p => p.isGoal).length : (matchData.penaltiesA || []).filter(p => p.isGoal).length;
          if (myPens > oppPens) {
            isWin = true; isDraw = false;
          } else if (oppPens > myPens) {
            isLoss = true; isDraw = false;
          }
        }

        const resultStr = isWin ? "W" : isDraw ? "D" : "L";
        const pointsEarned = isWin ? t.rules.win : isDraw ? t.rules.draw : t.rules.loss;

        return {
          ...team,
          stats: {
            ...team.stats,
            p: team.stats.p + 1,
            w: team.stats.w + (isWin ? 1 : 0),
            d: team.stats.d + (isDraw ? 1 : 0),
            l: team.stats.l + (isLoss ? 1 : 0),
            gf: team.stats.gf + myScore,
            ga: team.stats.ga + oppScore,
            gd: team.stats.gd + (myScore - oppScore),
            pts: team.stats.pts + pointsEarned,
            form: [...team.stats.form, resultStr].slice(-5)
          }
        };
      });

      // Player Stats Processing
      let updatedPlayerStats = { ...(t.playerStats || {}) };
      
      const processPlayer = (player, teamName, opponentScore) => {
        if (!updatedPlayerStats[player.id]) {
          updatedPlayerStats[player.id] = {
            id: player.id,
            name: player.name,
            team: teamName,
            position: player.position || "UNASSIGNED",
            goals: 0,
            assists: 0,
            saves: 0,
            cleanSheets: 0,
            motm: 0,
            yellowCards: 0,
            redCards: 0
          };
        }
        const ps = updatedPlayerStats[player.id];
        ps.goals += (player.stats.goals || 0);
        ps.assists += (player.stats.assists || 0);
        ps.yellowCards += (player.stats.yellowCards || 0);
        ps.redCards += (player.stats.redCards || 0);
        ps.saves += (player.stats.saves || 0);
        if (player.id === matchData.motmId) ps.motm += 1;
        
        // Clean sheet for GK/DEF if oppScore === 0
        if (opponentScore === 0 && (player.position === "GK" || player.position === "CB" || player.position === "LB" || player.position === "RB")) {
          ps.cleanSheets += 1;
        }
      };

      matchData.teamA.players.forEach(p => processPlayer(p, matchData.teamA.name, matchData.teamB.score));
      matchData.teamB.players.forEach(p => processPlayer(p, matchData.teamB.name, matchData.teamA.score));

      let newBracket = [...t.knockoutBracket];
      if (t.type === "KNOCKOUT" && newBracket.length > 0) {
        let foundRoundIdx = -1;
        let foundMatchIdx = -1;
        let winningTeamName = matchData.teamA.score > matchData.teamB.score ? matchData.teamA.name : (matchData.teamB.score > matchData.teamA.score ? matchData.teamB.name : null);
        
        if (!winningTeamName && (matchData.penaltiesA || matchData.penaltiesB)) {
          const pensA = (matchData.penaltiesA || []).filter(p => p.isGoal).length;
          const pensB = (matchData.penaltiesB || []).filter(p => p.isGoal).length;
          if (pensA > pensB) winningTeamName = matchData.teamA.name;
          else if (pensB > pensA) winningTeamName = matchData.teamB.name;
        }

        if (winningTeamName) {
          for (let r = 0; r < newBracket.length; r++) {
            for (let m = 0; m < newBracket[r].length; m++) {
              if (newBracket[r][m].matchId === matchData.id || (newBracket[r][m].tA === matchData.teamA.name && newBracket[r][m].tB === matchData.teamB.name)) {
                foundRoundIdx = r;
                foundMatchIdx = m;
                newBracket[r][m].matchId = matchData.id;
                newBracket[r][m].winner = winningTeamName;
              }
            }
          }
          if (foundRoundIdx !== -1 && foundRoundIdx < newBracket.length - 1) {
            const nextRoundMatchIdx = Math.floor(foundMatchIdx / 2);
            const isTeamAForNext = foundMatchIdx % 2 === 0;
            if (isTeamAForNext) {
              newBracket[foundRoundIdx + 1][nextRoundMatchIdx].tA = winningTeamName;
            } else {
              newBracket[foundRoundIdx + 1][nextRoundMatchIdx].tB = winningTeamName;
            }
          }
        }
      }

      // Fixtures and Completed Matches update
      let updatedFixtures = [...(t.fixtures || [])];
      let updatedCompletedMatches = [...(t.completedMatches || [])];
      
      const fixtureIndex = updatedFixtures.findIndex(f => f.id === matchData.id || (f.teamA === matchData.teamA.name && f.teamB === matchData.teamB.name));
      let matchdayLabel = "Matchday";
      if (fixtureIndex !== -1) {
        matchdayLabel = updatedFixtures[fixtureIndex].matchday || "Matchday";
        updatedFixtures.splice(fixtureIndex, 1);
      }
      updatedCompletedMatches.push({
        id: matchData.id,
        matchday: matchdayLabel,
        teamA: matchData.teamA.name,
        teamB: matchData.teamB.name,
        scoreA: matchData.teamA.score,
        scoreB: matchData.teamB.score,
        penaltiesA: (matchData.penaltiesA || []).filter(p => p.isGoal).length,
        penaltiesB: (matchData.penaltiesB || []).filter(p => p.isGoal).length,
        hasPenalties: (matchData.penaltiesA?.length > 0 || matchData.penaltiesB?.length > 0),
        date: new Date().toLocaleDateString()
      });

      return { 
        ...t, 
        teams: updatedTeams, 
        knockoutBracket: newBracket,
        playerStats: updatedPlayerStats,
        matches: isMatchAlreadyProcessed ? t.matches : [...t.matches, matchData.id],
        fixtures: updatedFixtures,
        completedMatches: updatedCompletedMatches
      };
    }));
  };

  const finishTournament = (tournamentId) => {
    setTournaments(tournaments.map(t => t.id === tournamentId ? { ...t, status: "COMPLETED" } : t));
  };

  const getTournament = (id) => tournaments.find(t => t.id === id);

  return (
    <TournamentContext.Provider value={{ tournaments, createTournament, startTournament, addTeamToTournament, addMatchToTournament, processTournamentMatch, finishTournament, getTournament }}>
      {children}
    </TournamentContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTournaments = () => useContext(TournamentContext);
