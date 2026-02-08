import { jsx, jsxs } from 'react/jsx-runtime';
import { Calculator, Car, Users, Info } from 'lucide-react';
import { useRef, useEffect } from 'react';
import { u as useI18n, l as localeToPath, g as getRouteSlug } from '../entry-server.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';

function VehicleTypeSelector({ onSelectType }) {
  const { t, locale } = useI18n();
  const sectionRef = useRef(null);
  const pricingPath = `${localeToPath(locale)}/${getRouteSlug(locale, "pricing")}#pricing-calculator`;
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const element = sectionRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return /* @__PURE__ */ jsx("section", { id: "vehicle-selection", ref: sectionRef, className: "py-16 bg-white", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-gray-900 mb-4", children: t.vehicle.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 max-w-2xl mx-auto", children: t.vehicle.subtitle }),
      /* @__PURE__ */ jsx("div", { className: "mt-6 flex justify-center", children: /* @__PURE__ */ jsxs(
        "a",
        {
          href: pricingPath,
          className: "gemini-cta inline-flex w-full items-center justify-center gap-3 rounded-full px-12 py-4 text-base font-semibold text-blue-800 shadow-sm transition-colors hover:bg-blue-50 sm:w-auto",
          children: [
            /* @__PURE__ */ jsx(Calculator, { className: "h-4 w-4" }),
            t.pricingCalculator.title
          ]
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "vehicle-grid-mobile grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch", children: [
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onSelectType("standard"),
          className: "vehicle-card-mobile group self-stretch min-h-[22rem] md:min-h-[26rem] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-3 border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "vehicle-card__icon w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors", children: /* @__PURE__ */ jsx(Car, { className: "vehicle-card__icon-svg w-12 h-12 text-blue-600" }) }) }),
            /* @__PURE__ */ jsx("h3", { className: "vehicle-card__title text-gray-900 text-center mb-3 text-base", children: t.vehicle.standardTitle }),
            /* @__PURE__ */ jsxs("div", { className: "vehicle-card__info flex flex-1 flex-col gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base", children: [
                /* @__PURE__ */ jsx(Users, { className: "vehicle-card__meta-icon w-5 h-5 text-blue-600" }),
                /* @__PURE__ */ jsx("span", { className: "vehicle-card__text", children: t.vehicle.standardPassengers })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "vehicle-card__desc text-center text-gray-600 text-sm", children: t.vehicle.standardDescription })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-6 grid gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-selfmanage-badge rounded-xl bg-blue-50/90 px-3 text-slate-700 shadow-sm ring-1 ring-inset ring-blue-200/80", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 ring-1 ring-inset ring-blue-200/70", children: /* @__PURE__ */ jsx(Info, { className: "h-3 w-3 text-blue-700" }) }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap", children: t.vehicle.selfManageBadge })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "vehicle-select-cta gemini-cta w-full px-6 rounded-lg text-center font-semibold text-blue-800 transition-colors whitespace-nowrap overflow-hidden",
                  style: { ["--cta-bg"]: "#ffffff" },
                  children: /* @__PURE__ */ jsx("span", { className: "max-w-full truncate", children: t.vehicle.selectStandard })
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => onSelectType("bus"),
          className: "vehicle-card-mobile group self-stretch min-h-[22rem] md:min-h-[26rem] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-3 border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col",
          children: [
            /* @__PURE__ */ jsx("div", { className: "flex justify-center mb-6", children: /* @__PURE__ */ jsx("div", { className: "vehicle-card__icon w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors", children: /* @__PURE__ */ jsx(Users, { className: "vehicle-card__icon-svg w-12 h-12 text-blue-700" }) }) }),
            /* @__PURE__ */ jsx("h3", { className: "vehicle-card__title text-gray-900 text-center mb-3 text-base", children: t.vehicle.busTitle }),
            /* @__PURE__ */ jsxs("div", { className: "vehicle-card__info flex flex-1 flex-col gap-3", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base", children: [
                /* @__PURE__ */ jsx(Users, { className: "vehicle-card__meta-icon w-5 h-5 text-blue-600" }),
                /* @__PURE__ */ jsx("span", { className: "vehicle-card__text", children: t.vehicle.busPassengers })
              ] }),
              /* @__PURE__ */ jsx("p", { className: "vehicle-card__desc text-center text-gray-600 text-sm", children: t.vehicle.busDescription })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-auto pt-6 grid gap-2", children: [
              /* @__PURE__ */ jsxs("div", { className: "vehicle-selfmanage-badge rounded-xl bg-blue-50/90 px-3 text-slate-700 shadow-sm ring-1 ring-inset ring-blue-200/80", children: [
                /* @__PURE__ */ jsx("span", { className: "inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 ring-1 ring-inset ring-blue-200/70", children: /* @__PURE__ */ jsx(Info, { className: "h-3 w-3 text-blue-700" }) }),
                /* @__PURE__ */ jsx("span", { className: "ml-2 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap", children: t.vehicle.selfManageBadge })
              ] }),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: "vehicle-select-cta gemini-cta w-full px-6 rounded-lg text-center font-semibold text-blue-800 transition-colors whitespace-nowrap overflow-hidden",
                  style: { ["--cta-bg"]: "#ffffff" },
                  children: /* @__PURE__ */ jsx("span", { className: "max-w-full truncate", children: t.vehicle.selectBus })
                }
              )
            ] })
          ]
        }
      )
    ] })
  ] }) });
}

export { VehicleTypeSelector };
