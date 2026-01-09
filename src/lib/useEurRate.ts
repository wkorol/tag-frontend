import { useEffect, useState } from 'react';

const CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const STORAGE_KEY = 'eur-rate-cache';
let cachedRate: number | null = null;
let cachedAt = 0;
let inflight: Promise<number | null> | null = null;

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

export const preloadEurRate = () => {
  startFetch();
};

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
    const attach = (promise: Promise<number | null>) => {
      promise
        .then((value) => {
          if (!cancelled && value) {
            setRate(value);
          }
        })
        .catch(() => null);
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
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onFirstInteraction, { passive: true, once: true });
      window.addEventListener('click', onFirstInteraction, { once: true });
      window.addEventListener('touchstart', onFirstInteraction, { passive: true, once: true });
    }

    const timeoutId = window.setTimeout(scheduleFetch, 8000);
    return () => {
      cancelled = true;
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return rate;
}
