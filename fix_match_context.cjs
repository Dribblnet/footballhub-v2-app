const fs = require('fs');
let code = fs.readFileSync('src/features/match/MatchContext.jsx', 'utf8');

// 1. undoEvent and redoEvent
const undoRedoOld = `  const undoEvent = (id) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id || !m.pastStates || m.pastStates.length === 0) return m;
      
      const pastStates = [...m.pastStates];
      const lastPast = pastStates.pop();
      const action = lastPast.actionDetails;
      
      let newM = { ...m, teamA: { ...m.teamA }, teamB: { ...m.teamB }, timeline: [...m.timeline] };
      
      if (action.type === "ADD_EVENT") {
        newM.timeline = newM.timeline.filter(e => e.id !== action.event.id);
        const eventData = action.event;
        if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY" || eventData.type === "PENALTY" || eventData.type === "BANGER" || (eventData.type === "FREEKICK" && eventData.isGoal)) {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) return { ...p, stats: { ...p.stats, goals: Math.max(0, (p.stats.goals || 0) - 1) } };
            if (p.id === eventData.assistPlayerId) return { ...p, stats: { ...p.stats, assists: Math.max(0, (p.stats.assists || 0) - 1) } };
            return p;
          });
        }
        if (eventData.type === "SAVE") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) return { ...p, stats: { ...p.stats, saves: Math.max(0, (p.stats.saves || 0) - 1) } };
            return p;
          });
        }
        if (eventData.type === "YELLOW_CARD" || eventData.type === "RED_CARD") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) {
               if (eventData.type === "YELLOW_CARD") return { ...p, stats: { ...p.stats, yellowCards: Math.max(0, (p.stats.yellowCards || 0) - 1) } };
               if (eventData.type === "RED_CARD") return { ...p, stats: { ...p.stats, redCards: Math.max(0, (p.stats.redCards || 0) - 1) } };
            }
            return p;
          });
        }
      } else if (action.type === "SUBSTITUTION") {
        newM.timeline = newM.timeline.filter(e => e.id !== action.eventId);
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        const playerOff = newM[teamKey].bench.find(p => p.id === action.playerOffId);
        const playerOn = newM[teamKey].players.find(p => p.id === action.playerOnId);
        if (playerOff && playerOn) {
          const newPlayers = newM[teamKey].players.map(p => p.id === action.playerOnId ? { ...playerOff, isSubbedOff: false } : p);
          const newBench = newM[teamKey].bench.map(p => p.id === action.playerOffId ? { ...playerOn } : p);
          newM[teamKey].players = newPlayers;
          newM[teamKey].bench = newBench;
        }
      } else if (action.type === "CAPTAIN_CHANGE") {
        newM.timeline = newM.timeline.filter(e => e.id !== action.eventId);
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        newM[teamKey].players = newM[teamKey].players.map(p => {
          if (p.id === action.newCapId) return { ...p, isCaptain: false };
          if (p.id === action.oldCapId) return { ...p, isCaptain: true };
          return p;
        });
        newM[teamKey].bench = newM[teamKey].bench.map(p => {
          if (p.id === action.newCapId) return { ...p, isCaptain: false };
          if (p.id === action.oldCapId) return { ...p, isCaptain: true };
          return p;
        });
      } else if (action.type === "GK_CHANGE") {
        newM.timeline = newM.timeline.filter(e => e.id !== action.eventId);
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        newM[teamKey].players = newM[teamKey].players.map(p => {
          if (p.id === action.newGkId) return { ...p, position: action.newGkOldPos || "UNASSIGNED" };
          if (p.id === action.oldGkId) return { ...p, position: "GK" };
          return p;
        });
      } else if (action.type === "PENALTY_SHOOTOUT") {
        const tK = action.team === "A" ? "penaltiesA" : "penaltiesB";
        if (newM[tK]) newM[tK] = newM[tK].filter(p => p.id !== action.penaltyId);
        newM.timeline = newM.timeline.filter(e => !action.eventIds.includes(e.id));
      }

      let scoreA = 0; let scoreB = 0;
      newM.timeline.forEach(e => {
        if (e.type === "GOAL" || e.type === "ASSISTED_GOAL" || e.type === "HEADER" || e.type === "VOLLEY" || e.type === "PENALTY" || e.type === "BANGER" || (e.type === "FREEKICK" && e.isGoal)) {
          if (e.team === "A") scoreA++;
          if (e.team === "B") scoreB++;
        }
        if (e.type === "OWN_GOAL") {
          if (e.team === "A") scoreB++;
          if (e.team === "B") scoreA++;
        }
      });
      newM.teamA.score = scoreA;
      newM.teamB.score = scoreB;
      
      return {
        ...newM,
        pastStates,
        futureStates: [...(m.futureStates || []), lastPast],
        auditLog: [...(m.auditLog || []), { action: "UNDONE", details: action, timestamp: Date.now() }]
      };
    }));
  };

  const redoEvent = (id) => {
    // Redo implies re-executing the action exactly.
    // Given the complexity of manually re-executing an action (e.g. generating timeline events again),
    // and the specific user request for 'undo', we'll disable complex redos for now or just pop the future states.
    // For a fully robust event stack, Redo would re-apply the forward action.
    toast.error("Redo is not available in event-by-event undo architecture yet.");
    return;
  };`;

const undoRedoNew = `  const undoEvent = (id) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id || !m.pastStates || m.pastStates.length === 0) return m;
      
      const pastStates = [...m.pastStates];
      const lastPast = pastStates.pop();
      const action = lastPast.actionDetails;
      
      let newM = { ...m, teamA: { ...m.teamA }, teamB: { ...m.teamB }, timeline: [...m.timeline] };
      
      let eventIdsToRemove = [];

      if (action.type === "ADD_EVENT") {
        eventIdsToRemove = action.timelineEvents ? action.timelineEvents.map(e => e.id) : [action.event.id];
        const eventData = action.event;
        if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY" || eventData.type === "PENALTY" || eventData.type === "BANGER" || (eventData.type === "FREEKICK" && eventData.isGoal)) {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) return { ...p, stats: { ...p.stats, goals: Math.max(0, (p.stats.goals || 0) - 1) } };
            if (p.id === eventData.assistPlayerId) return { ...p, stats: { ...p.stats, assists: Math.max(0, (p.stats.assists || 0) - 1) } };
            return p;
          });
        }
        if (eventData.type === "SAVE") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) return { ...p, stats: { ...p.stats, saves: Math.max(0, (p.stats.saves || 0) - 1) } };
            return p;
          });
        }
        if (eventData.type === "YELLOW_CARD" || eventData.type === "RED_CARD") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          const hasAutoRed = action.timelineEvents && action.timelineEvents.some(e => e.isAuto && e.type === "RED_CARD");
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) {
               const newStats = { ...p.stats };
               if (eventData.type === "YELLOW_CARD") newStats.yellowCards = Math.max(0, (newStats.yellowCards || 0) - 1);
               if (eventData.type === "RED_CARD" || hasAutoRed) newStats.redCards = Math.max(0, (newStats.redCards || 0) - 1);
               return { ...p, stats: newStats };
            }
            return p;
          });
        }
      } else if (action.type === "SUBSTITUTION") {
        eventIdsToRemove = [action.eventId];
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        const playerOff = newM[teamKey].bench.find(p => p.id === action.playerOffId);
        const playerOn = newM[teamKey].players.find(p => p.id === action.playerOnId);
        if (playerOff && playerOn) {
          const newPlayers = newM[teamKey].players.map(p => p.id === action.playerOnId ? { ...playerOff, isSubbedOff: false } : p);
          const newBench = newM[teamKey].bench.map(p => p.id === action.playerOffId ? { ...playerOn } : p);
          newM[teamKey].players = newPlayers;
          newM[teamKey].bench = newBench;
        }
      } else if (action.type === "CAPTAIN_CHANGE") {
        eventIdsToRemove = [action.eventId];
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        newM[teamKey].players = newM[teamKey].players.map(p => {
          if (p.id === action.newCapId) return { ...p, isCaptain: false };
          if (p.id === action.oldCapId) return { ...p, isCaptain: true };
          return p;
        });
        newM[teamKey].bench = newM[teamKey].bench.map(p => {
          if (p.id === action.newCapId) return { ...p, isCaptain: false };
          if (p.id === action.oldCapId) return { ...p, isCaptain: true };
          return p;
        });
      } else if (action.type === "GK_CHANGE") {
        eventIdsToRemove = [action.eventId];
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        newM[teamKey].players = newM[teamKey].players.map(p => {
          if (p.id === action.newGkId) return { ...p, position: action.newGkOldPos || "UNASSIGNED" };
          if (p.id === action.oldGkId) return { ...p, position: "GK" };
          return p;
        });
        newM[teamKey].bench = newM[teamKey].bench.map(p => {
          if (p.id === action.newGkId) return { ...p, position: action.newGkOldPos || "UNASSIGNED" };
          if (p.id === action.oldGkId) return { ...p, position: "GK" };
          return p;
        });
      } else if (action.type === "PENALTY_SHOOTOUT") {
        eventIdsToRemove = action.eventIds;
        const tK = action.team === "A" ? "penaltiesA" : "penaltiesB";
        if (newM[tK]) newM[tK] = newM[tK].filter(p => p.id !== action.penaltyId);
      }

      newM.timeline = newM.timeline.filter(e => !eventIdsToRemove.includes(e.id));

      let scoreA = 0; let scoreB = 0;
      newM.timeline.forEach(e => {
        if (e.type === "GOAL" || e.type === "ASSISTED_GOAL" || e.type === "HEADER" || e.type === "VOLLEY" || e.type === "PENALTY" || e.type === "BANGER" || (e.type === "FREEKICK" && e.isGoal)) {
          if (e.team === "A") scoreA++;
          if (e.team === "B") scoreB++;
        }
        if (e.type === "OWN_GOAL") {
          if (e.team === "A") scoreB++;
          if (e.team === "B") scoreA++;
        }
      });
      newM.teamA.score = scoreA;
      newM.teamB.score = scoreB;
      
      return {
        ...newM,
        pastStates,
        futureStates: [...(m.futureStates || []), lastPast],
        auditLog: [...(m.auditLog || []), { action: "UNDONE", details: action, timestamp: Date.now() }]
      };
    }));
  };

  const redoEvent = (id) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id || !m.futureStates || m.futureStates.length === 0) return m;

      const futureStates = [...m.futureStates];
      const nextFuture = futureStates.pop();
      const action = nextFuture.actionDetails;
      
      let newM = { ...m, teamA: { ...m.teamA }, teamB: { ...m.teamB }, timeline: [...m.timeline] };
      let eventsToAdd = [];

      if (action.type === "ADD_EVENT") {
        eventsToAdd = action.timelineEvents || [];
        const eventData = action.event;
        if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY" || eventData.type === "PENALTY" || eventData.type === "BANGER" || (eventData.type === "FREEKICK" && eventData.isGoal)) {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) return { ...p, stats: { ...p.stats, goals: (p.stats.goals || 0) + 1 } };
            if (p.id === eventData.assistPlayerId) return { ...p, stats: { ...p.stats, assists: (p.stats.assists || 0) + 1 } };
            return p;
          });
        }
        if (eventData.type === "SAVE") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) return { ...p, stats: { ...p.stats, saves: (p.stats.saves || 0) + 1 } };
            return p;
          });
        }
        if (eventData.type === "YELLOW_CARD" || eventData.type === "RED_CARD") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          const hasAutoRed = action.timelineEvents && action.timelineEvents.some(e => e.isAuto && e.type === "RED_CARD");
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) {
               const newStats = { ...p.stats };
               if (eventData.type === "YELLOW_CARD") newStats.yellowCards = (newStats.yellowCards || 0) + 1;
               if (eventData.type === "RED_CARD" || hasAutoRed) newStats.redCards = (newStats.redCards || 0) + 1;
               return { ...p, stats: newStats };
            }
            return p;
          });
        }
      } else if (action.type === "SUBSTITUTION") {
        eventsToAdd = action.timelineEvent ? [action.timelineEvent] : [];
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        const playerOff = newM[teamKey].players.find(p => p.id === action.playerOffId);
        const playerOn = newM[teamKey].bench.find(p => p.id === action.playerOnId);
        if (playerOff && playerOn) {
          const newPlayers = newM[teamKey].players.map(p => p.id === action.playerOffId ? { ...playerOn, isSubbedOff: false } : p);
          const newBench = newM[teamKey].bench.map(p => p.id === action.playerOnId ? { ...playerOff, isSubbedOff: true } : p);
          newM[teamKey].players = newPlayers;
          newM[teamKey].bench = newBench;
        }
      } else if (action.type === "CAPTAIN_CHANGE") {
        eventsToAdd = action.timelineEvent ? [action.timelineEvent] : [];
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        newM[teamKey].players = newM[teamKey].players.map(p => {
          if (p.id === action.newCapId) return { ...p, isCaptain: true };
          if (p.id === action.oldCapId) return { ...p, isCaptain: false };
          return p;
        });
        newM[teamKey].bench = newM[teamKey].bench.map(p => {
          if (p.id === action.newCapId) return { ...p, isCaptain: true };
          if (p.id === action.oldCapId) return { ...p, isCaptain: false };
          return p;
        });
      } else if (action.type === "GK_CHANGE") {
        eventsToAdd = action.timelineEvent ? [action.timelineEvent] : [];
        const teamKey = action.team === "A" ? "teamA" : "teamB";
        newM[teamKey].players = newM[teamKey].players.map(p => {
          if (p.id === action.newGkId) return { ...p, position: "GK" };
          if (p.id === action.oldGkId) return { ...p, position: action.newGkOldPos || "UNASSIGNED" };
          return p;
        });
        newM[teamKey].bench = newM[teamKey].bench.map(p => {
          if (p.id === action.newGkId) return { ...p, position: "GK" };
          if (p.id === action.oldGkId) return { ...p, position: action.newGkOldPos || "UNASSIGNED" };
          return p;
        });
      } else if (action.type === "PENALTY_SHOOTOUT") {
        eventsToAdd = action.eventIds ? action.eventIds.map(id => action.timelineEvents.find(e => e.id === id)) : [];
        const tK = action.team === "A" ? "penaltiesA" : "penaltiesB";
        newM[tK] = [...(newM[tK] || []), { id: action.penaltyId, playerId: action.playerId, playerName: action.playerName, isGoal: action.isGoal, shotType: action.shotType, placement: action.placement, result: action.result }];
      }

      newM.timeline = [...newM.timeline, ...eventsToAdd].sort((a, b) => a.timestamp - b.timestamp);

      let scoreA = 0; let scoreB = 0;
      newM.timeline.forEach(e => {
        if (e.type === "GOAL" || e.type === "ASSISTED_GOAL" || e.type === "HEADER" || e.type === "VOLLEY" || e.type === "PENALTY" || e.type === "BANGER" || (e.type === "FREEKICK" && e.isGoal)) {
          if (e.team === "A") scoreA++;
          if (e.team === "B") scoreB++;
        }
        if (e.type === "OWN_GOAL") {
          if (e.team === "A") scoreB++;
          if (e.team === "B") scoreA++;
        }
      });
      newM.teamA.score = scoreA;
      newM.teamB.score = scoreB;
      
      return {
        ...newM,
        pastStates: [...(m.pastStates || []), nextFuture],
        futureStates,
        auditLog: [...(m.auditLog || []), { action: "REDONE", details: action, timestamp: Date.now() }]
      };
    }));
  };`;

// 2. setCaptain
const setCapOld = `        if (newCap && oldCap && newCap.id !== oldCap.id) {
          snapshotM = pushState(m, { type: "CAPTAIN_CHANGE", team, playerId });
          timelineAdditions.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: "CAPTAIN_CHANGE",
            team,
            playerId: newCap.id,
            playerName: newCap.name,
            assistPlayerId: oldCap.id,
            assistPlayerName: oldCap.name,
            minute: matchMinute,
            commentary: \`Captain switched to \${newCap.name}\`
          });
        }`;
const setCapNew = `        if (newCap && oldCap && newCap.id !== oldCap.id) {
          const eventId = crypto.randomUUID();
          const timelineEvent = {
            id: eventId,
            timestamp: Date.now(),
            type: "CAPTAIN_CHANGE",
            team,
            playerId: newCap.id,
            playerName: newCap.name,
            assistPlayerId: oldCap.id,
            assistPlayerName: oldCap.name,
            minute: matchMinute,
            commentary: \`Captain switched to \${newCap.name}\`
          };
          snapshotM = pushState(m, { type: "CAPTAIN_CHANGE", team, oldCapId: oldCap.id, newCapId: newCap.id, eventId, timelineEvent });
          timelineAdditions.push(timelineEvent);
        }`;

// 3. setGoalkeeper
const setGkOld = `        if (newGk && oldGk && newGk.id !== oldGk.id) {
          snapshotM = pushState(m, { type: "GK_CHANGE", team, playerId });
          timelineAdditions.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: "GK_CHANGE",
            team,
            playerId: newGk.id,
            playerName: newGk.name,
            assistPlayerId: oldGk.id,
            assistPlayerName: oldGk.name,
            minute: matchMinute,
            commentary: \`Goalkeeper changed: \${oldGk.name} → \${newGk.name}\`
          });
        }`;
const setGkNew = `        if (newGk && oldGk && newGk.id !== oldGk.id) {
          const eventId = crypto.randomUUID();
          const timelineEvent = {
            id: eventId,
            timestamp: Date.now(),
            type: "GK_CHANGE",
            team,
            playerId: newGk.id,
            playerName: newGk.name,
            assistPlayerId: oldGk.id,
            assistPlayerName: oldGk.name,
            minute: matchMinute,
            commentary: \`Goalkeeper changed: \${oldGk.name} → \${newGk.name}\`
          };
          snapshotM = pushState(m, { type: "GK_CHANGE", team, oldGkId: oldGk.id, newGkId: newGk.id, newGkOldPos: newGk.position, eventId, timelineEvent });
          timelineAdditions.push(timelineEvent);
        }`;

// 4. substitute
const subOld = `      const snapshotM = pushState(m, { type: "SUBSTITUTION", team, playerOffId, playerOnId });

      const pOff = { ...offPlayer, isSubbedOff: true, isCaptain: false };
      const pOn = { ...onPlayer, top: offPlayer.top, left: offPlayer.left, position: offPlayer.position, isCaptain: offPlayer.isCaptain };

      const newPlayers = [...snapshotM[teamKey].players];
      newPlayers[pOffIndex] = pOn; // Swap player into pitch array

      const newBench = [...snapshotM[teamKey].bench];
      newBench[pOnIndex] = pOff; // Swap off player to bench array

      // Calculate current minute accurately
      let currentMs = snapshotM.timerState.accumulatedTime;
      if (snapshotM.state === "LIVE" && snapshotM.timerState.startTime) {
        currentMs += (Date.now() - snapshotM.timerState.startTime);
      }
      const matchMinute = Math.floor(currentMs / 60000);

      // Add to timeline
      const subEvent = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        type: "SUBSTITUTION",
        team,
        playerId: pOn.id,
        playerName: pOn.name,
        assistPlayerId: pOff.id,
        assistPlayerName: pOff.name,
        minute: matchMinute || 0
      };

      return { 
        ...snapshotM, 
        timeline: [...snapshotM.timeline, subEvent],
        [teamKey]: { ...snapshotM[teamKey], players: newPlayers, bench: newBench } 
      };`;
const subNew = `      // Calculate current minute accurately
      let currentMs = m.timerState.accumulatedTime;
      if (m.state === "LIVE" && m.timerState.startTime) {
        currentMs += (Date.now() - m.timerState.startTime);
      }
      const matchMinute = Math.floor(currentMs / 60000);

      const eventId = crypto.randomUUID();
      const subEvent = {
        id: eventId,
        timestamp: Date.now(),
        type: "SUBSTITUTION",
        team,
        playerId: pOn.id,
        playerName: pOn.name,
        assistPlayerId: pOff.id,
        assistPlayerName: pOff.name,
        minute: matchMinute || 0
      };

      const snapshotM = pushState(m, { type: "SUBSTITUTION", team, playerOffId, playerOnId, eventId, timelineEvent: subEvent });

      const pOff = { ...offPlayer, isSubbedOff: true, isCaptain: false };
      const pOn = { ...onPlayer, top: offPlayer.top, left: offPlayer.left, position: offPlayer.position, isCaptain: offPlayer.isCaptain };

      const newPlayers = [...snapshotM[teamKey].players];
      newPlayers[pOffIndex] = pOn; // Swap player into pitch array

      const newBench = [...snapshotM[teamKey].bench];
      newBench[pOnIndex] = pOff; // Swap off player to bench array

      return { 
        ...snapshotM, 
        timeline: [...snapshotM.timeline, subEvent],
        [teamKey]: { ...snapshotM[teamKey], players: newPlayers, bench: newBench } 
      };`;

// 5. finishMatch
const finOld = `        finalizedMatch = {
          ...m,
          state: "FINISHED",
          teamA: { ...m.teamA, score: scoreA, normalTimeScore: normalTimeScoreA, extraTimeScore: extraTimeScoreA, players: ratedTeamA },
          teamB: { ...m.teamB, score: scoreB, normalTimeScore: normalTimeScoreB, extraTimeScore: extraTimeScoreB, players: ratedTeamB },
          winningMethod,
          motmId: motmPlayer ? motmPlayer.id : null,
          motmName: motmPlayer ? motmPlayer.name : null
        };`;
const finNew = `        let penaltyScoreA = m.penaltiesA ? m.penaltiesA.filter(p => p.isGoal).length : 0;
        let penaltyScoreB = m.penaltiesB ? m.penaltiesB.filter(p => p.isGoal).length : 0;

        finalizedMatch = {
          ...m,
          state: "FINISHED",
          teamA: { ...m.teamA, score: scoreA, normalTimeScore: normalTimeScoreA, extraTimeScore: extraTimeScoreA, penaltyScore: penaltyScoreA, players: ratedTeamA },
          teamB: { ...m.teamB, score: scoreB, normalTimeScore: normalTimeScoreB, extraTimeScore: extraTimeScoreB, penaltyScore: penaltyScoreB, players: ratedTeamB },
          winningMethod,
          motmId: motmPlayer ? motmPlayer.id : null,
          motmName: motmPlayer ? motmPlayer.name : null
        };`;

// 6. addEvent
const addEvOld = `      let currentMatch = prevMatches[matchIndex];
      const newEventId = crypto.randomUUID();
      const eventToRecord = { id: newEventId, timestamp: Date.now(), ...eventData };
      
      currentMatch = pushState(currentMatch, { type: "ADD_EVENT", event: eventToRecord });
      
      let currentMs = currentMatch.timerState.accumulatedTime;
      if (currentMatch.state === "LIVE" && currentMatch.timerState.startTime) {
        currentMs += (Date.now() - currentMatch.timerState.startTime);
      }
      const matchMinute = Math.floor(currentMs / 60000);`;
const addEvNew = `      let currentMatch = prevMatches[matchIndex];
      const newEventId = crypto.randomUUID();
      const eventToRecord = { id: newEventId, timestamp: Date.now(), ...eventData };
      
      let currentMs = currentMatch.timerState.accumulatedTime;
      if (currentMatch.state === "LIVE" && currentMatch.timerState.startTime) {
        currentMs += (Date.now() - currentMatch.timerState.startTime);
      }
      const matchMinute = Math.floor(currentMs / 60000);`;

const addEvStateOld = `      const newState = { 
        ...currentMatch, 
        teamA: { ...currentMatch.teamA }, 
        teamB: { ...currentMatch.teamB },
        timeline: [...currentMatch.timeline, newEvent] 
      };

      if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY" || eventData.type === "PENALTY" || eventData.type === "BANGER" || (eventData.type === "FREEKICK" && eventData.isGoal)) {`;
const addEvStateNew = `      let timelineEvents = [newEvent];
      let shouldAddAutoRed = false;
      const tK = eventData.team === "A" ? "teamA" : "teamB";
      
      if (eventData.type === "RED_CARD" || eventData.type === "YELLOW_CARD") {
        const player = currentMatch[tK].players.find(p => p.id === eventData.playerId);
        if (player) {
           const isRed = eventData.type === "RED_CARD";
           const newYellows = !isRed ? (player.stats.yellowCards || 0) + 1 : (player.stats.yellowCards || 0);
           if (newYellows >= 2 && !isRed) {
             shouldAddAutoRed = true;
           }
        }
      }
      
      if (shouldAddAutoRed) {
         timelineEvents.push({
            id: crypto.randomUUID(),
            timestamp: Date.now() + 1,
            type: "RED_CARD",
            team: eventData.team,
            playerId: eventData.playerId,
            playerName: eventData.playerName,
            minute: matchMinute,
            isAuto: true
         });
      }
      
      currentMatch = pushState(currentMatch, { type: "ADD_EVENT", event: eventToRecord, timelineEvents });

      const newState = { 
        ...currentMatch, 
        teamA: { ...currentMatch.teamA }, 
        teamB: { ...currentMatch.teamB },
        timeline: [...currentMatch.timeline, ...timelineEvents] 
      };

      if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY" || eventData.type === "PENALTY" || eventData.type === "BANGER" || (eventData.type === "FREEKICK" && eventData.isGoal)) {`;

const addEvAutoRedOld = `        if (shouldAddAutoRed) {
          newState.timeline.push({
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            type: "RED_CARD",
            team: eventData.team,
            playerId: eventData.playerId,
            playerName: eventData.playerName,
            minute: matchMinute,
            isAuto: true
          });
        }`;
const addEvAutoRedNew = `        // Auto red timeline event is already pushed above`;

const recordPenaltyOld = `      const snapshotM = pushState(m, { type: "PENALTY_SHOOTOUT", team, playerId, playerName, isGoal, result, penaltyId, eventIds });
      const teamKey = team === "A" ? "penaltiesA" : "penaltiesB";
      const opposingTeam = team === "A" ? snapshotM.teamB : snapshotM.teamA;
      
      const newEvent = {
        id: newEventId,
        timestamp: Date.now(),
        type: "PENALTY_SHOOTOUT",
        team,
        playerId,
        playerName,
        isGoal,
        shotType,
        placement,
        result,
        minute: snapshotM.duration + (snapshotM.extraTimeDuration || 0)
      };

      const timelineEvents = [newEvent];
      if (result === "Saved") {
        const gk = opposingTeam.players.find(p => p.position === "GK");
        if (gk) {
          timelineEvents.push({
            id: saveEventId,
            timestamp: Date.now() + 1,
            type: "SAVE",
            team: team === "A" ? "B" : "A",
            playerId: gk.id,
            playerName: gk.name,
            minute: newEvent.minute,
            saveQuality: "Penalty Save"
          });
        }
      }`;

const recordPenaltyNew = `      const teamKey = team === "A" ? "penaltiesA" : "penaltiesB";
      const opposingTeam = team === "A" ? m.teamB : m.teamA;
      
      const newEvent = {
        id: newEventId,
        timestamp: Date.now(),
        type: "PENALTY_SHOOTOUT",
        team,
        playerId,
        playerName,
        isGoal,
        shotType,
        placement,
        result,
        minute: m.duration + (m.extraTimeDuration || 0)
      };

      const timelineEvents = [newEvent];
      if (result === "Saved") {
        const gk = opposingTeam.players.find(p => p.position === "GK");
        if (gk) {
          timelineEvents.push({
            id: saveEventId,
            timestamp: Date.now() + 1,
            type: "SAVE",
            team: team === "A" ? "B" : "A",
            playerId: gk.id,
            playerName: gk.name,
            minute: newEvent.minute,
            saveQuality: "Penalty Save"
          });
        }
      }
      
      const snapshotM = pushState(m, { type: "PENALTY_SHOOTOUT", team, playerId, playerName, isGoal, result, penaltyId, eventIds, timelineEvents, shotType, placement });`;


if (!code.includes(undoRedoOld.substring(0, 100))) { console.log("Cannot find undoRedoOld"); } else { code = code.replace(undoRedoOld, undoRedoNew); }
if (!code.includes(setCapOld.substring(0, 100))) { console.log("Cannot find setCapOld"); } else { code = code.replace(setCapOld, setCapNew); }
if (!code.includes(setGkOld.substring(0, 100))) { console.log("Cannot find setGkOld"); } else { code = code.replace(setGkOld, setGkNew); }
if (!code.includes(subOld.substring(0, 100))) { console.log("Cannot find subOld"); } else { code = code.replace(subOld, subNew); }
if (!code.includes(finOld.substring(0, 100))) { console.log("Cannot find finOld"); } else { code = code.replace(finOld, finNew); }
if (!code.includes(addEvOld.substring(0, 100))) { console.log("Cannot find addEvOld"); } else { code = code.replace(addEvOld, addEvNew); }
if (!code.includes(addEvStateOld.substring(0, 100))) { console.log("Cannot find addEvStateOld"); } else { code = code.replace(addEvStateOld, addEvStateNew); }
if (!code.includes(addEvAutoRedOld.substring(0, 100))) { console.log("Cannot find addEvAutoRedOld"); } else { code = code.replace(addEvAutoRedOld, addEvAutoRedNew); }
if (!code.includes(recordPenaltyOld.substring(0, 100))) { console.log("Cannot find recordPenaltyOld"); } else { code = code.replace(recordPenaltyOld, recordPenaltyNew); }

fs.writeFileSync('src/features/match/MatchContext.jsx', code);
console.log('MatchContext.jsx updated.');
