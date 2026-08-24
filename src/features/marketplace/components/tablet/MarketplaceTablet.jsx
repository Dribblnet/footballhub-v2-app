import React from "react";
import { Plus, MapPin, Target, MessageSquare, Shield, Clock, Trash2 } from "lucide-react";
import VerifiedBadge from "../../../../components/VerifiedBadge";
import { INDIAN_CITIES } from "../../../../core/cities";

const POSITIONS = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];

export default function MarketplaceTablet(props) {
  const {
    navigate,
    requests,
    addRequest,
    deleteRequest,
    unreadMessagesCount,
    toast,
    user,
    players,
    isCreating,
    setIsCreating,
    deleteModalId,
    setDeleteModalId,
    filterCity,
    setFilterCity,
    filterFormat,
    setFilterFormat,
    filterSkill,
    setFilterSkill,
    filterSurface,
    setFilterSurface,
    filterEnvironment,
    setFilterEnvironment,
    filterType,
    setFilterType,
    formType,
    setFormType,
    formMatchType,
    setFormMatchType,
    formSkill,
    setFormSkill,
    formTurf,
    setFormTurf,
    formCity,
    setFormCity,
    formDate,
    setFormDate,
    formTime,
    setFormTime,
    formDuration,
    setFormDuration,
    formPositions,
    setFormPositions,
    formPlayersNeeded,
    setFormPlayersNeeded,
    formEnvironment,
    setFormEnvironment,
    formSurface,
    setFormSurface,
    formRefNeeded,
    setFormRefNeeded,
    formSubsAllowed,
    setFormSubsAllowed,
    formEntryFee,
    setFormEntryFee,
    formPrizeInfo,
    setFormPrizeInfo,
    togglePosition,
    handleSubmit,
    filteredRequests,
  } = props;

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>Marketplace</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => navigate("/messages")} className="btn-primary" style={{ background: "transparent", border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "8px", position: "relative" }}>
            <MessageSquare size={18} /> Messages
            {unreadMessagesCount > 0 && <div style={{ position: "absolute", top: -5, right: -5, background: "var(--primary)", color: "white", fontSize: "10px", width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold" }}>{unreadMessagesCount}</div>}
          </button>
          <button onClick={() => setIsCreating(!isCreating)} className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {isCreating ? "Cancel" : <><Plus size={18} /> New Request</>}
          </button>
        </div>
      </header>

      {/* Active Requests Limit Banner */}
      {(() => {
        const activeCount = requests.filter(req => req.author === (user?.name || "You")).length;
        if (activeCount >= 3) {
          return (
            <div className="glass-panel" style={{ padding: "20px", marginBottom: "20px", background: "linear-gradient(90deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "12px", borderLeft: "4px solid var(--danger)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h4 style={{ margin: "0 0 5px 0", color: "white", fontSize: "16px", fontWeight: "800", display: "flex", alignItems: "center", gap: "8px" }}><Shield size={18} color="var(--danger)" /> Maximum active requests reached.</h4>
                  <p style={{ margin: 0, color: "var(--text-muted)", fontSize: "14px" }}>You currently have 3 active marketplace requests. Delete or wait for one to expire before posting another.</p>
                </div>
                <div style={{ background: "rgba(0,0,0,0.5)", padding: "10px 15px", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <span style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>Active Requests</span>
                  <span style={{ fontSize: "20px", fontWeight: "900", color: "white" }}>3 <span style={{ color: "var(--danger)", opacity: 0.7 }}>/ 3</span></span>
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      {!isCreating && (
        <div className="glass-panel" style={{ padding: "24px", marginBottom: "30px", display: "flex", flexDirection: "column", gap: "20px", background: "linear-gradient(145deg, rgba(37, 99, 235, 0.15) 0%, rgba(15, 23, 42, 0.95) 100%)", borderTop: "4px solid var(--primary)", borderBottom: "1px solid rgba(37,99,235,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--warning)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Request Type</label>
                <select className="input-modern" value={filterType} onChange={e => setFilterType(e.target.value)}>
                  <option value="All">All Types</option>
                  <option value="Requests">General Requests</option>
                  <option value="Tournaments">Tournaments</option>
                  <option value="Teams Looking For Players">Teams Looking For Players</option>
                  <option value="Players Looking For Teams">Players Looking For Teams</option>
                </select>
              </div>
            </div>
            <div style={{ flex: "1 1 180px", display: "flex", alignItems: "center", gap: "12px" }}>
              <MapPin size={22} color="var(--primary)" style={{ filter: "drop-shadow(0 0 8px rgba(37,99,235,0.8))" }} />
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", fontSize: "11px", color: "var(--primary)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Target City</label>
                <select className="input-modern" value={filterCity} onChange={e => setFilterCity(e.target.value)}>
                  <option value="All">All Cities</option>
                  {INDIAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Match Format</label>
              <select className="input-modern" value={filterFormat} onChange={e => setFilterFormat(e.target.value)}>
                <option value="All">All Formats</option>
                {["4v4", "5v5", "6v6", "7v7", "8v8", "9v9", "10v10", "11v11", "Custom"].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "var(--warning)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Skill Level</label>
              <select className="input-modern" style={{ borderColor: "rgba(249, 115, 22, 0.3)" }} value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
                <option value="All">All Levels</option>
                <option value="Casual">Casual</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Competitive">Competitive</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Turf/Surface</label>
              <select className="input-modern" value={filterSurface} onChange={e => setFilterSurface(e.target.value)}>
                <option value="All">Any Surface</option>
                <option value="Turf">Artificial Turf</option>
                <option value="Grass">Natural Grass</option>
                <option value="Hard">Hard Court</option>
                <option value="Sand">Sand/Beach</option>
              </select>
            </div>
            <div style={{ flex: "1 1 140px" }}>
              <label style={{ display: "block", fontSize: "11px", color: "var(--text-muted)", fontWeight: "800", textTransform: "uppercase", marginBottom: "8px", letterSpacing: "1.5px" }}>Environment</label>
              <select className="input-modern" value={filterEnvironment} onChange={e => setFilterEnvironment(e.target.value)}>
                <option value="All">Any</option>
                <option value="Outdoor">Outdoor</option>
                <option value="Indoor">Indoor</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {isCreating && (
        <div className="glass-panel" style={{ marginBottom: "30px", border: "2px solid var(--accent)", background: "linear-gradient(180deg, rgba(16, 185, 129, 0.1), rgba(15, 23, 42, 0.9))" }}>
          <h3 style={{ margin: "0 0 20px 0" }}>Create Match Request</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Request Type */}
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>What do you need?</label>
              <select className="input-modern" value={formType} onChange={e => {
                setFormType(e.target.value);
                if (e.target.value === "Looking for Goalkeeper") {
                  setFormPositions(["GK"]);
                  setFormPlayersNeeded(1);
                } else if (e.target.value === "Looking for Referee" || e.target.value === "Looking for Opponent" || e.target.value === "Looking for Coach" || e.target.value === "Looking for Friendly Match") {
                  setFormPositions([]);
                  setFormPlayersNeeded(1);
                }
              }}>
                <option value="Looking for Players">Looking for Players</option>
                <option value="Looking for Goalkeeper">Looking for Goalkeeper</option>
                <option value="Looking for Opponent">Looking for Opponent</option>
                <option value="Looking for Referee">Looking for Referee</option>
                <option value="Looking for Coach">Looking for Coach</option>
                <option value="Looking for Friendly Match">Looking for Friendly Match</option>
                <option value="Looking To Join">Looking to Join a Match</option>
                <option value="Tournament Ad">Post Tournament Ad</option>
              </select>
            </div>

            {/* Match Format & Skill Level */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 100%" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Match Format</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {["4v4", "5v5", "6v6", "7v7", "8v8", "9v9", "10v10", "11v11", "Custom"].map(fmt => (
                    <button 
                      key={fmt} 
                      onClick={() => setFormMatchType(fmt)}
                      style={{ 
                        padding: "8px 12px", borderRadius: "8px", fontWeight: "bold",
                        background: formMatchType === fmt ? "var(--primary)" : "rgba(255,255,255,0.05)",
                        border: formMatchType === fmt ? "1px solid var(--primary)" : "1px solid var(--border)",
                        color: "white", cursor: "pointer", flex: "1 1 60px"
                      }}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Skill Level</label>
                <select className="input-modern" value={formSkill} onChange={e => setFormSkill(e.target.value)}>
                  <option value="Casual">Casual (For Fun)</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Competitive">Competitive (League/Tournament)</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", padding: "24px", background: "linear-gradient(180deg, rgba(37, 99, 235, 0.05), rgba(3,7,18,0.8))", borderRadius: "16px", border: "1px solid rgba(37, 99, 235, 0.2)" }}>
               <div style={{ flex: "1 1 120px" }}>
                 <label style={{ display: "block", marginBottom: "8px", color: "var(--primary)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Environment</label>
                 <select className="input-modern" value={formEnvironment} onChange={e => setFormEnvironment(e.target.value)}>
                   <option value="Outdoor">Outdoor</option>
                   <option value="Indoor">Indoor</option>
                 </select>
               </div>
               <div style={{ flex: "1 1 120px" }}>
                 <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Surface</label>
                 <select className="input-modern" value={formSurface} onChange={e => setFormSurface(e.target.value)}>
                   <option value="Turf">Artificial Turf</option>
                   <option value="Grass">Natural Grass</option>
                   <option value="Hard">Hard Court</option>
                   <option value="Sand">Sand/Beach</option>
                 </select>
               </div>
               <div style={{ flex: "1 1 120px" }}>
                 <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Referee Needed?</label>
                 <select className="input-modern" value={formRefNeeded} onChange={e => setFormRefNeeded(e.target.value)}>
                   <option value="No">No</option>
                   <option value="Yes">Yes</option>
                 </select>
               </div>
               <div style={{ flex: "1 1 120px" }}>
                 <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "11px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Subs Allowed?</label>
                 <select className="input-modern" value={formSubsAllowed} onChange={e => setFormSubsAllowed(e.target.value)}>
                   <option value="Yes">Yes (Rolling)</option>
                   <option value="No">No</option>
                 </select>
               </div>
            </div>

            {/* Tournament Specific Fields */}
            {formType === "Tournament Ad" && (
              <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", padding: "15px", border: "1px solid var(--warning)", borderRadius: "8px", background: "rgba(245, 158, 11, 0.05)" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", marginBottom: "8px", color: "var(--warning)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Entry Fee (Optional)</label>
                  <input className="input-modern" placeholder="e.g. ₹2000 per team" value={formEntryFee} onChange={e => setFormEntryFee(e.target.value)} />
                </div>
                <div style={{ flex: "1 1 200px" }}>
                  <label style={{ display: "block", marginBottom: "8px", color: "var(--warning)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Prize Info (Optional)</label>
                  <input className="input-modern" placeholder="e.g. ₹50,000 + Trophy" value={formPrizeInfo} onChange={e => setFormPrizeInfo(e.target.value)} />
                </div>
              </div>
            )}

            {/* Positions */}
            {(formType === "Looking for Players" || formType === "Looking To Join") && (
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Specific Positions (Optional)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {POSITIONS.map(pos => (
                    <button
                      key={pos}
                      onClick={() => togglePosition(pos)}
                      style={{
                        padding: "6px 12px", borderRadius: "15px", fontSize: "12px", fontWeight: "bold",
                        background: formPositions.includes(pos) ? "var(--warning)" : "rgba(255,255,255,0.05)",
                        color: formPositions.includes(pos) ? "black" : "var(--text-muted)",
                        border: formPositions.includes(pos) ? "1px solid var(--warning)" : "1px solid var(--border)",
                        cursor: "pointer"
                      }}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Players Needed */}
            {(formType === "Looking for Players" || formType === "Tournament Ad") && (
              <div>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>
                  {formType === "Tournament Ad" ? "Team Slots Available" : "Slots Available"}
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <button onClick={() => setFormPlayersNeeded(Math.max(1, formPlayersNeeded - 1))} className="btn-primary" style={{ padding: "8px 15px", background: "rgba(255,255,255,0.1)" }}>-</button>
                  <span style={{ fontSize: "20px", fontWeight: "bold", width: "30px", textAlign: "center" }}>{formPlayersNeeded}</span>
                  <button onClick={() => setFormPlayersNeeded(formPlayersNeeded + 1)} className="btn-primary" style={{ padding: "8px 15px", background: "rgba(255,255,255,0.1)" }}>+</button>
                </div>
              </div>
            )}

            {/* Location */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>City</label>
                <select className="input-modern" value={formCity} onChange={e => setFormCity(e.target.value)}>
                  {INDIAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Turf Name / Area</label>
                <input className="input-modern" placeholder="e.g. Downtown Turf" value={formTurf} onChange={e => setFormTurf(e.target.value)} />
              </div>
            </div>

            {/* Time & Date */}
            <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Date</label>
                <input type="date" className="input-modern" value={formDate} onChange={e => setFormDate(e.target.value)} />
              </div>
              <div style={{ flex: "1 1 120px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Time</label>
                <input type="time" className="input-modern" value={formTime} onChange={e => setFormTime(e.target.value)} />
              </div>
              <div style={{ flex: "1 1 200px" }}>
                <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Duration (Mins)</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
                  {[30, 45, 60, 90, 120].map(mins => (
                    <button 
                      key={mins}
                      onClick={() => setFormDuration(mins)}
                      style={{
                        padding: "8px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700",
                        background: formDuration === mins ? "var(--primary)" : "rgba(255,255,255,0.05)",
                        border: formDuration === mins ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.1)",
                        color: "white", cursor: "pointer", transition: "all 0.2s ease"
                      }}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "600" }}>Custom:</span>
                  <input type="number" className="input-modern" value={formDuration} min={1} onChange={e => setFormDuration(Number(e.target.value) || "")} style={{ maxWidth: "80px", padding: "8px" }} />
                </div>
              </div>
            </div>

            <button onClick={handleSubmit} className="btn-primary" style={{ marginTop: "10px", padding: "15px", fontWeight: "800", fontSize: "16px" }}>Post Request</button>
          </div>
        </div>
      )}

      {/* FEED */}
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "40px" }}>
        {filteredRequests.map((req) => {
          let cardTint = "linear-gradient(90deg, rgba(255,255,255,0.05), transparent)";
          let cardBorder = "rgba(255,255,255,0.1)";
          let accentColor = "var(--primary)";

          if (req.type === "Tournament Ad") {
            cardTint = "linear-gradient(90deg, rgba(245, 158, 11, 0.15), rgba(245, 158, 11, 0.02))";
            cardBorder = "rgba(245, 158, 11, 0.3)";
            accentColor = "var(--warning)";
          } else if (req.type.includes("Join")) {
            cardTint = "linear-gradient(90deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.02))";
            cardBorder = "rgba(16, 185, 129, 0.3)";
            accentColor = "var(--accent)";
          } else if (req.type.includes("Need") || req.type.includes("Looking for")) {
            cardTint = "linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.02))";
            cardBorder = "rgba(59, 130, 246, 0.3)";
            accentColor = "var(--primary)";
          }

          return (
          <div key={req.id} className="glass-panel" style={{ 
            padding: "20px 24px", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between", 
            background: cardTint,
            border: `1px solid ${cardBorder}`,
            borderLeft: `4px solid ${accentColor}`,
            borderRadius: "16px",
            transition: "all 0.3s ease",
            flexWrap: "wrap",
            gap: "20px"
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 10px 25px ${cardTint.replace('0.05', '0.15')}`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
          >
            {/* Left Col: Core Info */}
            <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "4px", height: "18px", background: accentColor, borderRadius: "2px", boxShadow: `0 0 10px ${accentColor}` }}></div>
                <h3 style={{ margin: 0, fontSize: "18px", fontWeight: "900", textTransform: "uppercase", letterSpacing: "0.5px", color: "white" }}>{req.type}</h3>
                {req.playersNeeded > 0 && (
                  <span style={{ fontSize: "11px", background: req.type === "Tournament Ad" ? "rgba(245, 158, 11, 0.2)" : "rgba(255,255,255,0.1)", color: req.type === "Tournament Ad" ? "var(--warning)" : "white", padding: "4px 8px", borderRadius: "6px", fontWeight: "800" }}>
                    {req.playersNeeded} SLOTS
                  </span>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "16px", color: "var(--text-muted)", fontSize: "13px", fontWeight: "600", flexWrap: "wrap" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><MapPin size={14} color={accentColor} /> {req.turf}, {req.city}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "6px" }}><Clock size={14} color={accentColor} /> {req.date} • {req.time} ({String(req.duration).includes("Min") || String(req.duration) === "Tournament" ? req.duration : `${req.duration} Min`})</span>
              </div>
            </div>

            {/* Middle Col: Tags */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", flex: "1 1 200px" }}>
              <span style={{ fontSize: "12px", border: "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.3)", padding: "4px 10px", borderRadius: "6px", fontWeight: "800", color: "white" }}>{req.matchType}</span>
              <span style={{ fontSize: "12px", border: req.skillLevel === "Competitive" || req.skillLevel === "Professional" ? "1px solid var(--warning)" : "1px solid rgba(255,255,255,0.15)", background: "rgba(0,0,0,0.3)", color: req.skillLevel === "Competitive" || req.skillLevel === "Professional" ? "var(--warning)" : "white", padding: "4px 10px", borderRadius: "6px", fontWeight: "800" }}>
                {req.skillLevel}
              </span>
              {req.positions && req.positions.map(pos => (
                <span key={pos} style={{ fontSize: "12px", fontWeight: "900", background: "var(--primary)", color: "white", padding: "4px 10px", borderRadius: "6px" }}>
                  {pos}
                </span>
              ))}
            </div>

            {/* Right Col: Author & Action */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px", flex: "0 0 auto", width: "100%", justifyContent: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", fontSize: "12px" }}>
                {req.timestamp && (
                  <span style={{ color: "var(--warning)", fontWeight: "600", fontSize: "10px", textTransform: "uppercase", marginBottom: "2px" }}>
                    {/* eslint-disable-next-line react-hooks/purity */}
                    Expires in {Math.max(1, Math.floor((24 * 60 * 60 * 1000 - (Date.now() - req.timestamp)) / 3600000))}h
                  </span>
                )}
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "800", color: "white" }}>
                  <Shield size={14} color="var(--warning)" /> {req.author}
                  {(() => {
                    const authorPlayer = players.find(p => p.name === req.author);
                    if (authorPlayer && (authorPlayer.isVerified || authorPlayer.emailVerified)) {
                      return <VerifiedBadge isEmailVerified={true} isPhoneVerified={authorPlayer.phoneVerified} size={14} showText={false} />;
                    }
                    return null;
                  })()}
                </span>
              </div>
              
              {(req.author === "You" || req.author === user?.name) ? (
                <button 
                  onClick={() => setDeleteModalId(req.id)}
                  className="btn-primary" 
                  style={{ 
                    padding: "10px", borderRadius: "8px", 
                    background: "transparent", color: "var(--danger)", border: "1px solid rgba(239, 68, 68, 0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                  title="Delete Request"
                >
                  <Trash2 size={18} />
                </button>
              ) : (
                <button 
                  onClick={() => navigate(`/messages?contact=${encodeURIComponent(req.author)}&contactId=${encodeURIComponent(req.authorId || "")}&ref=${encodeURIComponent(req.type)}`)} 
                  className="btn-primary" 
                  style={{ 
                    padding: "10px 20px", fontSize: "13px", borderRadius: "8px", letterSpacing: "1px", 
                    background: req.type === "Tournament Ad" ? "var(--warning)" : "var(--primary)",
                    color: req.type === "Tournament Ad" ? "black" : "white",
                    border: "none",
                    fontWeight: "800",
                    display: "flex", alignItems: "center", gap: "8px",
                    boxShadow: req.type === "Tournament Ad" ? "0 4px 15px rgba(245, 158, 11, 0.4)" : "var(--glow-primary)"
                  }}
                >
                  <MessageSquare size={16} />
                  {req.type === "Tournament Ad" ? "CONTACT ORGANIZER" : "MESSAGE"}
                </button>
              )}
            </div>
          </div>
          );
        })}
        
        {filteredRequests.length === 0 && (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <Target size={48} style={{ margin: "0 auto 15px auto", opacity: 0.5 }} />
            <h3 style={{ margin: "0 0 10px 0", color: "white" }}>No requests found</h3>
            <p style={{ margin: 0 }}>Be the first to create a match request in {filterCity}.</p>
            <button onClick={() => setIsCreating(true)} className="btn-primary" style={{ marginTop: "20px" }}>Create Request</button>
          </div>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(5px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="glass-panel" style={{ padding: "30px", maxWidth: "400px", width: "90%", textAlign: "center", border: "1px solid rgba(239, 68, 68, 0.3)", boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div style={{ width: "60px", height: "60px", background: "rgba(239, 68, 68, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px auto" }}>
              <Trash2 size={30} color="var(--danger)" />
            </div>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "22px", fontWeight: "800" }}>Delete Request</h3>
            <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "15px" }}>
              <button 
                onClick={() => setDeleteModalId(null)}
                className="btn-primary" 
                style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", color: "white" }}
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteRequest(deleteModalId);
                  toast.success("Request deleted successfully");
                  setDeleteModalId(null);
                }}
                className="btn-primary" 
                style={{ flex: 1, background: "var(--danger)", border: "none", color: "white" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
