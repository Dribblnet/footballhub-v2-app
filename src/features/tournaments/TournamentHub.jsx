import { useNavigate } from "react-router-dom";
import { Trophy, Plus, ArrowRight, Shield, Activity,  } from "lucide-react";
import { useTournaments } from "../../context/TournamentContext";

export default function TournamentHub() {
  const navigate = useNavigate();
  const { tournaments } = useTournaments();

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", paddingBottom: "100px" }}>
      {/* Header section with Create Button */}
      <header style={{ 
        display: "flex", justifyContent: "space-between", alignItems: "center", 
        marginBottom: "30px", flexWrap: "wrap", gap: "20px",
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9))",
        padding: "30px", borderRadius: "20px",
        border: "1px solid var(--border)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
      }}>
        <div style={{ flex: "1 1 300px" }}>
          <h1 style={{ margin: "0 0 10px 0", fontSize: "36px", fontWeight: "900", letterSpacing: "-1px", display: "flex", alignItems: "center", gap: "12px", color: "white" }}>
            <Trophy size={36} color="var(--warning)" style={{ filter: "drop-shadow(0 0 10px rgba(245,158,11,0.5))" }} /> 
            Tournament Hub
          </h1>
          <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "16px", lineHeight: "1.5" }}>
            Compete in leagues, knockout cups, and weekend series. Start your own tournament and manage everything from fixtures to leaderboards.
          </p>
        </div>
        
        <button 
          onClick={() => navigate("/create-tournament")} 
          className="btn-primary animate-pulse-slow" 
          style={{ 
            display: "flex", alignItems: "center", gap: "10px", 
            padding: "16px 32px", fontSize: "18px", fontWeight: "900", 
            borderRadius: "12px", letterSpacing: "1px",
            boxShadow: "0 10px 30px rgba(37,99,235,0.4)"
          }}
        >
          <Plus size={24} /> CREATE TOURNAMENT
        </button>
      </header>

      {/* Content Section */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
        <h3 style={{ margin: 0, fontSize: "22px", fontWeight: "800", letterSpacing: "0.5px" }}>Active Competitions</h3>
        <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }}></div>
      </div>

      {tournaments.length === 0 ? (
        <div className="glass-panel" style={{ 
          padding: "60px 20px", textAlign: "center", display: "flex", flexDirection: "column", 
          alignItems: "center", gap: "20px", background: "linear-gradient(180deg, rgba(15,23,42,0.8), rgba(3,7,18,0.9))" 
        }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "rgba(245, 158, 11, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
            <Trophy size={40} color="var(--warning)" />
          </div>
          <h2 style={{ margin: 0, fontSize: "28px", color: "white" }}>No Tournaments Yet</h2>
          <p style={{ margin: 0, color: "var(--text-muted)", maxWidth: "400px", fontSize: "16px", lineHeight: "1.6" }}>
            The pitch is waiting! Create your first tournament to start tracking fixtures, standings, and player statistics in real-time.
          </p>
          <button 
            onClick={() => navigate("/create-tournament")} 
            className="btn-primary" 
            style={{ padding: "14px 28px", fontSize: "16px", fontWeight: "800", marginTop: "10px" }}
          >
            Create Tournament Now
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" }}>
          {tournaments.map(t => (
            <div 
              key={t.id} 
              className="glass-panel" 
              onClick={() => navigate(`/tournament/${t.id}`)}
              style={{ 
                padding: "24px", cursor: "pointer", display: "flex", flexDirection: "column", gap: "15px",
                transition: "all 0.3s ease", position: "relative", overflow: "hidden",
                borderTop: t.status === "ACTIVE" ? "4px solid var(--accent)" : "4px solid var(--primary)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.5)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)'; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 6px 0", fontSize: "20px", color: "white", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}>
                    {t.name}
                  </h3>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "11px", background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                      {t.type}
                    </span>
                    <span style={{ fontSize: "11px", background: t.status === "ACTIVE" ? "rgba(16, 185, 129, 0.2)" : "rgba(37, 99, 235, 0.2)", color: t.status === "ACTIVE" ? "var(--accent)" : "var(--primary)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                      {t.status}
                    </span>
                    {t.config?.city && (
                      <span style={{ fontSize: "11px", background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                        {t.config.city}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)" }}>
                  <Shield size={20} color="white" />
                </div>
              </div>

              <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Teams</span>
                  <span style={{ fontSize: "18px", fontWeight: "900", color: "white" }}>{t.teams?.length || 0}</span>
                </div>
                {t.status === "ACTIVE" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Matches</span>
                    <span style={{ fontSize: "18px", fontWeight: "900", color: "white" }}>{t.completedMatches?.length || 0}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "15px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: "13px", color: "var(--primary)", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
                  <Activity size={14} /> View Dashboard
                </span>
                <ArrowRight size={18} color="var(--primary)" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
