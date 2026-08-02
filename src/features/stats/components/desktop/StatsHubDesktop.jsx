export default function StatsHubDesktop() {
  return (
    <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "15px" }}>Global Leaderboards</h2>
      <p style={{ color: "var(--text-muted)", marginBottom: "30px" }}>Compete against the best teams and players in your region.</p>
      <div className="glass-panel" style={{ padding: "40px" }}>
        <h3 style={{ margin: "0 0 10px 0" }}>Coming Soon</h3>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>We are aggregating historical match data to build the ultimate stats hub.</p>
      </div>
    </div>
  );
}
