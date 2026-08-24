import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Policies() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("privacy");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab && ["privacy", "tos", "community"].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", minHeight: "calc(100vh - 80px)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Legal & Policies</h2>
      </header>

      {/* TABS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px" }}>
        {["privacy", "tos", "community"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 24px",
              background: activeTab === tab ? "var(--primary)" : "rgba(255,255,255,0.05)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "700",
              cursor: "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s ease"
            }}
          >
            {tab === "privacy" ? "Privacy Policy" : tab === "tos" ? "Terms of Service" : "Community Guidelines"}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: "40px", lineHeight: "1.7", color: "var(--text-muted)", fontSize: "15px" }}>
        
        {activeTab === "privacy" && (
          <div>
            <h3 style={{ color: "white", fontSize: "24px", marginBottom: "20px" }}>Privacy Policy</h3>
            <p style={{ fontWeight: "700", marginBottom: "30px" }}>Version: 1.0 | Effective Date: [CONFIGURED DATE] (Requires Legal Review)</p>
            
            <h4 style={{ color: "white", marginTop: "30px" }}>1. Introduction</h4>
            <p>Welcome to Dribbl. We are committed to protecting your personal information and your right to privacy. This privacy notice explains how we collect, use, and share your information when you use our platform.</p>
            
            <h4 style={{ color: "white", marginTop: "30px" }}>2. Information We Collect</h4>
            <p>We collect personal information that you voluntarily provide to us when you register on the Services. Based on our current infrastructure, we collect:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><strong>Identifiers:</strong> Name, Email address, Phone number, Profile photo.</li>
              <li><strong>Player Data:</strong> Player position, Team information, Match participation.</li>
              <li><strong>Performance Stats:</strong> Goals, Assists, Cards, Ratings, and aggregated match statistics.</li>
              <li><strong>Technical Data:</strong> Authentication logs (via Firebase), device interaction with our services.</li>
            </ul>
            <p style={{ marginTop: "10px", padding: "10px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "3px solid var(--warning)" }}>
              <strong>Note:</strong> We do not currently collect your date of birth, physical address, or payment information. If marketplace features are activated, this section must be updated.
            </p>

            <h4 style={{ color: "white", marginTop: "30px" }}>3. How We Use Your Information</h4>
            <p>We use the information we collect or receive to:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>Facilitate account creation and authentication.</li>
              <li>Manage user accounts and player profiles.</li>
              <li>Calculate and display player/team performance statistics.</li>
              <li>Enable match organization and community interaction.</li>
            </ul>

            <h4 style={{ color: "white", marginTop: "30px" }}>4. Third-Party Services</h4>
            <p>We may share your data with third-party vendors that perform services for us. Currently, our verified third-party processors include:</p>
            <ul style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li><strong>Firebase (Google):</strong> Used for secure user authentication and database hosting.</li>
            </ul>

            <h4 style={{ color: "white", marginTop: "30px" }}>5. Your Data Rights</h4>
            <p>You have the right to request access to, correction of, or deletion of your personal data. You may initiate an account deletion request directly from your Account Settings. Some historical match statistics may be anonymized rather than deleted to preserve the integrity of historical match records for other players.</p>
          </div>
        )}

        {activeTab === "tos" && (
          <div>
            <h3 style={{ color: "white", fontSize: "24px", marginBottom: "20px" }}>Terms of Service</h3>
            <p style={{ fontWeight: "700", marginBottom: "30px" }}>Version: 1.0 | Effective Date: [CONFIGURED DATE] (Requires Legal Review)</p>
            
            <h4 style={{ color: "white", marginTop: "30px" }}>1. Platform Purpose</h4>
            <p>Dribbl is a grassroots football community and match organization platform. We provide tools for users to connect, organize matches, and track performance.</p>

            <h4 style={{ color: "white", marginTop: "30px" }}>2. Eligibility</h4>
            <p>You must be of legal age in your jurisdiction to form a binding contract to use Dribbl. [TODO: Age Policy Configuration requires business review].</p>

            <h4 style={{ color: "white", marginTop: "30px" }}>3. User Conduct & Acceptable Use</h4>
            <p>Users agree to use the platform for its intended purpose. You may not use the platform to harass others, organize illegal activities, or manipulate match statistics. Violation of these terms may result in account suspension.</p>

            <h4 style={{ color: "white", marginTop: "30px" }}>4. Limitation of Liability</h4>
            <p style={{ padding: "10px", background: "rgba(245, 158, 11, 0.1)", borderLeft: "3px solid var(--warning)" }}>
              [LEGAL REVIEW REQUIRED] Dribbl provides the platform "as is". We are not responsible for physical injuries, disputes between players, or issues arising at physical football venues organized through our platform.
            </p>

            <h4 style={{ color: "white", marginTop: "30px" }}>5. Account Security</h4>
            <p>You are responsible for maintaining the confidentiality of your authentication credentials. Notify us immediately of any unauthorized access to your account.</p>
          </div>
        )}

        {activeTab === "community" && (
          <div>
            <h3 style={{ color: "white", fontSize: "24px", marginBottom: "20px" }}>Community Guidelines</h3>
            <p style={{ fontWeight: "700", marginBottom: "30px" }}>Version: 1.0 | Effective Date: [CONFIGURED DATE]</p>
            
            <p>Dribbl is built on respect, fair play, and a shared love for football. To keep our community safe and enjoyable, all users must adhere to the following guidelines:</p>

            <h4 style={{ color: "white", marginTop: "30px" }}>1. Respect Everyone</h4>
            <p>Harassment, bullying, hate speech, and abusive conduct will not be tolerated. This applies both on the platform (in chat, profiles, and match reports) and off the platform at physical matches organized through Dribbl.</p>

            <h4 style={{ color: "white", marginTop: "30px" }}>2. Fair Play & Integrity</h4>
            <p>Do not manipulate match statistics, create fake accounts to boost ratings, or exploit the platform's leaderboard systems. Honest reporting of scores and stats is required.</p>

            <h4 style={{ color: "white", marginTop: "30px" }}>3. Safety First</h4>
            <p>Do not post malicious links, engage in scams, or attempt to compromise other users' accounts. If you witness unsafe behavior, use the "Report User" feature on their profile.</p>

            <h4 style={{ color: "white", marginTop: "30px" }}>4. Consequences of Violation</h4>
            <p>We reserve the right to remove content, suspend accounts, or permanently ban users who violate these guidelines to protect our community.</p>
          </div>
        )}

      </div>
    </div>
  );
}
