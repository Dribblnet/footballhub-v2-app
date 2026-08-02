import { Target, Plus, Trophy, Activity } from "lucide-react";
import VerifiedBadge from "../../../../components/VerifiedBadge";

export default function DashboardMobile({ 
  user, fullPlayer, stats, setupPosition, setSetupPosition, updateUser, 
  handleCreateMatch, handleTournaments, activeMatches, finishedMatches, navigate 
}) {
  return (
    <div className="animate-fade-in" style={{ padding: "10px", width: "100%", position: "relative", boxSizing: "border-box", overflowX: "hidden" }}>
      {/* PROFILE SETUP MODAL */}
      {!user.position && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.9)", zIndex: 100, backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "center", alignItems: "center", padding: "12px"
        }}>
          <div className="glass-panel" style={{ padding: "15px", width: "100%", textAlign: "center", border: "1px solid var(--primary)", background: "rgba(15, 23, 42, 0.95)", borderRadius: "16px" }}>
            <div style={{ display: "inline-flex", background: "linear-gradient(135deg, var(--primary), #1e3a8a)", padding: "15px", borderRadius: "50%", marginBottom: "20px" }}>
              <Target size={28} color="white" />
            </div>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "24px", fontWeight: "800" }}>Complete Identity</h2>
            <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "14px" }}>Choose your primary playing position.</p>

            <select
              className="input-modern"
              value={setupPosition}
              onChange={(e) => setSetupPosition(e.target.value)}
              style={{ marginBottom: "20px", height: "50px", fontSize: "16px" }}
            >
              <option value="GK">Goalkeeper (GK)</option>
              <option value="CB">Center Back (CB)</option>
              <option value="LB">Left Back (LB)</option>
              <option value="RB">Right Back (RB)</option>
              <option value="CDM">Defensive Mid (CDM)</option>
              <option value="CM">Central Mid (CM)</option>
              <option value="CAM">Attacking Mid (CAM)</option>
              <option value="LW">Left Winger (LW)</option>
              <option value="RW">Right Winger (RW)</option>
              <option value="ST">Striker (ST)</option>
            </select>

            <button
              className="btn-primary"
              onClick={() => updateUser({ position: setupPosition })}
              style={{ width: "100%", height: "50px", fontSize: "16px", fontWeight: "bold" }}
            >
              Set Position
            </button>
          </div>
        </div>
      )}

      <header style={{
        display: "flex", flexDirection: "column",
        padding: "12px", marginBottom: "20px", borderRadius: "16px",
        background: "linear-gradient(to top, rgba(9, 14, 23, 1) 0%, rgba(9, 14, 23, 0.4) 50%, rgba(9, 14, 23, 0.1) 100%), url('https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80') center/cover",
        position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 70% 30%, rgba(59, 130, 246, 0.25), transparent 60%)", pointerEvents: "none" }}></div>

        <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--primary)", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "28px", fontWeight: "900", border: "3px solid rgba(255,255,255,0.2)" }}>
            {fullPlayer.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", flexWrap: "wrap" }}>
              {fullPlayer.name}
              <VerifiedBadge isEmailVerified={fullPlayer.emailVerified || fullPlayer.isVerified} isPhoneVerified={fullPlayer.phoneVerified} size={20} />
            </h1>
            <p style={{ margin: "5px 0 0 0", color: "var(--text-muted)", fontSize: "14px", fontWeight: "600" }}>
              <span style={{ color: "var(--accent)", fontWeight: "800" }}>{fullPlayer.position || 'UNASSIGNED'}</span>
            </p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "15px", alignItems: "stretch" }}>
              {!fullPlayer.phone ? (
                <button onClick={() => navigate("/settings")} style={{ background: "rgba(59, 130, 246, 0.2)", border: "1px solid var(--primary)", color: "white", padding: "10px", borderRadius: "12px", fontSize: "14px", fontWeight: "bold" }}>
                  Link Phone
                </button>
              ) : (
                <span style={{ fontSize: "13px", background: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "8px" }}>📱 {fullPlayer.phone}</span>
              )}
              {!fullPlayer.email ? (
                <button onClick={() => navigate("/settings")} style={{ background: "rgba(255, 255, 255, 0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px", borderRadius: "12px", fontSize: "14px", fontWeight: "bold" }}>
                  Link Email
                </button>
              ) : (
                <span style={{ fontSize: "13px", background: "rgba(255,255,255,0.1)", padding: "8px", borderRadius: "8px" }}>📧 {fullPlayer.email}</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", width: "100%", background: "rgba(0,0,0,0.4)", padding: "15px", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.1)", boxSizing: "border-box" }}>
            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "10px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase" }}>Matches</p>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "white" }}>{stats.appearances}</p>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "10px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase" }}>Goals</p>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "white" }}>{stats.goals}</p>
            </div>
            <div style={{ flex: 1, textAlign: "center" }}>
              <p style={{ margin: "0 0 4px 0", fontSize: "10px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase" }}>Assists</p>
              <p style={{ margin: 0, fontSize: "20px", fontWeight: "900", color: "white" }}>{stats.assists}</p>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "30px" }}>
        <button onClick={handleCreateMatch} className="glass-panel" style={{
          display: "flex", alignItems: "center", gap: "15px",
          padding: "12px", border: "1px solid rgba(59, 130, 246, 0.3)",
          background: "linear-gradient(145deg, rgba(59, 130, 246, 0.12) 0%, rgba(18, 24, 38, 0.6) 100%)",
          textAlign: "left", borderRadius: "16px", width: "100%"
        }}>
          <div style={{ background: "linear-gradient(135deg, var(--primary), #1e3a8a)", padding: "12px", borderRadius: "12px" }}>
            <Plus size={24} color="white" />
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "white" }}>Create Match</h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px" }}>New live match lobby</p>
          </div>
        </button>

        <button onClick={handleTournaments} className="glass-panel" style={{
          display: "flex", alignItems: "center", gap: "15px",
          padding: "12px", border: "1px solid rgba(245, 158, 11, 0.3)",
          background: "linear-gradient(145deg, rgba(245, 158, 11, 0.12) 0%, rgba(18, 24, 38, 0.6) 100%)",
          textAlign: "left", borderRadius: "16px", width: "100%"
        }}>
          <div style={{ background: "linear-gradient(135deg, var(--warning), #b45309)", padding: "12px", borderRadius: "12px" }}>
            <Trophy size={24} color="white" />
          </div>
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", color: "white" }}>Tournaments</h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px" }}>Leagues & Brackets</p>
          </div>
        </button>
      </div>

      <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "800" }}>Live & Upcoming</h3>

      {activeMatches.length === 0 ? (
        <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "12px", marginBottom: "30px", textAlign: "center" }}>
          <Activity size={32} color="var(--text-muted)" opacity={0.5} style={{ marginBottom: "10px" }} />
          <h4 style={{ margin: "0 0 6px 0", color: "white", fontSize: "16px" }}>No active matches</h4>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "13px" }}>Start a new match to track live stats.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "30px" }}>
          {activeMatches.slice().reverse().map(m => (
            <div key={m.id} className="glass-panel" style={{ padding: "15px", borderLeft: "4px solid var(--accent)", borderRadius: "12px" }} onClick={() => navigate(`/match/${m.id}`)}>
              <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "var(--accent)", fontWeight: "700", textTransform: "uppercase" }}>
                {m.state.replace("_", " ")}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <span style={{ fontWeight: "800", fontSize: "16px" }}>{m.teamA.name}</span>
                  <span style={{ fontWeight: "800", fontSize: "16px" }}>{m.teamB.name}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end", marginRight: "10px" }}>
                  <span style={{ fontWeight: "800", fontSize: "16px" }}>{m.teamA.score}</span>
                  <span style={{ fontWeight: "800", fontSize: "16px" }}>{m.teamB.score}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {finishedMatches.length > 0 && (
        <>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", fontWeight: "800" }}>Recent Results</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {finishedMatches.slice().reverse().map(m => (
              <div key={m.id} className="glass-panel" style={{ padding: "15px", borderRadius: "12px" }} onClick={() => navigate(`/match/${m.id}`)}>
                <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "var(--text-muted)", fontWeight: "700" }}>FULL TIME</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <span style={{ fontWeight: "800", fontSize: "16px", color: m.teamA.score > m.teamB.score ? "white" : "var(--text-muted)" }}>{m.teamA.name}</span>
                    <span style={{ fontWeight: "800", fontSize: "16px", color: m.teamB.score > m.teamA.score ? "white" : "var(--text-muted)" }}>{m.teamB.name}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "5px", alignItems: "flex-end" }}>
                    <span style={{ fontWeight: "900", fontSize: "16px" }}>{m.teamA.score}</span>
                    <span style={{ fontWeight: "900", fontSize: "16px" }}>{m.teamB.score}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
