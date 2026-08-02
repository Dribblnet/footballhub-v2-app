import { useState, useEffect } from "react";

export function useRateLimit(identifier) {
  const [requests, setRequests] = useState([]);
  const [failedAttempts, setFailedAttempts] = useState([]);
  const [backendRateLimitUntil, setBackendRateLimitUntil] = useState(null);
  const [backendLockoutUntil, setBackendLockoutUntil] = useState(null);
  const [countdownString, setCountdownString] = useState("");
  const [lockoutString, setLockoutString] = useState("");
  
  const MAX_REQUESTS = 3;
  const TIME_WINDOW_MS = 5 * 60 * 1000;
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_WINDOW_MS = 5 * 60 * 1000;

  useEffect(() => {
    if (!identifier) return;
    const reqKey = `auth_rate_limit_${identifier}`;
    const failKey = `auth_fail_limit_${identifier}`;
    const rlUntilKey = `auth_rl_until_${identifier}`;
    const loUntilKey = `auth_lo_until_${identifier}`;
    
    try {
      const storedReqs = localStorage.getItem(reqKey);
      if (storedReqs) {
        try {
          const parsed = JSON.parse(storedReqs);
          setTimeout(() => setRequests(Array.isArray(parsed) ? parsed : []), 0);
        } catch (err) {
          console.warn("Error parsing stored requests", err);
          setTimeout(() => setRequests([]), 0);
        }
      } else setTimeout(() => setRequests([]), 0);

      const storedFails = localStorage.getItem(failKey);
      if (storedFails) {
        try {
          const parsed = JSON.parse(storedFails);
          setTimeout(() => setFailedAttempts(Array.isArray(parsed) ? parsed : []), 0);
        } catch (err) {
          console.warn("Error parsing stored fails", err);
          setTimeout(() => setFailedAttempts([]), 0);
        }
      } else setTimeout(() => setFailedAttempts([]), 0);

      // Do not restore cooldowns from old browser storage as per requirements
      setTimeout(() => {
        setBackendRateLimitUntil(null);
        setBackendLockoutUntil(null);
      }, 0);
      localStorage.removeItem(rlUntilKey);
      localStorage.removeItem(loUntilKey);
    } catch (e) {
      console.error(e);
    }
  }, [identifier]);

  useEffect(() => {
    if (!identifier) return;
    let intervalId;
    
    const updateStatus = () => {
      const now = Date.now();
      
      const safeRequests = requests || [];
      const validRequests = safeRequests.filter(time => now - time < TIME_WINDOW_MS);
      if (validRequests.length !== safeRequests.length) {
        setRequests(validRequests);
        localStorage.setItem(`auth_rate_limit_${identifier}`, JSON.stringify(validRequests));
      }

      const safeFails = failedAttempts || [];
      const validFails = safeFails.filter(time => now - time < LOCKOUT_WINDOW_MS);
      if (validFails.length !== safeFails.length) {
        setFailedAttempts(validFails);
        localStorage.setItem(`auth_fail_limit_${identifier}`, JSON.stringify(validFails));
      }

      let timeUntilFree = 0;
      if (backendRateLimitUntil && backendRateLimitUntil > now) {
        timeUntilFree = backendRateLimitUntil - now;
      } else {
        if (backendRateLimitUntil) {
          setBackendRateLimitUntil(null);
        }
      }

      if (timeUntilFree > 0) {
        const totalSeconds = Math.ceil(timeUntilFree / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setCountdownString(`${minutes > 0 ? minutes + ':' : ''}${seconds.toString().padStart(minutes > 0 ? 2 : 1, "0")}${minutes > 0 ? '' : 's'}`);
      } else {
        setCountdownString("");
      }

      let failWaitTime = 0;
      if (backendLockoutUntil && backendLockoutUntil > now) {
        failWaitTime = backendLockoutUntil - now;
      } else {
        if (backendLockoutUntil) {
          setBackendLockoutUntil(null);
          localStorage.removeItem(`auth_lo_until_${identifier}`);
        }
        if (validFails.length >= MAX_FAILED_ATTEMPTS) {
          const oldestFail = validFails[0];
          failWaitTime = (oldestFail + LOCKOUT_WINDOW_MS) - now;
        }
      }

      if (failWaitTime > 0) {
        const totalSeconds = Math.ceil(failWaitTime / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setLockoutString(`${minutes > 0 ? minutes + ':' : ''}${seconds.toString().padStart(minutes > 0 ? 2 : 1, "0")}${minutes > 0 ? '' : 's'}`);
      } else {
        setLockoutString("");
      }
    };

    updateStatus();
    intervalId = setInterval(updateStatus, 1000);
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [requests, failedAttempts, backendRateLimitUntil, backendLockoutUntil, identifier, LOCKOUT_WINDOW_MS, TIME_WINDOW_MS]);

  const recordRequest = () => {
    if (!identifier) return;
    const now = Date.now();
    const updated = [...(requests || []), now];
    setRequests(updated);
    try { localStorage.setItem(`auth_rate_limit_${identifier}`, JSON.stringify(updated)); } catch(err){ console.warn(err); }
  };

  const applyBackendRateLimit = (retryAfterSeconds) => {
    if (!identifier) return;
    console.log(`[RATE LIMIT] Cooldown started. Source: Backend (429 response). Duration: ${retryAfterSeconds}s`);
    const until = Date.now() + retryAfterSeconds * 1000;
    setBackendRateLimitUntil(until);
  };

  const recordFailedAttempt = () => {
    if (!identifier) return;
    const now = Date.now();
    const updated = [...(failedAttempts || []), now];
    setFailedAttempts(updated);
    try { localStorage.setItem(`auth_fail_limit_${identifier}`, JSON.stringify(updated)); } catch(err){ console.warn(err); }
    return updated.length;
  };

  const applyBackendLockout = (retryAfterSeconds) => {
    if (!identifier) return;
    const until = Date.now() + retryAfterSeconds * 1000;
    setBackendLockoutUntil(until);
    try { localStorage.setItem(`auth_lo_until_${identifier}`, until.toString()); } catch(err){ console.warn(err); }
  };

  const clearRateLimit = () => {
    if (!identifier) return;
    setRequests([]);
    setFailedAttempts([]);
    setBackendRateLimitUntil(null);
    setBackendLockoutUntil(null);
    setCountdownString("");
    setLockoutString("");
    localStorage.removeItem(`auth_rate_limit_${identifier}`);
    localStorage.removeItem(`auth_fail_limit_${identifier}`);
  };

  const remainingRequests = Math.max(0, MAX_REQUESTS - (requests || []).filter(time => new Date().getTime() - time < TIME_WINDOW_MS).length);
  const isRateLimited = countdownString !== "";
  const isLockedOut = lockoutString !== "";
  const remainingAttempts = Math.max(0, MAX_FAILED_ATTEMPTS - (failedAttempts || []).filter(time => new Date().getTime() - time < LOCKOUT_WINDOW_MS).length);

  return {
    isRateLimited,
    remainingRequests,
    countdownString,
    recordRequest,
    applyBackendRateLimit,
    isLockedOut,
    lockoutString,
    recordFailedAttempt,
    applyBackendLockout,
    remainingAttempts,
    clearRateLimit
  };
}
