import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMatch } from "./MatchContext";
import { useTournaments } from "../../context/TournamentContext";
import { Shield, Clock, Users, Play, MapPin, Lock, Unlock, CalendarDays, Settings } from "lucide-react";

import { INDIAN_CITIES } from "../../core/cities";
export default function CreateMatch() {
  const navigate = useNavigate();
  const locationRouter = useLocation();
  const { createMatch } = useMatch();
  const { addMatchToTournament } = useTournaments();
  
  const queryParams = new URLSearchParams(locationRouter.search);
  const tId = queryParams.get("tournamentId");
  const tMatchId = queryParams.get("matchId");
  const urlTeamA = queryParams.get("tA");
  const urlTeamB = queryParams.get("tB");

  const [teamA, setTeamA] = useState(urlTeamA || "FC Lightning");
  const [teamB, setTeamB] = useState(urlTeamB || "Thunder City");
  const [duration, setDuration] = useState(45);
  const [sizeA, setSizeA] = useState(11);
  const [sizeB, setSizeB] = useState(11);
  const [benchSizeA, setBenchSizeA] = useState(5);
  const [benchSizeB, setBenchSizeB] = useState(5);
  const [subRules, setSubRules] = useState("Rolling (Unlimited)");
  const [city, setCity] = useState("Mumbai");
  const [location, setLocation] = useState("Downtown Arena");
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [matchTime, setMatchTime] = useState("19:00");
  const [matchType, setMatchType] = useState(tId ? "Tournament Match" : "Casual Match");
  const [matchResolution, setMatchResolution] = useState("Knockout");
  const [locationType, setLocationType] = useState("Turf");
  const [isPrivate, setIsPrivate] = useState(false);
  
  const handleStart = () => {
    const matchId = createMatch(teamA, teamB, duration, sizeA, sizeB, tId, benchSizeA, benchSizeB, subRules, matchDate, matchTime, matchType, locationType, city, location, matchResolution);
    if (tId && tMatchId) {
      addMatchToTournament(tId, matchId); // Connects it to the tournament
    }
    navigate(`/match/${matchId}`);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "20px" }}>Create New Match</h2>
      
      <div className="glass-panel" style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "30px" }}>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><Shield size={18} /> Home Team</label>
          <input className="input-modern" value={teamA} onChange={e => setTeamA(e.target.value)} />
        </div>
        
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><Shield size={18} /> Away Team</label>
          <input className="input-modern" value={teamB} onChange={e => setTeamB(e.target.value)} />
        </div>
        
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><Clock size={18} /> Match Duration (Minutes)</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "10px" }}>
            {[20, 25, 30, 35, 45, 50, 60, 70, 90, 120].map(mins => (
              <button 
                key={mins}
                onClick={() => setDuration(mins)}
                style={{
                  padding: "8px 16px", borderRadius: "20px", fontSize: "14px", fontWeight: "700",
                  background: duration === mins ? "var(--primary)" : "rgba(255,255,255,0.05)",
                  border: duration === mins ? "1px solid var(--primary)" : "1px solid rgba(255,255,255,0.1)",
                  color: "white", cursor: "pointer", transition: "all 0.2s ease"
                }}
              >
                {mins}m
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: "600" }}>Custom:</span>
            <input type="number" className="input-modern" value={duration} min={1} max={300} onChange={e => setDuration(Number(e.target.value))} style={{ maxWidth: "120px" }} />
          </div>
        </div>
        
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><Users size={18} /> Home Team Size</label>
          <input type="number" className="input-modern" value={sizeA} min={5} max={11} onChange={e => setSizeA(Number(e.target.value))} />
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><Users size={18} /> Away Team Size</label>
          <input type="number" className="input-modern" value={sizeB} min={5} max={11} onChange={e => setSizeB(Number(e.target.value))} />
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>You can select uneven team sizes (e.g. 5v7).</p>
        </div>

        <div style={{ padding: "15px", background: "rgba(37,99,235,0.05)", borderRadius: "12px", border: "1px solid rgba(37,99,235,0.2)", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h4 style={{ margin: 0, color: "var(--primary)", display: "flex", alignItems: "center", gap: "8px" }}><Settings size={18}/> Substitution Rules</h4>
          
          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", color: "var(--text-muted)" }}>Home Bench Size</label>
              <input type="number" className="input-modern" value={benchSizeA} min={0} max={15} onChange={e => setBenchSizeA(Number(e.target.value))} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", color: "var(--text-muted)" }}>Away Bench Size</label>
              <input type="number" className="input-modern" value={benchSizeB} min={0} max={15} onChange={e => setBenchSizeB(Number(e.target.value))} />
            </div>
          </div>
          
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "bold", marginBottom: "8px", color: "var(--text-muted)" }}>Substitution Format</label>
            <select className="input-modern" value={subRules} onChange={e => setSubRules(e.target.value)}>
              <option value="Rolling (Unlimited)">Rolling (Unlimited) - Standard Turf</option>
              <option value="Traditional (3 Subs)">Traditional (3 Subs)</option>
              <option value="Traditional (5 Subs)">Traditional (5 Subs)</option>
              <option value="Futsal (Fly Subs)">Futsal (Fly Subs)</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><CalendarDays size={18} /> Date</label>
            <input type="date" className="input-modern" value={matchDate} onChange={e => setMatchDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><Clock size={18} /> Time</label>
            <input type="time" className="input-modern" value={matchTime} onChange={e => setMatchTime(e.target.value)} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>Match Type</label>
            <select className="input-modern" value={matchType} onChange={e => setMatchType(e.target.value)}>
              <option value="Casual Match">Casual Match</option>
              {tId && <option value="Tournament Match">Tournament Match</option>}
              {!tId && <option value="Friendly">Friendly</option>}
              {!tId && <option value="Practice Session">Practice Session</option>}
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>Match Resolution</label>
            <select className="input-modern" value={matchResolution} onChange={e => setMatchResolution(e.target.value)}>
              <option value="League / Friendly">League / Friendly</option>
              <option value="Knockout">Knockout</option>
            </select>
          </div>
          <div style={{ flex: 1, minWidth: "150px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>Location Type</label>
            <select className="input-modern" value={locationType} onChange={e => setLocationType(e.target.value)}>
              <option value="Turf">Turf</option>
              <option value="Ground">Ground</option>
              <option value="Indoor">Indoor</option>
              <option value="Outdoor">Outdoor</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><MapPin size={18} /> City</label>
            <select className="input-modern" value={city} onChange={e => setCity(e.target.value)}>
              {INDIAN_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ flex: 2 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}><MapPin size={18} /> Location</label>
            <input className="input-modern" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Community Field" />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "rgba(255,255,255,0.05)", padding: "15px", borderRadius: "8px" }}>
          <div>
            <span style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600" }}>
              {isPrivate ? <Lock size={18} color="var(--warning)" /> : <Unlock size={18} color="var(--accent)" />}
              Match Privacy
            </span>
            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "var(--text-muted)" }}>
              {isPrivate ? "Only invited players can join this match." : "Anyone in the marketplace can request to join."}
            </p>
          </div>
          <button 
            onClick={() => setIsPrivate(!isPrivate)}
            style={{ 
              background: isPrivate ? "var(--warning)" : "var(--accent)", color: "black", 
              border: "none", padding: "8px 16px", borderRadius: "20px", fontWeight: "700" 
            }}
          >
            {isPrivate ? "Private" : "Public"}
          </button>
        </div>
      </div>
      
      <button onClick={handleStart} className="btn-primary" style={{ width: "100%", padding: "15px", fontSize: "18px", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px", fontWeight: "800" }}>
        <Play size={20} /> Start Match Now
      </button>
    </div>
  );
}
