/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext, useEffect } from "react";

const NOW = Date.now();
const INITIAL_REQUESTS = [
  { id: 1, type: "Tournament Ad", matchType: "5v5", skillLevel: "Competitive", positions: [], playersNeeded: 0, turf: "Downtown Arena", city: "Mumbai", date: "Weekend", time: "All Day", duration: "Tournament", author: "Mumbai FA", isTournament: true, prizeInfo: "₹50,000", entryFee: "₹2,500", refAvailable: "Yes", timestamp: NOW },
  { id: 2, type: "Need Goalkeeper", matchType: "5v5", skillLevel: "Competitive", positions: ["GK"], playersNeeded: 1, turf: "Koramangala Turf", city: "Bengaluru", date: "Tonight", time: "8:00 PM", duration: "60 Min", author: "FC Lightning", timestamp: NOW },
  { id: 3, type: "Looking To Join", matchType: "11v11", skillLevel: "Intermediate", positions: ["CM", "CAM"], playersNeeded: 1, turf: "Anywhere", city: "Bengaluru", date: "Weekends", time: "Morning", duration: "90 Min", author: "Alex R.", timestamp: NOW }
];

const MarketContext = createContext();
const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function MarketProvider({ children }) {
  const [requests, setRequests] = useState(() => {
    const saved = localStorage.getItem("v2_market_requests");
    let parsed = saved ? JSON.parse(saved) : INITIAL_REQUESTS;
    const currentTime = Date.now();
    parsed = parsed.filter(req => req.timestamp && (currentTime - req.timestamp < EXPIRATION_MS));
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem("v2_market_requests", JSON.stringify(requests));
  }, [requests]);

  // Periodic cleanup
  useEffect(() => {
    const interval = setInterval(() => {
      setRequests(prev => prev.filter(req => req.timestamp && (Date.now() - req.timestamp < EXPIRATION_MS)));
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  const addRequest = (newReq) => {
    setRequests(prev => [{ ...newReq, timestamp: Date.now() }, ...prev]);
  };

  const deleteRequest = (id) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  return (
    <MarketContext.Provider value={{ requests, addRequest, deleteRequest }}>
      {children}
    </MarketContext.Provider>
  );
}

export const useMarket = () => useContext(MarketContext);
