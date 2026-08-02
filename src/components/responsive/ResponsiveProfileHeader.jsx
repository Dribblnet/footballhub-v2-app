import { useMediaQuery } from "../../hooks/useMediaQuery";
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
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div 
      className="glass-panel" 
      style={{ 
        display: "flex", 
        flexDirection: isMobile ? "column" : "row", 
        alignItems: "center", 
        gap: "20px", 
        padding: "30px", 
        marginBottom: "30px", 
        background: "linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(59, 130, 246, 0.2))", 
        position: "relative", 
        overflow: "hidden", 
        flexWrap: "wrap", 
        textAlign: isMobile ? "center" : "left" 
      }}
    >
      {topRightContent && (
        <div style={{ position: "absolute", top: "15px", right: "15px" }}>
          {topRightContent}
        </div>
      )}
      
      <div style={{ 
        width: isMobile ? "100px" : "80px", 
        height: isMobile ? "100px" : "80px", 
        borderRadius: "50%", 
        background: "var(--primary)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        flexShrink: 0, 
        margin: isMobile ? "0 auto" : "0" 
      }}>
        <User size={isMobile ? 50 : 40} color="white" />
      </div>
      
      <div style={{ 
        flex: "1 1 250px", 
        minWidth: 0, 
        display: "flex", 
        flexDirection: "column", 
        alignItems: isMobile ? "center" : "flex-start" 
      }}>
        <h1 style={{ 
          margin: "0 0 5px 0", 
          fontSize: "clamp(24px, 5vw, 32px)", 
          fontWeight: "900", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: isMobile ? "center" : "flex-start", 
          gap: "10px", 
          flexWrap: "wrap", 
          letterSpacing: "-0.5px", 
          overflowWrap: "break-word", 
          wordWrap: "break-word" 
        }}>
          {name}
          {(emailVerified || isVerified) && (
            <VerifiedBadge isEmailVerified={emailVerified || isVerified} isPhoneVerified={phoneVerified} size={28} />
          )}
        </h1>
        
        {username && (
          <div style={{ color: "var(--primary)", fontSize: "16px", fontWeight: "700", marginBottom: "15px" }}>
            {username}
          </div>
        )}
        
        {bio && (
          <p style={{ margin: "0 0 20px 0", color: "var(--text-main)", fontSize: "15px", lineHeight: "1.6", maxWidth: "600px", overflowWrap: "break-word", textAlign: isMobile ? "center" : "left" }}>
            {bio}
          </p>
        )}
        
        {metadataContent && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", fontSize: "13px", color: "var(--text-muted)", justifyContent: isMobile ? "center" : "flex-start" }}>
            {metadataContent}
          </div>
        )}
      </div>
    </div>
  );
}
