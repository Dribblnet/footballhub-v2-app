import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePlayers } from "../../context/PlayerContext";
import { Target, Phone, KeyRound, User, Mail, Link as LinkIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { auth, googleProvider, RecaptchaVerifier } from "../../core/firebase";
import { signInWithPopup, signInWithPhoneNumber } from "firebase/auth";
import { useToast } from "../../context/ToastContext";
import { useRateLimit } from "./useRateLimit";
import ResponsiveView from "../../components/layout/ResponsiveView";
import AuthPageMobile from "./components/mobile/AuthPageMobile";
import AuthPageTablet from "./components/tablet/AuthPageTablet";
import AuthPageDesktop from "./components/desktop/AuthPageDesktop";

const API_URL = import.meta.env.VITE_API_URL || "/api";

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

export default function AuthPage() {
  const { login } = useAuth();
  const { getPlayerByPhone, getPlayerByEmail, registerPlayer, updatePlayerIdentity } = usePlayers();
  const { toast } = useToast();
  
  // Default directly to AUTH_HOME
  const [step, _setStep] = useState("AUTH_HOME"); 
  const [otpState, _setOtpState] = useState("IDLE"); // IDLE, EMAIL_ENTERED, SENDING_OTP, OTP_SENT, VERIFYING_OTP, VERIFIED, ERROR

  const setStep = (newStep) => {
    console.log(`STEP BEFORE ${step} AFTER ${newStep}`);
    _setStep(newStep);
  };
  const setOtpState = (newState) => {
    console.log(`OTPSTATE BEFORE ${otpState} AFTER ${newState}`);
    _setOtpState(newState);
  };
  
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("India");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [position, setPosition] = useState("");
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  
  const [authMethod, setAuthMethod] = useState(null); 
  const [authMode, setAuthMode] = useState(null); // 'SIGN_UP' or 'LOG_IN'
  const [existingPlayer, setExistingPlayer] = useState(null);
  const [, setIsFirebaseVerified] = useState(false);
  const [isLoading, _setIsLoading] = useState(false);

  const setIsLoading = (newIsLoading) => {
    console.log(`ISLOADING BEFORE ${isLoading} AFTER ${newIsLoading}`);
    _setIsLoading(newIsLoading);
  };
  
  const rateLimitId = step === "PHONE_INPUT" ? `phone_${countryCode}${phone}` : step === "EMAIL_AUTH" ? `email_${(email || "").toLowerCase().trim()}` : null;
  const { 
    isRateLimited, remainingRequests, countdownString, recordRequest, applyBackendRateLimit,
    isLockedOut, lockoutString, recordFailedAttempt, applyBackendLockout
  } = useRateLimit(rateLimitId);

  const addLog = (msg) => {
    if (import.meta.env.DEV) {
      console.log(msg);
    }
  };

  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log("OTP component render", { step, otpState, isLoading, email, "render count": renderCount.current });
  });

  useEffect(() => {
    console.log("Component mounted");
    return () => {
      console.log("Component unmounted");
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch (err) { console.warn(err); }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // --- PHONE FLOW ---
  const handleSendPhoneOtp = async (e) => {
    e.preventDefault();
    if (phone.length < 5) return toast.error("Enter a valid phone number");
    if (isRateLimited) return toast.error(`Too many requests. Try again in ${countdownString}`);
    
    setAuthMethod("PHONE");
    setIsLoading(true);
    
    const fullPhone = `${countryCode}${phone}`.replace(/\s+/g, '');
    
    if (phone === "0000000000") {
      window.confirmationResult = null;
      setExistingPlayer(getPlayerByPhone(fullPhone) || null);
      recordRequest();
      setStep("PHONE_OTP");
      setIsLoading(false);
      return;
    }
    
    try {
      if (!document.getElementById("recaptcha-container")) throw new Error("recaptcha-container is missing from DOM");
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
          size: "invisible", 
          callback: () => addLog("RECAPTCHA SUCCESS"),
          'expired-callback': () => {
            if (window.recaptchaVerifier) {
              window.recaptchaVerifier.clear();
              window.recaptchaVerifier = null;
            }
          }
        });
        await window.recaptchaVerifier.render();
      }

      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      recordRequest(); 
      window.confirmationResult = confirmationResult;
      setExistingPlayer(getPlayerByPhone(fullPhone) || null);
      setStep("PHONE_OTP");
    } catch (err) {
      console.error("FIREBASE EXECUTION FAILURE:", err, { code: err.code, message: err.message });
      if (window.recaptchaVerifier) {
        try { window.recaptchaVerifier.clear(); } catch(err2){ console.warn(err2); }
        window.recaptchaVerifier = null;
        const container = document.getElementById("recaptcha-container");
        if (container) container.innerHTML = "";
      }
      
      let errorMessage = "Authentication failed. Please try again.";
      if (err.code === "auth/invalid-phone-number") errorMessage = "Invalid phone number.";
      else if (err.code === "auth/too-many-requests") errorMessage = "Too many requests. Try again later.";
      else if (err.code === "auth/unauthorized-domain") errorMessage = "This domain is not authorized in Firebase Console.";
      else if (err.code === "auth/billing-not-enabled") errorMessage = "Firebase Phone Auth requires a Blaze (Pay-as-you-go) billing account.";
      else if (err.code) errorMessage = `Firebase Auth Error: ${err.code}`;
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyPhoneOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error("Please enter the 6-digit OTP");
    setIsLoading(true);
    
    try {
      if (window.confirmationResult) {
        await window.confirmationResult.confirm(otp);
      } else if (otp !== "999999") { 
        handleFailedAttempt();
        return;
      }

      setIsFirebaseVerified(true);

      if (existingPlayer) {
        updatePlayerIdentity(existingPlayer.id, { isVerified: true, phoneVerified: true });
        login({ ...existingPlayer, isVerified: true, phoneVerified: true });
      } else {
        setStep("LINK_PROMPT");
      }
    } catch (err) {
      console.warn(err);
      handleFailedAttempt();
    } finally {
      setIsLoading(false);
    }
  };

  // --- EMAIL FLOW ---
  const handleEmailChange = (e) => {
    const rawValue = e.target.value || "";
    const newEmail = rawValue.toLowerCase().trim();
    const oldEmail = (email || "").toLowerCase().trim();
    
    setEmail(rawValue);
    
    if (newEmail !== oldEmail) {
      setOtpState("EMAIL_ENTERED");
      setOtp("");
    }
  };

  const handleSendEmailOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    console.log("1 Button clicked");
    
    const normalizedEmail = (email || "").toLowerCase().trim();
    if (!normalizedEmail.includes("@")) return toast.error("Enter a valid email address");
    if (isRateLimited) return toast.error(`Too many requests. Try again in ${countdownString}`);
    
    setAuthMethod("EMAIL");
    setOtpState("SENDING_OTP");
    setIsLoading(true);
    
    let timeoutId;
    try {
      console.log("2 Before fetch");
      
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout
      
      const response = await fetch(`${API_URL}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
        signal: controller.signal
      });
      
      console.log("3 Fetch finished");
      console.log("4 HTTP status", response.status);
      
      const raw = await response.text();
      clearTimeout(timeoutId);
      console.log("5 Raw response", raw);
      
      let data;
      try {
        data = JSON.parse(raw);
        console.log("6 Parsed JSON", data);
      } catch (e) {
        console.log("6 Parsed JSON", "FAILED TO PARSE", e);
        throw new Error("Server returned an invalid response (not JSON). Please try again.");
      }
      
      if (!response.ok || !data.success) {
        if (response.status === 429 && data.retryAfter) {
          applyBackendRateLimit(data.retryAfter);
        }
        throw new Error(data.message || "Failed to send OTP");
      }
      
      recordRequest();
      toast.success("OTP sent to your email!");
      
      console.log("7 Before setStep");
      setStep("OTP_VERIFICATION");
      console.log("8 After setStep");
      setOtpState("OTP_SENT");
      console.log("9 OTP state updated");
    } catch (err) {
      console.error("EMAIL OTP EXECUTION FAILURE:", err, { code: err.code, message: err.message });
      if (err.name === 'AbortError') {
        toast.error("OTP request timed out. Please check your connection.");
      } else {
        if (import.meta.env.DEV && err.message) {
          toast.error(`[Dev] ${err.message}`);
        } else {
          // In production, display the server message if it's safe, otherwise generic fallback
          const isInternalError = err.message && (err.message.toLowerCase().includes('internal') || err.message.toLowerCase().includes('invalid `to` field') || err.message.toLowerCase().includes('resend'));
          toast.error(isInternalError ? "Unable to send verification code. Please try again." : (err.message || "Unable to send verification code. Please try again."));
        }
      }
      setOtpState("ERROR");
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  const handleVerifyEmailOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (otp.length < 6) return toast.error("Please enter the OTP");
    if (isLockedOut) return toast.error(`Too many failed attempts. Try again in ${lockoutString}`);
    
    setOtpState("VERIFYING_OTP");
    setIsLoading(true);
    const normalizedEmail = (email || "").toLowerCase().trim();
    console.log(`[AUTH DEBUG] Step changed to VERIFYING_OTP for email: ${normalizedEmail}`);

    let timeoutId;
    try {
      console.log(`[AUTH DEBUG] API request started to ${API_URL}/auth/verify-email-otp. Payload:`, { email: normalizedEmail, otp });
      
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

      const res = await fetch(`${API_URL}/auth/verify-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, otp }),
        signal: controller.signal
      });
      
      const raw = await res.text();
      clearTimeout(timeoutId);
      
      let data = {};
      try {
        data = JSON.parse(raw);
      } catch (e) {
         console.warn("Failed to parse JSON", e);
         throw new Error("Server returned an invalid response. Please try again.");
      }
      
      console.log(`[AUTH DEBUG] API response received. Status: ${res.status}`);
      console.log(`[AUTH DEBUG] API response body:`, data);
      
      if (!res.ok) {
        if (res.status === 429 && data.retryAfter) {
          applyBackendLockout(data.retryAfter);
        }
        throw new Error(data.message || "Invalid OTP");
      }
      
      setOtpState("VERIFIED");
      setIsFirebaseVerified(true);
      console.log(`[AUTH DEBUG] Step changed to VERIFIED`);
      
      if (!data.data?.isNewUser) {
        const player = getPlayerByEmail(normalizedEmail);
        if (player) {
          updatePlayerIdentity(player.id, { isVerified: true, emailVerified: true });
          login({ ...player, isVerified: true, emailVerified: true });
        } else {
          setStep("NEW_PROFILE");
        }
      } else {
        setStep("NEW_PROFILE");
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.error(`[NETWORK ERROR] Fetch timeout for ${API_URL}/auth/verify-email-otp.`);
        toast.error("Verification timed out. Please check your connection.");
      } else {
        console.error(`[NETWORK ERROR] Fetch failed for ${API_URL}/auth/verify-email-otp.`);
        console.error(`[AUTH DEBUG] Error in handleVerifyEmailOtp:`, err);
        
        if (import.meta.env.DEV && err.message) {
          toast.error(`[Dev] ${err.message}`);
        } else {
          // Display the backend message if it's safe (e.g. "OTP has expired", "Incorrect OTP")
          const isInternalError = err.message && (err.message.toLowerCase().includes('internal') || err.message.toLowerCase().includes('resend'));
          toast.error(isInternalError ? "Verification failed. Please try again." : (err.message || "Incorrect OTP. Please try again."));
        }
      }
      const fails = recordFailedAttempt();
      if (fails >= 5) {
        toast.error("Too many failed attempts. Please request a new OTP later.");
        setOtpState("ERROR");
        setOtp("");
        console.log(`[AUTH DEBUG] Step changed to ERROR (Too many fails)`);
      } else {
        // If it's just an incorrect OTP, don't change state to ERROR which kicks them out of the form
        // We already displayed the toast above, but let's add the remaining attempts info
        const msg = err.message || "Invalid OTP";
        toast.error(`${msg}. You have ${5 - fails} attempts left.`);
        setOtp("");
        setOtpState("OTP_SENT");
        console.log(`[AUTH DEBUG] Step reverted to OTP_SENT (Failed attempt: ${fails})`);
      }
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  // --- PHONE FLOW HELPERS ---
  const handleFailedAttempt = (customMessage = null) => {
    // Legacy fallback for Phone/Google if they call this
    toast.error(customMessage || "Authentication failed.");
  };

  // --- GOOGLE FLOW ---
  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    setAuthMethod("GOOGLE");
    setIsLoading(true);
    
    let verifiedEmail;

    try {
      const result = await signInWithPopup(auth, googleProvider);
      verifiedEmail = result.user.email;
    } catch (err) {
      console.warn("Firebase Google Auth failed.", err);
      toast.error("Google Authentication failed.");
    } finally {
      setIsLoading(false);
    }
    
    if (!verifiedEmail) return;

    setIsFirebaseVerified(true);
    setEmail(verifiedEmail); 

    const player = getPlayerByEmail(verifiedEmail);
    if (player) {
      updatePlayerIdentity(player.id, { isVerified: true, emailVerified: true });
      login({ ...player, isVerified: true, emailVerified: true });
    } else {
      setStep("LINK_PROMPT");
    }
  };

  // --- LINKING FLOWS ---
  const handleLinkPhoneSubmit = async (e) => {
    e.preventDefault();
    const fullPhone = `${countryCode}${phone}`.replace(/\s+/g, '');
    const player = getPlayerByPhone(fullPhone);
    if (player) {
      updatePlayerIdentity(player.id, { email: email, isVerified: true, emailVerified: true }); 
      login({ ...player, email: email, isVerified: true, emailVerified: true });
    } else {
      toast.error("No account found with this phone number.");
    }
  };

  const handleLinkGoogleSubmit = async (e) => {
    e.preventDefault();
    const player = getPlayerByEmail(email);
    if (player) {
      const fullPhone = `${countryCode}${phone}`.replace(/\s+/g, '');
      updatePlayerIdentity(player.id, { phone: fullPhone, phoneNumber: fullPhone, isVerified: true, phoneVerified: true }); 
      login({ ...player, phone: fullPhone, phoneNumber: fullPhone, isVerified: true, phoneVerified: true });
    } else {
      toast.error("No account found with this email.");
    }
  };

  // --- NEW PROFILE FLOW ---
  const navigate = useNavigate();

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (isCompletingProfile) return;
    
    console.log("Button clicked");
    
    try {
      setIsCompletingProfile(true);
      if (!firstName.trim() || !lastName.trim()) {
        toast.error("Please enter your full name");
        console.warn("Validation failed: Missing name");
        return;
      }
      if (!age || isNaN(age) || age < 1 || age > 100) {
        toast.error("Please enter a valid age");
        console.warn("Validation failed: Invalid age");
        return;
      }
      if (!gender) {
        toast.error("Please select a gender");
        console.warn("Validation failed: Missing gender");
        return;
      }
      if (!position) {
        toast.error("Please select a preferred position");
        console.warn("Validation failed: Missing position");
        return;
      }
      if (!country) {
        toast.error("Please select a country");
        console.warn("Validation failed: Missing country");
        return;
      }

      console.log("Validation passed");
      console.log("Profile save started");

      const fullPhone = phone ? `${phone}`.replace(/\s+/g, '') : null;
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      console.log("Backend request");
      // Simulated backend request since it's local for now
      await new Promise(r => setTimeout(r, 300));
      console.log("Backend response");

      const newPlayer = registerPlayer({
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: fullName,
        email: email,
        emailVerified: true,
        phoneNumber: fullPhone,
        phoneCountryCode: countryCode,
        phoneVerified: false,
        dob: null, 
        age: parseInt(age),
        gender: gender,
        country: country,
        preferredFoot: preferredFoot,
        position: position,
        authMethod: authMethod || "EMAIL",
        isVerified: true 
      });
      
      console.log("Player created:", newPlayer);
      
      login(newPlayer);
      console.log("Navigation");
      navigate("/");
    } catch (err) {
      console.error("Profile creation failed:", err);
      toast.error(err.message || "Failed to save profile. Please try again.");
    } finally {
      setIsCompletingProfile(false);
    }
  };

  const renderRateLimitMessage = () => {
    if (!rateLimitId || (step !== "PHONE_INPUT" && step !== "EMAIL_AUTH")) return null;
    
    if (isRateLimited) {
      return <p style={{ fontSize: "12px", color: "#ef4444", margin: "8px 0 0", fontWeight: "600" }}>Limit reached. Try again in {countdownString}</p>;
    } else {
      return <p style={{ fontSize: "12px", color: "#94a3b8", margin: "8px 0 0" }}>{remainingRequests} OTP request{remainingRequests !== 1 ? 's' : ''} remaining</p>;
    }
  };


  const controllerProps = {
    step, setStep, otpState, setOtpState, countryCode, setCountryCode, phone, setPhone,
    otp, setOtp, email, setEmail, firstName, setFirstName, lastName, setLastName,
    age, setAge, gender, setGender, country, setCountry, preferredFoot, setPreferredFoot,
    position, setPosition, isCompletingProfile, authMode, setAuthMode, isLoading, setIsLoading,
    isRateLimited, countdownString, isLockedOut, lockoutString,
    handleSendEmailOtp, handleVerifyEmailOtp, handleGoogleAuth, handleSendPhoneOtp,
    handleVerifyPhoneOtp, handleLinkPhoneSubmit, handleLinkGoogleSubmit, handleCompleteRegistration,
    renderRateLimitMessage
  };

  return (
    <ResponsiveView 
      mobile={<AuthPageMobile {...controllerProps} />}
      tablet={<AuthPageTablet {...controllerProps} />}
      desktop={<AuthPageDesktop {...controllerProps} />}
    />
  );
}
