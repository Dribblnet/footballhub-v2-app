import { X, Target, Activity, Shield, ActivitySquare } from "lucide-react";
import { usePlayers } from "../context/PlayerContext";
import VerifiedBadge from "./VerifiedBadge";

export default function ProfilePreviewModal({ playerId, onClose }) {
  const { players, getPlayerStats, playerEvents } = usePlayers();
  
  if (!playerId) return null;
  
  const player = players.find(p => p.id === playerId);
  if (!player) return null;

  const stats = getPlayerStats(playerId);

  // Extract recent form from matchHistory (last 5 matches)
  const recentMatches = (player.matchHistory || []).slice(-5).reverse();
  const recentForm = recentMatches.map(m => m.result);

  // Helper to get match-specific events for a player
  const getMatchEvents = (matchId) => {
    return playerEvents.filter(e => e.playerId === playerId && e.matchId === matchId);
  };

  let currentStreak = 0;
  let streakType = null;
  for (let i = 0; i < recentForm.length; i++) {
    if (streakType === null) {
      streakType = recentForm[i];
      currentStreak = 1;
    } else if (recentForm[i] === streakType) {
      currentStreak++;
    } else {
      break;
    }
  }
  const streakText = currentStreak > 0 ? `${currentStreak}${streakType}` : "-";

  return (
    <div 
      style={{ 
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0, 
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: "20px"
      }}
      onClick={onClose}
    >
      <div 
        className="glass-panel animate-scale-in"
        style={{
          width: "100%", maxWidth: "500px", background: "rgba(10, 15, 26, 0.95)",
          border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px",
          maxHeight: "90vh", overflowY: "auto", position: "relative"
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ 
            position: "absolute", top: "20px", right: "20px", 
            background: "rgba(255,255,255,0.1)", border: "none", 
            color: "white", width: "32px", height: "32px", 
            borderRadius: "50%", display: "flex", alignItems: "center", 
            justifyContent: "center", cursor: "pointer", zIndex: 10
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ padding: "40px 24px 24px", textAlign: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ 
            width: "90px", height: "90px", borderRadius: "50%", 
            background: "linear-gradient(135deg, var(--primary), #1e3a8a)", 
            margin: "0 auto 16px", display: "flex", alignItems: "center", 
            justifyContent: "center", fontSize: "32px", fontWeight: "700", color: "white",
            boxShadow: "0 10px 20px rgba(0,0,0,0.5)"
          }}>
            {player.displayName?.charAt(0) || "P"}
          </div>
          
          <h2 style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "700", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            {player.name || player.displayName}
            <VerifiedBadge 
              isEmailVerified={player.emailVerified || player.isVerified} 
              isPhoneVerified={player.phoneVerified} 
              showText={false}
              size={20}
            />
          </h2>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", color: "#94a3b8", fontSize: "14px", fontWeight: "500" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Target size={14} /> {player.position || "Unassigned"}</span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Shield size={14} /> Free Agent</span>
            <span>•</span>
            <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>🧤 {stats.cleanSheets} Clean Sheets</span>
          </div>
        </div>

        {/* Performance Summary Card */}
        <div style={{ padding: "24px" }}>
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "white", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <ActivitySquare size={18} color="var(--primary)" /> Performance Summary
          </h3>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "24px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>{stats.appearances}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Matches</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>{stats.goals}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Goals</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>{stats.assists}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Assists</div>
            </div>
            
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>{stats.winPercentage}%</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Win Rate</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "var(--primary)" }}>{stats.overallRating || "85"}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Overall</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>{stats.averageRating || "0.0"}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Avg Rating</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>{streakText}</div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Streak</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "16px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "center", gap: "2px", alignItems: "flex-end", height: "28px", paddingBottom: "2px" }}>
                {recentForm.length > 0 ? recentForm.map((res, i) => (
                  <div key={i} style={{ 
                    width: "8px", height: res === 'W' ? '16px' : res === 'D' ? '8px' : '4px',
                    background: res === 'W' ? '#22c55e' : res === 'D' ? '#eab308' : '#ef4444',
                    borderRadius: "2px"
                  }} title={res} />
                )) : <span style={{ fontSize: "24px", fontWeight: "700", color: "white" }}>-</span>}
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>Form</div>
            </div>
          </div>

          {/* Recent Matches */}
          <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", color: "white", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px" }}>
            <Activity size={18} color="var(--primary)" /> Recent Matches
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {recentMatches.length > 0 ? recentMatches.map((match, idx) => {
              const events = getMatchEvents(match.matchId);
              const goals = events.filter(e => e.type === 'GOAL').length;
              const assists = events.filter(e => e.type === 'ASSIST').length;
              const yellows = events.filter(e => e.type === 'YELLOW_CARD').length;
              const reds = events.filter(e => e.type === 'RED_CARD').length;
              const isMotm = events.some(e => e.type === 'MOTM');
              
              return (
                <div key={idx} style={{ 
                  background: "rgba(255,255,255,0.02)", borderRadius: "12px", 
                  padding: "16px", border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ fontSize: "14px", color: "white", fontWeight: "600", marginBottom: "4px" }}>vs {match.teamName}</div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>Score: {match.score}</div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", gap: "8px", fontSize: "12px", color: "#94a3b8" }}>
                      {goals > 0 && <span title="Goals">⚽ {goals}</span>}
                      {assists > 0 && <span title="Assists">🤝 {assists}</span>}
                      {yellows > 0 && <span title="Yellow Cards" style={{ color: "#eab308" }}>🟨 {yellows}</span>}
                      {reds > 0 && <span title="Red Cards" style={{ color: "#ef4444" }}>🟥 {reds}</span>}
                      {isMotm && <span title="Man of the Match">🏆 MOTM</span>}
                    </div>
                    
                    <div style={{ 
                      padding: "4px 8px", borderRadius: "6px", fontSize: "12px", fontWeight: "700",
                      background: match.result === 'W' ? 'rgba(34, 197, 94, 0.1)' : match.result === 'L' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(234, 179, 8, 0.1)',
                      color: match.result === 'W' ? '#22c55e' : match.result === 'L' ? '#ef4444' : '#eab308'
                    }}>
                      {match.result}
                    </div>
                  </div>
                </div>
              );
            }) : (
              <div style={{ textAlign: "center", padding: "32px", color: "#64748b", fontSize: "14px", background: "rgba(255,255,255,0.02)", borderRadius: "12px" }}>
                No recent matches
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
