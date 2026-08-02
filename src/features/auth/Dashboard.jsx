import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMatch } from "../match/MatchContext";
import { usePlayers } from "../../context/PlayerContext";
import { useNavigate } from "react-router-dom";
import ResponsiveView from "../../components/layout/ResponsiveView";
import DashboardMobile from "./components/mobile/DashboardMobile";
import DashboardDesktop from "./components/desktop/DashboardDesktop";
import DashboardTablet from "./components/tablet/DashboardTablet";

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const { matches } = useMatch();
  const { players, getPlayerStats } = usePlayers();
  const navigate = useNavigate();

  const [setupPosition, setSetupPosition] = useState("GK");

  if (!user) return null;

  const fullPlayer = players.find(p => p.id === user.id) || user;
  const stats = getPlayerStats(user.id);

  const handleCreateMatch = () => {
    navigate("/create-match");
  };

  const handleTournaments = () => {
    navigate("/tournaments"); // Now fully unlocked
  };

  const activeMatches = matches.filter(m => m.state !== "FINISHED");
  const finishedMatches = matches.filter(m => m.state === "FINISHED");

  const controllerProps = {
    user,
    fullPlayer,
    stats,
    setupPosition,
    setSetupPosition,
    updateUser,
    handleCreateMatch,
    handleTournaments,
    activeMatches,
    finishedMatches,
    navigate
  };

  return (
    <ResponsiveView
      mobile={<DashboardMobile {...controllerProps} />}
      tablet={<DashboardTablet {...controllerProps} />}
      desktop={<DashboardDesktop {...controllerProps} />}
    />
  );
}
