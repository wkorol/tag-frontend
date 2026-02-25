import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Mail, MapPin } from "lucide-react";
import { u as useI18n, B as getCityRoutes, w as trackContactClick, e as trackNavClick, b as getRoutePath, l as localeToPath } from "../entry-server.mjs";
import "react";
import "react-dom/server";
import "react-router-dom/server.js";
import "react-router-dom";
function Footer() {
  var _a, _b, _c, _d, _e, _f, _g;
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const allCityRoutes = getCityRoutes(locale);
  const popularCityRoutes = allCityRoutes.slice(0, 6);
  return /* @__PURE__ */ jsx("footer", { className: "bg-gray-900 text-gray-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "grid md:grid-cols-4 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-white mb-4", children: "Taxi Airport Gdańsk" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-200", children: t.footer.description })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-white mb-4", children: t.footer.contactTitle }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-3 text-sm text-gray-200", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(Mail, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "mailto:booking@taxiairportgdansk.com",
                onClick: () => trackContactClick("email"),
                className: "inline-flex min-h-11 items-center py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
                children: "booking@taxiairportgdansk.com"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4" }),
            /* @__PURE__ */ jsx("span", { children: t.footer.location })
          ] }),
          /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-200 mt-4", children: t.footer.bookingNote })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-white mb-4", children: t.footer.hoursTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-200", children: t.footer.hoursBody }),
        /* @__PURE__ */ jsx("p", { className: "text-sm mt-2 text-gray-200", children: t.footer.hoursSub })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h4", { className: "text-white mb-4", children: t.footer.routesTitle }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "pricing"),
              onClick: () => trackNavClick("footer_pricing"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.navbar.prices
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "orderAirportGdansk"),
              onClick: () => trackNavClick("footer_order_airport_gdansk"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.routeLanding.orderLinks.airportGdansk
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "orderAirportSopot"),
              onClick: () => trackNavClick("footer_order_airport_sopot"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.routeLanding.orderLinks.airportSopot
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "orderAirportGdynia"),
              onClick: () => trackNavClick("footer_order_airport_gdynia"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.routeLanding.orderLinks.airportGdynia
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "orderCustom"),
              onClick: () => trackNavClick("footer_order_custom"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.routeLanding.orderLinks.custom
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "h-2" }),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "countryLanding"),
              onClick: () => trackNavClick("footer_country_landing"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: (_b = (_a = t.countryLanding) == null ? void 0 : _a.title) != null ? _b : t.navbar.airportTaxi
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "taxiGdanskCity"),
              onClick: () => trackNavClick("footer_taxi_gdansk"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: (_d = (_c = t.cityTaxi) == null ? void 0 : _c.title) != null ? _d : "Taxi Gdańsk"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/blog`,
              onClick: () => trackNavClick("footer_blog"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: (_e = t.navbar.blog) != null ? _e : "Blog"
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "airportTaxi"),
              onClick: () => trackNavClick("footer_airport_taxi"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.navbar.airportTaxi
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "airportSopot"),
              onClick: () => trackNavClick("footer_airport_sopot"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.navbar.airportSopot
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "airportGdynia"),
              onClick: () => trackNavClick("footer_airport_gdynia"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.navbar.airportGdynia
            }
          ),
          popularCityRoutes.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "h-3" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-gray-400", children: (_g = (_f = t.cityTaxi) == null ? void 0 : _f.cityRoutesTitle) != null ? _g : "Popular routes" }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] leading-snug text-gray-200", children: popularCityRoutes.map((route) => {
              var _a2;
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href: `${basePath}/${route.slug}`,
                  onClick: () => trackNavClick(`footer_city_${route.slug}`),
                  className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
                  children: typeof ((_a2 = t.cityTaxi) == null ? void 0 : _a2.cityRoutesItem) === "function" ? t.cityTaxi.cityRoutesItem(route.destination) : `Airport ↔ ${route.destination}`
                },
                route.slug
              );
            }) })
          ] }) : null
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-200", children: /* @__PURE__ */ jsxs("p", { children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      " Taxi Airport Gdańsk. ",
      t.footer.rights,
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "cookies"),
          onClick: () => trackNavClick("footer_cookies"),
          className: "text-white visited:text-white hover:text-gray-200 underline",
          children: t.footer.cookiePolicy
        }
      ),
      " ",
      /* @__PURE__ */ jsx("span", { className: "text-gray-300", children: "|" }),
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "privacy"),
          onClick: () => trackNavClick("footer_privacy"),
          className: "text-white visited:text-white hover:text-gray-200 underline",
          children: t.footer.privacyPolicy
        }
      )
    ] }) })
  ] }) });
}
export {
  Footer
};
