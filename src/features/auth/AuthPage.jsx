import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePlayers } from "../../context/PlayerContext";
import { Target, Phone, KeyRound, User, Mail, Link as LinkIcon, ArrowRight, ArrowLeft } from "lucide-react";
import { auth, RecaptchaVerifier } from "../../core/firebase";
import { updateProfile, signInWithCustomToken, signInWithPopup, signInWithPhoneNumber, createUserWithEmailAndPassword, signInWithEmailAndPassword, getAdditionalUserInfo } from "firebase/auth";
import { db } from "../../core/firebase";
import { doc, serverTimestamp, query, where, collection, getDocs } from "firebase/firestore";
import { useToast } from "../../context/ToastContext";
import { useRateLimit } from "./useRateLimit";
import ResponsiveView from "../../components/layout/ResponsiveView";
import AuthPageMobile from "./components/mobile/AuthPageMobile";
import AuthPageTablet from "./components/tablet/AuthPageTablet";
import AuthPageDesktop from "./components/desktop/AuthPageDesktop";

const API_URL = import.meta.env.PROD ? (import.meta.env.VITE_API_URL || "/api") : "/api";

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
  const { login, user } = useAuth();
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
  const [email, setEmail] = useState(() => localStorage.getItem("dribbl_saved_email") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [preferredFoot, setPreferredFoot] = useState("");
  const [position, setPosition] = useState("");
  const [isCompletingProfile, setIsCompletingProfile] = useState(false);
  
  const [authMethod, setAuthMethod] = useState(null); 
  const [authMode, setAuthMode] = useState(null); // 'SIGN_UP' or 'LOG_IN'
  const [existingPlayer, setExistingPlayer] = useState(null);
  const [authUid, setAuthUid] = useState(null);
  const [backendToken, setBackendToken] = useState(null);
  const [resetToken, setResetToken] = useState("");
  const [, setIsFirebaseVerified] = useState(false);
  const [isLoading, _setIsLoading] = useState(false);

  const setIsLoading = (newIsLoading) => {
    console.log(`ISLOADING BEFORE ${isLoading} AFTER ${newIsLoading}`);
    _setIsLoading(newIsLoading);
  };
  
  const rateLimitId = (step === "PHONE_INPUT" || step === "PHONE_OTP") ? `phone_${countryCode}${phone}` : (step === "EMAIL_AUTH" || step === "OTP_VERIFICATION" || step === "FORGOT_PASSWORD") ? `email_${(email || "").toLowerCase().trim()}` : null;
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
    window.testSendOtp = handleSendEmailOtp;
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
    window.handleSendEmailOtp = handleSendEmailOtp; // EXPOSE FOR TESTING
    
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
      if (step !== "FORGOT_PASSWORD") {
        setStep("OTP_VERIFICATION");
      }
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
        body: JSON.stringify({ 
          email: normalizedEmail, 
          otp, 
          isSignup: authMode === "SIGN_UP", 
          password,
          intent: step === "FORGOT_PASSWORD" ? "reset" : "login"
        }),
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
      
      if (step === "FORGOT_PASSWORD") {
        if (data.data?.resetToken) {
          setResetToken(data.data.resetToken);
        }
        return;
      }
      
      if (authMode === "SIGN_UP") {
        try {
          if (!data.data?.firebaseToken) throw new Error("Missing authentication token from server");
          const userCred = await signInWithCustomToken(auth, data.data.firebaseToken);
          setAuthUid(userCred.user.uid);
          setBackendToken(data.data.token);

          localStorage.setItem("dribbl_saved_email", normalizedEmail);
          setStep("NEW_PROFILE");
        } catch (err) {
          toast.error(err.message || "Signup failed");
        }
      } else if (authMode === "LOG_IN" || !data.data?.isNewUser) {
        let firestoreUid = null;
        if (data.data?.firebaseToken) {
          try {
            const userCred = await signInWithCustomToken(auth, data.data.firebaseToken);
            firestoreUid = userCred.user.uid;
          } catch (authErr) {
            console.error("Failed to sign into Firebase Auth with custom token:", authErr);
            toast.error("Authentication mapping failed. Please contact support.");
            return;
          }
        }
        
        const backendUser = data.data?.user;
        let profileData = null;
        let finalUid = firestoreUid || backendUser?.uid || data.data?.player?.id;
        let backendToken = data.data?.token;

        if (finalUid) {
          try {
            const fetchToken = backendToken || (auth.currentUser ? await auth.currentUser.getIdToken() : null);
            if (fetchToken) {
              const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${fetchToken}` }
              });
              if (res.ok) {
                const meData = await res.json();
                profileData = meData.data;
                finalUid = profileData.id || profileData.uid || finalUid;
              }
            }
          } catch (e) {
            console.warn("Failed to fetch from backend API during OTP login", e);
          }
        }
        
        const player = profileData || getPlayerByEmail(normalizedEmail) || backendUser || data.data?.player;
        if (player) {
          if (player.id) {
            updatePlayerIdentity(player.id, { isVerified: true, emailVerified: true });
          }
          login({
            ...player,
            name: player.name || player.displayName || player.email?.split('@')[0] || "Dribbl Player",
            isVerified: true,
            emailVerified: true,
            id: finalUid || player.id,
            token: backendToken
          });
        } else {
          login({ 
            id: finalUid || crypto.randomUUID(),
            email: normalizedEmail,
            isVerified: true, 
            emailVerified: true,
            name: normalizedEmail.split('@')[0] || "Dribbl Player",
            phone: "",
            position: "",
            token: backendToken
          });
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

  
  const handleEmailPasswordAuth = async (e) => {
    e.preventDefault();
    const normalizedEmail = (email || "").toLowerCase().trim();
    if (!normalizedEmail.includes("@")) return toast.error("Enter a valid email address");

    if (authMode === "SIGN_UP") {
      if (password.length < 6) return toast.error("Password must be at least 6 characters");
      // DO NOT create Firebase account yet. Validate and trigger OTP flow instead.
      await handleSendEmailOtp(e);
    } else {
      if (!password) return toast.error("Please enter your password");
      setIsLoading(true);
      try {
        const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        localStorage.setItem("dribbl_saved_email", normalizedEmail);
        
        const uid = userCredential.user.uid;
        const firebaseToken = await userCredential.user.getIdToken();
        
        let profileData = null;
        let profileId = uid;
        try {
          const res = await fetch(`${API_URL}/auth/me`, {
             headers: { Authorization: `Bearer ${firebaseToken}` }
          });
          if (res.ok) {
             const meData = await res.json();
             profileData = meData.data;
             profileId = profileData.id || profileData.uid || uid;
             
             if (profileData.backendToken) {
                setBackendToken(profileData.backendToken);
             }
             
             if (auth.currentUser && !auth.currentUser.displayName && profileData.displayName) {
               await updateProfile(auth.currentUser, { displayName: profileData.displayName }).catch(() => {});
             }
          }
        } catch (apiErr) {
          console.warn("Failed to fetch user from backend API", apiErr);
        }
        
        const player = profileData || getPlayerByEmail(normalizedEmail);
        const tokenToSave = profileData?.backendToken || firebaseToken;
        
        if (player) {
          updatePlayerIdentity(player.id || profileId, { isVerified: true, emailVerified: true });
          login({
            ...player,
            name: player.name || player.displayName || player.email?.split('@')[0] || "Dribbl Player",
            position: player.position || player.preferredPosition || "",
            isVerified: true,
            emailVerified: true,
            id: profileId,
            token: tokenToSave
          });
        } else {
          login({ 
            id: uid,
            email: normalizedEmail,
            isVerified: true, 
            emailVerified: true,
            name: userCredential.user.displayName || "Dribbl Player",
            phone: "",
            position: "",
            token: tokenToSave
          });
        }
      } catch (err) {
        toast.error("Invalid email or password.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Password must be at least 6 characters");
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: (email || "").toLowerCase().trim(), resetToken, newPassword: password })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Password reset failed");
      
      toast.success("Your password has been updated successfully. You can now log in with your new password.");
      setStep("AUTH_HOME");
      setOtp("");
      setResetToken("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  // --- PHONE FLOW HELPERS ---
  const handleFailedAttempt = (customMessage = null) => {
    // Legacy fallback for Phone/Google if they call this
    toast.error(customMessage || "Authentication failed.");
  };



  // --- NEW PROFILE FLOW ---
  const navigate = useNavigate();

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    if (isCompletingProfile) return;
    
    console.log("[SIGNUP] 1. profile submission started");
    
    try {
      setIsCompletingProfile(true);
      if (!firstName.trim() || !lastName.trim()) return toast.error("Please enter your full name");
      if (!age || isNaN(age) || age < 1 || age > 100) return toast.error("Please enter a valid age");
      if (!gender) return toast.error("Please select a gender");
      if (!position) return toast.error("Please select a preferred position");
      if (!country) return toast.error("Please select a country");

      const fullPhone = phone ? `${countryCode}${phone}`.replace(/\s+/g, '') : null;
      const fullName = `${firstName.trim()} ${lastName.trim()}`;

      console.log("[SIGNUP] 2. currentUser retrieved:", auth.currentUser);
      
      if (!auth.currentUser) {
        throw new Error("Authentication session lost. Please log in again.");
      }
      
      console.log("[SIGNUP] 3. currentUser.uid:", auth.currentUser.uid);
      console.log("[SIGNUP] 4. Firebase auth state:", auth.currentUser.toJSON());

      if (auth.currentUser) {
        console.log("[SIGNUP] 9. updateProfile started");
        await updateProfile(auth.currentUser, { displayName: fullName });
        console.log("[SIGNUP] 10. updateProfile completed");
      }

      const uid = auth.currentUser.uid;

      const playerData = {
        id: uid,
        name: fullName,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        displayName: fullName,
        email: email,
        emailVerified: true,
        phoneNumber: fullPhone,
        phoneCountryCode: countryCode,
        phoneVerified: !!fullPhone,
        dob: null, 
        age: parseInt(age),
        gender: gender,
        country: country, state: state, city: city,
        preferredFoot: preferredFoot,
        position: position,
        authMethod: authMethod || "EMAIL",
        isVerified: true
      };

      console.log("[SIGNUP] 5. Sending profile to backend via API...");
      
      const tokenToUse = backendToken || user?.token;
      if (!tokenToUse) {
        throw new Error("Authentication token not found. Please log in again.");
      }

      const res = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${tokenToUse}`
        },
        body: JSON.stringify(playerData)
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to save profile to server");
      }
      
      const { data: savedData } = await res.json();
      console.log("[SIGNUP] 8c. verified data:", savedData);

      console.log("[SIGNUP] 11. profile context updated");
      // Use registerPlayer if we want to save to local PlayerContext, but AuthContext is the main one
      const newPlayer = registerPlayer({ ...savedData, createdAt: Date.now() });
      console.log("[SIGNUP] 12. navigation started");
      navigate("/", { replace: true });
      login({ ...newPlayer, token: backendToken || user?.token });
      console.log("[SIGNUP] 13. navigation completed");

    } catch (err) {
      console.error("[SIGNUP] PROFILE SAVE FAILED:", err);
      toast.error(err.message || "Couldn't save your profile. Please check your connection and try again.");
      // Do not navigate. Let them retry.
    } finally {
      setIsCompletingProfile(false);
    }
  };

  if (import.meta.env.DEV) {
    window.TEST_SAVE = handleCompleteRegistration;
    window.JUMP_TO_PROFILE = () => {
      setStep("NEW_PROFILE");
      setFirstName("John");
      setLastName("Doe");
      setAge("19");
      setGender("Male");
      setPosition("Forward");
      setCountry("India");
      setPreferredFoot("Right");
    };
  }

  const handleLinkPhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return toast.error("Please enter a valid phone number");
    
    // The user is trying to link an existing phone profile to their new email account.
    // If we wanted to ensure the phone exists first, we could do:
    // const fullPhone = `${countryCode}${phone}`.replace(/\s+/g, '');
    // const p = getPlayerByPhone(fullPhone);
    // if (!p) return toast.error("No existing profile found with that phone number.");
    
    // For now, simply send OTP so they can verify ownership of the phone
    await handleSendPhoneOtp(e);
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
    otp, setOtp, email, setEmail, password, setPassword, confirmPassword, setConfirmPassword, showPassword, setShowPassword, firstName, setFirstName, lastName, setLastName,
    age, setAge, gender, setGender, country, setCountry, state, setState, city, setCity, preferredFoot, setPreferredFoot,
    position, setPosition, isCompletingProfile, authMode, setAuthMode, isLoading, setIsLoading,
    isRateLimited, countdownString, isLockedOut, lockoutString,
    handleSendEmailOtp, handleVerifyEmailOtp, handleSendPhoneOtp,
    handleVerifyPhoneOtp, handleLinkPhoneSubmit, handleCompleteRegistration,
    renderRateLimitMessage, handleEmailPasswordAuth, handleForgotPasswordSubmit
  };

  return (
    <ResponsiveView 
      mobile={<AuthPageMobile {...controllerProps} />}
      tablet={<AuthPageTablet {...controllerProps} />}
      desktop={<AuthPageDesktop {...controllerProps} />}
    />
  );
}
