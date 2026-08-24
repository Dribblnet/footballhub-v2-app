import ResponsiveView from "../../components/layout/ResponsiveView";
import MarketplaceMobile from "./components/mobile/MarketplaceMobile";
import MarketplaceTablet from "./components/tablet/MarketplaceTablet";
import MarketplaceDesktop from "./components/desktop/MarketplaceDesktop";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {  Plus, MapPin,   Target, MessageSquare, Shield, Clock, Trash2 } from "lucide-react";
import { useMarket } from "./MarketContext";
import { useMessages } from "../../context/MessageContext";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { usePlayers } from "../../context/PlayerContext";
import VerifiedBadge from "../../components/VerifiedBadge";
import { INDIAN_CITIES } from "../../core/cities";
const POSITIONS = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LW", "RW", "ST"];



export default function Marketplace() {
  const navigate = useNavigate();
  const { requests, addRequest, deleteRequest } = useMarket();
  const { unreadMessagesCount } = useMessages();
  const { toast } = useToast();
  const { user } = useAuth();
  const { players } = usePlayers();
  const [isCreating, setIsCreating] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [filterCity, setFilterCity] = useState("All");
  const [filterFormat, setFilterFormat] = useState("All");
  const [filterSkill, setFilterSkill] = useState("All");
  const [filterSurface, setFilterSurface] = useState("All");
  const [filterEnvironment, setFilterEnvironment] = useState("All");
  const [filterType, setFilterType] = useState("All");
  
  // Form State
  const [formType, setFormType] = useState("Looking for Players");
  const [formMatchType, setFormMatchType] = useState("5v5");
  const [formSkill, setFormSkill] = useState("Casual");
  const [formTurf, setFormTurf] = useState("");
  const [formCity, setFormCity] = useState("Mumbai");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formDuration, setFormDuration] = useState(60);
  const [formPositions, setFormPositions] = useState([]);
  const [formPlayersNeeded, setFormPlayersNeeded] = useState(1);
  
  // Advanced Match Filters
  const [formEnvironment, setFormEnvironment] = useState("Outdoor");
  const [formSurface, setFormSurface] = useState("Turf");
  const [formRefNeeded, setFormRefNeeded] = useState("No");
  const [formSubsAllowed, setFormSubsAllowed] = useState("Yes");
  
  // Tournament specific fields
  const [formEntryFee, setFormEntryFee] = useState("");
  const [formPrizeInfo, setFormPrizeInfo] = useState("");

  const togglePosition = (pos) => {
    if (formPositions.includes(pos)) {
      setFormPositions(formPositions.filter(p => p !== pos));
    } else {
      setFormPositions([...formPositions, pos]);
    }
  };

  const handleSubmit = () => {
    if (!formTurf || !formDate || !formTime) {
      toast.error("Please fill out location, date, and time.");
      return;
    }
    
    const activeRequestsCount = requests.filter(req => req.author === (user?.name || "You")).length;
    if (activeRequestsCount >= 3) {
      toast.error("Maximum active requests reached.");
      return;
    }
    
    addRequest({
      id: Date.now(),
      type: formType,
      matchType: formMatchType,
      skillLevel: formSkill,
      positions: formType === "Need Goalkeeper" ? ["GK"] : formPositions,
      playersNeeded: formPlayersNeeded,
      turf: formTurf,
      city: formCity,
      date: formDate,
      time: formTime,
      duration: formDuration,
      author: user?.name || "You",
      authorId: user?.id || "local-user",
      isTournament: formType === "Tournament Ad",
      entryFee: formType === "Tournament Ad" ? formEntryFee : undefined,
      prizeInfo: formType === "Tournament Ad" ? formPrizeInfo : undefined,
      refAvailable: formRefNeeded,
      environment: formEnvironment,
      surface: formSurface,
      subsAllowed: formSubsAllowed
    });
    
    toast.success("Request posted successfully!");
    setIsCreating(false);
    
    setFilterType("All");
    setFilterCity(formCity);
    setFilterFormat(formMatchType);
    setFilterSkill(formSkill);
    setFilterSurface(formSurface);
    setFilterEnvironment(formEnvironment);
    
    // Reset basic form fields
    setFormPositions([]);
    setFormTurf("");
    setFormDate("");
    setFormTime("");
  };

  const filteredRequests = requests.filter(req => {
    if (filterType !== "All") {
       if (filterType === "Requests" && req.type !== "Looking for Players" && req.type !== "Looking for Goalkeeper" && req.type !== "Looking for Opponent" && req.type !== "Looking for Referee" && req.type !== "Looking for Coach" && req.type !== "Looking for Friendly Match") return false;
       if (filterType === "Tournaments" && req.type !== "Tournament Ad") return false;
       if (filterType === "Teams Looking For Players" && req.type !== "Looking for Players") return false;
       if (filterType === "Players Looking For Teams" && req.type !== "Looking To Join") return false;
    }
    if (filterCity !== "All" && req.city !== filterCity) return false;
    if (filterFormat !== "All" && req.matchType !== filterFormat) return false;
    if (filterSkill !== "All" && req.skillLevel !== filterSkill) return false;
    if (filterSurface !== "All" && req.surface !== filterSurface && req.surface !== undefined) return false;
    if (filterEnvironment !== "All" && req.environment !== filterEnvironment && req.environment !== undefined) return false;
    return true;
  });


  const controllerProps = {
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
    filteredRequests
  };

  return (
    <ResponsiveView
      mobile={<MarketplaceMobile {...controllerProps} />}
      tablet={<MarketplaceTablet {...controllerProps} />}
      desktop={<MarketplaceDesktop {...controllerProps} />}
    />
  );
}
