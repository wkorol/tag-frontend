import { jsx, jsxs } from 'react/jsx-runtime';
import { u as useI18n, h as hasMarketingConsent } from '../entry-server.mjs';
import { useState, useMemo, useRef, useEffect } from 'react';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';
import 'lucide-react';

const localeToTripadvisorLang = {
  en: "en_US",
  pl: "pl_PL",
  de: "de_DE",
  fi: "fi_FI",
  no: "nb_NO",
  sv: "sv_SE",
  da: "da_DK"
};
function TripadvisorWidget({
  locationId: locationIdProp,
  uniq: uniqProp,
  href: hrefProp,
  requireConsent = true,
  wtype: wtypeProp,
  border: borderProp,
  shadow: shadowProp,
  backgroundColor: backgroundColorProp,
  ulId: ulIdProp,
  ulClassName: ulClassNameProp,
  liId: liIdProp,
  liClassName: liClassNameProp
}) {
  const { locale } = useI18n();
  const [canLoad, setCanLoad] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return requireConsent ? hasMarketingConsent() : true;
  });
  const locationId = locationIdProp || undefined                                             || "34104207";
  const uniq = uniqProp || undefined                                      || "444";
  const href = hrefProp || undefined                                     || "https://www.tripadvisor.com/Attraction_Review-g274725-d34104207-Reviews-Taxi_Airport_Gdansk-Gdansk_Pomerania_Province_Northern_Poland.html";
  const wtype = wtypeProp || undefined                                       || "cdsratingsonlywide";
  const border = borderProp ?? ("true") === "true";
  const shadow = typeof shadowProp === "boolean" ? shadowProp : null;
  const backgroundColor = backgroundColorProp || undefined                                                  || null;
  const lang = localeToTripadvisorLang[locale] || "en_US";
  const containerId = useMemo(() => `TA_${wtype}${uniq}`, [uniq, wtype]);
  const ulId = useMemo(() => ulIdProp || `TA_links_${uniq}`, [ulIdProp, uniq]);
  const ulClassName = useMemo(() => ulClassNameProp || "TA_links", [ulClassNameProp]);
  const liId = useMemo(() => liIdProp || void 0, [liIdProp]);
  const liClassName = useMemo(() => liClassNameProp || void 0, [liClassNameProp]);
  const markupRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!requireConsent) {
      setCanLoad(true);
      return;
    }
    const update = () => setCanLoad(hasMarketingConsent());
    update();
    const onCustom = () => update();
    const onStorage = (e) => {
      if (e.key === "cookie-consent") {
        update();
      }
    };
    window.addEventListener("cookie-consent", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cookie-consent", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [requireConsent]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!canLoad) {
      return;
    }
    if (markupRef.current) {
      const safeLiId = liId ? ` id="${liId}"` : "";
      const safeLiClass = liClassName ? ` class="${liClassName}"` : "";
      markupRef.current.innerHTML = `
        <div id="${containerId}" class="TA_${wtype}">
          <ul id="${ulId}" class="${ulClassName}">
            <li${safeLiId}${safeLiClass}>
              <a target="_blank" rel="noopener noreferrer" href="${href}">
                <img src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg" alt="TripAdvisor" />
              </a>
            </li>
          </ul>
        </div>
      `.trim();
    }
    const scriptId = `tripadvisor-widget-script-${uniq}`;
    const existing = document.getElementById(scriptId);
    if (existing && existing.src.includes(`lang=${encodeURIComponent(lang)}`)) {
      return;
    }
    if (existing) {
      existing.remove();
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    const params = new URLSearchParams();
    params.set("wtype", wtype);
    params.set("uniq", uniq);
    params.set("locationId", locationId);
    params.set("lang", lang);
    params.set("border", border ? "true" : "false");
    if (shadow !== null) {
      params.set("shadow", shadow ? "true" : "false");
    }
    if (backgroundColor) {
      params.set("backgroundColor", backgroundColor);
    }
    params.set("display_version", "2");
    script.src = `https://www.jscache.com/wejs?${params.toString()}`;
    script.setAttribute("data-loadtrk", "");
    script.onload = () => {
      script.loadtrk = true;
    };
    const containerEl = document.getElementById(containerId);
    if (containerEl && typeof containerEl.insertAdjacentElement === "function") {
      containerEl.insertAdjacentElement("afterend", script);
    } else {
      document.body.appendChild(script);
    }
    return () => {
    };
  }, [backgroundColor, border, canLoad, lang, locationId, shadow, uniq, wtype]);
  return /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("div", { ref: markupRef }) });
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

export { TrustSection };
