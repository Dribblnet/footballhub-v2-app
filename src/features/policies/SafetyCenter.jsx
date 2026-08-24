import { useState } from "react";
import { ArrowLeft, Shield, Mail, FileText, AlertTriangle, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function SafetyCenter() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [requestType, setRequestType] = useState("general");
  const [description, setDescription] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API request to backend ticketing system
    console.log("Submitting Request:", {
      userId: user?.id,
      type: requestType,
      description,
      timestamp: new Date().toISOString(),
      status: "Pending"
    });
    setSubmitted(true);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", minHeight: "calc(100vh - 80px)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Help & Support</h2>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px", marginBottom: "40px" }}>
        
        {/* Direct Contact Card */}
        <div className="glass-panel" style={{ padding: "30px", textAlign: "center" }}>
          <Mail size={40} color="var(--primary)" style={{ marginBottom: "15px" }} />
          <h3 style={{ margin: "0 0 10px 0", color: "white" }}>Email Support</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
            For direct inquiries, account issues, or general support, you can reach our team via email.
          </p>
          <a href="mailto:dribblnet@gmail.com" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>
            dribblnet@gmail.com
          </a>
        </div>

        {/* Safety & Moderation Card */}
        <div className="glass-panel" style={{ padding: "30px", textAlign: "center" }}>
          <Shield size={40} color="var(--accent)" style={{ marginBottom: "15px" }} />
          <h3 style={{ margin: "0 0 10px 0", color: "white" }}>Trust & Safety</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px" }}>
            Report abusive behavior, harassment, or violations of our Community Guidelines.
          </p>
          <button onClick={() => { setRequestType("safety"); document.getElementById("support-form").scrollIntoView(); }} className="btn-primary" style={{ background: "var(--accent)" }}>
            File a Report
          </button>
        </div>

      </div>

      <div id="support-form" className="glass-panel" style={{ padding: "40px" }}>
        <h3 style={{ margin: "0 0 20px 0", color: "white", fontSize: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FileText size={20} color="var(--primary)" /> Submit a Request
        </h3>
        
        {submitted ? (
          <div style={{ padding: "30px", textAlign: "center", background: "rgba(16, 185, 129, 0.1)", border: "1px solid var(--accent)", borderRadius: "12px" }}>
            <h4 style={{ color: "var(--accent)", margin: "0 0 10px 0", fontSize: "18px" }}>Request Submitted</h4>
            <p style={{ color: "white", margin: 0 }}>Your request has been logged. Our support team will review it shortly. Internal Reference: #{Math.floor(Math.random() * 1000000)}</p>
            <button onClick={() => setSubmitted(false)} className="btn-primary" style={{ marginTop: "20px" }}>Submit Another Request</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontWeight: "600" }}>Request Type</label>
              <select 
                className="input-modern"
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                required
                style={{ textAlign: "left" }}
              >
                <option value="general">General Support</option>
                <option value="account">Account Issue</option>
                <option value="privacy">Privacy / Data Request</option>
                <option value="safety">Safety / Abuse Report</option>
                <option value="technical">Technical Problem</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "8px", color: "var(--text-muted)", fontWeight: "600" }}>Description</label>
              <textarea 
                className="input-modern"
                rows="5"
                placeholder="Please describe your issue or request in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                style={{ textAlign: "left", resize: "vertical" }}
              />
            </div>

            <div style={{ padding: "15px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", fontSize: "13px", color: "var(--text-muted)" }}>
              <AlertTriangle size={16} color="var(--warning)" style={{ verticalAlign: "middle", marginRight: "5px" }} />
              If you are requesting a data export or account deletion, please allow up to 30 days for processing. You can also initiate account deletion from your Account Settings.
            </div>

            <button type="submit" className="btn-primary">
              Submit Request
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
