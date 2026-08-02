import ResponsiveView from "../../components/layout/ResponsiveView";
import SettingsMobile from "./components/settings/mobile/SettingsMobile";
import SettingsTablet from "./components/settings/tablet/SettingsTablet";
import SettingsDesktop from "./components/settings/desktop/SettingsDesktop";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePlayers } from "../../context/PlayerContext";
import { ArrowLeft, Phone, Mail, Link as LinkIcon, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import VerifiedBadge from "../../components/VerifiedBadge";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { updatePlayerIdentity, getPlayerByPhone, getPlayerByEmail, players } = usePlayers();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fullPlayer = players.find(p => p.id === user.id) || user;

  const [linkModal, setLinkModal] = useState(null); // 'PHONE' or 'EMAIL'
  const [linkInput, setLinkInput] = useState("");
  const [linkCountryCode, setLinkCountryCode] = useState("+91");

  const handleLinkAccount = () => {
    if (linkModal === "PHONE") {
      if (linkInput.length < 5) return toast.error("Enter valid phone");
      const fullPhone = `${linkCountryCode} ${linkInput}`;
      if (getPlayerByPhone(fullPhone)) return toast.error("This phone is already registered to another player.");
      updatePlayerIdentity(user.id, { phone: fullPhone, phoneNumber: fullPhone, phoneVerified: true, isVerified: true });
      updateUser({ phone: fullPhone, phoneNumber: fullPhone, phoneVerified: true, isVerified: true });
    } else if (linkModal === "EMAIL") {
      if (!linkInput.includes("@")) return toast.error("Enter valid email");
      if (getPlayerByEmail(linkInput)) return toast.error("This email is already registered to another player.");
      updatePlayerIdentity(user.id, { email: linkInput, emailVerified: true, isVerified: true });
      updateUser({ email: linkInput, emailVerified: true, isVerified: true });
    }
    setLinkModal(null);
    setLinkInput("");
    toast.success("Account linked successfully! Your identities are now merged.");
  };


  const controllerProps = {
    user,
    updateUser,
    updatePlayerIdentity,
    getPlayerByPhone,
    getPlayerByEmail,
    players,
    navigate,
    toast,
    fullPlayer,
    linkModal,
    setLinkModal,
    linkInput,
    setLinkInput,
    linkCountryCode,
    setLinkCountryCode,
    handleLinkAccount
  };

  return (
    <ResponsiveView
      mobile={<SettingsMobile {...controllerProps} />}
      tablet={<SettingsTablet {...controllerProps} />}
      desktop={<SettingsDesktop {...controllerProps} />}
    />
  );
}
