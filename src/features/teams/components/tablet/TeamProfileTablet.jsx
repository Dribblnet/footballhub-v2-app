import React from "react";
import { ArrowLeft, Shield, Swords, Trophy } from "lucide-react";

const StatBox = ({ label, value, color }) => (
  <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px" }}>
    <span style={{ fontSize: "28px", fontWeight: "800", color: color || "var(--text-main)" }}>{value}</span>
    <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px" }}>{label}</span>
  </div>
);

export default function TeamProfileTablet(props) {
  const {
    team,
    stats,
    trophies,
    biggestRival,
    rivalStats,
    navigate,
    isMobile,
  } = props;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "20px" }}>Team Hub</h2>
      </header>

      <div className="glass-panel" style={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", gap: "20px", padding: "30px", marginBottom: "30px", background: `linear-gradient(135deg, rgba(30, 41, 59, 0.9), ${team.color || "rgba(59, 130, 246, 0.2)"})`, flexWrap: "wrap", textAlign: isMobile ? "center" : "left" }}>
        <div style={{ width: isMobile ? "100px" : "80px", height: isMobile ? "100px" : "80px", borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, margin: isMobile ? "0 auto" : "0" }}>
          <Shield size={isMobile ? 50 : 40} color="white" />
        </div>
        <div style={{ flex: "1 1 200px", minWidth: 0, display: "flex", flexDirection: "column", alignItems: isMobile ? "center" : "flex-start" }}>
          <h1 style={{ margin: "0 0 5px 0", fontSize: "clamp(24px, 5vw, 32px)", fontWeight: "800", color: team.color || "white", overflowWrap: "break-word" }}>{team.name}</h1>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", textAlign: isMobile ? "center" : "left" }}>
            {team.turf ? `Home: ${team.turf}` : "Registered Dribbl.net Team"}
          </p>
        </div>
      </div>

      {team.bio && (
        <div className="glass-panel" style={{ padding: "20px", marginBottom: "30px", fontStyle: "italic", color: "var(--text-muted)" }}>
          "{team.bio}"
        </div>
      )}

      <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>Overall Performance</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "15px", marginBottom: "30px" }}>
        <StatBox label="Matches" value={stats.matches} />
        <StatBox label="Wins" value={stats.wins} color="var(--accent)" />
        <StatBox label="Draws" value={stats.draws} color="var(--warning)" />
        <StatBox label="Losses" value={stats.losses} color="var(--danger)" />
        <StatBox label="Goals For" value={stats.goalsFor} color="var(--primary)" />
        <StatBox label="Clean Sheets" value={stats.cleanSheets} />
      </div>

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
        {/* TROPHY CABINET */}
        <div className="glass-panel" style={{ flex: 1, minWidth: "300px", padding: "20px" }}>
          <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Trophy size={20} color="var(--warning)" /> Trophy Cabinet
          </h3>
          {trophies.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: 0 }}>No trophies won yet. Time to build a legacy.</p>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
               {trophies.map((t, i) => (
                 <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(245, 158, 11, 0.1)", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--warning)" }}>
                   <Trophy size={16} color="var(--warning)" />
                   <span style={{ fontSize: "14px", fontWeight: "bold", color: "var(--warning)" }}>{t.name} ({t.year})</span>
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* BIGGEST RIVAL */}
        {biggestRival && (
          <div className="glass-panel" style={{ flex: 1, minWidth: "300px", padding: "20px", border: "1px solid rgba(239, 68, 68, 0.3)", background: "linear-gradient(135deg, rgba(30, 41, 59, 0.5), rgba(239, 68, 68, 0.1))" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "10px", color: "var(--danger)" }}>
              <Swords size={20} /> Biggest Rivalry
            </h3>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "24px", fontWeight: "900" }}>{rivalStats.opponent}</div>
              <div style={{ display: "flex", gap: "10px", textAlign: "center" }}>
                 <div>
                   <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--accent)" }}>{rivalStats.wins}</div>
                   <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>WINS</div>
                 </div>
                 <div>
                   <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--warning)" }}>{rivalStats.draws}</div>
                   <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>DRAWS</div>
                 </div>
                 <div>
                   <div style={{ fontSize: "18px", fontWeight: "bold", color: "var(--danger)" }}>{rivalStats.losses}</div>
                   <div style={{ fontSize: "10px", color: "var(--text-muted)" }}>LOSSES</div>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <h3 style={{ marginBottom: "15px", fontSize: "20px" }}>Match History</h3>
      {team.matchHistory.length === 0 ? (
        <div className="glass-panel" style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>No match history found.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {team.matchHistory.slice().reverse().map((h, i) => (
            <div key={i} className="glass-panel" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px" }}>
              <div>
                <div style={{ fontWeight: "700" }}>vs {h.opponent}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{new Date(h.date).toLocaleDateString()}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span style={{ fontSize: "18px", fontWeight: "800", letterSpacing: "1px" }}>{h.score}</span>
                <div style={{ 
                  width: "30px", height: "30px", borderRadius: "50%", 
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold",
                  background: h.result === "W" ? "rgba(16, 185, 129, 0.2)" : h.result === "L" ? "rgba(239, 68, 68, 0.2)" : "rgba(255, 255, 255, 0.1)",
                  color: h.result === "W" ? "var(--accent)" : h.result === "L" ? "var(--danger)" : "white"
                }}>
                  {h.result}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
