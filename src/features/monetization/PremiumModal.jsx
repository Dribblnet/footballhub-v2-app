import { useSubscription } from "./SubscriptionContext";
import { X, Star, Check } from "lucide-react";

export default function PremiumModal() {
  const { isPaywallOpen, setIsPaywallOpen, paywallFeature, upgradeToPro } = useSubscription();

  if (!isPaywallOpen) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div className="glass-panel" style={{ width: "90%", maxWidth: "450px", padding: "40px", position: "relative", border: "1px solid var(--warning)", background: "linear-gradient(180deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))" }}>
        <button onClick={() => setIsPaywallOpen(false)} style={{ position: "absolute", top: "15px", right: "15px", background: "transparent", border: "none", color: "white" }}>
          <X size={24} />
        </button>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <div style={{ width: "60px", height: "60px", background: "rgba(245, 158, 11, 0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Star size={32} color="var(--warning)" />
          </div>
        </div>

        <h2 style={{ textAlign: "center", margin: "0 0 10px 0", fontSize: "28px", fontWeight: "800" }}>Upgrade to <span style={{ color: "var(--warning)" }}>PRO</span></h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginBottom: "30px", fontSize: "16px", lineHeight: "1.5" }}>
          Unlock <strong style={{ color: "white" }}>{paywallFeature}</strong> and take your football management to the next level.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Check size={20} color="var(--accent)" /> <span>Custom Tactical Formations (3-5-2, 5v5)</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Check size={20} color="var(--accent)" /> <span>Advanced Player Analytics & Heatmaps</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Check size={20} color="var(--accent)" /> <span>Create & Manage Tournaments</span></div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}><Check size={20} color="var(--accent)" /> <span>Remove all Advertisements</span></div>
        </div>

        <button onClick={upgradeToPro} className="btn-primary" style={{ width: "100%", background: "var(--warning)", color: "#000", fontSize: "18px", padding: "15px", fontWeight: "800" }}>
          Upgrade Now - $9.99/mo
        </button>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "12px", marginTop: "15px", margin: "15px 0 0 0" }}>
          Cancel anytime. This is a simulated checkout flow for the MVP.
        </p>
      </div>
    </div>
  );
}
