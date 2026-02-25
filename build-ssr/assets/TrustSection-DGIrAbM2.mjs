import { jsx, jsxs } from "react/jsx-runtime";
import { u as useI18n } from "../entry-server.mjs";
import { TripadvisorWidget } from "./TripadvisorWidget-CPezc-jA.mjs";
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
  const ratingRaw = Number(void 0);
  const rating = Number.isFinite(ratingRaw) && ratingRaw > 0 ? ratingRaw : null;
  const countRaw = Number(void 0);
  const count = Number.isFinite(countRaw) && countRaw > 0 ? Math.round(countRaw) : null;
  const ratingText = rating ? rating.toFixed(1) : null;
  return /* @__PURE__ */ jsx("section", { className: "bg-slate-50 border-t border-slate-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8 grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsx("div", { className: "rounded-2xl border border-slate-200 bg-white px-5 pt-14 pb-16 sm:pt-16 sm:pb-20 shadow-sm", children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-3 py-2 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "text-gray-900 font-semibold text-lg", children: t.trust.googleReviewsTitle }),
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
        /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-gray-700", children: [
          ratingText && /* @__PURE__ */ jsxs("span", { className: "text-base sm:text-lg", children: [
            ratingText,
            "/5"
          ] }),
          count && /* @__PURE__ */ jsxs("span", { className: "text-sm sm:text-base text-gray-500", children: [
            "(",
            count,
            " ",
            t.trust.googleReviewsCountLabel,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: reviewsUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            className: "inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition",
            children: t.trust.googleReviewsCta
          }
        )
      ] }) }),
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
export {
  TrustSection as T
};
