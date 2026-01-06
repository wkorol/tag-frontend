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

const trackEvent = (name: string, payload: Record<string, unknown>) => {
  if (typeof window === 'undefined') {
    return;
  }

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', name, payload);
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: name,
      ...payload,
    });
  }
};

export const trackCtaClick = (label: string) => {
  trackEvent('cta_click', {
    event_category: 'cta',
    event_label: label,
  });
};

export const trackFormOpen = (form: 'order' | 'quote') => {
  trackEvent('form_open', {
    event_category: 'form',
    event_label: form,
  });
};

export const trackFormStart = (form: 'order' | 'quote') => {
  trackEvent('form_start', {
    event_category: 'form',
    event_label: form,
  });
};

export const trackSectionView = (section: string) => {
  trackEvent('section_view', {
    event_category: 'navigation',
    event_label: section,
  });
};
