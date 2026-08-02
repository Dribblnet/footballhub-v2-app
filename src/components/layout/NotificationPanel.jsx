import ResponsiveView from "./ResponsiveView";
import NotificationPanelMobile from "./notifications/mobile/NotificationPanelMobile";
import NotificationPanelTablet from "./notifications/tablet/NotificationPanelTablet";
import NotificationPanelDesktop from "./notifications/desktop/NotificationPanelDesktop";
import { Bell, BellOff } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function NotificationPanel({ isOpen }) {
  const { notifications, markAllRead, clearAll, notificationsEnabled, setNotificationsEnabled } = useNotifications();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isOpen) return null;

  const containerStyle = isMobile ? {
    position: "fixed", bottom: "70px", left: 0, right: 0, width: "100%",
    background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255,255,255,0.1)", borderTopLeftRadius: "24px", borderTopRightRadius: "24px",
    boxShadow: "0 -20px 40px rgba(0,0,0,0.8)", overflow: "hidden",
    animation: "slideUp 0.3s ease-out forwards",
    zIndex: 1000
  } : {
    position: "absolute", top: "60px", right: "20px", width: "calc(100vw - 40px)", maxWidth: "350px",
    background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.8)", overflow: "hidden",
    animation: "slideDown 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
    zIndex: 1000
  };


  const controllerProps = {
    isOpen,
    notifications,
    markAllRead,
    clearAll,
    notificationsEnabled,
    setNotificationsEnabled,
    isMobile,
    containerStyle
  };

  return (
    <ResponsiveView
      mobile={<NotificationPanelMobile {...controllerProps} />}
      tablet={<NotificationPanelTablet {...controllerProps} />}
      desktop={<NotificationPanelDesktop {...controllerProps} />}
    />
  );
}
