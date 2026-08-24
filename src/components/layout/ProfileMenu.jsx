import { useNavigate } from "react-router-dom";
import { User, Activity, Users, Settings, Bell, LogOut } from "lucide-react";
import BrandLogo from "../BrandLogo";
import { useAuth } from "../../context/AuthContext";

export default function ProfileMenu({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Assuming there's a logout function in AuthContext

  if (!isOpen) return null;

  const menuItems = [
    { name: "My Stats", icon: <Activity size={16} />, action: () => navigate("/stats") },
    { name: "My Teams", icon: <Users size={16} />, action: () => navigate("/teams") },
    { name: "Settings", icon: <Settings size={16} />, action: () => navigate("/settings") },
    { name: "Notifications", icon: <Bell size={16} />, action: () => navigate("/notifications") },
  ];

  return (
    <div 
      style={{
        position: "absolute", top: "50px", right: "0", width: "220px",
        background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.8)", overflow: "hidden",
        animation: "slideDown 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        zIndex: 1000
      }}
    >
      <div style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "center" }}><BrandLogo size="small" /></div>
      <div style={{ padding: "8px" }}>
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => { item.action(); onClose(); }}
            style={{
              width: "100%", display: "flex", alignItems: "center", gap: "12px",
              padding: "10px 12px", background: "transparent", border: "none",
              color: "white", fontSize: "14px", fontWeight: "600", borderRadius: "8px",
              cursor: "pointer", textAlign: "left", transition: "background 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <span style={{ color: "var(--text-muted)" }}>{item.icon}</span>
            {item.name}
          </button>
        ))}
        
      </div>
    </div>
  );
}
