const fs = require('fs');
let code = fs.readFileSync('src/features/match/MatchContext.jsx', 'utf8');

const updateMatchStateOld = `      const addStateTimelineEvent = (typeText) => {
        newTimeline.push({
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          type: "MATCH_STATE_CHANGE",
          commentary: typeText,
          minute: matchMinute
        });
      };

      if (newState === "FULL_TIME" && m.state !== "FULL_TIME") {
        addStateTimelineEvent("Full Time");
      } else if (newState === "EXTRA_TIME_FIRST_HALF" && m.state !== "EXTRA_TIME_FIRST_HALF") {
        addStateTimelineEvent("Extra Time Started");
      } else if (newState === "EXTRA_TIME_HALFTIME" && m.state !== "EXTRA_TIME_HALFTIME") {
        addStateTimelineEvent("Extra Time Half Time");
      } else if (newState === "EXTRA_TIME_FINISHED" && m.state !== "EXTRA_TIME_FINISHED") {
        addStateTimelineEvent("Extra Time Finished");
      } else if (newState === "PENALTY_SHOOTOUT" && m.state !== "PENALTY_SHOOTOUT") {
        addStateTimelineEvent("Penalty Shootout Started");
      }

      return { ...m, state: newState, timerState: updatedTimerState, timeline: newTimeline };`;
const updateMatchStateNew = `      let timelineEvent = null;
      let timelineEventId = null;

      const addStateTimelineEvent = (typeText) => {
        timelineEventId = crypto.randomUUID();
        timelineEvent = {
          id: timelineEventId,
          timestamp: Date.now(),
          type: "MATCH_STATE_CHANGE",
          commentary: typeText,
          minute: matchMinute
        };
        newTimeline.push(timelineEvent);
      };

      if (newState === "FULL_TIME" && m.state !== "FULL_TIME") {
        addStateTimelineEvent("Full Time");
      } else if (newState === "EXTRA_TIME_FIRST_HALF" && m.state !== "EXTRA_TIME_FIRST_HALF") {
        addStateTimelineEvent("Extra Time Started");
      } else if (newState === "EXTRA_TIME_HALFTIME" && m.state !== "EXTRA_TIME_HALFTIME") {
        addStateTimelineEvent("Extra Time Half Time");
      } else if (newState === "EXTRA_TIME_FINISHED" && m.state !== "EXTRA_TIME_FINISHED") {
        addStateTimelineEvent("Extra Time Finished");
      } else if (newState === "PENALTY_SHOOTOUT" && m.state !== "PENALTY_SHOOTOUT") {
        addStateTimelineEvent("Penalty Shootout Started");
      }

      const snapshotM = pushState(m, { type: "MATCH_STATE_CHANGE", oldState: m.state, newState, oldTimerState: m.timerState, newTimerState: updatedTimerState, timelineEventId, timelineEvent });

      return { ...snapshotM, state: newState, timerState: updatedTimerState, timeline: newTimeline };`;

const setMatchHalfOld = `  const setMatchHalf = (id, halfNumber) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      return { 
        ...m, 
        half: halfNumber, 
        stoppagePromptShown: false,
        timerState: { ...m.timerState, accumulatedTime: (halfNumber - 1) * (m.duration / 2) * 60000, startTime: null } 
      };
    }));
  };`;
const setMatchHalfNew = `  const setMatchHalf = (id, halfNumber) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      const newTimerState = { ...m.timerState, accumulatedTime: (halfNumber - 1) * (m.duration / 2) * 60000, startTime: null };
      const snapshotM = pushState(m, { type: "SET_MATCH_HALF", oldHalf: m.half, newHalf: halfNumber, oldPrompt: m.stoppagePromptShown, newPrompt: false, oldTimerState: m.timerState, newTimerState });
      return { 
        ...snapshotM, 
        half: halfNumber, 
        stoppagePromptShown: false,
        timerState: newTimerState
      };
    }));
  };`;

const addStoppageOld = `  const addStoppageTime = (id, halfNumber, minutes) => {
    setMatches(prevMatches => prevMatches.map(m => m.id === id ? { ...m, [\`stoppageTime\${halfNumber}\`]: minutes, stoppagePromptShown: true } : m));
  };`;
const addStoppageNew = `  const addStoppageTime = (id, halfNumber, minutes) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      const snapshotM = pushState(m, { type: "ADD_STOPPAGE_TIME", halfNumber, oldMinutes: m[\`stoppageTime\${halfNumber}\`], newMinutes: minutes, oldPrompt: m.stoppagePromptShown, newPrompt: true });
      return { ...snapshotM, [\`stoppageTime\${halfNumber}\`]: minutes, stoppagePromptShown: true };
    }));
  };`;

const addExtraOld = `  const addExtraTime = (id, minutes) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      const snapshotM = pushState(m, { type: "EXTRA_TIME", minutes });
      return { 
        ...snapshotM, 
        extraTimeDuration: minutes,
        state: "EXTRA_TIME_FIRST_HALF",
        half: 3,
        timerState: { ...snapshotM.timerState, accumulatedTime: snapshotM.duration * 60000, startTime: Date.now() }
      };
    }));
  };`;
const addExtraNew = `  const addExtraTime = (id, minutes) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      const newTimerState = { ...m.timerState, accumulatedTime: m.duration * 60000, startTime: Date.now() };
      const snapshotM = pushState(m, { type: "EXTRA_TIME", oldMinutes: m.extraTimeDuration, newMinutes: minutes, oldState: m.state, newState: "EXTRA_TIME_FIRST_HALF", oldHalf: m.half, newHalf: 3, oldTimerState: m.timerState, newTimerState });
      return { 
        ...snapshotM, 
        extraTimeDuration: minutes,
        state: "EXTRA_TIME_FIRST_HALF",
        half: 3,
        timerState: newTimerState
      };
    }));
  };`;

const finishOld = `        // Add Penalty Shootout Finished event if there were penalties
        if (m.state === "PENALTY_SHOOTOUT" || m.penaltiesA?.length > 0 || m.penaltiesB?.length > 0) {
           m.timeline.push({
             id: crypto.randomUUID(),
             timestamp: Date.now(),
             type: "MATCH_STATE_CHANGE",
             commentary: "Penalty Shootout Finished",
             minute: m.duration + (m.extraTimeDuration || 0)
           });
        }

        // --- RATING & MOTM CALCULATION ---`;
const finishNew = `        let timelineEventId = null;
        let timelineEvent = null;
        const newTimeline = [...m.timeline];
        if (m.state === "PENALTY_SHOOTOUT" || m.penaltiesA?.length > 0 || m.penaltiesB?.length > 0) {
           timelineEventId = crypto.randomUUID();
           timelineEvent = {
             id: timelineEventId,
             timestamp: Date.now(),
             type: "MATCH_STATE_CHANGE",
             commentary: "Penalty Shootout Finished",
             minute: m.duration + (m.extraTimeDuration || 0)
           };
           newTimeline.push(timelineEvent);
        }

        // --- RATING & MOTM CALCULATION ---`;

const finishOld2 = `        let penaltyScoreA = m.penaltiesA ? m.penaltiesA.filter(p => p.isGoal).length : 0;
        let penaltyScoreB = m.penaltiesB ? m.penaltiesB.filter(p => p.isGoal).length : 0;

        finalizedMatch = {
          ...m,
          state: "FINISHED",
          teamA: { ...m.teamA, score: scoreA, normalTimeScore: normalTimeScoreA, extraTimeScore: extraTimeScoreA, penaltyScore: penaltyScoreA, players: ratedTeamA },
          teamB: { ...m.teamB, score: scoreB, normalTimeScore: normalTimeScoreB, extraTimeScore: extraTimeScoreB, penaltyScore: penaltyScoreB, players: ratedTeamB },
          winningMethod,
          motmId: motmPlayer ? motmPlayer.id : null,
          motmName: motmPlayer ? motmPlayer.name : null
        };

        // Add MOTM stat point before committing
        if (motmPlayer) {
          const mTeam = finalizedMatch.teamA.players.find(p => p.id === motmPlayer.id) ? finalizedMatch.teamA : finalizedMatch.teamB;
          mTeam.players = mTeam.players.map(p => p.id === motmPlayer.id ? { ...p, stats: { ...p.stats, motm: (p.stats.motm || 0) + 1 } } : p);
        }

        commitMatchStats(finalizedMatch);
        commitMatchStatsToTeams(finalizedMatch);
        
        return finalizedMatch;`;
const finishNew2 = `        let penaltyScoreA = m.penaltiesA ? m.penaltiesA.filter(p => p.isGoal).length : 0;
        let penaltyScoreB = m.penaltiesB ? m.penaltiesB.filter(p => p.isGoal).length : 0;

        const newTeamA = { ...m.teamA, score: scoreA, normalTimeScore: normalTimeScoreA, extraTimeScore: extraTimeScoreA, penaltyScore: penaltyScoreA, players: ratedTeamA };
        const newTeamB = { ...m.teamB, score: scoreB, normalTimeScore: normalTimeScoreB, extraTimeScore: extraTimeScoreB, penaltyScore: penaltyScoreB, players: ratedTeamB };
        const newMotmId = motmPlayer ? motmPlayer.id : null;
        const newMotmName = motmPlayer ? motmPlayer.name : null;

        const snapshotM = pushState(m, { 
          type: "FINISH_MATCH", 
          oldState: m.state, newState: "FINISHED", 
          oldTeamA: m.teamA, oldTeamB: m.teamB,
          newTeamA, newTeamB,
          oldWinningMethod: m.winningMethod, newWinningMethod: winningMethod,
          oldMotmId: m.motmId, newMotmId,
          oldMotmName: m.motmName, newMotmName,
          timelineEventId, timelineEvent
        });

        finalizedMatch = {
          ...snapshotM,
          state: "FINISHED",
          teamA: newTeamA,
          teamB: newTeamB,
          winningMethod,
          motmId: newMotmId,
          motmName: newMotmName,
          timeline: newTimeline
        };

        // Add MOTM stat point before committing
        if (motmPlayer) {
          const mTeam = finalizedMatch.teamA.players.find(p => p.id === motmPlayer.id) ? finalizedMatch.teamA : finalizedMatch.teamB;
          mTeam.players = mTeam.players.map(p => p.id === motmPlayer.id ? { ...p, stats: { ...p.stats, motm: (p.stats.motm || 0) + 1 } } : p);
        }

        commitMatchStats(finalizedMatch);
        commitMatchStatsToTeams(finalizedMatch);
        
        return finalizedMatch;`;

const undoOld = `      } else if (action.type === "PENALTY_SHOOTOUT") {
        eventIdsToRemove = action.eventIds;
        const tK = action.team === "A" ? "penaltiesA" : "penaltiesB";
        if (newM[tK]) newM[tK] = newM[tK].filter(p => p.id !== action.penaltyId);
      }`;
const undoNew = `      } else if (action.type === "PENALTY_SHOOTOUT") {
        eventIdsToRemove = action.eventIds;
        const tK = action.team === "A" ? "penaltiesA" : "penaltiesB";
        if (newM[tK]) newM[tK] = newM[tK].filter(p => p.id !== action.penaltyId);
      } else if (action.type === "MATCH_STATE_CHANGE") {
        if (action.timelineEventId) {
          eventIdsToRemove = [action.timelineEventId];
        }
        newM.state = action.oldState;
        newM.timerState = action.oldTimerState;
      } else if (action.type === "SET_MATCH_HALF") {
        newM.half = action.oldHalf;
        newM.stoppagePromptShown = action.oldPrompt;
        newM.timerState = action.oldTimerState;
      } else if (action.type === "ADD_STOPPAGE_TIME") {
        newM[\`stoppageTime\${action.halfNumber}\`] = action.oldMinutes;
        newM.stoppagePromptShown = action.oldPrompt;
      } else if (action.type === "EXTRA_TIME") {
        newM.extraTimeDuration = action.oldMinutes;
        newM.state = action.oldState;
        newM.half = action.oldHalf;
        newM.timerState = action.oldTimerState;
      } else if (action.type === "FINISH_MATCH") {
        if (action.timelineEventId) {
          eventIdsToRemove = [action.timelineEventId];
        }
        newM.state = action.oldState;
        newM.teamA = action.oldTeamA;
        newM.teamB = action.oldTeamB;
        newM.winningMethod = action.oldWinningMethod;
        newM.motmId = action.oldMotmId;
        newM.motmName = action.oldMotmName;
      }`;

const redoOld = `      } else if (action.type === "PENALTY_SHOOTOUT") {
        eventsToAdd = action.eventIds ? action.eventIds.map(id => action.timelineEvents.find(e => e.id === id)) : [];
        const tK = action.team === "A" ? "penaltiesA" : "penaltiesB";
        newM[tK] = [...(newM[tK] || []), { id: action.penaltyId, playerId: action.playerId, playerName: action.playerName, isGoal: action.isGoal, shotType: action.shotType, placement: action.placement, result: action.result }];
      }`;
const redoNew = `      } else if (action.type === "PENALTY_SHOOTOUT") {
        eventsToAdd = action.eventIds ? action.eventIds.map(id => action.timelineEvents.find(e => e.id === id)) : [];
        const tK = action.team === "A" ? "penaltiesA" : "penaltiesB";
        newM[tK] = [...(newM[tK] || []), { id: action.penaltyId, playerId: action.playerId, playerName: action.playerName, isGoal: action.isGoal, shotType: action.shotType, placement: action.placement, result: action.result }];
      } else if (action.type === "MATCH_STATE_CHANGE") {
        if (action.timelineEvent) {
          eventsToAdd = [action.timelineEvent];
        }
        newM.state = action.newState;
        newM.timerState = action.newTimerState;
      } else if (action.type === "SET_MATCH_HALF") {
        newM.half = action.newHalf;
        newM.stoppagePromptShown = action.newPrompt;
        newM.timerState = action.newTimerState;
      } else if (action.type === "ADD_STOPPAGE_TIME") {
        newM[\`stoppageTime\${action.halfNumber}\`] = action.newMinutes;
        newM.stoppagePromptShown = action.newPrompt;
      } else if (action.type === "EXTRA_TIME") {
        newM.extraTimeDuration = action.newMinutes;
        newM.state = action.newState;
        newM.half = action.newHalf;
        newM.timerState = action.newTimerState;
      } else if (action.type === "FINISH_MATCH") {
        if (action.timelineEvent) {
          eventsToAdd = [action.timelineEvent];
        }
        newM.state = action.newState;
        newM.teamA = action.newTeamA;
        newM.teamB = action.newTeamB;
        newM.winningMethod = action.newWinningMethod;
        newM.motmId = action.newMotmId;
        newM.motmName = action.newMotmName;
      }`;

if (!code.includes(updateMatchStateOld.substring(0, 100))) { console.log("Cannot find updateMatchStateOld"); } else { code = code.replace(updateMatchStateOld, updateMatchStateNew); }
if (!code.includes(setMatchHalfOld.substring(0, 100))) { console.log("Cannot find setMatchHalfOld"); } else { code = code.replace(setMatchHalfOld, setMatchHalfNew); }
if (!code.includes(addStoppageOld.substring(0, 100))) { console.log("Cannot find addStoppageOld"); } else { code = code.replace(addStoppageOld, addStoppageNew); }
if (!code.includes(addExtraOld.substring(0, 100))) { console.log("Cannot find addExtraOld"); } else { code = code.replace(addExtraOld, addExtraNew); }
if (!code.includes(finishOld.substring(0, 100))) { console.log("Cannot find finishOld"); } else { code = code.replace(finishOld, finishNew); }
if (!code.includes(finishOld2.substring(0, 100))) { console.log("Cannot find finishOld2"); } else { code = code.replace(finishOld2, finishNew2); }
if (!code.includes(undoOld.substring(0, 100))) { console.log("Cannot find undoOld"); } else { code = code.replace(undoOld, undoNew); }
if (!code.includes(redoOld.substring(0, 100))) { console.log("Cannot find redoOld"); } else { code = code.replace(redoOld, redoNew); }

fs.writeFileSync('src/features/match/MatchContext.jsx', code);
console.log('MatchContext.jsx updated for Match Control Undo.');
