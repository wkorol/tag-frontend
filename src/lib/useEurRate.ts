import { useEffect, useState } from 'react';

const CACHE_TTL_MS = 1000 * 60 * 60 * 6;
const STORAGE_KEY = 'eur-rate-cache';
let cachedRate: number | null = null;
let cachedAt = 0;
let inflight: Promise<number | null> | null = null;

async function fetchEurRate(): Promise<number | null> {
  const candidates: Array<() => Promise<number | null>> = [
    async () => {
      const response = await fetch('https://api.exchangerate.host/latest?base=PLN&symbols=EUR');
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return typeof data?.rates?.EUR === 'number' ? data.rates.EUR : null;
    },
    async () => {
      const response = await fetch('https://api.frankfurter.app/latest?from=PLN&to=EUR');
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      return typeof data?.rates?.EUR === 'number' ? data.rates.EUR : null;
    },
  ];

  for (const candidate of candidates) {
    try {
      const rate = await candidate();
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
        return rate;
      }
    } catch {
      // try next candidate
    }
  }

  return null;
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
    if (!inflight) {
      inflight = fetchEurRate();
    }
    let cancelled = false;
    inflight.then((value) => {
      if (!cancelled && value) {
        setRate(value);
      }
    }).finally(() => {
      inflight = null;
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return rate;
}
