import { createContext, useState, useContext, useEffect } from "react";
import { usePlayers } from "../../context/PlayerContext";
import { useTeams } from "../../context/TeamContext";
import { applyFormationToTeam } from "./FormationEngine";

const MatchContext = createContext();

export function MatchProvider({ children }) {
  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem("v2_matches");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("v2_matches", JSON.stringify(matches));
  }, [matches]);

  // Support for Cross-Tab Spectator Mode synchronization
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "v2_matches" && e.newValue) {
        setMatches(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Match Atmosphere Overlay State
  const [matchEventOverlay, setMatchEventOverlay] = useState({ isOpen: false, text: "", subtext: "", color: "" });

  const { commitMatchStats, recordPlayerEvent } = usePlayers();
  const { commitMatchStatsToTeams } = useTeams();

  const pushState = (m, actionDetails) => {
    return {
      ...m,
      pastStates: [...(m.pastStates || []), { actionDetails }],
      futureStates: [],
      auditLog: [...(m.auditLog || []), { action: "RECORDED", details: actionDetails, timestamp: Date.now() }]
    };
  };

  const undoEvent = (id) => {
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
            if (p.id === eventData.playerId) {
               recordPlayerEvent(eventData.playerId, id, "GOAL", { amount: -1 });
               return { ...p, stats: { ...p.stats, goals: Math.max(0, (p.stats.goals || 0) - 1) } };
            }
            if (p.id === eventData.assistPlayerId) {
               recordPlayerEvent(eventData.assistPlayerId, id, "ASSIST", { amount: -1 });
               return { ...p, stats: { ...p.stats, assists: Math.max(0, (p.stats.assists || 0) - 1) } };
            }
            return p;
          });
        }
        if (eventData.type === "SAVE") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) {
               recordPlayerEvent(eventData.playerId, id, "SAVE", { amount: -1 });
               return { ...p, stats: { ...p.stats, saves: Math.max(0, (p.stats.saves || 0) - 1) } };
            }
            return p;
          });
        }
        if (eventData.type === "YELLOW_CARD" || eventData.type === "RED_CARD") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          const hasAutoRed = action.timelineEvents && action.timelineEvents.some(e => e.isAuto && e.type === "RED_CARD");
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) {
               const newStats = { ...p.stats };
              if (eventData.type === "YELLOW_CARD") {
                 recordPlayerEvent(eventData.playerId, id, "YELLOW_CARD", { amount: -1 });
                 newStats.yellowCards = Math.max(0, (newStats.yellowCards || 0) - 1);
               }
               if (eventData.type === "RED_CARD" || hasAutoRed) {
                 recordPlayerEvent(eventData.playerId, id, "RED_CARD", { amount: -1 });
                 newStats.redCards = Math.max(0, (newStats.redCards || 0) - 1);
               }
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
        newM[`stoppageTime${action.halfNumber}`] = action.oldMinutes;
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
            if (p.id === eventData.playerId) {
               recordPlayerEvent(eventData.playerId, id, "GOAL", { amount: 1 });
               return { ...p, stats: { ...p.stats, goals: (p.stats.goals || 0) + 1 } };
            }
            if (p.id === eventData.assistPlayerId) {
               recordPlayerEvent(eventData.assistPlayerId, id, "ASSIST", { amount: 1 });
               return { ...p, stats: { ...p.stats, assists: (p.stats.assists || 0) + 1 } };
            }
            return p;
          });
        }
        if (eventData.type === "SAVE") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) {
               recordPlayerEvent(eventData.playerId, id, "SAVE", { amount: 1 });
               return { ...p, stats: { ...p.stats, saves: (p.stats.saves || 0) + 1 } };
            }
            return p;
          });
        }
        if (eventData.type === "YELLOW_CARD" || eventData.type === "RED_CARD") {
          const teamK = eventData.team === "A" ? "teamA" : "teamB";
          const hasAutoRed = action.timelineEvents && action.timelineEvents.some(e => e.isAuto && e.type === "RED_CARD");
          newM[teamK].players = newM[teamK].players.map(p => {
            if (p.id === eventData.playerId) {
               const newStats = { ...p.stats };
               if (eventData.type === "YELLOW_CARD") {
                 recordPlayerEvent(eventData.playerId, id, "YELLOW_CARD", { amount: 1 });
                 newStats.yellowCards = (newStats.yellowCards || 0) + 1;
               }
               if (eventData.type === "RED_CARD" || hasAutoRed) {
                 recordPlayerEvent(eventData.playerId, id, "RED_CARD", { amount: 1 });
                 newStats.redCards = (newStats.redCards || 0) + 1;
               }
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
        newM[`stoppageTime${action.halfNumber}`] = action.newMinutes;
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
  };
  
  const createMatch = (teamAName, teamBName, duration = 45, sizeA = 11, sizeB = 11, tournamentId = null, benchSizeA = 5, benchSizeB = 5, subRules = "Rolling (Unlimited)", date = null, time = null, matchType = "Casual Match", locationType = "Turf", city = "Mumbai", location = "Downtown Arena", matchResolution = "Knockout") => {
    const createPlayers = (teamLetter, isBench = false, teamSize, benchSize) => Array.from({ length: isBench ? benchSize : teamSize }, (_, i) => ({
      id: crypto.randomUUID(),
      name: isBench ? `Bench ${i + 1}` : `Player ${i + 1}`,
      position: !isBench && i === 0 ? "GK" : "UNASSIGNED",
      team: teamLetter,
      stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, saves: 0 },
      top: isBench ? null : "50%",
      left: isBench ? null : "50%",
      isSubbedOff: false,
      isCaptain: false,
      rating: 0
    }));

    const newMatch = {
      id: crypto.randomUUID(),
      teamA: { name: teamAName || "Home Team", score: 0, formation: "", players: createPlayers("A", false, sizeA, benchSizeA), bench: createPlayers("A", true, sizeA, benchSizeA) },
      teamB: { name: teamBName || "Away Team", score: 0, formation: "", players: createPlayers("B", false, sizeB, benchSizeB), bench: createPlayers("B", true, sizeB, benchSizeB) },
      state: "NOT_STARTED", // NOT_STARTED, LIVE, PAUSED, HALF_TIME, PENDING_HALF_TIME, FULL_TIME, PENDING_FULL_TIME, FINISHED
      timerState: {
        startTime: null,
        accumulatedTime: 0
      },
      minute: 0,
      duration: duration,
      subRules: subRules,
      half: 1, // 1 or 2
      stoppageTime1: 0,
      stoppageTime2: 0,
      stoppagePromptShown: false,
      extraTimeDuration: 0,
      penaltiesA: [],
      penaltiesB: [],
      timeline: [],
      motmId: null,
      motmName: null,
      tournamentId: tournamentId,
      date: date || new Date().toISOString().split('T')[0],
      time: time || "19:00",
      matchType,
      locationType,
      city,
      location,
      matchResolution
    };
    
    setMatches([...matches, newMatch]);
    return newMatch.id;
  };

  const getMatch = (id) => {
    const m = matches.find(m => m.id === id);
    if (!m) return undefined;
    let scoreA = 0;
    let scoreB = 0;
    if (m.timeline) {
      m.timeline.forEach(e => {
        if (e.type === "GOAL" || e.type === "ASSISTED_GOAL" || e.type === "HEADER" || e.type === "VOLLEY" || e.type === "PENALTY" || e.type === "BANGER" || (e.type === "FREEKICK" && e.isGoal)) {
          if (e.team === "A") scoreA++;
          if (e.team === "B") scoreB++;
        }
        if (e.type === "OWN_GOAL") {
          if (e.team === "A") scoreB++;
          if (e.team === "B") scoreA++;
        }
      });
    }
    return {
      ...m,
      teamA: { ...m.teamA, score: scoreA },
      teamB: { ...m.teamB, score: scoreB }
    };
  };

  const updateMatchState = (id, newState) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      
      let updatedTimerState = { ...m.timerState };
      const now = Date.now();
      const isCurrentlyRunning = m.state === "FIRST_HALF" || m.state === "SECOND_HALF" || m.state === "EXTRA_TIME_FIRST_HALF" || m.state === "EXTRA_TIME_SECOND_HALF";
      const isGoingToRun = newState === "FIRST_HALF" || newState === "SECOND_HALF" || newState === "EXTRA_TIME_FIRST_HALF" || newState === "EXTRA_TIME_SECOND_HALF";

      // Transitioning TO running state
      if (isGoingToRun && !isCurrentlyRunning) {
        updatedTimerState.startTime = now;
      }
      
      // Transitioning AWAY from running state
      if (isCurrentlyRunning && !isGoingToRun) {
        if (updatedTimerState.startTime) {
          updatedTimerState.accumulatedTime += (now - updatedTimerState.startTime);
          updatedTimerState.startTime = null;
        }
      }

      // If transitioning TO HALFTIME, explicitly hardcode the accumulated time to exactly half the duration
      if (newState === "HALFTIME") {
        updatedTimerState.accumulatedTime = (m.duration / 2) * 60000;
        updatedTimerState.startTime = null;
      }

      let newTimeline = [...m.timeline];
      
      let currentMs = updatedTimerState.accumulatedTime;
      if (isCurrentlyRunning && updatedTimerState.startTime) {
        currentMs += (Date.now() - updatedTimerState.startTime);
      }
      const matchMinute = Math.floor(currentMs / 60000);

      let timelineEvent = null;
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

      return { ...snapshotM, state: newState, timerState: updatedTimerState, timeline: newTimeline };
    }));
  };

  const setMatchHalf = (id, halfNumber) => {
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
  };

  const addStoppageTime = (id, halfNumber, minutes) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      const snapshotM = pushState(m, { type: "ADD_STOPPAGE_TIME", halfNumber, oldMinutes: m[`stoppageTime${halfNumber}`], newMinutes: minutes, oldPrompt: m.stoppagePromptShown, newPrompt: true });
      return { ...snapshotM, [`stoppageTime${halfNumber}`]: minutes, stoppagePromptShown: true };
    }));
  };

  const addExtraTime = (id, minutes) => {
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
  };

  const recordPenaltyShootout = (id, team, playerId, playerName, isGoal, shotType, placement, result) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== id) return m;
      
      const newEventId = crypto.randomUUID();
      const saveEventId = crypto.randomUUID();
      const penaltyId = crypto.randomUUID();
      
      let eventIds = [newEventId];
      if (result === "Saved") eventIds.push(saveEventId);
      
      const teamKey = team === "A" ? "penaltiesA" : "penaltiesB";
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
      
      const snapshotM = pushState(m, { type: "PENALTY_SHOOTOUT", team, playerId, playerName, isGoal, result, penaltyId, eventIds, timelineEvents, shotType, placement });

      return {
        ...snapshotM,
        [teamKey]: [...(snapshotM[teamKey] || []), { id: penaltyId, playerId, playerName, isGoal, shotType, placement, result }],
        timeline: [...snapshotM.timeline, ...timelineEvents]
      };
    }));
  };

  const markStoppagePromptShown = (id) => {
    setMatches(prevMatches => prevMatches.map(m => m.id === id ? { ...m, stoppagePromptShown: true } : m));
  };

  const editPlayer = (matchId, team, playerId, newName, newRole, phone = null, linkedId = null, isVerified = false) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      return {
        ...m,
        [teamKey]: {
          ...m[teamKey],
          players: m[teamKey].players.map(p => 
            p.id === playerId ? { ...p, name: newName || p.name, position: newRole || p.position, phone: phone || p.phone, id: linkedId || p.id, isVerified: isVerified || p.isVerified } : p
          ),
          bench: m[teamKey].bench.map(p => 
            p.id === playerId ? { ...p, name: newName || p.name, position: newRole || p.position, phone: phone || p.phone, id: linkedId || p.id, isVerified: isVerified || p.isVerified } : p
          )
        }
      };
    }));
  };

  const addPlayerToBench = (matchId, team, name = "New Player", role = "UNASSIGNED") => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      const newPlayer = {
        id: crypto.randomUUID(),
        name,
        position: role,
        team,
        stats: { goals: 0, assists: 0, yellowCards: 0, redCards: 0, saves: 0 },
        top: null, left: null,
        isSubbedOff: false, isCaptain: false, rating: 0
      };
      return { 
        ...m, 
        [teamKey]: { ...m[teamKey], bench: [...m[teamKey].bench, newPlayer] } 
      };
    }));
  };

  const removePlayer = (matchId, team, playerId) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      return {
        ...m,
        [teamKey]: {
          ...m[teamKey],
          bench: m[teamKey].bench.filter(p => p.id !== playerId)
        }
      };
    }));
  };

  const setCaptain = (matchId, team, playerId) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      
      const newPlayers = m[teamKey].players.map(p => ({ ...p, isCaptain: p.id === playerId }));
      const newBench = m[teamKey].bench.map(p => ({ ...p, isCaptain: p.id === playerId }));
      
      let timelineAdditions = [];
      const isRunning = m.state === "FIRST_HALF" || m.state === "SECOND_HALF" || m.state.startsWith("EXTRA_TIME_");
      
      let snapshotM = m;

      if (isRunning || m.state === "LIVE") { // Including LIVE or just the running states
        const newCap = [...m[teamKey].players, ...m[teamKey].bench].find(p => p.id === playerId);
        const oldCap = [...m[teamKey].players, ...m[teamKey].bench].find(p => p.isCaptain);
        
        let currentMs = m.timerState.accumulatedTime;
        if (m.timerState.startTime) {
           currentMs += (Date.now() - m.timerState.startTime);
        }
        const matchMinute = Math.floor(currentMs / 60000);
        
        if (newCap && oldCap && newCap.id !== oldCap.id) {
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
            commentary: `Captain switched to ${newCap.name}`
          };
          snapshotM = pushState(m, { type: "CAPTAIN_CHANGE", team, oldCapId: oldCap.id, newCapId: newCap.id, eventId, timelineEvent });
          timelineAdditions.push(timelineEvent);
        }
      }
      
      return {
        ...snapshotM,
        timeline: [...snapshotM.timeline, ...timelineAdditions],
        [teamKey]: {
          ...snapshotM[teamKey],
          players: newPlayers,
          bench: newBench
        }
      };
    }));
  };

  const setGoalkeeper = (matchId, team, playerId) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      
      const newPlayers = m[teamKey].players.map(p => ({ ...p, position: p.id === playerId ? "GK" : (p.position === "GK" ? "UNASSIGNED" : p.position) }));
      const newBench = m[teamKey].bench.map(p => ({ ...p, position: p.id === playerId ? "GK" : (p.position === "GK" ? "UNASSIGNED" : p.position) }));
      
      let timelineAdditions = [];
      const isRunning = m.state === "FIRST_HALF" || m.state === "SECOND_HALF" || m.state.startsWith("EXTRA_TIME_");
      
      let snapshotM = m;

      if (isRunning || m.state === "LIVE") {
        const newGk = [...m[teamKey].players, ...m[teamKey].bench].find(p => p.id === playerId);
        const oldGk = [...m[teamKey].players, ...m[teamKey].bench].find(p => p.position === "GK");
        
        let currentMs = m.timerState.accumulatedTime;
        if (m.timerState.startTime) {
           currentMs += (Date.now() - m.timerState.startTime);
        }
        const matchMinute = Math.floor(currentMs / 60000);
        
        if (newGk && oldGk && newGk.id !== oldGk.id) {
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
            commentary: `Goalkeeper changed: ${oldGk.name} → ${newGk.name}`
          };
          snapshotM = pushState(m, { type: "GK_CHANGE", team, oldGkId: oldGk.id, newGkId: newGk.id, newGkOldPos: newGk.position, eventId, timelineEvent });
          timelineAdditions.push(timelineEvent);
        }
      }
      
      return {
        ...snapshotM,
        timeline: [...snapshotM.timeline, ...timelineAdditions],
        [teamKey]: {
          ...snapshotM[teamKey],
          players: newPlayers,
          bench: newBench
        }
      };
    }));
  };

  const finishMatch = (matchId) => {
    const matchData = matches.find(m => m.id === matchId);
    if (!matchData || matchData.state === "FINISHED") return null;

    let finalizedMatch = null;

    setMatches(matches.map(m => {
      if (m.id === matchId) {
        // Dynamically compute score just in case
        let scoreA = 0;
        let scoreB = 0;
        let normalTimeScoreA = 0;
        let normalTimeScoreB = 0;
        let extraTimeScoreA = 0;
        let extraTimeScoreB = 0;

        m.timeline.forEach(e => {
          let teamScoreA = 0;
          let teamScoreB = 0;
          
          if (e.type === "GOAL" || e.type === "ASSISTED_GOAL" || e.type === "HEADER" || e.type === "VOLLEY" || e.type === "PENALTY" || e.type === "BANGER" || (e.type === "FREEKICK" && e.isGoal)) {
            if (e.team === "A") teamScoreA = 1;
            if (e.team === "B") teamScoreB = 1;
          }
          if (e.type === "OWN_GOAL") {
            if (e.team === "A") teamScoreB = 1;
            if (e.team === "B") teamScoreA = 1;
          }
          
          scoreA += teamScoreA;
          scoreB += teamScoreB;
          
          if (e.isExtraTime) {
             extraTimeScoreA += teamScoreA;
             extraTimeScoreB += teamScoreB;
          } else {
             normalTimeScoreA += teamScoreA;
             normalTimeScoreB += teamScoreB;
          }
        });

        // Winning Method
        let winningMethod = "Draw after Normal Time";
        if (scoreA !== scoreB) {
            if (m.extraTimeDuration > 0) {
                 winningMethod = "Won after Extra Time";
            } else {
                 winningMethod = "Won in Normal Time";
            }
        } else if (m.penaltiesA?.length > 0 || m.penaltiesB?.length > 0) {
            const penScoreA = m.penaltiesA.filter(p => p.isGoal).length;
            const penScoreB = m.penaltiesB.filter(p => p.isGoal).length;
            if (penScoreA !== penScoreB) {
                winningMethod = "Won on Penalties";
            } else {
                winningMethod = "Draw after Penalties";
            }
        } else if (m.extraTimeDuration > 0) {
            winningMethod = "Draw after Extra Time";
        }

        let timelineEventId = null;
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

        // --- RATING & MOTM CALCULATION ---
        // Removed auto-rating and auto-MOTM to allow manual organizer input post-match.

        const ratedTeamA = m.teamA.players;
        const ratedTeamB = m.teamB.players;

        let penaltyScoreA = m.penaltiesA ? m.penaltiesA.filter(p => p.isGoal).length : 0;
        let penaltyScoreB = m.penaltiesB ? m.penaltiesB.filter(p => p.isGoal).length : 0;

        const newTeamA = { ...m.teamA, score: scoreA, normalTimeScore: normalTimeScoreA, extraTimeScore: extraTimeScoreA, penaltyScore: penaltyScoreA, players: ratedTeamA };
        const newTeamB = { ...m.teamB, score: scoreB, normalTimeScore: normalTimeScoreB, extraTimeScore: extraTimeScoreB, penaltyScore: penaltyScoreB, players: ratedTeamB };
        const newMotmId = null;
        const newMotmName = null;

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
        // (Removed auto-MOTM assignment)

        // Single Source of Truth MATCH_END generation
        const generateMatchEndStats = (team, opponentScore) => {
           const isWin = team.score > opponentScore;
           const isLoss = team.score < opponentScore;
           // isDraw not needed
           
           team.players.forEach(p => {
              recordPlayerEvent(p.id, finalizedMatch.id, "APPEARANCE", { amount: 1, position: p.position, minutes: finalizedMatch.duration });
              if (opponentScore === 0) {
                 recordPlayerEvent(p.id, finalizedMatch.id, "CLEAN_SHEET", { amount: 1, position: p.position });
              }
              recordPlayerEvent(p.id, finalizedMatch.id, "MATCH_END", { 
                  result: isWin ? 'W' : isLoss ? 'L' : 'D',
                  goalsConceded: opponentScore,
                  isCaptain: p.isCaptain,
                  position: p.position
              });
           });
        };

        generateMatchEndStats(finalizedMatch.teamA, finalizedMatch.teamB.score);
        generateMatchEndStats(finalizedMatch.teamB, finalizedMatch.teamA.score);

        commitMatchStats(finalizedMatch);
        commitMatchStatsToTeams(finalizedMatch);
        
        return finalizedMatch;
      }
      return m;
    }));

    return finalizedMatch;
  };

  const updatePlayerPosition = (matchId, team, playerId, top, left) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      const updatedPlayers = m[teamKey].players.map(p => 
        p.id === playerId ? { ...p, top, left } : p
      );
      return { ...m, [teamKey]: { ...m[teamKey], players: updatedPlayers } };
    }));
  };

  const ratePlayer = (matchId, team, playerId, ratingValue) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      const updatedPlayers = m[teamKey].players.map(p => {
        if (p.id === playerId) {
          recordPlayerEvent(playerId, matchId, "RATING", { rating: ratingValue, position: p.position });
          return { ...p, rating: ratingValue };
        }
        return p;
      });
      return { ...m, [teamKey]: { ...m[teamKey], players: updatedPlayers } };
    }));
  };

  const assignMotm = (matchId, team, playerId) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      const player = m[teamKey].players.find(p => p.id === playerId);
      if (player) {
         recordPlayerEvent(playerId, matchId, "MOTM", { amount: 1, position: player.position });
      }
      return { ...m, motmId: playerId, motmName: player ? player.name : null };
    }));
  };

  const substitute = (matchId, team, playerOffId, playerOnId) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      
      const pOffIndex = m[teamKey].players.findIndex(p => p.id === playerOffId);
      const pOnIndex = m[teamKey].bench.findIndex(p => p.id === playerOnId);
      
      if (pOffIndex === -1 || pOnIndex === -1) return m;
      
      const offPlayer = m[teamKey].players[pOffIndex];
      const onPlayer = m[teamKey].bench[pOnIndex];
      
      if (offPlayer.stats.redCards > 0) return m; // Can't sub off red card
      
      const isRolling = m.subRules?.includes("Rolling") || m.subRules?.includes("Futsal");
      if (!isRolling && onPlayer.isSubbedOff) return m; // Can't sub on a subbed off player in traditional rules

      // Calculate current minute accurately
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
      };
    }));
  };

  const changeFormation = (matchId, team, formationStr) => {
    setMatches(prevMatches => prevMatches.map(m => {
      if (m.id !== matchId) return m;
      const teamKey = team === "A" ? "teamA" : "teamB";
      const isBottomHalf = team === "B";
      return { ...m, [teamKey]: applyFormationToTeam(m[teamKey], formationStr, isBottomHalf) };
    }));
  };

  const addEvent = (matchId, eventData) => {
    setMatches(prevMatches => {
      const matchIndex = prevMatches.findIndex(m => m.id === matchId);
      if (matchIndex === -1) return prevMatches;

      let currentMatch = prevMatches[matchIndex];
      const newEventId = crypto.randomUUID();
      const eventToRecord = { id: newEventId, timestamp: Date.now(), ...eventData };
      
      let currentMs = currentMatch.timerState.accumulatedTime;
      if (currentMatch.state === "LIVE" && currentMatch.timerState.startTime) {
        currentMs += (Date.now() - currentMatch.timerState.startTime);
      }
      const matchMinute = Math.floor(currentMs / 60000);

      const isStoppageTime = matchMinute >= currentMatch.duration;
      const isTeamA = eventData.team === "A";
      const teamKey = isTeamA ? "teamA" : "teamB";
      const oppKey = isTeamA ? "teamB" : "teamA";
      const player = currentMatch[teamKey].players.find(p => p.id === eventData.playerId);
      const isCaptain = player?.isCaptain;
      
      let commentary = null;
      if (eventData.type === "BANGER") {
        commentary = "WHAT A STRIKE! Absolute screamer from " + eventData.playerName + "!";
      } else if (eventData.type === "PENALTY") {
        commentary = isStoppageTime ? "Ice in his veins! Scores the penalty at the death!" : "Cool as you like from the spot.";
      } else if (eventData.type === "RED_CARD") {
        commentary = "A shocking challenge! The referee reaches for the red pocket. He's off!";
      } else if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY") {
        const goalsBeforeThis = player?.stats?.goals || 0;
        const willBeHatTrick = goalsBeforeThis === 2;
        const isComeback = (currentMatch[teamKey].score < currentMatch[oppKey].score) && (currentMatch[teamKey].score + 1 === currentMatch[oppKey].score || currentMatch[teamKey].score + 1 > currentMatch[oppKey].score);
        
        if (willBeHatTrick) commentary = "HAT-TRICK HERO! " + eventData.playerName + " takes home the match ball!";
        else if (isStoppageTime) commentary = "LATE DRAMA! Unbelievable scenes here! Could that be the winner?";
        else if (isComeback) commentary = "THE COMEBACK IS ON! They refused to give up!";
        else if (isCaptain) commentary = "Captain leads by example! Crucial goal.";
        else commentary = "Brilliant finish by " + eventData.playerName + "!";
      } else if (eventData.type === "OWN_GOAL") {
        commentary = "A nightmare moment! He puts it into his own net. Tragic.";
      } else if (eventData.type === "YELLOW_CARD") {
        commentary = "Careless tackle. Going into the referee's book.";
      } else if (eventData.type === "SUBSTITUTION") {
        commentary = "Tactical change. Fresh legs introduced.";
      } else if (eventData.type === "FOUL") {
        commentary = "Referee blows the whistle for a foul. Tensions rising.";
      } else if (eventData.type === "FREEKICK") {
        commentary = eventData.isGoal ? "UNBELIEVABLE FREEKICK GOAL! Top bins!" : "Takes the freekick... but the keeper reads it.";
      } else if (eventData.type === "SAVE") {
        if (eventData.isPenalty || eventData.saveQuality === "Penalty Save") commentary = "HE SAVES THE PENALTY! The goalkeeper keeps them alive!";
        else if (eventData.saveQuality === "World Class Save") commentary = "WORLD CLASS GOALKEEPING! Absolutely unbelievable stop!";
        else if (eventData.saveQuality === "Brilliant Save") commentary = "Brilliant reflexes from the keeper!";
        else if (eventData.saveQuality === "Reflex Save") commentary = "Incredible reflex stop!";
        else if (eventData.saveQuality === "One-Handed Save") commentary = "What a one-handed save! Stretches to the limit!";
        else if (eventData.saveQuality === "Finger-Tip Save") commentary = "Just gets his fingertips to it! Crucial touch.";
        else if (eventData.saveQuality === "Close Range Save") commentary = "Incredible stop from point-blank range!";
        else if (eventData.saveQuality === "Good Save") commentary = "A solid save by the keeper.";
        else commentary = "WHAT A SAVE! Brilliant reflexes to deny the goal!";
      } else if (eventData.type === "DISALLOWED_GOAL_OFFSIDE") {
        commentary = "Flag goes up! Goal ruled out for offside. Very tight call there.";
      } else if (eventData.type === "OFFSIDE") {
        commentary = "Caught offside! The assistant referee raises his flag.";
      }

      const isExtraTime = currentMatch.state.startsWith("EXTRA_TIME_");

      const newEvent = {
        ...eventToRecord,
        minute: matchMinute,
        commentary,
        isExtraTime
      };

      // Trigger Atmosphere Overlay via timeout to avoid React state-in-state warnings
      setTimeout(() => {
        if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY" || eventData.type === "PENALTY" || eventData.type === "BANGER" || (eventData.type === "FREEKICK" && eventData.isGoal)) {
          setMatchEventOverlay({ 
            isOpen: true, 
            text: `GOAL! ${(eventData.playerName || "").toUpperCase()}`, 
            subtext: commentary || "Brilliant finish!",
            color: eventData.team === "A" ? "var(--primary)" : "var(--warning)" 
          });
          setTimeout(() => setMatchEventOverlay(prev => ({ ...prev, isOpen: false })), 4000);
        } else if (eventData.type === "RED_CARD") {
          setMatchEventOverlay({ 
            isOpen: true, 
            text: "RED CARD!", 
            subtext: `${eventData.playerName} is sent off.`,
            color: "var(--danger)" 
          });
          setTimeout(() => setMatchEventOverlay(prev => ({ ...prev, isOpen: false })), 4000);
        } else if (eventData.type === "OWN_GOAL") {
          setMatchEventOverlay({ 
            isOpen: true, 
            text: "OWN GOAL!", 
            subtext: "A nightmare moment.",
            color: "var(--danger)" 
          });
          setTimeout(() => setMatchEventOverlay(prev => ({ ...prev, isOpen: false })), 4000);
        }
      }, 0);

      let timelineEvents = [newEvent];
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

      if (eventData.type === "GOAL" || eventData.type === "ASSISTED_GOAL" || eventData.type === "HEADER" || eventData.type === "VOLLEY" || eventData.type === "PENALTY" || eventData.type === "BANGER" || (eventData.type === "FREEKICK" && eventData.isGoal)) {
        const teamK = eventData.team === "A" ? "teamA" : "teamB";
        newState[teamK].players = newState[teamK].players.map(p => {
          if (p.id === eventData.playerId) {
             recordPlayerEvent(eventData.playerId, matchId, "GOAL", { amount: 1, position: p.position, isPenalty: eventData.type === "PENALTY", isFreeKick: eventData.type === "FREEKICK" });
             return { ...p, stats: { ...p.stats, goals: (p.stats.goals || 0) + 1 } };
          }
          if (p.id === eventData.assistPlayerId) {
             recordPlayerEvent(eventData.assistPlayerId, matchId, "ASSIST", { amount: 1, position: p.position });
             return { ...p, stats: { ...p.stats, assists: (p.stats.assists || 0) + 1 } };
          }
          return p;
        });
      }
      
      if (eventData.type === "SAVE") {
        const teamK = eventData.team === "A" ? "teamA" : "teamB";
        newState[teamK].players = newState[teamK].players.map(p => {
          if (p.id === eventData.playerId) {
             recordPlayerEvent(eventData.playerId, matchId, "SAVE", { amount: 1, position: p.position, isPenalty: eventData.isPenalty });
             return { ...p, stats: { ...p.stats, saves: (p.stats.saves || 0) + 1 } };
          }
          return p;
        });
      }

      if (eventData.type === "OWN_GOAL") {
        const teamK = eventData.team === "A" ? "teamA" : "teamB";
        const player = newState[teamK].players.find(p => p.id === eventData.playerId);
        recordPlayerEvent(eventData.playerId, matchId, "OWN_GOAL", { amount: 1, position: player?.position });
      }

      if (eventData.type === "FOUL") {
        const teamK = eventData.team === "A" ? "teamA" : "teamB";
        const oppK = eventData.team === "A" ? "teamB" : "teamA";
        
        // Fouled player
        const fouledP = newState[teamK].players.find(p => p.id === eventData.playerId);
        if (fouledP) recordPlayerEvent(eventData.playerId, matchId, "FOUL_WON", { amount: 1, position: fouledP.position });
        
        // Fouling player (using assistPlayerId for this)
        const foulingP = newState[oppK].players.find(p => p.id === eventData.assistPlayerId);
        if (foulingP) recordPlayerEvent(eventData.assistPlayerId, matchId, "FOUL_COMMITTED", { amount: 1, position: foulingP.position });
      }

      if (eventData.type === "RED_CARD" || eventData.type === "YELLOW_CARD") {
        const teamK = eventData.team === "A" ? "teamA" : "teamB";
        let shouldAddAutoRed = false;
        
        newState[teamK].players = newState[teamK].players.map(p => {
          if (p.id === eventData.playerId) {
            const isRed = eventData.type === "RED_CARD";
            const newYellows = !isRed ? (p.stats.yellowCards || 0) + 1 : (p.stats.yellowCards || 0);
            
            if (newYellows >= 2 && !isRed) {
              shouldAddAutoRed = true;
            }
            
            if (isRed || shouldAddAutoRed) {
              recordPlayerEvent(eventData.playerId, matchId, "RED_CARD", { amount: 1, position: p.position });
            }
            if (eventData.type === "YELLOW_CARD") {
              recordPlayerEvent(eventData.playerId, matchId, "YELLOW_CARD", { amount: 1, position: p.position });
            }

            return { 
              ...p, 
              stats: { 
                ...p.stats, 
                redCards: isRed || shouldAddAutoRed ? 1 : (p.stats.redCards || 0),
                yellowCards: newYellows
              } 
            };
          }
          return p;
        });

        // Auto red timeline event is already pushed above
      }

      // Re-calculate scores from timeline to guarantee synchronization
      let scoreA = 0;
      let scoreB = 0;
      newState.timeline.forEach(e => {
        if (e.type === "GOAL" || e.type === "ASSISTED_GOAL" || e.type === "HEADER" || e.type === "VOLLEY" || e.type === "PENALTY" || e.type === "BANGER" || (e.type === "FREEKICK" && e.isGoal)) {
          if (e.team === "A") scoreA++;
          if (e.team === "B") scoreB++;
        }
        if (e.type === "OWN_GOAL") {
          if (e.team === "A") scoreB++;
          if (e.team === "B") scoreA++;
        }
      });
      newState.teamA.score = scoreA;
      newState.teamB.score = scoreB;

      const newMatches = [...prevMatches];
      newMatches[matchIndex] = newState;
      return newMatches;
    });
  };

  return (
    <MatchContext.Provider value={{ matches, createMatch, getMatch, 
      updateMatchState, 
      setMatchHalf,
      addStoppageTime,
      addExtraTime,
      recordPenaltyShootout,
      markStoppagePromptShown,
      editPlayer,
      setCaptain,
      setGoalkeeper,
      finishMatch, 
      addEvent, updatePlayerPosition, changeFormation, substitute,
      addPlayerToBench, removePlayer, ratePlayer, assignMotm,
      undoEvent, redoEvent,
      matchEventOverlay }}>
      {children}
    </MatchContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMatch = () => useContext(MatchContext);
