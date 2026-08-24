import { ArrowLeft, Send, User, CheckCircle2, MoreVertical, Ban, Trash2, Flag } from "lucide-react";
import BrandLogo from "../../../../../components/BrandLogo";
import ProfilePreviewModal from "../../../../../components/ProfilePreviewModal";
import VerifiedBadge from "../../../../../components/VerifiedBadge";

export default function MessagesMobile({
  navigate,
  activeChat, setActiveChat,
  previewPlayerId, setPreviewPlayerId,
  userSearch, setUserSearch,
  menuOpen, setMenuOpen,
  reportModal, setReportModal,
  inputText, setInputText,
  players, contacts, messages, reportReasons, user, getConversationId,
  getPlayerByName, initChat, clearChat, blockUser, handleReportSubmit, handleSend
}) {
  const activeContact = contacts.find(c => c.conversationId === activeChat);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", width: "100vw", overflowX: "hidden" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "10px", padding: "15px", borderBottom: "1px solid var(--border)", background: "var(--bg-card)" }}>
        <button onClick={() => {
          if (activeChat) setActiveChat(null);
          else navigate(-1);
        }} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer", padding: "5px" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "18px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {activeContact ? activeContact.name : "Messages"}
        </h2>
        {activeChat && (
          <div style={{ position: "relative" }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", border: "none", color: "white", padding: "5px" }}>
              <MoreVertical size={20} />
            </button>
            {menuOpen && (
              <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px", minWidth: "150px", zIndex: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                <button 
                  onClick={() => { clearChat(activeChat); setMenuOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "12px 10px", background: "transparent", border: "none", color: "white", cursor: "pointer", textAlign: "left", borderRadius: "4px" }}
                >
                  <Trash2 size={14} /> Clear Chat
                </button>
                <button 
                  onClick={() => { blockUser(activeChat); setActiveChat(null); setMenuOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "12px 10px", background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", textAlign: "left", borderRadius: "4px" }}
                >
                  <Ban size={14} /> Block User
                </button>
                <button 
                  onClick={() => { setReportModal({ isOpen: true, user: activeContact?.name, reason: "", description: "" }); setMenuOpen(false); }}
                  style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "12px 10px", background: "transparent", border: "none", color: "var(--warning)", cursor: "pointer", textAlign: "left", borderRadius: "4px" }}
                >
                  <Flag size={14} /> Report User
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", width: "100%" }}>
        {!activeChat ? (
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ padding: "15px", borderBottom: "1px solid var(--border)" }}>
              <input 
                type="text" 
                placeholder="Search users..." 
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white", padding: "12px", borderRadius: "8px", outline: "none", fontSize: "16px" }}
              />
            </div>
            
            {userSearch ? (
              players
                .filter(p => p.name.toLowerCase().includes(userSearch.toLowerCase()) || (p.username && p.username.toLowerCase().includes(userSearch.toLowerCase())))
                .slice(0, 5)
                .map(p => (
                  <div 
                    key={p.id} 
                    onClick={() => { 
                      const convId = initChat(p.id, p.name); 
                      if(convId) setActiveChat(convId); 
                      setUserSearch(""); 
                    }}
                    style={{ 
                      padding: "15px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: "12px"
                    }}
                  >
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: "bold", color: "white" }}>
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ fontWeight: "600", fontSize: "15px" }}>{p.name}</span>
                        {(p.emailVerified || p.isVerified) && <VerifiedBadge isEmailVerified={p.emailVerified || p.isVerified} isPhoneVerified={p.phoneVerified} showText={false} size={14} />}
                      </div>
                      <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>{p.username || "Player"}</span>
                    </div>
                  </div>
                ))
            ) : contacts.map(c => (
              <div 
                key={c.id} 
                onClick={() => setActiveChat(c.conversationId)}
                style={{ 
                  padding: "15px", 
                  borderBottom: "1px solid var(--border)", 
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px"
                }}
              >
                <div 
                  style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const p = getPlayerByName(c.name);
                    if (p) setPreviewPlayerId(p.id);
                  }}
                >
                  <User size={22} color="white" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, overflow: "hidden" }}>
                  <span style={{ fontWeight: "500", fontSize: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</span>
                  {(() => {
                    const p = getPlayerByName(c.name);
                    if (p && (p.emailVerified || p.isVerified)) {
                      return <VerifiedBadge isEmailVerified={p.emailVerified || p.isVerified} isPhoneVerified={p.phoneVerified} showText={false} size={14} />;
                    }
                    return null;
                  })()}
                </div>
              </div>
            ))}
            { !userSearch && contacts.length === 0 && (
               <div style={{ padding: "30px 20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
                 No recent conversations. Search for a user to chat.
               </div>
            )}
          </div>
        ) : (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" }}>
              {messages.length === 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", opacity: 0.7 }}>
                  <div style={{ width: "50px", height: "50px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
                    <Send size={20} />
                  </div>
                  <p style={{ margin: 0, fontWeight: "bold" }}>No messages</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} style={{ alignSelf: msg.senderId === user?.id ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                    <div style={{ 
                      background: msg.senderId === user?.id ? "var(--primary)" : "rgba(255,255,255,0.1)", 
                      padding: "10px 14px", 
                      borderRadius: msg.senderId === user?.id ? "15px 15px 0 15px" : "15px 15px 15px 0",
                      marginBottom: "4px",
                      fontSize: "14px",
                      wordBreak: "break-word"
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: msg.senderId === user?.id ? "right" : "left", display: "flex", alignItems: "center", gap: "4px", justifyContent: msg.senderId === user?.id ? "flex-end" : "flex-start" }}>
                      {msg.time} {msg.senderId === user?.id && <CheckCircle2 size={12} color="var(--accent)" />}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ padding: "10px 15px", borderTop: "1px solid var(--border)", display: "flex", gap: "10px", background: "var(--bg-card)" }}>
              <input 
                className="input-modern" 
                placeholder="Message..." 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                style={{ flex: 1, padding: "12px", fontSize: "14px" }}
              />
              <button onClick={handleSend} className="btn-primary" style={{ padding: "0 15px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Send size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {reportModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "12px" }}>
          <div className="glass-panel" style={{ width: "100%", padding: "12px", borderRadius: "12px" }}>
            <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>Report {reportModal.user}</h3>
            
            <select 
              className="input-modern" 
              value={reportModal.reason} 
              onChange={e => setReportModal({ ...reportModal, reason: e.target.value })}
              style={{ width: "100%", marginBottom: "15px", padding: "12px", fontSize: "16px" }}
            >
              <option value="" disabled>Select reason...</option>
              {reportReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {reportModal.reason === "Other" && (
              <textarea 
                className="input-modern"
                placeholder="Description..."
                value={reportModal.description}
                onChange={e => setReportModal({ ...reportModal, description: e.target.value })}
                style={{ width: "100%", minHeight: "80px", padding: "12px", marginBottom: "15px", resize: "vertical" }}
              />
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button 
                onClick={handleReportSubmit}
                className="btn-primary"
                style={{ padding: "12px", background: "var(--danger)", borderRadius: "8px", width: "100%", fontWeight: "bold" }}
              >
                Submit Report
              </button>
              <button 
                onClick={() => setReportModal({ isOpen: false, user: null, reason: "", description: "" })}
                style={{ padding: "12px", background: "transparent", border: "1px solid var(--border)", color: "white", borderRadius: "8px", width: "100%" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {previewPlayerId && (
        <ProfilePreviewModal playerId={previewPlayerId} onClose={() => setPreviewPlayerId(null)} />
      )}
    </div>
  );
}
