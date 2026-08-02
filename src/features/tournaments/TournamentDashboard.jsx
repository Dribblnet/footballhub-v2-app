import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTournaments } from "../../context/TournamentContext";
import { Trophy, ArrowLeft, Users, Shield, Play, Megaphone, Calendar as CalendarIcon, Mail, Star, Activity, Goal,  } from "lucide-react";
import LeagueStandings from "./LeagueStandings";

export default function TournamentDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTournament, startTournament } = useTournaments();
  
  const tournament = getTournament(id);
  const [activeTab, setActiveTab] = useState("OVERVIEW");

  if (!tournament) return <div style={{ padding: "40px", textAlign: "center" }}>Tournament not found.</div>;

  const playerStatsArr = tournament.playerStats ? Object.values(tournament.playerStats) : [];
  
  const getTopScorers = () => [...playerStatsArr].sort((a, b) => b.goals - a.goals).slice(0, 5);
  const getTopAssists = () => [...playerStatsArr].sort((a, b) => b.assists - a.assists).slice(0, 5);
  const getTopGKs = () => [...playerStatsArr].sort((a, b) => (b.cleanSheets * 3 + b.saves) - (a.cleanSheets * 3 + a.saves)).slice(0, 5);
  const getMostCleanSheets = () => [...playerStatsArr].sort((a, b) => b.cleanSheets - a.cleanSheets).slice(0, 5);
  const getTopMVPs = () => [...playerStatsArr].sort((a, b) => b.motm - a.motm).slice(0, 5);

  const totalGoals = tournament.teams.reduce((acc, t) => acc + (t.stats.gf || 0), 0);
  const totalMatches = tournament.teams.reduce((acc, t) => acc + (t.stats.p || 0), 0) / 2;
  const avgGoals = totalMatches > 0 ? (totalGoals / totalMatches).toFixed(1) : "0.0";
  const totalYellows = playerStatsArr.reduce((acc, p) => acc + (p.yellowCards || 0), 0);

  const renderLeaderboardTable = (title, data, valueKey, valueLabel, icon) => (
    <div className="glass-panel animate-fade-in" style={{ padding: "0", flex: "1 1 340px", background: "linear-gradient(180deg, rgba(15, 23, 42, 0.9), rgba(3, 7, 18, 0.95))", border: "1px solid rgba(59, 130, 246, 0.2)", overflow: "hidden" }}>
      <div style={{ padding: "20px", background: "rgba(37, 99, 235, 0.1)", borderBottom: "2px solid var(--primary)", display: "flex", alignItems: "center", gap: "12px" }}>
        {icon}
        <h3 style={{ margin: 0, fontSize: "20px", color: "white", letterSpacing: "1px", textTransform: "uppercase" }}>
          {title}
        </h3>
      </div>
      {data.length === 0 || data[0][valueKey] === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "14px", textAlign: "center", padding: "40px 20px" }}>No data yet.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {data.filter(p => p[valueKey] > 0).map((p, i) => (
            <div key={p.id} style={{ 
              display: "flex", justifyContent: "space-between", alignItems: "center", 
              padding: i === 0 ? "24px 20px" : "16px 20px", 
              background: i === 0 ? "linear-gradient(90deg, rgba(249, 115, 22, 0.15), transparent)" : (i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent"), 
              borderBottom: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <span className="stats-number" style={{ 
                  fontSize: i === 0 ? "32px" : "20px", 
                  color: i === 0 ? "var(--warning)" : "var(--text-muted)", 
                  width: "28px", textAlign: "center",
                  textShadow: i === 0 ? "0 0 15px rgba(249, 115, 22, 0.5)" : "none"
                }}>{i + 1}</span>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: i === 0 ? "900" : "700", fontSize: i === 0 ? "18px" : "15px", color: "white", textTransform: "uppercase", letterSpacing: "0.5px" }}>{p.name}</span>
                  <span style={{ fontSize: "12px", color: "var(--primary)", fontWeight: "800", textTransform: "uppercase" }}>{p.team}</span>
                </div>
              </div>
              <span className="stats-number" style={{ 
                fontSize: i === 0 ? "36px" : "24px", 
                color: i === 0 ? "var(--warning)" : "white",
                textShadow: i === 0 ? "0 0 20px rgba(249, 115, 22, 0.6)" : "none"
              }}>{p[valueKey]} <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600", fontFamily: "var(--font-reading)", letterSpacing: "0" }}>{valueLabel}</span></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderKnockoutBracket = () => {
    if (tournament.knockoutBracket.length === 0) {
      return (
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Bracket not generated yet.</p>
          {tournament.status === "DRAFT" && tournament.teams.length >= 2 && (
             <button onClick={() => startTournament(id)} className="btn-primary" style={{ padding: "10px 20px" }}>Generate Bracket</button>
          )}
        </div>
      );
    }

    return (
      <div style={{ display: "flex", gap: "40px", overflowX: "auto", padding: "20px 0" }}>
        {tournament.knockoutBracket.map((round, rIndex) => (
          <div key={rIndex} style={{ display: "flex", flexDirection: "column", justifyContent: "space-around", gap: "20px", minWidth: "200px" }}>
            <h4 style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "10px" }}>Round {rIndex + 1}</h4>
            {round.map((match, mIndex) => (
              <div key={mIndex} className="glass-panel" style={{ padding: "15px", border: match.winner ? "1px solid var(--primary)" : "1px solid var(--border)", position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: match.winner === match.tA ? "var(--warning)" : "white", fontWeight: match.winner === match.tA ? "bold" : "normal" }}>
                  <span>{match.tA || "TBD"}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: match.winner === match.tB ? "var(--warning)" : "white", fontWeight: match.winner === match.tB ? "bold" : "normal" }}>
                  <span>{match.tB || "TBD"}</span>
                </div>
                {match.tA && match.tB && !match.winner && (
                   <div style={{ marginTop: "10px", textAlign: "center" }}>
                     <button className="btn-primary" style={{ fontSize: "12px", padding: "4px 8px" }}>Play Match</button>
                   </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", paddingBottom: "100px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "900", display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--heading)", textTransform: "uppercase" }}>
            <Trophy size={28} color="var(--warning)" /> {tournament.name}
          </h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "5px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "12px", background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>{tournament.type}</span>
            <span style={{ fontSize: "12px", background: tournament.status === "ACTIVE" ? "rgba(16, 185, 129, 0.2)" : "rgba(255,255,255,0.1)", color: tournament.status === "ACTIVE" ? "var(--accent)" : "white", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
              {tournament.status}
            </span>
            <span style={{ fontSize: "12px", background: "rgba(37, 99, 235, 0.2)", color: "var(--primary)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
              {tournament.config?.matchFormat || "11v11"}
            </span>
            {tournament.config?.city && (
              <span style={{ fontSize: "12px", background: "rgba(245, 158, 11, 0.15)", color: "var(--warning)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                {tournament.config.city}
              </span>
            )}
            {tournament.config?.skillLevel && (
              <span style={{ fontSize: "12px", border: "1px solid rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px", fontWeight: "bold" }}>
                {tournament.config.skillLevel}
              </span>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          {tournament.status === "DRAFT" && (
            <button onClick={() => startTournament(id)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", padding: "10px 20px", borderRadius: "8px", background: "var(--primary)", border: "none", fontWeight: "bold" }}>
              <Play size={16} /> Start Tournament
            </button>
          )}
          <button onClick={() => navigate(`/messages?contact=TournamentOrganizer&ref=${tournament.name}`)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", padding: "10px 20px", borderRadius: "8px", background: "var(--warning)", color: "black", border: "none", fontWeight: "bold" }}>
            <Mail size={16} /> Contact Organizer
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button 
          onClick={() => setActiveTab("OVERVIEW")} 
          style={{ padding: "10px 20px", borderRadius: "8px", background: activeTab === "OVERVIEW" ? "var(--primary)" : "rgba(255,255,255,0.05)", border: "none", color: "white", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}
        >
          OVERVIEW
        </button>
        <button 
          onClick={() => setActiveTab("LEADERBOARDS")} 
          style={{ padding: "10px 20px", borderRadius: "8px", background: activeTab === "LEADERBOARDS" ? "var(--primary)" : "rgba(255,255,255,0.05)", border: "none", color: "white", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}
        >
          PLAYER LEADERBOARDS
        </button>
      </div>

      {/* Grid Layout for Active Ecosystem */}
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: "20px", alignItems: "start" }}>
        {/* Main Content Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {activeTab === "OVERVIEW" && (
            <>
              {/* Announcements */}
          <div className="glass-panel animate-fade-in" style={{ padding: "20px", background: "linear-gradient(90deg, rgba(37, 99, 235, 0.1), transparent)", borderLeft: "4px solid var(--primary)" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><Megaphone size={18} color="var(--primary)" /> Organizer Announcements</h3>
            <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.5" }}>
              {tournament.config?.description ? tournament.config.description : `Welcome to the ${tournament.name}! Managers, please ensure all player rosters are updated before Matchday 1. Referees will strictly check boots (no metal studs allowed on turf).`}
            </p>
          </div>

          {tournament.config && (
            <div className="glass-panel animate-fade-in" style={{ padding: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Location</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "600", fontSize: "14px" }}>{tournament.config.turf || "TBA"}, {tournament.config.city}</p>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Schedule</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "600", fontSize: "14px" }}>{tournament.config.matchDates} • {tournament.config.matchTimeSlots}</p>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Environment</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "600", fontSize: "14px" }}>{tournament.config.indoorOutdoor} • {tournament.config.groundType}</p>
              </div>
              <div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Prize Pool</span>
                <p style={{ margin: "4px 0 0 0", fontWeight: "600", fontSize: "14px", color: "var(--accent)" }}>{tournament.config.prizePool || "Not specified"}</p>
              </div>
            </div>
          )}

          {/* Tournament Statistics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", marginBottom: "10px" }}>
            <div className="glass-panel" style={{ padding: "15px", textAlign: "center", borderBottom: "3px solid var(--primary)" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Total Goals</span>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "white" }}>{totalGoals}</div>
            </div>
            <div className="glass-panel" style={{ padding: "15px", textAlign: "center", borderBottom: "3px solid var(--warning)" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Avg Goals/Match</span>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "white" }}>{avgGoals}</div>
            </div>
            <div className="glass-panel" style={{ padding: "15px", textAlign: "center", borderBottom: "3px solid var(--danger)" }}>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase" }}>Yellow Cards</span>
              <div style={{ fontSize: "28px", fontWeight: "900", color: "white" }}>{totalYellows}</div>
            </div>
          </div>

          {/* Main Display Area (Standings/Bracket) */}
          <div style={{ marginTop: "10px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
              <Trophy size={20} color="var(--warning)" /> {tournament.type === "LEAGUE" ? "Live Standings" : "Knockout Stage"}
            </h3>
            {tournament.type === "LEAGUE" ? (
              <LeagueStandings id={id} />
            ) : tournament.type === "KNOCKOUT" ? (
              renderKnockoutBracket()
            ) : (
              <div className="glass-panel" style={{ padding: "40px", textAlign: "center" }}>
                <p>Mode {tournament.type} is under construction.</p>
              </div>
            )}
          </div>
          </>
          )}

          {activeTab === "LEADERBOARDS" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
              {renderLeaderboardTable("Golden Boot", getTopScorers(), "goals", "GLS", <Goal size={18} />)}
              {renderLeaderboardTable("Top Assists", getTopAssists(), "assists", "AST", <Activity size={18} />)}
              {renderLeaderboardTable("Best Goalkeeper", getTopGKs(), "saves", "SVS", <Shield size={18} />)}
              {renderLeaderboardTable("Most Clean Sheets", getMostCleanSheets(), "cleanSheets", "CS", <Shield size={18} />)}
              {renderLeaderboardTable("Tournament MVP", getTopMVPs(), "motm", "MOTM", <Star size={18} />)}
            </div>
          )}
        </div>

        {/* Sidebar Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Organizer Info */}
          <div className="glass-panel animate-slide-in" style={{ padding: "20px", borderTop: "4px solid var(--warning)" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "16px", display: "flex", alignItems: "center", gap: "8px", color: "var(--text-muted)", textTransform: "uppercase" }}>
              Tournament Organizer
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={24} color="var(--warning)" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: "0 0 4px 0", fontSize: "16px" }}>Mumbai FA</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--text-muted)" }}>
                  <span style={{ color: "var(--accent)" }}>★ 4.9</span>
                  <span>•</span>
                  <span>12 Tournaments Hosted</span>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Matches */}
          <div className="glass-panel animate-slide-in" style={{ padding: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><CalendarIcon size={18} color="var(--accent)" /> Upcoming Fixtures</h3>
            
            {tournament.status === "ACTIVE" && tournament.fixtures && tournament.fixtures.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tournament.fixtures.map((fix, i) => (
                  <div key={fix.id} style={{ display: "flex", flexDirection: "column", background: "rgba(0,0,0,0.3)", padding: "15px", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.05)", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: i === 0 ? "var(--warning)" : "var(--primary)" }}></div>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "8px", display: "flex", justifyContent: "space-between" }}>
                      <span>{fix.matchday}</span>
                      <span style={{ color: "var(--accent)" }}>{fix.date} {fix.time}</span>
                    </span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: "700", marginBottom: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        <Shield size={14} color="var(--text-muted)" />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80px" }}>{fix.teamA}</span>
                      </div>
                      <span style={{ fontSize: "10px", color: "white", margin: "0 10px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>VS</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, justifyContent: "flex-end" }}>
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80px" }}>{fix.teamB}</span>
                        <Shield size={14} color="var(--text-muted)" />
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate(`/create-match?tournamentId=${id}&matchId=${fix.id}&tA=${encodeURIComponent(fix.teamA)}&tB=${encodeURIComponent(fix.teamB)}`)}
                      className="btn-primary" 
                      style={{ width: "100%", padding: "8px", fontSize: "13px", fontWeight: "900", background: "linear-gradient(90deg, var(--primary), #1e40af)", border: "none", color: "white", boxShadow: "0 2px 10px rgba(37,99,235,0.4)" }}
                    >
                      CREATE MATCH
                    </button>
                  </div>
                ))}
              </div>
            ) : tournament.status === "ACTIVE" ? (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                <CalendarIcon size={32} style={{ opacity: 0.3, margin: "0 auto 10px auto" }} />
                No upcoming fixtures scheduled.
              </div>
            ) : (
              <div style={{ padding: "20px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                <CalendarIcon size={32} style={{ opacity: 0.3, margin: "0 auto 10px auto" }} />
                Fixtures will be generated when tournament starts.
              </div>
            )}
          </div>

          {/* Recent Results */}
          <div className="glass-panel animate-slide-in" style={{ padding: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}><Activity size={18} color="var(--accent)" /> Recent Results</h3>
            {tournament.completedMatches && tournament.completedMatches.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {tournament.completedMatches.slice(-3).reverse().map((cm) => (
                  <div key={cm.id} style={{ display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.02)", padding: "12px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span style={{ fontSize: "10px", color: "var(--text-muted)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "6px" }}>{cm.matchday} • {cm.date}</span>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px", fontWeight: "700" }}>
                      <span style={{ color: cm.scoreA > cm.scoreB ? "white" : "var(--text-muted)", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cm.teamA}</span>
                      <span style={{ fontWeight: "900", background: "rgba(0,0,0,0.4)", padding: "4px 8px", borderRadius: "4px", fontSize: "12px", color: "white", margin: "0 10px" }}>{cm.scoreA} - {cm.scoreB}</span>
                      <span style={{ color: cm.scoreB > cm.scoreA ? "white" : "var(--text-muted)", flex: 1, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cm.teamB}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: "10px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                No completed matches yet.
              </div>
            )}
          </div>

          {/* Teams Roster Sidebar */}
          <div className="glass-panel animate-slide-in" style={{ padding: "20px" }}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "18px", display: "flex", alignItems: "center", gap: "8px" }}>
              <Users size={18} color="var(--primary)" /> Participants ({tournament.teams.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
              {tournament.teams.map((t, i) => (
                 <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px", background: "rgba(255,255,255,0.02)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.02)", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.02)"}>
                   <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                     <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                       <Shield size={14} color="white" />
                     </div>
                     <span style={{ fontWeight: "700", fontSize: "14px" }}>{t.name}</span>
                   </div>
                 </div>
              ))}
              {tournament.status === "DRAFT" && (
                 <button onClick={() => navigate(`/create-team?tournament=${id}`)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "12px", border: "1px dashed var(--primary)", borderRadius: "6px", cursor: "pointer", background: "rgba(37, 99, 235, 0.05)", color: "var(--primary)", fontWeight: "bold", fontSize: "13px", marginTop: "5px" }}>
                   + Register Team
                 </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
