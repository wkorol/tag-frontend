import { isAnalyticsEnabled } from './analytics';
import { hasMarketingConsent } from './consent';

export const trackContactClick = (type: 'whatsapp' | 'call' | 'email') => {
  if (typeof window === 'undefined' || !isAnalyticsEnabled()) {
    return;
  }

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function') {
    gtag('event', 'click', {
      event_category: 'contact',
      event_label: type,
    });
    if (type === 'whatsapp' && hasMarketingConsent()) {
      gtag('event', 'conversion', {
        send_to: 'AW-17948664296/MOjJCMyiwvcbEOjDy-5C',
      });
    }
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: 'contact_click',
      contact_type: type,
    });
  }
};

const trackEvent = (name: string, payload: Record<string, unknown>) => {
  if (typeof window === 'undefined' || !isAnalyticsEnabled()) {
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

export const trackPageView = (path: string, title?: string) => {
  if (typeof window === 'undefined' || !isAnalyticsEnabled()) {
    return;
  }

  const pageTitle =
    title ??
    (window as { __pageTitle?: string }).__pageTitle ??
    document.title;
  const pageLocation = window.location.href;
  const ga4Id = (window as { __ga4Id?: string | null }).__ga4Id;

  trackEvent('page_view', {
    page_path: path,
    page_title: pageTitle,
    page_location: pageLocation,
  }
  );

  const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === 'function' && ga4Id) {
    gtag('config', ga4Id, {
      page_path: path,
      page_title: pageTitle,
      page_location: pageLocation,
    });
  }
};

export const trackNavClick = (label: string) => {
  trackEvent('nav_click', {
    event_category: 'navigation',
    event_label: label,
  });
};

export const trackLocaleChange = (from: string, to: string) => {
  trackEvent('locale_change', {
    event_category: 'navigation',
    from_locale: from,
    to_locale: to,
  });
};

export const trackVehicleSelect = (type: 'standard' | 'bus') => {
  trackEvent('vehicle_select', {
    event_category: 'vehicle',
    event_label: type,
  });
};

export const trackPricingRouteSelect = (routeKey: string, vehicleType: 'standard' | 'bus') => {
  trackEvent('pricing_route_select', {
    event_category: 'pricing',
    event_label: routeKey,
    vehicle_type: vehicleType,
  });
};

export const trackPricingAction = (action: 'request_quote' | 'back', vehicleType?: 'standard' | 'bus') => {
  trackEvent('pricing_action', {
    event_category: 'pricing',
    event_label: action,
    ...(vehicleType ? { vehicle_type: vehicleType } : {}),
  });
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

export const trackFormSubmit = (
  form: 'order' | 'quote',
  status: 'success' | 'error' | 'validation_error',
  errorType?: 'api' | 'network',
) => {
  trackEvent('form_submit', {
    event_category: 'form',
    event_label: form,
    status,
    ...(errorType ? { error_type: errorType } : {}),
  });
};

export const trackFormValidation = (form: 'order' | 'quote', errorCount: number, firstField?: string) => {
  trackEvent('form_validation_error', {
    event_category: 'form',
    event_label: form,
    error_count: errorCount,
    ...(firstField ? { first_field: firstField } : {}),
  });
};

export const trackFormClose = (form: 'order' | 'quote') => {
  trackEvent('form_close', {
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

export const trackScrollDepth = (percent: number) => {
  trackEvent('scroll_depth', {
    event_category: 'engagement',
    event_label: `${percent}%`,
    value: percent,
  });
};

export const trackOutboundClick = (url: string) => {
  trackEvent('outbound_click', {
    event_category: 'navigation',
    event_label: url,
  });
};

export const trackLinkClick = (label: string, href?: string) => {
  trackEvent('link_click', {
    event_category: 'navigation',
    event_label: label,
    ...(href ? { link_url: href } : {}),
  });
};

export const trackButtonClick = (label: string) => {
  trackEvent('button_click', {
    event_category: 'cta',
    event_label: label,
  });
};
