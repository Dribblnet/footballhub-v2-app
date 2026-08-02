import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTournaments } from "../../context/TournamentContext";
import { useTeams } from "../../context/TeamContext";
import { Trophy, ArrowLeft, Users, Settings, MapPin, Calendar, Clock, DollarSign, Award, Shield } from "lucide-react";
import { INDIAN_CITIES } from "../../core/cities";
import { useToast } from "../../context/ToastContext";

export default function CreateTournament() {
  const navigate = useNavigate();
  const { createTournament, addTeamToTournament, startTournament } = useTournaments();
  const { teams } = useTeams();
  const { toast } = useToast();

  // Basic Details
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("LEAGUE");
  
  // Location
  const [city, setCity] = useState("Mumbai");
  const [area, setArea] = useState("");
  const [turf, setTurf] = useState("");
  
  // Scheduling
  const [startDate, setStartDate] = useState("");
  const [matchDates, setMatchDates] = useState("Weekends Only");
  const [matchTimeSlots, setMatchTimeSlots] = useState("Evening (18:00 - 22:00)");
  
  // Match Format & Options
  const [matchFormat, setMatchFormat] = useState("5v5");
  const [skillLevel, setSkillLevel] = useState("Competitive");
  const [groundType, setGroundType] = useState("Artificial Turf");
  const [indoorOutdoor, setIndoorOutdoor] = useState("Outdoor");
  const [refereeIncluded, setRefereeIncluded] = useState("Yes");
  const [maxTeams, setMaxTeams] = useState(8);
  
  // Economics
  const [entryFee, setEntryFee] = useState("");
  const [prizePool, setPrizePool] = useState("");
  
  // Teams
  const [selectedTeams, setSelectedTeams] = useState([]);

  const toggleTeam = (teamId) => {
    if (selectedTeams.includes(teamId)) {
      setSelectedTeams(prev => prev.filter(id => id !== teamId));
    } else {
      if (selectedTeams.length >= maxTeams) {
        toast.error(`You can only select up to ${maxTeams} teams.`);
        return;
      }
      setSelectedTeams(prev => [...prev, teamId]);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) return toast.error("Tournament name is required.");
    if (selectedTeams.length < 2) return toast.error("Select at least 2 teams.");

    const tId = createTournament({
      name,
      type,
      description,
      city, area, turf,
      startDate, matchDates, matchTimeSlots,
      matchFormat, skillLevel, groundType, indoorOutdoor, refereeIncluded,
      maxTeams, entryFee, prizePool,
      rules: { win: 3, draw: 1, loss: 0 }
    });
    
    selectedTeams.forEach(id => {
      const team = teams.find(t => t.id === id);
      if (team) addTeamToTournament(tId, team);
    });

    startTournament(tId);

    navigate(`/tournament/${tId}`);
  };

  const sectionStyle = {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "24px",
    background: "var(--bg-card)",
    borderTop: "3px solid var(--primary)",
  };

  const labelStyle = { display: "flex", alignItems: "center", gap: "8px", fontWeight: "800", marginBottom: "8px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "1px" };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", paddingBottom: "100px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "28px", fontWeight: "900", color: "white" }}>Create Tournament</h2>
      </header>

      <div className="glass-panel" style={sectionStyle}>
        <h3 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
          <Trophy size={20} color="var(--warning)" /> Basic Details
        </h3>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <div>
            <label style={labelStyle}>Tournament Name</label>
            <input className="input-modern" placeholder="e.g. Corporate Champions Cup" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Description / Rules Summary</label>
            <input className="input-modern" placeholder="Brief info about the tournament..." value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          
          <div>
            <label style={labelStyle}>Tournament Type</label>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["LEAGUE", "KNOCKOUT", "GROUP_STAGE", "FRIENDLY"].map(t => (
                <button 
                  key={t}
                  onClick={() => setType(t)}
                  style={{ 
                    flex: "1 1 120px", padding: "12px", borderRadius: "8px", 
                    background: type === t ? "var(--primary)" : "rgba(255,255,255,0.05)", 
                    border: type === t ? "1px solid var(--primary)" : "1px solid var(--border)", 
                    color: type === t ? "white" : "var(--text-muted)", fontWeight: "bold",
                    transition: "all 0.2s", cursor: "pointer"
                  }}
                >
                  {t.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={sectionStyle}>
        <h3 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
          <MapPin size={20} color="var(--primary)" /> Location & Schedule
        </h3>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}>City</label>
            <select className="input-modern" value={city} onChange={e => setCity(e.target.value)}>
              {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}>Area</label>
            <input className="input-modern" placeholder="e.g. Bandra West" value={area} onChange={e => setArea(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 100%" }}>
            <label style={labelStyle}>Location</label>
            <input className="input-modern" placeholder="e.g. AstroPark" value={turf} onChange={e => setTurf(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "10px" }}>
          <div style={{ flex: "1 1 150px" }}>
            <label style={labelStyle}><Calendar size={14}/> Start Date</label>
            <input type="date" className="input-modern" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}>Match Days</label>
            <select className="input-modern" value={matchDates} onChange={e => setMatchDates(e.target.value)}>
              <option>Weekends Only</option>
              <option>Weekdays (Evening)</option>
              <option>All Days</option>
              <option>Custom</option>
            </select>
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}><Clock size={14}/> Preferred Timing</label>
            <select className="input-modern" value={matchTimeSlots} onChange={e => setMatchTimeSlots(e.target.value)}>
              <option>Morning (06:00 - 10:00)</option>
              <option>Afternoon (14:00 - 17:00)</option>
              <option>Evening (18:00 - 22:00)</option>
              <option>Late Night (22:00+)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={sectionStyle}>
        <h3 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
          <Settings size={20} color="var(--primary)" /> Format & Settings
        </h3>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          <div style={{ flex: "1 1 100%" }}>
            <label style={labelStyle}>Match Format</label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {["4v4", "5v5", "6v6", "7v7", "8v8", "9v9", "10v10", "11v11"].map(fmt => (
                <button 
                  key={fmt} onClick={() => setMatchFormat(fmt)}
                  style={{ 
                    padding: "8px 16px", borderRadius: "6px", fontWeight: "bold",
                    background: matchFormat === fmt ? "var(--warning)" : "rgba(255,255,255,0.05)",
                    border: matchFormat === fmt ? "1px solid var(--warning)" : "1px solid var(--border)",
                    color: matchFormat === fmt ? "black" : "white", cursor: "pointer"
                  }}
                >{fmt}</button>
              ))}
            </div>
          </div>

          <div style={{ flex: "1 1 150px" }}>
            <label style={labelStyle}>Skill Level</label>
            <select className="input-modern" value={skillLevel} onChange={e => setSkillLevel(e.target.value)}>
              <option>Casual</option>
              <option>Intermediate</option>
              <option>Competitive</option>
              <option>Professional</option>
            </select>
          </div>
          
          <div style={{ flex: "1 1 150px" }}>
            <label style={labelStyle}>Ground Type</label>
            <select className="input-modern" value={groundType} onChange={e => setGroundType(e.target.value)}>
              <option>Artificial Turf</option>
              <option>Natural Grass</option>
              <option>Hard Court</option>
              <option>Sand/Beach</option>
            </select>
          </div>

          <div style={{ flex: "1 1 150px" }}>
            <label style={labelStyle}>Environment</label>
            <select className="input-modern" value={indoorOutdoor} onChange={e => setIndoorOutdoor(e.target.value)}>
              <option>Outdoor</option>
              <option>Indoor</option>
            </select>
          </div>

          <div style={{ flex: "1 1 150px" }}>
            <label style={labelStyle}><Shield size={14}/> Referee Included</label>
            <select className="input-modern" value={refereeIncluded} onChange={e => setRefereeIncluded(e.target.value)}>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={sectionStyle}>
        <h3 style={{ margin: "0 0 10px 0", display: "flex", alignItems: "center", gap: "10px", color: "white" }}>
          <Award size={20} color="var(--primary)" /> Economics & Teams
        </h3>
        
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginBottom: "20px" }}>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}><DollarSign size={14}/> Entry Fee per Team</label>
            <input className="input-modern" placeholder="e.g. ₹5,000" value={entryFee} onChange={e => setEntryFee(e.target.value)} />
          </div>
          <div style={{ flex: "1 1 200px" }}>
            <label style={labelStyle}><Award size={14}/> Prize Pool</label>
            <input className="input-modern" placeholder="e.g. ₹50,000 Winner Takes All" value={prizePool} onChange={e => setPrizePool(e.target.value)} />
          </div>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "15px" }}>
            <span style={labelStyle}><Users size={16} /> Select Participating Teams</span>
            <span style={{ fontSize: "14px", color: selectedTeams.length >= 2 ? "var(--accent)" : "var(--danger)", fontWeight: "bold" }}>
              {selectedTeams.length} / {maxTeams} Selected
            </span>
          </label>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "bold" }}>Max Teams:</span>
            <select className="input-modern" style={{ width: "80px", fontSize: "14px" }} value={maxTeams} onChange={e => {
              const val = Number(e.target.value);
              setMaxTeams(val);
              if (selectedTeams.length > val) {
                setSelectedTeams(selectedTeams.slice(0, val));
              }
            }}>
              {[4, 6, 8, 10, 12, 16, 20, 24, 32].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {teams.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "14px", padding: "20px", textAlign: "center", border: "1px dashed var(--border)", borderRadius: "12px" }}>No teams registered. Create teams in the Team Hub first.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto", paddingRight: "10px" }}>
              {teams.map(t => (
                <div key={t.id} onClick={() => toggleTeam(t.id)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px", background: selectedTeams.includes(t.id) ? "linear-gradient(90deg, rgba(59, 130, 246, 0.2), transparent)" : "rgba(255,255,255,0.02)", border: selectedTeams.includes(t.id) ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}>
                  <span style={{ fontWeight: "800", color: selectedTeams.includes(t.id) ? "white" : "var(--text-muted)" }}>{t.name}</span>
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: "2px solid var(--primary)", background: selectedTeams.includes(t.id) ? "var(--primary)" : "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {selectedTeams.includes(t.id) && <div style={{ width: "10px", height: "10px", background: "white", borderRadius: "50%" }} />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <button onClick={handleCreate} className="btn-primary" style={{ width: "100%", padding: "20px", marginTop: "10px", fontSize: "18px", fontWeight: "900", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", letterSpacing: "2px", boxShadow: "0 10px 30px rgba(37,99,235,0.5)" }}>
        <Trophy size={24} /> CREATE TOURNAMENT
      </button>
    </div>
  );
}
