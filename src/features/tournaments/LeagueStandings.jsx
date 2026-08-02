import { useParams } from "react-router-dom";
import { useTournaments } from "../../context/TournamentContext";
import { Trophy, Info } from "lucide-react";

export default function LeagueStandings() {
  const { id } = useParams();
  const { getTournament } = useTournaments();
  
  const tournament = getTournament(id);

  if (!tournament) return <div style={{ padding: "40px", textAlign: "center" }}>League not found.</div>;

  // Sort teams by Points, then Goal Difference, then Goals For
  const sortedTeams = [...tournament.teams].sort((a, b) => {
    if (b.stats.pts !== a.stats.pts) return b.stats.pts - a.stats.pts;
    if (b.stats.gd !== a.stats.gd) return b.stats.gd - a.stats.gd;
    return b.stats.gf - a.stats.gf;
  });

  return (
    <div style={{ width: "100%" }}>
      <div className="glass-panel animate-fade-in" style={{ overflowX: "auto", padding: "0", background: "var(--bg-dark)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
          <thead>
            <tr style={{ background: "rgba(37, 99, 235, 0.1)", borderBottom: "2px solid var(--primary)", textAlign: "left", fontSize: "12px", color: "var(--text-main)", textTransform: "uppercase", letterSpacing: "1px" }}>
              <th style={{ padding: "16px", width: "50px", textAlign: "center", fontWeight: "900" }}>#</th>
              <th style={{ padding: "16px", fontWeight: "900" }}>Club</th>
              <th style={{ padding: "16px", width: "40px", textAlign: "center", fontWeight: "900" }}>P</th>
              <th style={{ padding: "16px", width: "40px", textAlign: "center", fontWeight: "900" }}>W</th>
              <th style={{ padding: "16px", width: "40px", textAlign: "center", fontWeight: "900" }}>D</th>
              <th style={{ padding: "16px", width: "40px", textAlign: "center", fontWeight: "900" }}>L</th>
              <th style={{ padding: "16px", width: "60px", textAlign: "center", fontWeight: "900" }}>GD</th>
              <th style={{ padding: "16px", width: "80px", textAlign: "center", fontWeight: "900", color: "var(--primary)" }}>Pts</th>
              <th style={{ padding: "16px", width: "140px", textAlign: "center", fontWeight: "900" }}>Form</th>
            </tr>
          </thead>
          <tbody>
            {sortedTeams.map((team, index) => {
              const isTop = index === 0;
              const isRelegation = index >= sortedTeams.length - 2 && sortedTeams.length > 4;
              return (
              <tr key={team.id} style={{ 
                borderBottom: "1px solid rgba(255,255,255,0.02)", 
                background: index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                transition: "background 0.2s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"}
              >
                <td style={{ padding: "16px", textAlign: "center", fontWeight: "900", color: isTop ? "var(--warning)" : "var(--text-muted)", borderLeft: isTop ? "4px solid var(--warning)" : isRelegation ? "4px solid var(--danger)" : "4px solid transparent" }}>
                  {index + 1}
                </td>
                <td style={{ padding: "16px", fontWeight: "800", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                  {isTop && <Trophy size={16} color="var(--warning)" />}
                  {team.name}
                </td>
                <td style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontWeight: "600" }}>{team.stats.p}</td>
                <td style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)" }}>{team.stats.w}</td>
                <td style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)" }}>{team.stats.d}</td>
                <td style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)" }}>{team.stats.l}</td>
                <td style={{ padding: "16px", textAlign: "center", fontWeight: "700", color: team.stats.gd > 0 ? "var(--accent)" : team.stats.gd < 0 ? "var(--danger)" : "var(--text-muted)" }}>
                  {team.stats.gd > 0 ? `+${team.stats.gd}` : team.stats.gd}
                </td>
                <td style={{ padding: "16px", textAlign: "center", fontSize: "20px", fontWeight: "900", color: "var(--primary)" }}>
                  {team.stats.pts}
                </td>
                <td style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                    {team.stats.form.map((f, i) => (
                      <span key={i} style={{ 
                        width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontSize: "10px", fontWeight: "900",
                        background: f === "W" ? "var(--accent)" : f === "L" ? "var(--danger)" : "rgba(255,255,255,0.2)", color: f === "D" ? "white" : "black"
                      }}>
                        {f}
                      </span>
                    ))}
                    {team.stats.form.length === 0 && <span style={{ color: "var(--text-muted)", fontSize: "12px" }}>-</span>}
                  </div>
                </td>
              </tr>
            )})}
            {sortedTeams.length === 0 && (
              <tr>
                <td colSpan={9} style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)", fontStyle: "italic" }}>
                  No teams in this league yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "12px" }}>
        <Info size={14} /> P = Played, W = Won, D = Drawn, L = Lost, GD = Goal Difference, Pts = Points
      </div>
    </div>
  );
}
