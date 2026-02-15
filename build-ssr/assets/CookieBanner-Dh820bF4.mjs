import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { u as useI18n, g as getConsentStatus, a as updateGtagConsent, b as getRoutePath, s as setConsentStatus } from '../entry-server.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'lucide-react';

function CookieBanner() {
  const { t, locale } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const getAttributionLandingUrl = () => {
    if (typeof window === "undefined") {
      return void 0;
    }
    try {
      const used = window.sessionStorage.getItem("tag_attribution_landing_used");
      if (used === "1") {
        return void 0;
      }
      const url = window.sessionStorage.getItem("tag_attribution_landing_url");
      if (!url) {
        return void 0;
      }
      window.sessionStorage.setItem("tag_attribution_landing_used", "1");
      return url;
    } catch {
      return void 0;
    }
  };
  useEffect(() => {
    setMounted(true);
    try {
      const existing = getConsentStatus();
      if (existing) {
        updateGtagConsent(existing);
        if (existing === "accepted" && typeof window !== "undefined") {
          const loadGtag = window.__loadGtag;
          if (typeof loadGtag === "function") {
            loadGtag();
          }
          const gtag = window.gtag;
          if (typeof gtag === "function") {
            const pageLocation = getAttributionLandingUrl();
            if (pageLocation) {
              gtag("event", "page_view", { page_location: pageLocation });
            } else {
              gtag("event", "page_view");
            }
          }
        }
        setVisible(existing !== "accepted");
        return;
      }
      setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);
  const accept = () => {
    setConsentStatus("accepted");
    updateGtagConsent("accepted");
    if (typeof window !== "undefined") {
      const loadGtag = window.__loadGtag;
      if (typeof loadGtag === "function") {
        loadGtag();
      }
      const gtag = window.gtag;
      if (typeof gtag === "function") {
        const pageLocation = getAttributionLandingUrl();
        if (pageLocation) {
          gtag("event", "page_view", { page_location: pageLocation });
        } else {
          gtag("event", "page_view");
        }
      }
    }
    setVisible(false);
  };
  const reject = () => {
    setConsentStatus("rejected");
    updateGtagConsent("rejected");
    setVisible(false);
  };
  if (!visible || !mounted) {
    return null;
  }
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "px-4",
        style: { position: "fixed", left: 0, right: 0, bottom: 16, zIndex: 2147483647 },
        "data-cookie-banner": true,
        "aria-live": "polite",
        children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "mx-auto max-w-3xl overflow-hidden rounded-3xl text-white border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.55)]",
            style: { backgroundColor: "#0b0f1a" },
            children: [
              /* @__PURE__ */ jsx("div", { className: "p-6 sm:p-7", children: /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsx("p", { className: "text-base font-semibold tracking-wide", children: t.cookieBanner.title }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-200 leading-relaxed", children: t.cookieBanner.body }),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: getRoutePath(locale, "cookies"),
                    className: "inline-block text-sm text-blue-300 hover:text-blue-200 underline",
                    children: t.cookieBanner.readPolicy
                  }
                )
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "border-t border-white/10 bg-slate-900/60 px-6 py-4 sm:px-7", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4", children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: reject,
                    className: "w-full sm:w-auto border border-white/25 text-white text-base font-semibold px-7 py-3 rounded-full hover:border-white/60 transition",
                    children: t.cookieBanner.decline
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: accept,
                    className: "w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-8 py-3 rounded-lg shadow-lg shadow-blue-600/30 transition",
                    children: t.cookieBanner.accept
                  }
                )
              ] }) })
            ]
          }
        )
      }
    ),
    document.body
  );
}

export { CookieBanner };
