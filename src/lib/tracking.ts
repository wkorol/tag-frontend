export const trackContactClick = (type: 'whatsapp' | 'call') => {
  if (typeof window === 'undefined') {
    return;
  }

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'click', {
      event_category: 'contact',
      event_label: type,
    });
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'contact_click',
      contact_type: type,
    });
  }
};
