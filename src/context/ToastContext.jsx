/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useCallback } from "react";
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const triggerExit = useCallback((id) => {
    setToasts((prev) => prev.map(t => t.id === id ? { ...t, isExiting: true } : t));
    setTimeout(() => {
      setToasts((prev) => prev.filter(t => t.id !== id));
    }, 400);
  }, []);

  const addToast = useCallback((msg, type = "info", options = {}) => {
    const id = (window.crypto && window.crypto.randomUUID) 
      ? window.crypto.randomUUID() 
      : Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    let title = options.title || "";
    let desc = "";
    
    if (typeof msg === "object" && msg !== null) {
      title = msg.title || options.title || "";
      desc = msg.description || msg.message || "";
    } else {
      desc = msg;
    }

    if (!title) {
      if (type === "success") title = "Success";
      else if (type === "error") title = "Error";
      else if (type === "warning") title = "Warning";
      else title = "Info";
    }

    const customIcon = options.icon || null;

    setToasts((prev) => [...prev, { id, title, desc, type, customIcon, isExiting: false }]);
    
    setTimeout(() => {
      triggerExit(id);
    }, 4000);
  }, [triggerExit]);

  const removeToast = useCallback((id) => {
    triggerExit(id);
  }, [triggerExit]);

  const toast = {
    success: (msg, opts) => addToast(msg, "success", opts),
    error: (msg, opts) => addToast(msg, "error", opts),
    warning: (msg, opts) => addToast(msg, "warning", opts),
    info: (msg, opts) => addToast(msg, "info", opts)
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        pointerEvents: "none"
      }}>
        {toasts.map(t => {
          let defaultIcon = <Info size={22} color="var(--primary)" />;
          let border = "1px solid rgba(255,255,255,0.1)";
          let bg = "rgba(15, 23, 42, 0.98)";
          let shadow = "0 20px 40px -10px rgba(0,0,0,0.5)";
          
          if (t.type === "success") {
            defaultIcon = <CheckCircle2 size={22} color="#10b981" />;
          } else if (t.type === "error") {
            defaultIcon = <AlertCircle size={22} color="var(--danger)" />;
            border = "1px solid rgba(239, 68, 68, 0.4)";
            bg = "linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(15,23,42,0.95))";
            shadow = "0 10px 40px rgba(239,68,68,0.2)";
          } else if (t.type === "warning") {
            defaultIcon = <AlertTriangle size={22} color="var(--warning)" />;
            border = "1px solid rgba(245, 158, 11, 0.4)";
            bg = "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(15,23,42,0.95))";
            shadow = "0 10px 40px rgba(245,158,11,0.2)";
          }

          return (
            <div key={t.id} style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              background: bg,
              border: border,
              borderRadius: "16px",
              padding: "16px 20px",
              boxShadow: shadow,
              color: "white",
              pointerEvents: "auto",
              minWidth: "300px",
              maxWidth: "400px",
              transition: "transform 0.2s, opacity 0.2s",
              opacity: t.isExiting ? 0 : 1,
              transform: t.isExiting ? "translateX(20px)" : "translateX(0)"
            }}>
              <div style={{ marginTop: "2px", fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {t.customIcon ? t.customIcon : defaultIcon}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontWeight: "700", fontSize: "15px", letterSpacing: "0.3px", color: "white" }}>{t.title}</span>
                {t.desc && <span style={{ fontSize: "13px", color: "var(--text-muted)", lineHeight: "1.4" }}>{t.desc}</span>}
              </div>
              <button 
                onClick={() => removeToast(t.id)}
                style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", padding: "4px", borderRadius: "50%", transition: "background 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                onMouseOut={(e) => e.currentTarget.style.background = "transparent"}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes slideInRight {
          0% { transform: translateX(120%) scale(0.9); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes slideOutRight {
          0% { transform: translateX(0) scale(1); opacity: 1; }
          100% { transform: translateX(120%) scale(0.9); opacity: 0; }
        }
      `}</style>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
