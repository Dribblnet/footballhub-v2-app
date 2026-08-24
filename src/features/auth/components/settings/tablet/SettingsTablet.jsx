import React from "react";
import { ArrowLeft, Phone, Mail, ShieldCheck, User, MessageSquare, LogOut, AlertTriangle, Lock } from "lucide-react";
import VerifiedBadge from "../../../../../components/VerifiedBadge";

export default function SettingsTablet(props) {
  const {
    user,
    updateUser,
    logout,
    updatePlayerIdentity,
    getPlayerByPhone,
    getPlayerByEmail,
    players,
    navigate,
    toast,
    fullPlayer,
    setShowEditProfile,
    setShowEmailModal,
    setShowPhoneModal,
    setShowPasswordModal,
    setShowFeedbackModal,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteConfirmationText,
    setDeleteConfirmationText,
    handleDeleteAccount,
  } = props;

  return (
    <div className="animate-fade-in" style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px", fontWeight: "800" }}>Settings</h2>
      </header>

      {/* ACCOUNT & PROFILE */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
          <User size={24} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Account Profile</h3>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.6" }}>
          Manage your public profile information, including your name, avatar, and preferred position.
        </p>
        <button 
          onClick={() => setShowEditProfile(true)}
          className="btn-primary" 
          style={{ width: "auto", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" }}
        >
          Edit Profile
        </button>
      </div>

      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
          <ShieldCheck size={24} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Account & Security</h3>
        </div>
        
        <p style={{ color: "var(--text-muted)", marginBottom: "30px", lineHeight: "1.6" }}>
          Connect your email and phone number to secure your account and manage your password.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Email */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
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
                onClick={() => setShowEmailModal(true)}
                className="btn-primary" 
                style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" }}
              >
                Change Email
              </button>
            )}
          </div>

          {/* Phone */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
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
              <VerifiedBadge isEmailVerified={false} isPhoneVerified={true} showText={true} />
            ) : (
              <button 
                onClick={() => setShowPhoneModal(true)}
                style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", cursor: "pointer" }}
              >
                {fullPlayer.phone || fullPlayer.phoneNumber ? "Change Phone" : "Add Phone"}
              </button>
            )}
          </div>

          {/* Password */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={20} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "16px", marginBottom: "4px" }}>Password</div>
                <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>Update your security credentials</div>
              </div>
            </div>
            
            <button 
              onClick={() => setShowPasswordModal(true)}
              style={{ padding: "8px 16px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)", cursor: "pointer" }}
            >
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* SUPPORT */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "15px" }}>
          <MessageSquare size={24} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700" }}>Support</h3>
        </div>
        <p style={{ color: "var(--text-muted)", marginBottom: "20px", lineHeight: "1.6" }}>
          Submit bugs, suggest features, or reach out to the team.
        </p>
        <button 
          onClick={() => setShowFeedbackModal(true)}
          className="btn-primary" 
          style={{ width: "auto", padding: "12px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "600" }}
        >
          Suggestions & Feedback
        </button>
      </div>

      {/* ACCOUNT ACTIONS */}
      <div className="glass-panel" style={{ padding: "30px", marginBottom: "30px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px", borderBottom: "1px solid rgba(239, 68, 68, 0.1)", paddingBottom: "15px" }}>
          <AlertTriangle size={24} color="#ef4444" />
          <h3 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "#ef4444" }}>Account Actions</h3>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <button 
            onClick={() => navigate('/safety')}
            className="btn-primary" 
            style={{ background: "transparent", border: "1px solid var(--border)", color: "white", width: "100%" }}
          >
            Request Data Export
          </button>
          
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-primary" 
            style={{ background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", width: "100%" }}
          >
            Delete Account
          </button>
          
          <button 
            onClick={() => {
              if (logout) logout();
            }}
            className="btn-primary" 
            style={{ background: "transparent", border: "1px solid rgba(239, 68, 68, 0.5)", color: "#ef4444", width: "100%", marginTop: "10px" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.95)", zIndex: 100, backdropFilter: "blur(10px)",
          display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
        }}>
          <div className="glass-panel animate-scale-in" style={{ padding: "40px", maxWidth: "420px", width: "100%", textAlign: "center", border: "1px solid #ef4444", background: "#1e293b", boxShadow: "0 25px 50px rgba(0,0,0,0.5)" }}>
            <h2 style={{ margin: "0 0 15px 0", fontSize: "24px", fontWeight: "800", color: "#ef4444" }}>
              Delete Account
            </h2>
            <p style={{ margin: "0 0 20px 0", color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", textAlign: "left" }}>
              This action is permanent and cannot be undone. Your profile will be deleted, but match statistics may be anonymized to preserve historical integrity.
            </p>
            
            <p style={{ margin: "0 0 10px 0", color: "white", fontSize: "14px", fontWeight: "600", textAlign: "left" }}>
              Type <strong>delete my account</strong> to confirm:
            </p>
            <input
              type="text"
              className="input-modern"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              placeholder="delete my account"
              style={{ width: "100%", marginBottom: "30px", border: "1px solid rgba(239, 68, 68, 0.3)" }}
            />

            <div style={{ display: "flex", gap: "12px" }}>
              <button className="btn-primary" onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmationText(""); }} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", boxShadow: "none" }}>Cancel</button>
              <button className="btn-primary" onClick={handleDeleteAccount} style={{ flex: 1, background: "#ef4444", color: "white", border: "none" }}>Delete Permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
