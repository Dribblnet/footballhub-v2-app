import React from "react";

export default function PitchMobile(props) {
  const {
    matchId,
    teamA,
    teamB,
    updatePlayerPosition,
    pitchRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    renderPlayer,
  } = props;

  return (
    <div
      ref={pitchRef}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "600px",
        aspectRatio: "3/4",
        margin: "0 auto",
        backgroundColor: "#2e7d32",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(255,255,255,0.05) 40px, rgba(255,255,255,0.05) 80px)",
        border: "2px solid rgba(255,255,255,0.6)",
        overflow: "hidden",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        borderRadius: "8px",
        flexShrink: 0
      }}
    >
      {/* Halfway line */}
      <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "2px", backgroundColor: "rgba(255,255,255,0.6)", transform: "translateY(-50%)" }} />
      {/* Center circle */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "120px", height: "120px", border: "2px solid rgba(255,255,255,0.6)", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />
      {/* Center spot */}
      <div style={{ position: "absolute", top: "50%", left: "50%", width: "6px", height: "6px", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: "50%", transform: "translate(-50%, -50%)" }} />

      {/* Penalty boxes */}
      <div style={{ position: "absolute", top: 0, left: "20%", width: "60%", height: "120px", border: "2px solid rgba(255,255,255,0.6)", borderTop: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "20%", width: "60%", height: "120px", border: "2px solid rgba(255,255,255,0.6)", borderBottom: "none" }} />
      
      {/* 6-yard boxes */}
      <div style={{ position: "absolute", top: 0, left: "35%", width: "30%", height: "40px", border: "2px solid rgba(255,255,255,0.6)", borderTop: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: "35%", width: "30%", height: "40px", border: "2px solid rgba(255,255,255,0.6)", borderBottom: "none" }} />
      
      {/* Penalty arcs */}
      <div style={{ position: "absolute", top: "120px", left: "50%", width: "80px", height: "40px", border: "2px solid rgba(255,255,255,0.6)", borderTop: "none", borderRadius: "0 0 80px 80px", transform: "translateX(-50%)" }} />
      <div style={{ position: "absolute", bottom: "120px", left: "50%", width: "80px", height: "40px", border: "2px solid rgba(255,255,255,0.6)", borderBottom: "none", borderRadius: "80px 80px 0 0", transform: "translateX(-50%)" }} />

      {teamA.players.map(p => renderPlayer(p, "var(--primary)"))}
      {teamB.players.map(p => renderPlayer(p, "var(--warning)"))}
    </div>
  );
}
