import ResponsiveView from "../../components/layout/ResponsiveView";
import CreateTeamMobile from "./components/create/mobile/CreateTeamMobile";
import CreateTeamTablet from "./components/create/tablet/CreateTeamTablet";
import CreateTeamDesktop from "./components/create/desktop/CreateTeamDesktop";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTeams } from "../../context/TeamContext";
import { Shield, ArrowLeft, PaintBucket, MapPin, AlignLeft } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function CreateTeam() {
  const navigate = useNavigate();
  const { createTeam } = useTeams();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [color, setColor] = useState("#3B82F6"); // Default primary blue
  const [turf, setTurf] = useState("");

  const handleCreate = () => {
    if (!name.trim()) {
      toast.error("Team name is required.");
      return;
    }
    const id = createTeam(name, bio, color, turf);
    navigate(`/team/${id}`);
  };


  const controllerProps = {
    navigate,
    createTeam,
    toast,
    name,
    setName,
    bio,
    setBio,
    color,
    setColor,
    turf,
    setTurf,
    handleCreate
  };

  return (
    <ResponsiveView
      mobile={<CreateTeamMobile {...controllerProps} />}
      tablet={<CreateTeamTablet {...controllerProps} />}
      desktop={<CreateTeamDesktop {...controllerProps} />}
    />
  );
}
