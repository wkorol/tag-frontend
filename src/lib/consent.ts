import { isAnalyticsEnabled } from './analytics';

const STORAGE_KEY = 'cookie-consent';

export type ConsentStatus = 'accepted' | 'rejected' | null;

export const getConsentStatus = (): ConsentStatus => {
  if (typeof window === 'undefined') {
    return null;
  }

  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === 'accepted' || value === 'rejected') {
    return value;
  }

  return null;
};

export const setConsentStatus = (status: Exclude<ConsentStatus, null>): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, status);

  // Let UI react immediately (e.g. load 3rd party widgets) without requiring a refresh.
  try {
    window.dispatchEvent(
      new CustomEvent('cookie-consent', {
        detail: { status },
      })
    );
  } catch {
    // Ignore if CustomEvent is unavailable for some reason.
  }
};

export const hasMarketingConsent = (): boolean => getConsentStatus() === 'accepted';

export const updateGtagConsent = (status: ConsentStatus): void => {
  if (typeof window === 'undefined' || !isAnalyticsEnabled()) {
    return;
  }

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== 'function') {
    return;
  }

  if (status === 'accepted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
    return;
  }

  gtag('consent', 'update', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
  });
};
