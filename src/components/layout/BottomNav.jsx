import { useNavigate, useLocation } from "react-router-dom";
import { Trophy, Activity, Users, Home } from "lucide-react";
import BrandLogo from "../BrandLogo";

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { label: "Home", icon: <Home size={24} />, path: "/" },
    { label: "Matches", icon: <Trophy size={24} />, path: "/history" },
    { label: "Market", icon: <Users size={24} />, path: "/marketplace" },
    { label: "Stats", icon: <Activity size={24} />, path: "/stats" },
  ];

  return (
    <nav className="mobile-only" style={{ 
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(15, 23, 42, 0.95)", backdropFilter: "blur(10px)",
      borderTop: "1px solid var(--border)",
      display: "flex", justifyContent: "space-around", alignItems: "center",
      padding: "15px 5px", paddingBottom: "max(15px, env(safe-area-inset-bottom))"
    }}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
        return (
          <button 
            key={item.label}
            onClick={() => navigate(item.path)}
            style={{ 
              background: "transparent", border: "none", 
              display: "flex", flexDirection: "column", alignItems: "center", gap: "6px",
              color: isActive ? "var(--primary)" : "var(--text-muted)",
              cursor: "pointer", flex: 1, padding: "8px 0"
            }}
          >
            {item.icon}
            <span style={{ fontSize: "10px", fontWeight: isActive ? "700" : "500" }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
