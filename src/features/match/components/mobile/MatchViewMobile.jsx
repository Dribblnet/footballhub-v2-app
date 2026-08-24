import React from "react";
import { ArrowLeft, Play, StopCircle, Clock, Crown, Undo, Redo } from "lucide-react";
import Pitch from "../../../tactics/Pitch";
import VerifiedBadge from "../../../../components/VerifiedBadge";

export default function MatchViewMobile(props) {
  const {
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
    previousPastStatesRef,
  } = props;

  return (
    <div style={{ width: "100%", margin: "0 auto", padding: "10px", boxSizing: "border-box", overflowX: "hidden" }}>
      {/* HEADER */}
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "20px" }}>Match Center</h2>
        <span style={{ background: "rgba(255,255,255,0.1)", padding: "5px 10px", borderRadius: "5px", fontSize: "12px", fontWeight: "bold" }}>
          {match.state.replace("_", " ")}
        </span>
      </header>

      {/* SCOREBOARD (Broadcast Chyron Style) */}
      <div style={{ 
        display: "flex", flexDirection: "column", alignItems: "center", 
        marginBottom: "30px", background: "#0a0f1a", border: "1px solid rgba(255,255,255,0.1)", 
        borderRadius: "12px", padding: "0", overflow: "hidden", 
        boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
        width: "100%", boxSizing: "border-box"
      }}>
        
        <div style={{ display: "flex", width: "100%", alignItems: "stretch", minHeight: "80px" }}>
          {/* Team A Side */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "5px", background: "linear-gradient(90deg, rgba(37, 99, 235, 0.05), rgba(37, 99, 235, 0.2))", borderRight: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
             <div style={{ textAlign: "right", minWidth: 0 }}>
               <h3 style={{ margin: 0, fontSize: "12px", fontWeight: "900", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{match.teamA.name}</h3>
               <p style={{ margin: 0, color: "var(--primary)", fontSize: "10px", fontWeight: "800", letterSpacing: "1px" }}>HOME</p>
             </div>
          </div>

          {/* Center Score Area */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px", background: "#05070a", borderBottom: "2px solid var(--primary)", flexShrink: 0 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "32px", fontWeight: "900", color: "var(--primary)", lineHeight: 1, textShadow: "0 0 10px rgba(37,99,235,0.5)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{match.teamA.score}</span>
                  {(match.state === "PENALTY_SHOOTOUT" || (match.state === "FINISHED" && (match.penaltiesA?.length > 0 || match.penaltiesB?.length > 0))) && (
                    <span style={{ fontSize: "20px", color: "var(--warning)", marginLeft: "5px" }}>({match.penaltiesA?.filter(p => p.isGoal).length || 0})</span>
                  )}
                </div>
                <span style={{ margin: "0 10px", color: "white" }}>-</span>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{match.teamB.score}</span>
                  {(match.state === "PENALTY_SHOOTOUT" || (match.state === "FINISHED" && (match.penaltiesA?.length > 0 || match.penaltiesB?.length > 0))) && (
                    <span style={{ fontSize: "20px", color: "var(--warning)", marginLeft: "5px" }}>({match.penaltiesB?.filter(p => p.isGoal).length || 0})</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Team B Side */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "5px", background: "linear-gradient(-90deg, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.2))", borderLeft: "1px solid rgba(255,255,255,0.05)", overflow: "hidden" }}>
             <div style={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", minWidth: 0 }}>
               <h3 style={{ margin: 0, fontSize: "12px", fontWeight: "900", textTransform: "uppercase", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{match.teamB.name}</h3>
               <p style={{ margin: 0, color: "var(--warning)", fontSize: "10px", fontWeight: "800", letterSpacing: "1px" }}>AWAY</p>
             </div>
          </div>
        </div>

        {/* TIMER & MOMENTUM STRIP */}
        <div style={{ width: "100%", boxSizing: "border-box", padding: "15px 20px", background: "#111827", display: "flex", flexDirection: "column", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>

        {/* TIMER ENGINE */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: (match.state === "FIRST_HALF" || match.state === "SECOND_HALF" || match.state.startsWith("EXTRA_TIME_")) ? "15px" : "0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "5px 15px", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.5)" }}>
            <Clock size={16} color={match.state === "LIVE" ? "var(--accent)" : "white"} />
            <span style={{ fontSize: "18px", fontWeight: "900", color: match.state === "LIVE" ? "var(--accent)" : "white", fontFamily: "'Outfit', sans-serif" }}>
              {(() => {
                if (match.state === "PENALTY_SHOOTOUT") return "PENALTIES";
                const isET = match.state.startsWith("EXTRA_TIME_");
                let regMin = isET ? (match.duration + (match.state === "EXTRA_TIME_FIRST_HALF" ? match.extraTimeDuration / 2 : match.extraTimeDuration)) : (match.half === 1 ? match.duration / 2 : match.duration);
                if (timer >= regMin * 60) {
                  const extraSecsTotal = timer - (regMin * 60);
                  const extraMins = Math.floor(extraSecsTotal / 60);
                  const extraSecs = extraSecsTotal % 60;
                  return <>{regMin}:00 <span style={{ color: "var(--warning)", marginLeft: "5px", fontSize: "16px" }}>+{extraMins}:{String(extraSecs).padStart(2, '0')}</span></>;
                }
                return <>{Math.floor(timer / 60)}' <span style={{ opacity: 0.8, fontSize: "14px" }}>{String(timer % 60).padStart(2, '0')}</span></>;
              })()}
            </span>
            {((match.half === 1 && match.stoppageTime1 > 0) || (match.half === 2 && match.stoppageTime2 > 0)) && (
              <span style={{ color: "var(--danger)", fontWeight: "bold", marginLeft: "10px", paddingLeft: "10px", borderLeft: "1px solid rgba(255,255,255,0.2)", fontSize: "14px" }}>
                +{match.half === 1 ? match.stoppageTime1 : match.stoppageTime2}
              </span>
            )}
          </div>
        </div>

        {/* MOMENTUM BAR */}
        {(match.state === "FIRST_HALF" || match.state === "SECOND_HALF" || match.state === "EXTRA_TIME_FIRST_HALF" || match.state === "EXTRA_TIME_SECOND_HALF") && (
          <div style={{ width: "100%", maxWidth: "400px" }}>
            <div style={{ display: "flex", justifyContent: "center", fontSize: "10px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "5px" }}>
              <span>{match.teamA.name} Momentum</span>
              <span>{match.teamB.name} Momentum</span>
            </div>
            <div style={{ width: "100%", height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden", display: "flex", position: "relative" }}>
               <div style={{ width: `${momentumValue}%`, height: "100%", background: "var(--primary)", transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
               <div style={{ width: `${100 - momentumValue}%`, height: "100%", background: "var(--warning)", transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }}></div>
               <div style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "2px", background: "rgba(255,255,255,0.2)" }}></div>
            </div>
          </div>
        )}

        {/* MATCH CONTROLS */}
        {!isSpectator && (
          <div style={{ display: "flex", gap: "10px", marginTop: "20px", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
            <button 
              onClick={() => setUndoModal(true)} 
              disabled={!match.pastStates || match.pastStates.length === 0}
              className={`btn-primary ${highlightUndo ? 'pulse-highlight' : ''}`}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--bg-card)", color: "white", padding: "10px 20px", borderRadius: "30px", border: "1px solid rgba(255, 255, 255, 0.1)" }}
              title="Undo Last Event"
            >
              <Undo size={18} /> Undo
            </button>

            {match.state === "NOT_STARTED" && (
              <button onClick={() => updateMatchState(id, "FIRST_HALF")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px" }}>
                <Play size={20} /> Start Match
              </button>
            )}
            {match.state === "FIRST_HALF" && (
              <button onClick={() => updateMatchState(id, "HALFTIME")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--warning)", color: "black", padding: "10px 20px", borderRadius: "30px" }}>
                <StopCircle size={20} /> End First Half
              </button>
            )}
            {match.state === "HALFTIME" && (
              <button onClick={() => { setMatchHalf(id, 2); updateMatchState(id, "SECOND_HALF"); }} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px" }}>
                <Play size={20} /> Start Second Half
              </button>
            )}
            {match.state === "SECOND_HALF" && (
              <button onClick={() => updateMatchState(id, "FULL_TIME")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--danger)", padding: "10px 20px", borderRadius: "30px" }}>
                <StopCircle size={20} /> End Regulation
              </button>
            )}
            {match.state === "FULL_TIME" && (
              <>
                {(match.teamA.score !== match.teamB.score || match.matchResolution === "League / Friendly") && (
                   <button onClick={() => {
                     const finalizedMatch = finishMatch(id);
                     if (finalizedMatch && finalizedMatch.tournamentId) {
                       processTournamentMatch(finalizedMatch.tournamentId, finalizedMatch);
                     }
                   }} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--danger)", padding: "10px 20px", borderRadius: "30px" }}>
                     <StopCircle size={20} /> End Match
                   </button>
                )}
                {(match.teamA.score === match.teamB.score && match.matchResolution === "Knockout") && (
                   <>
                     <button onClick={() => {
                       const finalizedMatch = finishMatch(id);
                       if (finalizedMatch && finalizedMatch.tournamentId) {
                         processTournamentMatch(finalizedMatch.tournamentId, finalizedMatch);
                       }
                     }} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--danger)", padding: "10px 20px", borderRadius: "30px" }}>
                       <StopCircle size={20} /> End Match as Draw
                     </button>
                     <button onClick={() => setExtraTimeModal(true)} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--warning)", color: "black", padding: "10px 20px", borderRadius: "30px" }}>
                       <Play size={20} /> Start Extra Time
                     </button>
                   </>
                )}
              </>
            )}
            {match.state === "EXTRA_TIME_FIRST_HALF" && (
              <button onClick={() => updateMatchState(id, "EXTRA_TIME_HALFTIME")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--warning)", color: "black", padding: "10px 20px", borderRadius: "30px" }}>
                <StopCircle size={20} /> End ET 1st Half
              </button>
            )}
            {match.state === "EXTRA_TIME_HALFTIME" && (
              <button onClick={() => updateMatchState(id, "EXTRA_TIME_SECOND_HALF")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "10px 20px", borderRadius: "30px" }}>
                <Play size={20} /> Start ET 2nd Half
              </button>
            )}
            {match.state === "EXTRA_TIME_SECOND_HALF" && (
              <button onClick={() => updateMatchState(id, "EXTRA_TIME_FINISHED")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--danger)", padding: "10px 20px", borderRadius: "30px" }}>
                <StopCircle size={20} /> End Extra Time
              </button>
            )}
            {match.state === "EXTRA_TIME_FINISHED" && (
              <>
                {(match.teamA.score !== match.teamB.score) && (
                   <button onClick={() => {
                     const finalizedMatch = finishMatch(id);
                     if (finalizedMatch && finalizedMatch.tournamentId) {
                       processTournamentMatch(finalizedMatch.tournamentId, finalizedMatch);
                     }
                   }} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--danger)", padding: "10px 20px", borderRadius: "30px" }}>
                     <StopCircle size={20} /> End Match
                   </button>
                )}
                {(match.teamA.score === match.teamB.score) && (
                   <>
                     <button onClick={() => {
                       const finalizedMatch = finishMatch(id);
                       if (finalizedMatch && finalizedMatch.tournamentId) {
                         processTournamentMatch(finalizedMatch.tournamentId, finalizedMatch);
                       }
                     }} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--danger)", padding: "10px 20px", borderRadius: "30px" }}>
                       <StopCircle size={20} /> End Match as Draw
                     </button>
                     <button onClick={() => updateMatchState(id, "PENALTY_SHOOTOUT")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--warning)", color: "black", padding: "10px 20px", borderRadius: "30px" }}>
                       <Play size={20} /> Start Penalty Shootout
                     </button>
                   </>
                )}
              </>
            )}
            {match.state === "PENALTY_SHOOTOUT" && (
              <button onClick={() => {
                const finalizedMatch = finishMatch(id);
                if (finalizedMatch && finalizedMatch.tournamentId) {
                  processTournamentMatch(finalizedMatch.tournamentId, finalizedMatch);
                }
              }} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--danger)", padding: "10px 20px", borderRadius: "30px" }}>
                <StopCircle size={20} /> Finish Shootout
              </button>
            )}
            {match.state === "FINISHED" && (
              <>
                <span style={{ color: "var(--danger)", fontWeight: "bold", padding: "10px 20px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "20px", textAlign: "center" }}>MATCH ENDED</span>
                <button onClick={() => navigate(`/match-report/${id}`)} className="btn-primary" style={{ padding: "10px 20px", borderRadius: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
                  View Report
                </button>
              </>
            )}
            
            <button 
              onClick={() => {
                redoEvent(id);
                toast.success({ title: "Event Redone", description: "The last undone event was restored.", icon: "🔄" });
              }} 
              disabled={!match.futureStates || match.futureStates.length === 0}
              className="btn-primary"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--bg-card)", color: "white", padding: "10px 20px", borderRadius: "30px", border: "1px solid rgba(255, 255, 255, 0.1)" }}
              title="Redo Event"
            >
              <Redo size={18} /> Redo
            </button>
          </div>
        )}
      </div>
      </div>

      {/* TABS */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", overflowX: "auto", paddingBottom: "10px" }}>
        {["OVERVIEW", "TACTICS", "LINEUPS"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: "1 0 auto",
              padding: "10px",
              background: activeTab === tab ? "rgba(59, 130, 246, 0.1)" : "var(--bg-card)",
              border: activeTab === tab ? "1px solid var(--primary)" : "1px solid var(--border)",
              color: activeTab === tab ? "white" : "var(--text-muted)",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "12px",
              letterSpacing: "0.5px"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {activeTab === "TACTICS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="glass-panel" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "center", alignItems: "center", padding: "15px", gap: isMobile ? "15px" : "0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: isMobile ? "100%" : "auto" }}>
              <span style={{ fontWeight: "700" }}>{match.teamA.name}</span>
              <select 
                className="input-modern" 
                style={{ width: "100%" }}
                value={match.teamA.formation || ""}
                onChange={(e) => changeFormation(id, "A", e.target.value)}
                disabled={match.state === "FINISHED"}
              >
                <option value="" disabled>Setup</option>
                <option value="3-1-2">3-1-2</option>
                <option value="3-2-1">3-2-1</option>
                <option value="3-2-2">3-2-2</option>
                <option value="3-3-1">3-3-1</option>
                <option value="3-4-1">3-4-1</option>
                <option value="3-4-3">3-4-3</option>
                <option value="3-5-2">3-5-2</option>
                {/* 4 Defenders */}
                <option value="4-1-2-1-2">4-1-2-1-2</option>
                <option value="4-1-3-2">4-1-3-2</option>
                <option value="4-2-2-2">4-2-2-2</option>
                <option value="4-2-3-1">4-2-3-1</option>
                <option value="4-3-1-2">4-3-1-2</option>
                <option value="4-3-2-1">4-3-2-1</option>
                <option value="4-3-3">4-3-3</option>
                <option value="4-4-1-1">4-4-1-1</option>
                <option value="4-4-2">4-4-2</option>
                <option value="4-5-1">4-5-1</option>
                {/* 5 Defenders */}
                <option value="5-2-1">5-2-1</option>
                <option value="5-2-3">5-2-3</option>
                <option value="5-3-2">5-3-2</option>
                <option value="5-4-1">5-4-1</option>
                {/* Small Sided / Futsal */}
                <option value="1-2-1">1-2-1 (Futsal)</option>
                <option value="2-1-1">2-1-1 (Futsal)</option>
                <option value="2-2">2-2 (Futsal)</option>
                <option value="5v5">5v5</option>
                <option value="7v7">7v7</option>
                {savedFormations.map(f => <option key={f} value={f}>{f.replace("custom_", "").toUpperCase()}</option>)}
              </select>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "10px", width: isMobile ? "100%" : "auto" }}>
              {isMobile && <span style={{ fontWeight: "700" }}>{match.teamB.name}</span>}
              <select 
                className="input-modern" 
                style={{ width: "100%" }}
                value={match.teamB.formation || ""}
                onChange={(e) => changeFormation(id, "B", e.target.value)}
                disabled={match.state === "FINISHED"}
              >
                <option value="" disabled>Setup</option>
                {/* 3 Defenders */}
                <option value="3-1-2">3-1-2</option>
                <option value="3-2-1">3-2-1</option>
                <option value="3-2-2">3-2-2</option>
                <option value="3-3-1">3-3-1</option>
                <option value="3-4-1">3-4-1</option>
                <option value="3-4-3">3-4-3</option>
                <option value="3-5-2">3-5-2</option>
                {/* 4 Defenders */}
                <option value="4-1-2-1-2">4-1-2-1-2</option>
                <option value="4-1-3-2">4-1-3-2</option>
                <option value="4-2-2-2">4-2-2-2</option>
                <option value="4-2-3-1">4-2-3-1</option>
                <option value="4-3-1-2">4-3-1-2</option>
                <option value="4-3-2-1">4-3-2-1</option>
                <option value="4-3-3">4-3-3</option>
                <option value="4-4-1-1">4-4-1-1</option>
                <option value="4-4-2">4-4-2</option>
                <option value="4-5-1">4-5-1</option>
                {/* 5 Defenders */}
                <option value="5-2-1">5-2-1</option>
                <option value="5-2-3">5-2-3</option>
                <option value="5-3-2">5-3-2</option>
                <option value="5-4-1">5-4-1</option>
                {/* Small Sided / Futsal */}
                <option value="1-2-1">1-2-1 (Futsal)</option>
                <option value="2-1-1">2-1-1 (Futsal)</option>
                <option value="2-2">2-2 (Futsal)</option>
                <option value="5v5">5v5</option>
                <option value="7v7">7v7</option>
                {savedFormations.map(f => <option key={f} value={f}>{f.replace("custom_", "").toUpperCase()}</option>)}
              </select>
              {!isMobile && <span style={{ fontWeight: "700" }}>{match.teamB.name}</span>}
            </div>
          </div>
          
          {match.state !== "FINISHED" && (
            <div className="glass-panel" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px", padding: "15px", marginBottom: "15px" }}>
              <input 
                className="input-modern" 
                placeholder="Name custom formation..." 
                value={customFormationName} 
                onChange={e => setCustomFormationName(e.target.value)}
                style={{ flex: 1, padding: "8px" }}
              />
              <button onClick={() => handleSaveCustomFormation("A")} className="btn-primary" style={{ padding: "8px 12px", fontSize: "12px" }}>Save Home</button>
              <button onClick={() => handleSaveCustomFormation("B")} className="btn-primary" style={{ padding: "8px 12px", fontSize: "12px", background: "var(--warning)", color: "black" }}>Save Away</button>
            </div>
          )}
          
          {match.state === "PENALTIES" ? (
             <div className="glass-panel" style={{ padding: "12px", textAlign: "center" }}>
               <h3 style={{ fontSize: "24px", color: "var(--warning)" }}>Penalty Shootout</h3>
               <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "center", margin: "20px 0" }}>
                 {/* Team A Penalties */}
                 <div style={{ flex: 1, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                   <h4 style={{ color: "var(--primary)" }}>{match.teamA.name} ({match.penaltiesA?.filter(p => p.isGoal).length || 0})</h4>
                   <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "15px" }}>
                     {(match.penaltiesA || []).map(p => (
                       <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "20px", fontSize: "12px", border: p.isGoal ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)" }} title={p.shotType ? `${p.shotType} to ${p.placement}` : ""}>
                         <span>{p.isGoal ? "⚽" : "❌"}</span> {p.playerName}
                       </div>
                     ))}
                   </div>
                   <button onClick={() => setPenaltyWizard({ isOpen: true, team: "A", step: 1, shooterId: null, shooterName: null, shotType: null, placement: null, result: null })} className="btn-primary" style={{ width: "100%", marginBottom: "10px", padding: "10px", background: "rgba(37,99,235,0.2)" }}>
                     Take Penalty
                   </button>
                 </div>
                 
                 <div style={{ width: isMobile ? "100%" : "2px", height: isMobile ? "2px" : "auto", background: "var(--border)", margin: isMobile ? "20px 0" : "0 20px" }}></div>
                 
                 {/* Team B Penalties */}
                 <div style={{ flex: 1, textAlign: isMobile ? "center" : "right" }}>
                   <h4 style={{ color: "var(--warning)" }}>{match.teamB.name} ({match.penaltiesB?.filter(p => p.isGoal).length || 0})</h4>
                   <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", marginBottom: "15px", justifyContent: "flex-end" }}>
                     {(match.penaltiesB || []).map(p => (
                       <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(255,255,255,0.05)", padding: "5px 10px", borderRadius: "20px", fontSize: "12px", border: p.isGoal ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)" }} title={p.shotType ? `${p.shotType} to ${p.placement}` : ""}>
                         {p.playerName} <span>{p.isGoal ? "⚽" : "❌"}</span>
                       </div>
                     ))}
                   </div>
                   <button onClick={() => setPenaltyWizard({ isOpen: true, team: "B", step: 1, shooterId: null, shooterName: null, shotType: null, placement: null, result: null })} className="btn-primary" style={{ width: "100%", marginBottom: "10px", padding: "10px", background: "rgba(245,158,11,0.2)", color: "var(--warning)", border: "1px solid var(--warning)" }}>
                     Take Penalty
                   </button>
                 </div>
               </div>
             </div>
          ) : (
            <Pitch matchId={id} teamA={match.teamA} teamB={match.teamB} />
          )}
        </div>
      )}
      
      {activeTab === "OVERVIEW" && (
        <div className="glass-panel">
          <h3 style={{ margin: "0 0 20px 0", fontSize: "20px" }}>Match Timeline</h3>
          {match.timeline.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <p>No events recorded yet.</p>
              <p style={{ fontSize: "14px" }}>Start the match and use the Lineups tab to add goals and cards.</p>
            </div>
          ) : (
            <div>
              {match.timeline.map(event => (
                <div key={event.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ fontWeight: "800", width: "40px", fontSize: "18px", color: "var(--text-muted)" }}>{event.minute}'</div>
                  <div style={{ fontSize: "24px" }}>
                    {event.type === "GOAL" && "⚽"}
                    {event.type === "DISALLOWED_GOAL_OFFSIDE" && <span style={{ filter: "grayscale(1)", opacity: 0.6 }}>⚽</span>}
                    {event.type === "BANGER" && "🔥"}
                    {event.type === "PENALTY" && "🎯"}
                    {event.type === "OWN_GOAL" && "🥅"}
                    {event.type === "YELLOW_CARD" && "🟨"}
                    {event.type === "RED_CARD" && "🟥"}
                    {event.type === "SUBSTITUTION" && "🔄"}
                    {event.type === "CAPTAIN_CHANGE" && "©️"}
                    {event.type === "GK_CHANGE" && "🧤"}
                    {event.type === "FOUL" && "⚖️"}
                    {event.type === "OFFSIDE" && "🚩"}
                    {event.type === "SAVE" && "🧤"}
                    {event.type === "FREEKICK" && (event.isGoal ? "🎯" : "👟")}
                    {event.type === "PENALTY_SHOOTOUT" && (event.isGoal ? "⚽" : "❌")}
                  </div>
                  <div>
                    <span style={{ fontWeight: "700", fontSize: "16px", color: event.type === "DISALLOWED_GOAL_OFFSIDE" ? "var(--text-muted)" : "inherit", textDecoration: event.type === "DISALLOWED_GOAL_OFFSIDE" ? "line-through" : "none" }}>
                      {event.playerName} 
                      {event.type === "PENALTY" && <span style={{ color: "var(--text-muted)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>(P)</span>}
                      {event.type === "OWN_GOAL" && <span style={{ color: "var(--danger)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>(OG)</span>}
                      {event.type === "FOUL" && <span style={{ color: "var(--warning)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>(Fouled)</span>}
                      {event.type === "FREEKICK" && event.isGoal && <span style={{ color: "var(--warning)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>(Freekick Goal)</span>}
                      {event.type === "DISALLOWED_GOAL_OFFSIDE" && <span style={{ color: "var(--danger)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>🚫 Offside</span>}
                      {event.type === "OFFSIDE" && <span style={{ color: "var(--warning)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>⚠️ Offside</span>}
                      {event.type === "SAVE" && <span style={{ color: "var(--warning)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>({event.saveQuality || "Save"})</span>}
                      {event.type === "PENALTY_SHOOTOUT" && <span style={{ color: "var(--warning)", fontSize: "14px", marginLeft: "5px", textDecoration: "none" }}>({event.isGoal ? "Shootout Goal" : "Shootout Miss"})</span>}
                    </span>
                    {event.commentary && <span style={{ color: event.type === "DISALLOWED_GOAL_OFFSIDE" ? "var(--text-muted)" : "var(--accent)", fontSize: "14px", display: "block", fontStyle: "italic", marginTop: "2px" }}>"{event.commentary}"</span>}
                    {event.assistPlayerName && event.type !== "CAPTAIN_CHANGE" && event.type !== "GK_CHANGE" && <span style={{ color: "var(--text-muted)", fontSize: "14px", display: "block", marginTop: "4px" }}>{event.type === "SUBSTITUTION" ? "Off: " : event.type === "FOUL" ? "Committed by: " : event.type === "SAVE" ? "Shot by: " : "Assist: "}{event.assistPlayerName}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "LINEUPS" && (
        <div style={{ display: "flex", gap: "12px", flexDirection: window.innerWidth < 768 ? "column" : "row" }}>
          {renderLineup("A", match.teamA)}
          {renderLineup("B", match.teamB)}
        </div>
      )}

      {/* GOAL ASSIST MODAL MULTI-STEP */}
      {goalModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "450px", padding: "15px", textAlign: "center", border: "1px solid var(--primary)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚽</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>Record Goal</h3>
            
            <div style={{ display: "flex", gap: "5px", marginBottom: "20px", justifyContent: "center" }}>
               {[1, 2, 3, 4].map(s => <div key={s} style={{ width: "20px", height: "4px", background: goalModal.step >= s ? "var(--primary)" : "rgba(255,255,255,0.2)", borderRadius: "2px", transition: "all 0.3s" }} />)}
            </div>

            {goalModal.step === 1 && (
              <>
                <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "16px" }}>Who scored?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto", marginBottom: "25px" }}>
                  {match[goalModal.team === "A" ? "teamA" : "teamB"].players.map(p => (
                    <button key={p.id} onClick={() => setGoalModal({ ...goalModal, scorerId: p.id, scorerName: p.name, step: 2 })} style={{ padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "16px", fontWeight: "700", cursor: "pointer", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.name}
                    </button>
                  ))}
                </div>
              </>
            )}

            {goalModal.step === 2 && (
              <>
                <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "16px" }}>Goal Type for <strong style={{ color: "white" }}>{goalModal.scorerName}</strong></p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "25px" }}>
                  {["GOAL", "ASSISTED_GOAL", "PENALTY", "FREEKICK", "HEADER", "VOLLEY", "OWN_GOAL", "DISALLOWED_GOAL_OFFSIDE", "DISALLOWED_GOAL"].map(type => {
                     let label = type;
                     if (type === "GOAL") label = "Normal Goal";
                     else if (type === "ASSISTED_GOAL") label = "Assisted Goal";
                     else if (type === "PENALTY") label = "Penalty Goal";
                     else if (type === "FREEKICK") label = "Free Kick Goal";
                     else if (type === "HEADER") label = "Header Goal";
                     else if (type === "VOLLEY") label = "Volley Goal";
                     else if (type === "OWN_GOAL") label = "Own Goal";
                     else if (type === "DISALLOWED_GOAL_OFFSIDE") label = "Offside Goal";
                     else if (type === "DISALLOWED_GOAL") label = "Disallowed Goal";

                     return (
                        <button 
                          key={type}
                          onClick={() => {
                            const needsAssist = ["ASSISTED_GOAL", "HEADER", "VOLLEY", "GOAL"].includes(type);
                            setGoalModal({ ...goalModal, type, step: needsAssist ? 3 : 4 });
                          }}
                          style={{
                            padding: "12px", fontSize: "14px", fontWeight: "800", borderRadius: "12px",
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            color: "white",
                            gridColumn: type === "DISALLOWED_GOAL" ? "span 2" : "span 1",
                            cursor: "pointer"
                          }}
                        >
                          {label}
                        </button>
                     )
                  })}
                </div>
              </>
            )}

            {goalModal.step === 3 && (
              <>
                <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "16px" }}>Who assisted <strong style={{ color: "white" }}>{goalModal.scorerName}</strong>?</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "250px", overflowY: "auto", marginBottom: "25px" }}>
                  <button onClick={() => setGoalModal({ ...goalModal, assistId: null, assistName: null, step: 4 })} style={{ textAlign: "center", padding: "16px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                    No Assist / Solo
                  </button>
                  
                  {match[goalModal.team === "A" ? "teamA" : "teamB"].players
                    .filter(p => p.id !== goalModal.scorerId && p.stats.redCards === 0)
                    .map(p => (
                      <button key={p.id} onClick={() => setGoalModal({ ...goalModal, assistId: p.id, assistName: p.name, step: 4 })} style={{ textAlign: "center", padding: "16px", borderRadius: "12px", border: "1px solid var(--accent)", background: "rgba(16, 185, 129, 0.1)", color: "white", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                        {p.name}
                      </button>
                  ))}
                </div>
              </>
            )}

            {goalModal.step === 4 && (
              <>
                 <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "16px" }}>Confirm Event</p>
                 <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "12px", padding: "12px", marginBottom: "20px", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-muted)" }}>Scorer: <span style={{ color: "white", fontWeight: "800" }}>{goalModal.scorerName}</span></p>
                   <p style={{ margin: "0 0 10px 0", fontSize: "14px", color: "var(--text-muted)" }}>Type: <span style={{ color: "var(--primary)", fontWeight: "800" }}>{goalModal.type.replace(/_/g, " ")}</span></p>
                   {goalModal.assistName && <p style={{ margin: "0", fontSize: "14px", color: "var(--text-muted)" }}>Assist: <span style={{ color: "var(--accent)", fontWeight: "800" }}>{goalModal.assistName}</span></p>}
                 </div>
                 <button onClick={confirmGoal} className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "18px", fontWeight: "800" }}>Record Goal</button>
              </>
            )}
            
            <button onClick={() => setGoalModal({ isOpen: false, team: null, scorerId: null, scorerName: null, type: "GOAL", step: 1, assistId: null, assistName: null })} style={{ width: "100%", background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "14px", fontWeight: "700", cursor: "pointer", padding: "10px", marginTop: "10px" }}>Cancel Event</button>
          </div>
        </div>
      )}

      {/* SUB MODAL */}
      {subModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "450px", padding: "15px", textAlign: "center", border: "1px solid var(--primary)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🔄</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>Substitution</h3>
            {subModal.reverse ? (
              <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "16px" }}><strong style={{ color: "white" }}>{subModal.playerOnName}</strong> is coming on. Who is coming off?</p>
            ) : (
              <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "16px" }}><strong style={{ color: "white" }}>{subModal.playerOffName}</strong> is coming off. Who is coming on?</p>
            )}
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", marginBottom: "20px" }}>
              {subModal.reverse ? (
                match[subModal.team === "A" ? "teamA" : "teamB"].players
                  .filter(p => p.stats.redCards === 0)
                  .map(p => (
                    <button key={p.id} onClick={() => executeSub(p.id)} className="glass-panel" style={{ padding: "15px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontWeight: "600" }}>{p.name}</span>
                    </button>
                  ))
              ) : (
                match[subModal.team === "A" ? "teamA" : "teamB"].bench
                  .filter(p => match.subRules?.includes("Rolling") || match.subRules?.includes("Futsal") || !p.isSubbedOff)
                  .map(p => (
                    <button key={p.id} onClick={() => executeSub(p.id)} className="glass-panel" style={{ padding: "15px", border: "1px solid var(--border)", background: "transparent", cursor: "pointer", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontWeight: "600" }}>{p.name}</span>
                    </button>
                ))
              )}
              {subModal.reverse && match[subModal.team === "A" ? "teamA" : "teamB"].players.filter(p => p.stats.redCards === 0).length === 0 && (
                <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No players available.</p>
              )}
              {!subModal.reverse && match[subModal.team === "A" ? "teamA" : "teamB"].bench.filter(p => match.subRules?.includes("Rolling") || match.subRules?.includes("Futsal") || !p.isSubbedOff).length === 0 && (
                <p style={{ color: "var(--text-muted)", textAlign: "center" }}>No available subs.</p>
              )}
            </div>
            
            <button onClick={() => setSubModal({ isOpen: false, team: null, playerOffId: null, playerOffName: null, playerOnId: null, playerOnName: null, reverse: false })} className="btn-primary" style={{ width: "100%", background: "transparent", border: "1px solid var(--border)" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* EDIT PLAYER MODAL */}
      {editPlayerModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "12px" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "450px", padding: "15px", textAlign: "center", display: "flex", flexDirection: "column", border: "1px solid var(--primary)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px", textAlign: "center" }}>👤</div>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px", textAlign: "center" }}>Choose Player</h3>
            
            <div style={{ marginBottom: "25px", background: "rgba(255,255,255,0.03)", padding: "12px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.05)" }}>
              <label style={{ display: "block", marginBottom: "10px", color: "var(--text-main)", fontSize: "15px", fontWeight: "bold", textAlign: "left" }}>Search Registered Players</label>
              <input 
                className="input-modern"
                placeholder="Search by Name or Mobile Number..."
                value={editPlayerModal.searchQuery || ""}
                onChange={(e) => setEditPlayerModal({ ...editPlayerModal, searchQuery: e.target.value })}
                style={{ padding: "14px 15px", fontSize: "16px", width: "100%" }}
              />
              {editPlayerModal.searchQuery && editPlayerModal.searchQuery.length > 1 && (
                <div style={{ marginTop: "10px", maxHeight: "200px", overflowY: "auto", background: "rgba(0,0,0,0.5)", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  {players.filter(p => p.name.toLowerCase().includes(editPlayerModal.searchQuery.toLowerCase()) || (p.phone && p.phone.includes(editPlayerModal.searchQuery))).map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => setEditPlayerModal({ ...editPlayerModal, name: p.name, phone: p.phone || "", playerId: p.id, searchQuery: "", role: p.position || editPlayerModal.role })} 
                      style={{ padding: "15px", borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{ fontWeight: "bold", fontSize: "16px" }}>{p.name}</span>
                      {p.phone && <span style={{ color: "var(--primary)", fontSize: "14px", fontWeight: "700", background: "rgba(59, 130, 246, 0.1)", padding: "6px 10px", borderRadius: "8px" }}>📱 {p.phone}</span>}
                    </div>
                  ))}
                  {players.filter(p => p.name.toLowerCase().includes(editPlayerModal.searchQuery.toLowerCase()) || (p.phone && p.phone.includes(editPlayerModal.searchQuery))).length === 0 && (
                    <div style={{ padding: "15px", color: "var(--text-muted)", fontSize: "14px", fontStyle: "italic" }}>No registered players match your search.</div>
                  )}
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "25px" }}>
              <div style={{ textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px", fontWeight: "bold" }}>Player Name</label>
                <input 
                  className="input-modern"
                  value={editPlayerModal.name}
                  onChange={(e) => setEditPlayerModal({ ...editPlayerModal, name: e.target.value })}
                  style={{ padding: "14px 15px", fontSize: "16px", width: "100%" }}
                />
              </div>
              
              <div style={{ textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px", fontWeight: "bold" }}>Mobile Number</label>
                <input 
                  className="input-modern"
                  type="tel"
                  placeholder="e.g. +919876543210"
                  value={editPlayerModal.phone || ""}
                  onChange={(e) => setEditPlayerModal({ ...editPlayerModal, phone: e.target.value })}
                  style={{ padding: "14px 15px", fontSize: "16px", width: "100%" }}
                />
              </div>

              <div style={{ textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "14px", fontWeight: "bold" }}>Player Position</label>
                <select 
                  className="input-modern"
                  value={editPlayerModal.role}
                  onChange={(e) => setEditPlayerModal({ ...editPlayerModal, role: e.target.value })}
                  style={{ padding: "14px 15px", fontSize: "16px", width: "100%" }}
                >
                  <option value="GK">Goalkeeper (GK)</option>
                  <option value="CB">Center Back (CB)</option>
                  <option value="LB">Left Back (LB)</option>
                  <option value="RB">Right Back (RB)</option>
                  <option value="CDM">Defensive Midfielder (CDM)</option>
                  <option value="CM">Central Midfielder (CM)</option>
                  <option value="CAM">Attacking Midfielder (CAM)</option>
                  <option value="LW">Left Winger (LW)</option>
                  <option value="RW">Right Winger (RW)</option>
                  <option value="ST">Striker (ST)</option>
                  <option value="UNASSIGNED">Unassigned</option>
                </select>
              </div>
            </div>
            
            <div style={{ marginBottom: "25px" }}>
              <button 
                onClick={() => {
                  setCaptain(id, editPlayerModal.team, editPlayerModal.playerId);
                  handleEditPlayerSubmit();
                }}
                className="btn-primary" 
                style={{ width: "100%", padding: "16px", background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)", border: "1px solid var(--warning)", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", fontSize: "16px", fontWeight: "bold" }}
              >
                <Crown size={20} /> Assign as Captain & Save
              </button>
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "auto" }}>
              <button onClick={() => setEditPlayerModal({ isOpen: false, team: null, playerId: null, name: "", role: "", phone: "", searchQuery: "" })} className="btn-primary" style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", padding: "16px", fontSize: "16px" }}>Cancel</button>
              <button onClick={handleEditPlayerSubmit} className="btn-primary" style={{ flex: 1, padding: "16px", fontSize: "16px", fontWeight: "bold" }}>Save Player</button>
            </div>
          </div>
        </div>
      )}

      {/* STOPPAGE TIME MODAL */}
      {stoppageModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "12px" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "350px", textAlign: "center" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "22px" }}>Add Stoppage Time?</h3>
            <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "14px" }}>Regulation time is ending. How many minutes to add?</p>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center", marginBottom: "20px", maxHeight: "250px", overflowY: "auto", padding: "10px" }}>
              {[...Array(21).keys()].map(mins => (
                <button 
                  key={mins}
                  onClick={() => {
                    addStoppageTime(id, match.half, mins);
                    setStoppageModal(false);
                  }}
                  className="btn-primary" 
                  style={{ width: "60px", height: "60px", fontSize: "18px", fontWeight: "800", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border)", flexShrink: 0 }}
                >
                  +{mins}
                </button>
              ))}
            </div>

            <button onClick={() => setStoppageModal(false)} className="btn-primary" style={{ width: "100%", background: "transparent", border: "1px solid var(--border)" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* FOUL MODAL */}
      {foulModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "12px" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "450px", padding: "15px", textAlign: "center", border: "1px solid var(--primary)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>⚖️</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>Record Incident</h3>
            <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "16px" }}><strong style={{ color: "white" }}>{foulModal.fouledPlayerName}</strong> was involved.</p>

            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <button 
                onClick={() => setFoulModal({ ...foulModal, isOffside: false })}
                className="btn-primary" 
                style={{ flex: 1, background: !foulModal.isOffside ? "var(--primary)" : "rgba(255,255,255,0.1)", border: "1px solid var(--primary)" }}
              >
                ⚖️ Foul
              </button>
              <button 
                onClick={() => setFoulModal({ ...foulModal, isOffside: true })}
                className="btn-primary" 
                style={{ flex: 1, background: foulModal.isOffside ? "var(--warning)" : "rgba(255,255,255,0.1)", color: foulModal.isOffside ? "black" : "white", border: "1px solid var(--warning)" }}
              >
                🚩 Offside
              </button>
            </div>

            {foulModal.isOffside ? (
               <div style={{ marginBottom: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
                 <p style={{ fontSize: "14px" }}>Record offside against {foulModal.fouledPlayerName}?</p>
                 <button onClick={() => {
                   addEvent(id, { type: "OFFSIDE", team: foulModal.team, playerId: foulModal.fouledPlayerId, playerName: foulModal.fouledPlayerName, minute: matchMinute });
                   setFoulModal({ isOpen: false, team: null, fouledPlayerId: null, fouledPlayerName: null, foulingPlayerId: null, foulingPlayerName: null, isFreekick: false, freekickTakerId: null, freekickTakerName: null, card: null, isGoal: false, isOffside: false, step: 1 });
                 }} className="btn-primary" style={{ width: "100%" }}>Confirm Offside</button>
               </div>
            ) : (
              <>
                {foulModal.step === 1 && (
                  <>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold" }}>Who committed the foul? (Optional)</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
                  <button onClick={() => setFoulModal({ ...foulModal, step: 2 })} className="glass-panel" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)" }}>
                    <span style={{ fontWeight: "700" }}>Skip / Unknown</span>
                  </button>
                  {match[foulModal.team === "A" ? "teamB" : "teamA"].players.filter(p => p.stats.redCards === 0).map(p => (
                    <button key={p.id} onClick={() => setFoulModal({ ...foulModal, foulingPlayerId: p.id, foulingPlayerName: p.name, step: 2 })} className="glass-panel" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", border: "1px solid var(--border)", background: "transparent" }}>
                      <span style={{ fontWeight: "600" }}>{p.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {foulModal.step === 2 && (
              <>
                {foulModal.foulingPlayerId && (
                  <div style={{ marginBottom: "20px" }}>
                    <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold" }}>Card for {foulModal.foulingPlayerName}?</label>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => setFoulModal({ ...foulModal, card: null, step: 3 })} className="btn-primary" style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid var(--border)" }}>None</button>
                      <button onClick={() => setFoulModal({ ...foulModal, card: "YELLOW_CARD", step: 3 })} className="btn-primary" style={{ flex: 1, background: "var(--warning)", color: "black" }}>Yellow 🟨</button>
                      <button onClick={() => setFoulModal({ ...foulModal, card: "RED_CARD", step: 3 })} className="btn-primary" style={{ flex: 1, background: "var(--danger)", color: "white" }}>Red 🟥</button>
                    </div>
                  </div>
                )}
                {!foulModal.foulingPlayerId && (
                  <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                     <button onClick={() => setFoulModal({ ...foulModal, step: 3 })} className="btn-primary" style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1px solid var(--border)" }}>Next</button>
                  </div>
                )}
              </>
            )}

            {foulModal.step === 3 && (
              <>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold" }}>Freekick Result?</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
                  <button onClick={() => submitFoul()} className="glass-panel" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "15px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.05)" }}>
                    <span style={{ fontWeight: "700" }}>No direct shot / Missed</span>
                  </button>
                  <button onClick={() => setFoulModal({ ...foulModal, isFreekick: true, isGoal: true, step: 4 })} className="glass-panel" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "15px", border: "1px solid var(--primary)", background: "rgba(59, 130, 246, 0.2)" }}>
                    <span style={{ fontWeight: "700", color: "white" }}>Scored Freekick Goal ⚽</span>
                  </button>
                </div>
              </>
            )}

            {foulModal.step === 4 && (
              <>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold" }}>Who scored the freekick?</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "200px", overflowY: "auto", marginBottom: "20px" }}>
                  {match[foulModal.team === "A" ? "teamA" : "teamB"].players.filter(p => p.stats.redCards === 0).map(p => (
                    <button key={p.id} onClick={() => {
                      setFoulModal(prev => {
                        const updated = { ...prev, freekickTakerId: p.id, freekickTakerName: p.name };
                        // We must call submitFoul with updated state. Since submitFoul uses closure state, we do it in a timeout or rewrite it.
                        setTimeout(() => {
                           addEvent(id, {
                            type: "FOUL",
                            team: updated.team,
                            playerId: updated.fouledPlayerId,
                            playerName: updated.fouledPlayerName,
                            assistPlayerId: updated.foulingPlayerId,
                            assistPlayerName: updated.foulingPlayerName,
                            minute: matchMinute
                          });
                          if (updated.card) {
                            addEvent(id, {
                              type: updated.card,
                              team: updated.team === "A" ? "B" : "A",
                              playerId: updated.foulingPlayerId,
                              playerName: updated.foulingPlayerName,
                              minute: matchMinute
                            });
                          }
                          addEvent(id, {
                            type: "FREEKICK",
                            team: updated.team,
                            playerId: updated.freekickTakerId,
                            playerName: updated.freekickTakerName,
                            isGoal: updated.isGoal,
                            minute: matchMinute
                          });
                          setFoulModal({ isOpen: false, team: null, fouledPlayerId: null, fouledPlayerName: null, foulingPlayerId: null, foulingPlayerName: null, isFreekick: false, freekickTakerId: null, freekickTakerName: null, card: null, isGoal: false, step: 1 });
                        }, 0);
                        return updated;
                      });
                    }} className="glass-panel" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", border: "1px solid var(--border)", background: "transparent" }}>
                      <span style={{ fontWeight: "600" }}>{p.name}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            </>
            )}

            <button onClick={() => setFoulModal({ isOpen: false, team: null, fouledPlayerId: null, fouledPlayerName: null, foulingPlayerId: null, foulingPlayerName: null, isFreekick: false, freekickTakerId: null, freekickTakerName: null, card: null, isGoal: false, isOffside: false, step: 1 })} className="btn-primary" style={{ width: "100%", background: "transparent", border: "1px solid var(--border)" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* SAVE MODAL */}
      {saveModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "12px" }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "450px", padding: "15px", textAlign: "center", border: "1px solid var(--primary)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>🧤</div>
            <h3 style={{ margin: "0 0 5px 0", fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>Record Save</h3>
            <p style={{ margin: "0 0 15px 0", color: "var(--text-muted)", fontSize: "16px" }}><strong style={{ color: "white" }}>{saveModal.keeperName}</strong> made a save.</p>
            
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold" }}>Save Quality</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {["Simple Save", "Good Save", "Brilliant Save", "Reflex Save", "One-Handed Save", "Penalty Save", "Finger-Tip Save", "Close Range Save", "World Class Save"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setSaveModal({ ...saveModal, saveQuality: type })}
                    style={{
                      padding: "8px 12px", fontSize: "12px", fontWeight: "bold", borderRadius: "8px",
                      background: saveModal.saveQuality === type ? "var(--warning)" : "rgba(255,255,255,0.1)",
                      border: saveModal.saveQuality === type ? "1px solid var(--warning)" : "1px solid var(--border)",
                      color: saveModal.saveQuality === type ? "black" : "white"
                    }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" checked={saveModal.isPenalty} onChange={(e) => setSaveModal({ ...saveModal, isPenalty: e.target.checked })} />
                From Penalty
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", cursor: "pointer" }}>
                <input type="checkbox" checked={saveModal.isRebound} onChange={(e) => setSaveModal({ ...saveModal, isRebound: e.target.checked })} />
                From Rebound
              </label>
            </div>

            <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold" }}>Who took the shot? (Optional)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "150px", overflowY: "auto", marginBottom: "20px" }}>
              <button onClick={() => setSaveModal({ ...saveModal, shotTakerId: null, shotTakerName: null })} className="glass-panel" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", border: saveModal.shotTakerId === null ? "1px solid var(--primary)" : "1px solid var(--border)", background: saveModal.shotTakerId === null ? "rgba(59, 130, 246, 0.2)" : "rgba(255,255,255,0.05)" }}>
                <span style={{ fontWeight: "700" }}>Unknown / Unassigned</span>
              </button>
              
              {match[saveModal.team === "A" ? "teamB" : "teamA"].players
                .filter(p => p.stats.redCards === 0)
                .map(p => (
                  <button key={p.id} onClick={() => setSaveModal({ ...saveModal, shotTakerId: p.id, shotTakerName: p.name })} className="glass-panel" style={{ textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", border: saveModal.shotTakerId === p.id ? "1px solid var(--primary)" : "1px solid var(--border)", background: saveModal.shotTakerId === p.id ? "rgba(59, 130, 246, 0.2)" : "transparent" }}>
                    <span style={{ fontWeight: "600" }}>{p.name}</span>
                  </button>
              ))}
            </div>
            
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setSaveModal({ isOpen: false, team: null, keeperId: null, keeperName: null, shotTakerId: null, shotTakerName: null, saveQuality: "Simple Save", isPenalty: false, isRebound: false })} className="btn-primary" style={{ flex: 1, background: "transparent", border: "1px solid var(--border)" }}>Cancel</button>
              <button onClick={submitSave} className="btn-primary" style={{ flex: 1 }}>Record Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ATMOSPHERE OVERLAY */}
      {matchEventOverlay?.isOpen && (
        <div style={{
          position: "fixed",
          top: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          background: matchEventOverlay.color,
          color: "white",
          padding: "20px 40px",
          borderRadius: "12px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          zIndex: 9999,
          textAlign: "center",
          animation: "slideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
        }}>
          <h1 style={{ margin: 0, fontSize: "48px", fontWeight: "900", fontStyle: "italic", textTransform: "uppercase", letterSpacing: "2px" }}>
            {matchEventOverlay.text}
          </h1>
          <p style={{ margin: "5px 0 0 0", fontSize: "20px", fontWeight: "600", opacity: 0.9 }}>
            {matchEventOverlay.subtext}
          </p>
        </div>
      )}
      {/* Extra Time Modal */}
      {extraTimeModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "450px", padding: "15px", textAlign: "center", border: "1px solid var(--primary)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "28px", fontWeight: "900" }}>Extra Time Duration</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <div style={{ background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontWeight: "bold" }}>Total Extra Time Duration</span>
                <p style={{ margin: 0, fontSize: "12px", color: "var(--text-muted)" }}>This will be split into two equal halves.</p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap", marginTop: "10px" }}>
                  {[10, 20, 30].map(mins => (
                    <button key={mins} onClick={() => setExtraTimeInput(mins)} style={{ padding: "8px", borderRadius: "8px", border: "1px solid var(--primary)", background: extraTimeInput === mins ? "var(--primary)" : "transparent", color: "white", cursor: "pointer", flex: 1, minWidth: "60px" }}>{mins}m</button>
                  ))}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>Custom:</span>
                    <input type="number" className="input-modern" value={extraTimeInput} onChange={e => setExtraTimeInput(Number(e.target.value))} style={{ width: "70px", textAlign: "center", padding: "8px" }} />
                    <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>m</span>
                  </div>
                </div>
                <button onClick={() => { addExtraTime(id, extraTimeInput); setExtraTimeModal(false); }} className="btn-primary" style={{ padding: "10px", marginTop: "15px" }}>Start Extra Time</button>
              </div>
              
              <button onClick={() => setExtraTimeModal(false)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", padding: "10px", cursor: "pointer", fontWeight: "bold" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Penalty Shootout Wizard Modal */}
      {penaltyWizard.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "500px", padding: "15px", border: `2px solid ${penaltyWizard.team === "A" ? "var(--primary)" : "var(--warning)"}`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "24px", fontWeight: "900", textAlign: "center" }}>Take Penalty for {(penaltyWizard.team === "A" ? match.teamA : match.teamB).name}</h3>
            
            {penaltyWizard.step === 1 && (
              <div className="animate-fade-in">
                <p style={{ marginBottom: "15px", color: "var(--text-muted)", textAlign: "center" }}>Step 1: Select Shooter</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
                  {(() => {
                    const teamData = penaltyWizard.team === "A" ? match.teamA : match.teamB;
                    const penalties = penaltyWizard.team === "A" ? match.penaltiesA || [] : match.penaltiesB || [];
                    const teamSize = teamData.players.length;
                    const cycle = teamSize > 0 ? Math.floor(penalties.length / teamSize) : 0;
                    const cyclePenalties = penalties.slice(cycle * teamSize);
                    const usedPlayerIds = cyclePenalties.map(p => p.playerId);
                    
                    return teamData.players
                      .filter(p => !usedPlayerIds.includes(p.id))
                      .map(p => (
                      <button key={p.id} onClick={() => setPenaltyWizard({...penaltyWizard, step: 2, shooterId: p.id, shooterName: p.name})} style={{ padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "8px", color: "white", cursor: "pointer", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                        <span style={{ fontWeight: "600" }}>{p.name}</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "12px", background: "rgba(0,0,0,0.3)", padding: "2px 6px", borderRadius: "4px" }}>{p.position}</span>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}

            {penaltyWizard.step === 2 && (
              <div className="animate-fade-in">
                <p style={{ marginBottom: "15px", color: "var(--text-muted)", textAlign: "center" }}>Step 2: Select Shot Type for <strong style={{ color: "white" }}>{penaltyWizard.shooterName}</strong></p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {["Hard Shot", "Placement Shot", "Curled Shot", "Chip (Panenka)", "Low Driven Shot", "Near Post Shot", "Far Post Shot"].map(type => (
                    <button key={type} onClick={() => setPenaltyWizard({...penaltyWizard, step: 3, shotType: type})} style={{ padding: "12px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", borderRadius: "8px", color: "white", cursor: "pointer", textAlign: "center", fontWeight: "600" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"} onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {penaltyWizard.step === 3 && (
              <div className="animate-fade-in">
                <p style={{ marginBottom: "15px", color: "var(--text-muted)", textAlign: "center" }}>Step 3: Select Placement for <strong style={{ color: "white" }}>{penaltyWizard.shotType}</strong></p>
                <div style={{ width: "100%", height: "200px", border: "4px solid white", borderBottom: "none", position: "relative", marginBottom: "20px", background: "rgba(16, 185, 129, 0.1)" }}>
                  {/* Goal Net Graphic */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"20\" height=\"20\"><path d=\"M0 0h20v20H0z\" fill=\"none\"/><path d=\"M0 0h20v1H0zM0 0v20h1V0z\" fill=\"rgba(255,255,255,0.1)\"/></svg>')", opacity: 0.5 }}></div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", height: "100%", position: "relative", zIndex: 10 }}>
                    {["Top Left", "Top Center", "Top Right", "Mid Left", "Center", "Mid Right", "Bottom Left", "Bottom Center", "Bottom Right"].map(place => (
                      <div key={place} onClick={() => setPenaltyWizard({...penaltyWizard, step: 4, placement: place})} style={{ border: "1px dashed rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <span style={{ fontSize: "12px", fontWeight: "bold", opacity: 0.8, background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: "10px" }}>{place}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {penaltyWizard.step === 4 && (
              <div className="animate-fade-in">
                <p style={{ marginBottom: "15px", color: "var(--text-muted)", textAlign: "center" }}>Step 4: Select Result of the Penalty</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                  {["Goal", "Saved", "Missed Target", "Hit Post", "Hit Crossbar"].map(res => (
                    <button key={res} onClick={() => {
                      const isGoal = res === "Goal";
                      recordPenaltyShootout(id, penaltyWizard.team, penaltyWizard.shooterId, penaltyWizard.shooterName, isGoal, penaltyWizard.shotType, penaltyWizard.placement, res);
                      setPenaltyWizard({ isOpen: false, team: null, step: 1, shooterId: null, shooterName: null, shotType: null, placement: null, result: null });
                    }} style={{ padding: "15px", background: res === "Goal" ? "rgba(16, 185, 129, 0.2)" : res === "Saved" ? "rgba(245, 158, 11, 0.2)" : "rgba(239, 68, 68, 0.2)", border: `1px solid ${res === "Goal" ? "var(--accent)" : res === "Saved" ? "var(--warning)" : "var(--danger)"}`, borderRadius: "8px", color: "white", cursor: "pointer", textAlign: "center", fontWeight: "bold", fontSize: "16px", textTransform: "uppercase", letterSpacing: "1px" }} onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}>
                      {res}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button onClick={() => setPenaltyWizard({ isOpen: false, team: null, step: 1, shooterId: null, shooterName: null, shotType: null, placement: null, result: null })} style={{ background: "transparent", border: "none", color: "var(--text-muted)", padding: "10px", width: "100%", marginTop: "15px", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Undo Modal */}
      {undoModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999 }}>
          <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.1)", padding: "15px", borderRadius: "20px", width: "90%", maxWidth: "380px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
            <div style={{ background: "rgba(245, 158, 11, 0.1)", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Undo size={32} color="var(--warning)" />
            </div>
            <h2 style={{ marginBottom: "10px", fontSize: "24px" }}>Undo Last Event?</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "30px", lineHeight: "1.5" }}>This will revert the most recently recorded event from the match timeline and update the score.</p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setUndoModal(false)} className="btn-secondary" style={{ flex: 1, padding: "14px", borderRadius: "12px", fontWeight: "600", fontSize: "15px" }}>Cancel</button>
              <button onClick={() => {
                undoEvent(id);
                setUndoModal(false);
                toast.success({ title: "Event Undone", description: "The timeline has been reverted.", icon: "↶" });
              }} className="btn-primary" style={{ flex: 1, padding: "14px", borderRadius: "12px", background: "var(--warning)", color: "black", fontWeight: "700", fontSize: "15px" }}>Confirm Undo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
