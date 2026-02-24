var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var _a;
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, useMemo, useRef, lazy, Suspense, Component, StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server.js";
import { useLocation, Routes, Route, Navigate, useParams, useSearchParams, Outlet } from "react-router-dom";
import { CheckCircle2, Car, Users, Info, Calculator } from "lucide-react";
const STORAGE_KEY$1 = "tag_locale";
const DEFAULT_LOCALE = "en";
const SUPPORTED_LOCALES = ["en", "de", "fi", "no", "sv", "da", "pl"];
const localeToPath = (locale) => {
  switch (locale) {
    case "pl":
      return "/pl";
    case "de":
      return "/de";
    case "fi":
      return "/fi";
    case "no":
      return "/no";
    case "sv":
      return "/sv";
    case "da":
      return "/da";
    case "en":
    default:
      return "/en";
  }
};
const localeToRootPath = (locale) => `${localeToPath(locale)}/`;
const getLocaleFromPathname = (pathname) => {
  if (pathname.startsWith("/pl")) return "pl";
  if (pathname.startsWith("/en")) return "en";
  if (pathname.startsWith("/de")) return "de";
  if (pathname.startsWith("/fi")) return "fi";
  if (pathname.startsWith("/no")) return "no";
  if (pathname.startsWith("/sv")) return "sv";
  if (pathname.startsWith("/da")) return "da";
  return null;
};
const detectLocale = () => {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }
  const pathname = window.location.pathname;
  const fromPath = getLocaleFromPathname(pathname);
  if (fromPath) {
    return fromPath;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY$1);
  if (stored === "pl" || stored === "en" || stored === "de" || stored === "fi" || stored === "no" || stored === "sv" || stored === "da") {
    return stored;
  }
  return DEFAULT_LOCALE;
};
const detectBrowserLocale = () => {
  var _a2;
  if (typeof navigator === "undefined") {
    return DEFAULT_LOCALE;
  }
  const languages = (_a2 = navigator.languages) != null ? _a2 : [navigator.language];
  const normalized = languages.map((lang) => {
    var _a3;
    return (_a3 = lang == null ? void 0 : lang.toLowerCase()) != null ? _a3 : "";
  });
  if (normalized.some((lang) => lang.startsWith("pl"))) return "pl";
  if (normalized.some((lang) => lang.startsWith("de"))) return "de";
  if (normalized.some((lang) => lang.startsWith("fi"))) return "fi";
  if (normalized.some((lang) => lang.startsWith("no") || lang.startsWith("nb") || lang.startsWith("nn"))) return "no";
  if (normalized.some((lang) => lang.startsWith("sv"))) return "sv";
  if (normalized.some((lang) => lang.startsWith("da"))) return "da";
  return "en";
};
const localeLoaders = {
  en: () => Promise.resolve().then(() => en$1),
  pl: () => Promise.resolve().then(() => pl$1),
  de: () => Promise.resolve().then(() => de$1),
  fi: () => Promise.resolve().then(() => fi$1),
  no: () => Promise.resolve().then(() => no$1),
  sv: () => Promise.resolve().then(() => sv$1),
  da: () => Promise.resolve().then(() => da$1)
};
const translationCache = {};
const loadTranslations = async (locale) => {
  const cached = translationCache[locale];
  if (cached) {
    return cached;
  }
  const module = await localeLoaders[locale]();
  translationCache[locale] = module.default;
  return module.default;
};
const GLOBAL_I18N_CONTEXT_KEY = "__tag_i18n_context__";
const I18nContext = (_a = globalThis[GLOBAL_I18N_CONTEXT_KEY]) != null ? _a : createContext(null);
if (!globalThis[GLOBAL_I18N_CONTEXT_KEY]) {
  globalThis[GLOBAL_I18N_CONTEXT_KEY] = I18nContext;
}
function I18nProvider({
  children,
  initialLocale,
  initialTranslations
}) {
  const [locale, setLocale] = useState(initialLocale != null ? initialLocale : detectLocale);
  const [t, setT] = useState(() => {
    if (initialLocale && initialTranslations) {
      translationCache[initialLocale] = initialTranslations;
      return initialTranslations;
    }
    return null;
  });
  useEffect(() => {
    let cancelled = false;
    loadTranslations(locale).then((nextTranslations) => {
      if (!cancelled) {
        setT(nextTranslations);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY$1, locale);
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [locale]);
  const value = useMemo(() => {
    if (!t) {
      return null;
    }
    return {
      locale,
      setLocale,
      t
    };
  }, [locale, t]);
  if (!value) {
    return null;
  }
  return /* @__PURE__ */ jsx(I18nContext.Provider, { value, children });
}
function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
const routeSlugs = {
  en: {
    airportTaxi: "gdansk-airport-taxi",
    airportSopot: "gdansk-airport-to-sopot",
    airportGdynia: "gdansk-airport-to-gdynia",
    countryLanding: "gdansk-airport-transfer-uk",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "book-gdansk-airport-transfer",
    orderAirportSopot: "book-gdansk-airport-sopot",
    orderAirportGdynia: "book-gdansk-airport-gdynia",
    orderCustom: "book-custom-transfer",
    pricing: "pricing",
    cookies: "cookies",
    privacy: "privacy"
  },
  pl: {
    airportTaxi: "taxi-lotnisko-gdansk",
    airportSopot: "lotnisko-gdansk-sopot",
    airportGdynia: "lotnisko-gdansk-gdynia",
    countryLanding: "transfer-lotnisko-gdansk",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "rezerwacja-lotnisko-gdansk",
    orderAirportSopot: "rezerwacja-lotnisko-gdansk-sopot",
    orderAirportGdynia: "rezerwacja-lotnisko-gdansk-gdynia",
    orderCustom: "rezerwacja-niestandardowa",
    pricing: "cennik",
    cookies: "polityka-cookies",
    privacy: "polityka-prywatnosci"
  },
  de: {
    airportTaxi: "gdansk-flughafen-taxi",
    airportSopot: "gdansk-flughafen-sopot",
    airportGdynia: "gdansk-flughafen-gdynia",
    countryLanding: "gdansk-airport-transfer-deutschland",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "buchung-gdansk-flughafen",
    orderAirportSopot: "buchung-gdansk-flughafen-sopot",
    orderAirportGdynia: "buchung-gdansk-flughafen-gdynia",
    orderCustom: "buchung-individuell",
    pricing: "preise",
    cookies: "cookie-richtlinie",
    privacy: "datenschutz"
  },
  fi: {
    airportTaxi: "gdansk-lentokentta-taksi",
    airportSopot: "gdansk-lentokentta-sopot",
    airportGdynia: "gdansk-lentokentta-gdynia",
    countryLanding: "gdansk-lentokenttakuljetus-suomi",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "varaus-gdansk-lentokentta",
    orderAirportSopot: "varaus-gdansk-lentokentta-sopot",
    orderAirportGdynia: "varaus-gdansk-lentokentta-gdynia",
    orderCustom: "varaus-mukautettu",
    pricing: "hinnasto",
    cookies: "evasteet",
    privacy: "tietosuoja"
  },
  no: {
    airportTaxi: "gdansk-flyplass-taxi",
    airportSopot: "gdansk-flyplass-sopot",
    airportGdynia: "gdansk-flyplass-gdynia",
    countryLanding: "gdansk-flyplasstransport-norge",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "bestilling-gdansk-flyplass",
    orderAirportSopot: "bestilling-gdansk-flyplass-sopot",
    orderAirportGdynia: "bestilling-gdansk-flyplass-gdynia",
    orderCustom: "bestilling-tilpasset",
    pricing: "priser",
    cookies: "informasjonskapsler",
    privacy: "personvern"
  },
  sv: {
    airportTaxi: "gdansk-flygplats-taxi",
    airportSopot: "gdansk-flygplats-sopot",
    airportGdynia: "gdansk-flygplats-gdynia",
    countryLanding: "gdansk-flygplatstransfer-sverige",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "bokning-gdansk-flygplats",
    orderAirportSopot: "bokning-gdansk-flygplats-sopot",
    orderAirportGdynia: "bokning-gdansk-flygplats-gdynia",
    orderCustom: "bokning-anpassad",
    pricing: "priser",
    cookies: "kakor",
    privacy: "integritetspolicy"
  },
  da: {
    airportTaxi: "gdansk-lufthavn-taxa",
    airportSopot: "gdansk-lufthavn-sopot",
    airportGdynia: "gdansk-lufthavn-gdynia",
    countryLanding: "gdansk-lufthavn-transfer-danmark",
    taxiGdanskCity: "taxi-gdansk",
    orderAirportGdansk: "booking-gdansk-lufthavn",
    orderAirportSopot: "booking-gdansk-lufthavn-sopot",
    orderAirportGdynia: "booking-gdansk-lufthavn-gdynia",
    orderCustom: "booking-tilpasset",
    pricing: "priser",
    cookies: "cookiepolitik",
    privacy: "privatlivspolitik"
  }
};
const getRouteSlug = (locale, key) => routeSlugs[locale][key];
const getRoutePath = (locale, key) => {
  const basePath = localeToPath(locale);
  return `${basePath}/${getRouteSlug(locale, key)}`;
};
const getRouteKeyFromSlug = (locale, slug) => {
  const entries = Object.entries(routeSlugs[locale]);
  const match = entries.find(([, value]) => value === slug);
  return match ? match[0] : null;
};
const SCROLL_TARGET_KEY = "scroll-target";
const getHeaderOffset = () => {
  const header = document.querySelector("header");
  const headerHeight = header ? header.getBoundingClientRect().height : 0;
  return Math.max(0, Math.ceil(headerHeight) + 12);
};
const scrollToElement = (element) => {
  const offset = getHeaderOffset();
  const top = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);
  window.scrollTo({ top, behavior: "smooth" });
  window.setTimeout(() => {
    const correctedTop = Math.max(0, element.getBoundingClientRect().top + window.scrollY - offset);
    if (Math.abs(window.scrollY - correctedTop) > 10) {
      window.scrollTo({ top: correctedTop, behavior: "smooth" });
    }
  }, 260);
};
const requestScrollTo = (targetId) => {
  if (typeof window === "undefined") {
    return false;
  }
  const element = document.getElementById(targetId);
  if (element) {
    scrollToElement(element);
    return true;
  }
  window.sessionStorage.setItem(SCROLL_TARGET_KEY, targetId);
  return false;
};
const consumeScrollTarget = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const target = window.sessionStorage.getItem(SCROLL_TARGET_KEY);
  if (target) {
    window.sessionStorage.removeItem(SCROLL_TARGET_KEY);
  }
  return target;
};
const scrollToId = (targetId) => {
  if (typeof window === "undefined") {
    return false;
  }
  const element = document.getElementById(targetId);
  if (!element) {
    return false;
  }
  scrollToElement(element);
  return true;
};
const PROD_HOSTS = /* @__PURE__ */ new Set([
  "taxiairportgdansk.com",
  "www.taxiairportgdansk.com"
]);
const isAnalyticsEnabled = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return PROD_HOSTS.has(window.location.hostname);
};
const STORAGE_KEY = "cookie-consent";
const getConsentStatus = () => {
  if (typeof window === "undefined") {
    return null;
  }
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (value === "accepted" || value === "rejected") {
    return value;
  }
  return null;
};
const setConsentStatus = (status) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, status);
  try {
    window.dispatchEvent(
      new CustomEvent("cookie-consent", {
        detail: { status }
      })
    );
  } catch {
  }
};
const hasMarketingConsent = () => getConsentStatus() === "accepted";
const updateGtagConsent = (status) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  const gtag = window.gtag;
  if (typeof gtag !== "function") {
    return;
  }
  if (status === "accepted") {
    gtag("consent", "update", {
      ad_storage: "granted",
      analytics_storage: "granted"
    });
    return;
  }
  gtag("consent", "update", {
    ad_storage: "denied",
    analytics_storage: "denied"
  });
};
const trackContactClick = (type) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("event", "click", {
      event_category: "contact",
      event_label: type
    });
    const shouldTrackContactConversion = hasMarketingConsent() && (type === "whatsapp" || type === "call" || type === "imessage");
    if (shouldTrackContactConversion) {
      gtag("event", "conversion", {
        send_to: "AW-17948664296/MOjJCMyiwvcbEOjDy-5C"
      });
    }
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: "contact_click",
      contact_type: type
    });
  }
};
const trackEvent = (name, payload) => {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  const gtag = window.gtag;
  if (typeof gtag === "function") {
    gtag("event", name, payload);
  }
  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: name,
      ...payload
    });
  }
};
const trackPageView = (path, title) => {
  var _a2;
  if (typeof window === "undefined" || !isAnalyticsEnabled()) {
    return;
  }
  const pageTitle = (_a2 = window.__pageTitle) != null ? _a2 : document.title;
  const pageLocation = window.location.href;
  const ga4Id = window.__ga4Id;
  trackEvent(
    "page_view",
    {
      page_path: path,
      page_title: pageTitle,
      page_location: pageLocation
    }
  );
  const gtag = window.gtag;
  if (typeof gtag === "function" && ga4Id) {
    gtag("config", ga4Id, {
      page_path: path,
      page_title: pageTitle,
      page_location: pageLocation
    });
  }
};
const trackNavClick = (label) => {
  trackEvent("nav_click", {
    event_category: "navigation",
    event_label: label
  });
};
const trackLocaleChange = (from, to) => {
  trackEvent("locale_change", {
    event_category: "navigation",
    from_locale: from,
    to_locale: to
  });
};
const trackVehicleSelect = (type) => {
  trackEvent("vehicle_select", {
    event_category: "vehicle",
    event_label: type
  });
};
const trackPricingRouteSelect = (routeKey, vehicleType) => {
  trackEvent("pricing_route_select", {
    event_category: "pricing",
    event_label: routeKey,
    vehicle_type: vehicleType
  });
};
const trackPricingAction = (action, vehicleType) => {
  trackEvent("pricing_action", {
    event_category: "pricing",
    event_label: action,
    ...vehicleType ? { vehicle_type: vehicleType } : {}
  });
};
const trackCtaClick = (label) => {
  trackEvent("cta_click", {
    event_category: "cta",
    event_label: label
  });
};
const trackFormOpen = (form) => {
  trackEvent("form_open", {
    event_category: "form",
    event_label: form
  });
};
const trackFormStart = (form) => {
  trackEvent("form_start", {
    event_category: "form",
    event_label: form
  });
};
const trackFormSubmit = (form, status, errorType) => {
  trackEvent("form_submit", {
    event_category: "form",
    event_label: form,
    status,
    ...errorType ? { error_type: errorType } : {}
  });
};
const trackFormValidation = (form, errorCount, firstField) => {
  trackEvent("form_validation_error", {
    event_category: "form",
    event_label: form,
    error_count: errorCount,
    ...firstField ? { first_field: firstField } : {}
  });
};
const trackFormClose = (form) => {
  trackEvent("form_close", {
    event_category: "form",
    event_label: form
  });
};
const trackSectionView = (section) => {
  trackEvent("section_view", {
    event_category: "navigation",
    event_label: section
  });
};
const trackScrollDepth = (percent) => {
  trackEvent("scroll_depth", {
    event_category: "engagement",
    event_label: `${percent}%`,
    value: percent
  });
};
const trackOutboundClick = (url) => {
  trackEvent("outbound_click", {
    event_category: "navigation",
    event_label: url
  });
};
const trackLinkClick = (label, href) => {
  trackEvent("link_click", {
    event_category: "navigation",
    event_label: label,
    ...href ? { link_url: href } : {}
  });
};
const trackButtonClick = (label) => {
  trackEvent("button_click", {
    event_category: "cta",
    event_label: label
  });
};
const favicon = "/favicon.svg";
function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const basePath = localeToPath(locale);
  const handleLocaleChange = (nextLocale) => {
    trackLocaleChange(locale, nextLocale);
    setLocale(nextLocale);
    window.location.href = `${localeToRootPath(nextLocale)}${window.location.search}${window.location.hash}`;
  };
  const handleSectionNav = (event, sectionId, label) => {
    event.preventDefault();
    trackNavClick(label);
    const scrolled = requestScrollTo(sectionId);
    if (!scrolled) {
      window.location.href = `${basePath}/`;
    }
    setIsMenuOpen(false);
  };
  return /* @__PURE__ */ jsx("nav", { className: "sticky top-0 z-50 bg-white shadow-md", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleSectionNav(event, "hero", "landing_logo"),
          className: "flex items-center gap-3",
          children: [
            /* @__PURE__ */ jsx(
              "img",
              {
                src: favicon,
                alt: "Taxi Airport Gdansk logo",
                className: "h-8 w-8 rounded-md",
                width: 32,
                height: 32
              }
            ),
            /* @__PURE__ */ jsxs("span", { className: "leading-tight text-sm font-semibold text-gray-900", children: [
              /* @__PURE__ */ jsx("span", { className: "block text-base tracking-wide", children: "Taxi Airport" }),
              /* @__PURE__ */ jsx("span", { className: "block text-xs font-semibold text-blue-700", children: "Gdańsk" })
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "hidden md:flex flex-1 flex-nowrap items-center justify-center gap-4 lg:gap-6 text-[11px] lg:text-[13px] xl:text-sm min-w-0 tracking-tight", children: [
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/`,
            onClick: (event) => handleSectionNav(event, "fleet", "landing_fleet"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.fleet
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportTaxi"),
            onClick: () => trackNavClick("landing_airport_taxi"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.airportTaxi
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportSopot"),
            onClick: () => trackNavClick("landing_airport_sopot"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.airportSopot
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportGdynia"),
            onClick: () => trackNavClick("landing_airport_gdynia"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.airportGdynia
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "pricing"),
            onClick: () => trackNavClick("landing_pricing"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.prices
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-sm", children: "🌐" }),
          /* @__PURE__ */ jsx("label", { className: "sr-only", htmlFor: "landing-language-select", children: t.navbar.language }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "landing-language-select",
              value: locale,
              onChange: (event) => handleLocaleChange(event.target.value),
              className: "border border-gray-200 rounded-md px-2 py-1 text-[11px] lg:text-[13px] xl:text-sm text-gray-700 bg-white",
              children: [
                /* @__PURE__ */ jsx("option", { value: "en", children: "EN" }),
                /* @__PURE__ */ jsx("option", { value: "pl", children: "PL" }),
                /* @__PURE__ */ jsx("option", { value: "de", children: "DE" }),
                /* @__PURE__ */ jsx("option", { value: "fi", children: "FI" }),
                /* @__PURE__ */ jsx("option", { value: "no", children: "NO" }),
                /* @__PURE__ */ jsx("option", { value: "sv", children: "SV" }),
                /* @__PURE__ */ jsx("option", { value: "da", children: "DA" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/`,
            onClick: (event) => handleSectionNav(event, "vehicle-selection", "landing_order_now"),
            className: "bg-blue-600 text-white px-3 py-2 lg:px-5 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap",
            children: t.navbar.orderNow
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setIsMenuOpen((prev) => !prev);
            trackNavClick(isMenuOpen ? "landing_menu_close" : "landing_menu_open");
          },
          "aria-label": isMenuOpen ? "Close menu" : "Open menu",
          "aria-expanded": isMenuOpen,
          "aria-controls": "landing-mobile-nav",
          className: "md:hidden text-gray-700 hover:text-blue-600",
          children: isMenuOpen ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "block text-2xl leading-none", children: "×" }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "block text-xl leading-none", children: "☰" })
        }
      )
    ] }),
    isMenuOpen && /* @__PURE__ */ jsxs("div", { id: "landing-mobile-nav", className: "md:hidden pb-4 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleSectionNav(event, "fleet", "landing_mobile_fleet"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.fleet
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportTaxi"),
          onClick: () => trackNavClick("landing_mobile_airport_taxi"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.airportTaxi
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportSopot"),
          onClick: () => trackNavClick("landing_mobile_airport_sopot"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.airportSopot
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportGdynia"),
          onClick: () => trackNavClick("landing_mobile_airport_gdynia"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.airportGdynia
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "pricing"),
          onClick: () => trackNavClick("landing_mobile_pricing"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.prices
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-2 text-gray-700", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-sm", children: "🌐" }),
        /* @__PURE__ */ jsx("label", { className: "text-sm", htmlFor: "landing-language-select-mobile", children: t.navbar.language }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "landing-language-select-mobile",
            value: locale,
            onChange: (event) => handleLocaleChange(event.target.value),
            className: "border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 bg-white",
            children: [
              /* @__PURE__ */ jsx("option", { value: "en", children: "EN" }),
              /* @__PURE__ */ jsx("option", { value: "pl", children: "PL" }),
              /* @__PURE__ */ jsx("option", { value: "de", children: "DE" }),
              /* @__PURE__ */ jsx("option", { value: "fi", children: "FI" }),
              /* @__PURE__ */ jsx("option", { value: "no", children: "NO" }),
              /* @__PURE__ */ jsx("option", { value: "sv", children: "SV" }),
              /* @__PURE__ */ jsx("option", { value: "da", children: "DA" })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleSectionNav(event, "vehicle-selection", "landing_mobile_order_now"),
          className: "block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors",
          children: t.navbar.orderNow
        }
      )
    ] })
  ] }) });
}
const logoAvif384 = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAAEsbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAACxpbG9jAAAAAEQAAAIAAQAAAAEAAAGcAAAGkQACAAAAAQAAAVQAAABIAAAAQWlpbmYAAAAAAAIAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAABlpbmZlAgAAAAACAABFeGlmRXhpZgAAAAAaaXJlZgAAAAAAAAAOY2RzYwACAAEAAQAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAGAAAABgAAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EgAAAAAAATY29scm5jbHgAAQANAAaAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAbhbWRhdAAAAABNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAGAoAMABAAAAAEAAAGAAAAAABIACgY4Ii/39gkyhA1EaABhhhhQtF7f/PsQRFhDzHts6WSgepvc3k4J/obSxzMGtSdKm36T+R75cTh9rA9z7iNNc+C4EEJY3efiSuHiU294cgf+8eaJY0lNGra/JoPkw3PhfGYIWQspdFOF3UMByGIQsSmmEhHaOcyFYvNssMLbRz/gfnTdoU868hlkUIhycWmMaQdjUndozKkdcmG6jW9Jp90kfzKQBL7sGzWdVoXZUDRC6ZNUPMdO0DIj0wNJ0/W0082VYZ4+2HS+qdpqlxqL69VI6CzzCvti6ZTGVY90nUfL8bNs0Ae4yGQJ7F+5R33RSfWuDxS8X1s21PLgnwpe5lVXBezADn47JTekXTQ5d90y/hhhE8Yhya+DfzN0Uxck8LfxYoc3pKLq+ruejGOuhbKe9hcUtpZVOQlwYrYvzEV1Sp5ZCd3b2SGrxXT+I+dW6rpWpgYUJlAUqyyDvlsINUbo5sysv7nw5WQCPEP3ohx2KswPK5cMsrFFCDt4DncyBOWMugqWbf+KO+AEGzmEfo6GDxgXvLWz4hnLuGvEfQORqJ7Y00IvnK8jVFKfWk50/hVmkmQH9IB0u5pmgKaF361YEorpV7xGeSDPwBU1dRAy26xQ9fIxtkgUdJx206AoiGT0+B2+KI3lAyCemrKU+EbjjP+ZecygCLlLRkHjUgaHycrOOi4vUQHDJBKEVKsaA+AU3I1QUMCdnHe9kzlwl3OZDEh56YNu/uB641eOCv4nAJhkjFmYxACNlOdAVBXfQlr6DreuTT6TLYflpeGN48lKP0EIXgEmim00Of0YTbiIK/kwt6jfaEWNBFeF8+j4avYa1naLSC/+DDGteUiMLzPRodeQtkNJoiT5hg0ubD+CwbUjROJ/Nodq4pVhmpFA7hH4m0a+UCTHjWyrSmi5yUGq/zTpN7OeSULvFY+7y+55k1CrgaSJmtgWEaPAPgLNR92NvuUS5OeBvHeNfXq8BOxdrJEC9+BrKNxPdQjdhGBo1y+CfPmi2yvEeP47CVE6P7+qUFY43ckGiAcu8EaHp39EYaFKx3IH2EX5cfdfI2NCI1LJJjX7lbaecK7qBmOZcBuESVVVA+gS4N2D440Z6rOxpUSv8+Gl+88J5La2bPMn/VcO/IN2MNvVBpLGYJkD4d6jdekVjr82ygbVT8QCTozzUNsfpBNu4xr+Eg40MoJStc4J29K1AfYnVAZ5029naMG1QJZYW1hkcmmtRqaNQQExEJHjYg54BkJUx4v8gBL5l9jsiENQ3A3IA+CUA0GYUQ6luuZZcgzoZ+J26dvcs1+fjnw6IF6lyNi0DoCIiPqdwg7Dn79n0CYi77rfV2xtNoZlEt3WnVfQ68S/KtXSVYrM3vtKG9iLjYck5CzeCXOkfPMk/xnJo7E6j8Vw82eq9yp5fTC7YRi5oUTd8PV/1AcfcBphXm3KukzWIJYZ2YHzb3QPRE/HWvckrHaGwGlHBxvf915RIpFrx6kTLaeWZTb/EbwrCxh8Eo9DZDlaOq8H3vjHKIv7SQ3zV2YMsr2/NIvlw2+L8a9DEH7XzqH56P0xBTzWJR91veqp8IHZXcLVbwFhKKG/03WZExLze5PU4ZV9nZVWg/CBRdCmy9xeBJgDOm7R+aVG+Sxfmk4rsFLuDC2swLLyVYd16DzeJohURajEdfRk+R3whrxpZAo8s/0MhdVRk+CTUW43CdeIkLLsfwrUifm7A3mDSmVSxUvwY20vwhF79CzaZ1J/fJgvyHBkHyHtbBtS+NpeaE6nocPpQl0BYlxlVCVb9mcK7ZYNDHZsE/dJ8R5KnSgnKP76SoVbbi4q4tt8vaUd7zp67SodldKSiZNL9woEMraHceWon4bA3KdKAarZ48Bi080+9UCz7L8xrjpHu4IBeOsk6zAWx8sN7HfzFYAv5CMZiiTMJHEZWiN6u4q/T/8v2q/sMBSDASoa3kPYAfkAAeWBQvQgLndmm/Fk917B4SF4e9ztHqaYt9VolAKNy9QP/ARPRqMf9ZwiRXEi64CilhvuNvqxvVN75mSoYOCMJag/iAN3WSZoMJC81+32RfwDSCC0IyWNMolA8EPnMXoX0qcFWZKayBksun+YsBiYdOEM8O8zW/baAGAv8x60qnfNfMGdEdyRi1TfNwhZwwDdG70jmbG51Ziq52vh8OqJelMfBdA+1TKL4H6vtjIhF+hrzIXQNuo50BIAxvLKLTACHaO3BR1+rJjyc7mQvIwXATvVEMA=";
const logoAvif512 = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAAEsbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAACxpbG9jAAAAAEQAAAIAAQAAAAEAAAGcAAAJFAACAAAAAQAAAVQAAABIAAAAQWlpbmYAAAAAAAIAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAABlpbmZlAgAAAAACAABFeGlmRXhpZgAAAAAaaXJlZgAAAAAAAAAOY2RzYwACAAEAAQAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAIAAAACAAAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EhAAAAAAATY29scm5jbHgAAQANAAaAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAlkbWRhdAAAAABNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAIAoAMABAAAAAEAAAIAAAAAABIACgY4Yj///gkyhxJEaABhhhhQ9LrRPi6c0894eU5tnSyTLdbDKXauYAEEikfs/hS7Rv0cYNVbzPhPCMuU9TPpKdMzjR+8aehy8W23i87UbMiUPjGpBFPPd04e8zXWfRP3tMopYwXaNWPWik+7sKnGSKTeH1NW1ytKgS0eZS2fMfSc1WnUtSZZcHBgbpLSpvXne3jhevZDy8foD4dezbaDzP7RJ0Pcsm3EkdB35YYyehHFAIn7ywFiJh0xDtSIPy4Zd23hs3p+syXzP8zKuWPGWPd0F1XAJwVoQbr12wWwF3JjDWXhxIz/oIPDWBR8HCPGzzisKTKSd+bV2LMwa6ViifoGqktf3rbqRFQat6NIdSxEQj1sy5Wjdgd9NQ5wX+QkXic7uZTYUOdyiaLB1bMPEbRtkIjPOymNJV23/WDIaahzv4Q0e12U4TN1DcbjgwowpeHBkGo5AIdZSuSeZRU3NBUEQE8Mkcup0Z3fVNlmnSQzsVwU8jVtBjlN1XhtfxvalCQyzWW3YZWyRX/xUdVJJGI18BDs1Q3/tPInuwr1UpiAGiLRfLhhGY3k2/y2vNzWaRUkzGm8JgPQrzTnH/gikd6kJ1tLCgiYj2F4wnpTFmG4IVvLTQhfyKbyftiN0wDc4ULnpleB9825OUn2p9AVLIuDWNl9+9lgNJHky3s8XOfTRaPxlJCwKbc1std4QcqyRftl15+clUrKt9DefzkNrRDkvoG0ZX158c3Vxx14xwMaEfP0S922WnNzbDNhcJsOAgAjtH31KXej1OQnp2k3ukbrmUqeMh305zCU25KBJinf6wzE4RvEUbluAduPNC0XwusjJTWzz0LrWavbBgA3SkJiucErZ1EDIFLGXVXfhS3HGnzhuI/Vy7VkkzOMvbOxRF2I5KUpm4Th4wEKQ0AdDnWgCRn59dY6gBgUkmpLq2xNt+OJ5f5GQ65bwhtXkJqrnVKWTwlG8roKqEYfNI/damp+qP9JsF2ZeO3JTBVI5RfPhNJ/jSaS56bOVWdwhIyEnZT7GHSlcTULxF5MrLTbcnkCNyurSSCu0P3GtEltBR4KrHBagsyWO2ll9mogRynqZMZquN9GqrMrPk9hbyqgqpLu5SGzJ+VrjgZ37niH3PIwrQg+Rl0GZ3hWT49SxOeV7Rl4CNOgCzA+GuXZ1J0NO8udOWdaDcR5Q3ZoGCPp4/nOHuqvPkrbf0E9/oiJfVckydz2ORwKoSE0pKCWR2LWysiGKDAIWkLMIvqbIcjfkWCAQeFY28FVHPubyR+UFM3WutfGBqbSk3op8cQLcW8UmEiX5Uonggnl8qr9RgS2vh42ItXs9tFWHjgI/ynCqebbir6NkaUf97vxcLIVckBse8kjLJszSaopr2mWyn8lfl/4ETknAl8iyZet3yajiJQJFte3tCMFhVByzs3vqvarqH8JAwD/l0DDraIpYtt/Xd9/FBZoOqlzh1wfkyfcdzdMIppJgubwAAPBfmjsH+You/D7fS2SwSJc84gkgzXfBobFKwifsAwu/lVAu7QIa4k9atfEEM+Q93jMOYNZeyu1cXE2HoedpZ5jttuwt+Ylbtd71TutDzqv7SqPd6id9GscxoupWBYjRA6OfWRaagQ69Ax/6pXvC1khe/ubYH60BWr2iDVb1Fi68W0j1K2nYK9nAvafEvMLEUej+Pp0fBC3RL+tTusuLFtei/NXAu5xXaZqO8em0c78lDLjhKRu/PhTpCmwkFaOMfiB2gk3toow/oBcdi8BuD0017omVBq8HXgLS7qgLRf1QqD4e2uax45+i8TVmvfmaqnLE3umb8X0+V8djp/bfIhGnT/5hmjMBOor0LE7cjcLDqQ8JnYo0GGTv8jaOoGzHVs5M4ANPzuidkO/5/Iei8+iuo6e5UKgmeNvC/igX//xLQqVszsnCpjbmqoFA3lxeO1FiB/BO/qHeHgbjmG3Ht3As3Axd9OaIUUgl7CD+5Ra2jb9kbprsAYf4MjIhQ7mlPgWz1Cwd3Ukk7UsNX07M9MY6+SbhLkQxV23+JYRK5HHObLNV+4vCJVL79KLstzaYSeN4ZziBuQCHm9wIALVD15FtAkpDdjCk9by+DAAEwBSjM2F+FcUBBhCRz9/IBPN+iZpzLp26cl0BoYnNGqjT6uMM0FU3LN1l+3W+ttoEBJFWGReBbOfBjJiF7Q3NaMenUjC1B26c1mLowzlNPotSIFT5FVK4jlUn/vbAs55SEEJ2Ru+4wC0x7eC25fvJ1L31ova5HQdx7T5RvjzDjCNWt5eAuoXqutAyQVAhLWhrj2hGZlVUIfB2px5hOnMx2trxZiClZVnOFvGP0egU7hWN6snbYEPdiYjvB8FNguKnm5Aft87CSeuxB0pJHFlcIULr2G9avWCh2TUI1hRV9qfpuwKPvc1wGHG+cKXAWHQYTy6Cmy7cwAycrhTdgh5SKXCwIxSkDgc+bnSyqpy+kMv8j+Nchx9N8YbMYn6UjILdCyDK7/qXf32KKyCTPmhzL3E3qyPBrH89NDg8+QTQSrqypo/EkavsJOhuHs61BV02GDHQQDINW7rvF4KlLv5++B5Q5QIxPI3ozlpBcq535ubZihh3xDvdM5LhORdp6cdNdJV9XNCS3Auz+n3aJM/IMg6w7xC2uiLwfV3QA20v2jrTQRfDuNppicdSuIubR6mmEKcf6yoKj7uRJD5u9Qq+biC33pSfGJSHexPLeyY64Pa1MHOhx9Gnz1gIKawk9KrFLxe/UbtwyXUDkTREL8fvlb+Tp72dd39/8NpggHXuvDxkOlSKjX01YNOuQ7V6ZYuUTqBi4yVbhrHyUKUvA3VrLpn8N952U7dv+RCyHMpKlkNTepMu6mc32YnmYLZpIMleQG99Iiav0bkYwlHWJW0xbsxJvxAeDy999YPDKx5Ld0+tvzI9jkmnlhPoVH7JpTZD+zncPE3QF2JOUTQ9e88zhTcPxVQQ6NJb2ZfJTGpbq1NKJoJXl2LYQzgaPZpAMYWcN5FqJnc+Ni1PoxJUlwiL1m5qJfRZ5G2ILSVWHGhDWwSrIb82Ab6CJxW4bayPDDxgRszmmqnFp4tqIdtrna6s2B7h3bhOOf9T74vYK1g";
const logoAvif640 = "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUEAAAEsbWV0YQAAAAAAAAAhaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAAAAAAAOcGl0bQAAAAAAAQAAACxpbG9jAAAAAEQAAAIAAQAAAAEAAAGcAAAL6wACAAAAAQAAAVQAAABIAAAAQWlpbmYAAAAAAAIAAAAaaW5mZQIAAAAAAQAAYXYwMUNvbG9yAAAAABlpbmZlAgAAAAACAABFeGlmRXhpZgAAAAAaaXJlZgAAAAAAAAAOY2RzYwACAAEAAQAAAGppcHJwAAAAS2lwY28AAAAUaXNwZQAAAAAAAAKAAAACgAAAABBwaXhpAAAAAAMICAgAAAAMYXYxQ4EkAAAAAAATY29scm5jbHgAAQANAAaAAAAAF2lwbWEAAAAAAAAAAQABBAECgwQAAAw7bWRhdAAAAABNTQAqAAAACAABh2kABAAAAAEAAAAaAAAAAAADoAEAAwAAAAEAAQAAoAIABAAAAAEAAAKAoAMABAAAAAEAAAKAAAAAABIACgc5Jmf5/4JAMt0XRhaABhhhhQAATgf0utE+LpzTz3h5Tm2dLJMt1sMpdq5gAQSKR+z+FFd/Eihbd7SLkS6js1RCuQwDfquOrcdbIZr8Y98xMg6fbIAe757/YgNgu7MjuutkkHd427elvTA/ein6/x/1RwPlyvztJ2gt6841zIcLjk+O5hghv22lPnR2pgvxRKHUn/KWZt+KUwzVVgvkx7OfBNfqdw5rQMDXawOT1ZAVn0yDrDWWqtX6fkGJqXZtIWsZ9Ev4wW//Y8sW+joa617euvh67a/PVVKMU4UQ43RvCsxAaYO0V4R4YYiTeiZVM5t86RoIxq4I8oyh2Wc0SxmUk5RcBKaGTvjAuqSdi8ddc4qJ+ny3WXD5crBKrBd7TB8PTsiv9yBhEw7De2XYvnJUaBB4lTwHVzk68K6pyqej4YzEht8TKpyYGMFN73hM26G7ttMXSMUfZiBphy1zbXAGR3wFI5aw0XQIOw5dkNEb5e6tEmtIHZVU7kM8TWZWtrrwUaJ0bfWmUUnUxKjD+VmCvyScWtCfesd0jr0hYE7rtd42gj70LtLTxkH81Vblp9KOwns/MwKjaKVRQ07tLD8q/c5PLuFq4vRpJXm0nVtee+d5T3pMv1srlfzKTT23IDbvjlpFIPlIQIYp3jfrr8pqWiOSZO2H95llRJv+zTmTguMiMJe5ObyZCHLpy/MRxzNEVWzdF4NKecVi82ur41Dxdt/ciftHoXkvrZIFNGNcBH6WGVx0/JZFui2+WwqIwK3zPmahz1FZNREdQBjznKfimN/IQ24iBUT3/qEeZEp4AdnvRv8FlXpoej8Qtt1+rfrPvf5ydcDKFm2kFunk2q122GW0CvB4TtPvMMse4CBwkisWxhjqL2fBfvlTZYd+WhM6/w8bL8QJ+1r54JyTdz5JW3vDki/pUinVclgGQ9PP9ecObNkmKE6u/wqbIBcGypUhBqhMVltnVkzZHSe1YM48JCXbuyM/k4/9J9fjFrfUojqcn0102ec6DZQ3/6G/ALSJ7hvGzrFYmagiK7GUWD7NUXvEzBJbaPKaP3n1rv2M/HeeRNkt6mfALNaY6qcaRsz9MbvTI/CFvKMcOEnRleg2jb9PqITrJDESeU4fI4pDk6jyvUe533mVH6HXPD8WJgEJzvcGL6EMzxpOivZEaw9Ld2kYkCBTHUk3okqRffysmUwZ3wCriAziExNq163MveCPXEQLLLeE0UxG8j6VvFZuXUAELElf42fhJsmhuXyQzDCK1cYRA4/2plpxsP7gWAKgSz9suVBoiy8jo9Zc4a3eU7/Gmu7H1wyrURfWoAIwnB13KOwOyRW2r3rR1gRZJYx88vs0Obi1J0SQfcDtuQ/2h+JLX3nuEY8tQB2l2b0Xlk/znva9Pikfc7rVrcs2zUXL6Tv4WhjPsTOygBHCBgxlq4mWsojA4kZioIaAHSSyHqxYon3eARxQWG3l9VhssxbVL5OWHUeKzyxH0+ZKyaJhB1qdbwc2Dwo+DF2QIoEwXtJnCcrOeGqyKzIMeb0P9wZpUNxbxKeTGcmcMZaqnvm/rjGKt1+ZDrxx4o1dCdR3y4SGxOoe9mpc56ddIaDXmOaNJPTslCDay9k8ohkuwWpJOt2CBJZ/qVdrl9BMIg2LL9R177Pgz5Pi9evznera36mxRbHhXzzwR3WJBNM8WWT8plQaga1w2+ncTn25PEpzb7AifDgxCZG5jHoFZ5Smvz9o6DV/y3qqWx254cATSayKOZhlIRi+sU0jddMYoxOvMa4Lapie1/RSxBgSO1zxotzomZ15o5IdMStH/V4x/iJJ3nBBKX+E6zh0B/AZBXqmO2eoprFxmIhsd4dAj5weQJKi2AY8mambFxXCUeyR7e6IY+0XShH44Sp+fzypOScV+uIeCJNyldgURuCWJN7He6kXdZaYjJRZBqNXey65UZ0O0F4/cHK0WBgAPA5eLubUGp8g6+dgWyDIMhg3WWA82oOUu2p3ALpP5jmrIy6xeoVMYun+Bu2/YKfAytD23tRxs/bxY1D0BGhBgmmIP7NvGFniZlugR41HlbMjujWAucFvyXugaZU1cJs3VC6zpHNEI8Eg+f/x7331cbuwM1WQBN14LMIfuSOcfQJnt5O9QAyxVau/HujeL6Qx6znV3njxBnXTBV6Wsb4X8780+q9gns3fAThJyDh+5mH1gdiXCyoX8+5e/WzI+OQ0F4kYnWwippysL5TMhAYbnTIT63AgA2C0SlJuXg2siJgAT2yf/Lw2Lp/Sb2e1e2HwZOs4QEfTDKJ6wzjymSeYlo8UMzalN30i1xyFHEz/mDeIkOM3bih5+LaB5b/VkGNyMYD1XnmH80xUfJOZuex0HUUqWyVO0kNMRbs9fmq0QoNZXZLkrn+jbnLYJEfMyL3iD/CR8x6nsPjeFXWSSMEJPM8sNME9+g2c4aj5gfI505VURRx2gBEYUSO6caUnLPp5V48xd0Xh7xLVW7u/Pz3JkUsHzyAgsGVU30PJDu7IQtsYxXWilFUqL8t1jPS60T5KGfoR8Mh79cYZkzE3riCbPIUrhl/nxY7XqSy8pPiQuHj8eonpwTkjAHo/3sRLN6ONqCmQ6h1/Z1mvS7SuMXs9ZHaPSQfTheNn6Az9X9jz/DhrYYaXygES01hvyjoKjTSnB9vsecL3DNvYtUmTiqjJCssOiZQ+sMCYjWWon1CLkrrdTsW9MWotI4vfxfee/pzpbe7gmm+SzAxw0K0TFYBjbC4USRzB6J/WQEdyq/ivI/jpKmju42jBOn1uFKp1p0wHIIYCxjhw6GSCTTeJeT+AXmpKSf656WA0Lf8Y0Uw4+tcgyppp0hgQNaszjzNadHS3sTMJy6VJb3Eokt7PHQYJFzxbo0+PEn1sPBq/QzoBMPinsdSVHjUdNTQRohosNK6bHjGdLeU9Nu+7luRtcH3aMU73vzl99hmC4kXC7VYwTjU/VOy3t6ckZ/2WoEE8NW6a69IhIdtwhhqWuFijfNNcUqrb3Sus/47vloTFC3qHIBAvnRznItJ3+DUPCTZgOVbSuPyaHA4blWFzuNPZftadhDwlu0YTT0WWhrLtWuvHPVNxegE0fEOqEYcE5UMr2l+z47Gix2hlqYWwvGNqHuSdrlwKAAeRXIMhkShVQOByjRPQzbwi/mDrx6Xxubv9L7AE4bkRu4HltVBj+0t7yYRMBZ6XG7HqbUhUyhaKer7FuGq7ElmmeW9B3+qXjAeYjtvyiVkqZVAT+pFphyNH0p8KDNr4SkfUU3Wu29sJoYkq604FS6MlMEkVK/+grWbJnp7+LH/xqqheBRu1vPF06ivk0Z0FwYIALh2IbOOYyhumdm82xTF9Y7LWjxBUuM6PjH8PgdXNdUtegE/ABjqEIyJJ0292LPJ5ieyKSnU1bpGPS7yArnVtDoSbL0S2sdb5fILodxZmXxh9oIf8lUacMcygF7ok9xDs/dsQNQcTuA98WOfZSoswXwANwrq2BwjOaSrA3/NGSZbfHv06iHHiTpRvAVIta3fa3U16jedwa65H0uLjJmcj/zS+1dQQq60a6DcrdSvgH0Q7XYWtRTVamjz4zp5xNHwNg9OnBLxWuFaGfrtWRKEuuxKux9NGWTrJCOc8vinYwVD5nmT0C/R0tUELfzI/FsvD008G7AkIBYTSmYFXqMhnITzPjs7fSBK7KJIkM6fIZn98SEuzOo+mCab0D4qN2KYJTTuSqJwhH7CWjuzn0vigw0fX7MQIbh+Iaix3xAVLvdzEEpJ/4E7WUqOZIjysP1EU7d7eR5fob29fEV5CHZCQoysPOjr9dP/3SedQCwqWS+B0wm6GnP7CWcJivMMtFbHNipgAow5vwx+pSb1+uK6Mlq1FlfR/sTycEPNWzy+Z3Uep8UM7LOEvHUxAKyGw92OuMOW9Yoq/fiaDynlxvVselpoFq/cuav89OJv75Vr5k4fn7aFlU5SScGQNlDORoj/PTFlAY9o8mwcUDF9wanP7yfhwNlBZ6oSsGYxIWlzT+M//HyRK/P4I7PhGeFRv2WSSEd8S6nQiO8Nk7xsNpo192rlcFZjMSJX+2g==";
const logoWebp384 = "/assets/logo-384-CDeWa9Mt.webp";
const logoWebp512 = "/assets/logo-512-D88bkmvd.webp";
const logoWebp640 = "/assets/logo-640-BCN0b29s.webp";
function HeroBenefitsContent({ t }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { className: "mt-12 mb-10 max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm px-6 py-6 shadow-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-blue-100 text-lg sm:text-xl", children: t.hero.whyChoose }),
        /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-blue-200/80", children: t.hero.benefits })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl mb-2", children: "✈️" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.flightTrackingTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.flightTrackingBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl mb-2", children: "✅" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.meetGreetTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.meetGreetBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl mb-2", children: "⏱️" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.fastConfirmationTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.fastConfirmationBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { className: "text-2xl block text-center mb-2", children: "💳" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.flexiblePaymentsTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.flexiblePaymentsBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl mb-2", children: "📅" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.freePrebookingTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.freePrebookingBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl mb-2", children: "💵" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.fixedPriceTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.fixedPriceBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl mb-2", children: "📍" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.localExpertiseTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.localExpertiseBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-2xl mb-2", children: "🎧" }),
              /* @__PURE__ */ jsx("h3", { className: "text-white mb-1", children: t.hero.benefitsList.assistanceTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm", children: t.hero.benefitsList.assistanceBody })
            ]
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("div", { id: "fleet", className: "mt-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-blue-800/40 to-blue-700/20 backdrop-blur-sm px-6 py-8 shadow-xl", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between flex-wrap gap-4 mb-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-blue-100 text-lg sm:text-xl", children: t.hero.fleetTitle }),
        /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-[0.2em] text-blue-200/80", children: t.hero.fleetLabel })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "bg-gradient-to-br from-gray-100/20 to-gray-200/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all flex flex-col items-center justify-center p-8",
            children: [
              /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-5xl mb-3", children: "🚕" }),
              /* @__PURE__ */ jsx("p", { className: "text-white text-center mb-2", children: t.hero.standardCarsTitle }),
              /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm text-center", children: t.hero.standardCarsBody })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-blue-300/30 hover:border-blue-300/50 transition-all flex flex-col items-center justify-center p-8", children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-5xl mb-3", children: "🚌" }),
          /* @__PURE__ */ jsx("p", { className: "text-white text-center mb-2", children: t.hero.busTitle }),
          /* @__PURE__ */ jsx("p", { className: "text-blue-200 text-sm text-center", children: t.hero.busBody })
        ] })
      ] })
    ] }) })
  ] });
}
function Hero() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const heroBgUrl = "/background-640.webp";
  const quickLinks = [
    { href: `${basePath}/${getRouteSlug(locale, "pricing")}`, label: t.navbar.prices },
    { href: `${basePath}/${getRouteSlug(locale, "orderAirportGdansk")}`, label: t.routeLanding.orderLinks.airportGdansk },
    { href: `${basePath}/${getRouteSlug(locale, "orderAirportSopot")}`, label: t.routeLanding.orderLinks.airportSopot },
    { href: `${basePath}/${getRouteSlug(locale, "orderAirportGdynia")}`, label: t.routeLanding.orderLinks.airportGdynia },
    { href: `${basePath}/${getRouteSlug(locale, "orderCustom")}`, label: t.routeLanding.orderLinks.custom }
  ];
  return /* @__PURE__ */ jsxs("div", { id: "hero", className: "relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white", children: [
    /* @__PURE__ */ jsx(
      "img",
      {
        src: heroBgUrl,
        srcSet: "/background-400.webp 400w, /background-480.webp 480w, /background-640.webp 640w, /background-960.webp 960w, /background-1280.webp 1280w, /background-1600.webp 1600w",
        sizes: "(max-width: 640px) 68vw, (max-width: 1024px) 85vw, 1400px",
        alt: "Taxi Airport Gdansk hero background",
        className: "hero-bg absolute inset-0 -z-10 h-full w-full object-cover opacity-20 pointer-events-none",
        loading: "eager",
        fetchpriority: "high",
        decoding: "async",
        width: 1600,
        height: 900
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "hero-content relative max-w-6xl mx-auto px-4 py-10 sm:py-16", children: /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "mb-4 flex justify-center", children: /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs sm:text-sm text-white shadow-sm backdrop-blur-sm", children: [
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: t.hero.promo.dayPrice }),
        /* @__PURE__ */ jsx("span", { children: t.hero.promo.dayLabel }),
        /* @__PURE__ */ jsx("span", { className: "text-white/70", children: "•" }),
        /* @__PURE__ */ jsx("span", { className: "font-semibold", children: t.hero.promo.nightPrice }),
        /* @__PURE__ */ jsx("span", { children: t.hero.promo.nightLabel })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "hero-logo flex justify-center mb-2", children: /* @__PURE__ */ jsxs("picture", { children: [
        /* @__PURE__ */ jsx(
          "source",
          {
            srcSet: `${logoAvif384} 384w, ${logoAvif512} 512w, ${logoAvif640} 640w`,
            type: "image/avif",
            sizes: "(max-width: 640px) 62vw, 16rem"
          }
        ),
        /* @__PURE__ */ jsx(
          "source",
          {
            srcSet: `${logoWebp384} 384w, ${logoWebp512} 512w, ${logoWebp640} 640w`,
            type: "image/webp",
            sizes: "(max-width: 640px) 62vw, 16rem"
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: logoWebp384,
            alt: t.hero.logoAlt,
            className: "hero-logo-image h-auto animate-hero-logo-pulse",
            style: { width: "min(16rem, 62vw)" },
            width: 384,
            height: 384,
            decoding: "async",
            loading: "eager",
            sizes: "(max-width: 640px) 62vw, 16rem"
          }
        )
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "mt-2 flex justify-center", children: /* @__PURE__ */ jsx("span", { className: "inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white", children: t.common.noPrepayment }) }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-center px-2 text-xs text-white/80", children: [
        /* @__PURE__ */ jsx("span", { className: "mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/60", children: t.routeLanding.quickLinks }),
        /* @__PURE__ */ jsx("div", { className: "quick-links", children: quickLinks.map((link) => /* @__PURE__ */ jsx(
          "a",
          {
            href: link.href,
            children: link.label
          },
          link.href
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5 max-w-2xl mx-auto", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-xl sm:text-2xl text-blue-100 mb-3", children: t.hero.headline }),
        /* @__PURE__ */ jsx("p", { className: "text-blue-200", children: t.hero.subheadline })
      ] })
    ] }) })
  ] });
}
function HeroBenefits() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("section", { className: "relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4 py-12 sm:py-16", children: /* @__PURE__ */ jsx(HeroBenefitsContent, { t }) }) });
}
function TrustBar({ className }) {
  const { t } = useI18n();
  const items = [
    t.trustBar.instantConfirmation,
    t.trustBar.meetGreetOptional,
    t.trustBar.noPrepayment,
    t.trustBar.supportWhatsappEmail,
    t.trustBar.vatInvoice
  ];
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx("ul", { className: "trust-bar", "aria-label": t.trustBar.ariaLabel, children: items.map((label) => /* @__PURE__ */ jsxs("li", { className: "trust-bar__item", children: [
    /* @__PURE__ */ jsx(CheckCircle2, { className: "trust-bar__icon", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("span", { className: "trust-bar__text", children: label })
  ] }, label)) }) });
}
function VehicleTypeSelector({ onSelectType }) {
  const { t, locale } = useI18n();
  const sectionRef = useRef(null);
  const pricingPath = `${localeToPath(locale)}/${getRouteSlug(locale, "pricing")}#pricing-calculator`;
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const element = sectionRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "vehicle-selection", ref: sectionRef, className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-gray-900 mb-4", children: t.vehicle.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: t.vehicle.subtitle })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "vehicle-grid-mobile grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onSelectType("standard"),
          className: "vehicle-card-mobile group self-stretch min-h-[22rem] md:min-h-[26rem] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-3 border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "vehicle-card__icon w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors", children: /* @__PURE__ */ jsx(Car, { className: "vehicle-card__icon-svg w-12 h-12 text-blue-600" }) }) }),
            /* @__PURE__ */ jsx("h3", { className: "vehicle-card__title text-gray-900 text-center mb-3 text-base", children: t.vehicle.standardTitle }),
            /* @__PURE__ */ jsxs("div", { className: "vehicle-card__info flex flex-1 flex-col gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base", children: [
                /* @__PURE__ */ jsx(Users, { className: "vehicle-card__meta-icon w-5 h-5 text-blue-600" }),
                /* @__PURE__ */ jsx("span", { className: "vehicle-card__text", children: t.vehicle.standardPassengers })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "vehicle-card__desc text-center text-gray-600 text-sm", children: t.vehicle.standardDescription })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-6 grid gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-selfmanage-badge rounded-xl bg-blue-50/90 px-3 text-slate-700 shadow-sm ring-1 ring-inset ring-blue-200/80", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 ring-1 ring-inset ring-blue-200/70", children: /* @__PURE__ */ jsx(Info, { className: "h-3 w-3 text-blue-700" }) }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap", children: t.vehicle.selfManageBadge })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "vehicle-select-cta gemini-cta w-full px-6 rounded-lg text-center font-semibold text-blue-800 transition-colors whitespace-nowrap overflow-hidden",
                  style: { ["--cta-bg"]: "#ffffff" },
                  children: /* @__PURE__ */ jsx("span", { className: "max-w-full truncate", children: t.vehicle.selectStandard })
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onSelectType("bus"),
          className: "vehicle-card-mobile group self-stretch min-h-[22rem] md:min-h-[26rem] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-3 border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "vehicle-card__icon w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors", children: /* @__PURE__ */ jsx(Users, { className: "vehicle-card__icon-svg w-12 h-12 text-blue-700" }) }) }),
            /* @__PURE__ */ jsx("h3", { className: "vehicle-card__title text-gray-900 text-center mb-3 text-base", children: t.vehicle.busTitle }),
            /* @__PURE__ */ jsxs("div", { className: "vehicle-card__info flex flex-1 flex-col gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base", children: [
                /* @__PURE__ */ jsx(Users, { className: "vehicle-card__meta-icon w-5 h-5 text-blue-600" }),
                /* @__PURE__ */ jsx("span", { className: "vehicle-card__text", children: t.vehicle.busPassengers })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "vehicle-card__desc text-center text-gray-600 text-sm", children: t.vehicle.busDescription })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-6 grid gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-selfmanage-badge rounded-xl bg-blue-50/90 px-3 text-slate-700 shadow-sm ring-1 ring-inset ring-blue-200/80", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 ring-1 ring-inset ring-blue-200/70", children: /* @__PURE__ */ jsx(Info, { className: "h-3 w-3 text-blue-700" }) }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap", children: t.vehicle.selfManageBadge })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "vehicle-select-cta gemini-cta w-full px-6 rounded-lg text-center font-semibold text-blue-800 transition-colors whitespace-nowrap overflow-hidden",
                  style: { ["--cta-bg"]: "#ffffff" },
                  children: /* @__PURE__ */ jsx("span", { className: "max-w-full truncate", children: t.vehicle.selectBus })
                }
              )
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsx(TrustBar, { className: "vehicle-trustbar" }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: pricingPath,
          className: "gemini-cta inline-flex w-full items-center justify-center gap-3 rounded-full px-12 py-4 text-base font-semibold text-blue-800 shadow-sm transition-colors hover:bg-blue-50 sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(Calculator, { className: "h-4 w-4" }),
            t.pricingCalculator.title
          ]
        }
      ) })
    ] })
  ] }) });
}
function LazyMount({
  children,
  className,
  rootMargin = "200px 0px",
  minHeight = 1
}) {
  const hostRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (isVisible) {
      return;
    }
    const node = hostRef.current;
    if (!node) {
      return;
    }
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: hostRef,
      className,
      style: !isVisible ? { minHeight } : void 0,
      children: isVisible ? children : null
    }
  );
}
const TripadvisorWidget = lazy(
  () => import("./assets/TripadvisorWidget-CPezc-jA.mjs").then((mod) => ({ default: mod.TripadvisorWidget }))
);
function StarIcon({ className }) {
  return /* @__PURE__ */ jsx("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", className, fill: "currentColor", children: /* @__PURE__ */ jsx("path", { d: "M12 17.27l5.18 3.04-1.64-5.81 4.46-3.86-5.88-.5L12 4.5 9.88 10.14l-5.88.5 4.46 3.86-1.64 5.81L12 17.27z" }) });
}
function LandingTrustSection() {
  const { t } = useI18n();
  const reviewsUrl = "https://maps.app.goo.gl/bG8hYPYhdD6cT394A";
  const ratingRaw = Number(void 0);
  const rating = Number.isFinite(ratingRaw) && ratingRaw > 0 ? ratingRaw : null;
  const countRaw = Number(void 0);
  const count = Number.isFinite(countRaw) && countRaw > 0 ? Math.round(countRaw) : null;
  const ratingText = rating ? rating.toFixed(1) : null;
  return /* @__PURE__ */ jsx("section", { className: "bg-slate-50 border-t border-slate-200 py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "mb-8 grid gap-4 md:grid-cols-2", children: [
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 bg-white px-5 pt-14 pb-16 sm:pt-16 sm:pb-20 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 py-2 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "text-gray-900 font-semibold text-lg", children: t.trust.googleReviewsTitle }),
      /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center gap-1 text-amber-500", children: Array.from({ length: 5 }).map((_, idx) => /* @__PURE__ */ jsx(
        StarIcon,
        {
          className: [
            "h-5 w-5 sm:h-6 sm:w-6",
            rating && rating >= idx + 1 ? "opacity-100" : "opacity-30"
          ].join(" ")
        },
        idx
      )) }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-gray-700", children: [
        ratingText && /* @__PURE__ */ jsxs("span", { className: "text-base sm:text-lg", children: [
          ratingText,
          "/5"
        ] }),
        count && /* @__PURE__ */ jsxs("span", { className: "text-sm sm:text-base text-gray-500", children: [
          "(",
          count,
          " ",
          t.trust.googleReviewsCountLabel,
          ")"
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: reviewsUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition",
          children: t.trust.googleReviewsCta
        }
      )
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
      TripadvisorWidget,
      {
        requireConsent: false,
        wtype: "cdsratingsonlynarrow",
        uniq: "18",
        border: true,
        backgroundColor: "gray",
        ulId: "26DzK4vLpG",
        ulClassName: "TA_links zxoY1N7DGTdr",
        liId: "8Elkc7FwaL0",
        liClassName: "jv6ugdR"
      }
    ) }) })
  ] }) }) });
}
function FloatingActions({ orderTargetId = "vehicle-selection", hide = false }) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;
  const callLink = "tel:+48694347548";
  const iMessageLink = "sms:+48537523437";
  const [cookieBannerOffset, setCookieBannerOffset] = useState(0);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let resizeObserver = null;
    const updateOffset = () => {
      const banner = document.querySelector("[data-cookie-banner]");
      if (!banner) {
        setCookieBannerOffset(0);
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        return;
      }
      const height = banner.getBoundingClientRect().height;
      setCookieBannerOffset(Math.ceil(height) + 12);
      if (!resizeObserver && "ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => {
          const nextHeight = banner.getBoundingClientRect().height;
          setCookieBannerOffset(Math.ceil(nextHeight) + 12);
        });
        resizeObserver.observe(banner);
      }
    };
    updateOffset();
    const observer = new MutationObserver(updateOffset);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    if (!isOrderMenuOpen || typeof window === "undefined") {
      return;
    }
    const closeOnOutsideClick = (event) => {
      var _a2, _b, _c, _d;
      const target = event.target;
      if (!target) {
        return;
      }
      const clickedInsideDesktop = (_b = (_a2 = desktopMenuRef.current) == null ? void 0 : _a2.contains(target)) != null ? _b : false;
      const clickedInsideMobile = (_d = (_c = mobileMenuRef.current) == null ? void 0 : _c.contains(target)) != null ? _d : false;
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsOrderMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOrderMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOrderMenuOpen]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      return;
    }
    let observer = null;
    const connect = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        setIsFooterVisible(false);
        return;
      }
      if (observer) {
        observer.disconnect();
      }
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsFooterVisible(Boolean(entry == null ? void 0 : entry.isIntersecting));
        },
        {
          root: null,
          threshold: 0.02
        }
      );
      observer.observe(footer);
    };
    connect();
    const mutationObserver = new MutationObserver(connect);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      if (observer) {
        observer.disconnect();
      }
    };
  }, []);
  const shouldHideActions = hide || isFooterVisible;
  useEffect(() => {
    if (shouldHideActions && isOrderMenuOpen) {
      setIsOrderMenuOpen(false);
    }
  }, [shouldHideActions, isOrderMenuOpen]);
  if (shouldHideActions) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed right-6 bottom-6 z-50 hidden sm:block",
        style: { bottom: cookieBannerOffset + 24 },
        children: /* @__PURE__ */ jsxs("div", { ref: desktopMenuRef, className: "flex flex-col items-end gap-2", children: [
          isOrderMenuOpen ? /* @__PURE__ */ jsxs("div", { id: "floating-order-menu-desktop", className: "mb-2 flex w-64 flex-col gap-2 animate-slideDown", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `${basePath}/`,
                onClick: (event) => {
                  event.preventDefault();
                  setIsOrderMenuOpen(false);
                  trackCtaClick("floating_order_online");
                  const scrolled = requestScrollTo(orderTargetId);
                  if (!scrolled) {
                    window.location.href = `${basePath}/`;
                  }
                },
                className: "rounded-full px-5 py-3 text-white shadow-lg text-center",
                style: { backgroundColor: "#c2410c" },
                children: t.common.orderOnlineNow
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: whatsappLink,
                onClick: () => {
                  setIsOrderMenuOpen(false);
                  trackContactClick("whatsapp");
                },
                className: "rounded-full px-5 py-3 text-gray-900 shadow-lg flex items-center justify-center gap-2",
                style: { backgroundColor: "#25D366" },
                children: t.common.whatsapp
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: callLink,
                onClick: () => {
                  setIsOrderMenuOpen(false);
                  trackContactClick("call");
                },
                className: "rounded-full px-5 py-3 text-gray-900 shadow-lg flex items-center justify-center gap-2",
                style: { backgroundColor: "#fbbf24" },
                "aria-label": "Call +48 694 347 548",
                children: [
                  /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "📞" }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 leading-none", children: [
                    /* @__PURE__ */ jsx("span", { children: t.common.callNow }),
                    /* @__PURE__ */ jsx("span", { className: "call-lang-badge", children: "EN/PL" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: iMessageLink,
                onClick: () => {
                  setIsOrderMenuOpen(false);
                  trackContactClick("imessage");
                },
                className: "rounded-full px-5 py-3 text-white shadow-lg flex items-center justify-center gap-2",
                style: { backgroundColor: "#2563eb" },
                "aria-label": "iMessage +48 537 523 437",
                children: [
                  /* @__PURE__ */ jsx("svg", { viewBox: "0 0 384 512", "aria-hidden": "true", className: "h-6 w-6", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx("path", { d: "M318.7 268.7c-.2-36.7 30-54.3 31.3-55.1-17.1-25-43.7-28.4-53.1-28.8-22.6-2.3-44.1 13.3-55.6 13.3-11.5 0-29.3-13-48.2-12.7-24.8.4-47.6 14.4-60.4 36.7-25.8 44.7-6.6 110.8 18.5 147 12.3 17.6 26.9 37.4 46.1 36.7 18.5-.7 25.5-12 47.8-12 22.3 0 28.6 12 47.9 11.6 19.8-.4 32.3-17.9 44.5-35.6 14.1-20.6 19.9-40.5 20.1-41.5-.4-.2-38.5-14.8-38.7-58.6zm-37.7-108.4c10.2-12.4 17.1-29.7 15.2-46.9-14.7.6-32.5 9.8-43 22.2-9.5 11-17.8 28.6-15.6 45.4 16.4 1.3 33.2-8.3 43.4-20.7z" }) }),
                  "iMessage"
                ]
              }
            )
          ] }) : null,
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                trackCtaClick("floating_order_now_toggle");
                setIsOrderMenuOpen((prev) => !prev);
              },
              className: "relative inline-flex h-28 w-28 shrink-0 flex-col items-center justify-center overflow-hidden rounded-full text-white shadow-xl ring-4 ring-white/35 animate-order-now-pulse cursor-pointer transition-[filter] duration-200 hover:brightness-110",
              style: { backgroundColor: "#c2410c" },
              "aria-expanded": isOrderMenuOpen,
              "aria-controls": "floating-order-menu-desktop",
              "aria-label": t.common.orderNow,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_58%)]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "relative max-w-[86px] px-4 text-center text-[11px] font-semibold leading-tight tracking-tight", children: t.common.orderNow }),
                /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", "aria-hidden": "true", className: "relative mt-0.5 h-4 w-4", children: isOrderMenuOpen ? /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M14.7 12.7a1 1 0 01-1.4 0L10 9.42l-3.3 3.3a1 1 0 01-1.4-1.42l4-4a1 1 0 011.4 0l4 4a1 1 0 010 1.42z" }) : /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M5.3 7.3a1 1 0 011.4 0L10 10.58l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.42z" }) })
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed left-0 right-0 z-50 sm:hidden border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur",
        style: { bottom: cookieBannerOffset },
        children: /* @__PURE__ */ jsxs("div", { ref: mobileMenuRef, className: "flex flex-col gap-2", children: [
          isOrderMenuOpen ? /* @__PURE__ */ jsxs("div", { id: "floating-order-menu-mobile", className: "grid gap-2 animate-slideDown", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `${basePath}/`,
                onClick: (event) => {
                  event.preventDefault();
                  setIsOrderMenuOpen(false);
                  trackCtaClick("sticky_order_online");
                  const scrolled = requestScrollTo(orderTargetId);
                  if (!scrolled) {
                    window.location.href = `${basePath}/`;
                  }
                },
                className: "rounded-full px-4 py-3 text-center text-white shadow-sm",
                style: { backgroundColor: "#c2410c" },
                children: t.common.orderOnlineNow
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: whatsappLink,
                  onClick: () => {
                    setIsOrderMenuOpen(false);
                    trackContactClick("whatsapp");
                  },
                  className: "rounded-full px-4 py-3 text-center text-gray-900 shadow-sm flex items-center justify-center gap-2",
                  style: { backgroundColor: "#25D366" },
                  children: [
                    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 32 32", "aria-hidden": "true", className: "h-5 w-5 fill-current", children: [
                      /* @__PURE__ */ jsx("path", { d: "M19.11 17.72c-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.79-1.92-.21-.5-.43-.43-.58-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.81 2.76 4.4 3.87.62.27 1.1.43 1.48.55.62.2 1.18.17 1.63.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.17-.5-.3z" }),
                      /* @__PURE__ */ jsx("path", { d: "M26.67 5.33A14.9 14.9 0 0016.03 1.5C8.12 1.5 1.5 8.13 1.5 16.03c0 2.4.63 4.76 1.83 6.85L1.5 30.5l7.81-1.79a14.93 14.93 0 006.72 1.61h.01c7.9 0 14.53-6.63 14.53-14.53 0-3.88-1.52-7.53-4.4-10.46zm-10.64 22.3h-.01a12.4 12.4 0 01-6.32-1.73l-.45-.27-4.64 1.06 1.24-4.52-.3-.46a12.45 12.45 0 01-2-6.68c0-6.86 5.58-12.44 12.45-12.44 3.32 0 6.43 1.3 8.77 3.65a12.33 12.33 0 013.64 8.79c0 6.86-5.59 12.44-12.38 12.44z" })
                    ] }),
                    t.common.whatsapp
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: callLink,
                  onClick: () => {
                    setIsOrderMenuOpen(false);
                    trackContactClick("call");
                  },
                  className: "rounded-full px-4 py-3 text-center text-gray-900 shadow-sm flex items-center justify-center gap-2",
                  style: { backgroundColor: "#fbbf24" },
                  "aria-label": "Call +48 694 347 548",
                  children: [
                    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "📞" }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 leading-none", children: [
                      /* @__PURE__ */ jsx("span", { children: t.common.callNow }),
                      /* @__PURE__ */ jsx("span", { className: "call-lang-badge", children: "EN/PL" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: iMessageLink,
                  onClick: () => {
                    setIsOrderMenuOpen(false);
                    trackContactClick("imessage");
                  },
                  className: "rounded-full px-4 py-3 text-center text-white shadow-sm flex items-center justify-center gap-2",
                  style: { backgroundColor: "#2563eb" },
                  "aria-label": "iMessage +48 537 523 437",
                  children: [
                    /* @__PURE__ */ jsx("svg", { viewBox: "0 0 384 512", "aria-hidden": "true", className: "h-6 w-6", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx("path", { d: "M318.7 268.7c-.2-36.7 30-54.3 31.3-55.1-17.1-25-43.7-28.4-53.1-28.8-22.6-2.3-44.1 13.3-55.6 13.3-11.5 0-29.3-13-48.2-12.7-24.8.4-47.6 14.4-60.4 36.7-25.8 44.7-6.6 110.8 18.5 147 12.3 17.6 26.9 37.4 46.1 36.7 18.5-.7 25.5-12 47.8-12 22.3 0 28.6 12 47.9 11.6 19.8-.4 32.3-17.9 44.5-35.6 14.1-20.6 19.9-40.5 20.1-41.5-.4-.2-38.5-14.8-38.7-58.6zm-37.7-108.4c10.2-12.4 17.1-29.7 15.2-46.9-14.7.6-32.5 9.8-43 22.2-9.5 11-17.8 28.6-15.6 45.4 16.4 1.3 33.2-8.3 43.4-20.7z" }) }),
                    "iMessage"
                  ]
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                trackCtaClick("sticky_order_now_toggle");
                setIsOrderMenuOpen((prev) => !prev);
              },
              className: "relative mx-auto inline-flex h-24 w-24 shrink-0 flex-col items-center justify-center overflow-hidden rounded-full text-white shadow-xl ring-4 ring-white/35 animate-order-now-pulse cursor-pointer transition-[filter] duration-200 hover:brightness-110",
              style: { backgroundColor: "#c2410c" },
              "aria-expanded": isOrderMenuOpen,
              "aria-controls": "floating-order-menu-mobile",
              "aria-label": t.common.orderNow,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_58%)]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "relative max-w-[70px] px-3 text-center text-[10px] font-semibold leading-tight tracking-tight", children: t.common.orderNow }),
                /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", "aria-hidden": "true", className: "relative mt-0.5 h-4 w-4", children: isOrderMenuOpen ? /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M14.7 12.7a1 1 0 01-1.4 0L10 9.42l-3.3 3.3a1 1 0 01-1.4-1.42l4-4a1 1 0 011.4 0l4 4a1 1 0 010 1.42z" }) : /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M5.3 7.3a1 1 0 011.4 0L10 10.58l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.42z" }) })
              ]
            }
          )
        ] })
      }
    )
  ] });
}
const countryAirportsByLocale = {
  en: {
    country: "United Kingdom",
    airports: [
      { slug: "gdansk-airport-transfer-aberdeen", city: "Aberdeen", airport: "Aberdeen (ABZ)" },
      { slug: "gdansk-airport-transfer-belfast", city: "Belfast", airport: "Belfast (BFS)" },
      { slug: "gdansk-airport-transfer-bristol", city: "Bristol", airport: "Bristol (BRS)" },
      { slug: "gdansk-airport-transfer-birmingham", city: "Birmingham", airport: "Birmingham (BHX)" },
      { slug: "gdansk-airport-transfer-edinburgh", city: "Edinburgh", airport: "Edinburgh (EDI)" },
      { slug: "gdansk-airport-transfer-leeds-bradford", city: "Leeds", airport: "Leeds Bradford (LBA)" },
      { slug: "gdansk-airport-transfer-liverpool", city: "Liverpool", airport: "Liverpool (LPL)" },
      { slug: "gdansk-airport-transfer-london-luton", city: "London", airport: "London Luton (LTN)" },
      { slug: "gdansk-airport-transfer-london-stansted", city: "London", airport: "London Stansted (STN)" },
      { slug: "gdansk-airport-transfer-manchester", city: "Manchester", airport: "Manchester (MAN)" }
    ]
  },
  de: {
    country: "Deutschland",
    airports: [
      { slug: "gdansk-flughafentransfer-dortmund", city: "Dortmund", airport: "Dortmund (DTM)" },
      { slug: "gdansk-flughafentransfer-frankfurt", city: "Frankfurt", airport: "Frankfurt (FRA)" },
      { slug: "gdansk-flughafentransfer-hamburg", city: "Hamburg", airport: "Hamburg (HAM)" },
      { slug: "gdansk-flughafentransfer-munchen", city: "München", airport: "München (MUC)" }
    ]
  },
  no: {
    country: "Norge",
    airports: [
      { slug: "gdansk-flyplasstransport-alesund", city: "Ålesund", airport: "Ålesund (AES)" },
      { slug: "gdansk-flyplasstransport-bergen", city: "Bergen", airport: "Bergen (BGO)" },
      { slug: "gdansk-flyplasstransport-haugesund", city: "Haugesund", airport: "Haugesund (HAU)" },
      { slug: "gdansk-flyplasstransport-oslo-gardermoen", city: "Oslo", airport: "Oslo Gardermoen (OSL)" },
      { slug: "gdansk-flyplasstransport-oslo-torp", city: "Oslo", airport: "Oslo Torp (TRF)" },
      { slug: "gdansk-flyplasstransport-stavanger", city: "Stavanger", airport: "Stavanger (SVG)" },
      { slug: "gdansk-flyplasstransport-tromso", city: "Tromsø", airport: "Tromsø (TOS)" },
      { slug: "gdansk-flyplasstransport-trondheim", city: "Trondheim", airport: "Trondheim (TRD)" }
    ]
  },
  sv: {
    country: "Sverige",
    airports: [
      { slug: "gdansk-flygplatstransfer-goteborg", city: "Göteborg", airport: "Göteborg (GOT)" },
      { slug: "gdansk-flygplatstransfer-malmo", city: "Malmö", airport: "Malmö (MMX)" },
      { slug: "gdansk-flygplatstransfer-skelleftea", city: "Skellefteå", airport: "Skellefteå (SFT)" },
      { slug: "gdansk-flygplatstransfer-stockholm-arlanda", city: "Stockholm", airport: "Stockholm Arlanda (ARN)" }
    ]
  },
  da: {
    country: "Danmark",
    airports: [
      { slug: "gdansk-lufthavn-transfer-aarhus", city: "Aarhus", airport: "Aarhus (AAR)" },
      { slug: "gdansk-lufthavn-transfer-billund", city: "Billund", airport: "Billund (BLL)" },
      { slug: "gdansk-lufthavn-transfer-copenhagen", city: "København", airport: "København (CPH)" }
    ]
  },
  fi: {
    country: "Suomi",
    airports: [
      { slug: "gdansk-lentokenttakuljetus-helsinki", city: "Helsinki", airport: "Helsinki (HEL)" },
      { slug: "gdansk-lentokenttakuljetus-turku", city: "Turku", airport: "Turku (TKU)" }
    ]
  }
};
const getCountryAirports = (locale) => {
  var _a2, _b;
  return (_b = (_a2 = countryAirportsByLocale[locale]) == null ? void 0 : _a2.airports) != null ? _b : [];
};
const getCountryAirportBySlug = (locale, slug) => {
  var _a2;
  return (_a2 = getCountryAirports(locale).find((airport) => airport.slug === slug)) != null ? _a2 : null;
};
const getCountryAirportCountry = (locale) => {
  var _a2, _b;
  return (_b = (_a2 = countryAirportsByLocale[locale]) == null ? void 0 : _a2.country) != null ? _b : "";
};
const cityRoutesByLocale = {
  pl: [
    { slug: "taxi-lotnisko-gdansk-slupsk", destination: "Słupsk" },
    { slug: "taxi-lotnisko-gdansk-malbork", destination: "Malbork" },
    { slug: "taxi-lotnisko-gdansk-olsztyn", destination: "Olsztyn" },
    { slug: "taxi-lotnisko-gdansk-starogard-gdanski", destination: "Starogard Gdański" },
    { slug: "taxi-lotnisko-gdansk-wladyslawowo", destination: "Władysławowo" },
    { slug: "taxi-lotnisko-gdansk-hel", destination: "Hel" },
    { slug: "taxi-lotnisko-gdansk-ostroda", destination: "Ostróda" },
    { slug: "taxi-lotnisko-gdansk-wejherowo", destination: "Wejherowo" },
    { slug: "taxi-lotnisko-gdansk-rumia", destination: "Rumia" },
    { slug: "taxi-lotnisko-gdansk-reda", destination: "Reda" }
  ]
};
const getCityRoutes = (locale) => {
  var _a2;
  return (_a2 = cityRoutesByLocale[locale]) != null ? _a2 : [];
};
const getCityRouteBySlug = (locale, slug) => {
  var _a2;
  return (_a2 = getCityRoutes(locale).find((route) => route.slug === slug)) != null ? _a2 : null;
};
Object.fromEntries(
  Object.entries(cityRoutesByLocale).map(([locale, routes]) => [locale, routes.map((route) => route.slug)])
);
const BRAND_TITLE = "Taxi Airport Gdańsk";
function usePageTitle(title) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const trimmed = (title != null ? title : "").trim();
    const nextTitle = trimmed ? `${trimmed} | ${BRAND_TITLE}` : BRAND_TITLE;
    window.__pageTitle = nextTitle;
    document.title = nextTitle;
  }, [title]);
}
const CHUNK_ERROR_MESSAGE = /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk [\d]+ failed|dynamically imported module/i;
const withChunkRetry = (loader, chunkKey) => async () => {
  try {
    const module = await loader();
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(`chunk-retry:${chunkKey}`);
    }
    return module;
  } catch (error) {
    if (typeof window !== "undefined") {
      const message = error instanceof Error ? error.message : String(error);
      const retryKey = `chunk-retry:${chunkKey}`;
      const hasRetried = window.sessionStorage.getItem(retryKey) === "1";
      if (CHUNK_ERROR_MESSAGE.test(message) && !hasRetried) {
        window.sessionStorage.setItem(retryKey, "1");
        window.location.reload();
        return new Promise(() => {
        });
      }
    }
    throw error;
  }
};
function SuspenseFallback() {
  return /* @__PURE__ */ jsx("div", { className: "flex min-h-[120px] items-center justify-center text-sm text-slate-500", children: "Loading..." });
}
class AppErrorBoundary extends Component {
  constructor() {
    super(...arguments);
    __publicField(this, "state", { hasError: false });
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Application render error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxs("div", { className: "flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 text-center text-slate-700", children: [
        /* @__PURE__ */ jsx("p", { className: "max-w-md text-sm sm:text-base", children: "We could not load this page on your device. Please refresh and try again." }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: () => window.location.reload(),
            className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700",
            children: "Reload page"
          }
        )
      ] });
    }
    return this.props.children;
  }
}
const Pricing = lazy(withChunkRetry(() => import("./assets/Pricing-PAxzYuf5.mjs").then((mod) => ({ default: mod.Pricing })), "pricing"));
const Footer = lazy(withChunkRetry(() => import("./assets/Footer-nUGSAGu3.mjs").then((mod) => ({ default: mod.Footer })), "footer"));
const CookieBanner = lazy(withChunkRetry(() => import("./assets/CookieBanner-BaoCJwfa.mjs").then((mod) => ({ default: mod.CookieBanner })), "cookie-banner"));
const OrderForm = lazy(withChunkRetry(() => import("./assets/OrderForm-CImSvIOX.mjs").then((mod) => ({ default: mod.OrderForm })), "order-form"));
const QuoteForm = lazy(withChunkRetry(() => import("./assets/QuoteForm-Bp_asRBf.mjs").then((n) => n.b).then((mod) => ({ default: mod.QuoteForm })), "quote-form"));
const ManageOrder = lazy(withChunkRetry(() => import("./assets/ManageOrder-x57vjpE2.mjs").then((mod) => ({ default: mod.ManageOrder })), "manage-order"));
const RouteLanding = lazy(withChunkRetry(() => import("./assets/RouteLanding-DbcJrNrA.mjs").then((mod) => ({ default: mod.RouteLanding })), "route-landing"));
const OrderRoutePage = lazy(withChunkRetry(() => import("./assets/OrderRoutePage-BNqXcB6R.mjs").then((mod) => ({ default: mod.OrderRoutePage })), "order-route-page"));
const CustomOrderPage = lazy(withChunkRetry(() => import("./assets/OrderRoutePage-BNqXcB6R.mjs").then((mod) => ({ default: mod.CustomOrderPage })), "custom-order-page"));
const PricingPage = lazy(withChunkRetry(() => import("./assets/PricingPage-CcrNb_wF.mjs").then((mod) => ({ default: mod.PricingPage })), "pricing-page"));
const AdminOrdersPage = lazy(withChunkRetry(() => import("./assets/AdminOrdersPage-CUsKktUh.mjs").then((mod) => ({ default: mod.AdminOrdersPage })), "admin-orders-page"));
const AdminOrderPage = lazy(withChunkRetry(() => import("./assets/AdminOrderPage-BJwNq_qM.mjs").then((mod) => ({ default: mod.AdminOrderPage })), "admin-order-page"));
const CookiesPage = lazy(withChunkRetry(() => import("./assets/CookiesPage-D1_tACFy.mjs").then((mod) => ({ default: mod.CookiesPage })), "cookies-page"));
const PrivacyPage = lazy(withChunkRetry(() => import("./assets/PrivacyPage-9Z934pBZ.mjs").then((mod) => ({ default: mod.PrivacyPage })), "privacy-page"));
const NotFoundPage = lazy(withChunkRetry(() => import("./assets/NotFoundPage-Cp7sBpFY.mjs").then((mod) => ({ default: mod.NotFoundPage })), "not-found-page"));
const CountryLanding = lazy(withChunkRetry(() => import("./assets/CountryLanding-Dq5OPzZ6.mjs").then((mod) => ({ default: mod.CountryLanding })), "country-landing"));
const CountryAirportLanding = lazy(withChunkRetry(() => import("./assets/CountryAirportLanding-D0INzDSt.mjs").then((mod) => ({ default: mod.CountryAirportLanding })), "country-airport-landing"));
const CityRouteLanding = lazy(withChunkRetry(() => import("./assets/CityRouteLanding-BA2j7PBe.mjs").then((mod) => ({ default: mod.CityRouteLanding })), "city-route-landing"));
const TaxiGdanskPage = lazy(withChunkRetry(() => import("./assets/TaxiGdanskPage-yD2QIsca.mjs").then((mod) => ({ default: mod.TaxiGdanskPage })), "taxi-gdansk-page"));
const localeRootPathSet = new Set(SUPPORTED_LOCALES.map((locale) => `/${locale}`));
const normalizeCanonicalPathname = (pathname) => localeRootPathSet.has(pathname) ? `${pathname}/` : pathname;
const renderCountryAirportRoutes = (locale) => getCountryAirports(locale).map((airport) => /* @__PURE__ */ jsx(Route, { path: airport.slug, element: /* @__PURE__ */ jsx(CountryAirportLanding, {}) }, airport.slug));
const renderCityRouteRoutes = (locale) => getCityRoutes(locale).map((route) => /* @__PURE__ */ jsx(Route, { path: route.slug, element: /* @__PURE__ */ jsx(CityRouteLanding, {}) }, route.slug));
function Landing() {
  const { t } = useI18n();
  usePageTitle(t.hero.headline);
  const [step, setStep] = useState("vehicle");
  const [vehicleType, setVehicleType] = useState("standard");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [pricingTracked, setPricingTracked] = useState(false);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  if (orderId) {
    return /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsx(ManageOrder, { orderId }) });
  }
  const handleVehicleSelect = (type) => {
    trackVehicleSelect(type);
    setVehicleType(type);
    setStep("pricing");
    const scrollToPricingTop = (attempt = 0) => {
      const target = document.getElementById("vehicle-selection");
      if (!target) {
        if (attempt < 10) {
          window.setTimeout(() => scrollToPricingTop(attempt + 1), 90);
        }
        return;
      }
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 80);
      window.scrollTo({ top, behavior: "smooth" });
    };
    window.setTimeout(() => scrollToPricingTop(0), 0);
  };
  const handleBackToVehicleSelection = () => {
    setStep("vehicle");
  };
  const handleOrderRoute = (route) => {
    trackFormOpen("order");
    setSelectedRoute(route);
  };
  const handleRequestQuote = () => {
    trackFormOpen("quote");
    setShowQuoteForm(true);
  };
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window) || pricingTracked) {
      return;
    }
    const target = document.getElementById("vehicle-selection");
    if (!target) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPricingTracked(true);
          trackSectionView("vehicle_selection");
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: "120px 0px 0px 0px"
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [pricingTracked]);
  useEffect(() => {
    var _a2;
    const hash = window.location.hash;
    let targetId = "";
    if (hash) {
      targetId = hash.replace("#", "");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    if (!targetId) {
      targetId = (_a2 = consumeScrollTarget()) != null ? _a2 : "";
    }
    if (!targetId) {
      return;
    }
    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      if (scrollToId(targetId) || attempts > 10) {
        return;
      }
      window.setTimeout(tryScroll, 120);
    };
    tryScroll();
  }, [step]);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 pb-32 sm:pb-0", children: [
    /* @__PURE__ */ jsx(LandingNavbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx(Hero, {}),
      /* @__PURE__ */ jsx("div", { children: step === "vehicle" ? /* @__PURE__ */ jsx(VehicleTypeSelector, { onSelectType: handleVehicleSelect }) : /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsx(
        Pricing,
        {
          vehicleType,
          onOrderRoute: handleOrderRoute,
          onRequestQuote: handleRequestQuote,
          onBack: handleBackToVehicleSelection
        }
      ) }) }),
      /* @__PURE__ */ jsx(HeroBenefits, {}),
      /* @__PURE__ */ jsx(LazyMount, { className: "defer-render defer-render-md", rootMargin: "300px 0px", minHeight: 760, children: /* @__PURE__ */ jsx(LandingTrustSection, {}) })
    ] }),
    /* @__PURE__ */ jsx(LazyMount, { className: "defer-render defer-render-sm", rootMargin: "240px 0px", minHeight: 420, children: /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsx(Footer, {}) }) }),
    selectedRoute && /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsx(
      OrderForm,
      {
        route: selectedRoute,
        onClose: () => setSelectedRoute(null)
      }
    ) }),
    showQuoteForm && /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsx(
      QuoteForm,
      {
        onClose: () => {
          setShowQuoteForm(false);
        },
        initialVehicleType: vehicleType
      }
    ) }),
    /* @__PURE__ */ jsx(FloatingActions, { hide: Boolean(selectedRoute || showQuoteForm) })
  ] });
}
const renderLocalizedRoutes = (locale, t) => {
  const isPolish = locale === "pl";
  return /* @__PURE__ */ jsxs(Route, { path: `/${locale}`, element: /* @__PURE__ */ jsx(LocalizedShell, { locale }), children: [
    /* @__PURE__ */ jsx(Route, { index: true, element: /* @__PURE__ */ jsx(Landing, {}) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "orderAirportGdansk"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportTaxi" }) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "orderAirportSopot"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportSopot" }) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "orderAirportGdynia"), element: /* @__PURE__ */ jsx(OrderRoutePage, { routeKey: "airportGdynia" }) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "orderCustom"), element: /* @__PURE__ */ jsx(CustomOrderPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "pricing"), element: /* @__PURE__ */ jsx(PricingPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "admin", element: /* @__PURE__ */ jsx(AdminOrdersPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: "admin/orders/:id", element: /* @__PURE__ */ jsx(AdminOrderPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "cookies"), element: /* @__PURE__ */ jsx(CookiesPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "privacy"), element: /* @__PURE__ */ jsx(PrivacyPage, {}) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "countryLanding"), element: /* @__PURE__ */ jsx(CountryLanding, {}) }),
    /* @__PURE__ */ jsx(Route, { path: getRouteSlug(locale, "taxiGdanskCity"), element: /* @__PURE__ */ jsx(TaxiGdanskPage, {}) }),
    renderCountryAirportRoutes(locale),
    isPolish ? renderCityRouteRoutes(locale) : null,
    /* @__PURE__ */ jsx(
      Route,
      {
        path: getRouteSlug(locale, "airportTaxi"),
        element: /* @__PURE__ */ jsx(
          RouteLanding,
          {
            title: t.pages.gdanskTaxi.title,
            description: t.pages.gdanskTaxi.description,
            route: t.pages.gdanskTaxi.route,
            examples: t.pages.gdanskTaxi.examples,
            pricing: { day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: getRouteSlug(locale, "airportSopot"),
        element: /* @__PURE__ */ jsx(
          RouteLanding,
          {
            title: t.pages.gdanskSopot.title,
            description: t.pages.gdanskSopot.description,
            route: t.pages.gdanskSopot.route,
            examples: t.pages.gdanskSopot.examples,
            pricing: { day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }
          }
        )
      }
    ),
    /* @__PURE__ */ jsx(
      Route,
      {
        path: getRouteSlug(locale, "airportGdynia"),
        element: /* @__PURE__ */ jsx(
          RouteLanding,
          {
            title: t.pages.gdanskGdynia.title,
            description: t.pages.gdanskGdynia.description,
            route: t.pages.gdanskGdynia.route,
            examples: t.pages.gdanskGdynia.examples,
            pricing: { day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }
          }
        )
      }
    ),
    isPolish ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Route, { path: "gdansk-airport-taxi", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportTaxi" }) }),
      /* @__PURE__ */ jsx(Route, { path: "gdansk-airport-to-sopot", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportSopot" }) }),
      /* @__PURE__ */ jsx(Route, { path: "gdansk-airport-to-gdynia", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportGdynia" }) }),
      /* @__PURE__ */ jsx(Route, { path: "cookies", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "cookies" }) }),
      /* @__PURE__ */ jsx(Route, { path: "privacy", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "privacy" }) })
    ] }) : null,
    /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
  ] }, locale);
};
function App() {
  const { t } = useI18n();
  const location = useLocation();
  const [trackingReady, setTrackingReady] = useState(false);
  const [cookieBannerReady, setCookieBannerReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let cancelled = false;
    let timeoutId = null;
    let idleId = null;
    const enable = () => {
      if (!cancelled) {
        setTrackingReady(true);
      }
    };
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(enable, 800);
    }
    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let timeoutId = null;
    let idleId = null;
    const enable = () => setCookieBannerReady(true);
    timeoutId = window.setTimeout(enable, 1800);
    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 2e3 });
    }
    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (idleId !== null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
    };
  }, []);
  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search, trackingReady]);
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }
    const head = document.head;
    if (!head) {
      return;
    }
    let canonical = head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      head.appendChild(canonical);
    }
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = normalizeCanonicalPathname(nextUrl.pathname);
      nextUrl.search = "";
      nextUrl.hash = "";
      canonical.href = nextUrl.toString();
    } catch {
    }
  }, [location.pathname]);
  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const thresholds = [25, 50, 75, 100];
    const seen = /* @__PURE__ */ new Set();
    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      if (height <= 0) {
        return;
      }
      const percent = Math.round(scrollTop / height * 100);
      thresholds.forEach((threshold) => {
        if (!seen.has(threshold) && percent >= threshold) {
          seen.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [trackingReady]);
  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }
    const onClick = (event) => {
      const target = event.target;
      if (!target) {
        return;
      }
      const button = target.closest("button");
      if (button) {
        const label = (button.innerText || button.getAttribute("aria-label") || "").trim();
        if (label) {
          trackButtonClick(label);
        }
      }
      const anchor = target.closest("a");
      if (!anchor || !anchor.href) {
        return;
      }
      try {
        const href = new URL(anchor.href);
        const label = (anchor.innerText || anchor.getAttribute("aria-label") || "").trim();
        if (label) {
          trackLinkClick(label, href.toString());
        }
        if (href.origin !== window.location.origin) {
          trackOutboundClick(href.toString());
        }
      } catch {
        return;
      }
    };
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
    };
  }, [trackingReady]);
  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      return;
    }
    const sections = Array.from(document.querySelectorAll("main section[id]"));
    if (sections.length === 0) {
      return;
    }
    const seen = /* @__PURE__ */ new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const id = entry.target.id;
          if (id && !seen.has(id)) {
            seen.add(id);
            trackSectionView(id);
          }
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname, trackingReady]);
  return /* @__PURE__ */ jsx(AppErrorBoundary, { children: /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsxs(Routes, { children: [
      /* @__PURE__ */ jsx(Route, { path: "/", element: /* @__PURE__ */ jsx(RootLanding, {}) }),
      SUPPORTED_LOCALES.map((locale) => renderLocalizedRoutes(locale, t)),
      /* @__PURE__ */ jsx(Route, { path: "/cookies", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "cookies" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/privacy", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "privacy" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/pricing", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "pricing" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin", element: /* @__PURE__ */ jsx(LegacyRedirect, { to: "admin" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/admin/orders/:id", element: /* @__PURE__ */ jsx(LegacyAdminOrderRedirect, {}) }),
      /* @__PURE__ */ jsx(Route, { path: "/gdansk-airport-taxi", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportTaxi" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/gdansk-airport-to-sopot", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportSopot" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/gdansk-airport-to-gdynia", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportGdynia" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/taxi-lotnisko-gdansk", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportTaxi" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/lotnisko-gdansk-sopot", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportSopot" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/lotnisko-gdansk-gdynia", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "airportGdynia" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/polityka-cookies", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "cookies" }) }),
      /* @__PURE__ */ jsx(Route, { path: "/polityka-prywatnosci", element: /* @__PURE__ */ jsx(LegacyRedirectToRoute, { routeKey: "privacy" }) }),
      /* @__PURE__ */ jsx(Route, { path: "*", element: /* @__PURE__ */ jsx(NotFoundPage, {}) })
    ] }) }),
    cookieBannerReady ? /* @__PURE__ */ jsx(Suspense, { fallback: /* @__PURE__ */ jsx(SuspenseFallback, {}), children: /* @__PURE__ */ jsx(CookieBanner, {}) }) : null
  ] }) });
}
function LocalizedShell({ locale }) {
  const { setLocale } = useI18n();
  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);
  return /* @__PURE__ */ jsx(Outlet, {});
}
function LegacyRedirect({ to }) {
  const { locale } = useI18n();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/${to}${location.search}${location.hash}`;
  return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
}
function LegacyRedirectToRoute({ routeKey }) {
  const { locale } = useI18n();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/${getRouteSlug(locale, routeKey)}${location.search}${location.hash}`;
  return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
}
function LegacyAdminOrderRedirect() {
  const { locale } = useI18n();
  const { id } = useParams();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/admin/orders/${id != null ? id : ""}${location.search}${location.hash}`;
  return /* @__PURE__ */ jsx(Navigate, { to: target, replace: true });
}
function RootLanding() {
  const { locale } = useI18n();
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(LanguageBanner, {}),
    /* @__PURE__ */ jsx(LocalePrompt, {}),
    /* @__PURE__ */ jsx(Landing, {}, `root-${locale}`)
  ] });
}
function LanguageBanner() {
  return /* @__PURE__ */ jsx("div", { className: "bg-gradient-to-r from-amber-50 via-white to-amber-50 text-gray-900", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-800", children: [
      /* @__PURE__ */ jsx("span", { className: "inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-amber-900", children: "A" }),
      /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Prefer another language?" }),
      /* @__PURE__ */ jsx("span", { className: "text-gray-600", children: "Choose a version:" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: SUPPORTED_LOCALES.map((lang) => /* @__PURE__ */ jsx(
      "a",
      {
        href: localeToRootPath(lang),
        className: "rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-900 transition hover:border-amber-300 hover:bg-amber-100",
        children: lang.toUpperCase()
      },
      lang
    )) })
  ] }) });
}
function LocalePrompt() {
  const { locale, setLocale } = useI18n();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [suggested, setSuggested] = useState(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (location.pathname !== "/") return;
    const dismissed = window.localStorage.getItem("tag_locale_prompted");
    if (dismissed === "1") return;
    const detected = detectBrowserLocale();
    if (detected === DEFAULT_LOCALE) return;
    if (detected === locale) return;
    setSuggested(detected);
    setShow(true);
  }, [locale, location.pathname]);
  const accept = () => {
    if (!suggested) return;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tag_locale_prompted", "1");
    }
    setLocale(suggested);
    window.location.href = `${localeToRootPath(suggested)}${location.search}${location.hash}`;
  };
  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("tag_locale_prompted", "1");
    }
    setShow(false);
  };
  if (!show || !suggested) {
    return null;
  }
  const label = suggested.toUpperCase();
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4", children: /* @__PURE__ */ jsx(
    "div",
    {
      className: "rounded-3xl border border-amber-200 bg-white p-6 shadow-2xl",
      style: { width: "min(92vw, 420px)" },
      children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-gray-900", children: "We detected your browser language" }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-700", children: [
          "Switch to ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold text-gray-900", children: label }),
          "?"
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:justify-center", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: accept,
              className: "w-full rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto",
              children: "Switch language"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: dismiss,
              className: "w-full rounded-full border border-gray-200 px-6 py-3 text-base font-medium text-gray-700 hover:border-gray-300 sm:w-auto",
              children: "Not now"
            }
          )
        ] })
      ] })
    }
  ) });
}
const en = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Book via WhatsApp",
    "progress": "Progress",
    "stepCounter": (current, total) => `Step ${current}/${total}`,
    "remainingFields": (count) => `Remaining fields: ${count}`,
    "orderOnlineNow": "Book online",
    "callNow": "Call now",
    "orderNow": "Book Now",
    "continue": "Continue",
    "back": "Back",
    "optional": "optional",
    "close": "Close",
    "noPrepayment": "No prepayment",
    "backToHome": "← Back to home",
    "notFoundTitle": "Page not found",
    "notFoundBody": "The page you are looking for does not exist or has moved.",
    "notFoundCta": "Go to homepage",
    "notFoundSupport": "If you think this is a mistake, contact us at",
    "notFoundRequested": "Requested URL",
    "notFoundPopular": "Popular pages",
    "actualBadge": "ACTUAL",
    "priceFrom": "from",
    "perNight": "at night",
    "perDay": "to City Center (day)",
    "whatsappMessage": "Hello Taxi Airport Gdańsk, I would like to book a transfer."
  },
  "navbar": {
    "home": "Home",
    "fleet": "Our Fleet",
    "airportTaxi": "Gdańsk Airport Taxi",
    "airportSopot": "Airport ↔ Sopot",
    "airportGdynia": "Airport ↔ Gdynia",
    "prices": "Prices",
    "orderNow": "BOOK NOW",
    "language": "Language"
  },
  "hero": {
    "promo": {
      "dayPrice": "ONLY 100 PLN",
      "dayLabel": "to City Center (day)",
      "nightPrice": "120 PLN",
      "nightLabel": "at night"
    },
    "logoAlt": "Taxi Airport Gdańsk - Airport Transfer & Limousine Service",
    "orderViaEmail": "Order via email",
    "headline": "Taxi Gdańsk Airport Transfers for Gdańsk, Sopot & Gdynia",
    "subheadline": "Book taxi Gdansk airport rides with fixed prices, 24/7 service, and fast confirmation.",
    "whyChoose": "Why choose Taxi Airport Gdańsk",
    "benefits": "Benefits",
    "benefitsList": {
      "flightTrackingTitle": "Flight tracking",
      "flightTrackingBody": "We monitor arrivals and adjust pickup time automatically.",
      "meetGreetTitle": "Meet & greet",
      "meetGreetBody": "Professional drivers, clear communication, and help with luggage.",
      "fastConfirmationTitle": "Fast confirmation",
      "fastConfirmationBody": "Most bookings are confirmed within 5–10 minutes.",
      "flexiblePaymentsTitle": "Flexible payments",
      "flexiblePaymentsBody": "Card, Apple Pay, Google Pay, Revolut, or cash.",
      "freePrebookingTitle": "Free prebooking",
      "freePrebookingBody": "Cancel anytime for free. Edit or cancel your booking online.",
      "fixedPriceTitle": "Fixed price guarantee",
      "fixedPriceBody": "Fixed price both ways. The price you book is the price you pay.",
      "localExpertiseTitle": "Local expertise",
      "localExpertiseBody": "Experienced Tri-City drivers who know the fastest routes.",
      "assistanceTitle": "24/7 assistance",
      "assistanceBody": "Always available before, during, and after your ride."
    },
    "fleetTitle": "Our Fleet",
    "fleetLabel": "Vehicles",
    "standardCarsTitle": "Standard Cars",
    "standardCarsBody": "1-4 passengers | Comfortable sedans and SUVs",
    "busTitle": "BUS Service",
    "busBody": "5-8 passengers | Perfect for larger groups"
  },
  "vehicle": {
    "title": "Choose Your Vehicle",
    "subtitle": "Select the vehicle type that best fits your group size",
    "standardTitle": "Standard Car",
    "standardPassengers": "1-4 passengers",
    "standardDescription": "Perfect for individuals, couples, and small families",
    "busTitle": "BUS Service",
    "busPassengers": "5-8 passengers",
    "busDescription": "Ideal for larger groups and families with extra luggage",
    "selfManageBadge": "Self-service: edit & cancel anytime",
    "examplePrices": "Example prices:",
    "airportGdansk": "Airport ↔ Gdańsk",
    "airportSopot": "Airport ↔ Sopot",
    "airportGdynia": "Airport ↔ Gdynia",
    "selectStandard": "Select Standard Car",
    "selectBus": "Select BUS Service"
  },
  "pricing": {
    "back": "Back to vehicle selection",
    "titleStandard": "Standard Car (1-4 passengers)",
    "titleBus": "BUS Service (5-8 passengers)",
    "description": "Fixed prices both ways (to and from the airport). No hidden fees. Night rate applies from 10 PM to 6 AM and on Sundays & public holidays.",
    "directionFromAirport": "From airport",
    "directionToAirport": "To airport",
    "dayRate": "Day rate",
    "nightRate": "Night rate",
    "sundayNote": "(Sundays & Holidays)",
    "customRouteTitle": "Custom Route",
    "customRouteBody": "Need a different destination?",
    "customRoutePrice": "Fixed prices",
    "customRoutePriceBody": "Flexible pricing based on your specific route",
    "customRouteAutoNote": "The calculator will estimate the price after you enter the addresses.",
    "requestQuote": "Book now",
    "pricesNote": "Prices include VAT. Additional destinations available on request.",
    "tableTitle": "Price table",
    "tableRoute": "Route",
    "tableStandardDay": "Standard day",
    "tableStandardNight": "Standard night",
    "tableBusDay": "Bus day",
    "tableBusNight": "Bus night",
    "tariffsTitle": "Custom route pricing",
    "tariffsName": "Tariff",
    "tariffsRate": "Rate",
    "bookingTitle": "Book a transfer",
    "bookingSubtitle": "Choose the vehicle type and reserve your ride instantly.",
    "routes": {
      "airport": "Airport",
      "gdansk": "Gdańsk City Center",
      "gdynia": "Gdynia City Center"
    }
  },
  "pricingLanding": {
    "title": "Gdańsk Airport Taxi Prices",
    "subtitle": "Fixed rates for airport transfers and transparent pricing for custom routes.",
    "description": "Compare standard and bus prices, then book instantly or request a quote for a custom transfer.",
    "cta": "Book a transfer",
    "calculatorCta": "Calculator",
    "highlights": [
      {
        "title": "Fixed prices both ways",
        "body": "The listed airport routes are priced upfront, with no hidden fees."
      },
      {
        "title": "24/7 availability",
        "body": "We operate every day with fast confirmation and support."
      },
      {
        "title": "Bus service for groups",
        "body": "Spacious 5–8 seat vehicles for families and larger groups."
      }
    ],
    "faqTitle": "Pricing FAQ",
    "faq": [
      {
        "question": "Are these prices fixed?",
        "answer": "Yes. Airport routes have fixed prices in both directions. Custom routes are priced individually."
      },
      {
        "question": "When does the night rate apply?",
        "answer": "From 22:00 to 6:00 and on Sundays & public holidays."
      },
      {
        "question": "Do you monitor flight delays?",
        "answer": "Yes. We track arrivals and adjust pickup time automatically."
      },
      {
        "question": "Can I pay by card?",
        "answer": "Card payments are available on request. Invoices are available for business clients."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Price calculator",
    "subtitle": "Enter pickup and destination to estimate the fare.",
    "airportLabel": "Gdańsk Airport",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Pickup from address",
    "destinationCustomLabel": "Destination address",
    "pickupLabel": "Pickup location",
    "pickupPlaceholder": "e.g. Gdańsk Airport, Słowackiego 200",
    "destinationLabel": "Destination",
    "destinationPlaceholder": "e.g. Sopot, Monte Cassino 1",
    "distanceLabel": "Distance",
    "resultsTitle": "Estimated price",
    "fixedAllDay": "All-day rate",
    "dayRate": "Day rate",
    "nightRate": "Night rate",
    "dayRateLabel": "Day rate",
    "allDayRateLabel": "All-day rate",
    "guaranteedPriceLabel": "Guaranteed price",
    "standard": "Standard",
    "bus": "Bus",
    "loading": "Calculating route...",
    "noResult": "We could not calculate this route. Try a more precise address.",
    "longRouteTitle": "Long route estimate",
    "taximeterLabel": "Taximeter",
    "proposedLabel": "Proposed price",
    "savingsLabel": "Savings",
    "orderNow": "Book now",
    "note": "Prices are fixed. You can propose a different price in the custom route order form."
  },
  "trust": {
    "googleReviewsTitle": "Google reviews",
    "googleReviewsCta": "See reviews",
    "googleReviewsCountLabel": "reviews",
    "companyTitle": "Company details",
    "paymentTitle": "Payment & invoices",
    "comfortTitle": "Comfort & safety",
    "paymentBody": "Pay by cash or card. VAT invoices available for business clients.",
    "comfortBody": "Child seats available on request. Professional, licensed drivers and door-to-door assistance."
  },
  "trustBar": {
    "ariaLabel": "Trust signals",
    "instantConfirmation": "Instant confirmation",
    "meetGreetOptional": "Meet & greet optional",
    "noPrepayment": "No prepayment",
    "supportWhatsappEmail": "Support: WhatsApp & email",
    "vatInvoice": "VAT invoice"
  },
  "footer": {
    "description": "Professional airport transfer service in the Tri-City area. Available 24/7.",
    "contactTitle": "Contact",
    "location": "Gdańsk, Poland",
    "bookingNote": "Book online, via WhatsApp, or email",
    "hoursTitle": "Service Hours",
    "hoursBody": "24/7 - Available every day",
    "hoursSub": "Airport pickups, city transfers, and custom routes",
    "routesTitle": "Popular Routes",
    "rights": "All rights reserved.",
    "cookiePolicy": "Cookie Policy",
    "privacyPolicy": "Privacy Policy"
  },
  "cookieBanner": {
    "title": "Cookie settings",
    "body": "We use essential cookies to keep the booking process secure and reliable. With your permission, we also use marketing cookies to measure ad conversions and improve how we communicate offers. You can update your choice at any time by clearing your browser storage.",
    "readPolicy": "Read the policy",
    "decline": "Decline",
    "accept": "Accept cookies"
  },
  "cookiePolicy": {
    "title": "Cookie Policy",
    "updated": "Last updated: January 2, 2026",
    "intro": "This website uses cookies to ensure the site works reliably and to keep your booking safe. With your consent, we also use marketing cookies to measure ad conversions.",
    "sectionCookies": "What cookies we use",
    "cookiesList": [
      "Essential cookies to keep the site secure and prevent abuse.",
      "Preference cookies to remember basic choices during a session.",
      "Marketing cookies to measure conversions from ads (Google Ads)."
    ],
    "sectionManage": "How you can manage cookies",
    "manageBody1": "You can delete cookies at any time from your browser settings. Blocking essential cookies may prevent the booking form and order management from working properly.",
    "manageBody2": "You can also change your marketing cookie preference by clearing your browser storage and revisiting this site.",
    "contact": "Contact",
    "contactBody": "If you have questions about this policy, contact us at"
  },
  "privacyPolicy": {
    "title": "Privacy Policy",
    "updated": "Last updated: January 2, 2026",
    "intro": "This Privacy Policy explains how Taxi Airport Gdańsk collects and processes personal data when you use our booking services and website.",
    "controllerTitle": "Data controller",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Poland\nEmail:",
    "dataTitle": "What data we collect",
    "dataList": [
      "Contact details such as name, email address, and phone number.",
      "Booking details such as pickup location, date, time, flight number, and notes.",
      "Technical data such as IP address and basic browser information for security."
    ],
    "whyTitle": "Why we process your data",
    "whyList": [
      "To respond to your booking request and deliver the requested service.",
      "To communicate about your booking, changes, or cancellations.",
      "To comply with legal obligations and prevent misuse."
    ],
    "legalTitle": "Legal basis",
    "legalList": [
      "Contract performance (Article 6(1)(b) GDPR).",
      "Legal obligation (Article 6(1)(c) GDPR).",
      "Legitimate interests (Article 6(1)(f) GDPR), such as security and fraud prevention."
    ],
    "storageTitle": "How long we store data",
    "storageBody": "We keep booking data only as long as necessary to provide the service and meet legal or accounting requirements.",
    "shareTitle": "Who we share data with",
    "shareBody": "We share data only with service providers necessary to deliver the booking service (such as email delivery providers). We do not sell your personal data.",
    "rightsTitle": "Your rights",
    "rightsList": [
      "Access, rectification, or deletion of your personal data.",
      "Restriction or objection to processing.",
      "Data portability where applicable.",
      "Right to lodge a complaint with a supervisory authority."
    ],
    "contactTitle": "Contact",
    "contactBody": "For privacy-related requests, contact us at"
  },
  "routeLanding": {
    "orderNow": "Book Online Now",
    "quickLinks": "Quick links",
    "pricingLink": "View pricing",
    "orderLinks": {
      "airportGdansk": "Book airport → Gdańsk",
      "airportSopot": "Book airport → Sopot",
      "airportGdynia": "Book airport → Gdynia",
      "custom": "Custom route"
    },
    "pricingTitle": "Example prices",
    "vehicleLabel": "Standard car",
    "dayLabel": "Day rate",
    "nightLabel": "Night rate",
    "currency": "PLN",
    "pricingNote": "Prices include VAT. Night rate applies from 10 PM to 6 AM and on Sundays & public holidays.",
    "includedTitle": "What is included",
    "includedList": [
      "Meet & greet at the airport with clear pickup instructions.",
      "Flight tracking and flexible pickup time.",
      "Fixed pricing both ways with no hidden fees.",
      "Professional, English-speaking drivers."
    ],
    "destinationsTitle": "Popular destinations",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "How fast is confirmation?",
        "answer": "Most bookings are confirmed within 5–10 minutes by email."
      },
      {
        "question": "Do you track flights?",
        "answer": "Yes, we monitor arrivals and adjust pickup time accordingly."
      },
      {
        "question": "Can I cancel?",
        "answer": "You can cancel using the link sent in your confirmation email."
      },
      {
        "question": "Do you offer child seats?",
        "answer": "Yes, child seats are available on request during booking."
      },
      {
        "question": "How do I pay?",
        "answer": "You can pay by card, Apple Pay, Google Pay, Revolut, or cash on request."
      },
      {
        "question": "Where do I meet the driver?",
        "answer": "You will receive clear pickup instructions and contact details in the confirmation email."
      }
    ]
  },
  "countryLanding": {
    "title": "Gdansk Airport Transfer for UK Travelers",
    "description": "Private airport transfer in Gdansk with fixed prices, 24/7 pickups, and English-speaking drivers.",
    "intro": "Ideal for flights from the UK to Gdańsk Airport (GDN). Book online in minutes and get fast email confirmation.",
    "ctaPrimary": "Book transfer",
    "ctaSecondary": "See prices",
    "highlightsTitle": "Why UK travelers choose us",
    "highlights": [
      "Fixed prices in PLN with no hidden fees.",
      "Meet & greet at arrivals with clear pickup instructions.",
      "Flight tracking and flexible pickup time.",
      "Pay by card, Apple Pay, Google Pay, Revolut, or cash on request."
    ],
    "airportsTitle": "Common departure airports (UK)",
    "airports": [
      "London Stansted (STN)",
      "London Luton (LTN)",
      "Manchester (MAN)",
      "Edinburgh (EDI)",
      "Birmingham (BHX)",
      "Liverpool (LPL)"
    ],
    "faqTitle": "FAQ for UK travelers",
    "faq": [
      {
        "question": "Can I pay in GBP?",
        "answer": "Prices are in PLN. Card payments are automatically converted by your bank."
      },
      {
        "question": "Do you provide receipts or invoices?",
        "answer": "Yes, tell us in the booking notes and we will send a receipt or invoice by email."
      },
      {
        "question": "Is confirmation quick?",
        "answer": "Most bookings are confirmed within 5–10 minutes by email."
      },
      {
        "question": "Do you track flights?",
        "answer": "Yes, we monitor arrivals and adjust pickup time accordingly."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Book transfer",
    "ctaSecondary": "See prices",
    "highlightsTitle": "Why book in advance",
    "highlights": [
      "Meet & greet at arrivals with clear pickup instructions.",
      "Flight tracking and flexible pickup time.",
      "Fixed prices in PLN with no hidden fees.",
      "Pay by card, Apple Pay, Google Pay, Revolut, or cash on request."
    ],
    "destinationsTitle": "Popular destinations in the Tri-City",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Are there direct flights from {city} to Gdańsk?",
        "answer": "Direct flights operate seasonally. Check the current schedule before booking."
      },
      {
        "question": "How do I meet the driver?",
        "answer": "You will receive pickup instructions and contact details in the confirmation email."
      },
      {
        "question": "Is flight tracking included?",
        "answer": "Yes, we monitor arrivals and adjust pickup time if needed."
      },
      {
        "question": "Can I pay by card?",
        "answer": "Yes, card payments are accepted. Cash is also available on request."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Fixed-price taxi rides in Gdańsk with 24/7 availability.",
    "intro": "Book a reliable taxi in Gdańsk for airport transfers and city rides. Professional drivers, fast confirmation, and clear pricing.",
    "ctaPrimary": "Book taxi",
    "ctaSecondary": "See prices",
    "highlightsTitle": "Why book a taxi with us",
    "highlights": [
      "Fixed prices and no hidden fees.",
      "24/7 availability for airport and city rides.",
      "Flight tracking and flexible pickup time.",
      "Card, Apple Pay, Google Pay, Revolut, or cash on request."
    ],
    "serviceAreaTitle": "Service area",
    "serviceArea": [
      "Gdańsk Old Town and City Center",
      "Gdańsk Wrzeszcz and Oliwa",
      "Gdańsk Airport (GDN)",
      "Sopot and Gdynia"
    ],
    "routesTitle": "Popular taxi routes",
    "routes": [
      "Gdańsk Airport → Old Town",
      "Gdańsk Airport → Sopot",
      "Gdańsk Airport → Gdynia",
      "Old Town → Gdańsk Airport"
    ],
    "cityRoutesTitle": "Gdańsk Airport taxi price by city",
    "cityRoutesDescription": "Check the current taxi price from Gdańsk Airport to these destinations.",
    "cityRoutesItem": (destination) => `Gdańsk Airport → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "How fast is confirmation?",
        "answer": "Most bookings are confirmed within 5–10 minutes by email."
      },
      {
        "question": "Do you offer fixed prices?",
        "answer": "Yes, airport routes have fixed prices both ways."
      },
      {
        "question": "Can I pay by card?",
        "answer": "Yes, card payments are accepted. Cash is also available on request."
      },
      {
        "question": "Do you track flights?",
        "answer": "Yes, we monitor arrivals and adjust pickup time."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Please enter a valid phone number (digits only).",
      "phoneLength": "Please enter a valid phone number (7–15 digits, optional +).",
      "emailRequired": "Please enter your email address.",
      "email": "Please enter a valid email address.",
      "datePast": "Please select today or a future date.",
      "timePast": "Please select the current time or a future time.",
      "timeSoon": "Please select a time at least 40 minutes from now."
    },
    "rate": {
      "day": "Day rate",
      "night": "Night rate",
      "reasonDay": "standard day rate",
      "reasonLate": "pickup after 21:30 or before 5:30",
      "reasonHoliday": "Sunday/public holiday",
      "banner": (label, price, reason) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Failed to submit order. Please try again.",
    "submitNetworkError": "Network error while submitting the order. Please try again.",
    "submittedTitle": "Order received",
    "submittedBody": "Thanks! Your request is in the queue. Please wait for acceptance – it usually takes 5–10 minutes. You will receive a confirmation email shortly.",
    "awaiting": "Awaiting confirmation...",
    "totalPrice": "Total Price:",
    "orderNumber": "Order #:",
    "orderId": "Order ID:",
    "manageLink": "Manage or edit your order",
    "title": "Order Transfer",
    "date": "Date",
    "pickupTime": "Pickup Time",
    "pickupType": "Pickup Type",
    "pickupTypeHint": "Choose a pickup type to continue.",
    "airportPickup": "Airport Pickup",
    "addressPickup": "Address Pickup",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "The driver will contact you on WhatsApp or by phone and you'll meet up.",
    "signText": "Name Sign Text",
    "signPlaceholder": "Text to display on the pickup sign",
    "signHelp": "The driver will be waiting for you with a sign displaying this text until you exit the arrivals hall",
    "signPreview": "Sign Preview:",
    "signEmpty": "Your name will appear here",
    "flightNumber": "Flight Number",
    "flightPlaceholder": "e.g. LO123",
    "flightUnknown": "I don't know the flight number yet",
    "pickupAddress": "Pickup Address",
    "pickupPlaceholder": "Enter full pickup address",
    "passengers": "Number of Passengers",
    "passengersBus": [
      "5 people",
      "6 people",
      "7 people",
      "8 people"
    ],
    "passengersStandard": [
      "1 person",
      "2 people",
      "3 people",
      "4 people"
    ],
    "largeLuggage": "Large Luggage",
    "luggageNo": "No",
    "luggageYes": "Yes",
    "contactTitle": "Contact Information",
    "fullName": "Full Name",
    "namePlaceholder": "Your name",
    "phoneNumber": "Phone Number",
    "email": "Email Address",
    "emailPlaceholder": "your@email.com",
    "emailHelp": "You'll receive a confirmation email with a link to edit or cancel your order",
    "notesTitle": "Additional Notes (Optional)",
    "notesPlaceholder": "Any special requests or additional information...",
    "notesHelp": "E.g., child seat required, waiting time, special instructions",
    "submitting": "Submitting...",
    "formIncomplete": "Complete the form to continue",
    "confirmOrder": (price) => `Confirm order (${price} PLN)`,
    "reassurance": "No prepayment. Free cancellation. Confirmation in 5–10 min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Please enter a valid phone number (digits only).",
      "phoneLength": "Please enter a valid phone number (7–15 digits, optional +).",
      "email": "Please enter a valid email address.",
      "datePast": "Please select today or a future date.",
      "timePast": "Please select the current time or a future time.",
      "timeSoon": "Please select a time at least 40 minutes from now."
    },
    "submitError": "Failed to submit quote request. Please try again.",
    "submitNetworkError": "Network error while submitting the quote request. Please try again.",
    "submittedTitle": "Quote Request Received!",
    "submittedBody": "Thank you for your request. You will receive an email within 5-10 minutes confirming whether your offer has been accepted or declined.",
    "manageLink": "Manage your order",
    "title": "Request Custom Quote",
    "subtitle": "Propose your price and get a response within 5-10 minutes",
    "requestButton": "Book Transfer",
    "requestAnother": "Book Another Transfer",
    "toggleDescription": "Provide your ride details and propose your price. You will receive an email within 5-10 minutes confirming whether your offer has been accepted or declined.",
    "pickupType": "Pickup Type",
    "airportPickup": "Airport Pickup",
    "addressPickup": "Address Pickup",
    "lockMessage": "Select a pickup type to unlock the rest of the form.",
    "pickupAddress": "Pickup Address",
    "pickupPlaceholder": "Enter full pickup address (e.g., Gdańsk Airport, ul. Słowackiego 200)",
    "pickupAutoNote": "Airport pickup location is automatically set",
    "destinationAddress": "Destination Address",
    "destinationPlaceholder": "Enter destination address (e.g., Gdańsk Centrum, ul. Długa 1)",
    "price": "Price",
    "proposedPriceLabel": "Your Proposed Price (PLN)",
    "taximeterTitle": "Enter the address to see the price. If it doesn't fit, propose your own.",
    "tariff1": "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    "autoPriceNote": "The calculator will estimate the price after you enter the addresses.",
    "fixedPriceHint": "If you want to propose a fixed price, click here and fill the input.",
    "pricePlaceholder": "Enter your offer in PLN (e.g., 150)",
    "priceHelp": "Propose your price for this ride. We'll review and respond within 5-10 minutes.",
    "fixedRouteChecking": "Checking if this route qualifies for a fixed price...",
    "fixedRouteTitle": "Fixed price available",
    "fixedRouteDistance": (distance) => `Distance: ${distance} km`,
    "fixedRouteComputed": (price) => `${price} PLN`,
    "fixedRouteCta": "Book fixed price",
    "fixedRouteHint": "Use the fixed-price booking for the fastest confirmation.",
    "fixedRouteAllDay": "All-day rate applies",
    "fixedRouteDay": "Day rate applies",
    "fixedRouteNight": "Night rate applies",
    "fixedRouteLocked": "This route qualifies for a fixed price. Please book via the fixed-price form.",
    "longRouteTitle": "Long route estimate",
    "longRouteDistance": (distance) => `Distance: ${distance} km`,
    "longRouteTaximeter": (price, rate) => `Taximeter: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price) => `Proposed price: ${price} PLN`,
    "longRouteSavings": (percent) => `Savings: ${percent}%`,
    "longRouteNote": "You can still enter your own price below.",
    "date": "Date",
    "pickupTime": "Pickup Time",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "The driver will contact you on WhatsApp or by phone and you'll meet up.",
    "signText": "Name Sign Text",
    "signPlaceholder": "Text to display on the pickup sign",
    "signHelp": "The driver will be waiting for you with a sign displaying this text until you exit the arrivals hall",
    "signPreview": "Sign Preview:",
    "signEmpty": "Your name will appear here",
    "flightNumber": "Flight Number",
    "flightPlaceholder": "e.g. LO123",
    "passengers": "Number of Passengers",
    "passengersOptions": [
      "1 person",
      "2 people",
      "3 people",
      "4 people",
      "5+ people"
    ],
    "largeLuggage": "Large Luggage",
    "luggageNo": "No",
    "luggageYes": "Yes",
    "contactTitle": "Contact Information",
    "fullName": "Full Name",
    "namePlaceholder": "Your name",
    "phoneNumber": "Phone Number",
    "email": "Email Address",
    "emailPlaceholder": "your@email.com",
    "emailHelp": "You'll receive a response within 5-10 minutes",
    "notesTitle": "Additional Notes (Optional)",
    "notesPlaceholder": "Any special requests or additional information...",
    "notesHelp": "E.g., child seat required, waiting time, special instructions",
    "submitting": "Submitting...",
    "formIncomplete": "Complete the form to continue",
    "submit": "Book Transfer"
  },
  "manageOrder": {
    "errors": {
      "load": "Unable to load the order.",
      "loadNetwork": "Network error while loading the order.",
      "save": "Unable to save changes.",
      "saveNetwork": "Network error while saving changes.",
      "cancel": "Unable to cancel the order.",
      "cancelNetwork": "Network error while cancelling the order.",
      "copySuccess": "Copied to clipboard",
      "copyFail": "Unable to copy to clipboard",
      "emailRequired": "Please enter your email address."
    },
    "loading": "Loading your order...",
    "accessTitle": "Access your booking",
    "accessBody": "Enter the email address used during booking to access your order details.",
    "accessPlaceholder": "you@example.com",
    "accessAction": "Continue",
    "accessChecking": "Checking...",
    "cancelledTitle": "Order Cancelled",
    "cancelledBody": "Your order has been cancelled. If this was a mistake, please create a new booking.",
    "manageTitle": "Manage Your Transfer",
    "copyAction": "Copy",
    "orderLabel": "Order #",
    "orderIdLabel": "Order ID",
    "detailsUpdatedTitle": "Details updated",
    "updateSubmittedTitle": "Update submitted",
    "updateSubmittedBody": "Your update request was sent. We will review it and respond shortly.",
    "awaiting": "Awaiting confirmation...",
    "transferRoute": "Transfer Route",
    "priceLabel": "Price:",
    "pricePending": "Price confirmed individually",
    "taximeterTitle": "Price calculated by taximeter",
    "taximeterRates": "View taximeter rates",
    "tariff1": "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    "statusConfirmed": "Confirmed",
    "statusCompleted": "Completed",
    "statusFailed": "Not completed",
    "statusRejected": "Rejected",
    "statusPriceProposed": "Price Proposed",
    "statusPending": "Pending",
    "bookingDetails": "Booking Details",
    "editDetails": "Edit Details",
    "updateRequested": "Update Requested Fields",
    "confirmedEditNote": "Editing a confirmed order will send it back for approval. You will receive a new confirmation email.",
    "updateFieldsNote": "Please update the highlighted fields and save your changes.",
    "confirmedNote": "This order has been confirmed.",
    "completedNote": "This order has been marked as completed.",
    "failedNote": "This order has been marked as not completed.",
    "priceProposedNote": "A new price has been proposed to you. Please check your email to accept or reject the new price.",
    "rejectedNote": "This order has been rejected. Editing is disabled, but you can still cancel the booking.",
    "rejectionReasonLabel": "Reason:",
    "date": "Date",
    "pickupTime": "Pickup Time",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "The driver will contact you on WhatsApp or by phone and you'll meet up.",
    "signText": "Name Sign Text",
    "flightNumber": "Flight Number",
    "pickupAddress": "Pickup Address",
    "passengers": "Number of Passengers",
    "passengersBus": [
      "5 people",
      "6 people",
      "7 people",
      "8 people"
    ],
    "passengersStandard": [
      "1 person",
      "2 people",
      "3 people",
      "4 people"
    ],
    "largeLuggage": "Large Luggage",
    "luggageNo": "No",
    "luggageYes": "Yes",
    "contactTitle": "Contact Information",
    "fullName": "Full Name",
    "phoneNumber": "Phone Number",
    "email": "Email Address",
    "notesTitle": "Additional Notes (Optional)",
    "saveChanges": "Save Changes",
    "cancelEdit": "Cancel",
    "editBooking": "Edit Booking",
    "cancelBooking": "Cancel Booking",
    "changesNotice": "Changes to your booking will be confirmed via email. For urgent changes, please contact us directly at booking@taxiairportgdansk.com",
    "updateRequestNote": "Your booking has been updated. Please review and confirm the changes.",
    "rejectNote": "This booking has been rejected. Contact support if you have questions.",
    "cancelPromptTitle": "Cancel Booking?",
    "cancelPromptBody": "Are you sure you want to cancel this booking? This action cannot be undone.",
    "confirmCancel": "Yes, cancel",
    "keepBooking": "Keep booking",
    "copyOrderLabel": "Order #",
    "copyOrderIdLabel": "Order ID"
  },
  "adminOrders": {
    "title": "Admin Orders",
    "subtitle": "All recent orders and statuses.",
    "loading": "Loading orders...",
    "missingToken": "Missing admin token.",
    "errorLoad": "Failed to load orders.",
    "filters": {
      "all": "All",
      "active": "In progress",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "price_proposed": "Price proposed",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "columns": {
      "order": "Order",
      "pickup": "Pickup",
      "customer": "Customer",
      "price": "Price",
      "status": "Status",
      "open": "Open"
    },
    "empty": "No orders found.",
    "view": "View"
  },
  "adminOrder": {
    "title": "Admin Order Details",
    "subtitle": "Manage, confirm, or reject this order.",
    "back": "Back to all orders",
    "loading": "Loading order...",
    "missingToken": "Missing admin token.",
    "errorLoad": "Failed to load order.",
    "updated": "Order updated.",
    "updateError": "Failed to update order.",
    "statusUpdated": "Order status updated.",
    "updateRequestSent": "Update request sent to the customer.",
    "updateRequestError": "Failed to send update request.",
    "updateRequestSelect": "Select at least one field to update.",
    "orderLabel": "Order",
    "idLabel": "ID",
    "customerLabel": "Customer",
    "pickupLabel": "Pickup",
    "priceLabel": "Price",
    "additionalInfo": "Additional info",
    "passengers": "Passengers:",
    "largeLuggage": "Large luggage:",
    "pickupType": "Pickup type:",
    "signService": "Pickup service:",
    "signServiceSign": "Meet with a name sign",
    "signServiceSelf": "Find the driver myself",
    "signFee": "Sign fee:",
    "flightNumber": "Flight number:",
    "signText": "Sign text:",
    "route": "Route:",
    "notes": "Notes:",
    "adminActions": "Admin Actions",
    "confirmOrder": "Confirm order",
    "rejectOrder": "Reject order",
    "proposePrice": "Propose new price (PLN)",
    "sendPrice": "Send price proposal",
    "rejectionReason": "Rejection reason (optional)",
    "requestUpdate": "Request customer update",
    "requestUpdateBody": "Select the fields the customer should update. They will receive an email with a link to edit their booking.",
    "fieldPhone": "Phone number",
    "fieldEmail": "Email address",
    "fieldFlight": "Flight number",
    "requestUpdateAction": "Request update",
    "cancelConfirmedTitle": "Cancel confirmed order",
    "cancelConfirmedBody": "Send a cancellation email due to lack of taxi availability at the requested time.",
    "cancelConfirmedAction": "Cancel confirmed order",
    "cancelConfirmedConfirm": "Cancel this confirmed order and notify the customer?",
    "cancelConfirmedSuccess": "Order cancelled.",
    "deleteRejectedTitle": "Delete rejected order",
    "deleteRejectedBody": "Remove this rejected order permanently.",
    "deleteRejectedAction": "Delete rejected order",
    "deleteRejectedConfirm": "Delete this rejected order permanently?",
    "deleteRejectedSuccess": "Order deleted.",
    "completionTitle": "Completion status",
    "markCompleted": "Mark completed",
    "markCompletedConfirm": "Mark this order as completed?",
    "markFailed": "Mark not completed",
    "markFailedConfirm": "Mark this order as not completed?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Gdańsk Airport Taxi",
      "description": "Book a fast, reliable airport taxi from Gdańsk Airport. Fixed pricing both ways, professional drivers, and quick confirmation.",
      "route": "Gdańsk Airport",
      "examples": [
        "Gdańsk Old Town",
        "Gdańsk Oliwa",
        "Gdańsk Main Station",
        "Brzeźno Beach"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Gdańsk Airport to Sopot Transfer",
      "description": "Private transfer between Gdańsk Airport and Sopot with fixed pricing both ways and flight tracking.",
      "route": "Gdańsk Airport ↔ Sopot",
      "examples": [
        "Sopot Pier",
        "Sopot Centre",
        "Sopot Hotels",
        "Sopot Railway Station"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Gdańsk Airport to Gdynia Transfer",
      "description": "Comfortable transfer between Gdańsk Airport and Gdynia with fixed pricing both ways.",
      "route": "Gdańsk Airport ↔ Gdynia",
      "examples": [
        "Gdynia Centre",
        "Gdynia Port",
        "Gdynia Hotels",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
};
const en$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: en
}, Symbol.toStringTag, { value: "Module" }));
const pl = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Zamów przez WhatsApp",
    "progress": "Postęp",
    "stepCounter": (current, total) => `Krok ${current}/${total}`,
    "remainingFields": (count) => {
      if (count === 1) return "Pozostało jeszcze 1 pole do wypełnienia";
      const mod10 = count % 10;
      const mod100 = count % 100;
      const isFew = mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14);
      return `Pozostało jeszcze ${count} ${isFew ? "pola" : "pól"} do wypełnienia`;
    },
    "orderOnlineNow": "Złóż zamówienie online",
    "callNow": "Zadzwoń",
    "orderNow": "Rezerwuj",
    "continue": "Dalej",
    "back": "Wstecz",
    "optional": "opcjonalnie",
    "close": "Zamknij",
    "noPrepayment": "Bez przedpłaty",
    "backToHome": "← Wróć na stronę główną",
    "notFoundTitle": "Nie znaleziono strony",
    "notFoundBody": "Szukana strona nie istnieje lub została przeniesiona.",
    "notFoundCta": "Przejdź na stronę główną",
    "notFoundSupport": "Jeśli to błąd, skontaktuj się z nami:",
    "notFoundRequested": "Żądany adres URL",
    "notFoundPopular": "Popularne strony",
    "actualBadge": "AKTUALNY",
    "priceFrom": "od",
    "perNight": "nocą",
    "perDay": "do centrum (dzień)",
    "whatsappMessage": "Dzień dobry Taxi Airport Gdańsk, chcę zarezerwować transfer."
  },
  "navbar": {
    "home": "Start",
    "fleet": "Nasza flota",
    "airportTaxi": "Taxi Lotnisko Gdańsk",
    "airportSopot": "Lotnisko ↔ Sopot",
    "airportGdynia": "Lotnisko ↔ Gdynia",
    "prices": "Cennik",
    "orderNow": "REZERWUJ",
    "language": "Język"
  },
  "hero": {
    "promo": {
      "dayPrice": "TYLKO 100 PLN",
      "dayLabel": "do centrum (dzień)",
      "nightPrice": "120 PLN",
      "nightLabel": "nocą"
    },
    "logoAlt": "Taxi Airport Gdańsk - Transfer lotniskowy i limuzyny",
    "orderViaEmail": "Zamów przez e-mail",
    "headline": "Taxi Gdańsk Lotnisko – transfery dla Gdańska, Sopotu i Gdyni",
    "subheadline": "Taxi Gdańsk / taxi gdansk: stałe ceny, 24/7 i szybkie potwierdzenie.",
    "whyChoose": "Dlaczego Taxi Airport Gdańsk",
    "benefits": "Korzyści",
    "benefitsList": {
      "flightTrackingTitle": "Śledzenie lotu",
      "flightTrackingBody": "Monitorujemy przyloty i automatycznie dostosowujemy czas odbioru.",
      "meetGreetTitle": "Powitanie na lotnisku",
      "meetGreetBody": "Profesjonalni kierowcy, jasna komunikacja i pomoc z bagażem.",
      "fastConfirmationTitle": "Szybkie potwierdzenie",
      "fastConfirmationBody": "Większość rezerwacji potwierdzamy w 5–10 minut.",
      "flexiblePaymentsTitle": "Elastyczne płatności",
      "flexiblePaymentsBody": "Karta, Apple Pay, Google Pay, Revolut lub gotówka.",
      "freePrebookingTitle": "Darmowa rezerwacja z wyprzedzeniem",
      "freePrebookingBody": "Anuluj w dowolnym momencie bez opłat. W pełni automatycznie.",
      "fixedPriceTitle": "Gwarancja stałej ceny",
      "fixedPriceBody": "Stała cena w obie strony. Cena z rezerwacji to cena zapłaty.",
      "localExpertiseTitle": "Lokalne doświadczenie",
      "localExpertiseBody": "Doświadczeni kierowcy z Trójmiasta znający najszybsze trasy.",
      "assistanceTitle": "Wsparcie 24/7",
      "assistanceBody": "Dostępni przed, w trakcie i po przejeździe."
    },
    "fleetTitle": "Nasza flota",
    "fleetLabel": "Pojazdy",
    "standardCarsTitle": "Samochody standard",
    "standardCarsBody": "1–4 pasażerów | Komfortowe sedany i SUV-y",
    "busTitle": "Usługa BUS",
    "busBody": "5–8 pasażerów | Idealne dla większych grup"
  },
  "vehicle": {
    "title": "Wybierz pojazd",
    "subtitle": "Wybierz pojazd najlepiej dopasowany do liczby osób",
    "standardTitle": "Samochód standard",
    "standardPassengers": "1–4 pasażerów",
    "standardDescription": "Idealny dla singli, par i małych rodzin",
    "busTitle": "Usługa BUS",
    "busPassengers": "5–8 pasażerów",
    "busDescription": "Idealny dla większych grup i rodzin z większym bagażem",
    "selfManageBadge": "Edytuj i anuluj zamówienie samodzielnie",
    "examplePrices": "Przykładowe ceny:",
    "airportGdansk": "Lotnisko ↔ Gdańsk",
    "airportSopot": "Lotnisko ↔ Sopot",
    "airportGdynia": "Lotnisko ↔ Gdynia",
    "selectStandard": "Wybierz standard",
    "selectBus": "Wybierz BUS"
  },
  "pricing": {
    "back": "Wróć do wyboru pojazdu",
    "titleStandard": "Samochód standard (1–4 pasażerów)",
    "titleBus": "BUS (5–8 pasażerów)",
    "description": "Stałe ceny w obie strony (na i z lotniska). Bez ukrytych opłat. Taryfa nocna obowiązuje od 22:00 do 6:00 oraz w niedziele i święta.",
    "directionFromAirport": "Z lotniska",
    "directionToAirport": "Na lotnisko",
    "dayRate": "Taryfa dzienna",
    "nightRate": "Taryfa nocna",
    "sundayNote": "(niedziele i święta)",
    "customRouteTitle": "Trasa niestandardowa",
    "customRouteBody": "Inny cel podróży?",
    "customRoutePrice": "Ceny ustalone",
    "customRoutePriceBody": "Elastyczna wycena na podstawie Twojej trasy",
    "customRouteAutoNote": "Kalkulator automatycznie wyliczy stawkę po podaniu adresu.",
    "requestQuote": "Rezerwuj",
    "pricesNote": "Ceny zawierają VAT. Dodatkowe destynacje dostępne na zapytanie.",
    "tableTitle": "Tabela cen",
    "tableRoute": "Trasa",
    "tableStandardDay": "Standard dzienna",
    "tableStandardNight": "Standard nocna",
    "tableBusDay": "Bus dzienna",
    "tableBusNight": "Bus nocna",
    "tariffsTitle": "Wycena tras niestandardowych",
    "tariffsName": "Taryfa",
    "tariffsRate": "Stawka",
    "bookingTitle": "Zarezerwuj przejazd",
    "bookingSubtitle": "Wybierz typ pojazdu i zarezerwuj przejazd od razu.",
    "routes": {
      "airport": "Lotnisko",
      "gdansk": "Centrum Gdańska",
      "gdynia": "Centrum Gdyni"
    }
  },
  "pricingLanding": {
    "title": "Cennik Taxi Lotnisko Gdańsk",
    "subtitle": "Stałe ceny transferów lotniskowych oraz przejrzysta wycena tras niestandardowych.",
    "description": "Porównaj ceny standard i bus, a potem zarezerwuj od razu lub poproś o wycenę.",
    "cta": "Zarezerwuj przejazd",
    "calculatorCta": "Kalkulator",
    "highlights": [
      {
        "title": "Stałe ceny w obie strony",
        "body": "Podane trasy lotniskowe mają z góry ustaloną cenę bez ukrytych opłat."
      },
      {
        "title": "Dostępność 24/7",
        "body": "Pracujemy codziennie, szybkie potwierdzenie i wsparcie."
      },
      {
        "title": "Busy dla grup",
        "body": "Pojazdy 5–8 miejsc dla rodzin i większych ekip."
      }
    ],
    "faqTitle": "FAQ cennika",
    "faq": [
      {
        "question": "Czy te ceny są stałe?",
        "answer": "Tak. Trasy lotniskowe mają stałe ceny w obie strony. Trasy niestandardowe są wyceniane indywidualnie."
      },
      {
        "question": "Kiedy obowiązuje taryfa nocna?",
        "answer": "Od 22:00 do 6:00 oraz w niedziele i święta."
      },
      {
        "question": "Czy monitorujecie opóźnienia lotów?",
        "answer": "Tak, śledzimy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Czy można zapłacić kartą?",
        "answer": "Tak, płatność kartą na życzenie. Faktury dla firm."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Kalkulator ceny",
    "subtitle": "Podaj miejsce odbioru i cel, aby zobaczyć szacunkową cenę.",
    "airportLabel": "Lotnisko Gdańsk",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Odbiór z adresu",
    "destinationCustomLabel": "Adres docelowy",
    "pickupLabel": "Miejsce odbioru",
    "pickupPlaceholder": "np. Gdańsk Airport, Słowackiego 200",
    "destinationLabel": "Miejsce docelowe",
    "destinationPlaceholder": "np. Sopot, Monte Cassino 1",
    "distanceLabel": "Dystans",
    "resultsTitle": "Szacunkowa cena",
    "fixedAllDay": "Taryfa całodobowa",
    "dayRate": "Taryfa dzienna",
    "nightRate": "Taryfa nocna",
    "dayRateLabel": "Stawka dzienna",
    "allDayRateLabel": "Całodobowa stawka",
    "guaranteedPriceLabel": "Gwarantowana cena",
    "standard": "Standard",
    "bus": "Bus",
    "loading": "Obliczamy trasę...",
    "noResult": "Nie udało się wycenić trasy. Spróbuj dokładniejszego adresu.",
    "longRouteTitle": "Wycena długiej trasy",
    "taximeterLabel": "Taksometr",
    "proposedLabel": "Sugerowana cena",
    "savingsLabel": "Oszczędzasz",
    "orderNow": "Zamów teraz",
    "note": "Ceny są stałe, możesz zaproponować inną cenę w formularzu do zamawiania innej trasy."
  },
  "trust": {
    "googleReviewsTitle": "Opinie Google",
    "googleReviewsCta": "Zobacz opinie",
    "googleReviewsCountLabel": "opinii",
    "companyTitle": "Dane firmy",
    "paymentTitle": "Płatność i faktury",
    "comfortTitle": "Komfort i bezpieczeństwo",
    "paymentBody": "Płatność gotówką lub kartą. Faktury VAT dla firm.",
    "comfortBody": "Foteliki dziecięce na życzenie. Profesjonalni, licencjonowani kierowcy i pomoc door-to-door."
  },
  "trustBar": {
    "ariaLabel": "Informacje zaufania",
    "instantConfirmation": "Szybkie potwierdzenie",
    "meetGreetOptional": "Powitanie na lotnisku opcjonalnie",
    "noPrepayment": "Bez przedpłaty",
    "supportWhatsappEmail": "Wsparcie: WhatsApp i e-mail",
    "vatInvoice": "Faktura VAT"
  },
  "footer": {
    "description": "Profesjonalny transfer lotniskowy w Trójmieście. Dostępny 24/7.",
    "contactTitle": "Kontakt",
    "location": "Gdańsk, Polska",
    "bookingNote": "Rezerwacja online, przez WhatsApp lub e-mail",
    "hoursTitle": "Godziny pracy",
    "hoursBody": "24/7 - Dostępne każdego dnia",
    "hoursSub": "Odbiory z lotniska, transfery miejskie i trasy niestandardowe",
    "routesTitle": "Popularne trasy",
    "rights": "Wszelkie prawa zastrzeżone.",
    "cookiePolicy": "Polityka cookies",
    "privacyPolicy": "Polityka prywatności"
  },
  "cookieBanner": {
    "title": "Ustawienia cookies",
    "body": "Używamy niezbędnych cookies, aby zapewnić bezpieczny i niezawodny proces rezerwacji. Za Twoją zgodą używamy także cookies marketingowych do mierzenia konwersji reklam i poprawy komunikacji ofert. W każdej chwili możesz zmienić wybór, czyszcząc dane przeglądarki.",
    "readPolicy": "Przeczytaj politykę",
    "decline": "Odrzuć",
    "accept": "Akceptuj cookies"
  },
  "cookiePolicy": {
    "title": "Polityka cookies",
    "updated": "Ostatnia aktualizacja: 2 stycznia 2026",
    "intro": "Ta strona używa cookies, aby działała niezawodnie i aby Twoja rezerwacja była bezpieczna. Za Twoją zgodą używamy także cookies marketingowych do mierzenia konwersji reklam.",
    "sectionCookies": "Jakich cookies używamy",
    "cookiesList": [
      "Niezbędne cookies do zapewnienia bezpieczeństwa i zapobiegania nadużyciom.",
      "Cookies preferencji do zapamiętania podstawowych wyborów w trakcie sesji.",
      "Cookies marketingowe do mierzenia konwersji z reklam (Google Ads)."
    ],
    "sectionManage": "Jak możesz zarządzać cookies",
    "manageBody1": "Możesz usunąć cookies w każdej chwili w ustawieniach przeglądarki. Zablokowanie niezbędnych cookies może uniemożliwić działanie formularza rezerwacji i panelu zamówień.",
    "manageBody2": "Możesz też zmienić zgodę marketingową, czyszcząc dane przeglądarki i ponownie odwiedzając stronę.",
    "contact": "Kontakt",
    "contactBody": "Jeśli masz pytania dotyczące tej polityki, napisz do nas na"
  },
  "privacyPolicy": {
    "title": "Polityka prywatności",
    "updated": "Ostatnia aktualizacja: 2 stycznia 2026",
    "intro": "Niniejsza Polityka prywatności wyjaśnia, jak Taxi Airport Gdańsk zbiera i przetwarza dane osobowe podczas korzystania z naszych usług i strony.",
    "controllerTitle": "Administrator danych",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Polska\nEmail:",
    "dataTitle": "Jakie dane zbieramy",
    "dataList": [
      "Dane kontaktowe, takie jak imię, adres e-mail i numer telefonu.",
      "Dane rezerwacji, takie jak miejsce odbioru, data, godzina, numer lotu i uwagi.",
      "Dane techniczne, takie jak adres IP i podstawowe informacje o przeglądarce w celach bezpieczeństwa."
    ],
    "whyTitle": "Dlaczego przetwarzamy Twoje dane",
    "whyList": [
      "Aby odpowiedzieć na zapytanie i zrealizować usługę.",
      "Aby komunikować się w sprawie rezerwacji, zmian lub anulowania.",
      "Aby wypełnić obowiązki prawne i zapobiegać nadużyciom."
    ],
    "legalTitle": "Podstawa prawna",
    "legalList": [
      "Wykonanie umowy (art. 6 ust. 1 lit. b RODO).",
      "Obowiązek prawny (art. 6 ust. 1 lit. c RODO).",
      "Uzasadniony interes (art. 6 ust. 1 lit. f RODO), np. bezpieczeństwo i zapobieganie nadużyciom."
    ],
    "storageTitle": "Jak długo przechowujemy dane",
    "storageBody": "Przechowujemy dane rezerwacji tak długo, jak jest to konieczne do realizacji usługi oraz spełnienia wymogów prawnych lub księgowych.",
    "shareTitle": "Komu udostępniamy dane",
    "shareBody": "Udostępniamy dane tylko podmiotom niezbędnym do realizacji usługi (np. dostawcom e-mail). Nie sprzedajemy danych osobowych.",
    "rightsTitle": "Twoje prawa",
    "rightsList": [
      "Dostęp, sprostowanie lub usunięcie danych osobowych.",
      "Ograniczenie przetwarzania lub sprzeciw.",
      "Przenoszenie danych, jeśli ma zastosowanie.",
      "Prawo do złożenia skargi do organu nadzorczego."
    ],
    "contactTitle": "Kontakt",
    "contactBody": "W sprawach prywatności skontaktuj się z nami pod adresem"
  },
  "routeLanding": {
    "orderNow": "Rezerwuj online teraz",
    "quickLinks": "Szybkie linki",
    "pricingLink": "Zobacz cennik",
    "orderLinks": {
      "airportGdansk": "Rezerwacja lotnisko → Gdańsk",
      "airportSopot": "Rezerwacja lotnisko → Sopot",
      "airportGdynia": "Rezerwacja lotnisko → Gdynia",
      "custom": "Trasa niestandardowa"
    },
    "pricingTitle": "Przykładowe ceny",
    "vehicleLabel": "Samochód standard",
    "dayLabel": "Taryfa dzienna",
    "nightLabel": "Taryfa nocna",
    "currency": "PLN",
    "pricingNote": "Ceny zawierają VAT. Taryfa nocna obowiązuje od 22:00 do 6:00 oraz w niedziele i święta.",
    "includedTitle": "Co obejmuje usługa",
    "includedList": [
      "Powitanie na lotnisku i jasne instrukcje odbioru.",
      "Śledzenie lotu i elastyczny czas odbioru.",
      "Stałe ceny w obie strony bez ukrytych opłat.",
      "Profesjonalni kierowcy mówiący po angielsku."
    ],
    "destinationsTitle": "Popularne kierunki",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Jak szybko dostanę potwierdzenie?",
        "answer": "Większość rezerwacji potwierdzamy e-mailem w 5–10 minut."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Czy mogę anulować?",
        "answer": "Możesz anulować korzystając z linku w e-mailu potwierdzającym."
      },
      {
        "question": "Czy oferujecie foteliki dziecięce?",
        "answer": "Tak, foteliki dziecięce są dostępne na życzenie podczas rezerwacji."
      },
      {
        "question": "Jak mogę zapłacić?",
        "answer": "Możesz zapłacić kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
      },
      {
        "question": "Gdzie spotkam kierowcę?",
        "answer": "Otrzymasz jasne instrukcje odbioru i kontakt do kierowcy w e-mailu potwierdzającym."
      }
    ]
  },
  "countryLanding": {
    "title": "Transfer lotniskowy Gdańsk dla podróżnych z zagranicy",
    "description": "Prywatny transfer z lotniska Gdańsk ze stałymi cenami, odbiór 24/7 i szybkie potwierdzenie.",
    "intro": "Idealne rozwiązanie dla osób przylatujących do Gdańska (GDN). Rezerwuj online w kilka minut.",
    "ctaPrimary": "Zarezerwuj transfer",
    "ctaSecondary": "Zobacz ceny",
    "highlightsTitle": "Dlaczego warto z nami",
    "highlights": [
      "Stałe ceny bez ukrytych opłat.",
      "Meet & greet i jasne instrukcje odbioru.",
      "Śledzenie lotów i elastyczny czas odbioru.",
      "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
    ],
    "airportsTitle": "Popularne lotniska w Europie",
    "airports": [
      "Londyn Stansted (STN)",
      "Frankfurt (FRA)",
      "Oslo Gardermoen (OSL)",
      "Sztokholm Arlanda (ARN)",
      "Kopenhaga (CPH)",
      "Helsinki (HEL)"
    ],
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "W jakiej walucie płacę?",
        "answer": "Ceny są w PLN. Płatność kartą zostanie automatycznie przeliczona przez bank."
      },
      {
        "question": "Czy wystawiacie paragon lub fakturę?",
        "answer": "Tak, wpisz to w uwagach do rezerwacji — wyślemy dokument e-mailem."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Jak szybko dostanę potwierdzenie?",
        "answer": "Zwykle w 5–10 minut e-mailem."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Zarezerwuj transfer",
    "ctaSecondary": "Zobacz ceny",
    "highlightsTitle": "Dlaczego warto zarezerwować wcześniej",
    "highlights": [
      "Meet & greet i jasne instrukcje odbioru.",
      "Śledzenie lotów i elastyczny czas odbioru.",
      "Stałe ceny bez ukrytych opłat.",
      "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
    ],
    "destinationsTitle": "Popularne kierunki w Trójmieście",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Czy są loty bezpośrednie z {city} do Gdańska?",
        "answer": "Loty bezpośrednie są sezonowe. Sprawdź aktualny rozkład przed podróżą."
      },
      {
        "question": "Jak spotkam kierowcę?",
        "answer": "Otrzymasz instrukcje odbioru i kontakt do kierowcy w e-mailu potwierdzającym."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      },
      {
        "question": "Czy mogę zapłacić kartą?",
        "answer": "Tak, płatność kartą jest akceptowana. Gotówka na życzenie."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Stałe ceny i dostępność 24/7.",
    "intro": "Taxi Gdańsk na transfery lotniskowe i przejazdy miejskie. Profesjonalni kierowcy, szybkie potwierdzenie i przejrzyste ceny.",
    "ctaPrimary": "Zarezerwuj taxi",
    "ctaSecondary": "Zobacz ceny",
    "highlightsTitle": "Dlaczego warto jechać z nami",
    "highlights": [
      "Stałe ceny bez ukrytych opłat.",
      "Dostępność 24/7 na lotnisko i miasto.",
      "Śledzenie lotów i elastyczny czas odbioru.",
      "Płatność kartą, Apple Pay, Google Pay, Revolut lub gotówką na życzenie."
    ],
    "serviceAreaTitle": "Obsługiwane obszary",
    "serviceArea": [
      "Gdańsk Stare Miasto i Centrum",
      "Gdańsk Wrzeszcz i Oliwa",
      "Lotnisko Gdańsk (GDN)",
      "Sopot i Gdynia"
    ],
    "routesTitle": "Popularne trasy taxi",
    "routes": [
      "Lotnisko Gdańsk → Stare Miasto",
      "Lotnisko Gdańsk → Sopot",
      "Lotnisko Gdańsk → Gdynia",
      "Stare Miasto → Lotnisko Gdańsk"
    ],
    "cityRoutesTitle": "Ceny taxi z lotniska Gdańsk",
    "cityRoutesDescription": "Sprawdź cenę przejazdu z lotniska Gdańsk do wybranych miast.",
    "cityRoutesItem": (destination) => `Lotnisko Gdańsk → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Jak szybko dostanę potwierdzenie?",
        "answer": "Większość rezerwacji potwierdzamy w 5–10 minut e-mailem."
      },
      {
        "question": "Czy ceny są stałe?",
        "answer": "Tak, trasy lotniskowe mają stałe ceny w obie strony."
      },
      {
        "question": "Czy mogę zapłacić kartą?",
        "answer": "Tak, płatność kartą jest akceptowana. Gotówka na życzenie."
      },
      {
        "question": "Czy śledzicie loty?",
        "answer": "Tak, monitorujemy przyloty i dostosowujemy czas odbioru."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Wpisz poprawny numer telefonu (tylko cyfry).",
      "phoneLength": "Wpisz poprawny numer telefonu (7–15 cyfr, opcjonalnie +).",
      "emailRequired": "Podaj adres e-mail.",
      "email": "Wpisz poprawny adres e-mail.",
      "datePast": "Wybierz dzisiejszą lub przyszłą datę.",
      "timePast": "Wybierz obecną lub przyszłą godzinę.",
      "timeSoon": "Wybierz godzinę co najmniej 40 minut od teraz."
    },
    "rate": {
      "day": "Taryfa dzienna",
      "night": "Taryfa nocna",
      "reasonDay": "standardowa taryfa dzienna",
      "reasonLate": "odbiór po 21:30 lub przed 5:30",
      "reasonHoliday": "niedziela/święto",
      "banner": (label, price, reason) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Nie udało się wysłać zamówienia. Spróbuj ponownie.",
    "submitNetworkError": "Błąd sieci podczas wysyłania zamówienia. Spróbuj ponownie.",
    "submittedTitle": "Zamówienie przyjęte",
    "submittedBody": "Dziękujemy! Twoje zgłoszenie jest w kolejce. Zaczekaj na akceptację – zwykle trwa to 5–10 minut. Wkrótce otrzymasz e-mail z potwierdzeniem.",
    "awaiting": "Oczekiwanie na potwierdzenie...",
    "totalPrice": "Cena całkowita:",
    "orderNumber": "Nr zamówienia:",
    "orderId": "ID zamówienia:",
    "manageLink": "Zarządzaj lub edytuj zamówienie",
    "title": "Zamów transfer",
    "date": "Data",
    "pickupTime": "Godzina odbioru",
    "pickupType": "Miejsce odbioru",
    "pickupTypeHint": "Wybierz typ odbioru, aby kontynuować.",
    "airportPickup": "Odbiór z lotniska",
    "addressPickup": "Odbiór z adresu",
    "signServiceTitle": "Odbiór na lotnisku",
    "signServiceSign": "Odbiór z kartką",
    "signServiceFee": "+20 PLN doliczone do ceny końcowej",
    "signServiceSelf": "Znajdę kierowcę samodzielnie na parkingu",
    "signServiceSelfNote": "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
    "signText": "Tekst na tabliczce",
    "signPlaceholder": "Tekst na tabliczce powitalnej",
    "signHelp": "Kierowca będzie czekał z tabliczką z tym tekstem do momentu wyjścia z hali przylotów",
    "signPreview": "Podgląd tabliczki:",
    "signEmpty": "Tutaj pojawi się Twoje imię",
    "flightNumber": "Numer lotu",
    "flightPlaceholder": "np. LO123",
    "flightUnknown": "Nie znam jeszcze numeru lotu",
    "pickupAddress": "Adres odbioru",
    "pickupPlaceholder": "Wpisz pełny adres odbioru",
    "passengers": "Liczba pasażerów",
    "passengersBus": [
      "5 osób",
      "6 osób",
      "7 osób",
      "8 osób"
    ],
    "passengersStandard": [
      "1 osoba",
      "2 osoby",
      "3 osoby",
      "4 osoby"
    ],
    "largeLuggage": "Duży bagaż",
    "luggageNo": "Nie",
    "luggageYes": "Tak",
    "contactTitle": "Dane kontaktowe",
    "fullName": "Imię i nazwisko",
    "namePlaceholder": "Twoje imię i nazwisko",
    "phoneNumber": "Numer telefonu",
    "email": "Adres e-mail",
    "emailPlaceholder": "twoj@email.com",
    "emailHelp": "Otrzymasz e-mail z potwierdzeniem i linkiem do edycji lub anulowania",
    "notesTitle": "Dodatkowe informacje (opcjonalnie)",
    "notesPlaceholder": "Dodatkowe życzenia lub informacje...",
    "notesHelp": "Np. fotelik dziecięcy, czas oczekiwania, specjalne instrukcje",
    "submitting": "Wysyłanie...",
    "formIncomplete": "Uzupełnij formularz, aby kontynuować",
    "confirmOrder": (price) => `Potwierdź zamówienie (${price} PLN)`,
    "reassurance": "Bez przedpłaty. Darmowa anulacja. Potwierdzenie w 5–10 min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Wpisz poprawny numer telefonu (tylko cyfry).",
      "phoneLength": "Wpisz poprawny numer telefonu (7–15 cyfr, opcjonalnie +).",
      "email": "Wpisz poprawny adres e-mail.",
      "datePast": "Wybierz dzisiejszą lub przyszłą datę.",
      "timePast": "Wybierz obecną lub przyszłą godzinę.",
      "timeSoon": "Wybierz godzinę co najmniej 40 minut od teraz."
    },
    "submitError": "Nie udało się wysłać zapytania o wycenę. Spróbuj ponownie.",
    "submitNetworkError": "Błąd sieci podczas wysyłania zapytania o wycenę. Spróbuj ponownie.",
    "submittedTitle": "Zapytanie o wycenę przyjęte!",
    "submittedBody": "Dziękujemy za zgłoszenie. W ciągu 5–10 minut otrzymasz e-mail z informacją o akceptacji lub odrzuceniu oferty.",
    "manageLink": "Zarządzaj zamówieniem",
    "title": "Poproś o indywidualną wycenę",
    "subtitle": "Zaproponuj cenę i otrzymaj odpowiedź w 5–10 minut",
    "requestButton": "Zarezerwuj przejazd",
    "requestAnother": "Zarezerwuj kolejny przejazd",
    "toggleDescription": "Podaj szczegóły przejazdu i zaproponuj cenę. W ciągu 5–10 minut otrzymasz e-mail z informacją o akceptacji lub odrzuceniu oferty.",
    "pickupType": "Miejsce odbioru",
    "airportPickup": "Odbiór z lotniska",
    "addressPickup": "Odbiór z adresu",
    "lockMessage": "Wybierz miejsce odbioru, aby odblokować resztę formularza.",
    "pickupAddress": "Adres odbioru",
    "pickupPlaceholder": "Wpisz pełny adres odbioru (np. Lotnisko Gdańsk, ul. Słowackiego 200)",
    "pickupAutoNote": "Adres odbioru z lotniska ustawiany jest automatycznie",
    "destinationAddress": "Adres docelowy",
    "destinationPlaceholder": "Wpisz adres docelowy (np. Gdańsk Centrum, ul. Długa 1)",
    "price": "Cena",
    "proposedPriceLabel": "Twoja proponowana cena (PLN)",
    "taximeterTitle": "Wpisz adres i poznasz cenę, jeśli Ci nie pasuje - zaproponuj swoją.",
    "tariff1": "Taryfa 1 (miasto, 6–22): 3,90 PLN/km.",
    "tariff2": "Taryfa 2 (miasto, 22–6): 5,85 PLN/km.",
    "tariff3": "Taryfa 3 (poza miastem, 6–22): 7,80 PLN/km.",
    "tariff4": "Taryfa 4 (poza miastem, 22–6): 11,70 PLN/km.",
    "autoPriceNote": "Kalkulator automatycznie wyliczy stawkę po podaniu adresu.",
    "fixedPriceHint": "Jeśli chcesz zaproponować stałą cenę, kliknij tutaj i wpisz kwotę.",
    "pricePlaceholder": "Wpisz swoją ofertę w PLN (np. 150)",
    "priceHelp": "Zaproponuj cenę za przejazd. Odpowiemy w 5–10 minut.",
    "fixedRouteChecking": "Sprawdzamy, czy ta trasa ma stałą cenę...",
    "fixedRouteTitle": "Stała cena dostępna",
    "fixedRouteDistance": (distance) => `Dystans: ${distance} km`,
    "fixedRouteComputed": (price) => `${price} PLN`,
    "fixedRouteCta": "Zarezerwuj stałą cenę",
    "fixedRouteHint": "Skorzystaj z rezerwacji stałej ceny, aby uzyskać najszybsze potwierdzenie.",
    "fixedRouteAllDay": "Stawka całodobowa",
    "fixedRouteDay": "Obowiązuje taryfa dzienna",
    "fixedRouteNight": "Obowiązuje taryfa nocna",
    "fixedRouteLocked": "Ta trasa ma stałą cenę. Zarezerwuj ją przez formularz stałej ceny.",
    "longRouteTitle": "Długi dystans - orientacyjna wycena",
    "longRouteDistance": (distance) => `Dystans: ${distance} km`,
    "longRouteTaximeter": (price, rate) => `Taksometr: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price) => `Proponowana cena: ${price} PLN`,
    "longRouteSavings": (percent) => `Oszczędność: ${percent}%`,
    "longRouteNote": "Możesz nadal zaproponować własną cenę poniżej.",
    "date": "Data",
    "pickupTime": "Godzina odbioru",
    "signServiceTitle": "Odbiór na lotnisku",
    "signServiceSign": "Odbiór z kartką",
    "signServiceFee": "+20 PLN doliczone do ceny końcowej",
    "signServiceSelf": "Znajdę kierowcę samodzielnie na parkingu",
    "signServiceSelfNote": "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
    "signText": "Tekst na tabliczce",
    "signPlaceholder": "Tekst na tabliczce powitalnej",
    "signHelp": "Kierowca będzie czekał z tabliczką z tym tekstem do momentu wyjścia z hali przylotów",
    "signPreview": "Podgląd tabliczki:",
    "signEmpty": "Tutaj pojawi się Twoje imię",
    "flightNumber": "Numer lotu",
    "flightPlaceholder": "np. LO123",
    "passengers": "Liczba pasażerów",
    "passengersOptions": [
      "1 osoba",
      "2 osoby",
      "3 osoby",
      "4 osoby",
      "5+ osób"
    ],
    "largeLuggage": "Duży bagaż",
    "luggageNo": "Nie",
    "luggageYes": "Tak",
    "contactTitle": "Dane kontaktowe",
    "fullName": "Imię i nazwisko",
    "namePlaceholder": "Twoje imię i nazwisko",
    "phoneNumber": "Numer telefonu",
    "email": "Adres e-mail",
    "emailPlaceholder": "twoj@email.com",
    "emailHelp": "Otrzymasz odpowiedź w 5–10 minut",
    "notesTitle": "Dodatkowe informacje (opcjonalnie)",
    "notesPlaceholder": "Dodatkowe życzenia lub informacje...",
    "notesHelp": "Np. fotelik dziecięcy, czas oczekiwania, specjalne instrukcje",
    "submitting": "Wysyłanie...",
    "formIncomplete": "Uzupełnij formularz, aby kontynuować",
    "submit": "Zarezerwuj przejazd"
  },
  "manageOrder": {
    "errors": {
      "load": "Nie udało się wczytać zamówienia.",
      "loadNetwork": "Błąd sieci podczas wczytywania zamówienia.",
      "save": "Nie udało się zapisać zmian.",
      "saveNetwork": "Błąd sieci podczas zapisywania zmian.",
      "cancel": "Nie udało się anulować zamówienia.",
      "cancelNetwork": "Błąd sieci podczas anulowania zamówienia.",
      "copySuccess": "Skopiowano do schowka",
      "copyFail": "Nie udało się skopiować do schowka",
      "emailRequired": "Podaj adres e-mail."
    },
    "loading": "Ładowanie zamówienia...",
    "accessTitle": "Dostęp do rezerwacji",
    "accessBody": "Podaj adres e-mail użyty podczas rezerwacji, aby zobaczyć szczegóły zamówienia.",
    "accessPlaceholder": "you@example.com",
    "accessAction": "Kontynuuj",
    "accessChecking": "Sprawdzanie...",
    "cancelledTitle": "Zamówienie anulowane",
    "cancelledBody": "Twoje zamówienie zostało anulowane. Jeśli to pomyłka, utwórz nową rezerwację.",
    "manageTitle": "Zarządzaj transferem",
    "copyAction": "Kopiuj",
    "orderLabel": "Nr zamówienia",
    "orderIdLabel": "ID zamówienia",
    "detailsUpdatedTitle": "Dane zaktualizowane",
    "updateSubmittedTitle": "Aktualizacja wysłana",
    "updateSubmittedBody": "Twoja prośba o aktualizację została wysłana. Wkrótce odpowiemy.",
    "awaiting": "Oczekiwanie na potwierdzenie...",
    "transferRoute": "Trasa przejazdu",
    "priceLabel": "Cena:",
    "pricePending": "Cena ustalana indywidualnie",
    "taximeterTitle": "Kwota liczona wg taksometru",
    "taximeterRates": "Stawki taksometru",
    "tariff1": "Taryfa 1 (miasto, 6–22): 3,90 PLN/km.",
    "tariff2": "Taryfa 2 (miasto, 22–6): 5,85 PLN/km.",
    "tariff3": "Taryfa 3 (poza miastem, 6–22): 7,80 PLN/km.",
    "tariff4": "Taryfa 4 (poza miastem, 22–6): 11,70 PLN/km.",
    "statusConfirmed": "Potwierdzone",
    "statusCompleted": "Zrealizowane",
    "statusFailed": "Nie zrealizowane",
    "statusRejected": "Odrzucone",
    "statusPriceProposed": "Zaproponowana cena",
    "statusPending": "Oczekujące",
    "bookingDetails": "Szczegóły rezerwacji",
    "editDetails": "Edytuj dane",
    "updateRequested": "Zaktualizuj wskazane pola",
    "confirmedEditNote": "Edycja potwierdzonego zamówienia wyśle je do ponownej akceptacji. Otrzymasz nowe potwierdzenie e-mailem.",
    "updateFieldsNote": "Zaktualizuj podświetlone pola i zapisz zmiany.",
    "confirmedNote": "To zamówienie zostało potwierdzone.",
    "completedNote": "To zamówienie zostało oznaczone jako zrealizowane.",
    "failedNote": "To zamówienie zostało oznaczone jako niezrealizowane.",
    "priceProposedNote": "Zaproponowano nową cenę. Sprawdź e-mail, aby ją zaakceptować lub odrzucić.",
    "rejectedNote": "To zamówienie zostało odrzucone. Edycja jest wyłączona, ale możesz anulować rezerwację.",
    "rejectionReasonLabel": "Powód:",
    "date": "Data",
    "pickupTime": "Godzina odbioru",
    "signServiceTitle": "Odbiór na lotnisku",
    "signServiceSign": "Odbiór z kartką",
    "signServiceFee": "+20 PLN doliczone do ceny końcowej",
    "signServiceSelf": "Znajdę kierowcę samodzielnie na parkingu",
    "signServiceSelfNote": "Kierowca skontaktuje się z Tobą na WhatsAppie lub telefonicznie i znajdziecie się.",
    "signText": "Tekst na tabliczce",
    "flightNumber": "Numer lotu",
    "pickupAddress": "Adres odbioru",
    "passengers": "Liczba pasażerów",
    "passengersBus": [
      "5 osób",
      "6 osób",
      "7 osób",
      "8 osób"
    ],
    "passengersStandard": [
      "1 osoba",
      "2 osoby",
      "3 osoby",
      "4 osoby"
    ],
    "largeLuggage": "Duży bagaż",
    "luggageNo": "Nie",
    "luggageYes": "Tak",
    "contactTitle": "Dane kontaktowe",
    "fullName": "Imię i nazwisko",
    "phoneNumber": "Numer telefonu",
    "email": "Adres e-mail",
    "notesTitle": "Dodatkowe informacje (opcjonalnie)",
    "saveChanges": "Zapisz zmiany",
    "cancelEdit": "Anuluj",
    "editBooking": "Edytuj rezerwację",
    "cancelBooking": "Anuluj rezerwację",
    "changesNotice": "Zmiany w rezerwacji potwierdzimy e-mailem. W pilnych sprawach skontaktuj się z nami pod adresem booking@taxiairportgdansk.com",
    "updateRequestNote": "Twoja rezerwacja została zaktualizowana. Sprawdź i potwierdź zmiany.",
    "rejectNote": "Rezerwacja została odrzucona. Skontaktuj się z obsługą, jeśli masz pytania.",
    "cancelPromptTitle": "Anulować rezerwację?",
    "cancelPromptBody": "Czy na pewno chcesz anulować tę rezerwację? Tej operacji nie można cofnąć.",
    "confirmCancel": "Tak, anuluj",
    "keepBooking": "Zachowaj rezerwację",
    "copyOrderLabel": "Nr zamówienia",
    "copyOrderIdLabel": "ID zamówienia"
  },
  "adminOrders": {
    "title": "Zamówienia (admin)",
    "subtitle": "Wszystkie ostatnie zamówienia i statusy.",
    "loading": "Ładowanie zamówień...",
    "missingToken": "Brak tokenu admina.",
    "errorLoad": "Nie udało się wczytać zamówień.",
    "filters": {
      "all": "Wszystkie",
      "active": "W toku",
      "completed": "Zrealizowane",
      "failed": "Niezrealizowane",
      "rejected": "Odrzucone"
    },
    "statuses": {
      "pending": "Oczekujące",
      "confirmed": "Potwierdzone",
      "price_proposed": "Zaproponowana cena",
      "completed": "Zrealizowane",
      "failed": "Niezrealizowane",
      "rejected": "Odrzucone"
    },
    "columns": {
      "order": "Zamówienie",
      "pickup": "Odbiór",
      "customer": "Klient",
      "price": "Cena",
      "status": "Status",
      "open": "Otwórz"
    },
    "empty": "Brak zamówień.",
    "view": "Podgląd"
  },
  "adminOrder": {
    "title": "Szczegóły zamówienia (admin)",
    "subtitle": "Zarządzaj, potwierdź lub odrzuć zamówienie.",
    "back": "Wróć do listy zamówień",
    "loading": "Ładowanie zamówienia...",
    "missingToken": "Brak tokenu admina.",
    "errorLoad": "Nie udało się wczytać zamówienia.",
    "updated": "Zamówienie zaktualizowane.",
    "updateError": "Nie udało się zaktualizować zamówienia.",
    "statusUpdated": "Status zamówienia zaktualizowany.",
    "updateRequestSent": "Wysłano prośbę o aktualizację do klienta.",
    "updateRequestError": "Nie udało się wysłać prośby o aktualizację.",
    "updateRequestSelect": "Wybierz co najmniej jedno pole do aktualizacji.",
    "orderLabel": "Zamówienie",
    "idLabel": "ID",
    "customerLabel": "Klient",
    "pickupLabel": "Odbiór",
    "priceLabel": "Cena",
    "additionalInfo": "Dodatkowe informacje",
    "passengers": "Pasażerowie:",
    "largeLuggage": "Duży bagaż:",
    "pickupType": "Miejsce odbioru:",
    "signService": "Opcja odbioru:",
    "signServiceSign": "Odbiór z kartką",
    "signServiceSelf": "Samodzielne znalezienie kierowcy",
    "signFee": "Dopłata za kartkę:",
    "flightNumber": "Numer lotu:",
    "signText": "Tekst na tabliczce:",
    "route": "Trasa:",
    "notes": "Uwagi:",
    "adminActions": "Akcje admina",
    "confirmOrder": "Potwierdź zamówienie",
    "rejectOrder": "Odrzuć zamówienie",
    "proposePrice": "Zaproponuj nową cenę (PLN)",
    "sendPrice": "Wyślij propozycję ceny",
    "rejectionReason": "Powód odrzucenia (opcjonalnie)",
    "requestUpdate": "Poproś o aktualizację danych",
    "requestUpdateBody": "Wybierz pola do aktualizacji. Klient otrzyma e-mail z linkiem do edycji.",
    "fieldPhone": "Numer telefonu",
    "fieldEmail": "Adres e-mail",
    "fieldFlight": "Numer lotu",
    "requestUpdateAction": "Wyślij prośbę",
    "cancelConfirmedTitle": "Anulowanie potwierdzonego zamówienia",
    "cancelConfirmedBody": "Wyślij klientowi e-mail o anulowaniu z powodu braku dostępności taksówek w wybranym czasie.",
    "cancelConfirmedAction": "Anuluj potwierdzone zamówienie",
    "cancelConfirmedConfirm": "Czy na pewno anulować to potwierdzone zamówienie i powiadomić klienta?",
    "cancelConfirmedSuccess": "Zamówienie anulowane.",
    "deleteRejectedTitle": "Usuń odrzucone zamówienie",
    "deleteRejectedBody": "Usuń to odrzucone zamówienie na stałe.",
    "deleteRejectedAction": "Usuń odrzucone zamówienie",
    "deleteRejectedConfirm": "Czy na pewno usunąć to odrzucone zamówienie?",
    "deleteRejectedSuccess": "Zamówienie usunięte.",
    "completionTitle": "Status realizacji",
    "markCompleted": "Zrealizowane",
    "markCompletedConfirm": "Oznaczyć to zamówienie jako zrealizowane?",
    "markFailed": "Niezrealizowane",
    "markFailedConfirm": "Oznaczyć to zamówienie jako niezrealizowane?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Taxi z lotniska Gdańsk",
      "description": "Zarezerwuj szybki i niezawodny transfer z Lotniska Gdańsk. Stałe ceny w obie strony, profesjonalni kierowcy i szybkie potwierdzenie.",
      "route": "Lotnisko Gdańsk",
      "examples": [
        "Gdańsk Stare Miasto",
        "Gdańsk Oliwa",
        "Dworzec Główny",
        "Plaża w Brzeźnie"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Transfer Lotnisko Gdańsk – Sopot",
      "description": "Prywatny transfer między Lotniskiem Gdańsk a Sopotem ze stałą ceną w obie strony i śledzeniem lotu.",
      "route": "Lotnisko Gdańsk ↔ Sopot",
      "examples": [
        "Molo w Sopocie",
        "Centrum Sopotu",
        "Hotele w Sopocie",
        "Dworzec Sopot"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Transfer Lotnisko Gdańsk – Gdynia",
      "description": "Komfortowy transfer między Lotniskiem Gdańsk a Gdynią ze stałą ceną w obie strony.",
      "route": "Lotnisko Gdańsk ↔ Gdynia",
      "examples": [
        "Centrum Gdyni",
        "Port Gdynia",
        "Hotele w Gdyni",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
};
const pl$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: pl
}, Symbol.toStringTag, { value: "Module" }));
const de = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Über WhatsApp buchen",
    "progress": "Fortschritt",
    "stepCounter": (current, total) => `Schritt ${current}/${total}`,
    "remainingFields": (count) => `Noch ${count} Felder auszufüllen`,
    "orderOnlineNow": "Taxi online buchen",
    "callNow": "Jetzt anrufen",
    "orderNow": "Jetzt reservieren",
    "continue": "Weiter",
    "back": "Zurück",
    "optional": "optional",
    "close": "Schließen",
    "noPrepayment": "Keine Vorauszahlung",
    "backToHome": "← Zurück zur Startseite",
    "notFoundTitle": "Seite nicht gefunden",
    "notFoundBody": "Die gesuchte Seite existiert nicht oder wurde verschoben.",
    "notFoundCta": "Zur Startseite",
    "notFoundSupport": "Wenn das ein Fehler ist, kontaktieren Sie uns:",
    "notFoundRequested": "Angeforderte URL",
    "notFoundPopular": "Beliebte Seiten",
    "actualBadge": "AKTUELL",
    "priceFrom": "ab",
    "perNight": "nachts",
    "perDay": "in die Innenstadt (Tag)",
    "whatsappMessage": "Hallo Taxi Airport Gdańsk, ich möchte einen Transfer buchen."
  },
  "navbar": {
    "home": "Start",
    "fleet": "Unsere Flotte",
    "airportTaxi": "Gdańsk Flughafen Taxi",
    "airportSopot": "Flughafen ↔ Sopot",
    "airportGdynia": "Flughafen ↔ Gdynia",
    "prices": "Preise",
    "orderNow": "JETZT RESERVIEREN",
    "language": "Sprache"
  },
  "hero": {
    "promo": {
      "dayPrice": "NUR 100 PLN",
      "dayLabel": "in die Innenstadt (Tag)",
      "nightPrice": "120 PLN",
      "nightLabel": "nachts"
    },
    "logoAlt": "Taxi Airport Gdańsk - Flughafentransfer & Limousinenservice",
    "orderViaEmail": "Per E-Mail bestellen",
    "headline": "Gdańsk Flughafen Taxi – Transfers für Gdańsk, Sopot & Gdynia",
    "subheadline": "Gdansk airport taxi mit Festpreisen, 24/7 Service und schneller Bestätigung.",
    "whyChoose": "Warum Taxi Airport Gdańsk",
    "benefits": "Vorteile",
    "benefitsList": {
      "flightTrackingTitle": "Flugverfolgung",
      "flightTrackingBody": "Wir überwachen Ankünfte und passen die Abholzeit automatisch an.",
      "meetGreetTitle": "Meet & Greet",
      "meetGreetBody": "Professionelle Fahrer, klare Kommunikation und Hilfe mit Gepäck.",
      "fastConfirmationTitle": "Schnelle Bestätigung",
      "fastConfirmationBody": "Die meisten Buchungen werden innerhalb von 5–10 Minuten bestätigt.",
      "flexiblePaymentsTitle": "Flexible Zahlungen",
      "flexiblePaymentsBody": "Karte, Apple Pay, Google Pay, Revolut oder bar.",
      "freePrebookingTitle": "Kostenlose Vorbuchung",
      "freePrebookingBody": "Jederzeit kostenlos stornierbar. Voll automatisiert.",
      "fixedPriceTitle": "Festpreisgarantie",
      "fixedPriceBody": "Festpreis in beide Richtungen. Der gebuchte Preis ist der Endpreis.",
      "localExpertiseTitle": "Lokale Expertise",
      "localExpertiseBody": "Erfahrene Dreistadt-Fahrer mit den schnellsten Routen.",
      "assistanceTitle": "24/7 Unterstützung",
      "assistanceBody": "Immer erreichbar vor, während und nach der Fahrt."
    },
    "fleetTitle": "Unsere Flotte",
    "fleetLabel": "Fahrzeuge",
    "standardCarsTitle": "Standardfahrzeuge",
    "standardCarsBody": "1-4 Passagiere | Komfortable Limousinen und SUVs",
    "busTitle": "Und mehr Busse",
    "busBody": "5-8 Passagiere | Perfekt für größere Gruppen"
  },
  "vehicle": {
    "title": "Wählen Sie Ihr Fahrzeug",
    "subtitle": "Wählen Sie den Fahrzeugtyp passend zur Gruppengröße",
    "standardTitle": "Standardwagen",
    "standardPassengers": "1-4 Passagiere",
    "standardDescription": "Perfekt für Einzelpersonen, Paare und kleine Familien",
    "busTitle": "BUS Service",
    "busPassengers": "5-8 Passagiere",
    "busDescription": "Ideal für größere Gruppen und Familien mit mehr Gepäck",
    "selfManageBadge": "Selbstservice: Buchung ändern oder stornieren",
    "examplePrices": "Beispielpreise:",
    "airportGdansk": "Flughafen ↔ Gdańsk",
    "airportSopot": "Flughafen ↔ Sopot",
    "airportGdynia": "Flughafen ↔ Gdynia",
    "selectStandard": "Standardwagen wählen",
    "selectBus": "BUS Service wählen"
  },
  "pricing": {
    "back": "Zurück zur Fahrzeugauswahl",
    "titleStandard": "Standardwagen (1-4 Passagiere)",
    "titleBus": "BUS Service (5-8 Passagiere)",
    "description": "Festpreise in beide Richtungen (zum und vom Flughafen). Keine versteckten Gebühren. Nachttarif gilt von 22–6 Uhr sowie an Sonntagen und Feiertagen.",
    "directionFromAirport": "Vom Flughafen",
    "directionToAirport": "Zum Flughafen",
    "dayRate": "Tagtarif",
    "nightRate": "Nachttarif",
    "sundayNote": "(Sonntage & Feiertage)",
    "customRouteTitle": "Individuelle Route",
    "customRouteBody": "Brauchen Sie ein anderes Ziel?",
    "customRoutePrice": "Festpreise",
    "customRoutePriceBody": "Flexible Preise je nach Strecke",
    "customRouteAutoNote": "Der Rechner schätzt den Preis, nachdem Sie die Adressen eingegeben haben.",
    "requestQuote": "Jetzt reservieren",
    "pricesNote": "Preise inkl. MwSt. Weitere Ziele auf Anfrage.",
    "tableTitle": "Preistabelle",
    "tableRoute": "Strecke",
    "tableStandardDay": "Standard Tag",
    "tableStandardNight": "Standard Nacht",
    "tableBusDay": "Bus Tag",
    "tableBusNight": "Bus Nacht",
    "tariffsTitle": "Individuelle Streckenpreise",
    "tariffsName": "Tarif",
    "tariffsRate": "Satz",
    "bookingTitle": "Transfer buchen",
    "bookingSubtitle": "Fahrzeugtyp wählen und Fahrt sofort reservieren.",
    "routes": {
      "airport": "Flughafen",
      "gdansk": "Gdańsk Zentrum",
      "gdynia": "Gdynia Zentrum"
    }
  },
  "pricingLanding": {
    "title": "Preise Taxi Flughafen Gdańsk",
    "subtitle": "Festpreise für Flughafentransfers und transparente Preise für individuelle Strecken.",
    "description": "Vergleichen Sie Standard- und Buspreise und buchen Sie sofort oder fordern Sie ein Angebot an.",
    "cta": "Transfer buchen",
    "calculatorCta": "Rechner",
    "highlights": [
      {
        "title": "Festpreise in beide Richtungen",
        "body": "Die gelisteten Flughafenrouten haben feste Preise ohne versteckte Gebühren."
      },
      {
        "title": "24/7 verfügbar",
        "body": "Täglich verfügbar mit schneller Bestätigung und Support."
      },
      {
        "title": "Busservice für Gruppen",
        "body": "Geräumige 5–8-Sitzer für Familien und größere Gruppen."
      }
    ],
    "faqTitle": "Preis-FAQ",
    "faq": [
      {
        "question": "Sind diese Preise fest?",
        "answer": "Ja. Flughafenrouten haben feste Preise in beide Richtungen. Individuelle Strecken werden individuell bepreist."
      },
      {
        "question": "Wann gilt der Nachttarif?",
        "answer": "Von 22:00 bis 6:00 sowie an Sonn- und Feiertagen."
      },
      {
        "question": "Überwacht ihr Flugverspätungen?",
        "answer": "Ja, wir verfolgen Ankünfte und passen die Abholzeit automatisch an."
      },
      {
        "question": "Kann ich mit Karte zahlen?",
        "answer": "Kartenzahlung auf Anfrage. Rechnungen für Geschäftskunden verfügbar."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Preisrechner",
    "subtitle": "Geben Sie Abholung und Ziel ein, um den Preis zu schätzen.",
    "airportLabel": "Flughafen Gdańsk",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Abholung von Adresse",
    "destinationCustomLabel": "Zieladresse",
    "pickupLabel": "Abholort",
    "pickupPlaceholder": "z.B. Flughafen Gdańsk, Słowackiego 200",
    "destinationLabel": "Zielort",
    "destinationPlaceholder": "z.B. Sopot, Monte Cassino 1",
    "distanceLabel": "Entfernung",
    "resultsTitle": "Preis-Schätzung",
    "fixedAllDay": "Ganztagstarif",
    "dayRate": "Tagtarif",
    "nightRate": "Nachttarif",
    "dayRateLabel": "Tagessatz",
    "allDayRateLabel": "Ganztagessatz",
    "guaranteedPriceLabel": "Garantierter Preis",
    "standard": "Standard",
    "bus": "Bus",
    "loading": "Route wird berechnet...",
    "noResult": "Diese Route konnte nicht berechnet werden. Bitte Adresse präzisieren.",
    "longRouteTitle": "Schätzung für lange Strecken",
    "taximeterLabel": "Taxameter",
    "proposedLabel": "Vorgeschlagener Preis",
    "savingsLabel": "Ersparnis",
    "orderNow": "Jetzt buchen",
    "note": "Preise sind fest. Sie können im Formular für eine andere Strecke einen anderen Preis vorschlagen."
  },
  "trust": {
    "googleReviewsTitle": "Google-Bewertungen",
    "googleReviewsCta": "Bewertungen ansehen",
    "googleReviewsCountLabel": "Bewertungen",
    "companyTitle": "Unternehmensdaten",
    "paymentTitle": "Zahlung & Rechnungen",
    "comfortTitle": "Komfort & Sicherheit",
    "paymentBody": "Bar oder mit Karte. Rechnungen (VAT) für Geschäftskunden verfügbar.",
    "comfortBody": "Kindersitze auf Anfrage. Professionelle, lizenzierte Fahrer und Tür-zu-Tür-Service."
  },
  "trustBar": {
    "ariaLabel": "Vertrauenssignale",
    "instantConfirmation": "Schnelle Bestätigung",
    "meetGreetOptional": "Meet & greet optional",
    "noPrepayment": "Keine Vorauszahlung",
    "supportWhatsappEmail": "Support: WhatsApp & E-Mail",
    "vatInvoice": "MwSt.-Rechnung"
  },
  "footer": {
    "description": "Professioneller Flughafentransfer in der Dreistadt. Rund um die Uhr verfügbar.",
    "contactTitle": "Kontakt",
    "location": "Gdańsk, Polen",
    "bookingNote": "Online, per WhatsApp oder E-Mail buchen",
    "hoursTitle": "Servicezeiten",
    "hoursBody": "24/7 - täglich verfügbar",
    "hoursSub": "Flughafenabholungen, City-Transfers und individuelle Routen",
    "routesTitle": "Beliebte Routen",
    "rights": "Alle Rechte vorbehalten.",
    "cookiePolicy": "Cookie-Richtlinie",
    "privacyPolicy": "Datenschutz"
  },
  "cookieBanner": {
    "title": "Cookie-Einstellungen",
    "body": "Wir verwenden essentielle Cookies, um den Buchungsprozess sicher und zuverlässig zu halten. Mit Ihrer Zustimmung nutzen wir auch Marketing-Cookies, um Anzeigen-Konversionen zu messen und Angebote zu verbessern. Sie können Ihre Auswahl jederzeit durch Löschen des Browser-Speichers ändern.",
    "readPolicy": "Richtlinie lesen",
    "decline": "Ablehnen",
    "accept": "Cookies akzeptieren"
  },
  "cookiePolicy": {
    "title": "Cookie-Richtlinie",
    "updated": "Zuletzt aktualisiert: 2. Januar 2026",
    "intro": "Diese Website verwendet Cookies, um zuverlässig zu funktionieren und Ihre Buchung sicher zu halten. Mit Ihrer Zustimmung verwenden wir auch Marketing-Cookies, um Konversionen zu messen.",
    "sectionCookies": "Welche Cookies wir verwenden",
    "cookiesList": [
      "Essentielle Cookies zur Sicherheit der Website und zur Missbrauchsprävention.",
      "Präferenz-Cookies, um grundlegende Einstellungen während einer Sitzung zu merken.",
      "Marketing-Cookies zur Messung von Konversionen aus Anzeigen (Google Ads)."
    ],
    "sectionManage": "So können Sie Cookies verwalten",
    "manageBody1": "Sie können Cookies jederzeit in den Browser-Einstellungen löschen. Das Blockieren essentieller Cookies kann die Buchung und Verwaltung beeinträchtigen.",
    "manageBody2": "Sie können Ihre Marketing-Cookie-Einstellung auch ändern, indem Sie den Browser-Speicher löschen und die Website erneut besuchen.",
    "contact": "Kontakt",
    "contactBody": "Wenn Sie Fragen zu dieser Richtlinie haben, kontaktieren Sie uns unter"
  },
  "privacyPolicy": {
    "title": "Datenschutz",
    "updated": "Zuletzt aktualisiert: 2. Januar 2026",
    "intro": "Diese Datenschutzerklärung erklärt, wie Taxi Airport Gdańsk personenbezogene Daten verarbeitet, wenn Sie unsere Dienste nutzen.",
    "controllerTitle": "Verantwortlicher",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Polen\nE-Mail:",
    "dataTitle": "Welche Daten wir erheben",
    "dataList": [
      "Kontaktdaten wie Name, E-Mail-Adresse und Telefonnummer.",
      "Buchungsdaten wie Abholort, Datum, Uhrzeit, Flugnummer und Hinweise.",
      "Technische Daten wie IP-Adresse und grundlegende Browserinformationen zur Sicherheit."
    ],
    "whyTitle": "Warum wir Ihre Daten verarbeiten",
    "whyList": [
      "Um Ihre Buchungsanfrage zu bearbeiten und den Service zu erbringen.",
      "Um über Buchungen, Änderungen oder Stornierungen zu kommunizieren.",
      "Zur Erfüllung gesetzlicher Pflichten und zur Missbrauchsprävention."
    ],
    "legalTitle": "Rechtsgrundlage",
    "legalList": [
      "Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO).",
      "Rechtliche Verpflichtung (Art. 6 Abs. 1 lit. c DSGVO).",
      "Berechtigte Interessen (Art. 6 Abs. 1 lit. f DSGVO), z. B. Sicherheit und Betrugsprävention."
    ],
    "storageTitle": "Wie lange wir Daten speichern",
    "storageBody": "Wir speichern Buchungsdaten nur so lange, wie es für die Leistungserbringung und gesetzliche Anforderungen notwendig ist.",
    "shareTitle": "Mit wem wir Daten teilen",
    "shareBody": "Wir teilen Daten nur mit Dienstleistern, die für die Buchung erforderlich sind (z. B. E-Mail-Dienste). Wir verkaufen keine personenbezogenen Daten.",
    "rightsTitle": "Ihre Rechte",
    "rightsList": [
      "Auskunft, Berichtigung oder Löschung Ihrer personenbezogenen Daten.",
      "Einschränkung oder Widerspruch gegen die Verarbeitung.",
      "Datenübertragbarkeit, sofern anwendbar.",
      "Beschwerderecht bei einer Aufsichtsbehörde."
    ],
    "contactTitle": "Kontakt",
    "contactBody": "Für Datenschutzanfragen kontaktieren Sie uns unter"
  },
  "routeLanding": {
    "orderNow": "Jetzt online reservieren",
    "quickLinks": "Schnellzugriffe",
    "pricingLink": "Preise ansehen",
    "orderLinks": {
      "airportGdansk": "Flughafen → Gdańsk buchen",
      "airportSopot": "Flughafen → Sopot buchen",
      "airportGdynia": "Flughafen → Gdynia buchen",
      "custom": "Individuelle Strecke"
    },
    "pricingTitle": "Beispielpreise",
    "vehicleLabel": "Standardwagen",
    "dayLabel": "Tagestarif",
    "nightLabel": "Nachttarif",
    "currency": "PLN",
    "pricingNote": "Preise inkl. MwSt. Nachttarif gilt von 22:00 bis 6:00 sowie an Sonn- und Feiertagen.",
    "includedTitle": "Was ist enthalten",
    "includedList": [
      "Meet & Greet am Flughafen mit klaren Abholhinweisen.",
      "Flugverfolgung und flexible Abholzeit.",
      "Festpreise in beide Richtungen ohne versteckte Gebühren.",
      "Professionelle, englischsprachige Fahrer."
    ],
    "destinationsTitle": "Beliebte Ziele",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Wie schnell ist die Bestätigung?",
        "answer": "Die meisten Buchungen werden innerhalb von 5–10 Minuten per E-Mail bestätigt."
      },
      {
        "question": "Verfolgen Sie Flüge?",
        "answer": "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
      },
      {
        "question": "Kann ich stornieren?",
        "answer": "Sie können über den Link in Ihrer Bestätigungs-E-Mail stornieren."
      },
      {
        "question": "Bieten Sie Kindersitze an?",
        "answer": "Ja, Kindersitze sind auf Anfrage bei der Buchung verfügbar."
      },
      {
        "question": "Wie kann ich bezahlen?",
        "answer": "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder bar auf Anfrage."
      },
      {
        "question": "Wo treffe ich den Fahrer?",
        "answer": "Sie erhalten klare Abholhinweise und Kontaktdaten in der Bestätigungs-E-Mail."
      }
    ]
  },
  "countryLanding": {
    "title": "Flughafentransfer Gdańsk für Reisende aus Deutschland",
    "description": "Privater Transfer ab Flughafen Gdańsk mit Festpreisen, 24/7 Abholung und englischsprachigen Fahrern.",
    "intro": "Ideal für Flüge aus Deutschland zum Flughafen Gdańsk (GDN). Online buchen und schnelle Bestätigung per E-Mail.",
    "ctaPrimary": "Transfer buchen",
    "ctaSecondary": "Preise ansehen",
    "highlightsTitle": "Warum Reisende aus Deutschland uns wählen",
    "highlights": [
      "Festpreise in PLN ohne versteckte Gebühren.",
      "Meet & greet am Terminal mit klaren Abholhinweisen.",
      "Flugverfolgung und flexible Abholzeit.",
      "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder auf Wunsch bar."
    ],
    "airportsTitle": "Häufige Abflugorte (Deutschland)",
    "airports": [
      "Dortmund (DTM)",
      "Frankfurt (FRA)",
      "Hamburg (HAM)",
      "München (MUC)"
    ],
    "faqTitle": "FAQ für Reisende aus Deutschland",
    "faq": [
      {
        "question": "Kann ich in EUR bezahlen?",
        "answer": "Die Preise sind in PLN. Kartenzahlungen werden automatisch von Ihrer Bank umgerechnet."
      },
      {
        "question": "Stellen Sie Belege oder Rechnungen aus?",
        "answer": "Ja, geben Sie dies bei der Buchung an und wir senden den Beleg per E-Mail."
      },
      {
        "question": "Wie schnell ist die Bestätigung?",
        "answer": "Die meisten Buchungen werden innerhalb von 5–10 Minuten per E-Mail bestätigt."
      },
      {
        "question": "Verfolgen Sie Flüge?",
        "answer": "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Transfer buchen",
    "ctaSecondary": "Preise ansehen",
    "highlightsTitle": "Warum im Voraus buchen",
    "highlights": [
      "Meet & greet am Terminal mit klaren Abholhinweisen.",
      "Flugverfolgung und flexible Abholzeit.",
      "Festpreise in PLN ohne versteckte Gebühren.",
      "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder auf Wunsch bar."
    ],
    "destinationsTitle": "Beliebte Ziele in der Dreistadt",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Gibt es Direktflüge von {city} nach Gdańsk?",
        "answer": "Direktflüge sind saisonal. Bitte prüfen Sie den aktuellen Flugplan vor der Reise."
      },
      {
        "question": "Wie treffe ich den Fahrer?",
        "answer": "Sie erhalten Abholhinweise und Kontaktdaten in der Bestätigungs-E-Mail."
      },
      {
        "question": "Ist Flugverfolgung inklusive?",
        "answer": "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
      },
      {
        "question": "Kann ich mit Karte zahlen?",
        "answer": "Ja, Kartenzahlung ist möglich. Barzahlung auf Wunsch."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Festpreise und 24/7 Verfügbarkeit.",
    "intro": "Taxi Gdańsk für Flughafentransfers und Stadtfahrten. Professionelle Fahrer, schnelle Bestätigung und klare Preise.",
    "ctaPrimary": "Taxi buchen",
    "ctaSecondary": "Preise ansehen",
    "highlightsTitle": "Warum mit uns fahren",
    "highlights": [
      "Festpreise ohne versteckte Gebühren.",
      "24/7 Verfügbarkeit für Flughafen- und Stadtfahrten.",
      "Flugverfolgung und flexible Abholzeit.",
      "Zahlung per Karte, Apple Pay, Google Pay, Revolut oder bar auf Wunsch."
    ],
    "serviceAreaTitle": "Servicegebiet",
    "serviceArea": [
      "Gdańsk Altstadt und Zentrum",
      "Gdańsk Wrzeszcz und Oliwa",
      "Flughafen Gdańsk (GDN)",
      "Sopot und Gdynia"
    ],
    "routesTitle": "Beliebte Taxi-Strecken",
    "routes": [
      "Flughafen Gdańsk → Altstadt",
      "Flughafen Gdańsk → Sopot",
      "Flughafen Gdańsk → Gdynia",
      "Altstadt → Flughafen Gdańsk"
    ],
    "cityRoutesTitle": "Taxipreise ab Flughafen Gdańsk",
    "cityRoutesDescription": "Prüfe den aktuellen Preis vom Flughafen Gdańsk zu diesen Orten.",
    "cityRoutesItem": (destination) => `Flughafen Gdańsk → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Wie schnell ist die Bestätigung?",
        "answer": "Die meisten Buchungen werden innerhalb von 5–10 Minuten per E-Mail bestätigt."
      },
      {
        "question": "Bieten Sie Festpreise an?",
        "answer": "Ja, Flughafentransfers haben feste Preise in beide Richtungen."
      },
      {
        "question": "Kann ich mit Karte zahlen?",
        "answer": "Ja, Kartenzahlung ist möglich. Barzahlung auf Wunsch."
      },
      {
        "question": "Verfolgen Sie Flüge?",
        "answer": "Ja, wir überwachen Ankünfte und passen die Abholzeit an."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Bitte geben Sie eine gültige Telefonnummer ein (nur Ziffern).",
      "phoneLength": "Bitte geben Sie eine gültige Telefonnummer ein (7–15 Ziffern, optional +).",
      "emailRequired": "Bitte geben Sie Ihre E-Mail-Adresse ein.",
      "email": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      "datePast": "Bitte wählen Sie ein heutiges oder zukünftiges Datum.",
      "timePast": "Bitte wählen Sie die aktuelle Uhrzeit oder eine zukünftige Uhrzeit.",
      "timeSoon": "Bitte wählen Sie eine Uhrzeit, die mindestens 40 Minuten ab jetzt liegt."
    },
    "rate": {
      "day": "Tagtarif",
      "night": "Nachttarif",
      "reasonDay": "Standard-Tagtarif",
      "reasonLate": "Abholung nach 21:30 oder vor 5:30",
      "reasonHoliday": "Sonntag/Feiertag",
      "banner": (label, price, reason) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Bestellung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    "submitNetworkError": "Netzwerkfehler beim Senden der Bestellung. Bitte versuchen Sie es erneut.",
    "submittedTitle": "Bestellung erhalten",
    "submittedBody": "Danke! Ihre Anfrage ist in der Warteschlange. Bitte warten Sie auf die Bestätigung – normalerweise 5–10 Minuten. Sie erhalten in Kürze eine Bestätigungs-E-Mail.",
    "awaiting": "Warten auf Bestätigung...",
    "totalPrice": "Gesamtpreis:",
    "orderNumber": "Bestellnummer:",
    "orderId": "Bestell-ID:",
    "manageLink": "Bestellung verwalten oder bearbeiten",
    "title": "Transfer bestellen",
    "date": "Datum",
    "pickupTime": "Abholzeit",
    "pickupType": "Abholart",
    "pickupTypeHint": "Wählen Sie die Abholart, um fortzufahren.",
    "airportPickup": "Flughafenabholung",
    "addressPickup": "Abholung an Adresse",
    "signServiceTitle": "Abholung am Flughafen",
    "signServiceSign": "Abholung mit Namensschild",
    "signServiceFee": "+20 PLN zum Endpreis",
    "signServiceSelf": "Fahrer selbst auf dem Parkplatz finden",
    "signServiceSelfNote": "Der Fahrer kontaktiert dich per WhatsApp oder telefonisch und ihr trefft euch.",
    "signText": "Text für Namensschild",
    "signPlaceholder": "Text für das Abholschild",
    "signHelp": "Der Fahrer wartet mit einem Schild, bis Sie die Ankunftshalle verlassen.",
    "signPreview": "Schildvorschau:",
    "signEmpty": "Ihr Name erscheint hier",
    "flightNumber": "Flugnummer",
    "flightPlaceholder": "z. B. LO123",
    "flightUnknown": "Ich kenne die Flugnummer noch nicht",
    "pickupAddress": "Abholadresse",
    "pickupPlaceholder": "Vollständige Abholadresse eingeben",
    "passengers": "Anzahl der Passagiere",
    "passengersBus": [
      "5 Personen",
      "6 Personen",
      "7 Personen",
      "8 Personen"
    ],
    "passengersStandard": [
      "1 Person",
      "2 Personen",
      "3 Personen",
      "4 Personen"
    ],
    "largeLuggage": "Großes Gepäck",
    "luggageNo": "Nein",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktdaten",
    "fullName": "Vollständiger Name",
    "namePlaceholder": "Ihr Name",
    "phoneNumber": "Telefonnummer",
    "email": "E-Mail-Adresse",
    "emailPlaceholder": "ihre@email.com",
    "emailHelp": "Sie erhalten eine Bestätigungs-E-Mail mit einem Link zum Bearbeiten oder Stornieren",
    "notesTitle": "Zusätzliche Hinweise (optional)",
    "notesPlaceholder": "Besondere Wünsche oder zusätzliche Informationen...",
    "notesHelp": "Z. B. Kindersitz erforderlich, Wartezeit, besondere Anweisungen",
    "submitting": "Wird gesendet...",
    "formIncomplete": "Formular ausfüllen, um fortzufahren",
    "confirmOrder": (price) => `Bestellung bestätigen (${price} PLN)`,
    "reassurance": "Keine Vorauszahlung. Kostenlose Stornierung. Bestätigung in 5–10 Min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Bitte geben Sie eine gültige Telefonnummer ein (nur Ziffern).",
      "phoneLength": "Bitte geben Sie eine gültige Telefonnummer ein (7–15 Ziffern, optional +).",
      "email": "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      "datePast": "Bitte wählen Sie ein heutiges oder zukünftiges Datum.",
      "timePast": "Bitte wählen Sie die aktuelle Uhrzeit oder eine zukünftige Uhrzeit.",
      "timeSoon": "Bitte wählen Sie eine Uhrzeit, die mindestens 40 Minuten ab jetzt liegt."
    },
    "submitError": "Angebotsanfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
    "submitNetworkError": "Netzwerkfehler beim Senden der Angebotsanfrage. Bitte versuchen Sie es erneut.",
    "submittedTitle": "Angebotsanfrage erhalten!",
    "submittedBody": "Vielen Dank. Sie erhalten innerhalb von 5-10 Minuten eine E-Mail, ob Ihr Angebot angenommen oder abgelehnt wurde.",
    "manageLink": "Ihre Bestellung verwalten",
    "title": "Individuelles Angebot anfordern",
    "subtitle": "Schlagen Sie Ihren Preis vor und erhalten Sie in 5-10 Minuten eine Antwort",
    "requestButton": "Angebot anfordern",
    "requestAnother": "Weiteres Angebot anfordern",
    "toggleDescription": "Geben Sie Ihre Fahrtdetails an und schlagen Sie Ihren Preis vor. Sie erhalten in 5-10 Minuten eine Antwort per E-Mail.",
    "pickupType": "Abholart",
    "airportPickup": "Flughafenabholung",
    "addressPickup": "Abholung an Adresse",
    "lockMessage": "Wählen Sie eine Abholart, um den Rest des Formulars freizuschalten.",
    "pickupAddress": "Abholadresse",
    "pickupPlaceholder": "Vollständige Abholadresse eingeben (z. B. Gdańsk Airport, ul. Słowackiego 200)",
    "pickupAutoNote": "Die Abholadresse am Flughafen wird automatisch gesetzt",
    "destinationAddress": "Zieladresse",
    "destinationPlaceholder": "Zieladresse eingeben (z. B. Gdańsk Centrum, ul. Długa 1)",
    "price": "Preis",
    "proposedPriceLabel": "Ihr Preisvorschlag (PLN)",
    "taximeterTitle": "Enter the address to see the price. If it doesn't fit, propose your own.",
    "tariff1": "Tarif 1 (Stadt, 6–22): 3.90 PLN/km.",
    "tariff2": "Tarif 2 (Stadt, 22–6): 5.85 PLN/km.",
    "tariff3": "Tarif 3 (außerhalb, 6–22): 7.80 PLN/km.",
    "tariff4": "Tarif 4 (außerhalb, 22–6): 11.70 PLN/km.",
    "autoPriceNote": "Der Rechner schätzt den Preis, nachdem Sie die Adressen eingegeben haben.",
    "fixedPriceHint": "Wenn Sie einen Festpreis vorschlagen möchten, klicken Sie hier und füllen das Feld aus.",
    "pricePlaceholder": "Ihr Angebot in PLN eingeben (z. B. 150)",
    "priceHelp": "Schlagen Sie Ihren Preis vor. Wir prüfen und antworten innerhalb von 5-10 Minuten.",
    "fixedRouteChecking": "Wir prüfen, ob diese Strecke einen Festpreis hat...",
    "fixedRouteTitle": "Festpreis verfügbar",
    "fixedRouteDistance": (distance) => `Entfernung: ${distance} km`,
    "fixedRouteComputed": (price) => `${price} PLN`,
    "fixedRouteCta": "Festpreis buchen",
    "fixedRouteHint": "Für die schnellste Bestätigung den Festpreis buchen.",
    "fixedRouteAllDay": "All-day rate applies",
    "fixedRouteDay": "Tagtarif gilt",
    "fixedRouteNight": "Nachttarif gilt",
    "fixedRouteLocked": "Diese Strecke hat einen Festpreis. Bitte über das Festpreis-Formular buchen.",
    "longRouteTitle": "Long route estimate",
    "longRouteDistance": (distance) => `Entfernung: ${distance} km`,
    "longRouteTaximeter": (price, rate) => `Taxameter: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price) => `Vorgeschlagener Preis: ${price} PLN`,
    "longRouteSavings": (percent) => `Ersparnis: ${percent}%`,
    "longRouteNote": "You can still enter your own price below.",
    "date": "Datum",
    "pickupTime": "Abholzeit",
    "signServiceTitle": "Abholung am Flughafen",
    "signServiceSign": "Abholung mit Namensschild",
    "signServiceFee": "+20 PLN zum Endpreis",
    "signServiceSelf": "Fahrer selbst auf dem Parkplatz finden",
    "signServiceSelfNote": "Der Fahrer kontaktiert dich per WhatsApp oder telefonisch und ihr trefft euch.",
    "signText": "Text für Namensschild",
    "signPlaceholder": "Text für das Abholschild",
    "signHelp": "Der Fahrer wartet mit einem Schild, bis Sie die Ankunftshalle verlassen.",
    "signPreview": "Schildvorschau:",
    "signEmpty": "Ihr Name erscheint hier",
    "flightNumber": "Flugnummer",
    "flightPlaceholder": "z. B. LO123",
    "passengers": "Anzahl der Passagiere",
    "passengersOptions": [
      "1 Person",
      "2 Personen",
      "3 Personen",
      "4 Personen",
      "5+ Personen"
    ],
    "largeLuggage": "Großes Gepäck",
    "luggageNo": "Nein",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktdaten",
    "fullName": "Vollständiger Name",
    "namePlaceholder": "Ihr Name",
    "phoneNumber": "Telefonnummer",
    "email": "E-Mail-Adresse",
    "emailPlaceholder": "ihre@email.com",
    "emailHelp": "Sie erhalten innerhalb von 5-10 Minuten eine Antwort",
    "notesTitle": "Zusätzliche Hinweise (optional)",
    "notesPlaceholder": "Besondere Wünsche oder zusätzliche Informationen...",
    "notesHelp": "Z. B. Kindersitz erforderlich, Wartezeit, besondere Anweisungen",
    "submitting": "Wird gesendet...",
    "formIncomplete": "Formular ausfüllen, um fortzufahren",
    "submit": "Angebotsanfrage senden"
  },
  "manageOrder": {
    "errors": {
      "load": "Bestellung konnte nicht geladen werden.",
      "loadNetwork": "Netzwerkfehler beim Laden der Bestellung.",
      "save": "Änderungen konnten nicht gespeichert werden.",
      "saveNetwork": "Netzwerkfehler beim Speichern der Änderungen.",
      "cancel": "Bestellung konnte nicht storniert werden.",
      "cancelNetwork": "Netzwerkfehler beim Stornieren der Bestellung.",
      "copySuccess": "In die Zwischenablage kopiert",
      "copyFail": "Kopieren in die Zwischenablage fehlgeschlagen",
      "emailRequired": "Bitte geben Sie Ihre E-Mail-Adresse ein."
    },
    "loading": "Ihre Bestellung wird geladen...",
    "accessTitle": "Buchung aufrufen",
    "accessBody": "Geben Sie die E-Mail-Adresse ein, die Sie bei der Buchung verwendet haben.",
    "accessPlaceholder": "sie@example.com",
    "accessAction": "Weiter",
    "accessChecking": "Prüfen...",
    "cancelledTitle": "Bestellung storniert",
    "cancelledBody": "Ihre Bestellung wurde storniert. Wenn dies ein Fehler war, erstellen Sie bitte eine neue Buchung.",
    "manageTitle": "Transfer verwalten",
    "copyAction": "Kopieren",
    "orderLabel": "Bestellung #",
    "orderIdLabel": "Bestell-ID",
    "detailsUpdatedTitle": "Details aktualisiert",
    "updateSubmittedTitle": "Aktualisierung gesendet",
    "updateSubmittedBody": "Ihre Aktualisierungsanfrage wurde gesendet. Wir prüfen sie und melden uns.",
    "awaiting": "Warten auf Bestätigung...",
    "transferRoute": "Transferstrecke",
    "priceLabel": "Preis:",
    "pricePending": "Preis wird individuell bestätigt",
    "taximeterTitle": "Price calculated by taximeter",
    "taximeterRates": "View taximeter rates",
    "tariff1": "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    "statusConfirmed": "Bestätigt",
    "statusCompleted": "Abgeschlossen",
    "statusFailed": "Nicht abgeschlossen",
    "statusRejected": "Abgelehnt",
    "statusPriceProposed": "Preis vorgeschlagen",
    "statusPending": "Ausstehend",
    "bookingDetails": "Buchungsdetails",
    "editDetails": "Details bearbeiten",
    "updateRequested": "Aktualisierung angeforderter Felder",
    "confirmedEditNote": "Das Bearbeiten einer bestätigten Bestellung sendet sie zur erneuten Bestätigung.",
    "updateFieldsNote": "Bitte aktualisieren Sie die markierten Felder und speichern Sie Ihre Änderungen.",
    "confirmedNote": "Diese Bestellung wurde bestätigt.",
    "completedNote": "Diese Bestellung wurde als abgeschlossen markiert.",
    "failedNote": "Diese Bestellung wurde als nicht abgeschlossen markiert.",
    "priceProposedNote": "Ein neuer Preis wurde vorgeschlagen. Bitte prüfen Sie Ihre E-Mail, um ihn anzunehmen oder abzulehnen.",
    "rejectedNote": "Diese Bestellung wurde abgelehnt. Bearbeitung ist deaktiviert, aber Sie können die Buchung stornieren.",
    "rejectionReasonLabel": "Grund:",
    "date": "Datum",
    "pickupTime": "Abholzeit",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "Der Fahrer kontaktiert dich per WhatsApp oder telefonisch und ihr trefft euch.",
    "signText": "Text für Namensschild",
    "flightNumber": "Flugnummer",
    "pickupAddress": "Abholadresse",
    "passengers": "Anzahl der Passagiere",
    "passengersBus": [
      "5 Personen",
      "6 Personen",
      "7 Personen",
      "8 Personen"
    ],
    "passengersStandard": [
      "1 Person",
      "2 Personen",
      "3 Personen",
      "4 Personen"
    ],
    "largeLuggage": "Großes Gepäck",
    "luggageNo": "Nein",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktdaten",
    "fullName": "Vollständiger Name",
    "phoneNumber": "Telefonnummer",
    "email": "E-Mail-Adresse",
    "notesTitle": "Zusätzliche Hinweise (optional)",
    "saveChanges": "Änderungen speichern",
    "cancelEdit": "Abbrechen",
    "editBooking": "Buchung bearbeiten",
    "cancelBooking": "Buchung stornieren",
    "changesNotice": "Änderungen werden per E-Mail bestätigt. Für dringende Änderungen kontaktieren Sie uns unter booking@taxiairportgdansk.com",
    "updateRequestNote": "Ihre Buchung wurde aktualisiert. Bitte prüfen und bestätigen Sie die Änderungen.",
    "rejectNote": "Diese Buchung wurde abgelehnt. Kontaktieren Sie den Support bei Fragen.",
    "cancelPromptTitle": "Buchung stornieren?",
    "cancelPromptBody": "Möchten Sie diese Buchung wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.",
    "confirmCancel": "Ja, stornieren",
    "keepBooking": "Buchung behalten",
    "copyOrderLabel": "Bestellung #",
    "copyOrderIdLabel": "Bestell-ID"
  },
  "adminOrders": {
    "title": "Admin-Bestellungen",
    "subtitle": "Alle aktuellen Bestellungen und Status.",
    "loading": "Bestellungen werden geladen...",
    "missingToken": "Admin-Token fehlt.",
    "errorLoad": "Bestellungen konnten nicht geladen werden.",
    "filters": {
      "all": "All",
      "active": "In progress",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "price_proposed": "Price proposed",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "columns": {
      "order": "Bestellung",
      "pickup": "Abholung",
      "customer": "Kunde",
      "price": "Preis",
      "status": "Status",
      "open": "Öffnen"
    },
    "empty": "Keine Bestellungen gefunden.",
    "view": "Ansehen"
  },
  "adminOrder": {
    "title": "Admin-Bestellungsdetails",
    "subtitle": "Verwalten, bestätigen oder ablehnen Sie diese Bestellung.",
    "back": "Zurück zu allen Bestellungen",
    "loading": "Bestellung wird geladen...",
    "missingToken": "Admin-Token fehlt.",
    "errorLoad": "Bestellung konnte nicht geladen werden.",
    "updated": "Bestellung aktualisiert.",
    "updateError": "Bestellung konnte nicht aktualisiert werden.",
    "statusUpdated": "Bestellstatus aktualisiert.",
    "updateRequestSent": "Aktualisierungsanfrage an den Kunden gesendet.",
    "updateRequestError": "Aktualisierungsanfrage konnte nicht gesendet werden.",
    "updateRequestSelect": "Wählen Sie mindestens ein Feld zur Aktualisierung aus.",
    "orderLabel": "Bestellung",
    "idLabel": "ID",
    "customerLabel": "Kunde",
    "pickupLabel": "Abholung",
    "priceLabel": "Preis",
    "additionalInfo": "Zusätzliche Informationen",
    "passengers": "Passagiere:",
    "largeLuggage": "Großes Gepäck:",
    "pickupType": "Abholart:",
    "signService": "Abholservice:",
    "signServiceSign": "Abholung mit Namensschild",
    "signServiceSelf": "Fahrer selbst finden",
    "signFee": "Aufpreis für Schild:",
    "flightNumber": "Flugnummer:",
    "signText": "Text für Namensschild:",
    "route": "Route:",
    "notes": "Notizen:",
    "adminActions": "Admin-Aktionen",
    "confirmOrder": "Bestellung bestätigen",
    "rejectOrder": "Bestellung ablehnen",
    "proposePrice": "Neuen Preis vorschlagen (PLN)",
    "sendPrice": "Preisvorschlag senden",
    "rejectionReason": "Ablehnungsgrund (optional)",
    "requestUpdate": "Kunden-Update anfordern",
    "requestUpdateBody": "Wählen Sie die Felder, die der Kunde aktualisieren soll. Er erhält eine E-Mail mit einem Link zur Bearbeitung.",
    "fieldPhone": "Telefonnummer",
    "fieldEmail": "E-Mail-Adresse",
    "fieldFlight": "Flugnummer",
    "requestUpdateAction": "Update anfordern",
    "cancelConfirmedTitle": "Confirmed order cancellation",
    "cancelConfirmedBody": "Send a cancellation email due to lack of taxi availability at the requested time.",
    "cancelConfirmedAction": "Cancel confirmed order",
    "cancelConfirmedConfirm": "Cancel this confirmed order and notify the customer?",
    "cancelConfirmedSuccess": "Order cancelled.",
    "deleteRejectedTitle": "Delete rejected order",
    "deleteRejectedBody": "Remove this rejected order permanently.",
    "deleteRejectedAction": "Delete rejected order",
    "deleteRejectedConfirm": "Delete this rejected order permanently?",
    "deleteRejectedSuccess": "Order deleted.",
    "completionTitle": "Status der Durchführung",
    "markCompleted": "Als abgeschlossen markieren",
    "markCompletedConfirm": "Mark this order as completed?",
    "markFailed": "Als nicht abgeschlossen markieren",
    "markFailedConfirm": "Mark this order as not completed?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Gdańsk Flughafen Taxi",
      "description": "Buchen Sie ein schnelles, zuverlässiges Flughafentaxi vom Flughafen Gdańsk. Festpreise in beide Richtungen, professionelle Fahrer und schnelle Bestätigung.",
      "route": "Flughafen Gdańsk",
      "examples": [
        "Altstadt Gdańsk",
        "Gdańsk Oliwa",
        "Gdańsk Hauptbahnhof",
        "Brzeźno Strand"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Transfer vom Flughafen Gdańsk nach Sopot",
      "description": "Privater Transfer zwischen dem Flughafen Gdańsk und Sopot mit Festpreisen in beide Richtungen und Flugverfolgung.",
      "route": "Flughafen Gdańsk ↔ Sopot",
      "examples": [
        "Sopot Pier",
        "Sopot Zentrum",
        "Hotels in Sopot",
        "Bahnhof Sopot"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Transfer vom Flughafen Gdańsk nach Gdynia",
      "description": "Komfortabler Transfer zwischen dem Flughafen Gdańsk und Gdynia mit Festpreisen in beide Richtungen.",
      "route": "Flughafen Gdańsk ↔ Gdynia",
      "examples": [
        "Gdynia Zentrum",
        "Hafen Gdynia",
        "Hotels in Gdynia",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
};
const de$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: de
}, Symbol.toStringTag, { value: "Module" }));
const fi = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Varaa WhatsAppissa",
    "progress": "Edistyminen",
    "stepCounter": (current, total) => `Vaihe ${current}/${total}`,
    "remainingFields": (count) => `Jäljellä ${count} kenttää`,
    "orderOnlineNow": "Varaa taksi verkossa",
    "callNow": "Soita nyt",
    "orderNow": "Varaa nyt",
    "continue": "Jatka",
    "back": "Takaisin",
    "optional": "valinnainen",
    "close": "Sulje",
    "noPrepayment": "Ei ennakkomaksua",
    "backToHome": "← Takaisin etusivulle",
    "notFoundTitle": "Sivua ei löytynyt",
    "notFoundBody": "Etsimäsi sivu ei ole olemassa tai se on siirretty.",
    "notFoundCta": "Siirry etusivulle",
    "notFoundSupport": "Jos tämä on virhe, ota yhteyttä:",
    "notFoundRequested": "Pyydetty URL-osoite",
    "notFoundPopular": "Suositut sivut",
    "actualBadge": "VOIMASSA",
    "priceFrom": "alkaen",
    "perNight": "yöllä",
    "perDay": "keskustaan (päivä)",
    "whatsappMessage": "Hei Taxi Airport Gdańsk, haluan varata kuljetuksen."
  },
  "navbar": {
    "home": "Etusivu",
    "fleet": "Kalustomme",
    "airportTaxi": "Gdańskin lentokenttätaksi",
    "airportSopot": "Lentokenttä ↔ Sopot",
    "airportGdynia": "Lentokenttä ↔ Gdynia",
    "prices": "Hinnat",
    "orderNow": "VARAA NYT",
    "language": "Kieli"
  },
  "hero": {
    "promo": {
      "dayPrice": "VAIN 100 PLN",
      "dayLabel": "keskustaan (päivä)",
      "nightPrice": "120 PLN",
      "nightLabel": "yöllä"
    },
    "logoAlt": "Taxi Airport Gdańsk - Lentokenttäkuljetus & limusiinipalvelu",
    "orderViaEmail": "Tilaa sähköpostilla",
    "headline": "Gdańsk lentokenttä taksi – kuljetukset Gdańskiin, Sopotiin ja Gdyniaan",
    "subheadline": "Gdansk airport taxi, kiinteät hinnat, 24/7 palvelu ja nopea vahvistus.",
    "whyChoose": "Miksi valita Taxi Airport Gdańsk",
    "benefits": "Edut",
    "benefitsList": {
      "flightTrackingTitle": "Lentojen seuranta",
      "flightTrackingBody": "Seuraamme saapumisia ja säädämme noutoajan automaattisesti.",
      "meetGreetTitle": "Meet & greet",
      "meetGreetBody": "Ammattikuljettajat, selkeä viestintä ja apu matkatavaroiden kanssa.",
      "fastConfirmationTitle": "Nopea vahvistus",
      "fastConfirmationBody": "Useimmat varaukset vahvistetaan 5–10 minuutissa.",
      "flexiblePaymentsTitle": "Joustavat maksut",
      "flexiblePaymentsBody": "Kortti, Apple Pay, Google Pay, Revolut tai käteinen.",
      "freePrebookingTitle": "Maksuton ennakkovaraus",
      "freePrebookingBody": "Peruuta milloin tahansa maksutta. Täysin automatisoitu.",
      "fixedPriceTitle": "Kiinteän hinnan takuu",
      "fixedPriceBody": "Kiinteä hinta molempiin suuntiin. Varaushinta on lopullinen.",
      "localExpertiseTitle": "Paikallinen osaaminen",
      "localExpertiseBody": "Kokeneet Tri-City-kuljettajat ja nopeat reitit.",
      "assistanceTitle": "24/7 tuki",
      "assistanceBody": "Saatavilla ennen matkaa, sen aikana ja sen jälkeen."
    },
    "fleetTitle": "Kalustomme",
    "fleetLabel": "Ajoneuvot",
    "standardCarsTitle": "Perusautot",
    "standardCarsBody": "1-4 matkustajaa | Mukavat sedanit ja SUV:t",
    "busTitle": "Ja lisää busseja",
    "busBody": "5-8 matkustajaa | Täydellinen suuremmille ryhmille"
  },
  "vehicle": {
    "title": "Valitse ajoneuvo",
    "subtitle": "Valitse ryhmällesi sopivin ajoneuvo",
    "standardTitle": "Perusauto",
    "standardPassengers": "1-4 matkustajaa",
    "standardDescription": "Sopii yksin matkustaville, pariskunnille ja pienille perheille",
    "busTitle": "BUS-palvelu",
    "busPassengers": "5-8 matkustajaa",
    "busDescription": "Ihanteellinen suuremmille ryhmille ja perheille, joilla on paljon matkatavaroita",
    "selfManageBadge": "Muokkaa tai peruuta varauksesi itse",
    "examplePrices": "Esimerkkihinnat:",
    "airportGdansk": "Lentokenttä ↔ Gdańsk",
    "airportSopot": "Lentokenttä ↔ Sopot",
    "airportGdynia": "Lentokenttä ↔ Gdynia",
    "selectStandard": "Valitse perusauto",
    "selectBus": "Valitse BUS-palvelu"
  },
  "pricing": {
    "back": "Takaisin ajoneuvovalintaan",
    "titleStandard": "Perusauto (1-4 matkustajaa)",
    "titleBus": "BUS-palvelu (5-8 matkustajaa)",
    "description": "Kiinteät hinnat molempiin suuntiin (kentälle ja kentältä). Ei piilokuluja. Yötaksa klo 22–6 sekä sunnuntaisin ja pyhäpäivinä.",
    "directionFromAirport": "Lentoasemalta",
    "directionToAirport": "Lentoasemalle",
    "dayRate": "Päivätaksa",
    "nightRate": "Yötaksa",
    "sundayNote": "(Sunnuntai & pyhäpäivät)",
    "customRouteTitle": "Mukautettu reitti",
    "customRouteBody": "Tarvitsetko toisen kohteen?",
    "customRoutePrice": "Kiinteat hinnat",
    "customRoutePriceBody": "Joustava hinnoittelu reitin mukaan",
    "customRouteAutoNote": "Laskuri arvioi hinnan, kun olet syöttänyt osoitteet.",
    "requestQuote": "Varaa nyt",
    "pricesNote": "Hinnat sisältävät ALV:n. Lisäkohteet pyynnöstä.",
    "tableTitle": "Hintataulukko",
    "tableRoute": "Reitti",
    "tableStandardDay": "Standardi päivä",
    "tableStandardNight": "Standardi yö",
    "tableBusDay": "Bussi päivä",
    "tableBusNight": "Bussi yö",
    "tariffsTitle": "Taksamittaritariffit (mukautetut reitit)",
    "tariffsName": "Tariffi",
    "tariffsRate": "Hinta",
    "bookingTitle": "Varaa kyyti",
    "bookingSubtitle": "Valitse ajoneuvotyyppi ja varaa kyyti heti.",
    "routes": {
      "airport": "Lentokenttä",
      "gdansk": "Gdańskin keskusta",
      "gdynia": "Gdynian keskusta"
    }
  },
  "pricingLanding": {
    "title": "Gdańsk-lentokenttätaksin hinnat",
    "subtitle": "Kiinteät hinnat lentokenttäkuljetuksille ja selkeä hinnoittelu mukautetuille reiteille.",
    "description": "Vertaile perus- ja bussihintoja, varaa heti tai pyydä tarjous.",
    "cta": "Varaa kyyti",
    "calculatorCta": "Laskuri",
    "highlights": [
      {
        "title": "Kiinteät hinnat molempiin suuntiin",
        "body": "Listatut kenttäreitit ovat kiinteähintaisia ilman piilokuluja."
      },
      {
        "title": "24/7 saatavilla",
        "body": "Palvelemme joka päivä, nopea vahvistus ja tuki."
      },
      {
        "title": "Bussipalvelu ryhmille",
        "body": "Tilavat 5–8 paikan ajoneuvot perheille ja ryhmille."
      }
    ],
    "faqTitle": "Hinnoittelun FAQ",
    "faq": [
      {
        "question": "Ovatko hinnat kiinteät?",
        "answer": "Kyllä. Lentokenttäreiteillä on kiinteät hinnat molempiin suuntiin. Mukautetut reitit hinnoitellaan yksilöllisesti."
      },
      {
        "question": "Milloin yötaksa on voimassa?",
        "answer": "22:00–6:00 sekä sunnuntaisin ja pyhäpäivinä."
      },
      {
        "question": "Seuraatteko lennon viivästyksiä?",
        "answer": "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
      },
      {
        "question": "Voinko maksaa kortilla?",
        "answer": "Korttimaksu pyynnöstä. Laskut yritysasiakkaille."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Hintalaskuri",
    "subtitle": "Syötä nouto ja määränpää saadaksesi hinta-arvion.",
    "airportLabel": "Gdańsk-lentoasema",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Nouto osoitteesta",
    "destinationCustomLabel": "Määränpää osoite",
    "pickupLabel": "Noutopaikka",
    "pickupPlaceholder": "esim. Gdańsk Airport, Słowackiego 200",
    "destinationLabel": "Määränpää",
    "destinationPlaceholder": "esim. Sopot, Monte Cassino 1",
    "distanceLabel": "Etäisyys",
    "resultsTitle": "Arvioitu hinta",
    "fixedAllDay": "Koko päivän hinta",
    "dayRate": "Päivähinta",
    "nightRate": "Yöhinta",
    "dayRateLabel": "Päivähinta",
    "allDayRateLabel": "Vuorokausihinta",
    "guaranteedPriceLabel": "Taattu hinta",
    "standard": "Standard",
    "bus": "Bussi",
    "loading": "Lasketaan reittiä...",
    "noResult": "Reittiä ei voitu laskea. Kokeile tarkempaa osoitetta.",
    "longRouteTitle": "Pitkän reitin arvio",
    "taximeterLabel": "Taksamittari",
    "proposedLabel": "Ehdotettu hinta",
    "savingsLabel": "Säästö",
    "orderNow": "Varaa nyt",
    "note": "Hinnat ovat kiinteät. Voit ehdottaa toista hintaa toisen reitin tilauslomakkeessa."
  },
  "trust": {
    "googleReviewsTitle": "Google-arvostelut",
    "googleReviewsCta": "Katso arvostelut",
    "googleReviewsCountLabel": "arvostelua",
    "companyTitle": "Yritystiedot",
    "paymentTitle": "Maksu & laskut",
    "comfortTitle": "Mukavuus & turvallisuus",
    "paymentBody": "Maksa käteisellä tai kortilla. Lasku saatavilla yritysasiakkaille.",
    "comfortBody": "Lastenistuimet pyynnöstä. Ammattitaitoiset, lisensoidut kuljettajat ja ovelta ovelle -palvelu."
  },
  "trustBar": {
    "ariaLabel": "Luottamussignaalit",
    "instantConfirmation": "Nopea vahvistus",
    "meetGreetOptional": "Meet & greet valinnainen",
    "noPrepayment": "Ei ennakkomaksua",
    "supportWhatsappEmail": "Tuki: WhatsApp ja sähköposti",
    "vatInvoice": "ALV-lasku"
  },
  "footer": {
    "description": "Ammattimainen lentokenttäkuljetus Tri-City-alueella. Saatavilla 24/7.",
    "contactTitle": "Yhteys",
    "location": "Gdańsk, Puola",
    "bookingNote": "Varaa verkossa, WhatsAppissa tai sähköpostilla",
    "hoursTitle": "Palveluajat",
    "hoursBody": "24/7 - saatavilla joka päivä",
    "hoursSub": "Kenttäkuljetukset, kaupunkikuljetukset ja räätälöidyt reitit",
    "routesTitle": "Suositut reitit",
    "rights": "Kaikki oikeudet pidätetään.",
    "cookiePolicy": "Evästekäytäntö",
    "privacyPolicy": "Tietosuojakäytäntö"
  },
  "cookieBanner": {
    "title": "Evästeasetukset",
    "body": "Käytämme välttämättömiä evästeitä pitääksemme varausprosessin turvallisena ja luotettavana. Suostumuksellasi käytämme myös markkinointievästeitä mainoskonversioiden mittaamiseen. Voit muuttaa valintaa tyhjentämällä selaimen tallennustilan.",
    "readPolicy": "Lue käytäntö",
    "decline": "Hylkää",
    "accept": "Hyväksy evästeet"
  },
  "cookiePolicy": {
    "title": "Evästekäytäntö",
    "updated": "Päivitetty: 2. tammikuuta 2026",
    "intro": "Tämä sivusto käyttää evästeitä, jotta se toimii luotettavasti ja varauksesi pysyy turvallisena. Suostumuksellasi käytämme myös markkinointievästeitä konversioiden mittaamiseen.",
    "sectionCookies": "Mitä evästeitä käytämme",
    "cookiesList": [
      "Välttämättömät evästeet turvallisuuteen ja väärinkäytösten ehkäisyyn.",
      "Asetusevästeet perusvalintojen muistamiseen istunnon aikana.",
      "Markkinointievästeet mainoskonversioiden mittaamiseen (Google Ads)."
    ],
    "sectionManage": "Evästeiden hallinta",
    "manageBody1": "Voit poistaa evästeet milloin tahansa selaimen asetuksista. Välttämättömien evästeiden esto voi estää varauslomakkeen ja hallinnan toiminnan.",
    "manageBody2": "Voit myös muuttaa markkinointievästeiden valintaa tyhjentämällä selaimen tallennustilan ja palaamalla sivustolle.",
    "contact": "Yhteys",
    "contactBody": "Jos sinulla on kysyttävää tästä käytännöstä, ota yhteyttä"
  },
  "privacyPolicy": {
    "title": "Tietosuojakäytäntö",
    "updated": "Päivitetty: 2. tammikuuta 2026",
    "intro": "Tämä tietosuojakäytäntö selittää, miten Taxi Airport Gdańsk kerää ja käsittelee henkilötietoja varauspalveluiden ja sivuston käytön yhteydessä.",
    "controllerTitle": "Rekisterinpitäjä",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Puola\nSähköposti:",
    "dataTitle": "Mitä tietoja keräämme",
    "dataList": [
      "Yhteystiedot kuten nimi, sähköpostiosoite ja puhelinnumero.",
      "Varaustiedot kuten noutopaikka, päivämäärä, aika, lennon numero ja muistiinpanot.",
      "Tekniset tiedot kuten IP-osoite ja selaimen perustiedot turvallisuutta varten."
    ],
    "whyTitle": "Miksi käsittelemme tietojasi",
    "whyList": [
      "Vastataksemme varaustoiveeseesi ja toimittaaksemme palvelun.",
      "Kommunikoidaksemme varauksesta, muutoksista tai peruutuksista.",
      "Noudattaaksemme lakisääteisiä velvoitteita ja ehkäistäksemme väärinkäytöksiä."
    ],
    "legalTitle": "Oikeusperuste",
    "legalList": [
      "Sopimuksen täyttäminen (GDPR Art. 6(1)(b)).",
      "Lakisääteinen velvoite (GDPR Art. 6(1)(c)).",
      "Oikeutettu etu (GDPR Art. 6(1)(f)), kuten turvallisuus ja petosten ehkäisy."
    ],
    "storageTitle": "Kuinka kauan säilytämme tietoja",
    "storageBody": "Säilytämme varaustietoja vain niin kauan kuin palvelun tarjoaminen ja lakisääteiset vaatimukset edellyttävät.",
    "shareTitle": "Kenelle jaamme tietoja",
    "shareBody": "Jaamme tietoja vain palveluntarjoajille, jotka ovat välttämättömiä varauksen toimittamiseen (esim. sähköpostipalvelut). Emme myy henkilötietoja.",
    "rightsTitle": "Oikeutesi",
    "rightsList": [
      "Oikeus saada pääsy tietoihin, oikaista tai poistaa ne.",
      "Oikeus rajoittaa tai vastustaa käsittelyä.",
      "Oikeus siirtää tiedot, soveltuvin osin.",
      "Oikeus tehdä valitus valvontaviranomaiselle."
    ],
    "contactTitle": "Yhteys",
    "contactBody": "Tietosuojaan liittyvissä pyynnöissä ota yhteyttä"
  },
  "routeLanding": {
    "orderNow": "Varaa verkossa nyt",
    "quickLinks": "Pikalinkit",
    "pricingLink": "Katso hinnat",
    "orderLinks": {
      "airportGdansk": "Varaa lentokenttä → Gdańsk",
      "airportSopot": "Varaa lentokenttä → Sopot",
      "airportGdynia": "Varaa lentokenttä → Gdynia",
      "custom": "Mukautettu reitti"
    },
    "pricingTitle": "Esimerkkihinnat",
    "vehicleLabel": "Perusauto",
    "dayLabel": "Päivätaksa",
    "nightLabel": "Yötaksa",
    "currency": "PLN",
    "pricingNote": "Hinnat sisältävät ALV:n. Yötaksa on voimassa klo 22–6 sekä sunnuntaisin ja pyhäpäivinä.",
    "includedTitle": "Mitä sisältyy",
    "includedList": [
      "Meet & greet lentokentällä selkeillä nouto-ohjeilla.",
      "Lentojen seuranta ja joustava noutoaika.",
      "Kiinteä hinnoittelu molempiin suuntiin ilman piilokuluja.",
      "Ammattikuljettajat, englanninkielinen palvelu."
    ],
    "destinationsTitle": "Suositut kohteet",
    "faqTitle": "UKK",
    "faq": [
      {
        "question": "Kuinka nopeasti vahvistus tulee?",
        "answer": "Useimmat varaukset vahvistetaan 5–10 minuutissa sähköpostitse."
      },
      {
        "question": "Seuraatteko lentoja?",
        "answer": "Kyllä, seuraamme saapumisia ja säädämme noutoaikaa."
      },
      {
        "question": "Voinko peruuttaa?",
        "answer": "Voit peruuttaa vahvistusviestin linkistä."
      },
      {
        "question": "Tarjoatteko lastenistuimia?",
        "answer": "Kyllä, lastenistuimet ovat saatavilla pyynnöstä varauksen yhteydessä."
      },
      {
        "question": "Miten voin maksaa?",
        "answer": "Voit maksaa kortilla, Apple Paylla, Google Paylla, Revolutilla tai käteisellä pyynnöstä."
      },
      {
        "question": "Missä tapaan kuljettajan?",
        "answer": "Saat selkeät nouto-ohjeet ja yhteystiedot vahvistusviestissä."
      }
    ]
  },
  "countryLanding": {
    "title": "Gdańskin lentokenttäkuljetus Suomesta",
    "description": "Yksityinen lentokenttäkuljetus Gdańskissa kiinteillä hinnoilla, 24/7 nouto ja nopea vahvistus.",
    "intro": "Sopii lennoille Suomesta Gdańskin lentoasemalle (GDN). Varaa verkossa ja saat vahvistuksen nopeasti.",
    "ctaPrimary": "Varaa kuljetus",
    "ctaSecondary": "Katso hinnat",
    "highlightsTitle": "Miksi varata etukäteen",
    "highlights": [
      "Meet & greet ja selkeät nouto-ohjeet.",
      "Lentojen seuranta ja joustava noutoaika.",
      "Kiinteät hinnat ilman piilokuluja.",
      "Maksu kortilla, Apple Paylla, Google Paylla, Revolutilla tai pyynnöstä käteisellä."
    ],
    "airportsTitle": "Lähtölentoasemia (Suomi)",
    "airports": [
      "Helsinki (HEL)",
      "Turku (TKU)"
    ],
    "faqTitle": "FAQ suomalaisille",
    "faq": [
      {
        "question": "Voinko maksaa euroilla?",
        "answer": "Hinnat ovat PLN-valuutassa. Korttimaksu muunnetaan automaattisesti pankkisi toimesta."
      },
      {
        "question": "Saisinko kuitin tai laskun?",
        "answer": "Kyllä, kerro tästä varauksen yhteydessä ja lähetämme kuitin sähköpostilla."
      },
      {
        "question": "Seuraatteko lentoja?",
        "answer": "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
      },
      {
        "question": "Kuinka nopeasti saan vahvistuksen?",
        "answer": "Useimmat varaukset vahvistetaan 5–10 minuutissa sähköpostitse."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Varaa kuljetus",
    "ctaSecondary": "Katso hinnat",
    "highlightsTitle": "Miksi varata etukäteen",
    "highlights": [
      "Meet & greet ja selkeät nouto-ohjeet.",
      "Lentojen seuranta ja joustava noutoaika.",
      "Kiinteät hinnat ilman piilokuluja.",
      "Maksu kortilla, Apple Paylla, Google Paylla, Revolutilla tai pyynnöstä käteisellä."
    ],
    "destinationsTitle": "Suositut kohteet Tri-Cityssä",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Onko suoria lentoja {city}stä Gdańskiin?",
        "answer": "Suorat lennot ovat kausiluonteisia. Tarkista ajantasainen aikataulu ennen matkaa."
      },
      {
        "question": "Miten tapaan kuljettajan?",
        "answer": "Saat nouto-ohjeet ja yhteystiedot vahvistussähköpostissa."
      },
      {
        "question": "Seuraatteko lentoja?",
        "answer": "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
      },
      {
        "question": "Voinko maksaa kortilla?",
        "answer": "Kyllä, korttimaksu on mahdollinen. Käteinen pyynnöstä."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Kiinteät hinnat ja 24/7 saatavuus.",
    "intro": "Taxi Gdańsk lentokenttäkuljetuksiin ja kaupunkiajoihin. Ammattikuljettajat, nopea vahvistus ja selkeä hinnoittelu.",
    "ctaPrimary": "Varaa taxi",
    "ctaSecondary": "Katso hinnat",
    "highlightsTitle": "Miksi varata meiltä",
    "highlights": [
      "Kiinteät hinnat ilman piilokuluja.",
      "Saatavuus 24/7 lentokenttä- ja kaupunkiajoihin.",
      "Lentojen seuranta ja joustava noutoaika.",
      "Maksu kortilla, Apple Paylla, Google Paylla, Revolutilla tai pyynnöstä käteisellä."
    ],
    "serviceAreaTitle": "Palvelualue",
    "serviceArea": [
      "Gdańsk vanhakaupunki ja keskusta",
      "Gdańsk Wrzeszcz ja Oliwa",
      "Gdańsk lentokenttä (GDN)",
      "Sopot ja Gdynia"
    ],
    "routesTitle": "Suositut taksireitit",
    "routes": [
      "Gdańsk lentokenttä → vanhakaupunki",
      "Gdańsk lentokenttä → Sopot",
      "Gdańsk lentokenttä → Gdynia",
      "Vanhakaupunki → Gdańsk lentokenttä"
    ],
    "cityRoutesTitle": "Hinnat: Gdańskin lentoasema taksi",
    "cityRoutesDescription": "Katso ajantasainen hinta Gdańskin lentoasemalta näihin kohteisiin.",
    "cityRoutesItem": (destination) => `Gdańskin lentoasema → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Kuinka nopeasti vahvistus tulee?",
        "answer": "Useimmat varaukset vahvistetaan 5–10 minuutissa sähköpostitse."
      },
      {
        "question": "Onko hinnat kiinteitä?",
        "answer": "Kyllä, lentokenttäreiteillä on kiinteät hinnat molempiin suuntiin."
      },
      {
        "question": "Voinko maksaa kortilla?",
        "answer": "Kyllä, korttimaksu on mahdollinen. Käteinen pyynnöstä."
      },
      {
        "question": "Seuraatteko lentoja?",
        "answer": "Kyllä, seuraamme saapumisia ja säädämme noutoajan."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Syötä kelvollinen puhelinnumero (vain numeroita).",
      "phoneLength": "Syötä kelvollinen puhelinnumero (7–15 numeroa, valinnainen +).",
      "emailRequired": "Syötä sähköpostiosoite.",
      "email": "Syötä kelvollinen sähköpostiosoite.",
      "datePast": "Valitse tämän päivän tai tuleva päivämäärä.",
      "timePast": "Valitse nykyinen tai tuleva kellonaika.",
      "timeSoon": "Valitse aika, joka on vähintään 40 minuuttia tästä hetkestä."
    },
    "rate": {
      "day": "Päivätaksa",
      "night": "Yötaksa",
      "reasonDay": "vakiopäivätaksa",
      "reasonLate": "nouto klo 21:30 jälkeen tai ennen 5:30",
      "reasonHoliday": "sunnuntai/pyhäpäivä",
      "banner": (label, price, reason) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Tilauksen lähetys epäonnistui. Yritä uudelleen.",
    "submitNetworkError": "Verkkovirhe tilausta lähetettäessä. Yritä uudelleen.",
    "submittedTitle": "Tilaus vastaanotettu",
    "submittedBody": "Kiitos! Pyyntösi on jonossa. Odota vahvistusta – yleensä 5–10 minuuttia. Saat pian vahvistussähköpostin.",
    "awaiting": "Odotetaan vahvistusta...",
    "totalPrice": "Kokonaishinta:",
    "orderNumber": "Tilaus #:",
    "orderId": "Tilaus-ID:",
    "manageLink": "Hallitse tai muokkaa tilausta",
    "title": "Tilaa kuljetus",
    "date": "Päivämäärä",
    "pickupTime": "Noutoaika",
    "pickupType": "Noutotyyppi",
    "pickupTypeHint": "Valitse noutotyyppi jatkaaksesi.",
    "airportPickup": "Nouto lentokentältä",
    "addressPickup": "Nouto osoitteesta",
    "signServiceTitle": "Nouto saapumisalueelta",
    "signServiceSign": "Nouto nimikyltillä",
    "signServiceFee": "+20 PLN lisätään loppuhintaan",
    "signServiceSelf": "Löydän kuljettajan itse pysäköintialueelta",
    "signServiceSelfNote": "Kuljettaja ottaa yhteyttä WhatsAppissa tai puhelimitse ja tapaatte.",
    "signText": "Nimikyltti",
    "signPlaceholder": "Teksti noutokylttiin",
    "signHelp": "Kuljettaja odottaa sinua kyltti kädessä, kunnes poistut saapuvien aulasta",
    "signPreview": "Kylttiesikatselu:",
    "signEmpty": "Nimesi näkyy tässä",
    "flightNumber": "Lennon numero",
    "flightPlaceholder": "esim. LO123",
    "flightUnknown": "En tiedä lentonumeroa vielä",
    "pickupAddress": "Nouto-osoite",
    "pickupPlaceholder": "Syötä täydellinen nouto-osoite",
    "passengers": "Matkustajien määrä",
    "passengersBus": [
      "5 henkilöä",
      "6 henkilöä",
      "7 henkilöä",
      "8 henkilöä"
    ],
    "passengersStandard": [
      "1 henkilö",
      "2 henkilöä",
      "3 henkilöä",
      "4 henkilöä"
    ],
    "largeLuggage": "Suuret matkatavarat",
    "luggageNo": "Ei",
    "luggageYes": "Kyllä",
    "contactTitle": "Yhteystiedot",
    "fullName": "Koko nimi",
    "namePlaceholder": "Nimesi",
    "phoneNumber": "Puhelinnumero",
    "email": "Sähköpostiosoite",
    "emailPlaceholder": "sinun@email.com",
    "emailHelp": "Saat vahvistusviestin linkillä tilausten muokkaukseen tai peruutukseen",
    "notesTitle": "Lisätiedot (valinnainen)",
    "notesPlaceholder": "Erityispyynnöt tai lisätiedot...",
    "notesHelp": "Esim. lastenistuin, odotusaika, erityisohjeet",
    "submitting": "Lähetetään...",
    "formIncomplete": "Täytä lomake jatkaaksesi",
    "confirmOrder": (price) => `Vahvista tilaus (${price} PLN)`,
    "reassurance": "Ei ennakkomaksua. Ilmainen peruutus. Vahvistus 5–10 min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Syötä kelvollinen puhelinnumero (vain numeroita).",
      "phoneLength": "Syötä kelvollinen puhelinnumero (7–15 numeroa, valinnainen +).",
      "email": "Syötä kelvollinen sähköpostiosoite.",
      "datePast": "Valitse tämän päivän tai tuleva päivämäärä.",
      "timePast": "Valitse nykyinen tai tuleva kellonaika.",
      "timeSoon": "Valitse aika, joka on vähintään 40 minuuttia tästä hetkestä."
    },
    "submitError": "Tarjouspyynnön lähetys epäonnistui. Yritä uudelleen.",
    "submitNetworkError": "Verkkovirhe tarjouspyyntöä lähetettäessä. Yritä uudelleen.",
    "submittedTitle": "Tarjouspyyntö vastaanotettu!",
    "submittedBody": "Kiitos! Saat 5-10 minuutin kuluessa sähköpostin, jossa kerrotaan hyväksynnästä tai hylkäyksestä.",
    "manageLink": "Hallitse tilausta",
    "title": "Pyydä yksilöllinen tarjous",
    "subtitle": "Ehdota hintaa ja saat vastauksen 5-10 minuutissa",
    "requestButton": "Pyydä tarjous",
    "requestAnother": "Pyydä uusi tarjous",
    "toggleDescription": "Anna matkan tiedot ja ehdota hintaa. Saat vastauksen 5-10 minuutissa sähköpostilla.",
    "pickupType": "Noutotyyppi",
    "airportPickup": "Nouto lentokentältä",
    "addressPickup": "Nouto osoitteesta",
    "lockMessage": "Valitse noutotyyppi avataksesi loput lomakkeesta.",
    "pickupAddress": "Nouto-osoite",
    "pickupPlaceholder": "Syötä nouto-osoite (esim. Gdańsk Airport, ul. Słowackiego 200)",
    "pickupAutoNote": "Lentokentän noutopaikka asetetaan automaattisesti",
    "destinationAddress": "Kohdeosoite",
    "destinationPlaceholder": "Syötä kohdeosoite (esim. Gdańsk Centrum, ul. Długa 1)",
    "price": "Hinta",
    "proposedPriceLabel": "Ehdottamasi hinta (PLN)",
    "taximeterTitle": "Enter the address to see the price. If it doesn't fit, propose your own.",
    "tariff1": "Tariffi 1 (kaupunki, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariffi 2 (kaupunki, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariffi 3 (kaupungin ulkopuolella, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariffi 4 (kaupungin ulkopuolella, 22–6): 11.70 PLN/km.",
    "autoPriceNote": "Laskuri arvioi hinnan, kun olet syöttänyt osoitteet.",
    "fixedPriceHint": "Jos haluat ehdottaa kiinteää hintaa, klikkaa tästä ja täytä kenttä.",
    "pricePlaceholder": "Syötä tarjous PLN (esim. 150)",
    "priceHelp": "Ehdota hintaa tälle matkalle. Tarkistamme ja vastaamme 5-10 minuutissa.",
    "fixedRouteChecking": "Checking if this route qualifies for a fixed price...",
    "fixedRouteTitle": "Fixed price available",
    "fixedRouteDistance": (distance) => `Distance: ${distance} km`,
    "fixedRouteComputed": (price) => `${price} PLN`,
    "fixedRouteCta": "Book fixed price",
    "fixedRouteHint": "Use the fixed-price booking for the fastest confirmation.",
    "fixedRouteAllDay": "All-day rate applies",
    "fixedRouteDay": "Day rate applies",
    "fixedRouteNight": "Night rate applies",
    "fixedRouteLocked": "This route qualifies for a fixed price. Please book via the fixed-price form.",
    "longRouteTitle": "Long route estimate",
    "longRouteDistance": (distance) => `Distance: ${distance} km`,
    "longRouteTaximeter": (price, rate) => `Taximeter: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price) => `Proposed price: ${price} PLN`,
    "longRouteSavings": (percent) => `Savings: ${percent}%`,
    "longRouteNote": "You can still enter your own price below.",
    "date": "Päivämäärä",
    "pickupTime": "Noutoaika",
    "signServiceTitle": "Nouto saapumisalueelta",
    "signServiceSign": "Nouto nimikyltillä",
    "signServiceFee": "+20 PLN lisätään loppuhintaan",
    "signServiceSelf": "Löydän kuljettajan itse pysäköintialueelta",
    "signServiceSelfNote": "Kuljettaja ottaa yhteyttä WhatsAppissa tai puhelimitse ja tapaatte.",
    "signText": "Nimikyltti",
    "signPlaceholder": "Teksti noutokylttiin",
    "signHelp": "Kuljettaja odottaa sinua kyltti kädessä, kunnes poistut saapuvien aulasta",
    "signPreview": "Kylttiesikatselu:",
    "signEmpty": "Nimesi näkyy tässä",
    "flightNumber": "Lennon numero",
    "flightPlaceholder": "esim. LO123",
    "passengers": "Matkustajien määrä",
    "passengersOptions": [
      "1 henkilö",
      "2 henkilöä",
      "3 henkilöä",
      "4 henkilöä",
      "5+ henkilöä"
    ],
    "largeLuggage": "Suuret matkatavarat",
    "luggageNo": "Ei",
    "luggageYes": "Kyllä",
    "contactTitle": "Yhteystiedot",
    "fullName": "Koko nimi",
    "namePlaceholder": "Nimesi",
    "phoneNumber": "Puhelinnumero",
    "email": "Sähköpostiosoite",
    "emailPlaceholder": "sinun@email.com",
    "emailHelp": "Saat vastauksen 5-10 minuutissa",
    "notesTitle": "Lisätiedot (valinnainen)",
    "notesPlaceholder": "Erityispyynnöt tai lisätiedot...",
    "notesHelp": "Esim. lastenistuin, odotusaika, erityisohjeet",
    "submitting": "Lähetetään...",
    "formIncomplete": "Täytä lomake jatkaaksesi",
    "submit": "Lähetä tarjouspyyntö"
  },
  "manageOrder": {
    "errors": {
      "load": "Tilausta ei voitu ladata.",
      "loadNetwork": "Verkkovirhe tilausta ladattaessa.",
      "save": "Muutoksia ei voitu tallentaa.",
      "saveNetwork": "Verkkovirhe muutoksia tallennettaessa.",
      "cancel": "Tilausta ei voitu peruuttaa.",
      "cancelNetwork": "Verkkovirhe tilausta peruuttaessa.",
      "copySuccess": "Kopioitu leikepöydälle",
      "copyFail": "Kopiointi epäonnistui",
      "emailRequired": "Syötä sähköpostiosoite."
    },
    "loading": "Ladataan tilausta...",
    "accessTitle": "Pääsy varaukseen",
    "accessBody": "Syötä varauksessa käytetty sähköpostiosoite.",
    "accessPlaceholder": "sinä@example.com",
    "accessAction": "Jatka",
    "accessChecking": "Tarkistetaan...",
    "cancelledTitle": "Tilaus peruttu",
    "cancelledBody": "Tilauksesi on peruttu. Jos tämä oli virhe, tee uusi varaus.",
    "manageTitle": "Hallitse kuljetusta",
    "copyAction": "Kopioi",
    "orderLabel": "Tilaus #",
    "orderIdLabel": "Tilaus-ID",
    "detailsUpdatedTitle": "Tiedot päivitetty",
    "updateSubmittedTitle": "Päivityspyyntö lähetetty",
    "updateSubmittedBody": "Päivityspyyntö lähetettiin. Tarkistamme sen pian.",
    "awaiting": "Odotetaan vahvistusta...",
    "transferRoute": "Reitti",
    "priceLabel": "Hinta:",
    "pricePending": "Hinta vahvistetaan yksilöllisesti",
    "taximeterTitle": "Price calculated by taximeter",
    "taximeterRates": "View taximeter rates",
    "tariff1": "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    "statusConfirmed": "Vahvistettu",
    "statusCompleted": "Valmis",
    "statusFailed": "Ei valmis",
    "statusRejected": "Hylätty",
    "statusPriceProposed": "Hinta ehdotettu",
    "statusPending": "Odottaa",
    "bookingDetails": "Varauksen tiedot",
    "editDetails": "Muokkaa tietoja",
    "updateRequested": "Päivitettävät kentät",
    "confirmedEditNote": "Vahvistetun tilauksen muokkaus lähettää sen uudelleen hyväksyntään.",
    "updateFieldsNote": "Päivitä korostetut kentät ja tallenna muutokset.",
    "confirmedNote": "Tämä tilaus on vahvistettu.",
    "completedNote": "Tämä tilaus on merkitty valmiiksi.",
    "failedNote": "Tämä tilaus on merkitty epäonnistuneeksi.",
    "priceProposedNote": "Uusi hinta on ehdotettu. Tarkista sähköpostisi hyväksyäksesi tai hylätäksesi.",
    "rejectedNote": "Tämä tilaus on hylätty. Muokkaus on poissa käytöstä, mutta voit peruuttaa varauksen.",
    "rejectionReasonLabel": "Syy:",
    "date": "Päivämäärä",
    "pickupTime": "Noutoaika",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "Kuljettaja ottaa yhteyttä WhatsAppissa tai puhelimitse ja tapaatte.",
    "signText": "Nimikyltti",
    "flightNumber": "Lennon numero",
    "pickupAddress": "Nouto-osoite",
    "passengers": "Matkustajien määrä",
    "passengersBus": [
      "5 henkilöä",
      "6 henkilöä",
      "7 henkilöä",
      "8 henkilöä"
    ],
    "passengersStandard": [
      "1 henkilö",
      "2 henkilöä",
      "3 henkilöä",
      "4 henkilöä"
    ],
    "largeLuggage": "Suuret matkatavarat",
    "luggageNo": "Ei",
    "luggageYes": "Kyllä",
    "contactTitle": "Yhteystiedot",
    "fullName": "Koko nimi",
    "phoneNumber": "Puhelinnumero",
    "email": "Sähköpostiosoite",
    "notesTitle": "Lisätiedot (valinnainen)",
    "saveChanges": "Tallenna muutokset",
    "cancelEdit": "Peruuta",
    "editBooking": "Muokkaa varausta",
    "cancelBooking": "Peruuta varaus",
    "changesNotice": "Muutokset vahvistetaan sähköpostilla. Kiireellisissä tapauksissa ota yhteyttä booking@taxiairportgdansk.com",
    "updateRequestNote": "Varaus on päivitetty. Tarkista ja vahvista muutokset.",
    "rejectNote": "Tämä varaus on hylätty. Ota yhteyttä tukeen, jos sinulla on kysymyksiä.",
    "cancelPromptTitle": "Perutaanko varaus?",
    "cancelPromptBody": "Haluatko varmasti peruuttaa varauksen? Tätä ei voi perua.",
    "confirmCancel": "Kyllä, peruuta",
    "keepBooking": "Pidä varaus",
    "copyOrderLabel": "Tilaus #",
    "copyOrderIdLabel": "Tilaus-ID"
  },
  "adminOrders": {
    "title": "Ylläpitäjän tilaukset",
    "subtitle": "Kaikki viimeisimmät tilaukset ja tilat.",
    "loading": "Ladataan tilauksia...",
    "missingToken": "Ylläpitäjän token puuttuu.",
    "errorLoad": "Tilauksia ei voitu ladata.",
    "filters": {
      "all": "All",
      "active": "In progress",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "price_proposed": "Price proposed",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "columns": {
      "order": "Tilaus",
      "pickup": "Nouto",
      "customer": "Asiakas",
      "price": "Hinta",
      "status": "Tila",
      "open": "Avaa"
    },
    "empty": "Ei tilauksia.",
    "view": "Näytä"
  },
  "adminOrder": {
    "title": "Ylläpitäjän tilauksen tiedot",
    "subtitle": "Hallitse, vahvista tai hylkää tilaus.",
    "back": "Takaisin tilauksiin",
    "loading": "Ladataan tilausta...",
    "missingToken": "Ylläpitäjän token puuttuu.",
    "errorLoad": "Tilausta ei voitu ladata.",
    "updated": "Tilaus päivitetty.",
    "updateError": "Tilausta ei voitu päivittää.",
    "statusUpdated": "Tilausstatus päivitetty.",
    "updateRequestSent": "Päivityspyyntö lähetetty asiakkaalle.",
    "updateRequestError": "Päivityspyyntöä ei voitu lähettää.",
    "updateRequestSelect": "Valitse vähintään yksi kenttä päivitystä varten.",
    "orderLabel": "Tilaus",
    "idLabel": "ID",
    "customerLabel": "Asiakas",
    "pickupLabel": "Nouto",
    "priceLabel": "Hinta",
    "additionalInfo": "Lisätiedot",
    "passengers": "Matkustajat:",
    "largeLuggage": "Suuret matkatavarat:",
    "pickupType": "Noutotyyppi:",
    "signService": "Noutotapa:",
    "signServiceSign": "Nouto nimikyltillä",
    "signServiceSelf": "Kuljettajan etsiminen itse",
    "signFee": "Kyltin lisämaksu:",
    "flightNumber": "Lennon numero:",
    "signText": "Nimikyltti:",
    "route": "Reitti:",
    "notes": "Muistiinpanot:",
    "adminActions": "Ylläpitäjän toiminnot",
    "confirmOrder": "Vahvista tilaus",
    "rejectOrder": "Hylkää tilaus",
    "proposePrice": "Ehdota uutta hintaa (PLN)",
    "sendPrice": "Lähetä hintatarjous",
    "rejectionReason": "Hylkäyksen syy (valinnainen)",
    "requestUpdate": "Pyydä asiakkaan päivitys",
    "requestUpdateBody": "Valitse kentät, jotka asiakkaan tulee päivittää. Hän saa sähköpostin muokkauslinkillä.",
    "fieldPhone": "Puhelinnumero",
    "fieldEmail": "Sähköposti",
    "fieldFlight": "Lennon numero",
    "requestUpdateAction": "Pyydä päivitys",
    "cancelConfirmedTitle": "Confirmed order cancellation",
    "cancelConfirmedBody": "Send a cancellation email due to lack of taxi availability at the requested time.",
    "cancelConfirmedAction": "Cancel confirmed order",
    "cancelConfirmedConfirm": "Cancel this confirmed order and notify the customer?",
    "cancelConfirmedSuccess": "Order cancelled.",
    "deleteRejectedTitle": "Delete rejected order",
    "deleteRejectedBody": "Remove this rejected order permanently.",
    "deleteRejectedAction": "Delete rejected order",
    "deleteRejectedConfirm": "Delete this rejected order permanently?",
    "deleteRejectedSuccess": "Order deleted.",
    "completionTitle": "Valmiustila",
    "markCompleted": "Merkitse valmiiksi",
    "markCompletedConfirm": "Mark this order as completed?",
    "markFailed": "Merkitse epäonnistuneeksi",
    "markFailedConfirm": "Mark this order as not completed?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Gdańskin lentokenttätaksi",
      "description": "Varaa nopea ja luotettava lentokenttätaksi Gdańskin lentokentältä. Kiinteä hinta molempiin suuntiin, ammattikuljettajat ja nopea vahvistus.",
      "route": "Gdańskin lentokenttä",
      "examples": [
        "Gdańskin vanhakaupunki",
        "Gdańsk Oliwa",
        "Gdańskin päärautatieasema",
        "Brzeźno Beach"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Kuljetus Gdańskin lentokentältä Sopotiin",
      "description": "Yksityinen kuljetus Gdańskin lentokentän ja Sopotin välillä, kiinteä hinta molempiin suuntiin ja lentoseuranta.",
      "route": "Gdańskin lentokenttä ↔ Sopot",
      "examples": [
        "Sopot Pier",
        "Sopotin keskusta",
        "Sopotin hotellit",
        "Sopotin rautatieasema"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Kuljetus Gdańskin lentokentältä Gdyniaan",
      "description": "Mukava kuljetus Gdańskin lentokentän ja Gdynian välillä kiinteällä hinnalla.",
      "route": "Gdańskin lentokenttä ↔ Gdynia",
      "examples": [
        "Gdynian keskusta",
        "Gdynian satama",
        "Gdynian hotellit",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
};
const fi$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: fi
}, Symbol.toStringTag, { value: "Module" }));
const no = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Bestill via WhatsApp",
    "progress": "Fremdrift",
    "stepCounter": (current, total) => `Steg ${current}/${total}`,
    "remainingFields": (count) => `${count} felt gjenstår`,
    "orderOnlineNow": "Bestill taxi på nett",
    "callNow": "Ring nå",
    "orderNow": "Reserver nå",
    "continue": "Fortsett",
    "back": "Tilbake",
    "optional": "valgfritt",
    "close": "Lukk",
    "noPrepayment": "Ingen forhåndsbetaling",
    "backToHome": "← Tilbake til forsiden",
    "notFoundTitle": "Siden ble ikke funnet",
    "notFoundBody": "Siden du leter etter finnes ikke eller er flyttet.",
    "notFoundCta": "Gå til forsiden",
    "notFoundSupport": "Hvis dette er en feil, kontakt oss:",
    "notFoundRequested": "Forespurt URL",
    "notFoundPopular": "Populære sider",
    "actualBadge": "AKTUELL",
    "priceFrom": "fra",
    "perNight": "om natten",
    "perDay": "til sentrum (dag)",
    "whatsappMessage": "Hei Taxi Airport Gdańsk, jeg ønsker å bestille en transfer."
  },
  "navbar": {
    "home": "Hjem",
    "fleet": "Vår flåte",
    "airportTaxi": "Gdańsk flyplass taxi",
    "airportSopot": "Flyplass ↔ Sopot",
    "airportGdynia": "Flyplass ↔ Gdynia",
    "prices": "Priser",
    "orderNow": "RESERVER NÅ",
    "language": "Språk"
  },
  "hero": {
    "promo": {
      "dayPrice": "KUN 100 PLN",
      "dayLabel": "til sentrum (dag)",
      "nightPrice": "120 PLN",
      "nightLabel": "om natten"
    },
    "logoAlt": "Taxi Airport Gdańsk - Flyplasstransport & limousineservice",
    "orderViaEmail": "Bestill via e-post",
    "headline": "Gdańsk flyplass taxi – transport til Gdańsk, Sopot og Gdynia",
    "subheadline": "Gdansk airport taxi med faste priser, 24/7 og rask bekreftelse.",
    "whyChoose": "Hvorfor velge Taxi Airport Gdańsk",
    "benefits": "Fordeler",
    "benefitsList": {
      "flightTrackingTitle": "Flysporing",
      "flightTrackingBody": "Vi følger ankomster og justerer hentetid automatisk.",
      "meetGreetTitle": "Meet & greet",
      "meetGreetBody": "Profesjonelle sjåfører, tydelig kommunikasjon og hjelp med bagasje.",
      "fastConfirmationTitle": "Rask bekreftelse",
      "fastConfirmationBody": "De fleste bestillinger bekreftes innen 5–10 minutter.",
      "flexiblePaymentsTitle": "Fleksible betalinger",
      "flexiblePaymentsBody": "Kort, Apple Pay, Google Pay, Revolut eller kontant.",
      "freePrebookingTitle": "Gratis forhåndsbestilling",
      "freePrebookingBody": "Avbestill når som helst gratis. Fullt automatisert.",
      "fixedPriceTitle": "Fastprisgaranti",
      "fixedPriceBody": "Fast pris begge veier. Prisen du bestiller er prisen du betaler.",
      "localExpertiseTitle": "Lokal ekspertise",
      "localExpertiseBody": "Erfarne Tri-City-sjåfører som kjenner de raskeste rutene.",
      "assistanceTitle": "24/7 assistanse",
      "assistanceBody": "Alltid tilgjengelig før, under og etter turen."
    },
    "fleetTitle": "Vår flåte",
    "fleetLabel": "Kjøretøy",
    "standardCarsTitle": "Standardbiler",
    "standardCarsBody": "1-4 passasjerer | Komfortable sedaner og SUV-er",
    "busTitle": "Og flere busser",
    "busBody": "5-8 passasjerer | Perfekt for større grupper"
  },
  "vehicle": {
    "title": "Velg kjøretøy",
    "subtitle": "Velg kjøretøytypen som passer gruppestørrelsen",
    "standardTitle": "Standardbil",
    "standardPassengers": "1-4 passasjerer",
    "standardDescription": "Perfekt for enkeltpersoner, par og små familier",
    "busTitle": "BUS Service",
    "busPassengers": "5-8 passasjerer",
    "busDescription": "Ideelt for større grupper og familier med ekstra bagasje",
    "selfManageBadge": "Rediger eller avbestill bestillingen selv",
    "examplePrices": "Eksempelpriser:",
    "airportGdansk": "Flyplass ↔ Gdańsk",
    "airportSopot": "Flyplass ↔ Sopot",
    "airportGdynia": "Flyplass ↔ Gdynia",
    "selectStandard": "Velg standardbil",
    "selectBus": "Velg BUS Service"
  },
  "pricing": {
    "back": "Tilbake til kjøretøyvalg",
    "titleStandard": "Standardbil (1-4 passasjerer)",
    "titleBus": "BUS Service (5-8 passasjerer)",
    "description": "Faste priser begge veier (til og fra flyplassen). Ingen skjulte gebyrer. Nattpris gjelder 22–6 samt søndager og helligdager.",
    "directionFromAirport": "Fra flyplassen",
    "directionToAirport": "Til flyplassen",
    "dayRate": "Dagpris",
    "nightRate": "Nattpris",
    "sundayNote": "(Søndager og helligdager)",
    "customRouteTitle": "Tilpasset rute",
    "customRouteBody": "Trenger du et annet reisemål?",
    "customRoutePrice": "Faste priser",
    "customRoutePriceBody": "Fleksible priser basert på ruten",
    "customRouteAutoNote": "Kalkulatoren estimerer prisen etter at du har skrevet inn adressene.",
    "requestQuote": "Bestill nå",
    "pricesNote": "Prisene inkluderer MVA. Flere destinasjoner på forespørsel.",
    "tableTitle": "Pristabell",
    "tableRoute": "Rute",
    "tableStandardDay": "Standard dag",
    "tableStandardNight": "Standard natt",
    "tableBusDay": "Buss dag",
    "tableBusNight": "Buss natt",
    "tariffsTitle": "Tilpasset ruteprising",
    "tariffsName": "Takst",
    "tariffsRate": "Pris",
    "bookingTitle": "Bestill transfer",
    "bookingSubtitle": "Velg kjøretøytype og reserver turen med en gang.",
    "routes": {
      "airport": "Flyplass",
      "gdansk": "Gdańsk sentrum",
      "gdynia": "Gdynia sentrum"
    }
  },
  "pricingLanding": {
    "title": "Priser for Gdańsk flyplasstaxi",
    "subtitle": "Fastpris på flyplasstransfer og transparente takster for tilpassede ruter.",
    "description": "Sammenlign standard- og busspriser, og bestill eller be om tilbud.",
    "cta": "Bestill transfer",
    "calculatorCta": "Kalkulator",
    "highlights": [
      {
        "title": "Fastpris begge veier",
        "body": "De oppførte flyplasstrasene har fastpris uten skjulte gebyrer."
      },
      {
        "title": "Tilgjengelig 24/7",
        "body": "Vi er tilgjengelige hver dag med rask bekreftelse og støtte."
      },
      {
        "title": "Buss for grupper",
        "body": "Romslige 5–8 seters kjøretøy for familier og større grupper."
      }
    ],
    "faqTitle": "Pris-FAQ",
    "faq": [
      {
        "question": "Er disse prisene faste?",
        "answer": "Ja. Flyplasstrasene har fastpris begge veier. Tilpassede ruter prises individuelt."
      },
      {
        "question": "Når gjelder nattpris?",
        "answer": "Fra 22:00 til 6:00 og på søndager og helligdager."
      },
      {
        "question": "Overvåker dere flyforsinkelser?",
        "answer": "Ja, vi følger ankomster og justerer hentetiden."
      },
      {
        "question": "Kan jeg betale med kort?",
        "answer": "Kortbetaling på forespørsel. Faktura tilgjengelig for bedrifter."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Pris-kalkulator",
    "subtitle": "Oppgi hentested og destinasjon for prisestimat.",
    "airportLabel": "Gdańsk lufthavn",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Henting fra adresse",
    "destinationCustomLabel": "Destinasjonsadresse",
    "pickupLabel": "Hentested",
    "pickupPlaceholder": "f.eks. Gdańsk Airport, Słowackiego 200",
    "destinationLabel": "Destinasjon",
    "destinationPlaceholder": "f.eks. Sopot, Monte Cassino 1",
    "distanceLabel": "Distanse",
    "resultsTitle": "Estimert pris",
    "fixedAllDay": "Hel dag",
    "dayRate": "Dagpris",
    "nightRate": "Nattpris",
    "dayRateLabel": "Dagpris",
    "allDayRateLabel": "Døgnpris",
    "guaranteedPriceLabel": "Garantert pris",
    "standard": "Standard",
    "bus": "Buss",
    "loading": "Beregner rute...",
    "noResult": "Kunne ikke beregne ruten. Prøv en mer presis adresse.",
    "longRouteTitle": "Estimert pris for lang rute",
    "taximeterLabel": "Taxameter",
    "proposedLabel": "Foreslått pris",
    "savingsLabel": "Besparelse",
    "orderNow": "Bestill nå",
    "note": "Prisene er faste. Du kan foreslå en annen pris i bestillingsskjemaet for en annen rute."
  },
  "trust": {
    "googleReviewsTitle": "Google-anmeldelser",
    "googleReviewsCta": "Se anmeldelser",
    "googleReviewsCountLabel": "anmeldelser",
    "companyTitle": "Firmadetaljer",
    "paymentTitle": "Betaling & faktura",
    "comfortTitle": "Komfort & sikkerhet",
    "paymentBody": "Betal med kontanter eller kort. Faktura tilgjengelig for bedrifter.",
    "comfortBody": "Barneseter på forespørsel. Profesjonelle, lisensierte sjåfører og dør-til-dør-hjelp."
  },
  "trustBar": {
    "ariaLabel": "Tillitsignaler",
    "instantConfirmation": "Rask bekreftelse",
    "meetGreetOptional": "Meet & greet valgfritt",
    "noPrepayment": "Ingen forhåndsbetaling",
    "supportWhatsappEmail": "Support: WhatsApp og e-post",
    "vatInvoice": "MVA-faktura"
  },
  "footer": {
    "description": "Profesjonell flyplasstransport i Tri-City-området. Tilgjengelig 24/7.",
    "contactTitle": "Kontakt",
    "location": "Gdańsk, Polen",
    "bookingNote": "Bestill online, via WhatsApp eller e-post",
    "hoursTitle": "Åpningstider",
    "hoursBody": "24/7 - tilgjengelig hver dag",
    "hoursSub": "Flyplasshenting, bytransport og tilpassede ruter",
    "routesTitle": "Populære ruter",
    "rights": "Alle rettigheter forbeholdt.",
    "cookiePolicy": "Informasjonskapsler",
    "privacyPolicy": "Personvern"
  },
  "cookieBanner": {
    "title": "Innstillinger for informasjonskapsler",
    "body": "Vi bruker nødvendige informasjonskapsler for å sikre en trygg og pålitelig bestilling. Med ditt samtykke bruker vi også markedsføringskapsler for å måle annonsekonverteringer. Du kan endre valget når som helst ved å tømme nettleserlagringen.",
    "readPolicy": "Les retningslinjene",
    "decline": "Avslå",
    "accept": "Godta informasjonskapsler"
  },
  "cookiePolicy": {
    "title": "Retningslinjer for informasjonskapsler",
    "updated": "Sist oppdatert: 2. januar 2026",
    "intro": "Denne nettsiden bruker informasjonskapsler for å fungere pålitelig og holde bestillingen sikker. Med ditt samtykke bruker vi også markedsføringskapsler for å måle konverteringer.",
    "sectionCookies": "Hvilke informasjonskapsler vi bruker",
    "cookiesList": [
      "Nødvendige informasjonskapsler for sikkerhet og misbruksbeskyttelse.",
      "Preferansekapsler for å huske grunnleggende valg i en økt.",
      "Markedsføringskapsler for å måle konverteringer fra annonser (Google Ads)."
    ],
    "sectionManage": "Slik kan du administrere informasjonskapsler",
    "manageBody1": "Du kan slette informasjonskapsler når som helst i nettleserinnstillingene. Å blokkere nødvendige kapsler kan forhindre at bestillingsskjemaet fungerer.",
    "manageBody2": "Du kan også endre markedsføringssamtykke ved å tømme nettleserlagringen og besøke siden igjen.",
    "contact": "Kontakt",
    "contactBody": "Hvis du har spørsmål om disse retningslinjene, kontakt oss på"
  },
  "privacyPolicy": {
    "title": "Personvern",
    "updated": "Sist oppdatert: 2. januar 2026",
    "intro": "Denne personvernerklæringen forklarer hvordan Taxi Airport Gdańsk samler inn og behandler personopplysninger.",
    "controllerTitle": "Behandlingsansvarlig",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Polen\nE-post:",
    "dataTitle": "Hvilke data vi samler inn",
    "dataList": [
      "Kontaktopplysninger som navn, e-postadresse og telefonnummer.",
      "Bestillingsdetaljer som hentested, dato, tid, flynummer og notater.",
      "Tekniske data som IP-adresse og grunnleggende nettleserinformasjon for sikkerhet."
    ],
    "whyTitle": "Hvorfor vi behandler data",
    "whyList": [
      "For å svare på bestillingen og levere tjenesten.",
      "For å kommunisere om bestillinger, endringer eller avbestillinger.",
      "For å oppfylle juridiske forpliktelser og forhindre misbruk."
    ],
    "legalTitle": "Rettslig grunnlag",
    "legalList": [
      "Oppfyllelse av kontrakt (GDPR art. 6(1)(b)).",
      "Rettslig forpliktelse (GDPR art. 6(1)(c)).",
      "Berettigede interesser (GDPR art. 6(1)(f)), som sikkerhet og svindelforebygging."
    ],
    "storageTitle": "Hvor lenge vi lagrer data",
    "storageBody": "Vi lagrer bestillingsdata bare så lenge det er nødvendig for tjenesten og juridiske eller regnskapsmessige krav.",
    "shareTitle": "Hvem vi deler data med",
    "shareBody": "Vi deler kun data med tjenesteleverandører som er nødvendige for bestillingen (f.eks. e-posttjenester). Vi selger ikke personopplysninger.",
    "rightsTitle": "Dine rettigheter",
    "rightsList": [
      "Innsyn, retting eller sletting av personopplysninger.",
      "Begrensning eller innsigelse mot behandling.",
      "Dataportabilitet der det er relevant.",
      "Rett til å klage til en tilsynsmyndighet."
    ],
    "contactTitle": "Kontakt",
    "contactBody": "For personvernhenvendelser, kontakt oss på"
  },
  "routeLanding": {
    "orderNow": "Reserver online nå",
    "quickLinks": "Hurtiglenker",
    "pricingLink": "Se priser",
    "orderLinks": {
      "airportGdansk": "Bestill flyplass → Gdańsk",
      "airportSopot": "Bestill flyplass → Sopot",
      "airportGdynia": "Bestill flyplass → Gdynia",
      "custom": "Tilpasset rute"
    },
    "pricingTitle": "Eksempelpriser",
    "vehicleLabel": "Standardbil",
    "dayLabel": "Dagpris",
    "nightLabel": "Nattpris",
    "currency": "PLN",
    "pricingNote": "Prisene inkluderer MVA. Nattpris gjelder 22:00–06:00 samt søndager og helligdager.",
    "includedTitle": "Dette er inkludert",
    "includedList": [
      "Meet & greet på flyplassen med tydelige instrukser.",
      "Flysporing og fleksibel hentetid.",
      "Fast pris begge veier uten skjulte gebyrer.",
      "Profesjonelle, engelsktalende sjåfører."
    ],
    "destinationsTitle": "Populære destinasjoner",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Hvor raskt er bekreftelsen?",
        "answer": "De fleste bestillinger bekreftes innen 5–10 minutter via e-post."
      },
      {
        "question": "Sporer dere fly?",
        "answer": "Ja, vi følger ankomster og tilpasser hentetid."
      },
      {
        "question": "Kan jeg avbestille?",
        "answer": "Du kan avbestille via lenken i bekreftelses-e-posten."
      },
      {
        "question": "Tilbyr dere barneseter?",
        "answer": "Ja, barneseter er tilgjengelig på forespørsel ved bestilling."
      },
      {
        "question": "Hvordan kan jeg betale?",
        "answer": "Du kan betale med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
      },
      {
        "question": "Hvor møter jeg sjåføren?",
        "answer": "Du får tydelige hentebeskrivelser og kontaktinfo i bekreftelses-e-posten."
      }
    ]
  },
  "countryLanding": {
    "title": "Flyplasstransport Gdańsk for reisende fra Norge",
    "description": "Privat flyplasstransport i Gdańsk med faste priser, døgnåpen henting og rask bekreftelse.",
    "intro": "Passer for fly fra Norge til Gdańsk lufthavn (GDN). Bestill online og få rask bekreftelse.",
    "ctaPrimary": "Bestill transport",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Hvorfor bestille på forhånd",
    "highlights": [
      "Meet & greet med tydelige henteinstruksjoner.",
      "Flysporing og fleksibel hentetid.",
      "Faste priser i PLN uten skjulte gebyrer.",
      "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
    ],
    "airportsTitle": "Vanlige avreiseflyplasser (Norge)",
    "airports": [
      "Oslo Gardermoen (OSL)",
      "Bergen (BGO)",
      "Stavanger (SVG)",
      "Trondheim (TRD)",
      "Tromsø (TOS)"
    ],
    "faqTitle": "FAQ for reisende fra Norge",
    "faq": [
      {
        "question": "Kan jeg betale i NOK?",
        "answer": "Prisene er i PLN. Kortbetaling blir automatisk konvertert av banken din."
      },
      {
        "question": "Får jeg kvittering eller faktura?",
        "answer": "Ja, legg det til i bestillingen, så sender vi dokumentet på e-post."
      },
      {
        "question": "Sporer dere fly?",
        "answer": "Ja, vi følger ankomster og justerer hentetid."
      },
      {
        "question": "Hvor raskt får jeg bekreftelse?",
        "answer": "De fleste bestillinger bekreftes innen 5–10 minutter på e-post."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Bestill transport",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Hvorfor bestille på forhånd",
    "highlights": [
      "Meet & greet med tydelige henteinstruksjoner.",
      "Flysporing og fleksibel hentetid.",
      "Faste priser i PLN uten skjulte gebyrer.",
      "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
    ],
    "destinationsTitle": "Populære destinasjoner i Tri-City",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Finnes det direktefly fra {city} til Gdańsk?",
        "answer": "Direktefly er sesongbaserte. Sjekk gjeldende rutetider før du reiser."
      },
      {
        "question": "Hvordan møter jeg sjåføren?",
        "answer": "Du får henteinstruksjoner og kontaktinfo i bekreftelses-e-posten."
      },
      {
        "question": "Sporer dere fly?",
        "answer": "Ja, vi følger ankomster og justerer hentetid."
      },
      {
        "question": "Kan jeg betale med kort?",
        "answer": "Ja, kortbetaling er mulig. Kontant på forespørsel."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Faste priser og tilgjengelighet 24/7.",
    "intro": "Taxi Gdańsk for flyplasstransport og bykjøring. Profesjonelle sjåfører, rask bekreftelse og klare priser.",
    "ctaPrimary": "Bestill taxi",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Hvorfor velge oss",
    "highlights": [
      "Faste priser uten skjulte gebyrer.",
      "Tilgjengelig 24/7 for flyplass og bykjøring.",
      "Flysporing og fleksibel hentetid.",
      "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant på forespørsel."
    ],
    "serviceAreaTitle": "Serviceområde",
    "serviceArea": [
      "Gdańsk gamleby og sentrum",
      "Gdańsk Wrzeszcz og Oliwa",
      "Gdańsk flyplass (GDN)",
      "Sopot og Gdynia"
    ],
    "routesTitle": "Populære taxi-ruter",
    "routes": [
      "Gdańsk flyplass → gamlebyen",
      "Gdańsk flyplass → Sopot",
      "Gdańsk flyplass → Gdynia",
      "Gamlebyen → Gdańsk flyplass"
    ],
    "cityRoutesTitle": "Taxipriser fra Gdańsk lufthavn",
    "cityRoutesDescription": "Sjekk aktuell pris fra Gdańsk lufthavn til disse stedene.",
    "cityRoutesItem": (destination) => `Gdańsk lufthavn → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Hvor raskt er bekreftelsen?",
        "answer": "De fleste bestillinger bekreftes innen 5–10 minutter via e-post."
      },
      {
        "question": "Har dere faste priser?",
        "answer": "Ja, flyplassruter har faste priser begge veier."
      },
      {
        "question": "Kan jeg betale med kort?",
        "answer": "Ja, kortbetaling er mulig. Kontant på forespørsel."
      },
      {
        "question": "Sporer dere fly?",
        "answer": "Ja, vi følger ankomster og justerer hentetid."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Vennligst oppgi et gyldig telefonnummer (kun tall).",
      "phoneLength": "Vennligst oppgi et gyldig telefonnummer (7–15 sifre, valgfri +).",
      "emailRequired": "Vennligst oppgi e-postadressen din.",
      "email": "Vennligst oppgi en gyldig e-postadresse.",
      "datePast": "Velg dagens dato eller en fremtidig dato.",
      "timePast": "Velg nåværende tidspunkt eller et fremtidig tidspunkt.",
      "timeSoon": "Velg et tidspunkt som er minst 40 minutter fra nå."
    },
    "rate": {
      "day": "Dagpris",
      "night": "Nattpris",
      "reasonDay": "standard dagpris",
      "reasonLate": "henting etter 21:30 eller før 5:30",
      "reasonHoliday": "søndag/helligdag",
      "banner": (label, price, reason) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Kunne ikke sende bestillingen. Prøv igjen.",
    "submitNetworkError": "Nettverksfeil ved innsending. Prøv igjen.",
    "submittedTitle": "Bestilling mottatt",
    "submittedBody": "Takk! Forespørselen din er i kø. Vent på bekreftelse – vanligvis 5–10 minutter. Du får en e-post snart.",
    "awaiting": "Venter på bekreftelse...",
    "totalPrice": "Totalpris:",
    "orderNumber": "Bestilling #:",
    "orderId": "Bestillings-ID:",
    "manageLink": "Administrer eller rediger bestillingen",
    "title": "Bestill transport",
    "date": "Dato",
    "pickupTime": "Hentetid",
    "pickupType": "Hentetype",
    "pickupTypeHint": "Velg hentetype for å fortsette.",
    "airportPickup": "Henting på flyplass",
    "addressPickup": "Henting på adresse",
    "signServiceTitle": "Mottak ved ankomst",
    "signServiceSign": "Møt med navneskilt",
    "signServiceFee": "+20 PLN lagt til sluttprisen",
    "signServiceSelf": "Jeg finner sjåføren selv på parkeringen",
    "signServiceSelfNote": "Sjåføren kontakter deg på WhatsApp eller telefon, og dere møtes.",
    "signText": "Tekst på skilt",
    "signPlaceholder": "Tekst som vises på skiltet",
    "signHelp": "Sjåføren venter med skilt til du forlater ankomsthallen",
    "signPreview": "Skiltforhåndsvisning:",
    "signEmpty": "Navnet ditt vises her",
    "flightNumber": "Flynummer",
    "flightPlaceholder": "f.eks. LO123",
    "flightUnknown": "Jeg vet ikke flynummeret ennå",
    "pickupAddress": "Henteadresse",
    "pickupPlaceholder": "Skriv inn full henteadresse",
    "passengers": "Antall passasjerer",
    "passengersBus": [
      "5 personer",
      "6 personer",
      "7 personer",
      "8 personer"
    ],
    "passengersStandard": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer"
    ],
    "largeLuggage": "Stor bagasje",
    "luggageNo": "Nei",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktinformasjon",
    "fullName": "Fullt navn",
    "namePlaceholder": "Ditt navn",
    "phoneNumber": "Telefonnummer",
    "email": "E-postadresse",
    "emailPlaceholder": "din@epost.com",
    "emailHelp": "Du mottar en bekreftelses-e-post med lenke for endring/avbestilling",
    "notesTitle": "Tilleggsnotater (valgfritt)",
    "notesPlaceholder": "Spesielle ønsker eller ekstra informasjon...",
    "notesHelp": "F.eks. barnesete, ventetid, spesielle instruksjoner",
    "submitting": "Sender...",
    "formIncomplete": "Fyll ut skjemaet for å fortsette",
    "confirmOrder": (price) => `Bekreft bestilling (${price} PLN)`,
    "reassurance": "Ingen forhåndsbetaling. Gratis avbestilling. Bekreftelse på 5–10 min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Vennligst oppgi et gyldig telefonnummer (kun tall).",
      "phoneLength": "Vennligst oppgi et gyldig telefonnummer (7–15 sifre, valgfri +).",
      "email": "Vennligst oppgi en gyldig e-postadresse.",
      "datePast": "Velg dagens dato eller en fremtidig dato.",
      "timePast": "Velg nåværende tidspunkt eller et fremtidig tidspunkt.",
      "timeSoon": "Velg et tidspunkt som er minst 40 minutter fra nå."
    },
    "submitError": "Kunne ikke sende tilbudsforespørsel. Prøv igjen.",
    "submitNetworkError": "Nettverksfeil ved innsending av tilbudsforespørsel. Prøv igjen.",
    "submittedTitle": "Tilbudsforespørsel mottatt!",
    "submittedBody": "Takk for forespørselen. Du vil få e-post innen 5-10 minutter om tilbudet er akseptert eller avslått.",
    "manageLink": "Administrer bestillingen",
    "title": "Be om tilpasset tilbud",
    "subtitle": "Foreslå din pris og få svar innen 5-10 minutter",
    "requestButton": "Be om tilbud",
    "requestAnother": "Be om et nytt tilbud",
    "toggleDescription": "Oppgi detaljene og foreslå en pris. Du får svar innen 5-10 minutter per e-post.",
    "pickupType": "Hentetype",
    "airportPickup": "Henting på flyplass",
    "addressPickup": "Henting på adresse",
    "lockMessage": "Velg hentetype for å låse opp resten av skjemaet.",
    "pickupAddress": "Henteadresse",
    "pickupPlaceholder": "Skriv inn henteadresse (f.eks. Gdańsk Airport, ul. Słowackiego 200)",
    "pickupAutoNote": "Henteadresse på flyplass settes automatisk",
    "destinationAddress": "Destinasjonsadresse",
    "destinationPlaceholder": "Skriv inn destinasjon (f.eks. Gdańsk Centrum, ul. Długa 1)",
    "price": "Pris",
    "proposedPriceLabel": "Din foreslåtte pris (PLN)",
    "taximeterTitle": "Enter the address to see the price. If it doesn't fit, propose your own.",
    "tariff1": "Takst 1 (by, 6–22): 3.90 PLN/km.",
    "tariff2": "Takst 2 (by, 22–6): 5.85 PLN/km.",
    "tariff3": "Takst 3 (utenfor by, 6–22): 7.80 PLN/km.",
    "tariff4": "Takst 4 (utenfor by, 22–6): 11.70 PLN/km.",
    "autoPriceNote": "Kalkulatoren estimerer prisen etter at du har skrevet inn adressene.",
    "fixedPriceHint": "Hvis du ønsker fastpris, klikk her og fyll inn.",
    "pricePlaceholder": "Skriv inn ditt tilbud i PLN (f.eks. 150)",
    "priceHelp": "Foreslå din pris. Vi vurderer og svarer innen 5-10 minutter.",
    "fixedRouteChecking": "Checking if this route qualifies for a fixed price...",
    "fixedRouteTitle": "Fixed price available",
    "fixedRouteDistance": (distance) => `Distance: ${distance} km`,
    "fixedRouteComputed": (price) => `${price} PLN`,
    "fixedRouteCta": "Book fixed price",
    "fixedRouteHint": "Use the fixed-price booking for the fastest confirmation.",
    "fixedRouteAllDay": "All-day rate applies",
    "fixedRouteDay": "Day rate applies",
    "fixedRouteNight": "Night rate applies",
    "fixedRouteLocked": "This route qualifies for a fixed price. Please book via the fixed-price form.",
    "longRouteTitle": "Long route estimate",
    "longRouteDistance": (distance) => `Distance: ${distance} km`,
    "longRouteTaximeter": (price, rate) => `Taximeter: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price) => `Proposed price: ${price} PLN`,
    "longRouteSavings": (percent) => `Savings: ${percent}%`,
    "longRouteNote": "You can still enter your own price below.",
    "date": "Dato",
    "pickupTime": "Hentetid",
    "signServiceTitle": "Mottak ved ankomst",
    "signServiceSign": "Møt med navneskilt",
    "signServiceFee": "+20 PLN lagt til sluttprisen",
    "signServiceSelf": "Jeg finner sjåføren selv på parkeringen",
    "signServiceSelfNote": "Sjåføren kontakter deg på WhatsApp eller telefon, og dere møtes.",
    "signText": "Tekst på skilt",
    "signPlaceholder": "Tekst som vises på skiltet",
    "signHelp": "Sjåføren venter med skilt til du forlater ankomsthallen",
    "signPreview": "Skiltforhåndsvisning:",
    "signEmpty": "Navnet ditt vises her",
    "flightNumber": "Flynummer",
    "flightPlaceholder": "f.eks. LO123",
    "passengers": "Antall passasjerer",
    "passengersOptions": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer",
      "5+ personer"
    ],
    "largeLuggage": "Stor bagasje",
    "luggageNo": "Nei",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktinformasjon",
    "fullName": "Fullt navn",
    "namePlaceholder": "Ditt navn",
    "phoneNumber": "Telefonnummer",
    "email": "E-postadresse",
    "emailPlaceholder": "din@epost.com",
    "emailHelp": "Du får svar innen 5-10 minutter",
    "notesTitle": "Tilleggsnotater (valgfritt)",
    "notesPlaceholder": "Spesielle ønsker eller ekstra informasjon...",
    "notesHelp": "F.eks. barnesete, ventetid, spesielle instruksjoner",
    "submitting": "Sender...",
    "formIncomplete": "Fyll ut skjemaet for å fortsette",
    "submit": "Send tilbudsforespørsel"
  },
  "manageOrder": {
    "errors": {
      "load": "Kunne ikke laste bestillingen.",
      "loadNetwork": "Nettverksfeil ved lasting av bestilling.",
      "save": "Kunne ikke lagre endringer.",
      "saveNetwork": "Nettverksfeil ved lagring av endringer.",
      "cancel": "Kunne ikke avbestille bestilling.",
      "cancelNetwork": "Nettverksfeil ved avbestilling.",
      "copySuccess": "Kopiert til utklippstavlen",
      "copyFail": "Kunne ikke kopiere til utklippstavlen",
      "emailRequired": "Vennligst oppgi e-postadressen din."
    },
    "loading": "Laster bestillingen din...",
    "accessTitle": "Få tilgang til bestillingen",
    "accessBody": "Skriv inn e-postadressen brukt ved bestilling.",
    "accessPlaceholder": "du@example.com",
    "accessAction": "Fortsett",
    "accessChecking": "Sjekker...",
    "cancelledTitle": "Bestilling avbestilt",
    "cancelledBody": "Bestillingen er avbestilt. Hvis dette var en feil, lag en ny bestilling.",
    "manageTitle": "Administrer transporten",
    "copyAction": "Kopier",
    "orderLabel": "Bestilling #",
    "orderIdLabel": "Bestillings-ID",
    "detailsUpdatedTitle": "Detaljer oppdatert",
    "updateSubmittedTitle": "Oppdatering sendt",
    "updateSubmittedBody": "Oppdateringsforespørsel sendt. Vi vurderer den snart.",
    "awaiting": "Venter på bekreftelse...",
    "transferRoute": "Transportrute",
    "priceLabel": "Pris:",
    "taximeterTitle": "Price calculated by taximeter",
    "taximeterRates": "View taximeter rates",
    "tariff1": "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    "statusConfirmed": "Bekreftet",
    "statusCompleted": "Fullført",
    "statusFailed": "Ikke fullført",
    "statusRejected": "Avslått",
    "statusPriceProposed": "Pris foreslått",
    "statusPending": "Venter",
    "bookingDetails": "Bestillingsdetaljer",
    "editDetails": "Rediger detaljer",
    "updateRequested": "Felt som må oppdateres",
    "confirmedEditNote": "Redigering av bekreftet bestilling sendes tilbake for godkjenning.",
    "updateFieldsNote": "Oppdater de markerte feltene og lagre endringene.",
    "confirmedNote": "Denne bestillingen er bekreftet.",
    "completedNote": "Denne bestillingen er markert som fullført.",
    "failedNote": "Denne bestillingen er markert som ikke fullført.",
    "priceProposedNote": "En ny pris er foreslått. Sjekk e-post for å godkjenne eller avslå.",
    "rejectedNote": "Denne bestillingen er avslått. Redigering er deaktivert, men du kan fortsatt avbestille.",
    "rejectionReasonLabel": "Årsak:",
    "date": "Dato",
    "pickupTime": "Hentetid",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "Sjåføren kontakter deg på WhatsApp eller telefon, og dere møtes.",
    "signText": "Tekst på skilt",
    "flightNumber": "Flynummer",
    "pickupAddress": "Henteadresse",
    "passengers": "Antall passasjerer",
    "passengersBus": [
      "5 personer",
      "6 personer",
      "7 personer",
      "8 personer"
    ],
    "passengersStandard": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer"
    ],
    "largeLuggage": "Stor bagasje",
    "luggageNo": "Nei",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktinformasjon",
    "fullName": "Fullt navn",
    "phoneNumber": "Telefonnummer",
    "email": "E-postadresse",
    "notesTitle": "Tilleggsnotater (valgfritt)",
    "saveChanges": "Lagre endringer",
    "cancelEdit": "Avbryt",
    "editBooking": "Rediger bestilling",
    "cancelBooking": "Avbestill bestilling",
    "changesNotice": "Endringer bekreftes via e-post. For hasteendringer, kontakt booking@taxiairportgdansk.com",
    "updateRequestNote": "Bestillingen er oppdatert. Vennligst gjennomgå og bekreft endringene.",
    "rejectNote": "Denne bestillingen er avslått. Kontakt support hvis du har spørsmål.",
    "cancelPromptTitle": "Avbestille bestilling?",
    "cancelPromptBody": "Er du sikker på at du vil avbestille? Dette kan ikke angres.",
    "confirmCancel": "Ja, avbestill",
    "keepBooking": "Behold bestilling",
    "copyOrderLabel": "Bestilling #",
    "copyOrderIdLabel": "Bestillings-ID"
  },
  "adminOrders": {
    "title": "Admin-bestillinger",
    "subtitle": "Alle nylige bestillinger og status.",
    "loading": "Laster bestillinger...",
    "missingToken": "Admin-token mangler.",
    "errorLoad": "Kunne ikke laste bestillinger.",
    "filters": {
      "all": "All",
      "active": "In progress",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "price_proposed": "Price proposed",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "columns": {
      "order": "Bestilling",
      "pickup": "Henting",
      "customer": "Kunde",
      "price": "Pris",
      "status": "Status",
      "open": "Åpne"
    },
    "empty": "Ingen bestillinger funnet.",
    "view": "Vis"
  },
  "adminOrder": {
    "title": "Admin bestillingsdetaljer",
    "subtitle": "Administrer, bekreft eller avslå denne bestillingen.",
    "back": "Tilbake til alle bestillinger",
    "loading": "Laster bestilling...",
    "missingToken": "Admin-token mangler.",
    "errorLoad": "Kunne ikke laste bestilling.",
    "updated": "Bestilling oppdatert.",
    "updateError": "Kunne ikke oppdatere bestilling.",
    "statusUpdated": "Bestillingsstatus oppdatert.",
    "updateRequestSent": "Oppdateringsforespørsel sendt til kunde.",
    "updateRequestError": "Kunne ikke sende oppdateringsforespørsel.",
    "updateRequestSelect": "Velg minst ett felt for oppdatering.",
    "orderLabel": "Bestilling",
    "idLabel": "ID",
    "customerLabel": "Kunde",
    "pickupLabel": "Henting",
    "priceLabel": "Pris",
    "additionalInfo": "Tilleggsinformasjon",
    "passengers": "Passasjerer:",
    "largeLuggage": "Stor bagasje:",
    "pickupType": "Hentetype:",
    "signService": "Hentevalg:",
    "signServiceSign": "Møt med navneskilt",
    "signServiceSelf": "Finn sjåføren selv",
    "signFee": "Skiltgebyr:",
    "flightNumber": "Flynummer:",
    "signText": "Tekst på skilt:",
    "route": "Rute:",
    "notes": "Notater:",
    "adminActions": "Admin-handlinger",
    "confirmOrder": "Bekreft bestilling",
    "rejectOrder": "Avslå bestilling",
    "proposePrice": "Foreslå ny pris (PLN)",
    "sendPrice": "Send prisforslag",
    "rejectionReason": "Avslagsgrunn (valgfritt)",
    "requestUpdate": "Be om oppdatering fra kunden",
    "requestUpdateBody": "Velg feltene kunden skal oppdatere. De vil få en e-post med lenke.",
    "fieldPhone": "Telefonnummer",
    "fieldEmail": "E-postadresse",
    "fieldFlight": "Flynummer",
    "requestUpdateAction": "Be om oppdatering",
    "cancelConfirmedTitle": "Confirmed order cancellation",
    "cancelConfirmedBody": "Send a cancellation email due to lack of taxi availability at the requested time.",
    "cancelConfirmedAction": "Cancel confirmed order",
    "cancelConfirmedConfirm": "Cancel this confirmed order and notify the customer?",
    "cancelConfirmedSuccess": "Order cancelled.",
    "deleteRejectedTitle": "Delete rejected order",
    "deleteRejectedBody": "Remove this rejected order permanently.",
    "deleteRejectedAction": "Delete rejected order",
    "deleteRejectedConfirm": "Delete this rejected order permanently?",
    "deleteRejectedSuccess": "Order deleted.",
    "completionTitle": "Fullføringsstatus",
    "markCompleted": "Merk som fullført",
    "markCompletedConfirm": "Mark this order as completed?",
    "markFailed": "Merk som ikke fullført",
    "markFailedConfirm": "Mark this order as not completed?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Gdańsk flyplass taxi",
      "description": "Bestill en rask og pålitelig flyplasstaxi fra Gdańsk flyplass. Fast pris begge veier, profesjonelle sjåfører og rask bekreftelse.",
      "route": "Gdańsk flyplass",
      "examples": [
        "Gdańsk gamleby",
        "Gdańsk Oliwa",
        "Gdańsk hovedstasjon",
        "Brzeźno strand"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Transfer fra Gdańsk flyplass til Sopot",
      "description": "Privat transfer mellom Gdańsk flyplass og Sopot med fast pris begge veier og flysporing.",
      "route": "Gdańsk flyplass ↔ Sopot",
      "examples": [
        "Sopot Pier",
        "Sopot sentrum",
        "Sopot hoteller",
        "Sopot jernbanestasjon"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Transfer fra Gdańsk flyplass til Gdynia",
      "description": "Komfortabel transfer mellom Gdańsk flyplass og Gdynia med fast pris begge veier.",
      "route": "Gdańsk flyplass ↔ Gdynia",
      "examples": [
        "Gdynia sentrum",
        "Gdynia havn",
        "Gdynia hoteller",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
};
const no$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: no
}, Symbol.toStringTag, { value: "Module" }));
const sv = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Boka via WhatsApp",
    "progress": "Framsteg",
    "stepCounter": (current, total) => `Steg ${current}/${total}`,
    "remainingFields": (count) => `${count} fält kvar`,
    "orderOnlineNow": "Boka taxi online",
    "callNow": "Ring nu",
    "orderNow": "Boka nu",
    "continue": "Fortsätt",
    "back": "Tillbaka",
    "optional": "valfritt",
    "close": "Stäng",
    "noPrepayment": "Ingen förskottsbetalning",
    "backToHome": "← Tillbaka till startsidan",
    "notFoundTitle": "Sidan hittades inte",
    "notFoundBody": "Sidan du söker finns inte eller har flyttats.",
    "notFoundCta": "Gå till startsidan",
    "notFoundSupport": "Om detta är ett fel, kontakta oss:",
    "notFoundRequested": "Begärd URL",
    "notFoundPopular": "Populära sidor",
    "actualBadge": "AKTUELL",
    "priceFrom": "från",
    "perNight": "nattetid",
    "perDay": "till centrum (dag)",
    "whatsappMessage": "Hej Taxi Airport Gdańsk, jag vill boka en transfer."
  },
  "navbar": {
    "home": "Hem",
    "fleet": "Vår flotta",
    "airportTaxi": "Gdańsk flygplats taxi",
    "airportSopot": "Flygplats ↔ Sopot",
    "airportGdynia": "Flygplats ↔ Gdynia",
    "prices": "Priser",
    "orderNow": "BOKA NU",
    "language": "Språk"
  },
  "hero": {
    "promo": {
      "dayPrice": "ENDAST 100 PLN",
      "dayLabel": "till centrum (dag)",
      "nightPrice": "120 PLN",
      "nightLabel": "nattetid"
    },
    "logoAlt": "Taxi Airport Gdańsk - Flygplatstransfer & limousineservice",
    "orderViaEmail": "Beställ via e-post",
    "headline": "Gdańsk flygplats taxi – transfer till Gdańsk, Sopot och Gdynia",
    "subheadline": "Gdansk airport taxi med fasta priser, 24/7 och snabb bekräftelse.",
    "whyChoose": "Varför välja Taxi Airport Gdańsk",
    "benefits": "Fördelar",
    "benefitsList": {
      "flightTrackingTitle": "Flygspårning",
      "flightTrackingBody": "Vi övervakar ankomster och justerar upphämtningstid automatiskt.",
      "meetGreetTitle": "Meet & greet",
      "meetGreetBody": "Professionella förare, tydlig kommunikation och hjälp med bagage.",
      "fastConfirmationTitle": "Snabb bekräftelse",
      "fastConfirmationBody": "De flesta bokningar bekräftas inom 5–10 minuter.",
      "flexiblePaymentsTitle": "Flexibla betalningar",
      "flexiblePaymentsBody": "Kort, Apple Pay, Google Pay, Revolut eller kontant.",
      "freePrebookingTitle": "Gratis förbokning",
      "freePrebookingBody": "Avboka när som helst kostnadsfritt. Helt automatiserat.",
      "fixedPriceTitle": "Fastprisgaranti",
      "fixedPriceBody": "Fast pris åt båda håll. Priset du bokar är priset du betalar.",
      "localExpertiseTitle": "Lokal expertis",
      "localExpertiseBody": "Erfarna Trójmiasto-förare som kan de snabbaste rutterna.",
      "assistanceTitle": "24/7 hjälp",
      "assistanceBody": "Alltid tillgänglig före, under och efter din resa."
    },
    "fleetTitle": "Vår flotta",
    "fleetLabel": "Fordon",
    "standardCarsTitle": "Standardbilar",
    "standardCarsBody": "1-4 passagerare | Bekväma sedaner och SUV:ar",
    "busTitle": "Och fler bussar",
    "busBody": "5-8 passagerare | Perfekt för större grupper"
  },
  "vehicle": {
    "title": "Välj fordon",
    "subtitle": "Välj fordonstyp som passar gruppens storlek",
    "standardTitle": "Standardbil",
    "standardPassengers": "1-4 passagerare",
    "standardDescription": "Perfekt för ensamresenärer, par och små familjer",
    "busTitle": "BUS Service",
    "busPassengers": "5-8 passagerare",
    "busDescription": "Idealisk för större grupper och familjer med extra bagage",
    "selfManageBadge": "Redigera eller avboka bokningen själv",
    "examplePrices": "Exempelpriser:",
    "airportGdansk": "Flygplats ↔ Gdańsk",
    "airportSopot": "Flygplats ↔ Sopot",
    "airportGdynia": "Flygplats ↔ Gdynia",
    "selectStandard": "Välj standardbil",
    "selectBus": "Välj BUS Service"
  },
  "pricing": {
    "back": "Tillbaka till fordonsval",
    "titleStandard": "Standardbil (1-4 passagerare)",
    "titleBus": "BUS Service (5-8 passagerare)",
    "description": "Fasta priser åt båda håll (till och från flygplatsen). Inga dolda avgifter. Nattaxa gäller 22–6 samt söndagar och helgdagar.",
    "directionFromAirport": "Från flygplatsen",
    "directionToAirport": "Till flygplatsen",
    "dayRate": "Dagpris",
    "nightRate": "Nattpris",
    "sundayNote": "(Söndagar och helgdagar)",
    "customRouteTitle": "Anpassad rutt",
    "customRouteBody": "Behöver du en annan destination?",
    "customRoutePrice": "Fasta priser",
    "customRoutePriceBody": "Flexibel prissättning baserat på din rutt",
    "customRouteAutoNote": "Kalkylatorn uppskattar priset efter att du har angett adresserna.",
    "requestQuote": "Boka nu",
    "pricesNote": "Priserna inkluderar moms. Fler destinationer på begäran.",
    "tableTitle": "Pristabell",
    "tableRoute": "Rutt",
    "tableStandardDay": "Standard dag",
    "tableStandardNight": "Standard natt",
    "tableBusDay": "Buss dag",
    "tableBusNight": "Buss natt",
    "tariffsTitle": "Priser för anpassade rutter",
    "tariffsName": "Taxa",
    "tariffsRate": "Pris",
    "bookingTitle": "Boka transfer",
    "bookingSubtitle": "Välj fordonstyp och boka direkt.",
    "routes": {
      "airport": "Flygplats",
      "gdansk": "Gdańsk centrum",
      "gdynia": "Gdynia centrum"
    }
  },
  "pricingLanding": {
    "title": "Priser för Gdańsk flygplatstaxi",
    "subtitle": "Fasta priser för flygplatstransfer och tydlig prissättning för anpassade rutter.",
    "description": "Jämför standard- och busspriser, boka direkt eller be om offert.",
    "cta": "Boka transfer",
    "calculatorCta": "Kalkylator",
    "highlights": [
      {
        "title": "Fasta priser åt båda håll",
        "body": "De listade flygplatsrutterna har fast pris utan dolda avgifter."
      },
      {
        "title": "Tillgängligt 24/7",
        "body": "Vi är tillgängliga varje dag med snabb bekräftelse och support."
      },
      {
        "title": "Buss för grupper",
        "body": "Rymliga 5–8-sitsiga fordon för familjer och större grupper."
      }
    ],
    "faqTitle": "Pris-FAQ",
    "faq": [
      {
        "question": "Är dessa priser fasta?",
        "answer": "Ja. Flygplatsrutterna har fasta priser åt båda håll. Anpassade rutter prissätts individuellt."
      },
      {
        "question": "När gäller nattaxa?",
        "answer": "22:00–6:00 samt söndagar och helgdagar."
      },
      {
        "question": "Följer ni flygförseningar?",
        "answer": "Ja, vi följer ankomster och justerar upphämtningstiden."
      },
      {
        "question": "Kan jag betala med kort?",
        "answer": "Kortbetalning på begäran. Faktura finns för företagskunder."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Prisräknare",
    "subtitle": "Ange upphämtning och destination för en prisuppskattning.",
    "airportLabel": "Gdańsk flygplats",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Upphämtning från adress",
    "destinationCustomLabel": "Destinationsadress",
    "pickupLabel": "Upphämtningsplats",
    "pickupPlaceholder": "t.ex. Gdańsk Airport, Słowackiego 200",
    "destinationLabel": "Destination",
    "destinationPlaceholder": "t.ex. Sopot, Monte Cassino 1",
    "distanceLabel": "Avstånd",
    "resultsTitle": "Uppskattat pris",
    "fixedAllDay": "Hela dagen",
    "dayRate": "Dagpris",
    "nightRate": "Nattpris",
    "dayRateLabel": "Dagpris",
    "allDayRateLabel": "Heldagspris",
    "guaranteedPriceLabel": "Garanterat pris",
    "standard": "Standard",
    "bus": "Buss",
    "loading": "Beräknar rutt...",
    "noResult": "Kunde inte beräkna rutten. Prova en mer exakt adress.",
    "longRouteTitle": "Uppskattning för lång rutt",
    "taximeterLabel": "Taxameter",
    "proposedLabel": "Föreslaget pris",
    "savingsLabel": "Besparing",
    "orderNow": "Boka nu",
    "note": "Priserna är fasta. Du kan föreslå ett annat pris i beställningsformuläret för en annan rutt."
  },
  "trust": {
    "googleReviewsTitle": "Google-recensioner",
    "googleReviewsCta": "Se recensioner",
    "googleReviewsCountLabel": "recensioner",
    "companyTitle": "Företagsuppgifter",
    "paymentTitle": "Betalning & faktura",
    "comfortTitle": "Komfort & säkerhet",
    "paymentBody": "Betala kontant eller med kort. Faktura tillgänglig för företag.",
    "comfortBody": "Barnstolar på begäran. Professionella, licensierade förare och dörr-till-dörr-hjälp."
  },
  "trustBar": {
    "ariaLabel": "Förtroendesignaler",
    "instantConfirmation": "Snabb bekräftelse",
    "meetGreetOptional": "Meet & greet valfritt",
    "noPrepayment": "Ingen förskottsbetalning",
    "supportWhatsappEmail": "Support: WhatsApp & e-post",
    "vatInvoice": "Momsfaktura"
  },
  "footer": {
    "description": "Professionell flygplatstransfer i Trójmiasto-området. Tillgänglig 24/7.",
    "contactTitle": "Kontakt",
    "location": "Gdańsk, Polen",
    "bookingNote": "Boka online, via WhatsApp eller e-post",
    "hoursTitle": "Öppettider",
    "hoursBody": "24/7 - tillgänglig varje dag",
    "hoursSub": "Flygplatshämtning, stadstransfer och skräddarsydda rutter",
    "routesTitle": "Populära rutter",
    "rights": "Alla rättigheter förbehållna.",
    "cookiePolicy": "Kakor",
    "privacyPolicy": "Integritetspolicy"
  },
  "cookieBanner": {
    "title": "Cookie-inställningar",
    "body": "Vi använder nödvändiga cookies för att hålla bokningsprocessen säker och pålitlig. Med ditt samtycke använder vi även marknadsföringscookies för att mäta konverteringar. Du kan ändra ditt val genom att rensa webbläsarens lagring.",
    "readPolicy": "Läs policyn",
    "decline": "Avböj",
    "accept": "Acceptera cookies"
  },
  "cookiePolicy": {
    "title": "Cookiepolicy",
    "updated": "Senast uppdaterad: 2 januari 2026",
    "intro": "Denna webbplats använder cookies för att fungera pålitligt och hålla din bokning säker. Med ditt samtycke använder vi även marknadsföringscookies för att mäta konverteringar.",
    "sectionCookies": "Vilka cookies vi använder",
    "cookiesList": [
      "Nödvändiga cookies för säkerhet och missbruksförebyggande.",
      "Preferenscookies för att komma ihåg grundläggande val under en session.",
      "Marknadsföringscookies för att mäta konverteringar från annonser (Google Ads)."
    ],
    "sectionManage": "Så hanterar du cookies",
    "manageBody1": "Du kan ta bort cookies när som helst i webbläsarens inställningar. Att blockera nödvändiga cookies kan göra att bokningsformuläret inte fungerar.",
    "manageBody2": "Du kan även ändra ditt marknadsföringsval genom att rensa webbläsarens lagring och besöka webbplatsen igen.",
    "contact": "Kontakt",
    "contactBody": "Om du har frågor om denna policy, kontakta oss på"
  },
  "privacyPolicy": {
    "title": "Integritetspolicy",
    "updated": "Senast uppdaterad: 2 januari 2026",
    "intro": "Denna integritetspolicy förklarar hur Taxi Airport Gdańsk samlar in och behandlar personuppgifter när du använder våra tjänster.",
    "controllerTitle": "Personuppgiftsansvarig",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Polen\nE-post:",
    "dataTitle": "Vilka uppgifter vi samlar in",
    "dataList": [
      "Kontaktuppgifter såsom namn, e-postadress och telefonnummer.",
      "Bokningsuppgifter såsom upphämtningsplats, datum, tid, flygnummer och noteringar.",
      "Tekniska uppgifter såsom IP-adress och grundläggande webbläsarinformation för säkerhet."
    ],
    "whyTitle": "Varför vi behandlar dina uppgifter",
    "whyList": [
      "För att svara på din bokning och leverera tjänsten.",
      "För att kommunicera om bokningar, ändringar eller avbokningar.",
      "För att uppfylla lagkrav och förhindra missbruk."
    ],
    "legalTitle": "Rättslig grund",
    "legalList": [
      "Avtalsuppfyllelse (GDPR Art. 6(1)(b)).",
      "Rättslig förpliktelse (GDPR Art. 6(1)(c)).",
      "Berättigat intresse (GDPR Art. 6(1)(f)), såsom säkerhet och bedrägeriförebyggande."
    ],
    "storageTitle": "Hur länge vi lagrar data",
    "storageBody": "Vi sparar bokningsdata endast så länge det behövs för att leverera tjänsten och uppfylla lagkrav.",
    "shareTitle": "Vilka vi delar data med",
    "shareBody": "Vi delar endast data med tjänsteleverantörer som behövs för att leverera bokningen (t.ex. e-postleverantörer). Vi säljer inte personuppgifter.",
    "rightsTitle": "Dina rättigheter",
    "rightsList": [
      "Tillgång, rättelse eller radering av dina personuppgifter.",
      "Begränsning eller invändning mot behandling.",
      "Dataportabilitet där det är tillämpligt.",
      "Rätt att lämna klagomål till en tillsynsmyndighet."
    ],
    "contactTitle": "Kontakt",
    "contactBody": "För integritetsfrågor, kontakta oss på"
  },
  "routeLanding": {
    "orderNow": "Boka online nu",
    "quickLinks": "Snabblänkar",
    "pricingLink": "Se priser",
    "orderLinks": {
      "airportGdansk": "Boka flygplats → Gdańsk",
      "airportSopot": "Boka flygplats → Sopot",
      "airportGdynia": "Boka flygplats → Gdynia",
      "custom": "Anpassad rutt"
    },
    "pricingTitle": "Exempelpriser",
    "vehicleLabel": "Standardbil",
    "dayLabel": "Dagpris",
    "nightLabel": "Nattpris",
    "currency": "PLN",
    "pricingNote": "Priserna inkluderar moms. Nattpris gäller 22:00–06:00 samt söndagar och helgdagar.",
    "includedTitle": "Detta ingår",
    "includedList": [
      "Meet & greet på flygplatsen med tydliga upphämtningsinstruktioner.",
      "Flygspårning och flexibel upphämtningstid.",
      "Fast pris åt båda håll utan dolda avgifter.",
      "Professionella, engelsktalande förare."
    ],
    "destinationsTitle": "Populära destinationer",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Hur snabbt är bekräftelsen?",
        "answer": "De flesta bokningar bekräftas inom 5–10 minuter via e-post."
      },
      {
        "question": "Spårar ni flyg?",
        "answer": "Ja, vi övervakar ankomster och justerar upphämtningstiden."
      },
      {
        "question": "Kan jag avboka?",
        "answer": "Du kan avboka via länken i din bekräftelse-e-post."
      },
      {
        "question": "Erbjuder ni barnstolar?",
        "answer": "Ja, barnstolar finns tillgängliga på begäran vid bokning."
      },
      {
        "question": "Hur kan jag betala?",
        "answer": "Du kan betala med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
      },
      {
        "question": "Var möter jag chauffören?",
        "answer": "Du får tydliga upphämtningsinstruktioner och kontaktinfo i bekräftelsemejlet."
      }
    ]
  },
  "countryLanding": {
    "title": "Flygplatstransfer Gdańsk för resenärer från Sverige",
    "description": "Privat flygplatstransfer i Gdańsk med fasta priser, upphämtning dygnet runt och snabb bekräftelse.",
    "intro": "För flyg från Sverige till Gdańsk flygplats (GDN). Boka online och få snabb bekräftelse.",
    "ctaPrimary": "Boka transfer",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Varför boka i förväg",
    "highlights": [
      "Meet & greet med tydliga upphämtningsinstruktioner.",
      "Flygspårning och flexibel upphämtningstid.",
      "Fasta priser i PLN utan dolda avgifter.",
      "Betalning med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
    ],
    "airportsTitle": "Vanliga avgångsflygplatser (Sverige)",
    "airports": [
      "Stockholm Arlanda (ARN)",
      "Göteborg (GOT)",
      "Skellefteå (SFT)",
      "Malmö (MMX)"
    ],
    "faqTitle": "FAQ för resenärer från Sverige",
    "faq": [
      {
        "question": "Kan jag betala i SEK?",
        "answer": "Priserna är i PLN. Kortbetalningar omräknas automatiskt av din bank."
      },
      {
        "question": "Får jag kvitto eller faktura?",
        "answer": "Ja, skriv det i bokningen så skickar vi dokumentet via e-post."
      },
      {
        "question": "Spårar ni flyg?",
        "answer": "Ja, vi övervakar ankomster och justerar upphämtningstiden."
      },
      {
        "question": "Hur snabbt får jag bekräftelse?",
        "answer": "De flesta bokningar bekräftas inom 5–10 minuter via e-post."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Boka transfer",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Varför boka i förväg",
    "highlights": [
      "Meet & greet med tydliga upphämtningsinstruktioner.",
      "Flygspårning och flexibel upphämtningstid.",
      "Fasta priser i PLN utan dolda avgifter.",
      "Betalning med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
    ],
    "destinationsTitle": "Populära destinationer i Tri-City",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Finns det direktflyg från {city} till Gdańsk?",
        "answer": "Direktflyg är säsongsbaserade. Kontrollera aktuell tidtabell före resan."
      },
      {
        "question": "Hur möter jag chauffören?",
        "answer": "Du får upphämtningsinstruktioner och kontaktinfo i bekräftelsemejlet."
      },
      {
        "question": "Spårar ni flyg?",
        "answer": "Ja, vi övervakar ankomster och justerar upphämtningstiden."
      },
      {
        "question": "Kan jag betala med kort?",
        "answer": "Ja, kortbetalning är möjlig. Kontant på begäran."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Fasta priser och tillgänglighet 24/7.",
    "intro": "Taxi Gdańsk för flygplatstransfer och stadskörningar. Professionella förare, snabb bekräftelse och tydliga priser.",
    "ctaPrimary": "Boka taxi",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Varför välja oss",
    "highlights": [
      "Fasta priser utan dolda avgifter.",
      "Tillgänglig 24/7 för flygplats och stadskörning.",
      "Flygspårning och flexibel upphämtningstid.",
      "Betalning med kort, Apple Pay, Google Pay, Revolut eller kontant på begäran."
    ],
    "serviceAreaTitle": "Serviceområde",
    "serviceArea": [
      "Gdańsk gamla stan och centrum",
      "Gdańsk Wrzeszcz och Oliwa",
      "Gdańsk flygplats (GDN)",
      "Sopot och Gdynia"
    ],
    "routesTitle": "Populära taxirutter",
    "routes": [
      "Gdańsk flygplats → gamla stan",
      "Gdańsk flygplats → Sopot",
      "Gdańsk flygplats → Gdynia",
      "Gamla stan → Gdańsk flygplats"
    ],
    "cityRoutesTitle": "Taxipriser från Gdańsk flygplats",
    "cityRoutesDescription": "Se aktuellt pris från Gdańsk flygplats till dessa orter.",
    "cityRoutesItem": (destination) => `Gdańsk flygplats → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Hur snabbt är bekräftelsen?",
        "answer": "De flesta bokningar bekräftas inom 5–10 minuter via e-post."
      },
      {
        "question": "Har ni fasta priser?",
        "answer": "Ja, flygplatsrutter har fasta priser i båda riktningar."
      },
      {
        "question": "Kan jag betala med kort?",
        "answer": "Ja, kortbetalning är möjlig. Kontant på begäran."
      },
      {
        "question": "Spårar ni flyg?",
        "answer": "Ja, vi övervakar ankomster och justerar upphämtningstiden."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Ange ett giltigt telefonnummer (endast siffror).",
      "phoneLength": "Ange ett giltigt telefonnummer (7–15 siffror, valfri +).",
      "emailRequired": "Ange din e-postadress.",
      "email": "Ange en giltig e-postadress.",
      "datePast": "Välj dagens datum eller ett framtida datum.",
      "timePast": "Välj nuvarande tid eller en framtida tid.",
      "timeSoon": "Välj en tid som är minst 40 minuter från nu."
    },
    "rate": {
      "day": "Dagpris",
      "night": "Nattpris",
      "reasonDay": "standard dagpris",
      "reasonLate": "upphämtning efter 21:30 eller före 5:30",
      "reasonHoliday": "söndag/helgdag",
      "banner": (label, price, reason) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Det gick inte att skicka beställningen. Försök igen.",
    "submitNetworkError": "Nätverksfel vid skickandet. Försök igen.",
    "submittedTitle": "Beställning mottagen",
    "submittedBody": "Tack! Din förfrågan är i kö. Vänta på bekräftelse – vanligtvis 5–10 minuter. Du får snart ett bekräftelsemail.",
    "awaiting": "Väntar på bekräftelse...",
    "totalPrice": "Totalpris:",
    "orderNumber": "Beställning #:",
    "orderId": "Beställnings-ID:",
    "manageLink": "Hantera eller redigera beställningen",
    "title": "Beställ transfer",
    "date": "Datum",
    "pickupTime": "Upphämtningstid",
    "pickupType": "Upphämtningstyp",
    "pickupTypeHint": "Välj upphämtningstyp för att fortsätta.",
    "airportPickup": "Upphämtning på flygplats",
    "addressPickup": "Upphämtning på adress",
    "signServiceTitle": "Mottagning vid ankomst",
    "signServiceSign": "Möt med namnskylt",
    "signServiceFee": "+20 PLN läggs till slutpriset",
    "signServiceSelf": "Jag hittar föraren själv på parkeringen",
    "signServiceSelfNote": "Föraren kontaktar dig via WhatsApp eller telefon och ni möts.",
    "signText": "Text på skylt",
    "signPlaceholder": "Text som visas på skylten",
    "signHelp": "Föraren väntar med en skylt tills du lämnar ankomsthallen",
    "signPreview": "Skyltförhandsvisning:",
    "signEmpty": "Ditt namn visas här",
    "flightNumber": "Flygnummer",
    "flightPlaceholder": "t.ex. LO123",
    "flightUnknown": "Jag vet inte flygnumret än",
    "pickupAddress": "Upphämtningsadress",
    "pickupPlaceholder": "Ange fullständig upphämtningsadress",
    "passengers": "Antal passagerare",
    "passengersBus": [
      "5 personer",
      "6 personer",
      "7 personer",
      "8 personer"
    ],
    "passengersStandard": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer"
    ],
    "largeLuggage": "Stort bagage",
    "luggageNo": "Nej",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktinformation",
    "fullName": "Fullständigt namn",
    "namePlaceholder": "Ditt namn",
    "phoneNumber": "Telefonnummer",
    "email": "E-postadress",
    "emailPlaceholder": "din@email.com",
    "emailHelp": "Du får ett bekräftelsemail med länk för att redigera eller avboka",
    "notesTitle": "Ytterligare anteckningar (valfritt)",
    "notesPlaceholder": "Särskilda önskemål eller extra information...",
    "notesHelp": "T.ex. barnstol, väntetid, särskilda instruktioner",
    "submitting": "Skickar...",
    "formIncomplete": "Fyll i formuläret för att fortsätta",
    "confirmOrder": (price) => `Bekräfta beställning (${price} PLN)`,
    "reassurance": "Ingen förskottsbetalning. Gratis avbokning. Bekräftelse inom 5–10 min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Ange ett giltigt telefonnummer (endast siffror).",
      "phoneLength": "Ange ett giltigt telefonnummer (7–15 siffror, valfri +).",
      "email": "Ange en giltig e-postadress.",
      "datePast": "Välj dagens datum eller ett framtida datum.",
      "timePast": "Välj nuvarande tid eller en framtida tid.",
      "timeSoon": "Välj en tid som är minst 40 minuter från nu."
    },
    "submitError": "Det gick inte att skicka offertförfrågan. Försök igen.",
    "submitNetworkError": "Nätverksfel vid skickandet. Försök igen.",
    "submittedTitle": "Offertförfrågan mottagen!",
    "submittedBody": "Tack. Du får ett e-postsvar inom 5-10 minuter om erbjudandet accepteras eller avslås.",
    "manageLink": "Hantera din beställning",
    "title": "Begär anpassad offert",
    "subtitle": "Föreslå ditt pris och få svar inom 5-10 minuter",
    "requestButton": "Begär offert",
    "requestAnother": "Begär en ny offert",
    "toggleDescription": "Ange resedetaljer och föreslå ditt pris. Du får svar inom 5-10 minuter.",
    "pickupType": "Upphämtningstyp",
    "airportPickup": "Upphämtning på flygplats",
    "addressPickup": "Upphämtning på adress",
    "lockMessage": "Välj upphämtningstyp för att låsa upp resten av formuläret.",
    "pickupAddress": "Upphämtningsadress",
    "pickupPlaceholder": "Ange upphämtningsadress (t.ex. Gdańsk Airport, ul. Słowackiego 200)",
    "pickupAutoNote": "Upphämtningsadress på flygplats sätts automatiskt",
    "destinationAddress": "Destinationsadress",
    "destinationPlaceholder": "Ange destinationsadress (t.ex. Gdańsk Centrum, ul. Długa 1)",
    "price": "Pris",
    "proposedPriceLabel": "Ditt föreslagna pris (PLN)",
    "taximeterTitle": "Enter the address to see the price. If it doesn't fit, propose your own.",
    "tariff1": "Tariff 1 (stad, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (stad, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (utanför stad, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (utanför stad, 22–6): 11.70 PLN/km.",
    "autoPriceNote": "Kalkylatorn uppskattar priset efter att du har angett adresserna.",
    "fixedPriceHint": "Om du vill föreslå fast pris, klicka här och fyll i fältet.",
    "pricePlaceholder": "Ange ditt erbjudande i PLN (t.ex. 150)",
    "priceHelp": "Föreslå ditt pris för resan. Vi granskar och svarar inom 5-10 minuter.",
    "fixedRouteChecking": "Checking if this route qualifies for a fixed price...",
    "fixedRouteTitle": "Fixed price available",
    "fixedRouteDistance": (distance) => `Distance: ${distance} km`,
    "fixedRouteComputed": (price) => `${price} PLN`,
    "fixedRouteCta": "Book fixed price",
    "fixedRouteHint": "Use the fixed-price booking for the fastest confirmation.",
    "fixedRouteAllDay": "All-day rate applies",
    "fixedRouteDay": "Day rate applies",
    "fixedRouteNight": "Night rate applies",
    "fixedRouteLocked": "This route qualifies for a fixed price. Please book via the fixed-price form.",
    "longRouteTitle": "Long route estimate",
    "longRouteDistance": (distance) => `Distance: ${distance} km`,
    "longRouteTaximeter": (price, rate) => `Taximeter: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price) => `Proposed price: ${price} PLN`,
    "longRouteSavings": (percent) => `Savings: ${percent}%`,
    "longRouteNote": "You can still enter your own price below.",
    "date": "Datum",
    "pickupTime": "Upphämtningstid",
    "signServiceTitle": "Mottagning vid ankomst",
    "signServiceSign": "Möt med namnskylt",
    "signServiceFee": "+20 PLN läggs till slutpriset",
    "signServiceSelf": "Jag hittar föraren själv på parkeringen",
    "signServiceSelfNote": "Föraren kontaktar dig via WhatsApp eller telefon och ni möts.",
    "signText": "Text på skylt",
    "signPlaceholder": "Text som visas på skylten",
    "signHelp": "Föraren väntar med en skylt tills du lämnar ankomsthallen",
    "signPreview": "Skyltförhandsvisning:",
    "signEmpty": "Ditt namn visas här",
    "flightNumber": "Flygnummer",
    "flightPlaceholder": "t.ex. LO123",
    "passengers": "Antal passagerare",
    "passengersOptions": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer",
      "5+ personer"
    ],
    "largeLuggage": "Stort bagage",
    "luggageNo": "Nej",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktinformation",
    "fullName": "Fullständigt namn",
    "namePlaceholder": "Ditt namn",
    "phoneNumber": "Telefonnummer",
    "email": "E-postadress",
    "emailPlaceholder": "din@email.com",
    "emailHelp": "Du får svar inom 5-10 minuter",
    "notesTitle": "Ytterligare anteckningar (valfritt)",
    "notesPlaceholder": "Särskilda önskemål eller extra information...",
    "notesHelp": "T.ex. barnstol, väntetid, särskilda instruktioner",
    "submitting": "Skickar...",
    "formIncomplete": "Fyll i formuläret för att fortsätta",
    "submit": "Skicka offertförfrågan"
  },
  "manageOrder": {
    "errors": {
      "load": "Det gick inte att ladda beställningen.",
      "loadNetwork": "Nätverksfel vid laddning av beställning.",
      "save": "Det gick inte att spara ändringar.",
      "saveNetwork": "Nätverksfel vid sparande av ändringar.",
      "cancel": "Det gick inte att avboka beställningen.",
      "cancelNetwork": "Nätverksfel vid avbokning.",
      "copySuccess": "Kopierat till urklipp",
      "copyFail": "Det gick inte att kopiera",
      "emailRequired": "Ange din e-postadress."
    },
    "loading": "Laddar din beställning...",
    "accessTitle": "Få åtkomst till bokningen",
    "accessBody": "Ange e-postadressen som användes vid bokning.",
    "accessPlaceholder": "du@example.com",
    "accessAction": "Fortsätt",
    "accessChecking": "Kontrollerar...",
    "cancelledTitle": "Beställning avbokad",
    "cancelledBody": "Din beställning har avbokats. Om detta var ett misstag, gör en ny bokning.",
    "manageTitle": "Hantera din transfer",
    "copyAction": "Kopiera",
    "orderLabel": "Beställning #",
    "orderIdLabel": "Beställnings-ID",
    "detailsUpdatedTitle": "Detaljer uppdaterade",
    "updateSubmittedTitle": "Uppdatering skickad",
    "updateSubmittedBody": "Din uppdateringsförfrågan skickades. Vi granskar den och återkommer.",
    "awaiting": "Väntar på bekräftelse...",
    "transferRoute": "Transfersträcka",
    "priceLabel": "Pris:",
    "pricePending": "Pris bekräftas individuellt",
    "taximeterTitle": "Price calculated by taximeter",
    "taximeterRates": "View taximeter rates",
    "tariff1": "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    "statusConfirmed": "Bekräftad",
    "statusCompleted": "Slutförd",
    "statusFailed": "Ej slutförd",
    "statusRejected": "Avslagen",
    "statusPriceProposed": "Pris föreslaget",
    "statusPending": "Väntande",
    "bookingDetails": "Bokningsdetaljer",
    "editDetails": "Redigera detaljer",
    "updateRequested": "Fält som ska uppdateras",
    "confirmedEditNote": "Att redigera en bekräftad beställning skickar den tillbaka för godkännande.",
    "updateFieldsNote": "Uppdatera de markerade fälten och spara ändringarna.",
    "confirmedNote": "Denna beställning är bekräftad.",
    "completedNote": "Denna beställning är markerad som slutförd.",
    "failedNote": "Denna beställning är markerad som ej slutförd.",
    "priceProposedNote": "Ett nytt pris har föreslagits. Kontrollera din e-post för att godkänna eller avslå.",
    "rejectedNote": "Denna beställning har avslagits. Redigering är avstängd men du kan avboka.",
    "rejectionReasonLabel": "Orsak:",
    "date": "Datum",
    "pickupTime": "Upphämtningstid",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "Föraren kontaktar dig via WhatsApp eller telefon och ni möts.",
    "signText": "Text på skylt",
    "flightNumber": "Flygnummer",
    "pickupAddress": "Upphämtningsadress",
    "passengers": "Antal passagerare",
    "passengersBus": [
      "5 personer",
      "6 personer",
      "7 personer",
      "8 personer"
    ],
    "passengersStandard": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer"
    ],
    "largeLuggage": "Stort bagage",
    "luggageNo": "Nej",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktinformation",
    "fullName": "Fullständigt namn",
    "phoneNumber": "Telefonnummer",
    "email": "E-postadress",
    "notesTitle": "Ytterligare anteckningar (valfritt)",
    "saveChanges": "Spara ändringar",
    "cancelEdit": "Avbryt",
    "editBooking": "Redigera bokning",
    "cancelBooking": "Avboka bokning",
    "changesNotice": "Ändringar bekräftas via e-post. Vid brådskande ändringar, kontakta booking@taxiairportgdansk.com",
    "updateRequestNote": "Din bokning har uppdaterats. Granska och bekräfta ändringarna.",
    "rejectNote": "Denna bokning har avslagits. Kontakta support vid frågor.",
    "cancelPromptTitle": "Avboka bokning?",
    "cancelPromptBody": "Är du säker på att du vill avboka? Detta kan inte ångras.",
    "confirmCancel": "Ja, avboka",
    "keepBooking": "Behåll bokning",
    "copyOrderLabel": "Beställning #",
    "copyOrderIdLabel": "Beställnings-ID"
  },
  "adminOrders": {
    "title": "Adminbeställningar",
    "subtitle": "Alla senaste beställningar och status.",
    "loading": "Laddar beställningar...",
    "missingToken": "Admin-token saknas.",
    "errorLoad": "Det gick inte att ladda beställningar.",
    "filters": {
      "all": "All",
      "active": "In progress",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "price_proposed": "Price proposed",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "columns": {
      "order": "Beställning",
      "pickup": "Upphämtning",
      "customer": "Kund",
      "price": "Pris",
      "status": "Status",
      "open": "Öppna"
    },
    "empty": "Inga beställningar hittades.",
    "view": "Visa"
  },
  "adminOrder": {
    "title": "Adminbeställning detaljer",
    "subtitle": "Hantera, bekräfta eller avslå beställningen.",
    "back": "Tillbaka till alla beställningar",
    "loading": "Laddar beställning...",
    "missingToken": "Admin-token saknas.",
    "errorLoad": "Det gick inte att ladda beställning.",
    "updated": "Beställningen uppdaterad.",
    "updateError": "Det gick inte att uppdatera beställningen.",
    "statusUpdated": "Beställningsstatus uppdaterad.",
    "updateRequestSent": "Uppdateringsförfrågan skickad till kunden.",
    "updateRequestError": "Det gick inte att skicka uppdateringsförfrågan.",
    "updateRequestSelect": "Välj minst ett fält att uppdatera.",
    "orderLabel": "Beställning",
    "idLabel": "ID",
    "customerLabel": "Kund",
    "pickupLabel": "Upphämtning",
    "priceLabel": "Pris",
    "additionalInfo": "Ytterligare info",
    "passengers": "Passagerare:",
    "largeLuggage": "Stort bagage:",
    "pickupType": "Upphämtningstyp:",
    "signService": "Upphämtningssätt:",
    "signServiceSign": "Möt med namnskylt",
    "signServiceSelf": "Hitta föraren själv",
    "signFee": "Skyltavgift:",
    "flightNumber": "Flygnummer:",
    "signText": "Text på skylt:",
    "route": "Rutt:",
    "notes": "Anteckningar:",
    "adminActions": "Adminåtgärder",
    "confirmOrder": "Bekräfta beställning",
    "rejectOrder": "Avslå beställning",
    "proposePrice": "Föreslå nytt pris (PLN)",
    "sendPrice": "Skicka prisförslag",
    "rejectionReason": "Avslagsorsak (valfritt)",
    "requestUpdate": "Begär kunduppdatering",
    "requestUpdateBody": "Välj fält som kunden ska uppdatera. De får ett e-postmeddelande med redigeringslänk.",
    "fieldPhone": "Telefonnummer",
    "fieldEmail": "E-postadress",
    "fieldFlight": "Flygnummer",
    "requestUpdateAction": "Begär uppdatering",
    "cancelConfirmedTitle": "Confirmed order cancellation",
    "cancelConfirmedBody": "Send a cancellation email due to lack of taxi availability at the requested time.",
    "cancelConfirmedAction": "Cancel confirmed order",
    "cancelConfirmedConfirm": "Cancel this confirmed order and notify the customer?",
    "cancelConfirmedSuccess": "Order cancelled.",
    "deleteRejectedTitle": "Delete rejected order",
    "deleteRejectedBody": "Remove this rejected order permanently.",
    "deleteRejectedAction": "Delete rejected order",
    "deleteRejectedConfirm": "Delete this rejected order permanently?",
    "deleteRejectedSuccess": "Order deleted.",
    "completionTitle": "Slutförandestatus",
    "markCompleted": "Markera som slutförd",
    "markCompletedConfirm": "Mark this order as completed?",
    "markFailed": "Markera som ej slutförd",
    "markFailedConfirm": "Mark this order as not completed?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Gdańsk flygplats taxi",
      "description": "Boka en snabb och pålitlig flygplatstaxi från Gdańsk flygplats. Fast pris åt båda håll, professionella förare och snabb bekräftelse.",
      "route": "Gdańsk flygplats",
      "examples": [
        "Gdańsk gamla stan",
        "Gdańsk Oliwa",
        "Gdańsk centralstation",
        "Brzeźno Beach"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Transfer från Gdańsk flygplats till Sopot",
      "description": "Privat transfer mellan Gdańsk flygplats och Sopot med fast pris åt båda håll och flygspårning.",
      "route": "Gdańsk flygplats ↔ Sopot",
      "examples": [
        "Sopot Pier",
        "Sopot centrum",
        "Sopot hotell",
        "Sopot järnvägsstation"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Transfer från Gdańsk flygplats till Gdynia",
      "description": "Bekväm transfer mellan Gdańsk flygplats och Gdynia med fast pris åt båda håll.",
      "route": "Gdańsk flygplats ↔ Gdynia",
      "examples": [
        "Gdynia centrum",
        "Gdynia hamn",
        "Gdynia hotell",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
};
const sv$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: sv
}, Symbol.toStringTag, { value: "Module" }));
const da = {
  "common": {
    "whatsapp": "WhatsApp",
    "bookViaWhatsapp": "Book via WhatsApp",
    "progress": "Fremskridt",
    "stepCounter": (current, total) => `Trin ${current}/${total}`,
    "remainingFields": (count) => `${count} felter tilbage`,
    "orderOnlineNow": "Book taxi online",
    "callNow": "Ring nu",
    "orderNow": "Book nu",
    "continue": "Fortsæt",
    "back": "Tilbage",
    "optional": "valgfrit",
    "close": "Luk",
    "noPrepayment": "Ingen forudbetaling",
    "backToHome": "← Tilbage til forsiden",
    "notFoundTitle": "Siden blev ikke fundet",
    "notFoundBody": "Siden du leder efter findes ikke eller er flyttet.",
    "notFoundCta": "Gå til forsiden",
    "notFoundSupport": "Hvis dette er en fejl, kontakt os:",
    "notFoundRequested": "Anmodet URL",
    "notFoundPopular": "Populære sider",
    "actualBadge": "AKTUEL",
    "priceFrom": "fra",
    "perNight": "om natten",
    "perDay": "til centrum (dag)",
    "whatsappMessage": "Hej Taxi Airport Gdańsk, jeg vil gerne booke en transfer."
  },
  "navbar": {
    "home": "Hjem",
    "fleet": "Vores flåde",
    "airportTaxi": "Gdańsk lufthavn taxa",
    "airportSopot": "Lufthavn ↔ Sopot",
    "airportGdynia": "Lufthavn ↔ Gdynia",
    "prices": "Priser",
    "orderNow": "BOOK NU",
    "language": "Sprog"
  },
  "hero": {
    "promo": {
      "dayPrice": "KUN 100 PLN",
      "dayLabel": "til centrum (dag)",
      "nightPrice": "120 PLN",
      "nightLabel": "om natten"
    },
    "logoAlt": "Taxi Airport Gdańsk - Lufthavnstransfer & limousineservice",
    "orderViaEmail": "Bestil via e-mail",
    "headline": "Gdańsk lufthavn taxa – transfer til Gdańsk, Sopot og Gdynia",
    "subheadline": "Gdansk airport taxi med faste priser, 24/7 og hurtig bekræftelse.",
    "whyChoose": "Hvorfor vælge Taxi Airport Gdańsk",
    "benefits": "Fordele",
    "benefitsList": {
      "flightTrackingTitle": "Flysporing",
      "flightTrackingBody": "Vi overvåger ankomster og justerer afhentningstid automatisk.",
      "meetGreetTitle": "Meet & greet",
      "meetGreetBody": "Professionelle chauffører, klar kommunikation og hjælp med bagage.",
      "fastConfirmationTitle": "Hurtig bekræftelse",
      "fastConfirmationBody": "De fleste bookinger bekræftes inden for 5–10 minutter.",
      "flexiblePaymentsTitle": "Fleksible betalinger",
      "flexiblePaymentsBody": "Kort, Apple Pay, Google Pay, Revolut eller kontant.",
      "freePrebookingTitle": "Gratis forudbestilling",
      "freePrebookingBody": "Afbryd når som helst gratis. Fuldt automatiseret.",
      "fixedPriceTitle": "Fastprisgaranti",
      "fixedPriceBody": "Fast pris begge veje. Den pris du bestiller, er den pris du betaler.",
      "localExpertiseTitle": "Lokal ekspertise",
      "localExpertiseBody": "Erfarne Tri-City-chauffører med de hurtigste ruter.",
      "assistanceTitle": "24/7 assistance",
      "assistanceBody": "Altid tilgængelig før, under og efter turen."
    },
    "fleetTitle": "Vores flåde",
    "fleetLabel": "Køretøjer",
    "standardCarsTitle": "Standardbiler",
    "standardCarsBody": "1-4 passagerer | Komfortable sedaner og SUV’er",
    "busTitle": "Og flere busser",
    "busBody": "5-8 passagerer | Perfekt til større grupper"
  },
  "vehicle": {
    "title": "Vælg dit køretøj",
    "subtitle": "Vælg køretøjstype, der passer til gruppestørrelsen",
    "standardTitle": "Standardbil",
    "standardPassengers": "1-4 passagerer",
    "standardDescription": "Perfekt til enkeltpersoner, par og små familier",
    "busTitle": "BUS Service",
    "busPassengers": "5-8 passagerer",
    "busDescription": "Ideel til større grupper og familier med ekstra bagage",
    "selfManageBadge": "Rediger eller afbestil din booking selv",
    "examplePrices": "Eksempelpriser:",
    "airportGdansk": "Lufthavn ↔ Gdańsk",
    "airportSopot": "Lufthavn ↔ Sopot",
    "airportGdynia": "Lufthavn ↔ Gdynia",
    "selectStandard": "Vælg standardbil",
    "selectBus": "Vælg BUS Service"
  },
  "pricing": {
    "back": "Tilbage til køretøjsvalg",
    "titleStandard": "Standardbil (1-4 passagerer)",
    "titleBus": "BUS Service (5-8 passagerer)",
    "description": "Faste priser begge veje (til og fra lufthavnen). Ingen skjulte gebyrer. Nattakst gælder 22–6 samt søndage og helligdage.",
    "directionFromAirport": "Fra lufthavnen",
    "directionToAirport": "Til lufthavnen",
    "dayRate": "Dagpris",
    "nightRate": "Natpris",
    "sundayNote": "(Søndage & helligdage)",
    "customRouteTitle": "Tilpasset rute",
    "customRouteBody": "Har du brug for en anden destination?",
    "customRoutePrice": "Faste priser",
    "customRoutePriceBody": "Fleksible priser baseret på ruten",
    "customRouteAutoNote": "Kalkulatoren estimerer prisen, når du har indtastet adresserne.",
    "requestQuote": "Book nu",
    "pricesNote": "Priserne inkluderer moms. Flere destinationer efter aftale.",
    "tableTitle": "Pristabel",
    "tableRoute": "Rute",
    "tableStandardDay": "Standard dag",
    "tableStandardNight": "Standard nat",
    "tableBusDay": "Bus dag",
    "tableBusNight": "Bus nat",
    "tariffsTitle": "Priser for tilpassede ruter",
    "tariffsName": "Takst",
    "tariffsRate": "Pris",
    "bookingTitle": "Book transfer",
    "bookingSubtitle": "Vælg køretøjstype og book turen med det samme.",
    "routes": {
      "airport": "Lufthavn",
      "gdansk": "Gdańsk centrum",
      "gdynia": "Gdynia centrum"
    }
  },
  "pricingLanding": {
    "title": "Priser på Gdańsk lufthavnstaxa",
    "subtitle": "Fastpris på lufthavnstransfer og klar prissætning for tilpassede ruter.",
    "description": "Sammenlign standard- og buspriser, og book med det samme eller få et tilbud.",
    "cta": "Book transfer",
    "calculatorCta": "Beregner",
    "highlights": [
      {
        "title": "Fastpris begge veje",
        "body": "De viste lufthavnsruter har fast pris uden skjulte gebyrer."
      },
      {
        "title": "Tilgængelig 24/7",
        "body": "Vi er tilgængelige hver dag med hurtig bekræftelse og support."
      },
      {
        "title": "Busservice til grupper",
        "body": "Rummelige 5–8-personers køretøjer til familier og større grupper."
      }
    ],
    "faqTitle": "Pris-FAQ",
    "faq": [
      {
        "question": "Er priserne faste?",
        "answer": "Ja. Lufthavnsruter har fast pris begge veje. Tilpassede ruter prissættes individuelt."
      },
      {
        "question": "Hvornår gælder natpris?",
        "answer": "Fra 22:00 til 6:00 samt på søndage og helligdage."
      },
      {
        "question": "Overvåger I flyforsinkelser?",
        "answer": "Ja, vi følger ankomster og justerer afhentningstiden."
      },
      {
        "question": "Kan jeg betale med kort?",
        "answer": "Kortbetaling efter aftale. Faktura til erhvervskunder."
      }
    ]
  },
  "pricingCalculator": {
    "title": "Prisberegner",
    "subtitle": "Indtast afhentning og destination for et prisestimat.",
    "airportLabel": "Gdańsk lufthavn",
    "airportAddress": "Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk",
    "pickupCustomLabel": "Afhentning fra adresse",
    "destinationCustomLabel": "Destinationsadresse",
    "pickupLabel": "Afhentningssted",
    "pickupPlaceholder": "f.eks. Gdańsk Airport, Słowackiego 200",
    "destinationLabel": "Destination",
    "destinationPlaceholder": "f.eks. Sopot, Monte Cassino 1",
    "distanceLabel": "Distance",
    "resultsTitle": "Estimeret pris",
    "fixedAllDay": "Hele dagen",
    "dayRate": "Dagpris",
    "nightRate": "Natpris",
    "dayRateLabel": "Dagpris",
    "allDayRateLabel": "Døgnpris",
    "guaranteedPriceLabel": "Garanteret pris",
    "standard": "Standard",
    "bus": "Bus",
    "loading": "Beregner rute...",
    "noResult": "Ruten kunne ikke beregnes. Prøv en mere præcis adresse.",
    "longRouteTitle": "Prisoverslag for lang rute",
    "taximeterLabel": "Taxameter",
    "proposedLabel": "Foreslået pris",
    "savingsLabel": "Besparelse",
    "orderNow": "Book nu",
    "note": "Priserne er faste. Du kan foreslå en anden pris i bestillingsformularen for en anden rute."
  },
  "trust": {
    "googleReviewsTitle": "Google-anmeldelser",
    "googleReviewsCta": "Se anmeldelser",
    "googleReviewsCountLabel": "anmeldelser",
    "companyTitle": "Virksomhedsoplysninger",
    "paymentTitle": "Betaling & faktura",
    "comfortTitle": "Komfort & sikkerhed",
    "paymentBody": "Betal kontant eller med kort. Faktura til erhvervskunder.",
    "comfortBody": "Barnesæder efter aftale. Professionelle, licenserede chauffører og dør-til-dør-hjælp."
  },
  "trustBar": {
    "ariaLabel": "Tillidssignaler",
    "instantConfirmation": "Hurtig bekræftelse",
    "meetGreetOptional": "Meet & greet valgfrit",
    "noPrepayment": "Ingen forudbetaling",
    "supportWhatsappEmail": "Support: WhatsApp og e-mail",
    "vatInvoice": "Momsfaktura"
  },
  "footer": {
    "description": "Professionel lufthavnstransfer i Tri-City-området. Tilgængelig 24/7.",
    "contactTitle": "Kontakt",
    "location": "Gdańsk, Polen",
    "bookingNote": "Bestil online, via WhatsApp eller e-mail",
    "hoursTitle": "Åbningstider",
    "hoursBody": "24/7 - tilgængelig hver dag",
    "hoursSub": "Lufthavnsafhentning, bytransfer og tilpassede ruter",
    "routesTitle": "Populære ruter",
    "rights": "Alle rettigheder forbeholdes.",
    "cookiePolicy": "Cookies",
    "privacyPolicy": "Privatlivspolitik"
  },
  "cookieBanner": {
    "title": "Cookie-indstillinger",
    "body": "Vi bruger nødvendige cookies for at holde bookingprocessen sikker og pålidelig. Med dit samtykke bruger vi også marketingcookies til at måle konverteringer. Du kan ændre dit valg ved at rydde browserens lager.",
    "readPolicy": "Læs politikken",
    "decline": "Afvis",
    "accept": "Acceptér cookies"
  },
  "cookiePolicy": {
    "title": "Cookiepolitik",
    "updated": "Sidst opdateret: 2. januar 2026",
    "intro": "Denne hjemmeside bruger cookies for at fungere pålideligt og holde din booking sikker. Med dit samtykke bruger vi også marketingcookies til at måle konverteringer.",
    "sectionCookies": "Hvilke cookies vi bruger",
    "cookiesList": [
      "Nødvendige cookies for sikkerhed og misbrugsforebyggelse.",
      "Præferencecookies til at huske grundlæggende valg under en session.",
      "Marketingcookies til at måle konverteringer fra annoncer (Google Ads)."
    ],
    "sectionManage": "Sådan kan du administrere cookies",
    "manageBody1": "Du kan til enhver tid slette cookies i browserens indstillinger. Blokering af nødvendige cookies kan forhindre bookingformularen i at fungere.",
    "manageBody2": "Du kan også ændre dit valg for marketingcookies ved at rydde browserens lager og besøge siden igen.",
    "contact": "Kontakt",
    "contactBody": "Hvis du har spørgsmål om denne politik, kontakt os på"
  },
  "privacyPolicy": {
    "title": "Privatlivspolitik",
    "updated": "Sidst opdateret: 2. januar 2026",
    "intro": "Denne privatlivspolitik forklarer, hvordan Taxi Airport Gdańsk indsamler og behandler personoplysninger, når du bruger vores tjenester.",
    "controllerTitle": "Dataansvarlig",
    "controllerBody": "Taxi Airport Gdańsk\nGdańsk, Polen\nE-mail:",
    "dataTitle": "Hvilke data vi indsamler",
    "dataList": [
      "Kontaktoplysninger som navn, e-mailadresse og telefonnummer.",
      "Bookingoplysninger som afhentningssted, dato, tid, flynummer og noter.",
      "Tekniske data som IP-adresse og grundlæggende browseroplysninger for sikkerhed."
    ],
    "whyTitle": "Hvorfor vi behandler dine data",
    "whyList": [
      "For at besvare din booking og levere tjenesten.",
      "For at kommunikere om bookinger, ændringer eller aflysninger.",
      "For at opfylde juridiske forpligtelser og forebygge misbrug."
    ],
    "legalTitle": "Retsgrundlag",
    "legalList": [
      "Opfyldelse af kontrakt (GDPR art. 6(1)(b)).",
      "Juridisk forpligtelse (GDPR art. 6(1)(c)).",
      "Legitime interesser (GDPR art. 6(1)(f)), fx sikkerhed og forebyggelse af svindel."
    ],
    "storageTitle": "Hvor længe vi opbevarer data",
    "storageBody": "Vi opbevarer bookingdata kun så længe det er nødvendigt for at levere tjenesten og opfylde lovkrav.",
    "shareTitle": "Hvem vi deler data med",
    "shareBody": "Vi deler kun data med tjenesteudbydere, der er nødvendige for at levere bookingen (fx e-mailtjenester). Vi sælger ikke personoplysninger.",
    "rightsTitle": "Dine rettigheder",
    "rightsList": [
      "Indsigt, rettelse eller sletning af dine personoplysninger.",
      "Begrænsning eller indsigelse mod behandling.",
      "Dataportabilitet, hvor det er relevant.",
      "Ret til at klage til en tilsynsmyndighed."
    ],
    "contactTitle": "Kontakt",
    "contactBody": "For henvendelser om privatliv, kontakt os på"
  },
  "routeLanding": {
    "orderNow": "Book online nu",
    "quickLinks": "Hurtige links",
    "pricingLink": "Se priser",
    "orderLinks": {
      "airportGdansk": "Book lufthavn → Gdańsk",
      "airportSopot": "Book lufthavn → Sopot",
      "airportGdynia": "Book lufthavn → Gdynia",
      "custom": "Tilpasset rute"
    },
    "pricingTitle": "Eksempelpriser",
    "vehicleLabel": "Standardbil",
    "dayLabel": "Dagpris",
    "nightLabel": "Natpris",
    "currency": "PLN",
    "pricingNote": "Priserne inkluderer moms. Natpris gælder 22:00–06:00 samt søndage og helligdage.",
    "includedTitle": "Hvad er inkluderet",
    "includedList": [
      "Meet & greet i lufthavnen med klare afhentningsinstruktioner.",
      "Flysporing og fleksibel afhentningstid.",
      "Fast pris begge veje uden skjulte gebyrer.",
      "Professionelle, engelsktalende chauffører."
    ],
    "destinationsTitle": "Populære destinationer",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Hvor hurtigt er bekræftelsen?",
        "answer": "De fleste bookinger bekræftes inden for 5–10 minutter via e-mail."
      },
      {
        "question": "Sporer I fly?",
        "answer": "Ja, vi overvåger ankomster og justerer afhentningstiden."
      },
      {
        "question": "Kan jeg afbestille?",
        "answer": "Du kan afbestille via linket i din bekræftelses-e-mail."
      },
      {
        "question": "Tilbyder I barnesæder?",
        "answer": "Ja, barnesæder er tilgængelige efter aftale ved booking."
      },
      {
        "question": "Hvordan kan jeg betale?",
        "answer": "Du kan betale med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
      },
      {
        "question": "Hvor møder jeg chaufføren?",
        "answer": "Du får klare afhentningsinstruktioner og kontaktinfo i bekræftelses-e-mailen."
      }
    ]
  },
  "countryLanding": {
    "title": "Lufthavnstransfer Gdańsk for rejsende fra Danmark",
    "description": "Privat lufthavnstransfer i Gdańsk med faste priser, afhentning 24/7 og hurtig bekræftelse.",
    "intro": "Til fly fra Danmark til Gdańsk lufthavn (GDN). Book online og få hurtig bekræftelse.",
    "ctaPrimary": "Book transfer",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Hvorfor booke på forhånd",
    "highlights": [
      "Meet & greet med klare afhentningsinstruktioner.",
      "Flysporing og fleksibel afhentningstid.",
      "Faste priser i PLN uden skjulte gebyrer.",
      "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
    ],
    "airportsTitle": "Typiske afgangslufthavne (Danmark)",
    "airports": [
      "København (CPH)",
      "Billund (BLL)",
      "Aarhus (AAR)"
    ],
    "faqTitle": "FAQ for rejsende fra Danmark",
    "faq": [
      {
        "question": "Kan jeg betale i DKK?",
        "answer": "Priserne er i PLN. Kortbetalinger omregnes automatisk af din bank."
      },
      {
        "question": "Kan jeg få kvittering eller faktura?",
        "answer": "Ja, skriv det i bookingen, så sender vi dokumentet på e-mail."
      },
      {
        "question": "Sporer I fly?",
        "answer": "Ja, vi overvåger ankomster og justerer afhentningstiden."
      },
      {
        "question": "Hvor hurtigt får jeg bekræftelse?",
        "answer": "De fleste bookinger bekræftes inden for 5–10 minutter via e-mail."
      }
    ]
  },
  "airportLanding": {
    "ctaPrimary": "Book transfer",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Hvorfor booke på forhånd",
    "highlights": [
      "Meet & greet med klare afhentningsinstruktioner.",
      "Flysporing og fleksibel afhentningstid.",
      "Faste priser i PLN uden skjulte gebyrer.",
      "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
    ],
    "destinationsTitle": "Populære destinationer i Tri-City",
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Er der direkte fly fra {city} til Gdańsk?",
        "answer": "Direkte fly er sæsonbaserede. Tjek den aktuelle tidsplan før rejsen."
      },
      {
        "question": "Hvordan møder jeg chaufføren?",
        "answer": "Du modtager afhentningsinstruktioner og kontaktinfo i bekræftelses-e-mailen."
      },
      {
        "question": "Sporer I fly?",
        "answer": "Ja, vi overvåger ankomster og justerer afhentningstiden."
      },
      {
        "question": "Kan jeg betale med kort?",
        "answer": "Ja, kortbetaling er muligt. Kontant efter aftale."
      }
    ]
  },
  "cityTaxi": {
    "title": "Taxi Gdańsk",
    "subtitle": "Faste priser og tilgængelighed 24/7.",
    "intro": "Taxi Gdańsk til lufthavnstransfer og byture. Professionelle chauffører, hurtig bekræftelse og klare priser.",
    "ctaPrimary": "Book taxi",
    "ctaSecondary": "Se priser",
    "highlightsTitle": "Hvorfor vælge os",
    "highlights": [
      "Faste priser uden skjulte gebyrer.",
      "Tilgængelig 24/7 til lufthavn og byture.",
      "Flysporing og fleksibel afhentningstid.",
      "Betaling med kort, Apple Pay, Google Pay, Revolut eller kontant efter aftale."
    ],
    "serviceAreaTitle": "Serviceområde",
    "serviceArea": [
      "Gdańsk gamle by og centrum",
      "Gdańsk Wrzeszcz og Oliwa",
      "Gdańsk lufthavn (GDN)",
      "Sopot og Gdynia"
    ],
    "routesTitle": "Populære taxiruter",
    "routes": [
      "Gdańsk lufthavn → gamle by",
      "Gdańsk lufthavn → Sopot",
      "Gdańsk lufthavn → Gdynia",
      "Gamle by → Gdańsk lufthavn"
    ],
    "cityRoutesTitle": "Taxipriser fra Gdańsk lufthavn",
    "cityRoutesDescription": "Se den aktuelle pris fra Gdańsk lufthavn til disse destinationer.",
    "cityRoutesItem": (destination) => `Gdańsk lufthavn → ${destination}`,
    "faqTitle": "FAQ",
    "faq": [
      {
        "question": "Hvor hurtigt er bekræftelsen?",
        "answer": "De fleste bookinger bekræftes inden for 5–10 minutter via e-mail."
      },
      {
        "question": "Har I faste priser?",
        "answer": "Ja, lufthavnsruter har faste priser i begge retninger."
      },
      {
        "question": "Kan jeg betale med kort?",
        "answer": "Ja, kortbetaling er muligt. Kontant efter aftale."
      },
      {
        "question": "Sporer I fly?",
        "answer": "Ja, vi overvåger ankomster og justerer afhentningstiden."
      }
    ]
  },
  "orderForm": {
    "validation": {
      "phoneLetters": "Indtast venligst et gyldigt telefonnummer (kun tal).",
      "phoneLength": "Indtast venligst et gyldigt telefonnummer (7–15 cifre, valgfri +).",
      "emailRequired": "Indtast din e-mailadresse.",
      "email": "Indtast venligst en gyldig e-mailadresse.",
      "datePast": "Vælg dagens dato eller en fremtidig dato.",
      "timePast": "Vælg nuværende tidspunkt eller et fremtidigt tidspunkt.",
      "timeSoon": "Vælg et tidspunkt som er mindst 40 minutter fra nu."
    },
    "rate": {
      "day": "Dagpris",
      "night": "Natpris",
      "reasonDay": "standard dagpris",
      "reasonLate": "afhentning efter 21:30 eller før 5:30",
      "reasonHoliday": "søndag/helligdag",
      "banner": (label, price, reason) => `${label}: ${price} PLN (${reason})`
    },
    "submitError": "Bestillingen kunne ikke sendes. Prøv igen.",
    "submitNetworkError": "Netværksfejl ved afsendelse af bestillingen. Prøv igen.",
    "submittedTitle": "Bestilling modtaget",
    "submittedBody": "Tak! Din anmodning er i kø. Vent på bekræftelse – normalt 5–10 minutter. Du modtager snart en bekræftelses-e-mail.",
    "awaiting": "Afventer bekræftelse...",
    "totalPrice": "Samlet pris:",
    "orderNumber": "Bestilling #:",
    "orderId": "Bestillings-ID:",
    "manageLink": "Administrer eller rediger din bestilling",
    "title": "Bestil transfer",
    "date": "Dato",
    "pickupTime": "Afhentningstid",
    "pickupType": "Afhentningstype",
    "pickupTypeHint": "Vælg afhentningstype for at fortsætte.",
    "airportPickup": "Afhentning i lufthavn",
    "addressPickup": "Afhentning på adresse",
    "signServiceTitle": "Modtagelse ved ankomst",
    "signServiceSign": "Mød med navneskilt",
    "signServiceFee": "+20 PLN lægges til slutprisen",
    "signServiceSelf": "Jeg finder selv chaufføren på parkeringen",
    "signServiceSelfNote": "Chaufføren kontakter dig via WhatsApp eller telefon, og I mødes.",
    "signText": "Tekst på skilt",
    "signPlaceholder": "Tekst til afhentningsskilt",
    "signHelp": "Chaufføren venter med et skilt, indtil du forlader ankomsthallen",
    "signPreview": "Skiltforhåndsvisning:",
    "signEmpty": "Dit navn vises her",
    "flightNumber": "Flynummer",
    "flightPlaceholder": "f.eks. LO123",
    "flightUnknown": "Jeg kender ikke flynummeret endnu",
    "pickupAddress": "Afhentningsadresse",
    "pickupPlaceholder": "Indtast fuld afhentningsadresse",
    "passengers": "Antal passagerer",
    "passengersBus": [
      "5 personer",
      "6 personer",
      "7 personer",
      "8 personer"
    ],
    "passengersStandard": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer"
    ],
    "largeLuggage": "Stor bagage",
    "luggageNo": "Nej",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktoplysninger",
    "fullName": "Fulde navn",
    "namePlaceholder": "Dit navn",
    "phoneNumber": "Telefonnummer",
    "email": "E-mailadresse",
    "emailPlaceholder": "din@email.com",
    "emailHelp": "Du modtager en bekræftelses-e-mail med link til redigering eller afbestilling",
    "notesTitle": "Ekstra noter (valgfrit)",
    "notesPlaceholder": "Særlige ønsker eller yderligere information...",
    "notesHelp": "Fx barnesæde, ventetid, særlige instruktioner",
    "submitting": "Sender...",
    "formIncomplete": "Udfyld formularen for at fortsætte",
    "confirmOrder": (price) => `Bekræft bestilling (${price} PLN)`,
    "reassurance": "Ingen forudbetaling. Gratis afbestilling. Bekræftelse på 5–10 min."
  },
  "quoteForm": {
    "validation": {
      "phoneLetters": "Indtast venligst et gyldigt telefonnummer (kun tal).",
      "phoneLength": "Indtast venligst et gyldigt telefonnummer (7–15 cifre, valgfri +).",
      "email": "Indtast venligst en gyldig e-mailadresse.",
      "datePast": "Vælg dagens dato eller en fremtidig dato.",
      "timePast": "Vælg nuværende tidspunkt eller et fremtidigt tidspunkt.",
      "timeSoon": "Vælg et tidspunkt som er mindst 40 minutter fra nu."
    },
    "submitError": "Kunne ikke sende tilbudsanmodning. Prøv igen.",
    "submitNetworkError": "Netværksfejl ved afsendelse af tilbudsanmodning. Prøv igen.",
    "submittedTitle": "Tilbudsanmodning modtaget!",
    "submittedBody": "Tak. Du får en e-mail inden for 5-10 minutter om tilbuddet er accepteret eller afvist.",
    "manageLink": "Administrer din bestilling",
    "title": "Anmod om et tilpasset tilbud",
    "subtitle": "Foreslå din pris og få svar inden for 5-10 minutter",
    "requestButton": "Anmod om tilbud",
    "requestAnother": "Anmod om et nyt tilbud",
    "toggleDescription": "Angiv dine rejsedetaljer og foreslå din pris. Du får svar inden for 5-10 minutter.",
    "pickupType": "Afhentningstype",
    "airportPickup": "Afhentning i lufthavn",
    "addressPickup": "Afhentning på adresse",
    "lockMessage": "Vælg afhentningstype for at låse resten af formularen op.",
    "pickupAddress": "Afhentningsadresse",
    "pickupPlaceholder": "Indtast afhentningsadresse (fx Gdańsk Airport, ul. Słowackiego 200)",
    "pickupAutoNote": "Afhentningsadresse i lufthavn udfyldes automatisk",
    "destinationAddress": "Destinationsadresse",
    "destinationPlaceholder": "Indtast destinationsadresse (fx Gdańsk Centrum, ul. Długa 1)",
    "price": "Pris",
    "proposedPriceLabel": "Dit foreslåede beløb (PLN)",
    "taximeterTitle": "Enter the address to see the price. If it doesn't fit, propose your own.",
    "tariff1": "Takst 1 (by, 6–22): 3.90 PLN/km.",
    "tariff2": "Takst 2 (by, 22–6): 5.85 PLN/km.",
    "tariff3": "Takst 3 (udenfor by, 6–22): 7.80 PLN/km.",
    "tariff4": "Takst 4 (udenfor by, 22–6): 11.70 PLN/km.",
    "autoPriceNote": "Kalkulatoren estimerer prisen, når du har indtastet adresserne.",
    "fixedPriceHint": "Hvis du vil foreslå en fast pris, klik her og udfyld feltet.",
    "pricePlaceholder": "Indtast dit tilbud i PLN (fx 150)",
    "priceHelp": "Foreslå din pris. Vi vurderer og svarer inden for 5-10 minutter.",
    "fixedRouteChecking": "Checking if this route qualifies for a fixed price...",
    "fixedRouteTitle": "Fixed price available",
    "fixedRouteDistance": (distance) => `Distance: ${distance} km`,
    "fixedRouteComputed": (price) => `${price} PLN`,
    "fixedRouteCta": "Book fixed price",
    "fixedRouteHint": "Use the fixed-price booking for the fastest confirmation.",
    "fixedRouteAllDay": "All-day rate applies",
    "fixedRouteDay": "Day rate applies",
    "fixedRouteNight": "Night rate applies",
    "fixedRouteLocked": "This route qualifies for a fixed price. Please book via the fixed-price form.",
    "longRouteTitle": "Long route estimate",
    "longRouteDistance": (distance) => `Distance: ${distance} km`,
    "longRouteTaximeter": (price, rate) => `Taximeter: ${price} PLN (${rate} PLN/km)`,
    "longRouteProposed": (price) => `Proposed price: ${price} PLN`,
    "longRouteSavings": (percent) => `Savings: ${percent}%`,
    "longRouteNote": "You can still enter your own price below.",
    "date": "Dato",
    "pickupTime": "Afhentningstid",
    "signServiceTitle": "Modtagelse ved ankomst",
    "signServiceSign": "Mød med navneskilt",
    "signServiceFee": "+20 PLN lægges til slutprisen",
    "signServiceSelf": "Jeg finder selv chaufføren på parkeringen",
    "signServiceSelfNote": "Chaufføren kontakter dig via WhatsApp eller telefon, og I mødes.",
    "signText": "Tekst på skilt",
    "signPlaceholder": "Tekst der vises på skiltet",
    "signHelp": "Chaufføren venter med et skilt, indtil du forlader ankomsthallen",
    "signPreview": "Skiltforhåndsvisning:",
    "signEmpty": "Dit navn vises her",
    "flightNumber": "Flynummer",
    "flightPlaceholder": "f.eks. LO123",
    "passengers": "Antal passagerer",
    "passengersOptions": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer",
      "5+ personer"
    ],
    "largeLuggage": "Stor bagage",
    "luggageNo": "Nej",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktoplysninger",
    "fullName": "Fulde navn",
    "namePlaceholder": "Dit navn",
    "phoneNumber": "Telefonnummer",
    "email": "E-mailadresse",
    "emailPlaceholder": "din@email.com",
    "emailHelp": "Du får svar inden for 5-10 minutter",
    "notesTitle": "Ekstra noter (valgfrit)",
    "notesPlaceholder": "Særlige ønsker eller yderligere information...",
    "notesHelp": "Fx barnesæde, ventetid, særlige instruktioner",
    "submitting": "Sender...",
    "formIncomplete": "Udfyld formularen for at fortsætte",
    "submit": "Send tilbudsanmodning"
  },
  "manageOrder": {
    "errors": {
      "load": "Kunne ikke indlæse bestillingen.",
      "loadNetwork": "Netværksfejl ved indlæsning af bestillingen.",
      "save": "Kunne ikke gemme ændringer.",
      "saveNetwork": "Netværksfejl ved gemning af ændringer.",
      "cancel": "Kunne ikke annullere bestillingen.",
      "cancelNetwork": "Netværksfejl ved annullering.",
      "copySuccess": "Kopieret til udklipsholder",
      "copyFail": "Kunne ikke kopiere til udklipsholder",
      "emailRequired": "Indtast din e-mailadresse."
    },
    "loading": "Indlæser din bestilling...",
    "accessTitle": "Få adgang til din booking",
    "accessBody": "Indtast e-mailadressen brugt ved booking.",
    "accessPlaceholder": "du@example.com",
    "accessAction": "Fortsæt",
    "accessChecking": "Tjekker...",
    "cancelledTitle": "Bestilling annulleret",
    "cancelledBody": "Din bestilling er annulleret. Hvis det var en fejl, opret en ny booking.",
    "manageTitle": "Administrer din transfer",
    "copyAction": "Kopiér",
    "orderLabel": "Bestilling #",
    "orderIdLabel": "Bestillings-ID",
    "detailsUpdatedTitle": "Detaljer opdateret",
    "updateSubmittedTitle": "Opdatering sendt",
    "updateSubmittedBody": "Din opdateringsanmodning blev sendt. Vi gennemgår den snart.",
    "awaiting": "Afventer bekræftelse...",
    "transferRoute": "Transferrute",
    "priceLabel": "Pris:",
    "pricePending": "Pris bekræftes individuelt",
    "taximeterTitle": "Price calculated by taximeter",
    "taximeterRates": "View taximeter rates",
    "tariff1": "Tariff 1 (city, 6–22): 3.90 PLN/km.",
    "tariff2": "Tariff 2 (city, 22–6): 5.85 PLN/km.",
    "tariff3": "Tariff 3 (outside city, 6–22): 7.80 PLN/km.",
    "tariff4": "Tariff 4 (outside city, 22–6): 11.70 PLN/km.",
    "statusConfirmed": "Bekræftet",
    "statusCompleted": "Afsluttet",
    "statusFailed": "Ikke afsluttet",
    "statusRejected": "Afvist",
    "statusPriceProposed": "Pris foreslået",
    "statusPending": "Afventer",
    "bookingDetails": "Bookingdetaljer",
    "editDetails": "Rediger detaljer",
    "updateRequested": "Felter der skal opdateres",
    "confirmedEditNote": "Redigering af en bekræftet booking sender den til ny godkendelse.",
    "updateFieldsNote": "Opdater de markerede felter og gem ændringerne.",
    "confirmedNote": "Denne booking er bekræftet.",
    "completedNote": "Denne booking er markeret som afsluttet.",
    "failedNote": "Denne booking er markeret som ikke afsluttet.",
    "priceProposedNote": "En ny pris er foreslået. Tjek din e-mail for at acceptere eller afvise.",
    "rejectedNote": "Denne booking er afvist. Redigering er deaktiveret, men du kan stadig annullere.",
    "rejectionReasonLabel": "Årsag:",
    "date": "Dato",
    "pickupTime": "Afhentningstid",
    "signServiceTitle": "Airport arrival pickup",
    "signServiceSign": "Meet with a name sign",
    "signServiceFee": "+20 PLN added to final price",
    "signServiceSelf": "Find the driver myself at the parking",
    "signServiceSelfNote": "Chaufføren kontakter dig via WhatsApp eller telefon, og I mødes.",
    "signText": "Tekst på skilt",
    "flightNumber": "Flynummer",
    "pickupAddress": "Afhentningsadresse",
    "passengers": "Antal passagerer",
    "passengersBus": [
      "5 personer",
      "6 personer",
      "7 personer",
      "8 personer"
    ],
    "passengersStandard": [
      "1 person",
      "2 personer",
      "3 personer",
      "4 personer"
    ],
    "largeLuggage": "Stor bagage",
    "luggageNo": "Nej",
    "luggageYes": "Ja",
    "contactTitle": "Kontaktoplysninger",
    "fullName": "Fulde navn",
    "phoneNumber": "Telefonnummer",
    "email": "E-mailadresse",
    "notesTitle": "Ekstra noter (valgfrit)",
    "saveChanges": "Gem ændringer",
    "cancelEdit": "Annuller",
    "editBooking": "Rediger booking",
    "cancelBooking": "Annuller booking",
    "changesNotice": "Ændringer bekræftes via e-mail. Kontakt booking@taxiairportgdansk.com ved hasteændringer.",
    "updateRequestNote": "Din booking er opdateret. Gennemgå og bekræft ændringerne.",
    "rejectNote": "Denne booking er afvist. Kontakt support hvis du har spørgsmål.",
    "cancelPromptTitle": "Annuller booking?",
    "cancelPromptBody": "Er du sikker på, at du vil annullere? Dette kan ikke fortrydes.",
    "confirmCancel": "Ja, annuller",
    "keepBooking": "Behold booking",
    "copyOrderLabel": "Bestilling #",
    "copyOrderIdLabel": "Bestillings-ID"
  },
  "adminOrders": {
    "title": "Admin-bestillinger",
    "subtitle": "Alle seneste bestillinger og status.",
    "loading": "Indlæser bestillinger...",
    "missingToken": "Admin-token mangler.",
    "errorLoad": "Kunne ikke indlæse bestillinger.",
    "filters": {
      "all": "All",
      "active": "In progress",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "statuses": {
      "pending": "Pending",
      "confirmed": "Confirmed",
      "price_proposed": "Price proposed",
      "completed": "Completed",
      "failed": "Not completed",
      "rejected": "Rejected"
    },
    "columns": {
      "order": "Bestilling",
      "pickup": "Afhentning",
      "customer": "Kunde",
      "price": "Pris",
      "status": "Status",
      "open": "Åbn"
    },
    "empty": "Ingen bestillinger fundet.",
    "view": "Vis"
  },
  "adminOrder": {
    "title": "Admin-bestillingsdetaljer",
    "subtitle": "Administrer, bekræft eller afvis denne bestilling.",
    "back": "Tilbage til alle bestillinger",
    "loading": "Indlæser bestilling...",
    "missingToken": "Admin-token mangler.",
    "errorLoad": "Kunne ikke indlæse bestilling.",
    "updated": "Bestilling opdateret.",
    "updateError": "Kunne ikke opdatere bestilling.",
    "statusUpdated": "Bestillingsstatus opdateret.",
    "updateRequestSent": "Opdateringsanmodning sendt til kunden.",
    "updateRequestError": "Kunne ikke sende opdateringsanmodning.",
    "updateRequestSelect": "Vælg mindst ét felt til opdatering.",
    "orderLabel": "Bestilling",
    "idLabel": "ID",
    "customerLabel": "Kunde",
    "pickupLabel": "Afhentning",
    "priceLabel": "Pris",
    "additionalInfo": "Yderligere info",
    "passengers": "Passagerer:",
    "largeLuggage": "Stor bagage:",
    "pickupType": "Afhentningstype:",
    "signService": "Afhentningsvalg:",
    "signServiceSign": "Mød med navneskilt",
    "signServiceSelf": "Find chaufføren selv",
    "signFee": "Skiltgebyr:",
    "flightNumber": "Flynummer:",
    "signText": "Tekst på skilt:",
    "route": "Rute:",
    "notes": "Noter:",
    "adminActions": "Admin-handlinger",
    "confirmOrder": "Bekræft bestilling",
    "rejectOrder": "Afvis bestilling",
    "proposePrice": "Foreslå ny pris (PLN)",
    "sendPrice": "Send prisforslag",
    "rejectionReason": "Afvisningsårsag (valgfri)",
    "requestUpdate": "Anmod om opdatering fra kunden",
    "requestUpdateBody": "Vælg felter kunden skal opdatere. De får en e-mail med redigeringslink.",
    "fieldPhone": "Telefonnummer",
    "fieldEmail": "E-mailadresse",
    "fieldFlight": "Flynummer",
    "requestUpdateAction": "Anmod om opdatering",
    "cancelConfirmedTitle": "Confirmed order cancellation",
    "cancelConfirmedBody": "Send a cancellation email due to lack of taxi availability at the requested time.",
    "cancelConfirmedAction": "Cancel confirmed order",
    "cancelConfirmedConfirm": "Cancel this confirmed order and notify the customer?",
    "cancelConfirmedSuccess": "Order cancelled.",
    "deleteRejectedTitle": "Delete rejected order",
    "deleteRejectedBody": "Remove this rejected order permanently.",
    "deleteRejectedAction": "Delete rejected order",
    "deleteRejectedConfirm": "Delete this rejected order permanently?",
    "deleteRejectedSuccess": "Order deleted.",
    "completionTitle": "Status for gennemførelse",
    "markCompleted": "Markér som afsluttet",
    "markCompletedConfirm": "Mark this order as completed?",
    "markFailed": "Markér som ikke afsluttet",
    "markFailedConfirm": "Mark this order as not completed?"
  },
  "pages": {
    "gdanskTaxi": {
      "title": "Gdańsk lufthavn taxa",
      "description": "Book en hurtig og pålidelig lufthavnstaxa fra Gdańsk lufthavn. Fast pris begge veje, professionelle chauffører og hurtig bekræftelse.",
      "route": "Gdańsk lufthavn",
      "examples": [
        "Gdańsk gamle by",
        "Gdańsk Oliwa",
        "Gdańsk hovedbanegård",
        "Brzeźno Beach"
      ],
      "priceDay": 100,
      "priceNight": 120
    },
    "gdanskSopot": {
      "title": "Transfer fra Gdańsk lufthavn til Sopot",
      "description": "Privat transfer mellem Gdańsk lufthavn og Sopot med fast pris begge veje og flysporing.",
      "route": "Gdańsk lufthavn ↔ Sopot",
      "examples": [
        "Sopot Pier",
        "Sopot centrum",
        "Sopot hoteller",
        "Sopot banegård"
      ],
      "priceDay": 120,
      "priceNight": 150
    },
    "gdanskGdynia": {
      "title": "Transfer fra Gdańsk lufthavn til Gdynia",
      "description": "Komfortabel transfer mellem Gdańsk lufthavn og Gdynia med fast pris begge veje.",
      "route": "Gdańsk lufthavn ↔ Gdynia",
      "examples": [
        "Gdynia centrum",
        "Gdynia havn",
        "Gdynia hoteller",
        "Gdynia Orłowo"
      ],
      "priceDay": 150,
      "priceNight": 200
    }
  }
};
const da$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: da
}, Symbol.toStringTag, { value: "Module" }));
const serverTranslations = {
  en,
  pl,
  de,
  fi,
  no,
  sv,
  da
};
function render(url) {
  var _a2;
  const initialLocale = (_a2 = getLocaleFromPathname(url)) != null ? _a2 : DEFAULT_LOCALE;
  const initialTranslations = serverTranslations[initialLocale];
  const appHtml = renderToString(
    /* @__PURE__ */ jsx(StrictMode, { children: /* @__PURE__ */ jsx(StaticRouter, { location: url, future: { v7_startTransition: true, v7_relativeSplatPath: true }, children: /* @__PURE__ */ jsx(I18nProvider, { initialLocale, initialTranslations, children: /* @__PURE__ */ jsx(App, {}) }) }) })
  );
  return {
    appHtml,
    initialLocale,
    initialTranslations
  };
}
export {
  getCityRouteBySlug as A,
  getCityRoutes as B,
  localeToRootPath as C,
  getRouteKeyFromSlug as D,
  favicon as E,
  FloatingActions as F,
  trackLocaleChange as G,
  TrustBar as T,
  updateGtagConsent as a,
  getRoutePath as b,
  usePageTitle as c,
  getRouteSlug as d,
  trackNavClick as e,
  trackFormOpen as f,
  getConsentStatus as g,
  scrollToId as h,
  trackPricingRouteSelect as i,
  trackPricingAction as j,
  trackVehicleSelect as k,
  localeToPath as l,
  trackFormClose as m,
  trackFormValidation as n,
  trackFormSubmit as o,
  trackFormStart as p,
  isAnalyticsEnabled as q,
  requestScrollTo as r,
  render,
  setConsentStatus as s,
  trackCtaClick as t,
  useI18n as u,
  hasMarketingConsent as v,
  trackContactClick as w,
  getCountryAirports as x,
  getCountryAirportBySlug as y,
  getCountryAirportCountry as z
};
