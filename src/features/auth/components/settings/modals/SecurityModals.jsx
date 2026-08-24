import React, { useState, useEffect } from "react";
import { X, Lock, Mail, Phone as PhoneIcon } from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";
import { usePlayers } from "../../../../../context/PlayerContext";
import { useToast } from "../../../../../context/ToastContext";
import { auth, RecaptchaVerifier } from "../../../../../core/firebase";
import { 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
  updatePassword, 
  updateEmail, 
  signInWithPhoneNumber,
  PhoneAuthProvider,
  linkWithCredential
} from "firebase/auth";
import CountrySelector from "../CountrySelector";

export function PasswordModal({ onClose }) {
  const { toast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error("Not authenticated with Firebase.");
    setIsLoading(true);
    
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      toast.success("Password updated successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update password. Check your current password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15, 23, 42, 0.95)", zIndex: 100, backdropFilter: "blur(10px)",
      display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
    }}>
      <div className="glass-panel animate-scale-in" style={{ padding: "30px", maxWidth: "450px", width: "100%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
          <X size={24} />
        </button>
        <h2 style={{ margin: "0 0 20px 0", fontSize: "24px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
          <Lock size={24} color="var(--primary)" /> Change Password
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input type="password" placeholder="Current Password" required className="input-modern" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <input type="password" placeholder="New Password" required minLength={6} className="input-modern" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "10px", height: "48px" }}>
            {isLoading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function EmailModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const { updatePlayerIdentity } = usePlayers();
  const { toast } = useToast();
  
  const [currentPassword, setCurrentPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) return toast.error("Not authenticated with Firebase.");
    setIsLoading(true);
    
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
      
      updatePlayerIdentity(user.id, { email: newEmail });
      updateUser({ email: newEmail });
      
      toast.success("Email updated successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update email. Check your password or email format.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15, 23, 42, 0.95)", zIndex: 100, backdropFilter: "blur(10px)",
      display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
    }}>
      <div className="glass-panel animate-scale-in" style={{ padding: "30px", maxWidth: "450px", width: "100%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
          <X size={24} />
        </button>
        <h2 style={{ margin: "0 0 20px 0", fontSize: "24px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
          <Mail size={24} color="var(--primary)" /> Change Email
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <input type="email" placeholder="New Email Address" required className="input-modern" value={newEmail} onChange={e => setNewEmail(e.target.value)} />
          <input type="password" placeholder="Current Password" required className="input-modern" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "10px", height: "48px" }}>
            {isLoading ? "Updating..." : "Update Email"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function PhoneModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const { updatePlayerIdentity } = usePlayers();
  const { toast } = useToast();
  
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("SEND_OTP"); // SEND_OTP or VERIFY_OTP
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fullPhone = `${countryCode}${phone}`.replace(/\s+/g, '');
    
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, fullPhone, window.recaptchaVerifier);
      window.confirmationResult = confirmationResult;
      setStep("VERIFY_OTP");
      toast.success("OTP sent to your phone.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to send OTP.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.render().then(widgetId => {
          grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const fullPhone = `${countryCode}${phone}`.replace(/\s+/g, '');

    try {
      const result = await window.confirmationResult.confirm(otp);
      // Link credential to current user if needed, but for now we just use it to verify phone ownership
      const credential = PhoneAuthProvider.credential(window.confirmationResult.verificationId, otp);
      
      if (auth.currentUser && auth.currentUser.uid !== result.user.uid) {
         await linkWithCredential(auth.currentUser, credential).catch(err => {
            console.warn("Already linked or link failed", err);
         });
      }

      updatePlayerIdentity(user.id, { phone: fullPhone, phoneNumber: fullPhone, phoneVerified: true, isVerified: true });
      updateUser({ phone: fullPhone, phoneNumber: fullPhone, phoneVerified: true, isVerified: true });
      
      toast.success("Phone verified and linked successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Invalid OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(15, 23, 42, 0.95)", zIndex: 100, backdropFilter: "blur(10px)",
      display: "flex", justifyContent: "center", alignItems: "center", padding: "20px"
    }}>
      <div className="glass-panel animate-scale-in" style={{ padding: "30px", maxWidth: "450px", width: "100%", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
          <X size={24} />
        </button>
        <h2 style={{ margin: "0 0 20px 0", fontSize: "24px", fontWeight: "800", display: "flex", alignItems: "center", gap: "10px" }}>
          <PhoneIcon size={24} color="var(--primary)" /> Link Phone
        </h2>
        
        {step === "SEND_OTP" ? (
          <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", gap: "10px" }}>
              <CountrySelector value={countryCode} onChange={setCountryCode} />
              <input type="tel" placeholder="Phone Number" required className="input-modern" value={phone} onChange={e => setPhone(e.target.value)} style={{ flex: 1 }} />
            </div>
            <div id="recaptcha-container"></div>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "10px", height: "48px" }}>
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <input type="text" placeholder="Enter 6-digit OTP" required className="input-modern" value={otp} onChange={e => setOtp(e.target.value)} />
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ marginTop: "10px", height: "48px" }}>
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
