import { useState } from "react";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const policiesData = [
  { id: "privacy", title: "Privacy Policy", content: "Your privacy is important to us. We securely store your match data and do not sell your personal information." },
  { id: "tos", title: "Terms of Service", content: "By using Dribbl.net, you agree to organize matches responsibly and respect all players." },
  { id: "community", title: "Community Guidelines", content: "No hate speech, no violent conduct on or off the pitch. Respect the referees." },
  { id: "data", title: "Data Usage Policy", content: "Your data is used to calculate your stats and match you with relevant tournaments." },
  { id: "fairplay", title: "Fair Play Policy", content: "Any team caught using ringers or unregistered players in official tournaments will be disqualified." },
  { id: "tournament", title: "Tournament Rules", content: "All tournament matches follow standard FIFA rules unless stated otherwise by the organizer. Referees have the final say." },
  { id: "refund", title: "Refund Policy", content: "Tournament entry fees are refundable up to 48 hours before the start of the tournament. Pitch bookings are non-refundable on the day of the match." },
  { id: "cancellation", title: "Cancellation Policy", content: "Match cancellations must happen at least 24 hours in advance. Frequent no-shows will result in an account suspension." },
  { id: "contact", title: "Contact Us", content: "For support, partnerships, or press inquiries, please reach out to us at support@dribbl.net." }
];

export default function Policies() {
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState("privacy");

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", minHeight: "calc(100vh - 80px)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Platform Policies</h2>
      </header>

      <div className="glass-panel" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
        {policiesData.map((policy) => (
          <div key={policy.id} style={{ borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
            <button
              onClick={() => setExpandedId(expandedId === policy.id ? null : policy.id)}
              style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "20px 10px", background: "transparent", border: "none", color: "white",
                fontSize: "18px", fontWeight: "700", cursor: "pointer"
              }}
            >
              <span>{policy.title}</span>
              {expandedId === policy.id ? <ChevronDown size={20} color="var(--primary)" /> : <ChevronRight size={20} color="var(--text-muted)" />}
            </button>
            
            <div style={{
              maxHeight: expandedId === policy.id ? "500px" : "0",
              opacity: expandedId === policy.id ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              padding: expandedId === policy.id ? "0 10px 20px 10px" : "0 10px",
              color: "var(--text-muted)",
              lineHeight: "1.6"
            }}>
              {policy.content}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
