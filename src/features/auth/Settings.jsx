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
import EditProfileModal from "./components/settings/modals/EditProfileModal";
import { EmailModal, PhoneModal, PasswordModal } from "./components/settings/modals/SecurityModals";
import FeedbackModal from "../../components/layout/FeedbackModal";

export default function Settings() {
  const { user, updateUser, logout } = useAuth();
  const { updatePlayerIdentity, getPlayerByPhone, getPlayerByEmail, players } = usePlayers();
  const navigate = useNavigate();
  const { toast } = useToast();

  const fullPlayer = players.find(p => p.id === user.id) || user;

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");

  const handleDeleteAccount = () => {
    if (deleteConfirmationText.toLowerCase() !== "delete my account") {
      return toast.error("Please type the confirmation phrase exactly.");
    }
    // Simulate backend deletion processing
    toast.success("Account deletion request submitted. Logging you out...");
    setTimeout(async () => {
      await logout();
      window.location.href = "/";
    }, 1500);
  };

  const controllerProps = {
    user,
    updateUser,
    logout,
    updatePlayerIdentity,
    getPlayerByPhone,
    getPlayerByEmail,
    players,
    navigate,
    toast,
    fullPlayer,
    setShowEditProfile,
    setShowEmailModal,
    setShowPhoneModal,
    setShowPasswordModal,
    setShowFeedbackModal,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteConfirmationText,
    setDeleteConfirmationText,
    handleDeleteAccount
  };

  return (
    <>
      <ResponsiveView
        mobile={<SettingsMobile {...controllerProps} />}
        tablet={<SettingsTablet {...controllerProps} />}
        desktop={<SettingsDesktop {...controllerProps} />}
      />
      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} />}
      {showEmailModal && <EmailModal onClose={() => setShowEmailModal(false)} />}
      {showPhoneModal && <PhoneModal onClose={() => setShowPhoneModal(false)} />}
      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
      {showFeedbackModal && <FeedbackModal onClose={() => setShowFeedbackModal(false)} />}
    </>
  );
}
