import React from "react";
import { ArrowLeft, User, Crown, Filter, MessageSquare, Calendar, ShieldCheck, Footprints, MapPin, Swords } from "lucide-react";
import VerifiedBadge from "../../../../components/VerifiedBadge";
import ResponsiveProfileHeader from "../../../../components/responsive/ResponsiveProfileHeader";

const StatBox = ({ label, value, color }) => (
  <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px" }}>
    <span style={{ fontSize: "28px", fontWeight: "800", color: color || "var(--text-main)" }}>{value}</span>
    <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px", textAlign: "center" }}>{label}</span>
  </div>
);

export default function PlayerProfileTablet(props) {
  const {
    player,
    navigate,
    filterPosition,
    setFilterPosition,
    stats,
    achievements,
    position,
    renderPositionStats,
    getCaptainWinRate,
    bestDuo,
    matches,
    isMobile,
  } = props;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "20px" }}>Player Profile</h2>
      </header>

      <ResponsiveProfileHeader
        name={player.name}
        username={player.username}
        bio={player.bio}
        isVerified={player.isVerified}
        emailVerified={player.emailVerified}
        phoneVerified={player.phoneVerified}
        topRightContent={
          stats.captainAppearances > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--warning)", background: "rgba(245, 158, 11, 0.1)", padding: "5px 10px", borderRadius: "12px", fontSize: "12px", fontWeight: "bold" }}>
              <Crown size={14} /> CAPTAIN ({stats.captainAppearances})
            </div>
          )
        }
        metadataContent={
          <>
            <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "20px" }}>
              <ShieldCheck size={14} color="var(--primary)" /> {position}
            </span>
            {player.teamName && (
               <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "20px" }}>
                 <ShieldCheck size={14} /> {player.teamName}
               </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "20px" }}>
              <User size={14} /> {player.gender} {player.age ? `• ${player.age} yrs` : ""}
            </span>
            {player.preferredFoot && (
               <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "20px" }}>
                 <Footprints size={14} /> {player.preferredFoot} Foot
               </span>
            )}
            {player.city && (
               <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "20px" }}>
                 <MapPin size={14} /> {player.city}
               </span>
            )}
            <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.05)", padding: "6px 12px", borderRadius: "20px" }}>
              <Calendar size={14} /> Joined {new Date(player.createdAt || new Date()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
            </span>
          </>
        }
      />
      
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", flexWrap: "wrap", gap: "15px", marginBottom: "30px" }}>
        <button 
          onClick={() => navigate('/messages')}
          className="btn-responsive-full"
          style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--primary)", color: "white", padding: "12px 20px", borderRadius: "12px", border: "none", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}
        >
          <MessageSquare size={18} /> Message
        </button>
        <button className="btn-responsive-full" style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(255,255,255,0.1)", color: "white", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
          Invite to Match
        </button>
        <button className="btn-responsive-full" style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "rgba(255,255,255,0.1)", color: "white", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.2)", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
          Invite to Team
        </button>
        <button className="btn-responsive-full" style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "transparent", color: "var(--text-muted)", padding: "12px 20px", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.2)", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
          Follow
        </button>
        <button className="btn-responsive-full" style={{ flex: "1 1 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(245, 158, 11, 0.2))", color: "var(--warning)", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(245, 158, 11, 0.3)", fontWeight: "700", cursor: "pointer", fontSize: "15px" }}>
          <Swords size={18} /> Challenge
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, fontSize: "20px" }}>Career Statistics</h3>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", background: "rgba(255,255,255,0.05)", padding: "5px 15px", borderRadius: "20px" }}>
          <Filter size={14} color="var(--text-muted)" />
          <select 
            className="input-modern" 
            style={{ background: "transparent", border: "none", color: "white", outline: "none", fontSize: "12px", width: "80px", cursor: "pointer" }}
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="GK">Goalkeeper (GK)</option>
            <option value="CB">Center Back (CB)</option>
            <option value="LB">Left Back (LB)</option>
            <option value="RB">Right Back (RB)</option>
            <option value="CDM">Def. Mid (CDM)</option>
            <option value="CM">Center Mid (CM)</option>
            <option value="CAM">Att. Mid (CAM)</option>
            <option value="LW">Left Wing (LW)</option>
            <option value="RW">Right Wing (RW)</option>
            <option value="ST">Striker (ST)</option>
          </select>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "15px", marginBottom: "30px" }}>
        <StatBox label="Matches" value={stats.appearances} />
        {stats.motm > 0 && <StatBox label="MOTM 🏆" value={stats.motm} color="var(--warning)" />}
        {renderPositionStats()}
        <StatBox label="Yellows" value={stats.yellowCards} color="var(--warning)" />
        <StatBox label="Reds" value={stats.redCards} color="var(--danger)" />
      </div>

      {/* ACHIEVEMENTS TRAY */}
      <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>Achievements</h3>
      <div className="glass-panel" style={{ display: "flex", flexWrap: "wrap", gap: "15px", padding: "20px", marginBottom: "30px" }}>
        {achievements.length > 0 ? achievements.map(a => (
          <div key={a.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", width: "80px" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255, 255, 255, 0.1)", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }} title={a.desc}>{a.icon}</div>
            <span style={{ fontSize: "10px", fontWeight: "bold", textAlign: "center" }}>{a.name}</span>
          </div>
        )) : (
          <div style={{ color: "var(--text-muted)", fontSize: "14px", width: "100%", textAlign: "center", padding: "10px" }}>
            Keep playing to earn badges!
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <h3 style={{ margin: 0, fontSize: "20px" }}>Advanced Analytics</h3>
      </div>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        {/* General Stats */}
        <div className="glass-panel" style={{ padding: "25px" }}>
          <h4 style={{ margin: "0 0 20px 0", color: "var(--accent)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", fontSize: "16px" }}>General Performance</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Average Rating</span> <strong style={{ color: "var(--warning)", fontSize: "18px" }}>{stats.averageRating > 0 ? stats.averageRating : "N/A"}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Win Percentage</span> <strong>{stats.winPercentage || 0}%</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>W - D - L</span> <strong>{stats.wins} - {stats.draws} - {stats.losses}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>MOTM Awards</span> <strong style={{ color: "var(--warning)" }}>{stats.motm}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Minutes Played</span> <strong>{stats.minutesPlayed || (stats.appearances * 90)}'</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Favourite Position</span> <strong style={{ background: "rgba(255,255,255,0.1)", padding: "2px 8px", borderRadius: "6px", fontSize: "12px" }}>{position}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Captain Matches</span> <strong style={{ color: "var(--warning)" }}>{stats.captainAppearances}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Captain Win Rate</span> <strong>{getCaptainWinRate()}%</strong></div>
          </div>
        </div>

        {/* Attacking & Technical */}
        <div className="glass-panel" style={{ padding: "25px" }}>
          <h4 style={{ margin: "0 0 20px 0", color: "var(--primary)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", fontSize: "16px" }}>Attacking & Technical</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Goals per Match</span> <strong>{stats.appearances > 0 ? (stats.goals / stats.appearances).toFixed(2) : "0.00"}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Hat-tricks</span> <strong>{stats.hatTricks || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Penalty Goals</span> <strong>{stats.penaltyGoals || stats.penaltyShootoutGoals || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Free Kick Goals</span> <strong>{stats.freeKickGoals || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Chances Created</span> <strong>{stats.chancesCreated || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Passes Completed</span> <strong>{stats.passes || 0}</strong></div>
          </div>
        </div>

        {/* Defensive & Goalkeeping */}
        <div className="glass-panel" style={{ padding: "25px" }}>
          <h4 style={{ margin: "0 0 20px 0", color: "#10b981", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", fontSize: "16px" }}>Defensive & Goalkeeping</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Clean Sheets</span> <strong>{stats.cleanSheets}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Saves</span> <strong>{stats.saves || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Penalty Saves</span> <strong>{stats.penaltyShootoutSaves || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Tackles</span> <strong>{stats.tackles || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Interceptions</span> <strong>{stats.interceptions || 0}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>GK Appearances</span> <strong>{position === "GK" ? stats.appearances : 0}</strong></div>
          </div>
        </div>

        {/* Disciplinary */}
        <div className="glass-panel" style={{ padding: "25px" }}>
          <h4 style={{ margin: "0 0 20px 0", color: "var(--danger)", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", fontSize: "16px" }}>Disciplinary</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "15px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Yellow Cards</span> <strong style={{ color: "var(--warning)" }}>{stats.yellowCards}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Red Cards</span> <strong style={{ color: "var(--danger)" }}>{stats.redCards}</strong></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ color: "var(--text-muted)" }}>Fouls Committed</span> <strong>{stats.foulsCommitted || 0}</strong></div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ position: "relative", padding: "30px", marginBottom: "30px", overflow: "hidden" }}>
        {/* CHEMISTRY DUO SECTION */}
        {bestDuo && (
          <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "20px", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "5px", letterSpacing: "1px" }}>Best Partnership</div>
              <div style={{ fontSize: "20px", fontWeight: "800", color: "var(--accent)" }}>{player.name} & {bestDuo.name}</div>
            </div>
            <div style={{ display: "flex", gap: "25px", textAlign: "right" }}>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "900" }}>{Math.round((bestDuo.winsTogether / bestDuo.matchesTogether) * 100)}%</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px" }}>WIN RATE</div>
              </div>
              <div>
                <div style={{ fontSize: "20px", fontWeight: "900" }}>{bestDuo.combinedGoals}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", letterSpacing: "0.5px" }}>GOAL COMBOS</div>
              </div>
            </div>
          </div>
        )}

      </div>

      <h3 style={{ marginBottom: "15px", fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
        Recent Form (Last 5 Matches)
      </h3>
      {player.matchHistory.length === 0 ? (
        <div className="glass-panel" style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>No match history found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {player.matchHistory.slice(-5).reverse().map((h, i) => {
             const m = matches.find(match => match.id === h.matchId);
             let goals = 0, assists = 0, yellowCards = 0, redCards = 0, motm = false, rating = "N/A";
             
             if (m) {
                 const allPlayers = [...m.teamA.players, ...m.teamB.players];
                 const mp = allPlayers.find(p => p.id === player.id);
                 if (mp && mp.stats) {
                     goals = mp.stats.goals || 0;
                     assists = mp.stats.assists || 0;
                     yellowCards = mp.stats.yellowCards || 0;
                     redCards = mp.stats.redCards || 0;
                     motm = mp.stats.motm > 0;
                     if (mp.rating) rating = mp.rating.toFixed(1);
                 }
             }

             return (
              <div key={i} className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 20px", borderLeft: h.result === "W" ? "4px solid var(--accent)" : h.result === "L" ? "4px solid var(--danger)" : "4px solid var(--warning)" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "800", fontSize: "16px", marginBottom: "4px" }}>vs {h.teamName}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span>{new Date(h.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {motm && <span style={{ color: "var(--warning)", fontWeight: "bold", display: "flex", alignItems: "center", gap: "4px" }}>🏆 MOTM</span>}
                    {rating !== "N/A" && <span style={{ background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", color: "white", fontWeight: "bold" }}>Rating: {rating}</span>}
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                  {(goals > 0 || assists > 0) && (
                    <div style={{ display: "flex", gap: "10px", fontSize: "13px", fontWeight: "600", color: "var(--text-muted)" }}>
                      {goals > 0 && <span title="Goals">⚽ {goals}</span>}
                      {assists > 0 && <span title="Assists">🤝 {assists}</span>}
                    </div>
                  )}
                  {(yellowCards > 0 || redCards > 0) && (
                    <div style={{ display: "flex", gap: "4px" }}>
                      {[...Array(yellowCards)].map((_, idx) => <div key={`y-${idx}`} style={{ width: "10px", height: "14px", background: "var(--warning)", borderRadius: "2px" }} title="Yellow Card" />)}
                      {[...Array(redCards)].map((_, idx) => <div key={`r-${idx}`} style={{ width: "10px", height: "14px", background: "var(--danger)", borderRadius: "2px" }} title="Red Card" />)}
                    </div>
                  )}
                  <div style={{ 
                    padding: "6px 12px", borderRadius: "8px", fontWeight: "900", fontSize: "16px",
                    background: h.result === "W" ? "rgba(16, 185, 129, 0.15)" : h.result === "L" ? "rgba(239, 68, 68, 0.15)" : "rgba(255, 255, 255, 0.1)",
                    color: h.result === "W" ? "var(--accent)" : h.result === "L" ? "var(--danger)" : "white",
                    border: `1px solid ${h.result === "W" ? "rgba(16, 185, 129, 0.3)" : h.result === "L" ? "rgba(239, 68, 68, 0.3)" : "rgba(255, 255, 255, 0.2)"}`
                  }}>
                    {h.score} {h.result}
                  </div>
                </div>
              </div>
             );
          })}
        </div>
      )}
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => navigate('/history')} style={{ background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", padding: "10px 20px", borderRadius: "20px", fontWeight: "bold", cursor: "pointer" }}>
          View Full Match History
        </button>
      </div>
    </div>
  );
}
