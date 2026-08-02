import { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => { 
    const stored = localStorage.getItem("v2_football_user"); 
    if (stored) return JSON.parse(stored);
    return null;
  });
  const [isLoading] = useState(false);

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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("v2_football_user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, updateUser, login, logout, restoreDevSession }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
