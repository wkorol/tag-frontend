import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { MapPin, Sun, Moon, Calculator, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { u as useEurRate, p as preloadEurRate, f as formatEur } from './currency-BfL_L89a.mjs';
import { F as FIXED_PRICES } from './fixedPricing-DAP14xsE.mjs';
import { u as useI18n, e as trackPricingRouteSelect, f as trackPricingAction, h as trackVehicleSelect } from '../entry-server.mjs';
import { T as TrustBar } from './TrustBar-BQrybA1i.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';

function Pricing({
  vehicleType,
  onOrderRoute,
  onRequestQuote,
  onBack,
  showBack = true,
  variant = "flow",
  onVehicleTypeChange
}) {
  const { t } = useI18n();
  const routes = [
    {
      key: "airport_gdansk",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: FIXED_PRICES.standard.gdansk.day,
      priceNight: FIXED_PRICES.standard.gdansk.night,
      type: "standard"
    },
    {
      key: "airport_sopot",
      from: t.pricing.routes.airport,
      to: "Sopot",
      priceDay: FIXED_PRICES.standard.sopot.day,
      priceNight: FIXED_PRICES.standard.sopot.night,
      type: "standard"
    },
    {
      key: "airport_gdynia",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: FIXED_PRICES.standard.gdynia.day,
      priceNight: FIXED_PRICES.standard.gdynia.night,
      type: "standard"
    }
  ];
  const busRoutes = [
    {
      key: "airport_gdansk",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: FIXED_PRICES.bus.gdansk.day,
      priceNight: FIXED_PRICES.bus.gdansk.night,
      type: "bus"
    },
    {
      key: "airport_sopot",
      from: t.pricing.routes.airport,
      to: "Sopot",
      priceDay: FIXED_PRICES.bus.sopot.day,
      priceNight: FIXED_PRICES.bus.sopot.night,
      type: "bus"
    },
    {
      key: "airport_gdynia",
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: FIXED_PRICES.bus.gdynia.day,
      priceNight: FIXED_PRICES.bus.gdynia.night,
      type: "bus"
    }
  ];
  const displayRoutes = vehicleType === "bus" ? busRoutes : routes;
  const title = vehicleType === "bus" ? t.pricing.titleBus : t.pricing.titleStandard;
  const eurRate = useEurRate();
  const eurText = (pln) => formatEur(pln, eurRate);
  const renderPriceWithEur = (pln, plnLineClassName) => {
    if (typeof pln !== "number" || !Number.isFinite(pln)) {
      return /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
        /* @__PURE__ */ jsx("div", { className: plnLineClassName, children: "—" }),
        /* @__PURE__ */ jsx("div", { className: "min-h-[16px] text-xs text-gray-500" })
      ] });
    }
    const eur = eurText(pln);
    return /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsx("div", { className: plnLineClassName, children: /* @__PURE__ */ jsxs("span", { className: "inline-flex items-baseline gap-1 whitespace-nowrap", children: [
        /* @__PURE__ */ jsx("span", { className: "tabular-nums", children: pln }),
        /* @__PURE__ */ jsx("span", { className: "pricing-rate-currency font-semibold text-slate-500 tracking-wider", children: "PLN" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "min-h-[16px] text-xs text-gray-500", children: eur ? /* @__PURE__ */ jsx("span", { className: "eur-text", children: eur }) : "" })
    ] });
  };
  useEffect(() => {
    preloadEurRate();
  }, []);
  const pricingTable = /* @__PURE__ */ jsxs("div", { className: variant === "landing" ? "rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-slate-50 p-8 shadow-lg" : "", children: [
    /* @__PURE__ */ jsx("h3", { className: `text-lg font-semibold text-gray-900 ${variant === "landing" ? "text-center" : ""}`, children: t.pricing.tableTitle }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 hidden sm:block", children: /* @__PURE__ */ jsxs("table", { className: "w-full border-collapse text-sm", children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { className: "bg-slate-100 text-slate-700", children: [
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-left", children: t.pricing.tableRoute }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: t.pricing.tableStandardDay }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "leading-tight text-right", children: [
          /* @__PURE__ */ jsx("div", { children: t.pricing.tableStandardNight }),
          /* @__PURE__ */ jsx("div", { className: "pricing-sunday-note font-normal text-slate-500", children: t.pricing.sundayNote })
        ] }) }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: t.pricing.tableBusDay }),
        /* @__PURE__ */ jsx("th", { className: "border border-slate-200 px-4 py-3 text-right", children: /* @__PURE__ */ jsxs("div", { className: "leading-tight text-right", children: [
          /* @__PURE__ */ jsx("div", { children: t.pricing.tableBusNight }),
          /* @__PURE__ */ jsx("div", { className: "pricing-sunday-note font-normal text-slate-500", children: t.pricing.sundayNote })
        ] }) })
      ] }) }),
      /* @__PURE__ */ jsx("tbody", { children: routes.map((route, index) => /* @__PURE__ */ jsxs("tr", { className: "odd:bg-white even:bg-slate-50", children: [
        /* @__PURE__ */ jsxs("td", { className: "border border-slate-200 px-4 py-3", children: [
          route.from,
          " ↔ ",
          route.to
        ] }),
        /* @__PURE__ */ jsx("td", { className: "border border-slate-200 px-4 py-3 text-right", children: renderPriceWithEur(route.priceDay) }),
        /* @__PURE__ */ jsx("td", { className: "border border-slate-200 px-4 py-3 text-right", children: renderPriceWithEur(route.priceNight) }),
        /* @__PURE__ */ jsx("td", { className: "border border-slate-200 px-4 py-3 text-right", children: renderPriceWithEur(busRoutes[index]?.priceDay) }),
        /* @__PURE__ */ jsx("td", { className: "border border-slate-200 px-4 py-3 text-right", children: renderPriceWithEur(busRoutes[index]?.priceNight) })
      ] }, `${route.to}-${index}`)) })
    ] }) }),
    /* @__PURE__ */ jsx("div", { className: "mt-6 space-y-4 sm:hidden", children: routes.map((route, index) => /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-sm font-semibold text-gray-900", children: [
        route.from,
        " ↔ ",
        route.to
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableStandardDay }),
          renderPriceWithEur(route.priceDay, "mt-1 text-sm font-semibold text-gray-900")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableStandardNight }),
          /* @__PURE__ */ jsx("div", { className: "pricing-sunday-note mt-0.5 text-slate-400", children: t.pricing.sundayNote }),
          renderPriceWithEur(route.priceNight, "mt-1 text-sm font-semibold text-gray-900")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableBusDay }),
          renderPriceWithEur(busRoutes[index]?.priceDay, "mt-1 text-sm font-semibold text-gray-900")
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-slate-50 p-3", children: [
          /* @__PURE__ */ jsx("div", { className: "text-[10px] uppercase tracking-wide text-slate-500", children: t.pricing.tableBusNight }),
          /* @__PURE__ */ jsx("div", { className: "pricing-sunday-note mt-0.5 text-slate-400", children: t.pricing.sundayNote }),
          renderPriceWithEur(busRoutes[index]?.priceNight, "mt-1 text-sm font-semibold text-gray-900")
        ] })
      ] })
    ] }, `${route.to}-mobile-${index}`)) })
  ] });
  const pricingCards = /* @__PURE__ */ jsxs("div", { className: "pricing-grid-mobile grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch", children: [
    displayRoutes.map((route, index) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `pricing-card-mobile rounded-2xl p-6 border-2 hover:shadow-xl transition-all ${vehicleType === "bus" ? "bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-blue-300 hover:border-blue-500" : "bg-gradient-to-br from-gray-50 via-white to-gray-100 border-gray-200 hover:border-blue-500"}`,
        children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
            /* @__PURE__ */ jsx(MapPin, { className: "pricing-icon w-6 h-6 text-blue-600 flex-shrink-0 mt-1" }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("div", { className: "pricing-route text-gray-900 font-semibold text-base", children: route.from }),
              /* @__PURE__ */ jsx("div", { className: "pricing-route text-gray-500 text-sm", children: "↕" }),
              /* @__PURE__ */ jsx("div", { className: "pricing-route text-gray-900 font-semibold text-base", children: route.to })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-3 mt-6", children: [
            /* @__PURE__ */ jsxs("div", { className: "pricing-rate-box flex items-center justify-between gap-3 bg-white/90 p-4 rounded-lg border border-blue-200 shadow-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
                /* @__PURE__ */ jsx(Sun, { className: "pricing-rate-icon w-5 h-5 text-yellow-500" }),
                /* @__PURE__ */ jsx("span", { className: "pricing-rate-label text-gray-800 font-medium text-sm", children: t.pricing.dayRate })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-right flex-shrink-0", children: [
                /* @__PURE__ */ jsxs("div", { className: "inline-flex items-baseline justify-end gap-1 whitespace-nowrap", children: [
                  /* @__PURE__ */ jsx("span", { className: "pricing-rate-value text-blue-900 font-semibold text-base tabular-nums leading-none", children: route.priceDay }),
                  /* @__PURE__ */ jsx("span", { className: "pricing-rate-currency font-semibold text-blue-900/70 tracking-wider leading-none", children: "PLN" })
                ] }),
                eurText(route.priceDay) && /* @__PURE__ */ jsx("div", { className: "eur-row flex items-center justify-end text-gray-500 text-xs whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText(route.priceDay) }) })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "pricing-rate-box bg-gray-900 p-4 rounded-lg border border-blue-800 shadow-sm text-white", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-3", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-2 min-w-0", children: [
                  /* @__PURE__ */ jsx(Moon, { className: "pricing-rate-icon w-5 h-5 text-blue-300 mt-0.5" }),
                  /* @__PURE__ */ jsx("div", { className: "pricing-rate-label font-medium text-sm leading-tight", children: t.pricing.nightRate })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right flex-shrink-0", children: [
                  /* @__PURE__ */ jsxs("div", { className: "inline-flex items-baseline justify-end gap-1 whitespace-nowrap", children: [
                    /* @__PURE__ */ jsx("span", { className: "pricing-rate-value font-semibold text-base tabular-nums leading-none", children: route.priceNight }),
                    /* @__PURE__ */ jsx("span", { className: "pricing-rate-currency font-semibold text-white/70 tracking-wider leading-none", children: "PLN" })
                  ] }),
                  eurText(route.priceNight) && /* @__PURE__ */ jsx("div", { className: "eur-row flex items-center justify-end text-blue-200 text-xs whitespace-nowrap", children: /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText(route.priceNight) }) })
                ] })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "pricing-sunday-note mt-1 text-center text-blue-200/70 whitespace-nowrap", children: t.pricing.sundayNote })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                trackPricingRouteSelect(route.key, vehicleType);
                onOrderRoute(route);
              },
              className: "pricing-cta w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm",
              children: t.common.orderNow
            }
          )
        ]
      },
      index
    )),
    /* @__PURE__ */ jsxs("div", { className: "pricing-card-mobile pricing-card--custom bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-lg h-full flex flex-col", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-4", children: [
        /* @__PURE__ */ jsx(Calculator, { className: "pricing-icon w-6 h-6 text-purple-600 flex-shrink-0 mt-1" }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-title text-gray-900 text-base", children: t.pricing.customRouteTitle }),
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-body text-gray-600 text-sm mt-1", children: t.pricing.customRouteBody })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4 mt-6 flex-1 flex flex-col", children: [
        /* @__PURE__ */ jsxs("div", { className: "pricing-rate-box bg-white rounded-lg p-4", children: [
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-price text-gray-700 text-sm mb-2", children: t.pricing.customRoutePrice }),
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-note text-gray-600 text-xs", children: t.pricing.customRoutePriceBody }),
          /* @__PURE__ */ jsx("div", { className: "pricing-custom-note text-gray-600 text-xs mt-2", children: t.pricing.customRouteAutoNote })
        ] }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              trackPricingAction("request_quote", vehicleType);
              onRequestQuote();
            },
            className: "pricing-cta mt-auto block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm",
            children: t.pricing.requestQuote
          }
        )
      ] })
    ] })
  ] });
  return /* @__PURE__ */ jsx("section", { id: "vehicle-selection", className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    showBack && /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => {
          trackPricingAction("back", vehicleType);
          onBack();
        },
        className: "flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors",
        children: [
          /* @__PURE__ */ jsx(ChevronLeft, { className: "w-5 h-5" }),
          t.pricing.back
        ]
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-gray-900 mb-2", children: title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: t.pricing.description }),
      /* @__PURE__ */ jsx(TrustBar, { className: "pricing-trustbar" })
    ] }),
    variant === "landing" ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { id: "pricing-table", className: "mt-12", children: pricingTable }),
      /* @__PURE__ */ jsxs("div", { id: "pricing-booking", className: "mt-12 text-center", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-2xl text-gray-900", children: t.pricing.bookingTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: t.pricing.bookingSubtitle }),
        onVehicleTypeChange && /* @__PURE__ */ jsxs("div", { className: "mt-8 inline-flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                trackVehicleSelect("standard");
                onVehicleTypeChange("standard");
              },
              className: `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${vehicleType === "standard" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`,
              children: t.vehicle.standardTitle
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                trackVehicleSelect("bus");
                onVehicleTypeChange("bus");
              },
              className: `px-4 py-2 rounded-full text-sm font-semibold transition-colors ${vehicleType === "bus" ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-blue-50"}`,
              children: t.vehicle.busTitle
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mt-14", style: { marginTop: "3.5rem" }, children: pricingCards })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      pricingCards,
      /* @__PURE__ */ jsx("div", { className: "mt-12", children: pricingTable })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "mt-8 text-center text-gray-600 text-sm", children: /* @__PURE__ */ jsx("p", { children: t.pricing.pricesNote }) })
  ] }) });
}

export { Pricing };
