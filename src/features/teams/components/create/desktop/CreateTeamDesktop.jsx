import React from "react";
import { Shield, ArrowLeft, PaintBucket, MapPin, AlignLeft } from "lucide-react";

export default function CreateTeamDesktop(props) {
  const {
    navigate,
    createTeam,
    toast,
    name,
    setName,
    bio,
    setBio,
    color,
    setColor,
    turf,
    setTurf,
    handleCreate,
  } = props;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate("/")} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Create Club</h2>
      </header>

      <div className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>
            <Shield size={18} /> Club Name
          </label>
          <input className="input-modern" placeholder="e.g. FC Lightning" value={name} onChange={e => setName(e.target.value)} />
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>
            <PaintBucket size={18} /> Primary Color
          </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: "50px", height: "50px", padding: 0, border: "none", borderRadius: "8px", cursor: "pointer", background: "transparent" }} />
            <span style={{ fontSize: "14px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>{color}</span>
          </div>
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>
            <MapPin size={18} /> Home Location (Optional)
          </label>
          <input className="input-modern" placeholder="e.g. Downtown Arena" value={turf} onChange={e => setTurf(e.target.value)} />
        </div>

        <div>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "600", marginBottom: "8px", color: "var(--text-muted)" }}>
            <AlignLeft size={18} /> Club Bio (Optional)
          </label>
          <textarea className="input-modern" placeholder="Describe your club's playstyle or history..." value={bio} onChange={e => setBio(e.target.value)} rows={4} style={{ resize: "none" }} />
        </div>
      </div>

      <button onClick={handleCreate} className="btn-primary" style={{ width: "100%", padding: "15px", marginTop: "20px", fontSize: "18px", fontWeight: "800", display: "flex", justifyContent: "center", alignItems: "center", gap: "10px" }}>
        <Shield size={20} /> Establish Club
      </button>
    </div>
  );
}
