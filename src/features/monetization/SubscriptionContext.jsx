import { createContext, useState, useContext } from "react";

const SubscriptionContext = createContext();

export function SubscriptionProvider({ children }) {
  const [tier, setTier] = useState(() => {
    return localStorage.getItem("v2_billing_tier") || "FREE";
  });
  
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");

  const upgradeToPro = () => {
    setTier("PRO");
    localStorage.setItem("v2_billing_tier", "PRO");
    setIsPaywallOpen(false);
  };

  const checkPremium = (featureName) => {
    if (tier === "PRO") return true;
    setPaywallFeature(featureName);
    setIsPaywallOpen(true);
    return false;
  };

  return (
    <SubscriptionContext.Provider value={{ tier, checkPremium, upgradeToPro, isPaywallOpen, setIsPaywallOpen, paywallFeature }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSubscription = () => useContext(SubscriptionContext);
