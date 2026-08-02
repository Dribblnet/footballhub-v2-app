export default function StatsHubMobile() {
  return (
    <div style={{ padding: "20px 15px", textAlign: "center", width: "100%", boxSizing: "border-box", overflowX: "hidden" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "10px" }}>Global Leaderboards</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "20px", fontSize: "14px" }}>Compete against the best teams and players in your region.</p>
      <div className="glass-panel" style={{ padding: "12px", borderRadius: "12px", width: "100%", boxSizing: "border-box" }}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Coming Soon</h3>
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>We are aggregating historical match data to build the ultimate stats hub.</p>
      </div>
    </div>
  );
}
