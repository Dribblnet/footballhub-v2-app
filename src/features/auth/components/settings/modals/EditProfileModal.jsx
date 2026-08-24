import React, { useState } from "react";
import { X, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../../../context/AuthContext";
import { usePlayers } from "../../../../../context/PlayerContext";
import { useToast } from "../../../../../context/ToastContext";
import { auth } from "../../../../../core/firebase";

export default function EditProfileModal({ onClose }) {
  const { user, updateUser } = useAuth();
  const { players, updatePlayerIdentity } = usePlayers();
  const { toast } = useToast();

  const fullPlayer = players.find((p) => p.id === user.id) || user;

  const [name, setName] = useState(fullPlayer.name || "");
  const [username, setUsername] = useState(fullPlayer.username || "");
  const [position, setPosition] = useState(fullPlayer.position || "");
  const [avatar, setAvatar] = useState(fullPlayer.avatar || "");
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const updates = {
        name,
        username,
        position,
        avatar,
      };

      const firebaseToken = user.token || (auth.currentUser ? await auth.currentUser.getIdToken() : null);
      if (!firebaseToken) {
        throw new Error("Authentication session lost. Please log in again.");
      }

      // 1. Update Backend
      const res = await fetch(`${API_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${firebaseToken}`
        },
        body: JSON.stringify(updates)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update profile on server");
      }

      const { data: savedData } = await res.json();

      // 2. Update Local State
      updatePlayerIdentity(user.id, savedData || updates);
      updateUser(savedData || updates);

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update profile", err);
      toast.error("Failed to update profile. Please try again.");
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
      <div className="glass-panel animate-scale-in" style={{ padding: "30px", maxWidth: "500px", width: "100%", position: "relative" }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "20px", right: "20px", background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
        >
          <X size={24} />
        </button>

        <h2 style={{ margin: "0 0 20px 0", fontSize: "24px", fontWeight: "800" }}>Edit Profile</h2>

        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>Full Name</label>
            <input 
              type="text" 
              className="input-modern"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%" }}
              required
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>Username</label>
            <input 
              type="text" 
              className="input-modern"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: "var(--text-muted)" }}>Position</label>
            <select
              className="input-modern"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              style={{ width: "100%", height: "48px", appearance: "none", paddingLeft: "16px" }}
              required
            >
              <option value="" disabled>Select Position</option>
              <option value="Forward">Forward</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Defender">Defender</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <button type="button" className="btn-primary" onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid var(--border)", boxShadow: "none" }}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isLoading} style={{ flex: 2 }}>
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
