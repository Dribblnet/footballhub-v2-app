import { useEffect, useState } from "react";
import BrandLogo from "../BrandLogo";

const IMAGES = {
  stadium: "https://images.unsplash.com/photo-1518605368461-1e1e38ce8058?auto=format&fit=crop&q=80",
  boots: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80",
  run: "https://images.unsplash.com/photo-1431324155629-1a6d0a6ebbfc?auto=format&fit=crop&q=80",
  strike: "https://images.unsplash.com/photo-1508344928928-7137b29de216?auto=format&fit=crop&q=80",
  dive: "https://images.unsplash.com/photo-1518659616327-0da5dfd5a083?auto=format&fit=crop&q=80"
};

export default function SplashScreen({ onFinish }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    // 0: Darkness (0s - 0.5s)
    // 6: Resolve & Typography (0.5s - 2.5s)
    // 7: Fade Out (2.5s - 3.2s)
    
    const timers = [
      setTimeout(() => setStage(6), 500),
      setTimeout(() => setStage(7), 2500),
      setTimeout(() => onFinish(), 3200)
    ];
    return () => timers.forEach(clearTimeout);
  }, [onFinish]);

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "#000", zIndex: 9999,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      opacity: stage === 7 ? 0 : 1, 
      transition: "opacity 0.5s ease-in-out",
      overflow: "hidden"
    }}>
      
      {/* TYPOGRAPHY RESOLVE */}
      <div style={{
        position: "absolute", zIndex: 40,
        display: "flex", flexDirection: "column", alignItems: "center",
        transform: stage >= 6 ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
        opacity: stage >= 6 ? 1 : 0,
        transition: "all 1.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}>
        <BrandLogo 
          size="hero" 
          style={{ 
            filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.9)) drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))",
          }} 
          clickable={false}
        />
        <p style={{
          margin: "10px 0 0 0", color: "var(--text-muted)", 
          fontSize: "clamp(16px, 3vw, 24px)", letterSpacing: "12px", 
          textTransform: "uppercase", fontWeight: "800",
          fontFamily: "'Inter', sans-serif"
        }}>
          A New Era
        </p>
      </div>

      <style>{`
      `}</style>
    </div>
  );
}
