import { jsx, jsxs } from 'react/jsx-runtime';
import { useParams, useLocation } from 'react-router-dom';
import { B as Breadcrumbs } from './Breadcrumbs-BLHIqKga.mjs';
import { Footer } from './Footer-BpSYvjMW.mjs';
import { FloatingActions } from './FloatingActions-CZ2NL3hv.mjs';
import { N as Navbar, T as TrustSection } from './TrustSection-XEWoJqKU.mjs';
import { u as useI18n, A as getCityRouteBySlug, B as getCityRoutes, c as usePageTitle, l as localeToPath, d as getRouteSlug, t as trackCtaClick, r as requestScrollTo, e as trackNavClick } from '../entry-server.mjs';
import { NotFoundPage } from './NotFoundPage-DVDLBjqQ.mjs';
import 'lucide-react';
import 'react';
import './TripadvisorWidget-DqBnXr23.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';

function CityRouteLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const { routeSlug } = useParams();
  const location = useLocation();
  const slugFromPath = location.pathname.replace(/\/$/, "").split("/").pop() ?? null;
  const resolvedSlug = routeSlug ?? slugFromPath;
  const route = resolvedSlug ? getCityRouteBySlug(locale, resolvedSlug) : null;
  const cityRoutes = getCityRoutes(locale).filter((entry) => entry.slug !== resolvedSlug);
  if (!route) {
    return /* @__PURE__ */ jsx(NotFoundPage, {});
  }
  const destination = route.destination;
  const cityTaxi = t.cityTaxi;
  const cityRouteItemLabel = (cityDestination) => typeof cityTaxi.cityRoutesItem === "function" ? cityTaxi.cityRoutesItem(cityDestination) : `Lotnisko Gdańsk → ${cityDestination}`;
  usePageTitle(`Cena taxi z lotniska Gdańsk do ${destination}`);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: `Taxi Gdańsk → ${destination}` }
            ]
          }
        ),
        /* @__PURE__ */ jsxs("h1", { className: "text-3xl text-gray-900 mb-4", children: [
          "Cena taxi z lotniska Gdańsk do ",
          destination
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 mb-4", children: [
          "Sprawdź aktualną cenę przejazdu z lotniska Gdańsk do ",
          destination,
          ". Kalkulator pokaże cenę na dziś w kilka sekund."
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-500 mb-6", children: [
          "Taxi Gdańsk z lotniska do ",
          destination,
          " – stałe ceny, 24/7 i szybkie potwierdzenie."
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}?from=airport&to=${encodeURIComponent(destination)}#pricing-calculator`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("city_route_calculator");
                const scrolled = requestScrollTo("pricing-calculator");
                if (!scrolled) {
                  window.location.href = `${basePath}/${getRouteSlug(locale, "pricing")}?from=airport&to=${encodeURIComponent(destination)}#pricing-calculator`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow",
              children: "Sprawdź cenę w kalkulatorze"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackNavClick("city_route_booking");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: "Zarezerwuj przejazd"
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: "Dlaczego warto" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: cityTaxi.highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: "Obsługiwane trasy" }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: cityTaxi.routes.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: cityTaxi.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: cityTaxi.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) }),
      cityRoutes.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: cityTaxi.cityRoutesTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: cityTaxi.cityRoutesDescription }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: cityRoutes.map((entry) => /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/${entry.slug}`,
            onClick: () => trackNavClick("city_routes_link"),
            className: "rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50",
            children: cityRouteItemLabel(entry.destination)
          },
          entry.slug
        )) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

export { CityRouteLanding };
