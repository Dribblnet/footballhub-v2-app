import React from "react";
import { Target, Phone, KeyRound, User, Mail, Link as LinkIcon, ArrowRight, ArrowLeft } from "lucide-react";
import CountrySelector from "../settings/CountrySelector";
import BrandLogo from "../../../../components/BrandLogo";

const Card = ({ children }) => (
  <div className="glass-panel" style={{ 
    maxWidth: "440px", width: "100%", padding: "40px", textAlign: "center", 
    border: "1px solid rgba(255,255,255,0.05)", 
    background: "rgba(10, 15, 26, 0.95)", 
    boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.7)",
    borderRadius: "24px",
    position: "relative", zIndex: 10
  }}>
    {children}
  </div>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("OTP PAGE CRASHED", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: "red", padding: "20px" }}>Something went wrong. {this.state.error?.toString()}</div>;
    }
    return this.props.children;
  }
}

export default function AuthPageTablet({
  step, setStep, otpState, setOtpState, countryCode, setCountryCode, phone, setPhone,
  otp, setOtp, email, setEmail, firstName, setFirstName, lastName, setLastName,
  age, setAge, gender, setGender, country, setCountry, preferredFoot, setPreferredFoot,
  position, setPosition, isCompletingProfile, authMode, setAuthMode, isLoading, setIsLoading,
  isRateLimited, countdownString, isLockedOut, lockoutString,
  handleSendEmailOtp, handleVerifyEmailOtp, handleGoogleAuth, handleSendPhoneOtp,
  handleVerifyPhoneOtp, handleLinkPhoneSubmit, handleLinkGoogleSubmit, handleCompleteRegistration,
  renderRateLimitMessage
}) {
  return (
    <ErrorBoundary>
    <div className="" style={{ 
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
      minHeight: "100vh", padding: "20px", margin: 0,
      background: "linear-gradient(135deg, #020617, #0f172a, #020617)",
      position: "relative",
      overflow: "hidden" 
    }}>
      <div className="tablet-only" style={{ position: "absolute", top: "40px", left: "40px", zIndex: 20 }}>
        <BrandLogo size="hero" style={{ filter: "drop-shadow(0 10px 30px rgba(59, 130, 246, 0.3))" }} clickable={false} />
      </div>

      <Card>
        <div 
          id="recaptcha-container" 
          style={{ 
            width: 0,
            height: 0,
            overflow: "hidden"
          }}
        ></div>

        {step !== "AUTH_HOME" && step !== "NEW_PROFILE" && (
           <button onClick={() => {
              if (step === "EMAIL_AUTH" || step === "OTP_VERIFICATION") {
                setStep(authMode || "AUTH_HOME");
              } else {
                setStep("AUTH_HOME");
              }
              setOtpState("IDLE");
              setOtp(""); setIsLoading(false);
           }} style={{ position: "absolute", top: "30px", left: "30px", background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: 0, transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color="white"} onMouseLeave={(e)=>e.currentTarget.style.color="#94a3b8"}>
             <ArrowLeft size={20} />
           </button>
        )}
        
        <p style={{ margin: "0 0 32px 0", color: "#94a3b8", fontSize: "15px", fontWeight: "400", marginTop: "20px" }}>
          {step === "AUTH_HOME" && "Join the community or log back in"}
          {step === "SIGN_UP" && "Create a new Dribbl.net account"}
          {step === "LOG_IN" && "Log in to your account"}
          {step === "EMAIL_AUTH" && "Email Verification"}
          {step === "OTP_VERIFICATION" && `OTP sent to ${email}`}
          {step === "PHONE_INPUT" && "Enter your phone number"}
          {step === "PHONE_OTP" && `OTP sent to ${countryCode} ${phone}`}
          {step === "LINK_PROMPT" && "Account not found. Link an existing one?"}
          {step === "LINK_PHONE" && "Verify your phone number"}
          {step === "LINK_GOOGLE" && "Verify your Google email"}
          {step === "NEW_PROFILE" && "Complete your profile"}
        </p>

        {step === "AUTH_HOME" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <button className="btn-primary" onClick={() => { setAuthMode("SIGN_UP"); setStep("SIGN_UP"); }} style={{ width: "100%", height: "56px", borderRadius: "14px", fontSize: "16px", fontWeight: "600" }}>
              Sign Up
            </button>
            <button onClick={() => { setAuthMode("LOG_IN"); setStep("LOG_IN"); }} style={{ width: "100%", height: "56px", borderRadius: "14px", fontSize: "16px", fontWeight: "600", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", transition: "background 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
              Log In
            </button>
          </div>
        )}

        {(step === "SIGN_UP" || step === "LOG_IN") && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
            <button className="btn-primary" onClick={() => setStep("EMAIL_AUTH")} style={{ width: "100%", height: "56px", borderRadius: "14px", fontSize: "16px", fontWeight: "600", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <Mail size={18} /> Continue with Email
            </button>
            <button onClick={() => setStep("PHONE_INPUT")} style={{ width: "100%", height: "56px", borderRadius: "14px", fontSize: "16px", fontWeight: "600", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "background 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
              <Phone size={18} /> Continue with Phone Number
            </button>
          </div>
        )}

        {step === "EMAIL_AUTH" && (otpState === "IDLE" || otpState === "EMAIL_ENTERED" || otpState === "SENDING_OTP" || otpState === "ERROR") && (
          <form onSubmit={handleSendEmailOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <Mail size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
              <input 
                type="email" 
                className="input-modern" 
                placeholder="name@example.com"
                style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={email}
                onChange={(e) => { setEmail(e.target.value); if(otpState !== "IDLE" && otpState !== "EMAIL_ENTERED"){ setOtpState("EMAIL_ENTERED"); setOtp(""); } }}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                autoFocus
                required
              />
            </div>
            <div>
              <button type="submit" disabled={otpState === "SENDING_OTP" || isRateLimited} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: (otpState === "SENDING_OTP" || isRateLimited) ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {isRateLimited ? `Try again in ${countdownString}` : otpState === "SENDING_OTP" ? "Sending..." : "Email Verification"}
              </button>
              {renderRateLimitMessage()}
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "8px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}></div>
              <span style={{ color: "#64748b", fontSize: "12px", fontWeight: "600" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleAuth}
              style={{ 
                display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", 
                width: "100%", height: "56px", border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", color: "white", fontSize: "16px", fontWeight: "600", cursor: "pointer",
                borderRadius: "14px", transition: "background 0.2s"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
            >
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </form>
        )}

        {step === "PHONE_INPUT" && (
          <form onSubmit={handleSendPhoneOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <CountrySelector value={countryCode} onChange={setCountryCode} />
              <div style={{ position: "relative", flex: 1 }}>
                <Phone size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
                <input 
                  type="tel" 
                  className="input-modern" 
                  placeholder="Phone Number"
                  style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
            </div>
            <div>
              <button type="submit" disabled={isLoading || isRateLimited} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: (isLoading || isRateLimited) ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {isRateLimited ? `Try again in ${countdownString}` : isLoading ? "Sending..." : "Send SMS Code"}
              </button>
              {renderRateLimitMessage()}
            </div>
          </form>
        )}

        {step === "PHONE_OTP" && (
          <form onSubmit={handleVerifyPhoneOtp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ position: "relative" }}>
              <KeyRound size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
              <input 
                type="text" 
                className="input-modern" 
                placeholder="Enter 6-digit code"
                style={{ paddingLeft: "48px", height: "56px", fontSize: "18px", letterSpacing: "6px", textAlign: "center", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                autoFocus
              />
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? "Verifying..." : "Verify & Enter"}
            </button>
          </form>
        )}

        {step === "OTP_VERIFICATION" && (
          <form onSubmit={handleVerifyEmailOtp} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ position: "relative", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", padding: "0 16px" }}>
                <Mail size={16} color="#64748b" />
                <input 
                  type="email" 
                  style={{ height: "56px", fontSize: "14px", width: "100%", background: "transparent", border: "none", color: "#94a3b8", outline: "none" }}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if(otpState !== "IDLE" && otpState !== "EMAIL_ENTERED"){ setOtpState("EMAIL_ENTERED"); setOtp(""); } }}
                />
              </div>
            </div>
            <div style={{ position: "relative" }}>
              <KeyRound size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
              <input 
                type="text" 
                className="input-modern" 
                placeholder="Enter 6-digit code"
                style={{ paddingLeft: "48px", height: "56px", fontSize: "18px", letterSpacing: "6px", textAlign: "center", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                autoFocus
              />
            </div>
            <button type="submit" disabled={otpState === "VERIFYING_OTP" || isLockedOut} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: (otpState === "VERIFYING_OTP" || isLockedOut) ? 0.7 : 1 }}>
              {isLockedOut ? `Locked out (${lockoutString})` : otpState === "VERIFYING_OTP" ? "Verifying..." : "Verify & Enter"}
            </button>
            <div style={{ marginTop: "8px" }}>
              <button type="button" onClick={handleSendEmailOtp} disabled={otpState === "SENDING_OTP" || isRateLimited} style={{ background: "none", border: "none", color: (otpState === "SENDING_OTP" || isRateLimited) ? "#64748b" : "var(--primary)", fontSize: "14px", fontWeight: "600", cursor: (otpState === "SENDING_OTP" || isRateLimited) ? "not-allowed" : "pointer", textDecoration: "underline" }}>
                {isRateLimited ? `Resend OTP in ${countdownString}` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {step === "LINK_PROMPT" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ padding: "20px", background: "rgba(255,255,255,0.03)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", textAlign: "left" }}>
              <p style={{ margin: "0 0 8px 0", fontSize: "15px", color: "white", fontWeight: "600" }}>Account not found.</p>
              <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8", lineHeight: 1.5 }}>If you registered previously using a different method, link them now to retain your stats.</p>
            </div>

            <button onClick={() => setStep("LINK_GOOGLE")} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", height: "56px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "white", fontWeight: "600", cursor: "pointer", borderRadius: "14px", transition: "background 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.1)"} onMouseLeave={(e)=>e.currentTarget.style.background="rgba(255,255,255,0.05)"}>
              <LinkIcon size={18} /> Link Account
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "4px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
              <span style={{ color: "#64748b", fontSize: "12px", fontWeight: "600" }}>OR</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }}></div>
            </div>

            <button onClick={() => setStep("NEW_PROFILE")} className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px" }}>
              Create New Profile <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === "LINK_PHONE" && (
          <form onSubmit={handleLinkPhoneSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "12px" }}>
              <CountrySelector value={countryCode} onChange={setCountryCode} />
              <div style={{ position: "relative", flex: 1 }}>
                <Phone size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
                <input 
                  type="tel" 
                  className="input-modern" 
                  placeholder="Existing Phone"
                  style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  autoFocus
                />
              </div>
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px" }}>
              Verify & Link
            </button>
          </form>
        )}

        {step === "LINK_GOOGLE" && (
          <form onSubmit={handleLinkGoogleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ position: "relative" }}>
              <Mail size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
              <input 
                type="email" 
                className="input-modern" 
                placeholder="Existing Google Email"
                style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px" }}>
              Verify & Link
            </button>
          </form>
        )}

        {step === "NEW_PROFILE" && (
          <form onSubmit={handleCompleteRegistration} style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left" }}>
            
            {/* Required Fields */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ position: "relative", width: "100%" }}>
                <User size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
                <input 
                  type="text" 
                  className="input-modern" 
                  placeholder="First Name *"
                  style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  autoFocus
                  required
                />
              </div>
              <div style={{ position: "relative", width: "100%" }}>
                <input 
                  type="text" 
                  className="input-modern" 
                  placeholder="Last Name *"
                  style={{ paddingLeft: "16px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                  onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  required
                />
              </div>
            </div>

            <div style={{ position: "relative", width: "100%" }}>
              <input 
                type="number" 
                className="input-modern" 
                placeholder="Age *"
                style={{ paddingLeft: "16px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                required
                min="1"
                max="100"
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ width: "100%" }}>
                <select 
                  className="input-modern"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  style={{ height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", paddingLeft: "16px", appearance: "none" }}
                >
                  <option value="" disabled>Gender *</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div style={{ width: "100%" }}>
                <select 
                  className="input-modern"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                  style={{ height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", paddingLeft: "16px", appearance: "none" }}
                >
                  <option value="" disabled>Position *</option>
                  <option value="Forward">Forward</option>
                  <option value="Midfielder">Midfielder</option>
                  <option value="Defender">Defender</option>
                  <option value="Goalkeeper">Goalkeeper</option>
                </select>
              </div>
            </div>

            {/* Optional Fields Container */}
            <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ margin: "0", fontSize: "12px", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>Player Details (Optional)</p>


              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ width: "100%" }}>
                  <select 
                    className="input-modern"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    style={{ height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", paddingLeft: "16px", appearance: "none" }}
                  >
                    <option value="" disabled>Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                    <option value="Spain">Spain</option>
                    <option value="Italy">Italy</option>
                    <option value="Japan">Japan</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Mexico">Mexico</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Portugal">Portugal</option>
                  </select>
                </div>
                <div style={{ width: "100%" }}>
                  <select 
                    className="input-modern"
                    value={preferredFoot}
                    onChange={(e) => setPreferredFoot(e.target.value)}
                    style={{ height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", paddingLeft: "16px", appearance: "none" }}
                  >
                    <option value="" disabled>Preferred Foot</option>
                    <option value="Right">Right</option>
                    <option value="Left">Left</option>
                    <option value="Both">Both</option>
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isCompletingProfile} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", marginTop: "8px", opacity: isCompletingProfile ? 0.7 : 1 }}>
              {isCompletingProfile ? "Saving Profile..." : "Complete Profile"}
            </button>
          </form>
        )}

      </Card>
    </div>
    </ErrorBoundary>
  );
}
