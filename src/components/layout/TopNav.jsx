import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User, Bell, Search } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import NotificationPanel from "./NotificationPanel";
import ProfileMenu from "./ProfileMenu";
import { useNotifications } from "../../context/NotificationContext";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import BrandLogo from "../BrandLogo";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const isMobile = useMediaQuery("(max-width: 768px)");
  
  const { unreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
    return {
      background: "transparent", border: "none", cursor: "pointer",
      color: isActive ? "var(--primary)" : "white",
      fontWeight: isActive ? "800" : "600",
      borderBottom: isActive ? "2px solid var(--primary)" : "2px solid transparent",
      paddingBottom: "4px",
      textShadow: isActive ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
      transition: "all 0.2s"
    };
  };

  return (
    <header style={{ 
      position: "sticky", top: 0, zIndex: 50, 
      background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(10px)",
      borderBottom: "1px solid var(--border)",
      display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap",
      padding: "15px 20px"
    }}>
      {/* Left Area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <BrandLogo size="header" />
      </div>
      
      {/* Center Navigation (Desktop Only) */}
      <div className="desktop-only" style={{ flex: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", margin: "0 40px" }}>
        <button onClick={() => navigate("/")} style={getLinkStyle("/")}>Home</button>
        <button onClick={() => navigate("/create-match")} style={getLinkStyle("/create-match")}>Create Match</button>
        <button onClick={() => navigate("/search")} style={getLinkStyle("/search")}>Players</button>
        <button onClick={() => navigate("/leaderboards")} style={getLinkStyle("/leaderboards")}>Leaderboard</button>
        <button onClick={() => navigate("/tournaments")} style={getLinkStyle("/tournaments")}>Tournaments</button>
      </div>

      {/* Right Area */}
      <div ref={navRef} style={{ flex: 1, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "20px", position: "relative", zIndex: 10 }}>
        
        <button 
          data-search-btn
          onClick={() => setSearchOpen(true)}
          style={{ background: "transparent", border: "none", color: "var(--text-muted)", display: "flex", alignItems: "center", cursor: "pointer" }}
        >
          <Search size={20} />
        </button>
        
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); setSearchOpen(false); if (!notificationsOpen) markAllRead(); }}
            style={{ background: "transparent", border: "none", color: "var(--text-muted)", display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            <Bell size={20} />
            {unreadCount > 0 && <div style={{ position: "absolute", top: -2, right: -2, width: 8, height: 8, borderRadius: "50%", background: "var(--primary)" }}></div>}
          </button>
          <NotificationPanel isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        </div>
        
        <div style={{ position: "relative" }}>
          <div 
            onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); setSearchOpen(false); }}
            style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-card)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <User size={18} color="white" />
          </div>
          <ProfileMenu isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
        </div>
      </div>

      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
