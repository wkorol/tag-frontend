import { jsxs, jsx } from "react/jsx-runtime";
import { B as Breadcrumbs } from "./Breadcrumbs-rDtPqfkB.mjs";
import { Footer } from "./Footer-BLuaI9VM.mjs";
import { u as useI18n, c as usePageTitle, l as localeToPath, t as trackCtaClick, r as requestScrollTo, e as trackNavClick, d as getRouteSlug, B as getCityRoutes, F as FloatingActions } from "../entry-server.mjs";
import { N as Navbar } from "./Navbar-BJLcl6ZC.mjs";
import { T as TrustSection } from "./TrustSection-DGIrAbM2.mjs";
import "lucide-react";
import "react";
import "react-dom/server";
import "react-router-dom/server.js";
import "react-router-dom";
import "./TripadvisorWidget-CPezc-jA.mjs";
function TaxiGdanskPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const content = t.cityTaxi;
  const cityRoutes = getCityRoutes(locale);
  const cityRouteItemLabel = (destination) => typeof content.cityRoutesItem === "function" ? content.cityRoutesItem(destination) : `Gdańsk Airport → ${destination}`;
  usePageTitle(content.title);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: content.title }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: content.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: content.subtitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: content.intro }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("city_taxi_order");
                const scrolled = requestScrollTo("vehicle-selection");
                if (!scrolled) {
                  window.location.href = `${basePath}/`;
                }
              },
              className: "inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow",
              children: content.ctaPrimary
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}`,
              onClick: () => trackNavClick("city_taxi_pricing"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: content.ctaSecondary
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.highlightsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: content.highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.serviceAreaTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: content.serviceArea.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.routesTitle }),
        /* @__PURE__ */ jsx("ul", { className: "grid gap-2 text-sm text-gray-600 md:grid-cols-2", children: content.routes.map((item) => /* @__PURE__ */ jsx("li", { className: "bg-gray-50 border border-gray-200 rounded-xl px-4 py-2", children: item }, item)) })
      ] }) }),
      cityRoutes.length > 0 && /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: content.cityRoutesTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-4", children: content.cityRoutesDescription }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 md:grid-cols-2", children: cityRoutes.map((route) => /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/${route.slug}`,
            onClick: () => trackNavClick("city_routes_link"),
            className: "rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50",
            children: cityRouteItemLabel(route.destination)
          },
          route.slug
        )) })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: content.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: content.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
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
  TaxiGdanskPage
};
