import { createContext, useState, useContext } from "react";
import { auth } from "../core/firebase";
import { signOut } from "firebase/auth";

const AuthContext = createContext();

export const CURRENT_POLICY_VERSIONS = {
  termsVersion: "1.0",
  privacyVersion: "1.0",
  communityGuidelinesVersion: "1.0"
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { 
    const stored = localStorage.getItem("v2_football_user"); 
    if (stored) return JSON.parse(stored);
    return null;
  });
  const [isLoading] = useState(false);

  const acceptPolicies = () => {
    if (!user) return;
    const updatedUser = { 
      ...user, 
      policyAcceptance: {
        ...CURRENT_POLICY_VERSIONS,
        acceptedAt: Date.now()
      } 
    };
    setUser(updatedUser);
    localStorage.setItem("v2_football_user", JSON.stringify(updatedUser));
  };

  const restoreDevSession = () => {
    const demoUser = {
      id: "demo-v2",
      phone: "0000000000",
      name: "Dribbl.net Manager",
      position: "", 
    };
    setUser(demoUser);
    localStorage.setItem("v2_football_user", JSON.stringify(demoUser));
  };

  

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("v2_football_user", JSON.stringify(userData));
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem("v2_football_user", JSON.stringify(updatedUser));
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.warn("Failed to sign out of Firebase Auth", error);
    }
    setUser(null);
    localStorage.removeItem("v2_football_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, updateUser, login, logout, restoreDevSession, acceptPolicies }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
