const PROD_HOSTS = new Set([
  'taxiairportgdansk.com',
  'www.taxiairportgdansk.com',
]);

export const isAnalyticsEnabled = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  if (!import.meta.env.PROD) {
    return false;
  }

  return PROD_HOSTS.has(window.location.hostname);
};
