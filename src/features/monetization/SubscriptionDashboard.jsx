import { useState } from "react";
import { useSubscription } from "./SubscriptionContext";
import { Check, Shield, Undo } from "lucide-react";
import { useToast } from "../../context/ToastContext";

export default function SubscriptionDashboard() {
  const { tier, upgradeToPro, cancelSubscription } = useSubscription();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("PLANS");
  const [refundReason, setRefundReason] = useState("");
  
  // Dummy History
  const [history, setHistory] = useState([
    { id: "TXN-9021", date: "2026-05-01", amount: "$0.00", status: "Active", plan: "FREE" }
  ]);

  const handleSimulatePayment = () => {
    // In a real app this opens Stripe/Razorpay
    upgradeToPro();
    setHistory([
      { id: `TXN-${Math.floor(Math.random() * 10000)}`, date: new Date().toISOString().split('T')[0], amount: "$9.99", status: "Success", plan: "PRO" },
      ...history
    ]);
    setActiveTab("HISTORY");
  };

  const handleRefund = () => {
    if (!refundReason) return toast.error("Please provide a reason for the refund.");
    cancelSubscription();
    setHistory([
      { id: `RFND-${Math.floor(Math.random() * 10000)}`, date: new Date().toISOString().split('T')[0], amount: "-$9.99", status: "Refunded", plan: "PRO" },
      ...history
    ]);
    setRefundReason("");
    toast.success("Subscription cancelled and refund processed (Sandbox).");
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2 style={{ margin: 0, fontSize: "28px", fontWeight: "800" }}>Billing & Plans</h2>
        {tier === "PRO" && <span style={{ background: "var(--warning)", color: "black", padding: "6px 12px", borderRadius: "20px", fontWeight: "bold", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" }}><Shield size={16} /> PRO ACTIVE</span>}
      </header>

      {/* TABS */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "30px" }}>
        {["PLANS", "HISTORY", "REFUNDS"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: "12px", borderRadius: "10px", fontWeight: "700",
              background: activeTab === tab ? "rgba(59, 130, 246, 0.1)" : "var(--bg-card)",
              border: activeTab === tab ? "1px solid var(--primary)" : "1px solid var(--border)",
              color: activeTab === tab ? "white" : "var(--text-muted)"
            }}
          >
            {tab === "PLANS" ? "Plans" : tab === "HISTORY" ? "Transaction History" : "Manage"}
          </button>
        ))}
      </div>

      {/* PLANS TAB */}
      {activeTab === "PLANS" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div className="glass-panel" style={{ border: tier === "FREE" ? "2px solid var(--primary)" : "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "20px" }}>Grassroots Free</h3>
              <span style={{ fontSize: "24px", fontWeight: "800" }}>$0</span>
            </div>
            <ul style={{ color: "var(--text-muted)", paddingLeft: "20px", lineHeight: "1.8" }}>
              <li>Unlimited standard matches</li>
              <li>Basic player stats tracking</li>
              <li>Community turf finder</li>
            </ul>
            {tier === "FREE" && <button className="btn-primary" disabled style={{ width: "100%", opacity: 0.5 }}>Current Plan</button>}
          </div>

          <div className="glass-panel" style={{ border: tier === "PRO" ? "2px solid var(--warning)" : "1px solid var(--warning)", background: "rgba(245, 158, 11, 0.05)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, fontSize: "20px", color: "var(--warning)" }}>Dribbl.net PRO</h3>
              <span style={{ fontSize: "24px", fontWeight: "800", color: "var(--warning)" }}>$9.99<span style={{ fontSize: "14px", color: "var(--text-muted)" }}>/mo</span></span>
            </div>
            <ul style={{ color: "white", paddingLeft: "20px", lineHeight: "1.8", marginBottom: "20px" }}>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", listStyle: "none", marginLeft: "-20px" }}><Check size={16} color="var(--warning)" /> Save unlimited Custom Formations</li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", listStyle: "none", marginLeft: "-20px" }}><Check size={16} color="var(--warning)" /> Priority Marketplace listing</li>
              <li style={{ display: "flex", alignItems: "center", gap: "10px", listStyle: "none", marginLeft: "-20px" }}><Check size={16} color="var(--warning)" /> Advanced Team Analytics</li>
            </ul>
            {tier === "PRO" ? (
              <button className="btn-primary" disabled style={{ width: "100%", background: "var(--warning)", color: "black", opacity: 0.8 }}>Current Plan</button>
            ) : (
              <button onClick={handleSimulatePayment} className="btn-primary" style={{ width: "100%", background: "var(--warning)", color: "black", fontWeight: "800" }}>Simulate Checkout (Sandbox)</button>
            )}
          </div>
        </div>
      )}

      {/* HISTORY TAB */}
      {activeTab === "HISTORY" && (
        <div className="glass-panel" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)" }}>
                <th style={{ padding: "12px" }}>Date</th>
                <th style={{ padding: "12px" }}>Transaction ID</th>
                <th style={{ padding: "12px" }}>Plan</th>
                <th style={{ padding: "12px" }}>Amount</th>
                <th style={{ padding: "12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.map(txn => (
                <tr key={txn.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <td style={{ padding: "12px" }}>{txn.date}</td>
                  <td style={{ padding: "12px", fontFamily: "monospace" }}>{txn.id}</td>
                  <td style={{ padding: "12px" }}>{txn.plan}</td>
                  <td style={{ padding: "12px", color: txn.amount.startsWith("-") ? "var(--danger)" : "white" }}>{txn.amount}</td>
                  <td style={{ padding: "12px" }}><span style={{ padding: "4px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", fontSize: "12px" }}>{txn.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REFUNDS TAB */}
      {activeTab === "REFUNDS" && (
        <div className="glass-panel">
          <h3 style={{ margin: "0 0 15px 0" }}><Undo size={20} style={{ verticalAlign: "middle", marginRight: "8px" }} /> Request Refund</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "20px" }}>Sandbox Mode: You can immediately refund your PRO subscription to test the downgrade flow.</p>
          
          {tier === "PRO" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <label style={{ fontSize: "12px", fontWeight: "bold", textTransform: "uppercase" }}>Reason for cancellation</label>
              <textarea 
                className="input-modern" 
                rows={4} 
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Why are you downgrading?"
              />
              <button onClick={handleRefund} className="btn-primary" style={{ background: "var(--danger)", alignSelf: "flex-start" }}>Cancel & Refund</button>
            </div>
          ) : (
            <div style={{ padding: "20px", background: "rgba(255,255,255,0.05)", borderRadius: "8px", textAlign: "center" }}>
              You do not have an active PRO subscription to refund.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
