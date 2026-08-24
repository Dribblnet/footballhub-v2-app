import React from 'react';
import { INDIA_LOCATIONS, STATES } from "../../../../utils/indiaLocations";
import { Link } from "react-router-dom";
import { Trophy, MapPin } from "lucide-react";
import CustomSelect from "../CustomSelect";

export default function StatsHubTablet({ 
  year, setYear,
  locationType, setLocationType,
  locationValue, setLocationValue,
  category, setCategory,
  availableYears,
  leaderboard,
  currentUser,
  isEligible
}) {
  return (
    <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "15px", textAlign: "center" }}>Leaderboard</h2>
      
      {!isEligible && (
        <div style={{ background: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.3)", padding: "16px", borderRadius: "12px", marginBottom: "24px", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Add your mobile number to appear on Dribbl leaderboards.</span>
          <Link to="/settings" className="btn-primary" style={{ padding: "8px 16px", fontSize: "14px", textDecoration: "none" }}>Add Mobile Number</Link>
        </div>
      )}

      {/* FILTERS */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap", justifyContent: "center" }}>
        <CustomSelect 
          value={year}
          onChange={(val) => setYear(val)}
          options={availableYears}
        />

        <CustomSelect 
          value={locationType}
          onChange={(val) => { setLocationType(val); setLocationValue(val === "India" ? "" : (val === "State" ? STATES[0] : INDIA_LOCATIONS[STATES[0]][0])); }}
          options={["India", "State", "City"]}
        />

        {locationType === "State" && (
          <CustomSelect 
            value={locationValue}
            onChange={(val) => setLocationValue(val)}
            options={STATES}
          />
        )}

        {locationType === "City" && (
          <CustomSelect 
            value={locationValue}
            onChange={(val) => setLocationValue(val)}
            options={Object.values(INDIA_LOCATIONS).flat().sort()}
          />
        )}

        <CustomSelect 
          value={category}
          onChange={(val) => setCategory(val)}
          options={["Most Goals", "Most Assists", "Most MOTM", "Most Saves"]}
        />
      </div>

      {/* LEADERBOARD LIST */}
      <div className="glass-panel" style={{ padding: "24px", minHeight: "400px" }}>
        {leaderboard.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text-muted)", padding: "40px 0" }}>
            <Trophy size={48} style={{ opacity: 0.2, marginBottom: "16px" }} />
            <p>No leaderboard data available yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {leaderboard.map((player) => {
              const isTop3 = player.rank <= 3;
              const isCurrentUser = currentUser && currentUser.id === player.id;
              
              let rankColor = "var(--text-muted)";
              if (player.rank === 1) rankColor = "#fbbf24";
              if (player.rank === 2) rankColor = "#94a3b8";
              if (player.rank === 3) rankColor = "#b45309";

              let statKey = "goals";
              if (category === "Most Assists") statKey = "assists";
              if (category === "Most MOTM") statKey = "motm";
              if (category === "Most Saves") statKey = "saves";

              return (
                <Link 
                  key={player.id} 
                  to={`/player/${player.username?.replace('@', '') || player.id}`}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "16px", borderRadius: "12px", textDecoration: "none",
                    background: isCurrentUser ? "rgba(37, 99, 235, 0.15)" : (isTop3 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)"),
                    border: isCurrentUser ? "1px solid var(--primary)" : "1px solid transparent",
                    transition: "background 0.2s"
                  }}
                  onMouseEnter={(e) => { if (!isCurrentUser) e.currentTarget.style.background = "rgba(255,255,255,0.08)"; }}
                  onMouseLeave={(e) => { if (!isCurrentUser) e.currentTarget.style.background = isTop3 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div style={{ width: "30px", textAlign: "center", fontSize: "18px", fontWeight: "700", color: rankColor }}>
                      #{player.rank}
                    </div>
                    
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "700" }}>
                      {player.avatar ? <img src={player.avatar} alt={player.name} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} /> : player.name.charAt(0)}
                    </div>
                    
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: "600", color: "white" }}>
                        {player.name} {isCurrentUser && <span style={{ fontSize: "12px", color: "var(--primary)", marginLeft: "8px" }}>(You)</span>}
                      </div>
                      {(player.city || player.state) && (
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px", marginTop: "4px" }}>
                          <MapPin size={12} /> {player.city ? `${player.city}, ` : ''}{player.state}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: "24px", fontWeight: "800", color: "white" }}>
                    {player[statKey]}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
