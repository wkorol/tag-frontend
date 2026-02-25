import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useMemo, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import { Calendar, CheckCircle2, XCircle } from "lucide-react";
import { g as getApiBaseUrl } from "./api-Ck-Mugua.mjs";
import { u as useEurRate, p as preloadEurRate, f as formatEur } from "./currency-Dq1_z9aO.mjs";
import { u as useI18n, c as usePageTitle, l as localeToPath } from "../entry-server.mjs";
import "react-dom/server";
import "react-router-dom/server.js";
const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  price_proposed: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  failed: "bg-orange-100 text-orange-800"
};
const parseNotes = (notes) => {
  if (!notes) {
    return null;
  }
  try {
    return JSON.parse(notes);
  } catch {
    return null;
  }
};
const mapFixedLabelToPolish = (value) => {
  var _a;
  const normalized = value.trim();
  const map = {
    Airport: "Lotnisko",
    Flughafen: "Lotnisko",
    Lentokenttä: "Lotnisko",
    Flyplass: "Lotnisko",
    Flygplats: "Lotnisko",
    Lufthavn: "Lotnisko",
    Lotnisko: "Lotnisko",
    "Gdańsk City Center": "Centrum Gdańska",
    "Gdańsk Zentrum": "Centrum Gdańska",
    "Gdańsk centrum": "Centrum Gdańska",
    "Gdańsk sentrum": "Centrum Gdańska",
    "Gdańskin keskusta": "Centrum Gdańska",
    "Centrum Gdańska": "Centrum Gdańska",
    "Gdynia City Center": "Centrum Gdyni",
    "Gdynia Zentrum": "Centrum Gdyni",
    "Gdynia centrum": "Centrum Gdyni",
    "Gdynia sentrum": "Centrum Gdyni",
    "Gdynian keskusta": "Centrum Gdyni",
    "Centrum Gdyni": "Centrum Gdyni"
  };
  return (_a = map[normalized]) != null ? _a : value;
};
const normalizeWhatsappNumber = (value) => {
  const digits = value.replace(/\D/g, "");
  if (!digits) {
    return null;
  }
  if (digits.startsWith("48")) {
    return digits;
  }
  if (digits.length === 9) {
    return `48${digits}`;
  }
  if (digits.length === 10 && digits.startsWith("0")) {
    return `48${digits.slice(1)}`;
  }
  return digits;
};
const buildWhatsappLink = (phone, fullName) => {
  const digits = normalizeWhatsappNumber(phone);
  if (!digits) {
    return null;
  }
  const message = `Cześć ${fullName}, tu Taxi Airport Gdańsk.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};
function AdminOrderPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const { t, locale, setLocale } = useI18n();
  const adminLocale = "pl";
  const basePath = localeToPath(adminLocale);
  usePageTitle(t.adminOrder.title);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = (_a = searchParams.get("token")) != null ? _a : "";
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [priceInput, setPriceInput] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [updateFields, setUpdateFields] = useState({
    phone: false,
    email: false,
    flight: false
  });
  const [submitting, setSubmitting] = useState(false);
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
  const parsedNotes = useMemo(() => parseNotes(order == null ? void 0 : order.additionalNotes), [order == null ? void 0 : order.additionalNotes]);
  const pickupDateTime = useMemo(() => {
    if (!(order == null ? void 0 : order.date) || !(order == null ? void 0 : order.pickupTime)) {
      return null;
    }
    const timeMatch = order.pickupTime.match(/^(\d{1,2}):(\d{2})/);
    if (!timeMatch) {
      return null;
    }
    const hours = Number(timeMatch[1]);
    const minutes = Number(timeMatch[2]);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }
    const dateTime = /* @__PURE__ */ new Date(`${order.date}T00:00:00`);
    if (Number.isNaN(dateTime.getTime())) {
      return null;
    }
    dateTime.setHours(hours, minutes, 0, 0);
    return dateTime;
  }, [order == null ? void 0 : order.date, order == null ? void 0 : order.pickupTime]);
  const canFulfill = (order == null ? void 0 : order.status) === "confirmed" && pickupDateTime && pickupDateTime.getTime() < Date.now();
  useEffect(() => {
    preloadEurRate();
  }, []);
  const fetchOrder = () => {
    if (!id || !token) {
      setError(t.adminOrder.missingToken);
      setLoading(false);
      return;
    }
    const apiBaseUrl = getApiBaseUrl();
    setLoading(true);
    fetch(`${apiBaseUrl}/api/admin/orders/${id}?token=${encodeURIComponent(token)}`).then(async (res) => {
      var _a2;
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : t.adminOrder.errorLoad);
      }
      return data;
    }).then((data) => {
      var _a2;
      setOrder(data);
      setPriceInput((_a2 = data == null ? void 0 : data.proposedPrice) != null ? _a2 : "");
      setError(null);
    }).catch((err) => {
      setError(err.message);
    }).finally(() => setLoading(false));
  };
  useEffect(() => {
    if (locale !== adminLocale) {
      setLocale(adminLocale);
    }
    fetchOrder();
  }, [id, token, locale, setLocale]);
  const postDecision = async (payload) => {
    var _a2;
    if (!id || !token) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/decision?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : "Failed to update order.");
      }
      setActionMessage(t.adminOrder.updated);
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };
  const postAdminCancel = async () => {
    var _a2;
    if (!id || !token) {
      return;
    }
    if (!window.confirm(t.adminOrder.cancelConfirmedConfirm)) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/cancel?token=${encodeURIComponent(token)}`,
        { method: "POST" }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : t.adminOrder.updateError);
      }
      setActionMessage(t.adminOrder.cancelConfirmedSuccess);
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };
  const postAdminDelete = async () => {
    var _a2;
    if (!id || !token) {
      return;
    }
    if (!window.confirm(t.adminOrder.deleteRejectedConfirm)) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/delete?token=${encodeURIComponent(token)}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : t.adminOrder.updateError);
      }
      setActionMessage(t.adminOrder.deleteRejectedSuccess);
      navigate(`${basePath}/admin?token=${encodeURIComponent(token)}`, { replace: true });
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };
  const postFulfillment = async (action) => {
    var _a2;
    if (!id || !token) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/fulfillment?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action })
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : "Failed to update order.");
      }
      setActionMessage(t.adminOrder.statusUpdated);
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };
  const postUpdateRequest = async () => {
    var _a2;
    if (!id || !token) {
      return;
    }
    const fields = Object.entries(updateFields).filter(([, selected]) => selected).map(([field]) => field);
    if (fields.length === 0) {
      setActionMessage(t.adminOrder.updateRequestSelect);
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/request-update?token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fields })
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : t.adminOrder.updateRequestError);
      }
      setActionMessage(t.adminOrder.updateRequestSent);
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateRequestError);
    } finally {
      setSubmitting(false);
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 px-4 py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl text-slate-900", children: t.adminOrder.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: t.adminOrder.subtitle })
      ] }),
      (order == null ? void 0 : order.canViewAll) && /* @__PURE__ */ jsx(
        Link,
        {
          to: `${basePath}/admin?token=${encodeURIComponent(token)}`,
          className: "text-sm text-blue-600 hover:text-blue-700",
          children: t.adminOrder.back
        }
      )
    ] }),
    loading && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-6 text-slate-600", children: t.adminOrder.loading }),
    !loading && error && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 p-6 text-red-700", children: error }),
    !loading && order && /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-xl text-slate-900", children: [
              t.adminOrder.orderLabel,
              " #",
              order.generatedId
            ] }),
            /* @__PURE__ */ jsxs("p", { className: "text-sm text-slate-600", children: [
              t.adminOrder.idLabel,
              ": ",
              order.id
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `inline-flex rounded-full px-3 py-1 text-xs font-medium ${(_b = statusStyles[order.status]) != null ? _b : "bg-slate-100 text-slate-700"}`,
              children: order.status.replace("_", " ")
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase text-slate-500", children: t.adminOrder.customerLabel }),
            /* @__PURE__ */ jsx("div", { className: "text-slate-900", children: order.fullName }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600", children: order.emailAddress }),
            (() => {
              const whatsappLink = buildWhatsappLink(order.phoneNumber, order.fullName);
              if (!whatsappLink) {
                return /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600", children: order.phoneNumber });
              }
              return /* @__PURE__ */ jsx(
                "a",
                {
                  className: "text-sm text-slate-600 underline underline-offset-2 hover:text-emerald-600",
                  href: whatsappLink,
                  target: "_blank",
                  rel: "noreferrer",
                  children: order.phoneNumber
                }
              );
            })()
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase text-slate-500", children: t.adminOrder.pickupLabel }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-slate-900", children: [
              /* @__PURE__ */ jsx(Calendar, { className: "h-4 w-4 text-blue-600" }),
              order.date,
              " ",
              order.pickupTime
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-600", children: mapFixedLabelToPolish(order.pickupAddress) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase text-slate-500", children: t.adminOrder.priceLabel }),
            renderPrice(order.proposedPrice),
            order.pendingPrice && /* @__PURE__ */ jsx("div", { className: "text-sm text-blue-700", children: t.adminOrder.pendingPrice(order.pendingPrice) })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-100 bg-slate-50 p-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-xs uppercase text-slate-500", children: t.adminOrder.additionalInfo }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.passengers,
              " ",
              (_c = parsedNotes == null ? void 0 : parsedNotes.passengers) != null ? _c : "—"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.largeLuggage,
              " ",
              (_d = parsedNotes == null ? void 0 : parsedNotes.largeLuggage) != null ? _d : "—"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.pickupType,
              " ",
              (_e = parsedNotes == null ? void 0 : parsedNotes.pickupType) != null ? _e : "—"
            ] }),
            (parsedNotes == null ? void 0 : parsedNotes.signService) && /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.signService,
              " ",
              parsedNotes.signService === "sign" ? t.adminOrder.signServiceSign : t.adminOrder.signServiceSelf
            ] }),
            typeof (parsedNotes == null ? void 0 : parsedNotes.signFee) === "number" && parsedNotes.signFee > 0 && /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700 leading-tight", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                t.adminOrder.signFee,
                " ",
                parsedNotes.signFee,
                " PLN"
              ] }),
              /* @__PURE__ */ jsx("div", { className: "min-h-[16px] text-xs text-slate-500", children: (_f = formatEur(parsedNotes.signFee, eurRate)) != null ? _f : "" })
            ] }),
            (parsedNotes == null ? void 0 : parsedNotes.pickupType) === "airport" && /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.flightNumber,
              " ",
              order.flightNumber || "—"
            ] }),
            (parsedNotes == null ? void 0 : parsedNotes.signText) && /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.signText,
              " ",
              parsedNotes.signText
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.route,
              " ",
              ((_g = parsedNotes == null ? void 0 : parsedNotes.route) == null ? void 0 : _g.from) ? mapFixedLabelToPolish(parsedNotes.route.from) : "—",
              " →",
              " ",
              ((_h = parsedNotes == null ? void 0 : parsedNotes.route) == null ? void 0 : _h.to) ? mapFixedLabelToPolish(parsedNotes.route.to) : "—"
            ] }),
            (parsedNotes == null ? void 0 : parsedNotes.notes) && /* @__PURE__ */ jsxs("div", { className: "text-sm text-slate-700", children: [
              t.adminOrder.notes,
              " ",
              parsedNotes.notes
            ] })
          ] })
        ] })
      ] }),
      actionMessage && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700", children: actionMessage }),
      order.status === "pending" && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg text-slate-900", children: t.adminOrder.adminActions }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 transition-colors",
              disabled: submitting,
              onClick: () => postDecision({ action: "confirm" }),
              children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
                t.adminOrder.confirmOrder
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition-colors",
              disabled: submitting,
              onClick: () => postDecision({ action: "reject", message: rejectReason }),
              children: [
                /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
                t.adminOrder.rejectOrder
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm text-slate-700", children: t.adminOrder.proposePrice }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: priceInput,
                onChange: (event) => setPriceInput(event.target.value),
                className: "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "mt-3 w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50 transition-colors",
                disabled: submitting,
                onClick: () => postDecision({ action: "price", price: priceInput }),
                children: t.adminOrder.sendPrice
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "text-sm text-slate-700", children: t.adminOrder.rejectionReason }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                value: rejectReason,
                onChange: (event) => setRejectReason(event.target.value),
                rows: 4,
                className: "mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
              }
            )
          ] })
        ] })
      ] }),
      (order.status === "pending" || order.status === "confirmed") && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg text-slate-900", children: t.adminOrder.requestUpdate }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: t.adminOrder.requestUpdateBody }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-3 sm:grid-cols-3", children: ["phone", "email", "flight"].map((field) => /* @__PURE__ */ jsxs(
          "label",
          {
            className: "flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700",
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: updateFields[field],
                  onChange: (event) => setUpdateFields((prev) => ({
                    ...prev,
                    [field]: event.target.checked
                  }))
                }
              ),
              field === "phone" ? t.adminOrder.fieldPhone : field === "email" ? t.adminOrder.fieldEmail : t.adminOrder.fieldFlight
            ]
          },
          field
        )) }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "w-full rounded-lg border border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 transition-colors",
            disabled: submitting,
            onClick: postUpdateRequest,
            children: t.adminOrder.requestUpdateAction
          }
        )
      ] }),
      order.status === "confirmed" && !canFulfill && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg text-slate-900", children: t.adminOrder.cancelConfirmedTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: t.adminOrder.cancelConfirmedBody }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors",
            disabled: submitting,
            onClick: postAdminCancel,
            children: t.adminOrder.cancelConfirmedAction
          }
        )
      ] }),
      order.status === "rejected" && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg text-slate-900", children: t.adminOrder.deleteRejectedTitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: t.adminOrder.deleteRejectedBody }),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "w-full rounded-lg border border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 transition-colors",
            disabled: submitting,
            onClick: postAdminDelete,
            children: t.adminOrder.deleteRejectedAction
          }
        )
      ] }),
      canFulfill && /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-lg text-slate-900 mb-3", children: t.adminOrder.completionTitle }),
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 transition-colors",
              disabled: submitting,
              onClick: () => {
                if (!window.confirm(t.adminOrder.markCompletedConfirm)) {
                  return;
                }
                postFulfillment("completed");
              },
              children: [
                /* @__PURE__ */ jsx(CheckCircle2, { className: "h-4 w-4" }),
                t.adminOrder.markCompleted
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              className: "flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition-colors",
              disabled: submitting,
              onClick: () => {
                if (!window.confirm(t.adminOrder.markFailedConfirm)) {
                  return;
                }
                postFulfillment("failed");
              },
              children: [
                /* @__PURE__ */ jsx(XCircle, { className: "h-4 w-4" }),
                t.adminOrder.markFailed
              ]
            }
          )
        ] })
      ] })
    ] })
  ] }) });
}
export {
  AdminOrderPage
};
