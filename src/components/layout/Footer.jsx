import { Camera, Hash, PlayCircle, MessageSquare, Briefcase, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "../BrandLogo";

export default function Footer() {
  const location = useLocation();
  
  const getLinkStyle = (path) => {
    // Exact match for Home, prefix match for others to prevent '/' being always active
    const isActive = path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
    return {
      textDecoration: "none",
      color: isActive ? "var(--primary)" : "inherit",
      fontSize: "14px",
      fontWeight: isActive ? "800" : "500",
      transition: "all 0.2s ease",
      textShadow: isActive ? "0 0 10px rgba(59, 130, 246, 0.5)" : "none",
      display: "block",
      padding: "2px 0"
    };
  };
  return (
    <footer style={{
      position: "relative",
      background: "#050a15", // Deep charcoal/midnight blue base
      color: "var(--text-muted)",
      padding: "80px 20px 40px",
      marginTop: "auto",
      overflow: "hidden",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
    }}>
      
      {/* Stadium Glow Background Effects */}
      <div style={{
        position: "absolute", top: 0, left: "20%", width: "40vw", height: "400px",
        background: "radial-gradient(ellipse at top, rgba(37, 99, 235, 0.08), transparent 70%)",
        pointerEvents: "none"
      }} />
      <div style={{
        position: "absolute", top: 0, right: "10%", width: "30vw", height: "300px",
        background: "radial-gradient(ellipse at top, rgba(245, 158, 11, 0.05), transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 10
      }}>
        
        {/* Main Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          marginBottom: "60px"
        }}>
          
          {/* 1. BRAND SECTION */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px", gridColumn: "1 / -1", '@media (min-width: 768px)': { gridColumn: "span 2" } }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <BrandLogo size="large" />
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", lineHeight: "1.6", maxWidth: "300px", margin: "0 auto 20px", textAlign: "left" }}>
              Your ultimate grassroots football community and match organization platform.
            </p>
          </div>

          {/* 2. QUICK LINKS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ color: "white", margin: 0, fontSize: "16px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Quick Links</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "Home", path: "/" },
                { label: "Matches", path: "/history" },
                { label: "Marketplace", path: "/marketplace" },
                { label: "Tournaments", path: "/tournaments" },
                { label: "Turfs", path: "/turfs" },
                { label: "Leaderboards", path: "/stats" }
              ].map(link => (
                <Link 
                  key={link.label} 
                  to={link.path} 
                  className="footer-link" 
                  style={getLinkStyle(link.path)}
                  onClick={() => window.scrollTo(0, 0)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 3. INFORMATION */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h4 style={{ color: "white", margin: 0, fontSize: "16px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Information</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                { label: "About Us", path: "/policies" },
                { label: "Contact Us", path: "#", onClick: (e) => { e.preventDefault(); window.open("mailto:support@Dribbl.net.com"); } },
                { label: "Policies", path: "/policies" },
                { label: "Privacy Policy", path: "/policies" },
                { label: "Terms of Service", path: "/policies" },
                { label: "Community Guidelines", path: "/policies" },
                { label: "Tournament Rules", path: "/policies" }
              ].map(link => (
                <Link 
                  key={link.label} 
                  to={link.path} 
                  className="footer-link" 
                  style={getLinkStyle(link.path)}
                  onClick={(e) => {
                    if (link.onClick) {
                      link.onClick(e);
                    } else {
                      window.scrollTo(0, 0);
                    }
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* 4. COMMUNITY & SOCIALS */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <h4 style={{ color: "white", margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase" }}>Community</h4>
              <div style={{ display: "flex", gap: "12px" }}>
                {[
                  { icon: <Camera size={18} />, label: "Instagram" },
                  { icon: <Hash size={18} />, label: "X (Twitter)" },
                  { icon: <PlayCircle size={18} />, label: "YouTube" },
                  { icon: <MessageSquare size={18} />, label: "Discord" },
                  { icon: <Briefcase size={18} />, label: "LinkedIn" }
                ].map((social, i) => (
                  <Link key={i} to="#" className="social-icon" style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "36px", height: "36px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.05)",
                    color: "white", textDecoration: "none",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  }} aria-label={social.label}>
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div style={{ 
          display: "flex", flexDirection: "column", gap: "15px", alignItems: "center", justifyContent: "space-between",
          paddingTop: "30px", borderTop: "1px solid rgba(255,255,255,0.05)",
          textAlign: "center"
        }} className="footer-bottom">
          <p style={{ margin: 0, fontSize: "12px", opacity: 0.6 }}>
            &copy; {new Date().getFullYear()} Dribbl.net. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: "20px", fontSize: "12px", opacity: 0.6 }}>
            <span>Made for the beautiful game.</span>
          </div>
        </div>

      </div>

      <style>{`
        /* Hover Effects */
        .footer-link:hover {
          color: white !important;
          text-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
        
        .social-icon:hover {
          background: var(--primary) !important;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 5px 15px rgba(37, 99, 235, 0.4);
        }

        .newsletter-input:focus-within {
          border-color: var(--primary) !important;
          box-shadow: 0 0 0 1px var(--primary);
        }

        .btn-newsletter:hover {
          background: #1d4ed8 !important; /* darker blue */
        }

        /* Responsive */
        @media (min-width: 768px) {
          .footer-bottom {
            flex-direction: row !important;
            text-align: left !important;
          }
        }
      `}</style>
    </footer>
  );
}
