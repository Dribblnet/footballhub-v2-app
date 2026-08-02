import React from "react";
import { Bell, BellOff } from "lucide-react";
import BrandLogo from "../../../BrandLogo";

export default function NotificationPanelDesktop(props) {
  const {
    isOpen,
    notifications,
    markAllRead,
    clearAll,
    notificationsEnabled,
    setNotificationsEnabled,
    isMobile,
    containerStyle,
  } = props;

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)", background: "linear-gradient(to right, rgba(37, 99, 235, 0.1), transparent)" }}>
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: "700", display: "flex", alignItems: "center", gap: "8px" }}>
          <BrandLogo size="small" style={{ height: "20px" }} clickable={false} /> 
          Notifications <span style={{ background: "var(--primary)", color: "white", fontSize: "10px", padding: "2px 6px", borderRadius: "10px" }}>{notifications.filter(n => !n.read).length}</span>
        </h3>
        <button 
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          style={{ background: "transparent", border: "none", color: notificationsEnabled ? "var(--primary)" : "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: "600" }}
        >
          {notificationsEnabled ? <><Bell size={14} /> Enabled</> : <><BellOff size={14} /> Disabled</>}
        </button>
      </div>

      <div style={{ maxHeight: "350px", overflowY: "auto", padding: "10px" }}>
        {!notificationsEnabled ? (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <BellOff size={32} style={{ opacity: 0.5, marginBottom: "10px" }} />
            <p style={{ margin: 0, fontSize: "14px" }}>Notifications are disabled.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              style={{
                display: "flex", gap: "15px", padding: "15px", borderRadius: "12px",
                background: notif.read ? "transparent" : "rgba(255,255,255,0.03)",
                borderLeft: notif.read ? "3px solid transparent" : "3px solid var(--primary)",
                marginBottom: "5px", cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background = notif.read ? "transparent" : "rgba(255,255,255,0.03)"}
            >
              <div style={{ 
                width: "36px", height: "36px", borderRadius: "50%", 
                background: notif.type === "MATCH" ? "rgba(37, 99, 235, 0.2)" : notif.type === "SOCIAL" ? "rgba(245, 158, 11, 0.2)" : "rgba(16, 185, 129, 0.2)",
                color: notif.type === "MATCH" ? "var(--primary)" : notif.type === "SOCIAL" ? "var(--warning)" : "#10b981",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                {notif.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "13px", color: notif.read ? "var(--text-muted)" : "white", fontWeight: notif.read ? "500" : "600" }}>{notif.text}</p>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: "600", opacity: 0.7 }}>{notif.time}</span>
              </div>
              {!notif.read && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", marginTop: "4px" }}></div>}
            </div>
          ))
        )}
        {notificationsEnabled && notifications.length === 0 && (
          <div style={{ padding: "40px 20px", textAlign: "center", color: "var(--text-muted)" }}>
            <p style={{ margin: 0, fontSize: "14px" }}>No notifications.</p>
          </div>
        )}
      </div>
      
      {notificationsEnabled && notifications.length > 0 && (
        <div style={{ padding: "12px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={markAllRead} style={{ background: "transparent", border: "none", color: "var(--primary)", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Mark all as read</button>
          <button onClick={clearAll} style={{ background: "transparent", border: "none", color: "var(--text-muted)", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>Clear All</button>
        </div>
      )}
    </div>
  );
}
