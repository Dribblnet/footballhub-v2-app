import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMatch } from "./MatchContext";
import ResponsiveView from "../../components/layout/ResponsiveView";
import MatchHistoryMobile from "./components/history/mobile/MatchHistoryMobile";
import MatchHistoryDesktop from "./components/history/desktop/MatchHistoryDesktop";
import MatchHistoryTablet from "./components/history/tablet/MatchHistoryTablet";

export default function MatchHistory() {
  const navigate = useNavigate();
  const { matches } = useMatch();
  
  const [filterFormat, setFilterFormat] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDuration, setFilterDuration] = useState("All");
  const [filterType, setFilterType] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [filterDate, setFilterDate] = useState("All");
  const [filterCity, setFilterCity] = useState("All");

  const filteredMatches = matches.filter(m => {
    if (filterStatus !== "All") {
      if (filterStatus === "Finished" && m.state !== "FINISHED") return false;
      if (filterStatus === "Live" && m.state !== "LIVE" && m.state !== "HT") return false;
      if (filterStatus === "Upcoming" && m.state !== "PRE_MATCH" && m.state !== "NOT_STARTED") return false;
      if (filterStatus === "Open" && m.state !== "NOT_STARTED") return false;
      if (filterStatus === "Full" && m.state !== "NOT_STARTED") return false;
    }
    
    if (filterFormat !== "All" && `${m.sizeA || m.teamA.players?.length || 5}v${m.sizeB || m.teamB.players?.length || 5}` !== filterFormat && filterFormat !== "Custom") return false;
    
    if (filterDuration !== "All") {
      if (filterDuration === "Custom") {
         if ([20, 25, 30, 35, 45, 50, 60, 70, 90, 120].includes(m.duration)) return false;
      } else {
         if (m.duration.toString() !== filterDuration) return false;
      }
    }
    
    if (filterType !== "All") {
      if (filterType === "Tournament" && !m.tournamentId && m.matchType !== "Tournament Match") return false;
      if (filterType === "Casual" && m.tournamentId && m.matchType !== "Casual Match") return false;
      if (filterType === "Friendly" && m.matchType !== "Friendly") return false;
      if (filterType === "Practice" && m.matchType !== "Practice Session") return false;
    }

    if (filterLocation !== "All" && m.locationType !== filterLocation && m.locationType !== undefined) return false;
    if (filterCity !== "All" && m.city !== filterCity && m.city !== undefined) return false;

    if (filterDate !== "All") {
      const matchD = new Date(m.date || new Date());
      const today = new Date();
      if (filterDate === "Today" && matchD.toDateString() !== today.toDateString()) return false;
      
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (filterDate === "Tomorrow" && matchD.toDateString() !== tomorrow.toDateString()) return false;
      
      if (filterDate === "This Week") {
         const diffTime = Math.abs(matchD - today);
         const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
         if (diffDays > 7) return false;
      }
    }
    
    return true;
  }).slice().reverse();

  const controllerProps = {
    navigate,
    filteredMatches,
    filterFormat, setFilterFormat,
    filterStatus, setFilterStatus,
    filterDuration, setFilterDuration,
    filterType, setFilterType,
    filterLocation, setFilterLocation,
    filterCity, setFilterCity,
    filterDate, setFilterDate
  };

  return (
    <ResponsiveView
      mobile={<MatchHistoryMobile {...controllerProps} />}
      tablet={<MatchHistoryTablet {...controllerProps} />}
      desktop={<MatchHistoryDesktop {...controllerProps} />}
    />
  );
}
