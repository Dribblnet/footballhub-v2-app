import ResponsiveView from "../../components/layout/ResponsiveView";
import TeamProfileMobile from "./components/mobile/TeamProfileMobile";
import TeamProfileTablet from "./components/tablet/TeamProfileTablet";
import TeamProfileDesktop from "./components/desktop/TeamProfileDesktop";
import { useParams, useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamContext";
import { ArrowLeft, Shield, Swords, Trophy } from "lucide-react";
import { useMediaQuery } from "../../hooks/useMediaQuery";

const StatBox = ({ label, value, color }) => (
  <div className="glass-panel" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 10px" }}>
    <span style={{ fontSize: "28px", fontWeight: "800", color: color || "var(--text-main)" }}>{value}</span>
    <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginTop: "5px" }}>{label}</span>
  </div>
);

export default function TeamProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { teams } = useTeams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const team = teams.find(t => t.id === id);

  if (!team) return <div style={{ padding: "40px", textAlign: "center" }}>Team not found in global records.</div>;

  const { stats, trophies = [] } = team;

  // Calculate Biggest Rival
  let biggestRival = null;
  let rivalStats = { opponent: "", matches: 0, wins: 0, draws: 0, losses: 0 };
  
  if (team.matchHistory.length > 0) {
    const opponents = {};
    team.matchHistory.forEach(h => {
      if (!opponents[h.opponent]) opponents[h.opponent] = { matches: 0, wins: 0, draws: 0, losses: 0 };
      opponents[h.opponent].matches += 1;
      if (h.result === "W") opponents[h.opponent].wins += 1;
      else if (h.result === "D") opponents[h.opponent].draws += 1;
      else opponents[h.opponent].losses += 1;
    });

    let maxMatches = 0;
    for (const [opp, data] of Object.entries(opponents)) {
      if (data.matches > maxMatches) {
        maxMatches = data.matches;
        rivalStats = { opponent: opp, ...data };
        biggestRival = opp;
      }
    }
  }


  const controllerProps = {
    team,
    stats,
    trophies,
    biggestRival,
    rivalStats,
    navigate,
    isMobile
  };

  return (
    <ResponsiveView
      mobile={<TeamProfileMobile {...controllerProps} />}
      tablet={<TeamProfileTablet {...controllerProps} />}
      desktop={<TeamProfileDesktop {...controllerProps} />}
    />
  );
}
