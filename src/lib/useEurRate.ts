import { useEffect, useState } from 'react';

const CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const STORAGE_KEY = 'eur-rate-cache';
let cachedRate: number | null = null;
let cachedAt = 0;
let inflight: Promise<number | null> | null = null;

async function fetchEurRate(): Promise<number | null> {
  try {
    const response = await fetch('/api/eur-rate');
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    const rate = typeof data?.rate === 'number' ? data.rate : null;
    if (rate) {
      cachedRate = rate;
      cachedAt = Date.now();
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ rate, at: cachedAt }),
          );
        } catch {
          // ignore storage errors
        }
      }
    }
    return rate;
  } catch {
    return null;
  }
}

export function useEurRate() {
  const [rate, setRate] = useState<number | null>(() => {
    if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
      return cachedRate;
    }
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { rate?: number; at?: number };
          if (parsed?.rate && parsed?.at && Date.now() - parsed.at < CACHE_TTL_MS) {
            cachedRate = parsed.rate;
            cachedAt = parsed.at;
            return parsed.rate;
          }
        }
      } catch {
        // ignore storage errors
      }
    }
    return null;
  });

  useEffect(() => {
    if (cachedRate && Date.now() - cachedAt < CACHE_TTL_MS) {
      return;
    }
    let cancelled = false;
    const scheduleFetch = () => {
      if (inflight) {
        return;
      }
      inflight = fetchEurRate();
      inflight
        .then((value) => {
          if (!cancelled && value) {
            setRate(value);
          }
        })
        .finally(() => {
          inflight = null;
        });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(scheduleFetch, { timeout: 3000 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(scheduleFetch, 1500);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return rate;
}
