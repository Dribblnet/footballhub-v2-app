import ResponsiveView from "../../components/layout/ResponsiveView";
import PlayerProfileMobile from "./components/mobile/PlayerProfileMobile";
import PlayerProfileTablet from "./components/tablet/PlayerProfileTablet";
import PlayerProfileDesktop from "./components/desktop/PlayerProfileDesktop";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayers } from "../../context/PlayerContext";
import { useMatch } from "../match/MatchContext";
import { useAuth } from "../../context/AuthContext";
import { ArrowLeft, User, Crown, Filter, MessageSquare, Calendar, ShieldCheck, Footprints, MapPin, Swords } from "lucide-react";
import VerifiedBadge from "../../components/VerifiedBadge";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ResponsiveProfileHeader from "../../components/responsive/ResponsiveProfileHeader";
import { useToast } from "../../context/ToastContext";

const StatBox = ({ label, value, color }) => (
  <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px" }}>
    <span style={{ fontSize: "28px", fontWeight: "800", color: color || "var(--text-main)" }}>{value}</span>
    <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px", textAlign: "center" }}>{label}</span>
  </div>
);

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { players, getPlayerStats, evaluateAchievements, updatePlayerIdentity } = usePlayers();
  const { matches } = useMatch();
  const { user, updateUser } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { toast } = useToast();
  
  const [filterPosition, setFilterPosition] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const contextPlayer = players.find(p => p.id === id);
  const isOwnProfile = user?.id === id;
  const player = isOwnProfile && user ? { ...user, ...contextPlayer } : contextPlayer;

  if (!player) return <div style={{ padding: "40px", textAlign: "center" }}>Player not found in global records.</div>;

  const stats = getPlayerStats(player.id, filterPosition || null);
  const achievements = evaluateAchievements(player.id);
  const position = player.position || "Unassigned";

  const renderPositionStats = () => {
    if (position === "GK") {
      return (
        <>
          <StatBox label="Clean Sheets" value={stats.cleanSheets} color="var(--primary)" />
          <StatBox label="Saves" value={stats.saves} />
          <StatBox label="Goals Concd" value={stats.goalsConceded} color="var(--danger)" />
        </>
      );
    }
    if (position === "CB" || position === "LB" || position === "RB") {
      return (
        <>
          <StatBox label="Tackles" value={stats.tackles} color="var(--primary)" />
          <StatBox label="Interceptions" value={stats.interceptions} />
          <StatBox label="Aerial Wins" value={stats.aerialWins} />
        </>
      );
    }
    if (position === "CDM" || position === "CM" || position === "CAM") {
      return (
        <>
          <StatBox label="Assists" value={stats.assists} color="var(--accent)" />
          <StatBox label="Passes" value={stats.passes} />
          <StatBox label="Chances" value={stats.chancesCreated} />
        </>
      );
    }
    if (position === "ST" || position === "LW" || position === "RW") {
      return (
        <>
          <StatBox label="Goals" value={stats.goals} color="var(--primary)" />
          <StatBox label="Assists" value={stats.assists} color="var(--accent)" />
          <StatBox label="Highest in Match" value={stats.highestGoalsInMatch} />
        </>
      );
    }
    
    // Default Fallback
    return (
      <>
        <StatBox label="Goals" value={stats.goals} color="var(--primary)" />
        <StatBox label="Assists" value={stats.assists} color="var(--accent)" />
        <StatBox label="Clean Sheets" value={stats.cleanSheets} />
      </>
    );
  };

  const getCaptainWinRate = () => {
    if (stats.captainAppearances === 0) return 0;
    return Math.round((stats.captainWins / stats.captainAppearances) * 100);
  };

  // --- CHEMISTRY ENGINE ---
  let bestDuo = null;
  if (player) {
    const partners = {}; // { partnerId: { name, matchesTogether, winsTogether, combinedGoals } }

    matches.filter(m => m.state === "FINISHED").forEach(m => {
      const isTeamA = m.teamA.players.some(p => p.id === player.id);
      const isTeamB = m.teamB.players.some(p => p.id === player.id);
      
      if (!isTeamA && !isTeamB) return;
      
      const team = isTeamA ? m.teamA : m.teamB;
      const isWin = team.score > (isTeamA ? m.teamB.score : m.teamA.score);

      team.players.forEach(p => {
        if (p.id === player.id) return;
        if (!partners[p.id]) {
          partners[p.id] = { name: p.name, matchesTogether: 0, winsTogether: 0, combinedGoals: 0 };
        }
        partners[p.id].matchesTogether += 1;
        if (isWin) partners[p.id].winsTogether += 1;
      });

      // Check timeline for combined goals (goal by player + assist by partner, or vice versa)
      m.timeline.forEach(event => {
        if ((event.type === "GOAL" || event.type === "BANGER") && event.assistPlayerId) {
          if (event.playerId === player.id && partners[event.assistPlayerId]) {
            partners[event.assistPlayerId].combinedGoals += 1;
          } else if (event.assistPlayerId === player.id && partners[event.playerId]) {
            partners[event.playerId].combinedGoals += 1;
          }
        }
      });
    });

    let highestScore = -1;
    Object.values(partners).forEach(p => {
      // Simple heuristic for best duo: (matches * 1) + (wins * 2) + (combinedGoals * 3)
      const score = p.matchesTogether + (p.winsTogether * 2) + (p.combinedGoals * 3);
      if (score > highestScore && p.matchesTogether > 0) {
        highestScore = score;
        bestDuo = p;
      }
    });
  }


  const joinedDate = player?.createdAt ? new Date(player.createdAt) : null;
  const joinedDateFormatted = joinedDate ? joinedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Not available";
  const accountAgeDays = joinedDate ? Math.floor((Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)) : "N/A";
  const playerEmail = player?.email || null;
  const playerPhone = player?.phoneNumber || player?.phone || null;

  const handleSaveProfile = (updates) => {
    if (!isOwnProfile) return;
    
    updateUser(updates);
    updatePlayerIdentity(id, updates);
    
    setIsEditing(false);
    toast.success("Profile updated successfully!");
  };

  const [editForm, setEditForm] = useState({
    name: "", age: "", gender: "", position: "", country: "", city: ""
  });

  const openEditModal = () => {
    setEditForm({
      name: player.name || "",
      age: player.age || "",
      gender: player.gender || "",
      position: player.position || "",
      country: player.country || "",
      city: player.city || ""
    });
    setIsEditing(true);
  };

  const controllerProps = {
    player,
    navigate,
    filterPosition,
    setFilterPosition,
    stats,
    achievements,
    position,
    renderPositionStats,
    getCaptainWinRate,
    bestDuo,
    matches,
    isMobile,
    isOwnProfile,
    joinedDateFormatted,
    accountAgeDays,
    playerEmail,
    playerPhone,
    isEditing,
    setIsEditing,
    openEditModal,
    handleSaveProfile
  };

  return (
    <>
      <ResponsiveView
        mobile={<PlayerProfileMobile {...controllerProps} />}
        tablet={<PlayerProfileTablet {...controllerProps} />}
        desktop={<PlayerProfileDesktop {...controllerProps} />}
      />

      {isEditing && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.9)", zIndex: 1000, backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
        }}>
          <div className="glass-panel animate-scale-in" style={{ padding: "30px", maxWidth: "450px", width: "100%", border: "1px solid var(--primary)", background: "rgba(15, 23, 42, 0.95)", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ margin: "0 0 20px 0", fontSize: "24px", fontWeight: "800" }}>Edit Profile</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "25px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Name</label>
                <input type="text" className="input-modern" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} style={{ width: "100%", boxSizing: "border-box" }} />
              </div>
              
              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Age</label>
                  <input type="number" className="input-modern" value={editForm.age} onChange={e => setEditForm({...editForm, age: e.target.value})} style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Gender</label>
                  <select className="input-modern" value={editForm.gender} onChange={e => setEditForm({...editForm, gender: e.target.value})} style={{ width: "100%", boxSizing: "border-box" }}>
                    <option value="">Unspecified</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Position</label>
                <select className="input-modern" value={editForm.position} onChange={e => setEditForm({...editForm, position: e.target.value})} style={{ width: "100%", boxSizing: "border-box" }}>
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
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>City</label>
                  <input type="text" className="input-modern" value={editForm.city} onChange={e => setEditForm({...editForm, city: e.target.value})} style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "12px", textTransform: "uppercase" }}>Country</label>
                  <input type="text" className="input-modern" value={editForm.country} onChange={e => setEditForm({...editForm, country: e.target.value})} style={{ width: "100%", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ marginTop: "10px", padding: "10px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", fontSize: "12px", color: "var(--text-muted)" }}>
                Email and Phone can be updated in Settings.
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" onClick={() => setIsEditing(false)} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", boxShadow: "none" }}>Cancel</button>
              <button className="btn-primary" onClick={() => handleSaveProfile(editForm)} style={{ flex: 1 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
