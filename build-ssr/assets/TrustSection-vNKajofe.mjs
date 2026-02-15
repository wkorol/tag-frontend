import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { Mail, MapPin } from 'lucide-react';
import { u as useI18n, x as getCityRoutes, o as trackContactClick, b as trackNavClick, y as getRoutePath, l as localeToPath, A as getRouteKeyFromSlug, B as favicon, r as requestScrollTo, C as trackLocaleChange, g as getRouteSlug, z as localeToRootPath } from '../entry-server.mjs';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TripadvisorWidget } from './TripadvisorWidget-BVBwrnhD.mjs';

function Footer() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const popularPlCitySlugs = [
    "taxi-lotnisko-gdansk-wejherowo",
    "taxi-lotnisko-gdansk-rumia",
    "taxi-lotnisko-gdansk-reda",
    "taxi-lotnisko-gdansk-malbork",
    "taxi-lotnisko-gdansk-slupsk",
    "taxi-lotnisko-gdansk-hel"
  ];
  const popularPlCityRoutes = locale === "pl" ? getCityRoutes("pl").filter((route) => popularPlCitySlugs.includes(route.slug)) : [];
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
              children: t.countryLanding?.title ?? t.navbar.airportTaxi
            }
          ),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: getRoutePath(locale, "taxiGdanskCity"),
              onClick: () => trackNavClick("footer_taxi_gdansk"),
              className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
              children: t.cityTaxi?.title ?? "Taxi Gdańsk"
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
          locale === "pl" && popularPlCityRoutes.length > 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "h-3" }),
            /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-[0.2em] text-gray-400", children: "Popularne trasy (PL)" }),
            /* @__PURE__ */ jsx("div", { className: "mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] leading-snug text-gray-200", children: popularPlCityRoutes.map((route) => /* @__PURE__ */ jsxs(
              "a",
              {
                href: `${basePath}/${route.slug}`,
                onClick: () => trackNavClick(`footer_city_${route.slug}`),
                className: "block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors",
                children: [
                  "Lotnisko ↔ ",
                  route.destination
                ]
              },
              route.slug
            )) })
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

function Navbar() {
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
            /* @__PURE__ */ jsx("img", { src: favicon, alt: "Taxi Airport Gdansk logo", className: "h-8 w-8 rounded-md" }),
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

function StarIcon({ className }) {
  return /* @__PURE__ */ jsx(
    "svg",
    {
      viewBox: "0 0 24 24",
      "aria-hidden": "true",
      className,
      fill: "currentColor",
      children: /* @__PURE__ */ jsx("path", { d: "M12 17.27l5.18 3.04-1.64-5.81 4.46-3.86-5.88-.5L12 4.5 9.88 10.14l-5.88.5 4.46 3.86-1.64 5.81L12 17.27z" })
    }
  );
}
function TrustSection() {
  const { t } = useI18n();
  const reviewsUrl = "https://maps.app.goo.gl/bG8hYPYhdD6cT394A";
  const ratingRaw = Number(undefined                                          );
  const rating = Number.isFinite(ratingRaw) && ratingRaw > 0 ? ratingRaw : null;
  const countRaw = Number(undefined                                         );
  const count = Number.isFinite(countRaw) && countRaw > 0 ? Math.round(countRaw) : null;
  const ratingText = rating ? rating.toFixed(1) : null;
  return /* @__PURE__ */ jsx("section", { className: "bg-slate-50 border-t border-slate-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs(
        "a",
        {
          href: reviewsUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "group flex h-full flex-col rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:shadow-md transition-shadow text-center",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0 flex w-full flex-col items-center px-2 sm:px-3", children: [
              /* @__PURE__ */ jsx("div", { className: "text-gray-900 font-semibold text-lg", children: t.trust.googleReviewsTitle }),
              /* @__PURE__ */ jsx("div", { className: "mt-3 w-full rounded-xl bg-slate-50 px-3 py-3", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center gap-2", children: [
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
                ratingText && /* @__PURE__ */ jsxs("span", { className: "text-base sm:text-lg text-gray-900 whitespace-nowrap", children: [
                  ratingText,
                  "/5"
                ] }),
                count && /* @__PURE__ */ jsxs("span", { className: "text-sm sm:text-base text-gray-500 whitespace-nowrap", children: [
                  "(",
                  count,
                  " ",
                  t.trust.googleReviewsCountLabel,
                  ")"
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "pt-5 px-2 sm:px-3", children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 group-hover:bg-blue-700 group-hover:shadow-blue-600/35 transition", children: [
              t.trust.googleReviewsCta,
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  viewBox: "0 0 24 24",
                  "aria-hidden": "true",
                  className: "h-4 w-4 sm:h-5 sm:w-5 opacity-90",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx("path", { d: "M7 17L17 7" }),
                    /* @__PURE__ */ jsx("path", { d: "M9 7h8v8" })
                  ]
                }
              )
            ] }) })
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm h-full flex items-center justify-center", children: /* @__PURE__ */ jsx(
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
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-3", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.companyTitle }),
        /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
          "WK DRIVE",
          /* @__PURE__ */ jsx("br", {}),
          "VAT ID (NIP): 5862330063",
          /* @__PURE__ */ jsx("br", {}),
          "Gdańsk, Poland"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.paymentTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: t.trust.paymentBody })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.comfortTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: t.trust.comfortBody })
      ] })
    ] })
  ] }) });
}

export { Footer as F, Navbar as N, TrustSection as T };
