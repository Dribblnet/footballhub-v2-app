import { ArrowLeft, Globe, Users, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", minHeight: "calc(100vh - 80px)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "40px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>About Dribbl.net</h2>
      </header>

      <div className="glass-panel" style={{ padding: "40px", marginBottom: "30px", textAlign: "center", background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2))" }}>
        <Globe size={48} color="var(--primary)" style={{ marginBottom: "20px" }} />
        <h1 style={{ fontSize: "36px", fontWeight: "900", marginBottom: "20px", color: "white" }}>
          Football deserves its own home.
        </h1>
        <p style={{ fontSize: "18px", color: "var(--text-main)", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto" }}>
          Dribbl connects grassroots football players, teams, organizers and communities. 
          Whether you're organising a local kickabout, playing league football or building your football journey, 
          Dribbl helps manage every part of the experience.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div className="glass-panel" style={{ padding: "30px", borderTop: "4px solid var(--primary)" }}>
          <h3 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Trophy size={24} color="var(--primary)" /> Mission
          </h3>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
            Make grassroots football organised, connected and accessible everywhere.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: "30px", borderTop: "4px solid var(--accent)" }}>
          <h3 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
            <Users size={24} color="var(--accent)" /> Vision
          </h3>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", lineHeight: "1.6", margin: 0 }}>
            Become the world's leading grassroots football platform.
          </p>
        </div>
      </div>
    </div>
  );
}
