import { ArrowLeft, Clock, Calendar } from "lucide-react";

export default function MatchHistoryMobile({
  navigate,
  filteredMatches,
  filterFormat, setFilterFormat,
  filterStatus, setFilterStatus,
  filterDuration, setFilterDuration,
  filterType, setFilterType,
  filterLocation, setFilterLocation,
  filterCity, setFilterCity,
  filterDate, setFilterDate
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", width: "100vw", overflowX: "hidden" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "10px", padding: "15px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", padding: "5px" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "18px", fontWeight: "800" }}>Matches Hub</h2>
      </header>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", width: "100%", padding: "10px" }}>
        
        {/* Filters */}
        <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "10px", marginBottom: "15px", scrollbarWidth: "none" }}>
          <select className="input-modern" value={filterFormat} onChange={e => setFilterFormat(e.target.value)} style={{ padding: "8px", fontSize: "14px", minWidth: "100px", flexShrink: 0 }}>
            <option value="All">Format</option>
            <option value="5v5">5v5</option>
            <option value="6v6">6v6</option>
            <option value="7v7">7v7</option>
            <option value="8v8">8v8</option>
            <option value="9v9">9v9</option>
            <option value="11v11">11v11</option>
          </select>
          <select className="input-modern" value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ padding: "8px", fontSize: "14px", minWidth: "110px", flexShrink: 0 }}>
            <option value="All">Status</option>
            <option value="Open">Open</option>
            <option value="Full">Full</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Live</option>
            <option value="Finished">Finished</option>
          </select>
          <select className="input-modern" value={filterType} onChange={e => setFilterType(e.target.value)} style={{ padding: "8px", fontSize: "14px", minWidth: "100px", flexShrink: 0 }}>
            <option value="All">Type</option>
            <option value="Casual">Casual</option>
            <option value="Tournament">Tournament</option>
            <option value="Friendly">Friendly</option>
          </select>
          <select className="input-modern" value={filterDate} onChange={e => setFilterDate(e.target.value)} style={{ padding: "8px", fontSize: "14px", minWidth: "100px", flexShrink: 0 }}>
            <option value="All">Date</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="This Week">This Week</option>
          </select>
        </div>

        {filteredMatches.length === 0 ? (
          <div className="glass-panel" style={{ padding: "30px 15px", textAlign: "center", color: "var(--text-muted)", borderRadius: "12px" }}>
            <Clock size={40} style={{ margin: "0 auto 10px", opacity: 0.5 }} />
            <h3 style={{ fontSize: "18px", margin: "0 0 5px 0" }}>No Matches Found</h3>
            <p style={{ fontSize: "14px" }}>Try adjusting your filters.</p>
            <button onClick={() => navigate("/create-match")} className="btn-primary" style={{ marginTop: "15px", width: "100%", padding: "12px", fontSize: "16px" }}>Create Match</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {filteredMatches.map(match => (
              <div 
                key={match.id} 
                className="glass-panel" 
                style={{ padding: "15px", display: "flex", flexDirection: "column", gap: "12px", borderRadius: "12px", borderLeft: match.state === "LIVE" ? "4px solid #10b981" : "none" }}
                onClick={() => navigate(match.state === "FINISHED" ? `/match-report/${match.id}` : `/match/${match.id}`)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    <Calendar size={14} /> 
                    {match.state === "FINISHED" ? "FT" : match.state === "PRE_MATCH" ? "UPCOMING" : "LIVE"}
                  </span>
                  <span style={{ color: "var(--accent)" }}>{match.duration} Min • {match.tournamentId ? "Tourney" : "Casual"}</span>
                </div>
                
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: "1 1 0", minWidth: 0, textAlign: "left" }}>
                    <h3 style={{ margin: "0", fontSize: "16px", color: match.teamA.score > match.teamB.score ? "white" : "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {match.teamA.name}
                    </h3>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0 10px" }}>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: match.teamA.score > match.teamB.score ? "white" : "var(--text-muted)" }}>{match.teamA.score}</span>
                    <span style={{ fontSize: "16px", color: "var(--border)" }}>-</span>
                    <span style={{ fontSize: "22px", fontWeight: "900", color: match.teamB.score > match.teamA.score ? "white" : "var(--text-muted)" }}>{match.teamB.score}</span>
                  </div>
                  
                  <div style={{ flex: "1 1 0", minWidth: 0, textAlign: "right" }}>
                    <h3 style={{ margin: "0", fontSize: "16px", color: match.teamB.score > match.teamA.score ? "white" : "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {match.teamB.name}
                    </h3>
                  </div>
                </div>

                {(match.penaltiesA?.length > 0 || match.penaltiesB?.length > 0) && (
                  <div style={{ textAlign: "center", fontSize: "12px", marginTop: "5px", color: "var(--warning)", fontWeight: "bold" }}>
                    PENS: {match.penaltiesA?.filter(p => p.isGoal).length || 0} - {match.penaltiesB?.filter(p => p.isGoal).length || 0}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
