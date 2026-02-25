import { jsx, jsxs } from "react/jsx-runtime";
import { useParams, useLocation } from "react-router-dom";
import { B as Breadcrumbs } from "./Breadcrumbs-rDtPqfkB.mjs";
import { Footer } from "./Footer-DdKAp0re.mjs";
import { u as useI18n, A as getCityRouteBySlug, B as getCityRoutes, c as usePageTitle, l as localeToPath, d as getRouteSlug, t as trackCtaClick, r as requestScrollTo, e as trackNavClick, F as FloatingActions } from "../entry-server.mjs";
import { N as Navbar } from "./Navbar-BJLcl6ZC.mjs";
import { T as TrustSection } from "./TrustSection-DGIrAbM2.mjs";
import { NotFoundPage } from "./NotFoundPage-ldslrggF.mjs";
import "lucide-react";
import "react-dom/server";
import "react-router-dom/server.js";
import "react";
import "./TripadvisorWidget-CPezc-jA.mjs";
function CityRouteLanding() {
  var _a, _b, _c, _d, _e;
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const { routeSlug } = useParams();
  const location = useLocation();
  const slugFromPath = (_a = location.pathname.replace(/\/$/, "").split("/").pop()) != null ? _a : null;
  const resolvedSlug = routeSlug != null ? routeSlug : slugFromPath;
  const route = resolvedSlug ? getCityRouteBySlug(locale, resolvedSlug) : null;
  const cityRoutes = getCityRoutes(locale).filter((entry) => entry.slug !== resolvedSlug);
  if (!route) {
    return /* @__PURE__ */ jsx(NotFoundPage, {});
  }
  const destination = route.destination;
  const cityTaxi = t.cityTaxi;
  const cityRouteItemLabel = (cityDestination) => typeof cityTaxi.cityRoutesItem === "function" ? cityTaxi.cityRoutesItem(cityDestination) : `Gdańsk Airport → ${cityDestination}`;
  const priceTitle = typeof cityTaxi.priceTitle === "function" ? cityTaxi.priceTitle(destination) : `Taxi Gdańsk Airport → ${destination}`;
  const priceDescription = typeof cityTaxi.priceDescription === "function" ? cityTaxi.priceDescription(destination) : `Check the current taxi price from Gdańsk Airport to ${destination}.`;
  const priceSubtitle = typeof cityTaxi.priceSubtitle === "function" ? cityTaxi.priceSubtitle(destination) : `Taxi from Gdańsk Airport to ${destination} – fixed prices, 24/7, fast confirmation.`;
  usePageTitle(priceTitle);
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
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: priceTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: priceDescription }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: priceSubtitle }),
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
              children: (_b = cityTaxi.checkPriceCta) != null ? _b : "Check price"
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
              children: (_c = cityTaxi.bookRideCta) != null ? _c : "Book a ride"
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: (_d = cityTaxi.whyTitle) != null ? _d : cityTaxi.highlightsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: cityTaxi.highlights.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: (_e = cityTaxi.routesSectionTitle) != null ? _e : cityTaxi.routesTitle }),
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
export {
  CityRouteLanding
};
