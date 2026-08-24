import { useParams, useNavigate } from "react-router-dom";
import { useMatch } from "./MatchContext";
import { useTournaments } from "../../context/TournamentContext";
import { usePlayers } from "../../context/PlayerContext";
import { useState, useEffect, useRef } from "react";
import Pitch from "../tactics/Pitch";
import { ArrowLeft, Play, StopCircle, Clock, Crown, Undo, Redo } from "lucide-react";
import { useToast } from "../../context/ToastContext";
import VerifiedBadge from "../../components/VerifiedBadge";
import { useMediaQuery } from "../../hooks/useMediaQuery";

import ResponsiveView from "../../components/layout/ResponsiveView";
import MatchViewMobile from "./components/mobile/MatchViewMobile";
import MatchViewTablet from "./components/tablet/MatchViewTablet";
import MatchViewDesktop from "./components/desktop/MatchViewDesktop";

export default function MatchView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMatch, updateMatchState, setMatchHalf, addStoppageTime, markStoppagePromptShown, editPlayer, setCaptain, setGoalkeeper, addEvent, finishMatch, changeFormation, substitute, addPlayerToBench, removePlayer, matchEventOverlay, addExtraTime, recordPenaltyShootout, undoEvent, redoEvent } = useMatch();
  const { processTournamentMatch } = useTournaments();
  const { getPlayerByPhone, registerPlayer, players } = usePlayers();
  const { toast } = useToast();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const match = getMatch(id);
  const previousPastStatesRef = useRef(match?.pastStates?.length || 0);
  const [highlightUndo, setHighlightUndo] = useState(false);
  const [undoModal, setUndoModal] = useState(false);

  useEffect(() => {
    if (match && match.pastStates) {
      if (match.pastStates.length > previousPastStatesRef.current) {
        setHighlightUndo(true);
        setTimeout(() => setHighlightUndo(false), 1000);
      }
      previousPastStatesRef.current = match.pastStates.length;
    }
  }, [match, match?.pastStates]);

  const [activeTab, setActiveTab] = useState("TACTICS");
  const [customFormationName, setCustomFormationName] = useState("");
  const [savedFormations, setSavedFormations] = useState(() => {
    return Object.keys(JSON.parse(localStorage.getItem("v2_custom_formations") || "{}"));
  });
  const [timer, setTimer] = useState(0);
  
  // Extra Time Modal State
  const [extraTimeModal, setExtraTimeModal] = useState(false);
  const [extraTimeInput, setExtraTimeInput] = useState(15);
  
  // Goal Flow State
  const [goalModal, setGoalModal] = useState({ isOpen: false, team: null, scorerId: null, scorerName: null, type: "GOAL", step: 1, assistId: null, assistName: null });
  
  // Penalty Wizard State
  const [penaltyWizard, setPenaltyWizard] = useState({ isOpen: false, team: null, step: 1, shooterId: null, shooterName: null, shotType: null, placement: null, result: null });
  
  // Sub Flow State
  const [subModal, setSubModal] = useState({ isOpen: false, team: null, playerOffId: null, playerOffName: null, playerOnId: null, playerOnName: null, reverse: false });

  // Save Flow State
  const [saveModal, setSaveModal] = useState({ isOpen: false, team: null, keeperId: null, keeperName: null, shotTakerId: null, shotTakerName: null, saveQuality: "Simple Save", isPenalty: false, isRebound: false });

  // Edit Flow State
  const [editPlayerModal, setEditPlayerModal] = useState({ isOpen: false, team: null, playerId: null, name: "", role: "", phone: "" });

  // Foul Flow State
  const [foulModal, setFoulModal] = useState({ 
    isOpen: false, 
    team: null, 
    fouledPlayerId: null, 
    fouledPlayerName: null,
    foulingPlayerId: null,
    foulingPlayerName: null,
    isFreekick: false,
    freekickTakerId: null,
    freekickTakerName: null,
    card: null,
    isGoal: false,
    step: 1
  });

  // Stoppage Flow State
  const [stoppageModal, setStoppageModal] = useState(false);

  const matchMinute = Math.floor(timer / 60);

  // Dynamic Momentum Calculation
  const calculateMomentum = () => {
    if (!match || !match.timeline || match.timeline.length === 0) return 50; // 50 is neutral
    const recentEvents = match.timeline.slice(-8); // look at last 8 events
    let teamAScore = 0;
    let teamBScore = 0;
    
    recentEvents.forEach(e => {
      let weight = 0;
      if (e.type === "GOAL" || e.type === "BANGER" || e.type === "PENALTY" || (e.type === "FREEKICK" && e.isGoal)) weight = 5;
      else if (e.type === "FREEKICK") weight = 2;
      else if (e.type === "FOUL") weight = 1; // Team getting fouled gets momentum
      else if (e.type === "YELLOW_CARD") weight = -2; // Team getting card loses momentum
      else if (e.type === "RED_CARD") weight = -5;
      
      if (e.team === "A") teamAScore += weight;
      else if (e.team === "B") teamBScore += weight;
    });

    const total = Math.abs(teamAScore) + Math.abs(teamBScore);
    if (total === 0) return 50;
    
    const teamAPct = (teamAScore + total) / (total * 2); // normalize to 0-1
    return Math.max(10, Math.min(90, Math.round(teamAPct * 100))); // Cap between 10% and 90%
  };

  const momentumValue = calculateMomentum();
  const isSpectator = new URLSearchParams(window.location.search).get('spectator') === 'true';

  useEffect(() => {
    const isRunning = match?.state === "FIRST_HALF" || match?.state === "SECOND_HALF";
    if (isRunning) {
      const currentHalf = match.half;
      const halfDuration = match.duration / 2;

      let currentMs = match.timerState.accumulatedTime;
      if (match.timerState.startTime) {
        currentMs += (Date.now() - match.timerState.startTime);
      }

      // 1. Show stoppage prompt 15-20 seconds before regulation ends
      const regulationEndMs = (currentHalf === 1 ? halfDuration : match.duration) * 60000;
      if (!match.stoppagePromptShown && currentMs >= regulationEndMs - 20000 && currentMs < regulationEndMs) { markStoppagePromptShown(id); setTimeout(() => setStoppageModal(true), 0); }
    }
  }, [matchMinute, match?.state, match?.half, match?.stoppageTime1, match?.stoppageTime2, match?.duration, match?.stoppagePromptShown, match?.timerState, timer, id, updateMatchState, markStoppagePromptShown]);

  useEffect(() => {
    const updateTimer = () => {
      if (!match) return;
      let currentMs = match.timerState.accumulatedTime;
      const isRunning = match.state === "FIRST_HALF" || match.state === "SECOND_HALF";
      if (isRunning && match.timerState.startTime) {
        currentMs += (Date.now() - match.timerState.startTime);
      }
      setTimer(Math.floor(currentMs / 1000));
    };

    updateTimer(); // Initial sync

    let interval;
    const isRunning = match?.state === "FIRST_HALF" || match?.state === "SECOND_HALF" || match?.state === "EXTRA_TIME_FIRST_HALF" || match?.state === "EXTRA_TIME_SECOND_HALF";
    if (isRunning) {
      interval = setInterval(updateTimer, 1000);
    }
    return () => clearInterval(interval);
  }, [match?.state, match?.timerState?.accumulatedTime, match?.timerState?.startTime, match]);

  if (!match) return <div style={{ padding: "40px", textAlign: "center" }}>Match not found</div>;

  const handleCard = (team, player, type) => {
    addEvent(id, {
      type,
      team,
      playerId: player.id,
      playerName: player.name,
      minute: matchMinute
    });
    toast.success({ title: `${type === 'YELLOW' ? 'Yellow' : 'Red'} Card Issued`, description: player.name, icon: type === 'YELLOW' ? '🟨' : '🟥' });
  };

  const confirmGoal = () => {
    addEvent(id, {
      type: goalModal.type,
      team: goalModal.team,
      playerId: goalModal.scorerId,
      playerName: goalModal.scorerName,
      assistPlayerId: goalModal.assistId || null,
      assistPlayerName: goalModal.assistName || null,
      isGoal: goalModal.type === "FREEKICK" ? true : undefined,
      minute: matchMinute
    });
    toast.success({ title: "Goal Recorded", description: `${goalModal.scorerName} scored!`, icon: "⚽" });
    setGoalModal({ isOpen: false, team: null, scorerId: null, scorerName: null, type: "GOAL", step: 1, assistId: null, assistName: null });
  };

  const submitFoul = () => {
    // 1. Record Foul
    addEvent(id, {
      type: "FOUL",
      team: foulModal.team, // the team that got fouled
      playerId: foulModal.fouledPlayerId,
      playerName: foulModal.fouledPlayerName,
      assistPlayerId: foulModal.foulingPlayerId, // Using assist field to store fouling player for simplicity
      assistPlayerName: foulModal.foulingPlayerName,
      minute: matchMinute
    });

    // 2. Add Card if any
    if (foulModal.card) {
      addEvent(id, {
        type: foulModal.card,
        team: foulModal.team === "A" ? "B" : "A", // Fouling team gets the card
        playerId: foulModal.foulingPlayerId,
        playerName: foulModal.foulingPlayerName,
        minute: matchMinute
      });
    }

    // 3. Freekick Event
    if (foulModal.isFreekick && foulModal.freekickTakerId) {
      addEvent(id, {
        type: "FREEKICK",
        team: foulModal.team,
        playerId: foulModal.freekickTakerId,
        playerName: foulModal.freekickTakerName,
        isGoal: foulModal.isGoal,
        minute: matchMinute
      });
    }

    toast.info({ title: "Foul Recorded", description: `Foul committed by ${foulModal.foulingPlayerName}`, icon: "🛑" });
    setFoulModal({ isOpen: false, team: null, fouledPlayerId: null, fouledPlayerName: null, foulingPlayerId: null, foulingPlayerName: null, isFreekick: false, freekickTakerId: null, freekickTakerName: null, card: null, isGoal: false, step: 1 });
  };

  const submitSave = () => {
    addEvent(id, {
      type: "SAVE",
      team: saveModal.team,
      playerId: saveModal.keeperId,
      playerName: saveModal.keeperName,
      assistPlayerId: saveModal.shotTakerId,
      assistPlayerName: saveModal.shotTakerName,
      saveQuality: saveModal.saveQuality,
      isPenalty: saveModal.isPenalty,
      isRebound: saveModal.isRebound,
      minute: matchMinute
    });
    toast.success({ title: "Save Recorded", description: `Saved by ${saveModal.keeperName}`, icon: "🧤" });
    setSaveModal({ isOpen: false, team: null, keeperId: null, keeperName: null, shotTakerId: null, shotTakerName: null, saveQuality: "Simple Save", isPenalty: false, isRebound: false });
  };

  const handleEditPlayerSubmit = () => {
    const pPhone = editPlayerModal.phone ? editPlayerModal.phone.trim() : null;
    let finalName = editPlayerModal.name;
    let finalId = editPlayerModal.playerId;
    let isVerified = false;

    if (pPhone) {
      const existing = getPlayerByPhone(pPhone);
      if (existing) {
        finalName = existing.name;
        finalId = existing.id;
        isVerified = existing.isVerified;
      } else {
        const newP = registerPlayer({
          name: editPlayerModal.name || "Player",
          position: editPlayerModal.role,
          phoneNumber: pPhone
        });
        finalId = newP.id;
        finalName = newP.name;
      }
    }

    editPlayer(id, editPlayerModal.team, editPlayerModal.playerId, finalName, editPlayerModal.role, pPhone, finalId, isVerified);
    setEditPlayerModal({ isOpen: false, team: null, playerId: null, name: "", role: "", phone: "" });
  };

  const executeSub = (selectedId) => {
    if (subModal.reverse) {
      substitute(id, subModal.team, selectedId, subModal.playerOnId);
    } else {
      substitute(id, subModal.team, subModal.playerOffId, selectedId);
    }
    toast.info({ title: "Substitution", description: "Substitution completed", icon: "🔄" });
    setSubModal({ isOpen: false, team: null, playerOffId: null, playerOffName: null, playerOnId: null, playerOnName: null, reverse: false });
  };

  const handleSaveCustomFormation = (team) => {
    if (!customFormationName.trim()) {
      toast.error("Enter a name for your formation.");
      return;
    }
    
    const teamData = team === "A" ? match.teamA : match.teamB;
    const coords = teamData.players.map(p => ({ top: p.top, left: p.left, position: p.position }));
    
    // If saving Team B, we must normalize the coordinates (invert Y) so it works on either side
    if (team === "B") {
      coords.forEach(c => c.top = (100 - parseFloat(c.top)) + "%");
    }

    const key = `custom_${customFormationName.trim().replace(/\s+/g, '_').toLowerCase()}`;
    const allCustoms = JSON.parse(localStorage.getItem("v2_custom_formations") || "{}");
    allCustoms[key] = coords;
    localStorage.setItem("v2_custom_formations", JSON.stringify(allCustoms));
    
    setSavedFormations(Object.keys(allCustoms));
    setCustomFormationName("");
    changeFormation(id, team, key);
    toast.success(`Formation "${customFormationName}" saved successfully!`);
  };

  const renderLineup = (team, teamData) => (
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, color: team === "A" ? "var(--primary)" : "var(--warning)" }}>{teamData.name} - Pitch</h3>
        {match.state !== "FINISHED" && match.state !== "NOT_STARTED" && (
          <button 
            onClick={() => setGoalModal({ isOpen: true, team, scorerId: null, scorerName: null, type: "GOAL", step: 1, assistId: null, assistName: null })} 
            style={{ background: "var(--primary)", color: "white", border: "none", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
          >
            + Record Goal
          </button>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {teamData.players.map(p => {
          const isRed = p.stats?.redCards > 0;
          return (
            <div key={p.id} className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "12px", gap: "10px", opacity: isRed ? 0.5 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
                <button 
                  onClick={() => navigate(`/player/${p.id}`)} 
                  style={{ background: "transparent", border: "none", color: p.isCaptain ? "var(--warning)" : "white", padding: 0, fontWeight: "700", cursor: "pointer", textDecoration: "underline", display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}
                >
                  {p.isCaptain && <Crown size={14} />} {p.name} {p.position === "GK" && <span style={{ color: "var(--accent)", fontSize: "12px", textDecoration: "none" }}>(GK)</span>}
                </button>
                {p.isVerified && <VerifiedBadge isEmailVerified={p.isVerified} showText={false} size={14} />}
                {p.stats.goals > 0 && <span style={{ fontSize: "14px" }}>⚽ x{p.stats.goals}</span>}
                {p.stats.saves > 0 && <span style={{ fontSize: "14px" }}>🧤 x{p.stats.saves}</span>}
                {p.stats.yellowCards > 0 && <span style={{ fontSize: "14px" }}>🟨 x{p.stats.yellowCards}</span>}
                {isRed && <span style={{ fontSize: "14px" }}>🟥</span>}
              </div>
              
              {!isRed && match.state !== "FINISHED" && match.state !== "NOT_STARTED" && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                  <button onClick={() => setGoalModal({ isOpen: true, team, scorerId: p.id, scorerName: p.name, step: 2, type: "GOAL", assistId: null, assistName: null })} className="btn-primary" style={{ padding: "6px 10px", fontSize: "14px", background: "rgba(255,255,255,0.1)", color: "white" }}>⚽</button>
                  <button onClick={() => setSubModal({ isOpen: true, team, playerOffId: p.id, playerOffName: p.name })} className="btn-primary" style={{ padding: "6px 10px", fontSize: "14px", background: "rgba(255,255,255,0.1)", color: "white" }}>🔄</button>
                  <button onClick={() => setFoulModal({ ...foulModal, isOpen: true, team, fouledPlayerId: p.id, fouledPlayerName: p.name })} className="btn-primary" style={{ padding: "6px 10px", fontSize: "14px", background: "rgba(255,255,255,0.1)" }}>⚖️</button>
                  <button onClick={() => setSaveModal({ isOpen: true, team, keeperId: p.id, keeperName: p.name, shotTakerId: null, shotTakerName: null, saveQuality: "Simple Save", isPenalty: false, isRebound: false })} className="btn-primary" style={{ padding: "6px 10px", fontSize: "14px", background: "rgba(255,255,255,0.1)", color: "white" }}>🧤</button>
                  <button onClick={() => handleCard(team, p, "YELLOW_CARD")} className="btn-primary" style={{ padding: "6px 10px", fontSize: "14px", background: "rgba(255,255,255,0.1)" }}>🟨</button>
                  <button onClick={() => handleCard(team, p, "RED_CARD")} className="btn-primary" style={{ padding: "6px 10px", fontSize: "14px", background: "rgba(255,255,255,0.1)" }}>🟥</button>
                </div>
              )}
              {match.state !== "FINISHED" && (
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "center" }}>
                  <button onClick={() => setCaptain(id, team, p.id)} className="btn-primary" style={{ padding: "6px 10px", fontSize: "12px", background: p.isCaptain ? "var(--warning)" : "rgba(255,255,255,0.1)", color: p.isCaptain ? "black" : "white" }} title="Set Captain">©️</button>
                  <button onClick={() => setGoalkeeper(id, team, p.id)} className="btn-primary" style={{ padding: "6px 10px", fontSize: "12px", background: p.position === "GK" ? "var(--accent)" : "rgba(255,255,255,0.1)", color: p.position === "GK" ? "black" : "white" }} title="Set Goalkeeper">GK</button>
                  {match.state === "NOT_STARTED" && (
                    <button 
                      onClick={() => setEditPlayerModal({ isOpen: true, team, playerId: p.id, name: p.name, role: p.position || "" })} 
                      className="btn-primary" 
                      style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(255,255,255,0.1)" }}
                    >
                      Edit
                    </button>
                  )}
                </div>
              )}
              {match.state === "FINISHED" && p.rating > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontWeight: "800", fontSize: "18px", color: p.id === match.motmId ? "var(--warning)" : "var(--primary)" }}>
                    {p.rating ? p.rating.toFixed(1) : "-"}
                  </span>
                  {p.id === match.motmId && <span style={{ fontSize: "12px", background: "rgba(245, 158, 11, 0.2)", padding: "4px 8px", borderRadius: "10px", color: "var(--warning)", fontWeight: "bold" }}>MOTM 🏆</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <h3 style={{ margin: "25px 0 15px 0", color: team === "A" ? "var(--primary)" : "var(--warning)", fontSize: "18px" }}>Bench ({teamData.bench.length})</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {teamData.bench.map(p => {
          
          return (
            <div key={p.id} className="glass-panel" style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "12px", gap: "10px", opacity: p.isSubbedOff ? 0.6 : 1, border: p.isSubbedOff ? "1px dashed var(--border)" : "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                <span style={{ fontWeight: "600", display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", justifyContent: "center" }}>{p.name} {p.isSubbedOff && "(Subbed Off)"}</span>
              </div>
              
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" }}>
                {!p.isSubbedOff && match.state !== "FINISHED" && match.state !== "NOT_STARTED" && (
                  <button onClick={() => {
                     setSubModal({ isOpen: true, team, playerOnId: p.id, playerOnName: p.name, reverse: true });
                  }} className="btn-primary" style={{ padding: "6px 10px", fontSize: "14px", background: "rgba(59, 130, 246, 0.2)", color: "white", border: "1px solid var(--primary)" }}>Sub On</button>
                )}
                
                {match.state !== "FINISHED" && (
                  <>
                    <button 
                      onClick={() => setEditPlayerModal({ isOpen: true, team, playerId: p.id, name: p.name, role: p.position || "" })} 
                      className="btn-primary" 
                      style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(255,255,255,0.1)" }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => removePlayer(id, team, p.id)} 
                      className="btn-primary" 
                      style={{ padding: "6px 12px", fontSize: "12px", background: "rgba(239, 68, 68, 0.1)", color: "var(--danger)" }}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {match.state !== "FINISHED" && (
        <button 
          onClick={() => addPlayerToBench(id, team, "New Sub", "UNASSIGNED")}
          className="btn-primary"
          style={{ width: "100%", marginTop: "15px", padding: "10px", background: "transparent", border: "1px dashed rgba(255,255,255,0.3)", color: "var(--text-muted)" }}
        >
          + Add Player to Bench
        </button>
      )}
    </div>
  );


  const controllerProps = {
    id,
    navigate,
    match,
    activeTab,
    setActiveTab,
    timer,
    setTimer,
    matchMinute,
    momentumValue,
    isSpectator,
    extraTimeModal,
    setExtraTimeModal,
    extraTimeInput,
    setExtraTimeInput,
    goalModal,
    setGoalModal,
    penaltyWizard,
    setPenaltyWizard,
    subModal,
    setSubModal,
    saveModal,
    setSaveModal,
    editPlayerModal,
    setEditPlayerModal,
    foulModal,
    setFoulModal,
    stoppageModal,
    setStoppageModal,
    highlightUndo,
    setHighlightUndo,
    undoModal,
    setUndoModal,
    customFormationName,
    setCustomFormationName,
    savedFormations,
    setSavedFormations,
    handleCard,
    confirmGoal,
    submitFoul,
    submitSave,
    handleEditPlayerSubmit,
    executeSub,
    handleSaveCustomFormation,
    renderLineup,
    updateMatchState,
    setMatchHalf,
    addStoppageTime,
    markStoppagePromptShown,
    editPlayer,
    setCaptain,
    setGoalkeeper,
    addEvent,
    finishMatch,
    changeFormation,
    substitute,
    addPlayerToBench,
    removePlayer,
    matchEventOverlay,
    addExtraTime,
    recordPenaltyShootout,
    undoEvent,
    redoEvent,
    processTournamentMatch,
    getPlayerByPhone,
    registerPlayer,
    players,
    toast,
    isMobile,
    previousPastStatesRef
  };

  return (
    <ResponsiveView
      mobile={<MatchViewMobile {...controllerProps} />}
      tablet={<MatchViewTablet {...controllerProps} />}
      desktop={<MatchViewDesktop {...controllerProps} />}
    />
  );
}
