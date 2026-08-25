import { Target, Plus, Trophy, Activity } from "lucide-react";
import VerifiedBadge from "../../../../components/VerifiedBadge";

export default function DashboardTablet({ 
  user, fullPlayer, stats, setupPosition, setSetupPosition, updateUser, 
  handleCreateMatch, handleTournaments, activeMatches, finishedMatches, navigate 
}) {
  return (
    <div className="animate-fade-in" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto", position: "relative" }}>
      {/* PROFILE SETUP MODAL */}
      {!user.position && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.9)", zIndex: 100, backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
        }}>
          <div className="glass-panel" style={{ padding: "40px", maxWidth: "400px", width: "100%", textAlign: "center", border: "1px solid var(--primary)", background: "rgba(15, 23, 42, 0.95)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "inline-flex", background: "linear-gradient(135deg, var(--primary), #1e3a8a)", padding: "15px", borderRadius: "50%", marginBottom: "20px", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.3)" }}>
              <Target size={32} color="white" />
            </div>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>Complete Identity</h2>
            <p style={{ margin: "0 0 30px 0", color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.5" }}>Choose your primary playing position. Your profile stats will adapt based on this role.</p>

            <select
              className="input-modern"
              value={setupPosition}
              onChange={(e) => setSetupPosition(e.target.value)}
              style={{ marginBottom: "20px", height: "50px", fontSize: "16px", background: "rgba(0,0,0,0.5)" }}
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
            </select>

            <button
              className="btn-primary"
              onClick={() => updateUser({ position: setupPosition })}
              style={{ width: "100%", height: "50px", fontSize: "16px", fontWeight: "bold" }}
            >
              Set Position & Enter
            </button>
          </div>
        </div>
      )}

      <header style={{
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "40px", marginBottom: "40px", borderRadius: "24px",
        background: "linear-gradient(to top, rgba(9, 14, 23, 1) 0%, rgba(9, 14, 23, 0.4) 50%, rgba(9, 14, 23, 0.1) 100%), url('/hero.png') center/cover",
        boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
        minHeight: "320px", position: "relative", overflow: "hidden"
      }}>
        {/* Glow overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.25), transparent 60%)", pointerEvents: "none" }}></div>

        <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "var(--primary)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "36px", fontWeight: "900", border: "4px solid rgba(255,255,255,0.2)" }}>
              {(fullPlayer.name || fullPlayer.displayName || "P").charAt(0).toUpperCase()}
            </div>
            <div className="animate-slide-in">
              <h1 style={{ margin: 0, fontSize: "clamp(32px, 4vw, 42px)", fontWeight: "900", textShadow: "0 4px 20px rgba(0,0,0,0.9)", letterSpacing: "-0.02em", lineHeight: 1.1, display: "flex", alignItems: "center", gap: "12px" }}>
                {fullPlayer.name || fullPlayer.displayName || "Dribbl Player"}
                <VerifiedBadge isEmailVerified={fullPlayer.emailVerified || fullPlayer.isVerified} isPhoneVerified={fullPlayer.phoneVerified} size={28} />
              </h1>
              <p style={{ margin: "8px 0 0 0", color: "var(--text-muted)", fontSize: "16px", fontWeight: "600", textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
                <span style={{ color: "var(--accent)", fontWeight: "800" }}>{fullPlayer.position || 'UNASSIGNED'}</span>
                {fullPlayer.age && <span> • {fullPlayer.age} yrs</span>}
                <span> • ID: {fullPlayer.id.substring(0, 8).toUpperCase()}</span>
              </p>
              <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                {!fullPlayer.phone ? (
                  <button onClick={() => navigate("/settings")} style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid var(--primary)", color: "white", padding: "6px 12px", borderRadius: "12px", fontSize: "12px", cursor: "pointer", fontWeight: "bold" }}>
                    Link Phone
                  </button>
                ) : (
                  <span style={{ fontSize: "13px", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "8px" }}>📱 {fullPlayer.phone}</span>
                )}
                {!fullPlayer.email ? (
                  <button onClick={() => navigate("/settings")} style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "6px 12px", borderRadius: "12px", fontSize: "12px", cursor: "pointer", fontWeight: "bold", display: "flex", gap: "6px", alignItems: "center" }}>
                    Link Email
                  </button>
                ) : (
                  <span style={{ fontSize: "13px", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "8px" }}>📧 {fullPlayer.email}</span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", background: "rgba(0,0,0,0.4)", padding: "16px", borderRadius: "20px", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}>
            <div style={{ textAlign: "center", minWidth: "70px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase" }}>Matches</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "white" }}>{stats.appearances}</p>
            </div>
            <div style={{ textAlign: "center", minWidth: "70px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase" }}>Goals</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "white" }}>{stats.goals}</p>
            </div>
            <div style={{ textAlign: "center", minWidth: "70px" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase" }}>Assists</p>
              <p style={{ margin: 0, fontSize: "24px", fontWeight: "900", color: "white" }}>{stats.assists}</p>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px", marginBottom: "48px" }}>
        {/* Create Match Card */}
        <button onClick={handleCreateMatch} className="glass-panel" style={{
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "32px", minHeight: "220px", border: "1px solid rgba(59, 130, 246, 0.3)",
          background: "linear-gradient(145deg, rgba(59, 130, 246, 0.12) 0%, rgba(18, 24, 38, 0.6) 100%)",
          textAlign: "left", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          borderRadius: "20px"
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(59, 130, 246, 0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)'; }}
        >
          <div style={{ background: "linear-gradient(135deg, var(--primary), #1e3a8a)", padding: "14px", borderRadius: "14px", width: "fit-content", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.4)" }}>
            <Plus size={28} color="white" strokeWidth={2.5} />
          </div>
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "26px", color: "white", letterSpacing: "-0.5px" }}>Create Match</h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px", fontWeight: "500" }}>Create a new live match lobby</p>
          </div>
        </button>

        {/* Tournaments Card */}
        <button onClick={handleTournaments} className="glass-panel" style={{
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          padding: "32px", minHeight: "220px", border: "1px solid rgba(245, 158, 11, 0.3)",
          background: "linear-gradient(145deg, rgba(245, 158, 11, 0.12) 0%, rgba(18, 24, 38, 0.6) 100%)",
          textAlign: "left", cursor: "pointer", transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          borderRadius: "20px"
        }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 25px 50px rgba(245, 158, 11, 0.2)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.4)'; }}
        >
          <div style={{ background: "linear-gradient(135deg, var(--warning), #b45309)", padding: "14px", borderRadius: "14px", width: "fit-content", boxShadow: "0 10px 20px rgba(245, 158, 11, 0.3)" }}>
            <Trophy size={28} color="white" strokeWidth={2.5} />
          </div>
          <div style={{ marginTop: "30px" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "26px", color: "white", letterSpacing: "-0.5px" }}>Tournaments</h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px", fontWeight: "500" }}>Leagues and Knockout Brackets</p>
          </div>
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <h3 className="animate-fade-in" style={{ margin: 0, fontSize: "22px", fontWeight: "800", letterSpacing: "0.5px" }}>Live & Upcoming</h3>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }}></div>
      </div>

      {activeMatches.length === 0 ? (
        <div className="glass-panel" style={{ display: "flex", alignItems: "center", gap: "20px", padding: "30px", marginBottom: "40px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", padding: "16px", borderRadius: "14px", display: "flex", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Activity size={28} color="var(--text-muted)" opacity={0.5} />
          </div>
          <div>
            <h4 style={{ margin: "0 0 6px 0", color: "white", fontSize: "18px" }}>No active matches</h4>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "15px" }}>Start a new match to begin tracking live stats.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
          {activeMatches.slice().reverse().map(m => (
            <div key={m.id} className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", borderLeft: "4px solid var(--accent)", padding: "20px 24px" }} onClick={() => navigate(`/match/${m.id}`)}>
              <div>
                <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "var(--accent)", fontWeight: "700", textTransform: "uppercase", letterSpacing: "1px", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)", display: "inline-block", boxShadow: "0 0 8px var(--accent)" }}></span>
                  {m.state.replace("_", " ")}
                </p>
                <h4 style={{ margin: 0, fontSize: "20px", fontWeight: "800" }}>{m.teamA.name} <span style={{ opacity: 0.5, margin: "0 8px" }}>{m.teamA.score} - {m.teamB.score}</span> {m.teamB.name}</h4>
              </div>
              <div style={{ color: "var(--accent)", fontWeight: "700", background: "rgba(16, 185, 129, 0.1)", padding: "8px 16px", borderRadius: "8px", fontSize: "14px" }}>Resume</div>
            </div>
          ))}
        </div>
      )}

      {finishedMatches.length > 0 && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <h3 className="animate-fade-in" style={{ margin: 0, fontSize: "22px", fontWeight: "800", letterSpacing: "0.5px" }}>Recent Results</h3>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }}></div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {finishedMatches.slice().reverse().map(m => (
              <div key={m.id} className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", padding: "20px 24px" }} onClick={() => navigate(`/match/${m.id}`)}>
                <div>
                  <p style={{ margin: "0 0 6px 0", fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>FULL TIME</p>
                  <h4 style={{ margin: 0, color: "var(--text-muted)", fontSize: "18px" }}>
                    <span style={{ color: m.teamA.score > m.teamB.score ? "white" : "inherit" }}>{m.teamA.name}</span>
                    <span style={{ color: "white", margin: "0 12px", fontWeight: "900", background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: "6px" }}>{m.teamA.score} - {m.teamB.score}</span>
                    <span style={{ color: m.teamB.score > m.teamA.score ? "white" : "inherit" }}>{m.teamB.name}</span>
                  </h4>
                </div>
                <div style={{ color: "var(--text-muted)", fontWeight: "600", fontSize: "14px", border: "1px solid rgba(255,255,255,0.1)", padding: "6px 12px", borderRadius: "6px" }}>View Stats</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
