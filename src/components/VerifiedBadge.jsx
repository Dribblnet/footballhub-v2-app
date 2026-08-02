import { BadgeCheck } from "lucide-react";

export default function VerifiedBadge({ 
  isEmailVerified = false, 
  isPhoneVerified = false, 
  showText = true, 
  size = 18 
}) {
  if (!isEmailVerified && !isPhoneVerified) return null;

  const isFullyVerified = isEmailVerified && isPhoneVerified;
  const label = isFullyVerified ? "Verified Account" : "Verified";
  const badgeColor = "#10b981"; // Premium emerald green
  
  return (
    <span 
      className="verified-badge-container"
      title={label}
      style={{ 
        display: "inline-flex", 
        alignItems: "center", 
        justifyContent: "center",
        gap: "4px", 
        marginLeft: "6px", // 6-8px spacing between name and badge
        verticalAlign: "-0.125em" // Standard icon vertical alignment fine-tuning
      }}
    >
      <BadgeCheck 
        size={size * 0.65} // 35% reduction
        color="white" 
        style={{ 
          fill: badgeColor, 
          filter: "drop-shadow(0 0 3px rgba(16, 185, 129, 0.3))"
        }} 
      />
      {showText && (
        <span style={{ 
          color: badgeColor, 
          fontSize: "0.8em", 
          fontWeight: "700",
          letterSpacing: "-0.01em",
          textShadow: "0 0 6px rgba(16, 185, 129, 0.2)",
          lineHeight: 1
        }}>
          {label}
        </span>
      )}
    </span>
  );
}
