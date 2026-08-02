import { useParams, useNavigate } from "react-router-dom";
import { useMatch } from "./MatchContext";
import { ArrowLeft, Share2, Award, Clock, BarChart3, Shield } from "lucide-react";
import Pitch from "../tactics/Pitch";

export default function MatchReport() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getMatch, ratePlayer, assignMotm } = useMatch();
  
  const match = getMatch(id);

  if (!match || match.state !== "FINISHED") {
    return <div style={{ padding: "40px", textAlign: "center" }}>Match Report not found or match not finished.</div>;
  }

  const isHomeWin = match.teamA.score > match.teamB.score;
  const isAwayWin = match.teamB.score > match.teamA.score;
  const isDraw = match.teamA.score === match.teamB.score;

  const pensA = (match.penaltiesA || []).filter(p => p.isGoal).length;
  const pensB = (match.penaltiesB || []).filter(p => p.isGoal).length;
  const hasPenalties = match.penaltiesA?.length > 0 || match.penaltiesB?.length > 0;
  
  let winnerText;
  if (match.winningMethod) {
    if (isHomeWin) winnerText = `${match.teamA.name} ${match.winningMethod}`;
    else if (isAwayWin) winnerText = `${match.teamB.name} ${match.winningMethod}`;
    else if (hasPenalties) {
      if (pensA > pensB) winnerText = `${match.teamA.name} ${match.winningMethod} (${pensA}-${pensB})`;
      else if (pensB > pensA) winnerText = `${match.teamB.name} ${match.winningMethod} (${pensB}-${pensA})`;
      else winnerText = "Draw on penalties";
    } else {
      winnerText = "Match Drawn";
    }
  } else {
    if (isHomeWin) winnerText = `${match.teamA.name} wins`;
    else if (isAwayWin) winnerText = `${match.teamB.name} wins`;
    else if (hasPenalties) {
      if (pensA > pensB) winnerText = `Winner: ${match.teamA.name} wins ${pensA}–${pensB} on penalties`;
      else if (pensB > pensA) winnerText = `Winner: ${match.teamB.name} wins ${pensB}–${pensA} on penalties`;
      else winnerText = "Draw on penalties";
    } else {
      winnerText = "Match Drawn";
    }
  }

  const renderStatsLine = (label, valA, valB, invertGood = false) => {
    const aBetter = invertGood ? valA < valB : valA > valB;
    const bBetter = invertGood ? valB < valA : valB > valA;
    return (
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0" }}>
        <span style={{ width: "30%", textAlign: "right", fontWeight: aBetter ? "bold" : "normal", color: aBetter ? "var(--primary)" : "white" }}>{valA}</span>
        <span style={{ width: "40%", textAlign: "center", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</span>
        <span style={{ width: "30%", textAlign: "left", fontWeight: bBetter ? "bold" : "normal", color: bBetter ? "var(--warning)" : "white" }}>{valB}</span>
      </div>
    );
  };

  const calculateTeamStats = (team) => {
    let shots = 0, yellowCards = 0, redCards = 0;
    team.players.forEach(p => {
      shots += p.stats.goals * 2; // fake stat
      yellowCards += p.stats.yellowCards;
      redCards += p.stats.redCards;
    });
    return { shots, yellowCards, redCards };
  };

  const statsA = calculateTeamStats(match.teamA);
  const statsB = calculateTeamStats(match.teamB);

  const getRolePlayers = (team) => {
    const captain = team.players.find(p => p.isCaptain) || team.bench.find(p => p.isCaptain);
    const gk = team.players.find(p => p.position === "GK") || team.bench.find(p => p.position === "GK");
    return { captain: captain?.name || "Not Assigned", gk: gk?.name || "Not Assigned" };
  };
  const rolesA = getRolePlayers(match.teamA);
  const rolesB = getRolePlayers(match.teamB);

  // Generate Momentum Graph Data
  const generateMomentumData = () => {
    const intervals = [15, 30, 45, 60, 75, 90];
    return intervals.map(min => {
      const eventsInInterval = match.timeline.filter(e => e.minute <= min && e.minute > min - 15);
      let aScore = 1, bScore = 1; // Base to avoid 0
      eventsInInterval.forEach(e => {
        let w = 0;
        if (e.type === "GOAL" || e.type === "BANGER" || e.type === "PENALTY" || (e.type === "FREEKICK" && e.isGoal)) w = 5;
        else if (e.type === "FREEKICK" || e.type === "FOUL") w = 2; // Foul won means attacking momentum
        else if (e.type === "YELLOW_CARD") w = -1;
        
        if (e.team === "A") aScore += w; 
        else if (e.team === "B") bScore += w;
      });
      const total = aScore + bScore;
      const teamAPct = aScore / total;
      return Math.max(20, Math.min(80, Math.round(teamAPct * 100))); // Cap between 20 and 80 for visual appeal
    });
  };

  const momentumData = generateMomentumData();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={() => navigate("/history")} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ margin: 0, fontSize: "20px" }}>Match Report</h2>
        </div>
        <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "1px solid var(--border)" }}>
          <Share2 size={16} /> Share
        </button>
      </header>

      {/* Hero Scoreboard */}
      <div className="glass-panel" style={{ padding: "40px 20px", textAlign: "center", marginBottom: "20px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: isDraw ? "var(--text-muted)" : isHomeWin ? "var(--primary)" : "var(--warning)" }} />
        
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", marginBottom: "30px", color: "var(--text-muted)", fontSize: "14px" }}>
          <Clock size={16} /> Full Time ({match.duration}' + {match.stoppageTime1 + match.stoppageTime2}')
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "28px", color: isHomeWin || (hasPenalties && pensA > pensB) ? "var(--primary)" : "white" }}>{match.teamA.name}</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <span style={{ fontSize: "64px", fontWeight: "900", lineHeight: 1 }}>{match.teamA.score}</span>
              <span style={{ fontSize: "24px", color: "var(--text-muted)" }}>-</span>
              <span style={{ fontSize: "64px", fontWeight: "900", lineHeight: 1 }}>{match.teamB.score}</span>
            </div>
            {hasPenalties && (
              <div style={{ display: "flex", alignItems: "center", gap: "75px", marginTop: "5px" }}>
                <span style={{ fontSize: "24px", color: "var(--warning)", fontWeight: "bold" }}>({pensA})</span>
                <span style={{ fontSize: "24px", color: "var(--warning)", fontWeight: "bold" }}>({pensB})</span>
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: 0, fontSize: "28px", color: isAwayWin || (hasPenalties && pensB > pensA) ? "var(--warning)" : "white" }}>{match.teamB.name}</h2>
          </div>
        </div>

        {winnerText && (
          <div style={{ marginBottom: "20px", fontSize: "16px", fontWeight: "bold", color: "var(--text-muted)" }}>
            {winnerText}
          </div>
        )}

        {match.motmName && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(245, 158, 11, 0.15)", padding: "10px 20px", borderRadius: "30px", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            <Award size={20} color="var(--warning)" />
            <span style={{ color: "var(--warning)", fontWeight: "bold" }}>MOTM: {match.motmName}</span>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" }}>
        {/* Key Personnel */}
        <div className="glass-panel" style={{ padding: "20px", gridColumn: "1 / -1" }}>
           <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
             <Shield size={18} /> Team Personnel
           </h3>
           <div style={{ display: "flex", justifyContent: "space-between" }}>
             <div style={{ flex: 1 }}>
               <h4 style={{ margin: "0 0 10px 0", color: "var(--primary)" }}>{match.teamA.name}</h4>
               <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "5px" }}>Captain: <span style={{ color: "white" }}>{rolesA.captain}</span></div>
               <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>Goalkeeper: <span style={{ color: "white" }}>{rolesA.gk}</span></div>
             </div>
             <div style={{ flex: 1, textAlign: "right" }}>
               <h4 style={{ margin: "0 0 10px 0", color: "var(--warning)" }}>{match.teamB.name}</h4>
               <div style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "5px" }}>Captain: <span style={{ color: "white" }}>{rolesB.captain}</span></div>
               <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>Goalkeeper: <span style={{ color: "white" }}>{rolesB.gk}</span></div>
             </div>
           </div>
        </div>
        {/* Match Stats */}
        <div className="glass-panel" style={{ padding: "20px" }}>
          <h3 style={{ margin: "0 0 20px 0", display: "flex", alignItems: "center", gap: "10px", fontSize: "16px" }}>
            <BarChart3 size={18} /> Match Stats
          </h3>
          {match.teamA.normalTimeScore !== undefined && renderStatsLine("Normal Time Score", match.teamA.normalTimeScore, match.teamB.normalTimeScore)}
          {(match.teamA.extraTimeScore > 0 || match.teamB.extraTimeScore > 0 || (match.extraTimeDuration && match.extraTimeDuration > 0)) ? renderStatsLine("Extra Time Score", match.teamA.extraTimeScore || 0, match.teamB.extraTimeScore || 0) : null}
          {hasPenalties && renderStatsLine("Penalty Score", pensA, pensB)}
          {renderStatsLine("Total Goals", match.teamA.score, match.teamB.score)}
          {renderStatsLine("Shots (Est)", statsA.shots, statsB.shots)}
          {renderStatsLine("Yellow Cards", statsA.yellowCards, statsB.yellowCards, true)}
          {renderStatsLine("Red Cards", statsA.redCards, statsB.redCards, true)}
        </div>

        {/* Timeline */}
        <div className="glass-panel" style={{ padding: "20px", maxHeight: "300px", overflowY: "auto" }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "16px" }}>Timeline</h3>
          {match.timeline.slice().reverse().map(event => (
            <div key={event.id} style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px", fontSize: "14px" }}>
              <span style={{ fontWeight: "bold", color: "var(--text-muted)", width: "30px" }}>{event.minute}'</span>
              <span>
                {event.type === "GOAL" && "⚽"}
                {event.type === "BANGER" && "🔥"}
                {event.type === "PENALTY" && "🎯"}
                {event.type === "OWN_GOAL" && "🥅"}
                {event.type === "YELLOW_CARD" && "🟨"}
                {event.type === "RED_CARD" && "🟥"}
                {event.type === "SUBSTITUTION" && "🔄"}
                {event.type === "CAPTAIN_CHANGE" && "©️"}
                {event.type === "GK_CHANGE" && "🧤"}
              </span>
              <span style={{ display: "flex", flexDirection: "column" }}>
                <div>
                  <strong style={{ color: event.team === "A" ? "var(--primary)" : "var(--warning)" }}>{event.playerName}</strong>
                  {event.assistPlayerName && <span style={{ color: "var(--text-muted)", fontSize: "12px", marginLeft: "5px" }}>({event.assistPlayerName})</span>}
                </div>
                {event.commentary && <span style={{ color: "var(--accent)", fontSize: "12px", fontStyle: "italic", marginTop: "2px" }}>"{event.commentary}"</span>}
              </span>
            </div>
          ))}
          {match.timeline.length === 0 && <p style={{ color: "var(--text-muted)" }}>No events recorded.</p>}
        </div>
      </div>

      {hasPenalties && (
        <div className="glass-panel" style={{ padding: "20px", marginBottom: "20px" }}>
          <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px", color: "var(--warning)" }}>
            <Award size={18} /> Penalty Shootout
          </h3>
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 10px 0", color: "var(--primary)" }}>{match.teamA.name}</h4>
              {(match.penaltiesA || []).map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "14px" }}>
                  <span>{p.playerName}</span>
                  <span style={{ fontSize: "16px" }}>{p.isGoal ? "⚽" : "❌"}</span>
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 10px 0", color: "var(--warning)" }}>{match.teamB.name}</h4>
              {(match.penaltiesB || []).map((p, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "14px" }}>
                  <span>{p.playerName}</span>
                  <span style={{ fontSize: "16px" }}>{p.isGoal ? "⚽" : "❌"}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TACTICAL ANALYTICS */}
      <div className="glass-panel" style={{ padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <BarChart3 size={18} color="var(--accent)" /> Match Momentum
        </h3>
        <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "20px" }}>Computed from timeline density and key events.</p>
        
        <div style={{ display: "flex", alignItems: "flex-end", height: "150px", gap: "5px", paddingBottom: "20px", borderBottom: "1px solid var(--border)", position: "relative" }}>
          <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.1)", borderStyle: "dashed" }}></div>
          {momentumData.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", position: "relative" }}>
               {/* Team A bar (top half) */}
               <div style={{ width: "40%", height: `${val > 50 ? (val - 50) * 2 : 0}%`, background: "var(--primary)", borderTopLeftRadius: "4px", borderTopRightRadius: "4px", transition: "height 1s ease", zIndex: 2, position: "absolute", bottom: "50%" }}></div>
               {/* Team B bar (bottom half) */}
               <div style={{ width: "40%", height: `${val < 50 ? (50 - val) * 2 : 0}%`, background: "var(--warning)", borderBottomLeftRadius: "4px", borderBottomRightRadius: "4px", transition: "height 1s ease", zIndex: 2, position: "absolute", top: "50%" }}></div>
               
               <div style={{ position: "absolute", bottom: "-25px", fontSize: "10px", color: "var(--text-muted)", fontWeight: "bold" }}>{(i + 1) * 15}'</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px", fontSize: "12px", fontWeight: "bold" }}>
          <span style={{ color: "var(--primary)" }}>{match.teamA.name} Dominance</span>
          <span style={{ color: "var(--warning)" }}>{match.teamB.name} Dominance</span>
        </div>
      </div>

      {/* Formations and Ratings */}
      <div className="glass-panel" style={{ padding: "20px", marginBottom: "20px" }}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Player Ratings & MOTM</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "normal" }}>Rate players (1-10) and select the Player of the Match.</span>
        </h3>
        <div style={{ display: "flex", gap: "20px", flexDirection: window.innerWidth < 600 ? "column" : "row" }}>
          {["A", "B"].map(team => {
            const t = team === "A" ? match.teamA : match.teamB;
            return (
              <div key={team} style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 10px 0", color: team === "A" ? "var(--primary)" : "var(--warning)" }}>{t.name} ({t.formation || "Custom"})</h4>
                {t.players.map(p => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: "14px" }}>
                    <span style={{ color: p.stats.redCards > 0 ? "var(--danger)" : "white", flex: 1, display: "flex", alignItems: "center", gap: "5px" }}>
                      {p.name}
                      {p.isCaptain && <span style={{ color: "var(--warning)", fontSize: "12px" }} title="Captain">(C)</span>}
                      {p.position === "GK" && <span style={{ color: "var(--accent)", fontSize: "12px" }} title="Goalkeeper">(GK)</span>}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <select 
                        className="input-modern" 
                        style={{ padding: "4px", fontSize: "12px", width: "60px", background: "rgba(255,255,255,0.1)", border: "1px solid var(--border)", color: "white", borderRadius: "4px" }}
                        value={p.rating || ""}
                        onChange={(e) => ratePlayer(id, team, p.id, parseFloat(e.target.value))}
                      >
                        <option value="" disabled>-</option>
                        {[10, 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5, 4, 3, 2, 1].map(r => (
                          <option key={r} value={r}>{r.toFixed(1)}</option>
                        ))}
                      </select>
                      <button
                         onClick={() => assignMotm(id, team, p.id)}
                         className="btn-primary"
                         style={{ 
                           padding: "4px 8px", 
                           fontSize: "12px", 
                           background: p.id === match.motmId ? "var(--warning)" : "rgba(255,255,255,0.1)", 
                           color: p.id === match.motmId ? "black" : "white",
                           opacity: (match.motmId && p.id !== match.motmId) ? 0.5 : 1
                         }}
                         title="Set as MOTM"
                      >
                         🏆
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ height: "400px", pointerEvents: "none" }}>
        <Pitch matchId={id} teamA={match.teamA} teamB={match.teamB} />
      </div>
    </div>
  );
}
