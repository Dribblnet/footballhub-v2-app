import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Camera, AtSign, MessageCircle, Mail, MessageSquare } from "lucide-react";
import BrandLogo from "../BrandLogo";
import FeedbackModal from "./FeedbackModal";

export default function Footer() {
  const location = useLocation();
  const [showFeedback, setShowFeedback] = useState(false);
  
  const getLinkStyle = (path) => {
    // Exact match for Home, prefix match for others to prevent '/' being always active
    const isActive = path === "/" ? location.pathname === "/" : (path !== "#" && location.pathname.startsWith(path));
    return {
      textDecoration: "none",
      color: isActive ? "var(--accent)" : "inherit",
      fontSize: "15px",
      fontWeight: isActive ? "700" : "500",
      transition: "all 0.2s ease",
      display: "inline-block",
      padding: "4px 0"
    };
  };

  return (
    <footer style={{
      position: "relative",
      background: "#030712", // Deeper navy/black for premium feel
      color: "var(--text-muted)",
      padding: "80px 20px 30px",
      marginTop: "auto",
      overflow: "hidden",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)"
    }}>
      
      {/* Subtle Background Glow */}
      <div style={{
        position: "absolute", top: 0, left: "20%", width: "40vw", height: "400px",
        background: "radial-gradient(ellipse at top, rgba(37, 99, 235, 0.05), transparent 70%)",
        pointerEvents: "none"
      }} />

      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        position: "relative",
        zIndex: 10
      }}>
        
        {/* Main Footer Layout */}
        <div className="footer-top-layout">
          
          {/* Left Side: 4 Nav Columns */}
          <div className="footer-nav-grid">
            
            {/* 1. PLATFORM */}
            <div className="footer-col">
              <h4 className="footer-heading">Platform</h4>
              <div className="footer-links">
                {[
                  { label: "Home", path: "/" },
                  { label: "Create Match", path: "/create-match" },
                  { label: "Players", path: "/search" },
                  { label: "Matches", path: "/history" },
                  { label: "Tournaments", path: "/tournaments" },
                  { label: "Leaderboard", path: "/leaderboards" }
                ].map(link => (
                  <Link key={link.label} to={link.path} className="footer-link" style={getLinkStyle(link.path)} onClick={() => window.scrollTo(0, 0)}>{link.label}</Link>
                ))}
              </div>
            </div>

            {/* 2. COMMUNITY / SECOND SECTION */}
            <div className="footer-col">
              <h4 className="footer-heading">Community</h4>
              <div className="footer-links">
                {[
                  { label: "Find Players", path: "/search" },
                  { label: "Stats", path: "/stats" },
                  { label: "Marketplace", path: "/marketplace" }
                ].map(link => (
                  <Link key={link.label} to={link.path} className="footer-link" style={getLinkStyle(link.path)} onClick={() => window.scrollTo(0, 0)}>{link.label}</Link>
                ))}
              </div>
            </div>

            {/* 3. INFORMATION & SUPPORT */}
            <div className="footer-col">
              <h4 className="footer-heading">Information & Support</h4>
              <div className="footer-links">
                {[
                  { label: "About Us", path: "/about" },
                  { label: "Contact Us", path: "#", onClick: (e) => { e.preventDefault(); window.open("mailto:dribblnet@gmail.com"); } },
                  { label: "Help Center", path: "/safety" },
                  { label: "Privacy Policy", path: "/policies" },
                  { label: "Terms of Service", path: "/policies" },
                  { label: "Community Guidelines", path: "/policies" }
                ].map(link => (
                  <Link 
                    key={link.label} 
                    to={link.path} 
                    className="footer-link" 
                    style={getLinkStyle(link.path)}
                    onClick={(e) => {
                      if (link.onClick) link.onClick(e);
                      else window.scrollTo(0, 0);
                    }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* 4. CONTACT */}
            <div className="footer-col contact-col">
              <h4 className="footer-heading">Contact</h4>
              <div className="footer-links" style={{ gap: "16px" }}>
                <a href="mailto:dribblnet@gmail.com" className="email-link">
                  <Mail size={18} color="var(--accent)" />
                  <span>dribblnet@gmail.com</span>
                </a>
                
                <button 
                  onClick={() => setShowFeedback(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: 'white', padding: '10px 14px', borderRadius: '10px',
                    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                    transition: 'all 0.2s ease', width: 'fit-content'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    e.currentTarget.style.borderColor = 'var(--accent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                  }}
                >
                  <MessageSquare size={16} color="var(--accent)" />
                  Suggestions & Feedback
                </button>

                <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.6", color: "var(--text-muted)", opacity: 0.8 }}>
                  We're here to help with matches, players, accounts and general enquiries.
                </p>
              </div>
            </div>

          </div>

          {/* Right Side: Brand Section */}
          <div className="footer-brand-section">
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "flex-start",
              height: "clamp(60px, 8vw + 20px, 110px)",
              width: "100%",
              overflow: "hidden",
              marginBottom: "16px"
            }}>
              <BrandLogo size="footer" />
            </div>
            
            <p style={{ margin: "0 0 24px 0", fontSize: "15px", lineHeight: "1.6", color: "var(--text-muted)", opacity: 0.8 }}>
              Your grassroots football community and match organization platform. Connect with players, organize matches, track performance and grow the game around you.
            </p>
            
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
              {/* Instagram */}
              <a href="https://www.instagram.com/dribbl_net/" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Instagram">
                <Camera size={18} />
              </a>
              {/* Threads */}
              <a href="https://www.threads.net/@dribbl_net" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="Threads">
                <AtSign size={18} />
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/918866314448" target="_blank" rel="noopener noreferrer" className="social-icon whatsapp-icon" aria-label="WhatsApp">
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="footer-bottom">
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} Dribbl. All rights reserved.
          </p>
        </div>

      </div>

      {showFeedback && <FeedbackModal onClose={() => setShowFeedback(false)} />}

      <style>{`
        .footer-top-layout {
          display: flex;
          flex-direction: column;
          gap: 60px;
          margin-bottom: 60px;
          align-items: flex-start;
        }
        
        .footer-nav-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 40px;
          flex: 1;
          width: 100%;
        }

        .footer-brand-section {
          flex: 0 0 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          width: 100%;
        }

        .footer-heading {
          color: white;
          margin: 0 0 24px 0;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        .footer-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .email-link {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: white;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.2s ease;
        }
        
        .email-link:hover {
          color: var(--accent);
        }

        /* Hover Effects */
        .footer-link {
          position: relative;
        }
        
        .footer-link:hover {
          color: white !important;
          transform: translateX(3px);
        }

        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          color: white;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .social-icon:hover {
          background: rgba(16, 185, 129, 0.1) !important; /* accent green bg */
          color: var(--accent) !important;
          border-color: var(--accent);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.2);
        }

        /* Distinctive WhatsApp Hover */
        .whatsapp-icon:hover {
          background: rgba(37, 211, 102, 0.15) !important;
          color: #25D366 !important;
          border-color: #25D366;
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }

        .footer-bottom {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding-top: 30px;
          border-top: 1px solid rgba(255,255,255,0.05);
          text-align: center;
          font-size: 14px;
          color: var(--text-muted);
          opacity: 0.6;
        }

        /* Responsive Desktop */
        @media (min-width: 1024px) {
          .footer-top-layout {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .footer-nav-grid {
            flex: 2;
            padding-right: 60px;
            border-right: 1px solid rgba(255,255,255,0.05);
            grid-template-columns: repeat(4, 1fr);
          }
          
          .footer-brand-section {
            flex: 1;
            max-width: 420px;
            padding-left: 40px;
          }
        }
        
        @media (min-width: 768px) and (max-width: 1023px) {
           .footer-nav-grid {
              grid-template-columns: repeat(2, 1fr);
           }
        }
      `}</style>
    </footer>
  );
}
