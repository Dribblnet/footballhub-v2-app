import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, MapPin, Trophy, Users, Settings, User, BarChart2, Shield } from "lucide-react";
import { useMatch } from "../../features/match/MatchContext";
import { useMarket } from "../../features/marketplace/MarketContext";
import { useTournaments } from "../../context/TournamentContext";
import { useTeams } from "../../context/TeamContext";
import { usePlayers } from "../../context/PlayerContext";

export default function GlobalSearch({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isOpen && onClose) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const { matches } = useMatch();
  const { requests } = useMarket();
  const { tournaments } = useTournaments();
  const { teams } = useTeams();
  const { players } = usePlayers();

  const baseLinks = [
    { name: "Matches Hub", icon: <MapPin size={16} />, path: "/history" },
    { name: "Marketplace", icon: <User size={16} />, path: "/marketplace" },
    { name: "Tournaments", icon: <Trophy size={16} />, path: "/tournaments" },
    { name: "Settings", icon: <Settings size={16} />, path: "/policies" },
    { name: "Leaderboards", icon: <BarChart2 size={16} />, path: "/stats" },
  ];

  const filteredResults = (() => {
    if (!query) return baseLinks;
    
    const q = query.toLowerCase();
    const results = [];

    baseLinks.forEach(link => {
      if (link.name.toLowerCase().includes(q)) results.push({ ...link, type: "Page" });
    });

    matches?.forEach(m => {
      if (m.teamA?.name?.toLowerCase().includes(q) || m.teamB?.name?.toLowerCase().includes(q) || m.city?.toLowerCase().includes(q)) {
        results.push({ name: `${m.teamA?.name} vs ${m.teamB?.name}`, icon: <Shield size={16}/>, path: `/match/${m.id}`, type: "Match" });
      }
    });

    requests?.forEach(r => {
      if (r.type?.toLowerCase().includes(q) || r.city?.toLowerCase().includes(q) || r.turf?.toLowerCase().includes(q)) {
        results.push({ name: `${r.type} in ${r.city}`, icon: <MapPin size={16}/>, path: `/marketplace`, type: "Request" });
      }
    });

    tournaments?.forEach(t => {
      if (t.name?.toLowerCase().includes(q) || t.location?.toLowerCase().includes(q)) {
        results.push({ name: t.name, icon: <Trophy size={16}/>, path: `/tournament/${t.id}`, type: "Tournament" });
      }
    });

    teams?.forEach(t => {
      if (t.name?.toLowerCase().includes(q)) {
        results.push({ name: t.name, icon: <Users size={16}/>, path: `/team/${t.id}`, type: "Team" });
      }
    });

    players?.forEach(p => {
      if (p.name?.toLowerCase().includes(q) || p.phone?.includes(q)) {
        results.push({ name: p.name, icon: <User size={16}/>, path: `/player/${p.id}`, type: "Player" });
      }
    });

    return results.slice(0, 15);
  })();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredResults.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredResults.length) % Math.max(1, filteredResults.length));
      } else if (e.key === "Enter" && filteredResults.length > 0) {
        e.preventDefault();
        navigate(filteredResults[selectedIndex].path);
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, filteredResults, navigate, onClose]);

  const modalRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      // Check if click is outside modal AND not on the search open button
      if (isOpen && modalRef.current && !modalRef.current.contains(e.target) && !e.target.closest('button[data-search-btn]')) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", justifyContent: "center", alignItems: "flex-start",
        paddingTop: "15vh", zIndex: 1000, pointerEvents: "none"
      }}
    >
      <div 
        ref={modalRef}
        style={{
          width: "90%", maxWidth: "600px",
          background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px", overflow: "hidden",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.7)",
          animation: "slideDown 0.2s ease-out forwards", pointerEvents: "auto"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Search size={20} color="var(--text-muted)" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search teams, players, tournaments, matches..."
            value={query}
            onChange={e => { setQuery(e.target.value); setSelectedIndex(0); }}
            style={{
              flex: 1, background: "transparent", border: "none", color: "white",
              fontSize: "18px", marginLeft: "16px", outline: "none"
            }}
          />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", background: "rgba(255,255,255,0.1)", padding: "4px 8px", borderRadius: "4px" }}>ESC</span>
        </div>
        
        <div style={{ padding: "8px", maxHeight: "400px", overflowY: "auto" }}>
          {filteredResults.length > 0 ? (
            filteredResults.map((link, index) => (
              <div 
                key={`${link.type}-${link.name}-${index}`}
                onClick={() => { navigate(link.path); onClose(); }}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px", borderRadius: "8px", cursor: "pointer",
                  background: index === selectedIndex ? "rgba(59, 130, 246, 0.15)" : "transparent",
                  color: index === selectedIndex ? "white" : "var(--text-muted)",
                  borderLeft: index === selectedIndex ? "3px solid var(--primary)" : "3px solid transparent",
                  transition: "all 0.1s ease"
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                {link.icon}
                <span style={{ fontWeight: index === selectedIndex ? "600" : "400" }}>{link.name}</span>
                {link.type && <span style={{ marginLeft: "auto", fontSize: "11px", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px" }}>{link.type}</span>}
              </div>
            ))
          ) : (
            <div style={{ padding: "32px", textAlign: "center", color: "var(--text-muted)" }}>
              <Search size={32} style={{ opacity: 0.5, marginBottom: "16px" }} />
              <p>No results found for "{query}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
