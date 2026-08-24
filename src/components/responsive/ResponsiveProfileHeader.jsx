import { User } from "lucide-react";
import VerifiedBadge from "../VerifiedBadge";

export default function ResponsiveProfileHeader({ 
  name, 
  username, 
  bio, 
  isVerified, 
  emailVerified, 
  phoneVerified, 
  topRightContent,
  metadataContent // e.g. badges or info tags
}) {
  return (
    <div 
      className="glass-panel" 
      style={{ 
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        gap: "20px", 
        padding: "30px", 
        marginBottom: "30px", 
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2))", 
        position: "relative", 
        overflow: "hidden", 
        flexWrap: "wrap", 
        textAlign: "left" 
      }}
    >
      {topRightContent && (
        <div style={{ position: "absolute", top: "15px", right: "15px", display: "flex", alignItems: "center", gap: "10px" }}>
          {topRightContent}
        </div>
      )}
      
      <div style={{ 
        width: "80px", 
        height: "80px", 
        borderRadius: "50%", 
        background: "var(--primary)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        flexShrink: 0, 
        margin: "0" 
      }}>
        <User size={40} color="white" />
      </div>
      
      <div style={{ 
        flex: "1 1 250px", 
        minWidth: 0, 
        width: "100%",
        boxSizing: "border-box",
        display: "flex", 
        flexDirection: "column", 
        alignItems: "flex-start" 
      }}>
        <h1 style={{ 
          margin: "0 0 5px 0", 
          fontSize: "clamp(24px, 5vw, 32px)", 
          fontWeight: "900", 
          letterSpacing: "-0.5px", 
          textAlign: "left",
          width: "100%",
          minWidth: 0,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "flex-start",
          columnGap: "10px",
          rowGap: "5px"
        }}>
          <span style={{ 
            minWidth: 0,
            overflowWrap: "anywhere", 
            wordBreak: "break-word",
            maxWidth: "100%"
          }}>
            {name}
          </span>
          {(emailVerified || isVerified) && (
            <span style={{ display: "inline-flex", flexShrink: 0 }}>
              <VerifiedBadge isEmailVerified={emailVerified || isVerified} isPhoneVerified={phoneVerified} size={28} />
            </span>
          )}
        </h1>
        
        {username && (
          <div style={{ color: "var(--primary)", fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>
            {username}
          </div>
        )}
        
        {bio && (
          <p style={{ margin: "0 0 20px 0", color: "var(--text-main)", fontSize: "15px", lineHeight: "1.6", maxWidth: "600px", overflowWrap: "break-word", textAlign: "left" }}>
            {bio}
          </p>
        )}
        
        {metadataContent && (
          <div style={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: "15px", 
            fontSize: "13px", 
            color: "var(--text-muted)", 
            justifyContent: "flex-start",
            maxWidth: "100%",
            overflowWrap: "anywhere",
            wordBreak: "break-word"
          }}>
            {metadataContent}
          </div>
        )}
      </div>
    </div>
  );
}
