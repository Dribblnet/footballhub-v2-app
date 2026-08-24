import TopNav from "./TopNav";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import PolicyConsentGate from "../../features/compliance/PolicyConsentGate";

export default function AppLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "var(--bg-main)", color: "white" }}>
      <PolicyConsentGate />
      <TopNav />
      <main className="app-container" style={{ flex: 1, paddingBottom: "20px", overflowX: "hidden" }}>
        {children}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
