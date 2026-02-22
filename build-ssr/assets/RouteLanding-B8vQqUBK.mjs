import { jsxs, jsx } from 'react/jsx-runtime';
import { B as Breadcrumbs } from './Breadcrumbs-BLHIqKga.mjs';
import { Footer } from './Footer-BpSYvjMW.mjs';
import { u as useI18n, c as usePageTitle, l as localeToPath, d as getRouteSlug, t as trackCtaClick, r as requestScrollTo, e as trackNavClick, F as FloatingActions } from '../entry-server.mjs';
import { N as Navbar, T as TrustSection } from './TrustSection-D7MDO7Tu.mjs';
import 'lucide-react';
import 'react';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import './TripadvisorWidget-DqBnXr23.mjs';

function RouteLanding({ title, description, route, examples, pricing }) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  usePageTitle(title);
  const fallbackSeoParagraphByLocale = {
    pl: `Zarezerwuj prywatny transfer lotniskowy na trasie ${route} ze stałą ceną, dostępnością 24/7 i szybkim potwierdzeniem.`,
    de: `Buchen Sie einen privaten Flughafentransfer auf der Strecke ${route} mit Festpreis, 24/7 Verfügbarkeit und schneller Bestätigung.`,
    fi: `Varaa yksityinen lentokenttäkuljetus reitille ${route} kiinteällä hinnalla, 24/7 saatavuudella ja nopealla vahvistuksella.`,
    no: `Bestill privat flyplasstransport på ruten ${route} med fast pris, 24/7 tilgjengelighet og rask bekreftelse.`,
    sv: `Boka privat flygplatstransfer på sträckan ${route} med fast pris, tillgänglighet dygnet runt och snabb bekräftelse.`,
    da: `Book privat lufthavnstransfer på ruten ${route} med fast pris, 24/7 tilgængelighed og hurtig bekræftelse.`,
    en: `Book private airport transfer on route ${route} with fixed prices, 24/7 availability, and quick confirmation.`
  };
  const fallbackPricingSubtitleByLocale = {
    pl: `Szacunkowe ceny dla trasy ${route}.`,
    de: `Beispielpreise für die Strecke ${route}.`,
    fi: `Arvioidut hinnat reitille ${route}.`,
    no: `Estimerte priser for ruten ${route}.`,
    sv: `Uppskattade priser för sträckan ${route}.`,
    da: `Estimerede priser for ruten ${route}.`,
    en: `Estimated prices for route ${route}.`
  };
  const seoParagraph = typeof t.routeLanding?.seoParagraph === "function" ? t.routeLanding.seoParagraph(route) : fallbackSeoParagraphByLocale[locale] ?? fallbackSeoParagraphByLocale.en;
  const pricingSubtitle = typeof t.routeLanding?.pricingSubtitle === "function" ? t.routeLanding.pricingSubtitle(route) : fallbackPricingSubtitleByLocale[locale] ?? fallbackPricingSubtitleByLocale.en;
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
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: seoParagraph }),
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
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: pricingSubtitle })
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
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mb-1 leading-tight", children: [
              t.routeLanding.nightLabel,
              " ",
              /* @__PURE__ */ jsx("span", { className: "pricing-sunday-note text-gray-400", children: t.pricing.sundayNote })
            ] }),
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
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

export { RouteLanding };
