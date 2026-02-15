import { jsx, jsxs } from 'react/jsx-runtime';
import { useParams, useLocation } from 'react-router-dom';
import { B as Breadcrumbs } from './Breadcrumbs-BLHIqKga.mjs';
import { Footer } from './Footer-oWcLPJwG.mjs';
import { u as useI18n, q as getCountryAirportBySlug, v as getCountryAirportCountry, a as usePageTitle, l as localeToPath, t as trackCtaClick, r as requestScrollTo, b as trackNavClick, g as getRouteSlug, F as FloatingActions } from '../entry-server.mjs';
import { N as Navbar, T as TrustSection } from './TrustSection-C6Apm12u.mjs';
import { NotFoundPage } from './NotFoundPage-BSK6xfke.mjs';
import 'lucide-react';
import 'react';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-dom';
import './TripadvisorWidget-BVBwrnhD.mjs';

const replaceTokens = (text, tokens) => Object.entries(tokens).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, value), text);
function CountryAirportLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const { airportSlug } = useParams();
  const location = useLocation();
  const slugFromPath = location.pathname.replace(/\/$/, "").split("/").pop() ?? null;
  const resolvedSlug = airportSlug ?? slugFromPath;
  const airportData = resolvedSlug ? getCountryAirportBySlug(locale, resolvedSlug) : null;
  if (!airportData) {
    return /* @__PURE__ */ jsx(NotFoundPage, {});
  }
  const country = getCountryAirportCountry(locale);
  const tokens = {
    city: airportData.city,
    airport: airportData.airport,
    country
  };
  const landing = t.airportLanding;
  const landingAny = landing;
  const destinations = t.pages?.gdanskTaxi?.examples ?? [];
  const resolveLandingText = (value, fallback, ...args) => {
    if (typeof value === "function") {
      try {
        return value(...args);
      } catch {
        return fallback;
      }
    }
    if (typeof value === "string") {
      return replaceTokens(value, tokens);
    }
    return fallback;
  };
  const landingTitle = resolveLandingText(
    landingAny.title,
    `${airportData.city} - transfer from ${airportData.airport} to Gdańsk`,
    airportData.city,
    airportData.airport
  );
  usePageTitle(landingTitle);
  const landingDescription = resolveLandingText(
    landingAny.description,
    `Private airport transfer from ${airportData.airport} to Gdańsk, Sopot and Gdynia with fixed prices.`,
    airportData.city,
    airportData.airport
  );
  const landingIntro = resolveLandingText(
    landingAny.intro,
    `Book your transfer in advance and get quick confirmation with flight tracking included.`,
    airportData.city,
    airportData.airport
  );
  const landingRouteTitle = resolveLandingText(
    landingAny.routeTitle,
    `Route from ${airportData.airport}`,
    airportData.airport
  );
  const landingRouteBody = resolveLandingText(
    landingAny.routeBody,
    `We monitor arrivals and organize a smooth pickup from ${airportData.airport} to your address in the Tri-City area.`,
    airportData.airport
  );
  const highlights = landing.highlights.map((item) => replaceTokens(item, tokens));
  const faq = landing.faq.map((entry) => ({
    question: replaceTokens(entry.question, tokens),
    answer: replaceTokens(entry.answer, tokens)
  }));
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: landingTitle }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: landingTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: landingDescription }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: landingIntro }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("airport_landing_order");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow",
              children: landing.ctaPrimary
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}`,
              onClick: () => trackNavClick("airport_landing_pricing"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: landing.ctaSecondary
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: landingRouteTitle }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: landingRouteBody })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: landing.highlightsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: landing.destinationsTitle }),
        /* @__PURE__ */ jsx("ul", { className: "grid gap-2 text-sm text-gray-600 md:grid-cols-2", children: destinations.map((item) => /* @__PURE__ */ jsx("li", { className: "bg-gray-50 border border-gray-200 rounded-xl px-4 py-2", children: item }, item)) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: landing.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

export { CountryAirportLanding };
