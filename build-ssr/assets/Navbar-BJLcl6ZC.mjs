import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { u as useI18n, E as getRouteKeyFromSlug, l as localeToPath, G as favicon, e as trackNavClick, b as getRoutePath, r as requestScrollTo, H as trackLocaleChange, d as getRouteSlug, C as localeToRootPath } from "../entry-server.mjs";
function Navbar() {
  var _a, _b;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);
  const strippedPath = location.pathname.replace(/^\/(en|pl|de|fi|no|sv|da)/, "");
  const pathWithoutLeading = strippedPath.replace(/^\//, "");
  const [firstSegment] = pathWithoutLeading.split("/").filter(Boolean);
  const currentRouteKey = firstSegment ? getRouteKeyFromSlug(locale, firstSegment) : null;
  const isHome = !firstSegment;
  const isPricing = currentRouteKey === "pricing";
  const isAirportTaxi = currentRouteKey === "airportTaxi";
  const isAirportSopot = currentRouteKey === "airportSopot";
  const isAirportGdynia = currentRouteKey === "airportGdynia";
  const isBlog = firstSegment === "blog";
  const handleLocaleChange = (nextLocale) => {
    trackLocaleChange(locale, nextLocale);
    setLocale(nextLocale);
    const nextBasePath = localeToPath(nextLocale);
    const [firstSegment2, ...restSegments] = pathWithoutLeading.split("/").filter(Boolean);
    const routeKey = firstSegment2 ? getRouteKeyFromSlug(locale, firstSegment2) : null;
    const nextSlug = routeKey ? getRouteSlug(nextLocale, routeKey) : "";
    const nextPath = nextSlug !== "" ? `/${[nextSlug, ...restSegments].filter(Boolean).join("/")}` : strippedPath;
    const searchHash = `${location.search}${location.hash}`;
    const targetPath = nextPath && nextPath !== "/" ? `${nextBasePath}${nextPath}${searchHash}` : `${localeToRootPath(nextLocale)}${searchHash}`;
    navigate(targetPath);
    setIsMenuOpen(false);
  };
  const handleNavClick = (event, sectionId, label) => {
    event.preventDefault();
    trackNavClick(label);
    const currentRouteKey2 = firstSegment ? getRouteKeyFromSlug(locale, firstSegment) : null;
    const targetId = sectionId === "vehicle-selection" && currentRouteKey2 === "pricing" ? "pricing-booking" : sectionId;
    const scrolled = requestScrollTo(targetId);
    if (!scrolled) {
      if (targetId === "pricing-booking") {
        setIsMenuOpen(false);
        return;
      }
      navigate(`${basePath}/`);
    }
    setIsMenuOpen(false);
  };
  return /* @__PURE__ */ jsx("nav", { className: "sticky top-0 z-50 bg-white shadow-md", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between h-20", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleNavClick(event, "hero", "logo"),
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
            onClick: () => trackNavClick("home"),
            className: `transition-colors whitespace-nowrap ${isHome ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
            children: t.navbar.home
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/`,
            onClick: (event) => handleNavClick(event, "fleet", "fleet"),
            className: "text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap",
            children: t.navbar.fleet
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportTaxi"),
            onClick: () => trackNavClick("airport_taxi"),
            className: `transition-colors whitespace-nowrap ${isAirportTaxi ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
            children: t.navbar.airportTaxi
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportSopot"),
            onClick: () => trackNavClick("airport_sopot"),
            className: `transition-colors whitespace-nowrap ${isAirportSopot ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
            children: t.navbar.airportSopot
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "airportGdynia"),
            onClick: () => trackNavClick("airport_gdynia"),
            className: `transition-colors whitespace-nowrap ${isAirportGdynia ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
            children: t.navbar.airportGdynia
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: getRoutePath(locale, "pricing"),
            onClick: () => trackNavClick("pricing"),
            className: `transition-colors whitespace-nowrap ${isPricing ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
            children: t.navbar.prices
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/blog`,
            onClick: () => trackNavClick("blog"),
            className: `transition-colors whitespace-nowrap ${isBlog ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
            children: (_a = t.navbar.blog) != null ? _a : "Blog"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-sm text-gray-600", children: [
          /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-sm", children: "🌐" }),
          /* @__PURE__ */ jsx("label", { className: "sr-only", htmlFor: "language-select", children: t.navbar.language }),
          /* @__PURE__ */ jsxs(
            "select",
            {
              id: "language-select",
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
            onClick: (event) => handleNavClick(event, "vehicle-selection", "order_now"),
            className: "bg-blue-600 text-white px-3 py-2 lg:px-5 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap",
            children: t.navbar.orderNow
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            setIsMenuOpen(!isMenuOpen);
            trackNavClick(isMenuOpen ? "menu_close" : "menu_open");
          },
          "aria-label": isMenuOpen ? "Close menu" : "Open menu",
          "aria-expanded": isMenuOpen,
          "aria-controls": "mobile-nav",
          className: "md:hidden text-gray-700 hover:text-blue-600",
          children: isMenuOpen ? /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "block text-2xl leading-none", children: "×" }) : /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "block text-xl leading-none", children: "☰" })
        }
      )
    ] }),
    isMenuOpen && /* @__PURE__ */ jsxs("div", { id: "mobile-nav", className: "md:hidden pb-4 space-y-3 text-sm", children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/`,
          onClick: () => trackNavClick("mobile_home"),
          className: `block w-full text-left py-2 transition-colors ${isHome ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
          children: t.navbar.home
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/`,
          onClick: (event) => handleNavClick(event, "fleet", "mobile_fleet"),
          className: "block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors",
          children: t.navbar.fleet
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportTaxi"),
          onClick: () => trackNavClick("mobile_airport_taxi"),
          className: `block w-full text-left py-2 transition-colors ${isAirportTaxi ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
          children: t.navbar.airportTaxi
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportSopot"),
          onClick: () => trackNavClick("mobile_airport_sopot"),
          className: `block w-full text-left py-2 transition-colors ${isAirportSopot ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
          children: t.navbar.airportSopot
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "airportGdynia"),
          onClick: () => trackNavClick("mobile_airport_gdynia"),
          className: `block w-full text-left py-2 transition-colors ${isAirportGdynia ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
          children: t.navbar.airportGdynia
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: getRoutePath(locale, "pricing"),
          onClick: () => trackNavClick("mobile_pricing"),
          className: `block w-full text-left py-2 transition-colors ${isPricing ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
          children: t.navbar.prices
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: `${basePath}/blog`,
          onClick: () => trackNavClick("mobile_blog"),
          className: `block w-full text-left py-2 transition-colors ${isBlog ? "text-blue-700 font-semibold" : "text-gray-700 hover:text-blue-600"}`,
          children: (_b = t.navbar.blog) != null ? _b : "Blog"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 py-2 text-gray-700", children: [
        /* @__PURE__ */ jsx("span", { "aria-hidden": "true", className: "text-sm", children: "🌐" }),
        /* @__PURE__ */ jsx("label", { className: "text-sm", htmlFor: "language-select-mobile", children: t.navbar.language }),
        /* @__PURE__ */ jsxs(
          "select",
          {
            id: "language-select-mobile",
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
          onClick: (event) => handleNavClick(event, "vehicle-selection", "mobile_order_now"),
          className: "block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors",
          children: t.navbar.orderNow
        }
      )
    ] })
  ] }) });
}
export {
  Navbar as N
};
