import { jsxs, jsx } from 'react/jsx-runtime';
import { useLocation, Link } from 'react-router-dom';
import { Footer } from './Footer-BpSYvjMW.mjs';
import { N as Navbar, T as TrustSection } from './TrustSection-XEWoJqKU.mjs';
import { u as useI18n, c as usePageTitle, b as getRoutePath, C as localeToRootPath } from '../entry-server.mjs';
import 'lucide-react';
import 'react';
import './TripadvisorWidget-DqBnXr23.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';

function NotFoundPage() {
  const { t, locale } = useI18n();
  const location = useLocation();
  const homePath = localeToRootPath(locale);
  usePageTitle(t.common.notFoundTitle);
  const links = [
    { href: getRoutePath(locale, "pricing"), label: t.navbar.prices },
    { href: getRoutePath(locale, "airportTaxi"), label: t.navbar.airportTaxi },
    { href: getRoutePath(locale, "airportSopot"), label: t.navbar.airportSopot },
    { href: getRoutePath(locale, "airportGdynia"), label: t.navbar.airportGdynia },
    { href: getRoutePath(locale, "cookies"), label: t.footer.cookiePolicy },
    { href: getRoutePath(locale, "privacy"), label: t.footer.privacyPolicy }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 pb-32 sm:pb-0", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-5xl px-4 py-16 sm:py-24", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10", children: [
        /* @__PURE__ */ jsx("p", { className: "text-xs font-semibold uppercase tracking-[0.2em] text-orange-600", children: "404" }),
        /* @__PURE__ */ jsx("h1", { className: "mt-3 text-3xl text-gray-900 sm:text-4xl", children: t.common.notFoundTitle }),
        /* @__PURE__ */ jsx("p", { className: "mt-3 text-base text-gray-600", children: t.common.notFoundBody }),
        /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-gray-500", children: [
          /* @__PURE__ */ jsx("span", { className: "font-medium text-gray-700", children: t.common.notFoundSupport }),
          " ",
          /* @__PURE__ */ jsx("a", { className: "text-blue-600 hover:text-blue-700", href: "mailto:booking@taxiairportgdansk.com", children: "booking@taxiairportgdansk.com" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsx(
            Link,
            {
              to: homePath,
              className: "inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow",
              children: t.common.notFoundCta
            }
          ),
          /* @__PURE__ */ jsx(
            Link,
            {
              to: getRoutePath(locale, "orderCustom"),
              className: "gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50",
              children: t.common.orderNow
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-10 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-gray-500", children: t.common.notFoundRequested }),
          /* @__PURE__ */ jsxs("p", { className: "mt-2 break-all text-sm text-gray-700", children: [
            location.pathname,
            location.search
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-gray-200 bg-white p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold uppercase tracking-wide text-gray-500", children: t.common.notFoundPopular }),
          /* @__PURE__ */ jsx("div", { className: "mt-3 grid gap-2 text-sm", children: links.map((link) => /* @__PURE__ */ jsx(Link, { to: link.href, className: "text-blue-600 hover:text-blue-700", children: link.label }, link.href)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}

export { NotFoundPage };
