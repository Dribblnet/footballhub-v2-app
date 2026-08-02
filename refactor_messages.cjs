const fs = require('fs');
const path = require('path');

const messagesPath = path.join(__dirname, 'src/features/marketplace/Messages.jsx');
const content = fs.readFileSync(messagesPath, 'utf8');

// I'll define the desktop, tablet, mobile components manually in this script, and then write them out.
const desktopContent = `import { ArrowLeft, Send, User, CheckCircle2, MoreVertical, Ban, Trash2, Flag } from "lucide-react";
import ProfilePreviewModal from "../../../../components/ProfilePreviewModal";
import VerifiedBadge from "../../../../components/VerifiedBadge";

export default function MessagesDesktop({
  navigate,
  activeChat, setActiveChat,
  previewPlayerId, setPreviewPlayerId,
  userSearch, setUserSearch,
  menuOpen, setMenuOpen,
  reportModal, setReportModal,
  inputText, setInputText,
  players, contacts, messages, reportReasons,
  getPlayerByName, initChat, clearChat, blockUser, handleReportSubmit, handleSend
}) {
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
                  onClick={() => { initChat(p.name); setActiveChat(p.name); setUserSearch(""); }}
                  style={{ 
                    padding: "15px", borderBottom: "1px solid var(--border)", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "10px"
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold", color: "white" }}>
                    {p.name.charAt(0).toUpperCase()}
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
              key={c} 
              onClick={() => setActiveChat(c)}
              style={{ 
                padding: "15px", 
                borderBottom: "1px solid var(--border)", 
                cursor: "pointer",
                background: activeChat === c ? "rgba(59, 130, 246, 0.1)" : "transparent",
                borderLeft: activeChat === c ? "3px solid var(--primary)" : "3px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <div 
                style={{ width: "35px", height: "35px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  const p = getPlayerByName(c);
                  if (p) setPreviewPlayerId(p.id);
                }}
              >
                <User size={18} color="white" />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontWeight: activeChat === c ? "700" : "500" }}>{c}</span>
                {(() => {
                  const p = getPlayerByName(c);
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
                    const p = getPlayerByName(activeChat);
                    if (p) setPreviewPlayerId(p.id);
                  }}
                >
                  <h3 style={{ margin: 0, fontSize: "18px", display: "flex", alignItems: "center", gap: "6px" }}>
                    {activeChat}
                    {(() => {
                      const p = getPlayerByName(activeChat);
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
                        onClick={() => { setReportModal({ isOpen: true, user: activeChat, reason: "", description: "" }); setMenuOpen(false); }}
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
                    <div key={msg.id} style={{ alignSelf: msg.sender === "You" ? "flex-end" : "flex-start", maxWidth: "70%" }}>
                      <div style={{ 
                        background: msg.sender === "You" ? "var(--primary)" : "rgba(255,255,255,0.1)", 
                        padding: "12px 16px", 
                        borderRadius: msg.sender === "You" ? "15px 15px 0 15px" : "15px 15px 15px 0",
                        marginBottom: "4px",
                        fontSize: "15px"
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: msg.sender === "You" ? "right" : "left", display: "flex", alignItems: "center", gap: "4px", justifyContent: msg.sender === "You" ? "flex-end" : "flex-start" }}>
                        {msg.time} {msg.sender === "You" && <CheckCircle2 size={12} color="var(--accent)" />}
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
\`;

const mobileContent = \`import { ArrowLeft, Send, User, CheckCircle2, MoreVertical, Ban, Trash2, Flag } from "lucide-react";
import ProfilePreviewModal from "../../../../components/ProfilePreviewModal";
import VerifiedBadge from "../../../../components/VerifiedBadge";

export default function MessagesMobile({
  navigate,
  activeChat, setActiveChat,
  previewPlayerId, setPreviewPlayerId,
  userSearch, setUserSearch,
  menuOpen, setMenuOpen,
  reportModal, setReportModal,
  inputText, setInputText,
  players, contacts, messages, reportReasons,
  getPlayerByName, initChat, clearChat, blockUser, handleReportSubmit, handleSend
}) {
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
          {activeChat ? activeChat : "Messages"}
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
                  onClick={() => { setReportModal({ isOpen: true, user: activeChat, reason: "", description: "" }); setMenuOpen(false); }}
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
                    onClick={() => { initChat(p.name); setActiveChat(p.name); setUserSearch(""); }}
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
                key={c} 
                onClick={() => setActiveChat(c)}
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
                    const p = getPlayerByName(c);
                    if (p) setPreviewPlayerId(p.id);
                  }}
                >
                  <User size={22} color="white" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flex: 1, overflow: "hidden" }}>
                  <span style={{ fontWeight: "500", fontSize: "16px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c}</span>
                  {(() => {
                    const p = getPlayerByName(c);
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
                  <div key={msg.id} style={{ alignSelf: msg.sender === "You" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
                    <div style={{ 
                      background: msg.sender === "You" ? "var(--primary)" : "rgba(255,255,255,0.1)", 
                      padding: "10px 14px", 
                      borderRadius: msg.sender === "You" ? "15px 15px 0 15px" : "15px 15px 15px 0",
                      marginBottom: "4px",
                      fontSize: "14px",
                      wordBreak: "break-word"
                    }}>
                      {msg.text}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: msg.sender === "You" ? "right" : "left", display: "flex", alignItems: "center", gap: "4px", justifyContent: msg.sender === "You" ? "flex-end" : "flex-start" }}>
                      {msg.time} {msg.sender === "You" && <CheckCircle2 size={12} color="var(--accent)" />}
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
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "20px" }}>
          <div className="glass-panel" style={{ width: "100%", padding: "20px", borderRadius: "12px" }}>
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
\`;

const tabletContent = \`export { default } from "./desktop/MessagesDesktop";\`;

const rootContent = \`import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useMessages } from "../../context/MessageContext";
import { usePlayers } from "../../context/PlayerContext";
import ResponsiveView from "../../components/layout/ResponsiveView";
import MessagesMobile from "./components/messages/mobile/MessagesMobile";
import MessagesDesktop from "./components/messages/desktop/MessagesDesktop";
import MessagesTablet from "./components/messages/tablet/MessagesTablet";

export default function Messages() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const contact = searchParams.get("contact");
  const ref = searchParams.get("ref");

  const { conversations, getMessages, sendMessage, initChat, blockUser, clearChat, blockedUsers, clearUnreadMessages } = useMessages();
  const { players } = usePlayers();
  const [activeChat, setActiveChat] = useState(contact || null);
  const [previewPlayerId, setPreviewPlayerId] = useState(null);

  const getPlayerByName = (name) => {
    return players.find(p => p.name === name || p.displayName === name);
  };

  useEffect(() => {
    clearUnreadMessages();
  }, [clearUnreadMessages]);
  const [inputText, setInputText] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportModal, setReportModal] = useState({ isOpen: false, user: null, reason: "", description: "" });
  const reportReasons = ["Abusive Language", "Harassment", "Spam", "Fake Profile", "Inappropriate Content", "Unsportsmanlike Conduct", "Other"];

  const handleReportSubmit = () => {
    if (!reportModal.reason) {
      alert("Please select a reason.");
      return;
    }
    const reports = JSON.parse(localStorage.getItem("v2_reports") || "[]");
    reports.push({
      user: reportModal.user,
      reason: reportModal.reason,
      description: reportModal.description,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("v2_reports", JSON.stringify(reports));
    setReportModal({ isOpen: false, user: null, reason: "", description: "" });
    alert("User reported successfully.");
  };

  useEffect(() => {
    if (contact && ref) {
      initChat(contact, ref);
    }
  }, [contact, ref, initChat]);

  const messages = activeChat ? getMessages(activeChat) : [];
  const contacts = Object.keys(conversations).filter(c => !blockedUsers.includes(c));

  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    sendMessage(activeChat, inputText, "You");
    setInputText("");

    setTimeout(() => {
      sendMessage(activeChat, "Sounds good, let's coordinate the details.", activeChat);
    }, 1500);
  };

  const controllerProps = {
    navigate,
    activeChat, setActiveChat,
    previewPlayerId, setPreviewPlayerId,
    userSearch, setUserSearch,
    menuOpen, setMenuOpen,
    reportModal, setReportModal,
    inputText, setInputText,
    players, contacts, messages, reportReasons,
    getPlayerByName, initChat, clearChat, blockUser, handleReportSubmit, handleSend
  };

  return (
    <ResponsiveView
      mobile={<MessagesMobile {...controllerProps} />}
      tablet={<MessagesTablet {...controllerProps} />}
      desktop={<MessagesDesktop {...controllerProps} />}
    />
  );
}
\`;

fs.writeFileSync(path.join(__dirname, 'src/features/marketplace/components/messages/desktop/MessagesDesktop.jsx'), desktopContent);
fs.writeFileSync(path.join(__dirname, 'src/features/marketplace/components/messages/mobile/MessagesMobile.jsx'), mobileContent);
fs.writeFileSync(path.join(__dirname, 'src/features/marketplace/components/messages/tablet/MessagesTablet.jsx'), tabletContent);
fs.writeFileSync(messagesPath, rootContent);
console.log('Messages successfully refactored');
