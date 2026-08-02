import React from "react";
import { ArrowLeft, Phone, Mail, Link as LinkIcon, ShieldCheck } from "lucide-react";
import BrandLogo from "../../../../../components/BrandLogo";
import CountrySelector from "../CountrySelector";
import VerifiedBadge from "../../../../../components/VerifiedBadge";

export default function SettingsMobile(props) {
  const {
    user,
    updateUser,
    updatePlayerIdentity,
    getPlayerByPhone,
    getPlayerByEmail,
    players,
    navigate,
    toast,
    fullPlayer,
    linkModal,
    setLinkModal,
    linkInput,
    setLinkInput,
    linkCountryCode,
    setLinkCountryCode,
    handleLinkAccount,
  } = props;

  return (
    <div className="animate-fade-in" style={{ padding: "15px", width: "100%", margin: "0 auto", boxSizing: "border-box", overflowX: "hidden" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Settings</h2>
        <BrandLogo size="small" style={{ height: "24px" }} clickable={false} />
      </header>

      <div className="glass-panel" style={{ padding: "12px", marginBottom: "30px", boxSizing: "border-box", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
          <ShieldCheck size={24} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Account Linking</h3>
        </div>
        
        <p style={{ color: "var(--text-muted)", marginBottom: "30px", lineHeight: "1.6" }}>
          Connect your email and phone number to secure your account. 
          Fully verified accounts get the premium Verified badge across the app.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Email Linking Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Mail size={20} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>Email Address</div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{fullPlayer.email || "Not connected"}</div>
              </div>
            </div>
            
            {fullPlayer.email && (fullPlayer.emailVerified || fullPlayer.isVerified) ? (
              <VerifiedBadge isEmailVerified={true} isPhoneVerified={false} showText={true} />
            ) : (
              <button 
                onClick={() => setLinkModal("EMAIL")}
                className="btn-primary" 
                style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" }}
              >
                Connect Email
              </button>
            )}
          </div>

          {/* Phone Linking Status */}
          <div style={{ display: "flex", flexDirection: "column", gap: "15px", alignItems: "flex-start", background: "rgba(255,255,255,0.03)", padding: "15px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)", width: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Phone size={20} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>Phone Number</div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>{fullPlayer.phone || fullPlayer.phoneNumber || "Not connected"}</div>
              </div>
            </div>
            
            {fullPlayer.phone || fullPlayer.phoneNumber ? (
              fullPlayer.phoneVerified ? (
                <VerifiedBadge isEmailVerified={false} isPhoneVerified={true} showText={true} />
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "13px", color: "var(--warning)", fontWeight: "600" }}>Not verified</span>
                  <button 
                    onClick={() => setLinkModal("PHONE")}
                    className="btn-primary" 
                    style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", background: "var(--warning)", color: "black" }}
                  >
                    Verify
                  </button>
                </div>
              )
            ) : (
              <button 
                onClick={() => setLinkModal("PHONE")}
                style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", cursor: "pointer" }}
              >
                Add Phone
              </button>
            )}
          </div>
        </div>
      </div>

      {/* LINK ACCOUNT MODAL */}
      {linkModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.9)", zIndex: 100, backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "center", alignItems: "center", padding: "12px"
        }}>
          <div className="glass-panel animate-scale-in" style={{ padding: "40px", maxWidth: "420px", width: "100%", textAlign: "center", border: "1px solid var(--primary)", background: "rgba(15, 23, 42, 0.95)", boxShadow: "0 25px 50px rgba(0,0,0,0.5)", position: "relative" }}>
            <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", padding: "16px", borderRadius: "16px", marginBottom: "20px" }}>
              <LinkIcon size={32} color="white" />
            </div>
            <h2 style={{ margin: "0 0 10px 0", fontSize: "28px", fontWeight: "800", letterSpacing: "-0.5px" }}>
              Connect {linkModal === "PHONE" ? "Phone Number" : "Email Account"}
            </h2>
            <p style={{ margin: "0 0 30px 0", color: "var(--text-muted)", fontSize: "15px", lineHeight: "1.5" }}>
              Secure your persistent identity by linking your {linkModal === "PHONE" ? "phone number" : "email address"}.
            </p>

            {linkModal === "PHONE" ? (
              <div style={{ display: "flex", gap: "10px", marginBottom: "30px" }}>
                <CountrySelector value={linkCountryCode} onChange={setLinkCountryCode} />
                <div style={{ position: "relative", flex: 1 }}>
                  <Phone size={20} color="var(--text-muted)" style={{ position: "absolute", left: "15px", top: "15px" }} />
                  <input
                    type="tel"
                    className="input-modern"
                    placeholder="Phone Number"
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    style={{ paddingLeft: "45px", height: "50px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.4)" }}
                    autoFocus
                  />
                </div>
              </div>
            ) : (
              <div style={{ position: "relative", marginBottom: "30px" }}>
                <Mail size={20} color="var(--text-muted)" style={{ position: "absolute", left: "15px", top: "15px" }} />
                <input
                  type="email"
                  className="input-modern"
                  placeholder="user@example.com"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  style={{ paddingLeft: "45px", height: "50px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.4)" }}
                  autoFocus
                />
              </div>
            )}

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" onClick={() => { setLinkModal(null); setLinkInput(""); }} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", boxShadow: "none" }}>Cancel</button>
              <button className={linkModal === "PHONE" ? "btn-primary" : "glass-panel"} onClick={handleLinkAccount} style={{ flex: 1, fontWeight: "bold", background: linkModal === "PHONE" ? "" : "white", color: linkModal === "PHONE" ? "white" : "black", border: linkModal === "PHONE" ? "" : "none" }}>Verify & Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
