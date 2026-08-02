import ResponsiveView from "../../components/layout/ResponsiveView";
import PlayerProfileMobile from "./components/mobile/PlayerProfileMobile";
import PlayerProfileTablet from "./components/tablet/PlayerProfileTablet";
import PlayerProfileDesktop from "./components/desktop/PlayerProfileDesktop";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { usePlayers } from "../../context/PlayerContext";
import { useMatch } from "../match/MatchContext";
import { ArrowLeft, User, Crown, Filter, MessageSquare, Calendar, ShieldCheck, Footprints, MapPin, Swords } from "lucide-react";
import VerifiedBadge from "../../components/VerifiedBadge";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import ResponsiveProfileHeader from "../../components/responsive/ResponsiveProfileHeader";

const StatBox = ({ label, value, color }) => (
  <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px" }}>
    <span style={{ fontSize: "28px", fontWeight: "800", color: color || "var(--text-main)" }}>{value}</span>
    <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px", textAlign: "center" }}>{label}</span>
  </div>
);

export default function PlayerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { players, getPlayerStats, evaluateAchievements } = usePlayers();
  const { matches } = useMatch();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const [filterPosition, setFilterPosition] = useState("");

  const player = players.find(p => p.id === id);

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
    isMobile
  };

  return (
    <ResponsiveView
      mobile={<PlayerProfileMobile {...controllerProps} />}
      tablet={<PlayerProfileTablet {...controllerProps} />}
      desktop={<PlayerProfileDesktop {...controllerProps} />}
    />
  );
}
