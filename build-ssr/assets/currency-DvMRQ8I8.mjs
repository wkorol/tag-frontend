import { useState, useEffect } from 'react';

const getApiBaseUrl = () => {
  const envValue = "https://taxiairportgdansk.com";
  if (envValue.trim() !== "") {
    return envValue;
  }
  console.warn("VITE_API_BASE_URL is not set; API calls will fail.");
  return "";
};

const CACHE_TTL_MS = 1e3 * 60 * 60 * 6;
const STORAGE_KEY = "eur-rate-cache";
let cachedRate = null;
let cachedAt = 0;
let inflight = null;
const startFetch = () => {
  if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
    return null;
  }
  if (!inflight) {
    inflight = fetchEurRate().finally(() => {
      inflight = null;
    });
  }
  return inflight;
};
const preloadEurRate = () => {
  startFetch();
};
async function fetchEurRate() {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await fetch(`${apiBaseUrl}/api/eur-rate`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const rate = typeof data?.rate === "number" ? data.rate : null;
    if (rate) {
      cachedRate = rate;
      cachedAt = Date.now();
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ rate, at: cachedAt })
          );
        } catch {
        }
      }
    }
    return rate;
  } catch {
    return null;
  }
}
function useEurRate() {
  const [rate, setRate] = useState(() => {
    if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
      return cachedRate;
    }
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.rate && parsed?.at && Date.now() - parsed.at < CACHE_TTL_MS) {
            cachedRate = parsed.rate;
            cachedAt = parsed.at;
            return parsed.rate;
          }
        }
      } catch {
      }
    }
    return null;
  });
  useEffect(() => {
    if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
      return;
    }
    let cancelled = false;
    const attach = (promise) => {
      promise.then((value) => {
        if (!cancelled && value) {
          setRate(value);
        }
      }).catch(() => null);
    };
    if (inflight) {
      attach(inflight);
    }
    const scheduleFetch = () => {
      const promise = startFetch();
      if (promise) {
        attach(promise);
      }
    };
    const onFirstInteraction = () => {
      scheduleFetch();
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", onFirstInteraction, { passive: true, once: true });
      window.addEventListener("click", onFirstInteraction, { once: true });
      window.addEventListener("touchstart", onFirstInteraction, { passive: true, once: true });
    }
    const timeoutId = window.setTimeout(scheduleFetch, 8e3);
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
      window.clearTimeout(timeoutId);
    };
  }, []);
  return rate;
}

function formatEur(pln, rate) {
  if (!rate || !Number.isFinite(pln)) {
    return null;
  }
  const eur = Math.round(pln * rate);
  return `~${eur}EUR`;
}

export { formatEur as f, getApiBaseUrl as g, preloadEurRate as p, useEurRate as u };
