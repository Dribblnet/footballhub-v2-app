import { ArrowLeft, Clock, Calendar } from "lucide-react";

export default function MatchHistoryDesktop({
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
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Matches Hub</h2>
      </header>

      <div className="glass-panel" style={{ padding: "15px", marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Format</label>
          <select className="input-modern" value={filterFormat} onChange={e => setFilterFormat(e.target.value)}>
            <option value="All">All</option>
            <option value="5v5">5v5</option>
            <option value="6v6">6v6</option>
            <option value="7v7">7v7</option>
            <option value="8v8">8v8</option>
            <option value="9v9">9v9</option>
            <option value="10v10">10v10</option>
            <option value="11v11">11v11</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Status</label>
          <select className="input-modern" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All</option>
            <option value="Open">Open</option>
            <option value="Full">Full</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Live">Ongoing</option>
            <option value="Finished">Completed</option>
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Duration</label>
          <select className="input-modern" value={filterDuration} onChange={e => setFilterDuration(e.target.value)}>
            <option value="All">Any</option>
            {[20, 25, 30, 35, 45, 50, 60, 70, 90, 120].map(mins => <option key={mins} value={mins.toString()}>{mins} Min</option>)}
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Type</label>
          <select className="input-modern" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="All">All</option>
            <option value="Casual">Casual Match</option>
            <option value="Tournament">Tournament Match</option>
            <option value="Friendly">Friendly</option>
            <option value="Practice">Practice Session</option>
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Location Type</label>
          <select className="input-modern" value={filterLocation} onChange={e => setFilterLocation(e.target.value)}>
            <option value="All">All</option>
            <option value="Turf">Turf</option>
            <option value="Ground">Ground</option>
            <option value="Indoor">Indoor</option>
            <option value="Outdoor">Outdoor</option>
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>City</label>
          <select className="input-modern" value={filterCity} onChange={e => setFilterCity(e.target.value)}>
            <option value="All">All Cities</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Delhi">Delhi</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Hyderabad">Hyderabad</option>
            <option value="Ahmedabad">Ahmedabad</option>
            <option value="Chennai">Chennai</option>
            <option value="Kolkata">Kolkata</option>
            <option value="Surat">Surat</option>
            <option value="Pune">Pune</option>
            <option value="Jaipur">Jaipur</option>
          </select>
        </div>
        <div style={{ flex: "1 1 140px" }}>
          <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Date</label>
          <select className="input-modern" value={filterDate} onChange={e => setFilterDate(e.target.value)}>
            <option value="All">All</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="This Week">This Week</option>
            <option value="Custom Range">Custom Range</option>
          </select>
        </div>
      </div>

      {filteredMatches.length === 0 ? (
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <Clock size={48} style={{ margin: "0 auto 15px", opacity: 0.5 }} />
          <h3>No Matches Found</h3>
          <p>Try adjusting your filters.</p>
          <button onClick={() => navigate("/create-match")} className="btn-primary" style={{ marginTop: "15px" }}>Create a Match</button>
        </div>
      ) : (
        <div className="glass-panel" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", color: "var(--text-muted)" }}>
                <th style={{ padding: "15px", fontWeight: "600", fontSize: "12px", textTransform: "uppercase" }}>Date</th>
                <th style={{ padding: "15px", fontWeight: "600", fontSize: "12px", textTransform: "uppercase" }}>Type</th>
                <th style={{ padding: "15px", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", textAlign: "right" }}>Home</th>
                <th style={{ padding: "15px", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", textAlign: "center" }}>Score</th>
                <th style={{ padding: "15px", fontWeight: "600", fontSize: "12px", textTransform: "uppercase" }}>Away</th>
                <th style={{ padding: "15px", fontWeight: "600", fontSize: "12px", textTransform: "uppercase", textAlign: "center" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.map(match => {
                const isHomeWin = match.teamA.score > match.teamB.score || (match.teamA.score === match.teamB.score && (match.penaltiesA?.filter(p => p.isGoal).length || 0) > (match.penaltiesB?.filter(p => p.isGoal).length || 0));
                const isAwayWin = match.teamB.score > match.teamA.score || (match.teamA.score === match.teamB.score && (match.penaltiesB?.filter(p => p.isGoal).length || 0) > (match.penaltiesA?.filter(p => p.isGoal).length || 0));
                
                return (
                  <tr 
                    key={match.id} 
                    onClick={() => navigate(match.state === "FINISHED" ? `/match-report/${match.id}` : `/match/${match.id}`)}
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", cursor: "pointer", transition: "background 0.2s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "15px", fontSize: "14px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "5px" }}><Calendar size={14} /> {new Date(match.date || new Date()).toLocaleDateString()}</span>
                    </td>
                    <td style={{ padding: "15px", fontSize: "14px", color: "var(--accent)" }}>
                      {match.duration} Min • {match.tournamentId ? "Tournament" : "Casual"}
                    </td>
                    <td style={{ padding: "15px", fontSize: "16px", fontWeight: isHomeWin ? "800" : "500", color: isHomeWin ? "var(--primary)" : "white", textAlign: "right", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {match.teamA.name}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "rgba(0,0,0,0.3)", padding: "5px 15px", borderRadius: "20px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "900", color: isHomeWin ? "var(--primary)" : "white" }}>{match.teamA.score}</span>
                        <span style={{ fontSize: "14px", color: "var(--text-muted)" }}>-</span>
                        <span style={{ fontSize: "18px", fontWeight: "900", color: isAwayWin ? "var(--warning)" : "white" }}>{match.teamB.score}</span>
                      </div>
                      {(match.penaltiesA?.length > 0 || match.penaltiesB?.length > 0) && (
                         <div style={{ fontSize: "11px", color: "var(--warning)", marginTop: "4px", fontWeight: "bold" }}>
                           PENS: {match.penaltiesA?.filter(p => p.isGoal).length || 0} - {match.penaltiesB?.filter(p => p.isGoal).length || 0}
                         </div>
                      )}
                    </td>
                    <td style={{ padding: "15px", fontSize: "16px", fontWeight: isAwayWin ? "800" : "500", color: isAwayWin ? "var(--warning)" : "white", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {match.teamB.name}
                    </td>
                    <td style={{ padding: "15px", textAlign: "center" }}>
                       <span style={{ 
                         fontSize: "11px", fontWeight: "bold", padding: "4px 8px", borderRadius: "10px",
                         background: match.state === "FINISHED" ? "rgba(255,255,255,0.1)" : match.state === "PRE_MATCH" ? "rgba(37,99,235,0.2)" : "rgba(16,185,129,0.2)",
                         color: match.state === "FINISHED" ? "var(--text-muted)" : match.state === "PRE_MATCH" ? "var(--primary)" : "#10b981"
                       }}>
                         {match.state === "FINISHED" ? "FT" : match.state === "PRE_MATCH" ? "UPCOMING" : "LIVE"}
                       </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
