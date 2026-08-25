import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import { Search, MapPin, ShieldCheck, Target } from "lucide-react";
import { usePlayers } from "../../context/PlayerContext";
import VerifiedBadge from "../../components/VerifiedBadge";
import ProfilePreviewModal from "../../components/ProfilePreviewModal";

export default function GlobalPlayerSearch() {
  const { players } = usePlayers();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [previewPlayerId, setPreviewPlayerId] = useState(null);

  useEffect(() => {
    if (!query.trim()) {
      setTimeout(() => setResults([]), 0);
      return;
    }
    
    const q = query.toLowerCase();
    const filtered = players.filter(p => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.username && p.username.toLowerCase().includes(q)) ||
      (p.position && p.position.toLowerCase().includes(q)) ||
      (p.city && p.city.toLowerCase().includes(q)) ||
      (p.teamName && p.teamName.toLowerCase().includes(q)) ||
      (q === "verified" && (p.isVerified || p.emailVerified))
    ).slice(0, 50); // limit to 50 results for performance
    
    setTimeout(() => setResults(filtered), 0);
  }, [query, players]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", minHeight: "calc(100vh - 80px)" }}>
      <header style={{ marginBottom: "30px", textAlign: "center" }}>
        <h2 style={{ margin: "0 0 10px 0", fontSize: "32px", fontWeight: "900", letterSpacing: "-0.5px" }}>Player Search</h2>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>Find teammates, opponents, and friends in the Dribbl ecosystem.</p>
      </header>

      {/* SEARCH BAR */}
      <div style={{ position: "relative", marginBottom: "30px" }}>
        <div style={{ 
          display: "flex", alignItems: "center", background: "rgba(255,255,255,0.05)", 
          border: "1px solid var(--primary)", borderRadius: "16px", padding: "5px 20px",
          boxShadow: "0 10px 30px rgba(59, 130, 246, 0.1)"
        }}>
          <Search size={24} color="var(--primary)" />
          <input 
            type="text" 
            autoFocus
            placeholder="Search by name, @username, position, or type 'verified'..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ 
              flex: 1, background: "transparent", border: "none", color: "white", 
              padding: "15px", fontSize: "18px", outline: "none" 
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontWeight: "bold" }}
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* RESULTS */}
      {query && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px", color: "var(--text-muted)", fontSize: "14px" }}>
          <span>Found {results.length} players</span>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
          <Search size={48} style={{ opacity: 0.2, marginBottom: "20px" }} />
          <h3>No players found</h3>
          <p>Try searching for a different name or position.</p>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
        {results.map(player => (
          <div 
            key={player.id} 
            className="glass-panel" 
            style={{ 
              padding: "20px", display: "flex", alignItems: "center", gap: "15px", 
              cursor: "pointer", transition: "transform 0.2s, background 0.2s" 
            }}
            onClick={() => setPreviewPlayerId(player.id)}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(59, 130, 246, 0.05)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-card)"}
          >
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), #1e3a8a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", fontWeight: "bold", color: "white" }}>
              {(player.name || player.displayName || "P").charAt(0).toUpperCase()}
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <h3 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: "700", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", display: "flex", alignItems: "center", gap: "6px" }}>
                {player.name}
                {(player.isVerified || player.emailVerified) && (
                  <VerifiedBadge isEmailVerified={player.emailVerified || player.isVerified} isPhoneVerified={player.phoneVerified} size={16} showText={false} />
                )}
              </h3>
              <div style={{ color: "var(--primary)", fontSize: "13px", fontWeight: "600", marginBottom: "4px" }}>
                {player.username}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", color: "var(--text-muted)", fontSize: "12px" }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Target size={12} /> {player.position || "Unassigned"}</span>
                <span>•</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><ShieldCheck size={12} /> {player.teamName || "Free Agent"}</span>
                {player.city && (
                  <>
                    <span>•</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={12} /> {player.city}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {previewPlayerId && (
        <ProfilePreviewModal playerId={previewPlayerId} onClose={() => setPreviewPlayerId(null)} />
      )}
    </div>
  );
}
