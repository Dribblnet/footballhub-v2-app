import ResponsiveView from "./ResponsiveView";
import NotificationPanelMobile from "./notifications/mobile/NotificationPanelMobile";
import NotificationPanelTablet from "./notifications/tablet/NotificationPanelTablet";
import NotificationPanelDesktop from "./notifications/desktop/NotificationPanelDesktop";
import { Bell, BellOff } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { createPortal } from "react-dom";

export default function NotificationPanel({ isOpen }) {
  const { notifications, markAllRead, clearAll, notificationsEnabled, setNotificationsEnabled } = useNotifications();
  const isMobile = useMediaQuery("(max-width: 768px)");

  if (!isOpen) return null;

  const containerStyle = isMobile ? {
    position: "fixed", top: "70px", left: "50%", transform: "translateX(-50%)", 
    width: "calc(100vw - 32px)", maxWidth: "400px", maxHeight: "calc(100vh - 100px)",
    display: "flex", flexDirection: "column",
    background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.8)", overflow: "hidden",
    animation: "slideDown 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
    zIndex: 1000, boxSizing: "border-box"
  } : {
    position: "absolute", top: "60px", right: "20px", width: "calc(100vw - 40px)", maxWidth: "350px", maxHeight: "calc(100vh - 80px)",
    display: "flex", flexDirection: "column",
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

  const panel = (
    <ResponsiveView
      mobile={<NotificationPanelMobile {...controllerProps} />}
      tablet={<NotificationPanelTablet {...controllerProps} />}
      desktop={<NotificationPanelDesktop {...controllerProps} />}
    />
  );

  return isMobile ? createPortal(panel, document.body) : panel;
}
