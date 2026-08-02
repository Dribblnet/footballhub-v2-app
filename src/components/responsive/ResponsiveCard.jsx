import { useMediaQuery } from "../../hooks/useMediaQuery";

export default function ResponsiveCard({ children, style, className = "" }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div
      className={`glass-panel ${className}`}
      style={{
        padding: isMobile ? "16px" : "24px",
        borderRadius: isMobile ? "16px" : "20px",
        ...style
      }}
    >
      {children}
    </div>
  );
}
