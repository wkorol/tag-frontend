import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { u as useEurRate, p as preloadEurRate, g as getApiBaseUrl, f as formatEur } from "./currency-DG4IOTdA.mjs";
import { u as useI18n, c as usePageTitle, l as localeToPath } from "../entry-server.mjs";
import "react-dom/server";
import "react-router-dom/server.js";
import "lucide-react";
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  price_proposed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  failed: "bg-orange-100 text-orange-800"
};
function AdminOrdersPage() {
  var _a;
  const { t, locale, setLocale } = useI18n();
  const adminLocale = "pl";
  const basePath = localeToPath(adminLocale);
  usePageTitle(t.adminOrders.title);
  const [searchParams] = useSearchParams();
  const token = (_a = searchParams.get("token")) != null ? _a : "";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const eurRate = useEurRate();
  const renderPrice = (value) => {
    const pln = Number(value);
    const eurText = pln > 0 ? formatEur(pln, eurRate) : null;
    return /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-slate-900", children: [
        value,
        " PLN"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-h-[16px] text-xs text-slate-500", children: eurText != null ? eurText : "" })
    ] });
  };
  useEffect(() => {
    preloadEurRate();
  }, []);
  useEffect(() => {
    if (locale !== adminLocale) {
      setLocale(adminLocale);
    }
    if (!token) {
      setError(t.adminOrders.missingToken);
      setLoading(false);
      return;
    }
    const apiBaseUrl = getApiBaseUrl();
    fetch(`${apiBaseUrl}/api/admin/orders?token=${encodeURIComponent(token)}`).then(async (res) => {
      var _a2;
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : t.adminOrders.errorLoad);
      }
      return data;
    }).then((data) => {
      var _a2;
      setOrders((_a2 = data == null ? void 0 : data.orders) != null ? _a2 : []);
      setError(null);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => setLoading(false));
  }, [token, locale, setLocale]);
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 px-4 py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-6xl", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-6 flex items-center justify-between", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h1", { className: "text-2xl text-slate-900", children: t.adminOrders.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: t.adminOrders.subtitle })
    ] }) }),
    loading && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-6 text-slate-600", children: t.adminOrders.loading }),
    !loading && error && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 p-6 text-red-700", children: error }),
    !loading && !error && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-4 border-b border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: t.adminOrders.columns.order }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: t.adminOrders.columns.pickup }),
        /* @__PURE__ */ jsx("div", { className: "col-span-3", children: t.adminOrders.columns.customer }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: t.adminOrders.columns.price }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: t.adminOrders.columns.status }),
        /* @__PURE__ */ jsx("div", { className: "col-span-1 text-right", children: t.adminOrders.columns.open })
      ] }),
      orders.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-6 py-8 text-sm text-slate-500", children: t.adminOrders.empty }),
      orders.map((order) => {
        var _a2;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-700",
            children: [
              /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-slate-900 font-medium", children: [
                  "#",
                  order.generatedId
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: order.id })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                /* @__PURE__ */ jsx("div", { className: "text-slate-900", children: order.date }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: order.pickupTime })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-3", children: [
                /* @__PURE__ */ jsx("div", { className: "text-slate-900", children: order.fullName }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: order.emailAddress })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "col-span-2", children: [
                renderPrice(order.proposedPrice),
                order.pendingPrice && /* @__PURE__ */ jsx("div", { className: "text-xs text-blue-600", children: t.adminOrders.pendingPrice(order.pendingPrice) })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: `inline-flex rounded-full px-3 py-1 text-xs font-medium ${(_a2 = statusStyles[order.status]) != null ? _a2 : "bg-slate-100 text-slate-700"}`,
                  children: order.status.replace("_", " ")
                }
              ) }),
              /* @__PURE__ */ jsx("div", { className: "col-span-1 text-right", children: /* @__PURE__ */ jsx(
                Link,
                {
                  to: `${basePath}/admin/orders/${order.id}?token=${encodeURIComponent(token)}`,
                  className: "text-blue-600 hover:text-blue-700",
                  children: t.adminOrders.view
                }
              ) })
            ]
          },
          order.id
        );
      })
    ] })
  ] }) });
}
export {
  AdminOrdersPage
};
