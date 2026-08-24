import { useState, useMemo } from "react";
import ResponsiveView from "../../components/layout/ResponsiveView";
import StatsHubDesktop from "./components/desktop/StatsHubDesktop";
import StatsHubTablet from "./components/tablet/StatsHubTablet";
import StatsHubMobile from "./components/mobile/StatsHubMobile";
import { useLeaderboard } from "./useLeaderboard";
import { useAuth } from "../../context/AuthContext";
import { usePlayers } from "../../context/PlayerContext";
import { useMatch } from "../match/MatchContext";

export default function StatsHub() {
  const [year, setYear] = useState("2026");
  const [locationType, setLocationType] = useState("India"); // India, State, City
  const [locationValue, setLocationValue] = useState("");
  const [category, setCategory] = useState("Most Goals");
  
  const { user } = useAuth();
  const { players } = usePlayers();
  const { matches } = useMatch();

  const currentUser = players.find(p => p.id === user?.id) || user;
  const isEligible = currentUser && (currentUser.phone || currentUser.phoneNumber);

  const availableYears = useMemo(() => {
    const years = new Set(["2026"]);
    matches.forEach(m => {
      if (m.date) years.add(new Date(m.date).getFullYear().toString());
    });
    return Array.from(years).sort((a,b) => b.localeCompare(a));
  }, [matches]);

  const leaderboard = useLeaderboard(year, locationType, locationValue, category);

  const controllerProps = {
    year, setYear,
    locationType, setLocationType,
    locationValue, setLocationValue,
    category, setCategory,
    availableYears,
    leaderboard,
    currentUser,
    isEligible
  };

  return (
    <ResponsiveView
      desktop={<StatsHubDesktop {...controllerProps} />}
      tablet={<StatsHubTablet {...controllerProps} />}
      mobile={<StatsHubMobile {...controllerProps} />}
    />
  );
}
