import { jsxs, jsx } from "react/jsx-runtime";
import { B as Breadcrumbs } from "./Breadcrumbs-rDtPqfkB.mjs";
import { Footer } from "./Footer-S_X6anZC.mjs";
import { u as useI18n, x as getCountryAirports, c as usePageTitle, l as localeToPath, t as trackCtaClick, r as requestScrollTo, e as trackNavClick, d as getRouteSlug, F as FloatingActions } from "../entry-server.mjs";
import { N as Navbar, T as TrustSection } from "./TrustSection-CXktLlh-.mjs";
import "lucide-react";
import "react";
import "react-dom/server";
import "react-router-dom/server.js";
import "react-router-dom";
import "./TripadvisorWidget-CPezc-jA.mjs";
function CountryLanding() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w;
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const airportPages = getCountryAirports(locale);
  const country = (_w = t.countryLanding) != null ? _w : {
    title: (_b = (_a = t.routeLanding) == null ? void 0 : _a.orderNow) != null ? _b : "Airport transfer",
    description: (_e = (_d = (_c = t.routeLanding) == null ? void 0 : _c.seoParagraph) == null ? void 0 : _d.call(_c, "Gdańsk")) != null ? _e : "",
    intro: "",
    ctaPrimary: (_g = (_f = t.routeLanding) == null ? void 0 : _f.orderNow) != null ? _g : "Book",
    ctaSecondary: (_i = (_h = t.routeLanding) == null ? void 0 : _h.pricingLink) != null ? _i : "Pricing",
    highlightsTitle: (_k = (_j = t.routeLanding) == null ? void 0 : _j.includedTitle) != null ? _k : "Highlights",
    highlights: (_m = (_l = t.routeLanding) == null ? void 0 : _l.includedList) != null ? _m : [],
    airportsTitle: (_o = (_n = t.routeLanding) == null ? void 0 : _n.destinationsTitle) != null ? _o : "Popular destinations",
    airports: (_r = (_q = (_p = t.pages) == null ? void 0 : _p.gdanskTaxi) == null ? void 0 : _q.examples) != null ? _r : [],
    faqTitle: (_t = (_s = t.routeLanding) == null ? void 0 : _s.faqTitle) != null ? _t : "FAQ",
    faq: (_v = (_u = t.routeLanding) == null ? void 0 : _u.faq) != null ? _v : []
  };
  usePageTitle(country.title);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: country.title }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: country.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: country.description }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: country.intro }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("country_landing_order");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow",
              children: country.ctaPrimary
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}`,
              onClick: () => trackNavClick("country_landing_pricing"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: country.ctaSecondary
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: country.highlightsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: country.highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: country.airportsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: country.airports.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) }),
          airportPages.length > 0 && /* @__PURE__ */ jsx("div", { className: "mt-4 grid gap-2 text-sm", children: airportPages.map((airport) => /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${airport.slug}`,
              onClick: () => trackNavClick("country_landing_airport_link"),
              className: "text-blue-600 hover:text-blue-700",
              children: airport.airport
            },
            airport.slug
          )) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: country.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: country.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
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
export {
  CountryLanding
};
