import { useEffect, useState } from "react";

export default function MatchTransitionOverlay({ type, teamAName, teamBName, scoreA, scoreB, onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // Stage 0: initial blank
    // Stage 1: texts animate in
    // Stage 2: wait
    // Stage 3: fade out
    const timers = [
      setTimeout(() => setStage(1), 100),
      setTimeout(() => setStage(2), 2000),
      setTimeout(() => setStage(3), 2800),
      setTimeout(() => { if (onComplete) onComplete(); }, 3500)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  let mainText = "";
  let subText = "";
  if (type === "KICKOFF") { mainText = "KICKOFF"; subText = "First Half Begins"; }
  if (type === "HALFTIME") { mainText = "HALF TIME"; subText = `${scoreA} - ${scoreB}`; }
  if (type === "FULLTIME") { mainText = "FULL TIME"; subText = `${scoreA} - ${scoreB}`; }
  if (type === "SECOND_HALF") { mainText = "SECOND HALF"; subText = "Underway"; }

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: stage === 3 ? "transparent" : "rgba(5, 7, 10, 0.8)",
      backdropFilter: stage === 3 ? "none" : "blur(20px)",
      zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      transition: "all 0.8s ease-in-out",
      pointerEvents: "none"
    }}>
      <div style={{
        position: "relative",
        background: "linear-gradient(135deg, rgba(37, 99, 235, 0.9) 0%, rgba(14, 17, 26, 0.95) 100%)",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8), inset 0 0 40px rgba(37, 99, 235, 0.3)",
        padding: "40px 80px",
        borderRadius: "16px",
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: stage >= 1 && stage < 3 ? "scale(1) translateY(0)" : stage === 3 ? "scale(1.1) translateY(-30px)" : "scale(0.8) translateY(50px)",
        opacity: stage >= 1 && stage < 3 ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        overflow: "hidden"
      }}>
        {/* Cinematic Glint */}
        <div style={{
          position: "absolute", top: "-50%", left: "-50%", width: "200%", height: "200%",
          background: "linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.1) 50%, transparent 55%)",
          transform: stage >= 1 ? "translateX(100%)" : "translateX(-100%)",
          transition: "transform 1.5s ease-in-out",
          pointerEvents: "none"
        }}></div>

        <h2 style={{
          fontSize: "56px",
          fontWeight: "900",
          margin: 0,
          fontFamily: "'Outfit', sans-serif",
          textTransform: "uppercase",
          letterSpacing: "6px",
          color: "white",
          textShadow: "0 5px 15px rgba(0,0,0,0.8), 0 0 20px rgba(37, 99, 235, 0.5)"
        }}>
          {mainText}
        </h2>
        
        <div style={{
          display: "flex", alignItems: "center", gap: "24px", marginTop: "15px",
          background: "rgba(0,0,0,0.4)", padding: "10px 30px", borderRadius: "10px",
          border: "1px solid rgba(255,255,255,0.05)"
        }}>
          <span style={{ fontSize: "24px", fontWeight: "800", color: "white", textTransform: "uppercase" }}>{teamAName}</span>
          <span style={{ fontSize: "28px", fontWeight: "900", color: "var(--warning)", textShadow: "0 0 10px rgba(245, 158, 11, 0.5)" }}>{subText}</span>
          <span style={{ fontSize: "24px", fontWeight: "800", color: "white", textTransform: "uppercase" }}>{teamBName}</span>
        </div>
      </div>
    </div>
  );
}
