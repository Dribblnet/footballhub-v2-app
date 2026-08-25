import { ArrowLeft, Send, User, CheckCircle2, MoreVertical, Ban, Trash2, Flag } from "lucide-react";
import BrandLogo from "../../../../../components/BrandLogo";
import ProfilePreviewModal from "../../../../../components/ProfilePreviewModal";
import VerifiedBadge from "../../../../../components/VerifiedBadge";

export default function MessagesDesktop({
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
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px", display: "flex", flexDirection: "column", height: "calc(100vh - 80px)" }}>
      <header style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
        <button onClick={() => navigate(-1)} style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", cursor: "pointer" }}>
          <ArrowLeft size={24} />
        </button>
        <h2 style={{ margin: 0, flex: 1, fontSize: "24px" }}>Messages</h2>
      </header>

      <div style={{ display: "flex", gap: "20px", flex: 1, minHeight: 0 }}>
        {/* Contact List */}
        <div className="glass-panel" style={{ width: "300px", display: "flex", flexDirection: "column", overflowY: "auto" }}>
          <div style={{ padding: "15px", borderBottom: "1px solid var(--border)" }}>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={{ width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", color: "white", padding: "8px 12px", borderRadius: "8px", outline: "none", fontSize: "14px" }}
            />
          </div>

          {userSearch ? (
            <div style={{ padding: "10px", fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "bold" }}>Search Results</div>
          ) : (
            <div style={{ padding: "15px", borderBottom: "1px solid var(--border)", fontWeight: "bold", textTransform: "uppercase", fontSize: "12px", color: "var(--text-muted)" }}>
              Recent Conversations
            </div>
          )}
          
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
                    display: "flex", alignItems: "center", gap: "10px"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                    {(p.name || p.displayName || "P").charAt(0).toUpperCase()}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <span style={{ fontWeight: "600", fontSize: "14px" }}>{p.name}</span>
                      {(p.emailVerified || p.isVerified) && <VerifiedBadge isEmailVerified={p.emailVerified || p.isVerified} isPhoneVerified={p.phoneVerified} showText={false} size={12} />}
                    </div>
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{p.username || "Player"}</span>
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
                background: activeChat === c.conversationId ? "rgba(59, 130, 246, 0.1)" : "transparent",
                borderLeft: activeChat === c.conversationId ? "3px solid var(--primary)" : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <div 
                style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  const p = getPlayerByName(c.name);
                  if (p) setPreviewPlayerId(p.id);
                }}
              >
                <User size={18} color="white" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontWeight: activeChat === c.conversationId ? "700" : "500" }}>{c.name}</span>
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
             <div style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
               No recent conversations. Search for a user above to start chatting.
             </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="glass-panel" style={{ flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
          {activeChat ? (
            <>
              <div style={{ padding: "20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "10px" }}>
                <div 
                  style={{ width: "45px", height: "45px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  onClick={() => {
                    const p = getPlayerByName(activeChat);
                    if (p) setPreviewPlayerId(p.id);
                  }}
                >
                  <User size={22} color="white" />
                </div>
                <div 
                  style={{ flex: 1, cursor: "pointer" }}
                  onClick={() => {
                    const p = getPlayerByName(activeContact?.name);
                    if (p) setPreviewPlayerId(p.id);
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "18px", display: "flex", alignItems: "center", gap: "6px" }}>
                    {activeContact?.name || "Chat"}
                    {(() => {
                      const p = getPlayerByName(activeContact?.name);
                      if (p && (p.emailVerified || p.isVerified)) {
                        return <VerifiedBadge isEmailVerified={p.emailVerified || p.isVerified} isPhoneVerified={p.phoneVerified} showText={false} size={18} />;
                      }
                      return null;
                    })()}
                  </h3>
                  <span style={{ fontSize: "13px", color: "var(--accent)" }}>Online</span>
                </div>
                
                <div style={{ position: "relative" }}>
                  <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", padding: "5px" }}>
                    <MoreVertical size={24} />
                  </button>
                  
                  {menuOpen && (
                    <div style={{ position: "absolute", top: "100%", right: 0, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "8px", minWidth: "150px", zIndex: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                      <button 
                        onClick={() => { clearChat(activeChat); setMenuOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px", background: "transparent", border: "none", color: "white", cursor: "pointer", textAlign: "left", borderRadius: "4px" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <Trash2 size={14} /> Clear Chat
                      </button>
                      <button 
                        onClick={() => { blockUser(activeChat); setActiveChat(null); setMenuOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px", background: "transparent", border: "none", color: "var(--danger)", cursor: "pointer", textAlign: "left", borderRadius: "4px" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <Ban size={14} /> Block User
                      </button>
                      <button 
                        onClick={() => { setReportModal({ isOpen: true, user: activeContact?.name, reason: "", description: "" }); setMenuOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%", padding: "10px", background: "transparent", border: "none", color: "var(--warning)", cursor: "pointer", textAlign: "left", borderRadius: "4px" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(245, 158, 11, 0.1)"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <Flag size={14} /> Report User
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "15px" }}>
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", opacity: 0.7 }}>
                    <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
                      <Send size={24} />
                    </div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>No messages yet</p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "12px" }}>Send a message to start the conversation</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} style={{ alignSelf: msg.senderId === user?.id ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                      <div style={{ 
                        background: msg.senderId === user?.id ? "var(--primary)" : "rgba(255,255,255,0.1)", 
                        padding: "12px 16px", 
                        borderRadius: msg.senderId === user?.id ? "15px 15px 0 15px" : "15px 15px 15px 0",
                        marginBottom: "4px",
                        fontSize: "15px"
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

              <div style={{ padding: "20px", borderTop: "1px solid var(--border)", display: "flex", gap: "15px" }}>
                <input 
                  className="input-modern" 
                  placeholder="Type a message..." 
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSend()}
                  style={{ flex: 1, padding: "15px", fontSize: "15px" }}
                />
                <button onClick={handleSend} className="btn-primary" style={{ padding: "0 25px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)", fontSize: "16px" }}>
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>

      {/* Reused Modals logic */}
      {reportModal.isOpen && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="glass-panel" style={{ width: "90%", maxWidth: "400px", padding: "25px", borderRadius: "12px" }}>
            <h3 style={{ margin: "0 0 15px 0" }}>Report {reportModal.user}</h3>
            <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "var(--text-muted)" }}>Please select a reason for reporting this user.</p>
            
            <select 
              className="input-modern" 
              value={reportModal.reason} 
              onChange={e => setReportModal({ ...reportModal, reason: e.target.value })}
              style={{ width: "100%", marginBottom: "15px", padding: "12px" }}
            >
              <option value="" disabled>Select a reason...</option>
              {reportReasons.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            {reportModal.reason === "Other" && (
              <textarea 
                className="input-modern"
                placeholder="Describe the issue..."
                value={reportModal.description}
                onChange={e => setReportModal({ ...reportModal, description: e.target.value })}
                style={{ width: "100%", minHeight: "80px", padding: "12px", marginBottom: "15px", resize: "vertical" }}
              />
            )}

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button 
                onClick={() => setReportModal({ isOpen: false, user: null, reason: "", description: "" })}
                style={{ padding: "10px 20px", background: "transparent", border: "1px solid var(--border)", color: "white", borderRadius: "20px", cursor: "pointer" }}
              >
                Cancel
              </button>
              <button 
                onClick={handleReportSubmit}
                className="btn-primary"
                style={{ padding: "10px 20px", background: "var(--danger)", borderRadius: "20px" }}
              >
                Submit Report
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
