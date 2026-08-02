import { useSubscription } from "../monetization/SubscriptionContext";



export function Marketplace() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "15px" }}>Match & Player Finder</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Need an extra defender? Looking for a local 5v5 game? Find it here.</p>
      <div className="glass-panel" style={{ padding: "40px", border: "1px solid var(--primary)", background: "rgba(59, 130, 246, 0.05)" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Structured Marketplace</h3>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>This board will strictly use filters and structured forms to ensure high-quality matches.</p>
      </div>
    </div>
  );
}

export function TurfFinder() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "15px" }}>Nearby Turfs</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Discover, compare, and book football turfs in your area.</p>
      <div className="glass-panel" style={{ padding: "40px", border: "1px solid var(--accent)", background: "rgba(16, 185, 129, 0.05)" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Location Services</h3>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>We are integrating maps to show you exactly where to play.</p>
      </div>
    </div>
  );
}

export function Subscriptions() {
  const { upgradeToPro, tier } = useSubscription();

  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "15px" }}>Dribbl.net <span style={{ color: "var(--warning)" }}>PRO</span></h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Current Tier: <strong style={{ color: tier === "PRO" ? "var(--warning)" : "white" }}>{tier}</strong></p>
      
      {tier === "PRO" ? (
        <div className="glass-panel" style={{ padding: "40px", border: "1px solid var(--warning)", background: "rgba(245, 158, 11, 0.05)" }}>
          <h3 style={{ margin: "0 0 10px 0", color: "var(--warning)" }}>You are a PRO Member</h3>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Enjoy unlimited custom formations, advanced analytics, and ad-free browsing.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: "40px", border: "1px solid var(--warning)", background: "rgba(245, 158, 11, 0.05)" }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Unlock Premium Features</h3>
          <ul style={{ textAlign: "left", color: "var(--text-muted)", marginBottom: "30px", lineHeight: "1.8" }}>
            <li>Advanced Player Analytics & Heatmaps</li>
            <li>Custom Formations (3-5-2, 5v5)</li>
            <li>Tournament Organizer Tools</li>
          </ul>
          <button onClick={upgradeToPro} className="btn-primary" style={{ background: "var(--warning)", color: "black", fontWeight: "800", width: "100%", padding: "15px" }}>Upgrade Now - $9.99/mo</button>
        </div>
      )}
    </div>
  );
}
