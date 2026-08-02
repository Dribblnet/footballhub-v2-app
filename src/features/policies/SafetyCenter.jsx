import { useState } from "react";
import { ArrowLeft, ShieldAlert, Flag, Ban, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SafetyCenter() {
  const navigate = useNavigate();
  const [reportType, setReportType] = useState("");

  const handleReport = (e) => {
    e.preventDefault();
    alert("Report submitted to our Trust & Safety team. We will review it shortly.");
    setReportType("");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", minHeight: "calc(100vh - 80px)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "40px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "28px", fontWeight: "900", letterSpacing: "-0.5px" }}>Safety Center</h2>
      </header>

      <div className="glass-panel" style={{ padding: "40px", marginBottom: "30px", textAlign: "center", background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(239, 68, 68, 0.1))" }}>
        <ShieldAlert size={48} color="var(--danger)" style={{ marginBottom: "20px" }} />
        <h1 style={{ fontSize: "32px", fontWeight: "900", marginBottom: "15px", color: "white" }}>
          Keeping Dribbl Safe
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-main)", lineHeight: "1.6", maxWidth: "600px", margin: "0 auto" }}>
          We are committed to maintaining a safe, respectful, and fair community. 
          Use the tools below to report inappropriate behavior, fake profiles, or unsafe conditions.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        <div className="glass-panel" style={{ padding: "25px", cursor: "pointer" }} onClick={() => setReportType("player")}>
          <Flag size={24} color="var(--warning)" style={{ marginBottom: "15px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "10px" }}>Report Player</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>Report abusive language, unsportsmanlike conduct, or fake profiles.</p>
        </div>

        <div className="glass-panel" style={{ padding: "25px", cursor: "pointer" }} onClick={() => setReportType("team")}>
          <Flag size={24} color="var(--accent)" style={{ marginBottom: "15px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "10px" }}>Report Team</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>Report ringers, unregistered players, or team misconduct.</p>
        </div>

        <div className="glass-panel" style={{ padding: "25px", cursor: "pointer" }} onClick={() => setReportType("match")}>
          <AlertTriangle size={24} color="var(--danger)" style={{ marginBottom: "15px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "10px" }}>Report Match</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>Report unsafe pitches, referee abuse, or match fixing.</p>
        </div>

        <div className="glass-panel" style={{ padding: "25px", cursor: "pointer" }} onClick={() => setReportType("block")}>
          <Ban size={24} color="var(--text-muted)" style={{ marginBottom: "15px" }} />
          <h3 style={{ fontSize: "18px", fontWeight: "800", marginBottom: "10px" }}>Block User</h3>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: 0 }}>Prevent a specific user from contacting or interacting with you.</p>
        </div>
      </div>

      {reportType && (
        <div className="glass-panel" style={{ padding: "30px", border: "1px solid var(--border)", animation: "fadeIn 0.3s ease" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "800", marginBottom: "20px", textTransform: "capitalize" }}>
            {reportType === "block" ? "Block User" : `Report ${reportType}`}
          </h3>
          <form onSubmit={handleReport} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-muted)" }}>
                {reportType === "match" ? "Match ID / Details" : "User/Team Name or ID"}
              </label>
              <input type="text" className="input-modern" placeholder="Required" required style={{ width: "100%" }} />
            </div>
            
            {reportType !== "block" && (
              <div>
                <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-muted)" }}>Reason</label>
                <select className="input-modern" required style={{ width: "100%" }}>
                  <option value="">Select a reason...</option>
                  <option value="abuse">Abusive Language / Harassment</option>
                  <option value="violence">Violent Conduct</option>
                  <option value="fake">Fake Profile / Impersonation</option>
                  <option value="spam">Spam / Scam</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            <div>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "var(--text-muted)" }}>Additional Details</label>
              <textarea className="input-modern" placeholder="Please provide more context..." rows={4} style={{ width: "100%", resize: "vertical" }}></textarea>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button type="submit" className="btn-primary" style={{ background: "var(--danger)", padding: "12px 24px" }}>
                Submit Action
              </button>
              <button type="button" onClick={() => setReportType("")} style={{ background: "transparent", border: "1px solid var(--border)", color: "white", padding: "12px 24px", borderRadius: "12px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
