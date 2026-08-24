import React from "react";
import { INDIA_LOCATIONS, STATES } from "../../../../utils/indiaLocations";
import { Target, Phone, KeyRound, User, Mail, Link as LinkIcon, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
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

export default function AuthPageDesktop({
  step, setStep, otpState, setOtpState, countryCode, setCountryCode, phone, setPhone,
  otp, setOtp, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, firstName, setFirstName, lastName, setLastName,
  age, setAge, gender, setGender, country, setCountry, state, setState, city, setCity, preferredFoot, setPreferredFoot,
  position, setPosition, isCompletingProfile, authMode, setAuthMode, isLoading, setIsLoading,
  isRateLimited, countdownString, isLockedOut, lockoutString,
  handleSendEmailOtp, handleVerifyEmailOtp, handleEmailPasswordAuth, handleForgotPasswordSubmit, handleSendPhoneOtp,
  handleVerifyPhoneOtp, handleLinkPhoneSubmit, handleCompleteRegistration,
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
      <div className="desktop-only" style={{ position: "absolute", top: "40px", left: "60px", zIndex: 20 }}>
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
                setOtpState("IDLE");
              } else if (step === "FORGOT_PASSWORD") {
                if (otpState === "VERIFIED") setOtpState("OTP_SENT");
                else if (otpState === "OTP_SENT" || otpState === "ERROR") setOtpState("IDLE");
                else setStep("LOG_IN");
              } else {
                setStep("AUTH_HOME");
                setOtpState("IDLE");
              }
              setOtp(""); setIsLoading(false);
           }} style={{ position: "absolute", top: "30px", left: "30px", background: "transparent", border: "none", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", padding: 0, transition: "color 0.2s" }} onMouseEnter={(e)=>e.currentTarget.style.color="white"} onMouseLeave={(e)=>e.currentTarget.style.color="#94a3b8"}>
             <ArrowLeft size={20} />
           </button>
        )}
        
        <p style={{ margin: "0 0 32px 0", color: "#94a3b8", fontSize: "15px", fontWeight: "400", marginTop: "20px" }}>
          {step === "AUTH_HOME" && "Join the community or log back in"}
          {step === "SIGN_UP" && "Create a new Dribbl.net account"}
          {step === "LOG_IN" && "Log in to your account"}
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
          </div>
        )}
          
        {step === "EMAIL_AUTH" && (
          <form onSubmit={handleEmailPasswordAuth} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div style={{ position: "relative" }}>
              <Mail size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
              <input 
                type="email" 
                className="input-modern" 
                placeholder="name@example.com"
                style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                autoFocus
                required
              />
            </div>
            
            {(authMode === "SIGN_UP" || authMode === "LOG_IN") && (
              <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-modern" 
                placeholder={authMode === "SIGN_UP" ? "Password (min 6 chars)" : "Password"}
                style={{ paddingLeft: "16px", paddingRight: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                required={authMode === "SIGN_UP"}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "16px", top: "18px", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            )}
            
            {authMode === "LOG_IN" && (
              <div style={{ textAlign: "right", marginTop: "-12px" }}>
                <button type="button" onClick={() => setStep("FORGOT_PASSWORD")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "14px", fontWeight: "600", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e)=>e.target.style.color="#60a5fa"} onMouseLeave={(e)=>e.target.style.color="var(--primary)"}>
                  Forgot Password?
                </button>
              </div>
            )}

            <div>
              <button type="submit" disabled={isLoading} className="btn-primary btn-hover-effect" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: isLoading ? 0.6 : 1, transition: "all 0.2s" }}>
                {authMode === "LOG_IN" ? (isLoading ? "Logging in..." : "Log In") : (isLoading ? "Signing up..." : "Sign Up")}
              </button>
            </div>

            {authMode === "LOG_IN" && (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "4px 0" }}>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}></div>
                  <span style={{ color: "#64748b", fontSize: "12px", fontWeight: "600" }}>OR</span>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)" }}></div>
                </div>

                <div>
                  <button type="button" onClick={handleSendEmailOtp} disabled={isLoading || otpState === "SENDING_OTP"} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "white", opacity: (isLoading || otpState === "SENDING_OTP") ? 0.6 : 1, transition: "opacity 0.2s" }}>
                    {otpState === "SENDING_OTP" ? "Sending OTP..." : "Send OTP to Email"}
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {step === "FORGOT_PASSWORD" && otpState === "IDLE" && (
          <form onSubmit={handleSendEmailOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 8px 0" }}>Enter your registered email to receive a password reset code.</p>
            <div style={{ position: "relative" }}>
              <Mail size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
              <input 
                type="email" 
                className="input-modern" 
                placeholder="name@example.com"
                style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                autoFocus
                required
              />
            </div>
            <div>
              <button type="submit" disabled={otpState === "SENDING_OTP" || isRateLimited} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: (otpState === "SENDING_OTP" || isRateLimited) ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {isRateLimited ? `Try again in ${countdownString}` : otpState === "SENDING_OTP" ? "Sending..." : "Send Reset Code"}
              </button>
              {renderRateLimitMessage()}
            </div>
          </form>
        )}

        {step === "FORGOT_PASSWORD" && (otpState === "OTP_SENT" || otpState === "VERIFYING_OTP" || otpState === "ERROR") && (
          <form onSubmit={handleVerifyEmailOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 8px 0" }}>Enter the 6-digit code sent to {email}</p>
            <div style={{ position: "relative" }}>
              <input 
                type="text" 
                className="input-modern" 
                placeholder="Enter 6-digit code"
                style={{ paddingLeft: "16px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s", letterSpacing: "4px", textAlign: "center" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                maxLength={6}
                autoFocus
                required
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button type="submit" disabled={otp.length !== 6 || isLoading} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: (otp.length !== 6 || isLoading) ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {isLoading ? "Verifying..." : "Verify Code"}
              </button>
              <button type="button" onClick={handleSendEmailOtp} disabled={isRateLimited || isLoading} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "14px", cursor: "pointer", opacity: (isRateLimited || isLoading) ? 0.5 : 1 }}>
                {isRateLimited ? `Resend in ${countdownString}` : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {step === "FORGOT_PASSWORD" && otpState === "VERIFIED" && (
          <form onSubmit={handleForgotPasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 8px 0" }}>Create a new password for your account.</p>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-modern" 
                placeholder="New Password (min 6 chars)"
                style={{ paddingLeft: "16px", paddingRight: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: "16px", top: "18px", background: "none", border: "none", color: "#64748b", cursor: "pointer", padding: 0 }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div style={{ position: "relative" }}>
              <input 
                type={showPassword ? "text" : "password"} 
                className="input-modern" 
                placeholder="Confirm New Password"
                style={{ paddingLeft: "16px", paddingRight: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={(e) => e.target.style.borderColor = "var(--primary)"}
                onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                required
              />
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="btn-primary" style={{ width: "100%", height: "56px", fontSize: "16px", fontWeight: "600", borderRadius: "14px", opacity: isLoading ? 0.6 : 1, transition: "opacity 0.2s" }}>
                {isLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
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

            {/* Phone Input */}
            <div style={{ display: "flex", gap: "12px", width: "100%" }}>
              <CountrySelector value={countryCode} onChange={setCountryCode} />
              <div style={{ position: "relative", flex: 1 }}>
                <Phone size={20} color="#64748b" style={{ position: "absolute", left: "16px", top: "18px" }} />
                <input 
                  type="tel" 
                  className="input-modern" 
                  placeholder="Mobile Number *"
                  style={{ paddingLeft: "48px", height: "56px", fontSize: "16px", width: "100%", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
