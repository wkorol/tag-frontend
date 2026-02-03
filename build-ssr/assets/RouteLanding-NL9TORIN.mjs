import { jsxs, jsx } from 'react/jsx-runtime';
import { u as useI18n, l as localeToPath, g as getRouteSlug, N as Navbar, B as Breadcrumbs, t as trackCtaClick, r as requestScrollTo, a as trackNavClick, F as Footer, b as FloatingActions } from '../entry-server.mjs';
import 'react';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';
import 'lucide-react';

function RouteLanding({ title, description, route, examples, pricing }) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const orderLinks = [
    {
      href: `${basePath}/${getRouteSlug(locale, "orderAirportGdansk")}`,
      label: t.routeLanding.orderLinks.airportGdansk
    },
    {
      href: `${basePath}/${getRouteSlug(locale, "orderAirportSopot")}`,
      label: t.routeLanding.orderLinks.airportSopot
    },
    {
      href: `${basePath}/${getRouteSlug(locale, "orderAirportGdynia")}`,
      label: t.routeLanding.orderLinks.airportGdynia
    },
    {
      href: `${basePath}/${getRouteSlug(locale, "orderCustom")}`,
      label: t.routeLanding.orderLinks.custom
    }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: title }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-6", children: description }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: t.routeLanding.seoParagraph(route) }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/`,
            onClick: (event) => {
              event.preventDefault();
              trackCtaClick("route_landing_order");
              const scrolled = requestScrollTo("vehicle-selection");
              if (!scrolled) {
                window.location.href = `${basePath}/`;
              }
            },
            className: "inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow",
            children: t.routeLanding.orderNow
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-start gap-2 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wide text-gray-400", children: t.routeLanding.quickLinks }),
          orderLinks.map((link) => /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              onClick: () => trackNavClick("route_landing_order_link"),
              className: "text-blue-600 hover:text-blue-700",
              children: link.label
            },
            link.href
          )),
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}`,
              onClick: () => trackNavClick("route_landing_pricing"),
              className: "text-blue-600 hover:text-blue-700",
              children: t.routeLanding.pricingLink
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4 grid gap-8 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: t.routeLanding.includedTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: t.routeLanding.includedList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-3", children: t.routeLanding.destinationsTitle }),
          /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 text-gray-600 text-sm", children: examples.map((example) => /* @__PURE__ */ jsx("li", { children: example }, example)) })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 mb-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900", children: t.routeLanding.pricingTitle }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: t.routeLanding.pricingSubtitle(route) })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wide text-gray-500", children: t.routeLanding.vehicleLabel })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white border border-gray-200 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500 mb-1", children: t.routeLanding.dayLabel }),
            /* @__PURE__ */ jsxs("div", { className: "text-2xl text-gray-900 font-semibold", children: [
              pricing.day,
              " ",
              t.routeLanding.currency
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl bg-white border border-gray-200 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500 mb-1", children: t.routeLanding.nightLabel }),
            /* @__PURE__ */ jsxs("div", { className: "text-2xl text-gray-900 font-semibold", children: [
              pricing.night,
              " ",
              t.routeLanding.currency
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xs text-gray-500 mt-4", children: t.routeLanding.pricingNote })
      ] }) }) }),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: t.routeLanding.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: t.routeLanding.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

export { RouteLanding };
