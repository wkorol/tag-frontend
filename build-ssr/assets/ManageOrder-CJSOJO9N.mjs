import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Trash2, Copy, AlertCircle, MapPin, Edit, Calendar, FileText, Users, Plane, Luggage } from 'lucide-react';
import { u as useEurRate, f as formatEur } from './currency-U83_MmBu.mjs';
import { p as parseAdditionalNotes, b as buildAdditionalNotes } from './orderNotes-Bh0j39S6.mjs';
import { g as getApiBaseUrl } from './api-DBSK1IQb.mjs';
import { u as useI18n } from '../entry-server.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';

const API_BASE_URL = getApiBaseUrl();
const SIGN_FEE = 20;
const getTodayDateString = () => {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getCurrentTimeString = () => {
  const now = /* @__PURE__ */ new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};
function ManageOrder({ orderId }) {
  const { t, locale } = useI18n();
  const emailLocale = locale === "pl" ? "pl" : "en";
  const accessTokenParam = useMemo(
    () => new URLSearchParams(window.location.search).get("token") ?? "",
    []
  );
  const cancelledParam = new URLSearchParams(window.location.search).get("cancelled") === "1";
  const updateParam = new URLSearchParams(window.location.search).get("update") ?? "";
  const updateFields = useMemo(
    () => new Set(updateParam.split(",").map((value) => value.trim()).filter(Boolean)),
    [updateParam]
  );
  const hasUpdateFields = updateFields.size > 0;
  const [updateCompleted, setUpdateCompleted] = useState(false);
  const [updateSuccessOpen, setUpdateSuccessOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selfUpdateOpen, setSelfUpdateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inputEmail, setInputEmail] = useState("");
  const [authEmail, setAuthEmail] = useState("");
  const [accessToken, setAccessToken] = useState(accessTokenParam);
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [accessRequestId, setAccessRequestId] = useState(0);
  const [toast, setToast] = useState(null);
  const toastTimeoutRef = useRef(null);
  const eurRate = useEurRate();
  const canEdit = order?.status === "pending" || order?.status === "confirmed";
  order ? order.price <= 0 : false;
  const [formData, setFormData] = useState({
    signService: "self",
    signText: "",
    flightNumber: "",
    passengers: "1",
    largeLuggage: "no",
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    description: ""
  });
  const effectiveUpdateRequest = hasUpdateFields && !updateCompleted;
  const isFieldEditable = (field) => isEditing && (!effectiveUpdateRequest || updateFields.has(field));
  const inputClass = (field, editable) => {
    const highlight = effectiveUpdateRequest && updateFields.has(field);
    const base = highlight ? "border-red-400 bg-red-50" : "border-gray-300";
    const focus = editable ? "focus:ring-2 focus:ring-blue-500 focus:border-transparent" : "";
    const disabled = !editable && !highlight ? "bg-gray-50" : "";
    return `w-full px-4 py-3 border ${base} rounded-lg ${focus} ${disabled}`;
  };
  useEffect(() => {
    const loadOrder = async () => {
      setIsAuthorizing(true);
      setLoading(true);
      setError(null);
      try {
        const payload = accessToken ? { accessToken } : { emailAddress: authEmail };
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/access`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        const data = await response.json().catch(() => null);
        if (!response.ok) {
          setError(data?.error ?? t.manageOrder.errors.load);
          return;
        }
        const orderData = data;
        const metadata = parseAdditionalNotes(orderData.additionalNotes);
        const routeType = orderData.carType === 1 ? "bus" : "standard";
        const route = metadata.route ?? {
          from: orderData.pickupAddress,
          to: "Destination",
          type: routeType
        };
        const pickupType = metadata.pickupType === "airport" ? "airport" : "address";
        const signService = metadata.signService === "sign" || metadata.signService === "self" ? metadata.signService : metadata.signText ? "sign" : "self";
        const signText = metadata.signText ?? "";
        const passengers = metadata.passengers ?? "1";
        const largeLuggage = metadata.largeLuggage ?? "no";
        const description = typeof metadata.notes === "string" ? metadata.notes : "";
        const price = Number(orderData.proposedPrice) || 0;
        const nextOrder = {
          id: orderData.id,
          generatedId: orderData.generatedId ?? orderData.id.slice(0, 4).toUpperCase(),
          route,
          pickupType,
          signService,
          signText,
          flightNumber: orderData.flightNumber,
          passengers,
          largeLuggage,
          date: orderData.date,
          time: orderData.pickupTime,
          name: orderData.fullName,
          email: orderData.emailAddress,
          phone: orderData.phoneNumber,
          price,
          status: orderData.status === "confirmed" ? "confirmed" : orderData.status === "completed" ? "completed" : orderData.status === "failed" ? "failed" : orderData.status === "rejected" ? "rejected" : orderData.status === "price_proposed" ? "price_proposed" : "pending",
          pickupAddress: orderData.pickupAddress,
          description,
          rejectionReason: orderData.rejectionReason ?? ""
        };
        setOrder(nextOrder);
        setFormData({
          signService,
          signText,
          flightNumber: orderData.flightNumber,
          passengers,
          largeLuggage,
          date: orderData.date,
          time: orderData.pickupTime,
          name: orderData.fullName,
          email: orderData.emailAddress,
          phone: orderData.phoneNumber,
          address: pickupType === "address" ? orderData.pickupAddress : "",
          description
        });
      } catch (loadError) {
        setError(t.manageOrder.errors.loadNetwork);
      } finally {
        setLoading(false);
        setIsAuthorizing(false);
      }
    };
    if (authEmail || accessToken) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, authEmail, accessToken, accessRequestId]);
  useEffect(() => {
    if (order && effectiveUpdateRequest && canEdit) {
      setIsEditing(true);
    }
  }, [order, effectiveUpdateRequest, canEdit]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const today = getTodayDateString();
    const nowTime = getCurrentTimeString();
    if (name === "date" && value < today) {
      setFormData({
        ...formData,
        [name]: today
      });
      return;
    }
    if (name === "date") {
      const nextDate = value < today ? today : value;
      const nextTime = nextDate === today && formData.time && formData.time < nowTime ? nowTime : formData.time;
      setFormData({
        ...formData,
        date: nextDate,
        time: nextTime
      });
      return;
    }
    if (name === "time" && formData.date === today && value < nowTime) {
      setFormData({
        ...formData,
        time: nowTime
      });
      return;
    }
    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSave = async () => {
    if (!order) {
      return;
    }
    setError(null);
    const additionalNotes = buildAdditionalNotes({
      pickupType: order.pickupType,
      signService: order.pickupType === "airport" ? formData.signService : "self",
      signFee: order.pickupType === "airport" && formData.signService === "sign" ? SIGN_FEE : 0,
      signText: formData.signService === "sign" ? formData.signText : "",
      passengers: formData.passengers,
      largeLuggage: formData.largeLuggage,
      route: order.route,
      notes: formData.description.trim()
    });
    const includeFlightNumber = order.pickupType === "airport" || effectiveUpdateRequest && updateFields.has("flight");
    const payload = {
      carType: order.route.type === "bus" ? 1 : 2,
      pickupAddress: order.pickupType === "address" ? formData.address : order.route.from,
      proposedPrice: String(order.price),
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: includeFlightNumber ? formData.flightNumber : "N/A",
      fullName: formData.name,
      emailAddress: formData.email,
      currentEmailAddress: authEmail,
      phoneNumber: formData.phone,
      additionalNotes,
      adminUpdateRequest: effectiveUpdateRequest,
      adminUpdateFields: effectiveUpdateRequest ? Array.from(updateFields) : [],
      locale: emailLocale
    };
    if (accessToken) {
      payload.accessToken = accessToken;
    } else {
      payload.currentEmailAddress = authEmail;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": emailLocale
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? t.manageOrder.errors.save);
        return;
      }
      setOrder({
        ...order,
        signService: formData.signService,
        signText: formData.signService === "sign" ? formData.signText : "",
        flightNumber: payload.flightNumber,
        passengers: formData.passengers,
        largeLuggage: formData.largeLuggage,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickupAddress: payload.pickupAddress,
        description: formData.description.trim(),
        status: order.status === "confirmed" && !effectiveUpdateRequest ? "pending" : order.status
      });
      if (!accessToken && formData.email && formData.email !== authEmail) {
        setAuthEmail(formData.email);
      }
      setIsEditing(false);
      if (effectiveUpdateRequest) {
        setUpdateCompleted(true);
        setUpdateSuccessOpen(true);
      }
      if (!effectiveUpdateRequest) {
        setSelfUpdateOpen(true);
      }
    } catch (saveError) {
      setError(t.manageOrder.errors.saveNetwork);
    }
  };
  const handleCancel = async () => {
    if (!order) {
      return;
    }
    setError(null);
    try {
      const payload = accessToken ? { accessToken } : { emailAddress: authEmail };
      const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? t.manageOrder.errors.cancel);
        return;
      }
      setCancelled(true);
      setShowCancelConfirm(false);
    } catch (cancelError) {
      setError(t.manageOrder.errors.cancelNetwork);
    }
  };
  const handleCopy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast(t.manageOrder.errors.copySuccess);
    } catch {
      setToast(t.manageOrder.errors.copyFail);
    }
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2e3);
  };
  if (loading) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl max-w-md w-full p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-gray-700", children: t.manageOrder.loading }) }) });
  }
  if (error && !order) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl max-w-md w-full p-8 text-center", children: /* @__PURE__ */ jsx("p", { className: "text-red-700", children: error }) }) });
  }
  if (!order) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl max-w-md w-full p-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: t.manageOrder.accessTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 mb-6", children: t.manageOrder.accessBody }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: inputEmail,
            onChange: (event) => setInputEmail(event.target.value),
            placeholder: t.manageOrder.accessPlaceholder,
            className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            required: true
          }
        ),
        error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-2 border-red-500 rounded-lg p-3 text-red-800 text-sm", children: error }),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => {
              if (!inputEmail) {
                setError(t.manageOrder.errors.emailRequired);
                return;
              }
              setError(null);
              setAccessToken("");
              setAuthEmail(inputEmail.trim());
              setAccessRequestId((value) => value + 1);
            },
            className: "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70",
            disabled: isAuthorizing,
            children: isAuthorizing ? t.manageOrder.accessChecking : t.manageOrder.accessAction
          }
        )
      ] })
    ] }) });
  }
  if (cancelled || cancelledParam) {
    return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center p-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl max-w-md w-full p-8", children: /* @__PURE__ */ jsxs("div", { className: "bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(Trash2, { className: "w-8 h-8 text-white" }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-red-900 mb-2", children: t.manageOrder.cancelledTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-red-800 mb-4", children: t.manageOrder.cancelledBody }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
        t.orderForm.orderId,
        " ",
        order?.id ?? orderId
      ] })
    ] }) }) });
  }
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 py-12 px-4", children: [
    /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl shadow-lg overflow-hidden relative", children: [
      toast && /* @__PURE__ */ jsx("div", { className: "absolute right-6 top-6 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg", children: toast }),
      /* @__PURE__ */ jsxs("div", { className: "bg-blue-600 text-white p-6", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl mb-2", children: t.manageOrder.manageTitle }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-2 text-blue-100 text-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              t.manageOrder.orderLabel,
              " ",
              order.generatedId
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleCopy(order.generatedId, t.manageOrder.copyOrderLabel),
                className: "inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-[8px]",
                children: [
                  /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" }),
                  t.manageOrder.copyAction
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              t.manageOrder.orderIdLabel,
              ": ",
              order.id
            ] }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: () => handleCopy(order.id, t.manageOrder.copyOrderIdLabel),
                className: "inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-[8px]",
                children: [
                  /* @__PURE__ */ jsx(Copy, { className: "w-3 h-3" }),
                  t.manageOrder.copyAction
                ]
              }
            )
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-l-4 border-red-500 p-4 m-6", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-red-700", children: error }) }),
      updateSuccessOpen && /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
          onClick: () => setUpdateSuccessOpen(false),
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-white rounded-xl max-w-md w-full p-8 relative",
              onClick: (event) => event.stopPropagation(),
              children: /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-green-900 mb-2", children: t.manageOrder.detailsUpdatedTitle }),
                /* @__PURE__ */ jsx("p", { className: "text-green-800 mb-4", children: t.manageOrder.detailsUpdatedBody(formData.date, formData.time) }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setUpdateSuccessOpen(false),
                    className: "bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors",
                    children: t.common.close
                  }
                )
              ] })
            }
          )
        }
      ),
      selfUpdateOpen && /* @__PURE__ */ jsx(
        "div",
        {
          className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",
          onClick: () => setSelfUpdateOpen(false),
          children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "bg-white rounded-xl max-w-md w-full p-8 relative",
              onClick: (event) => event.stopPropagation(),
              children: /* @__PURE__ */ jsxs("div", { className: "bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-8 h-8 text-white" }) }),
                /* @__PURE__ */ jsx("h3", { className: "text-yellow-900 mb-2", children: t.manageOrder.updateSubmittedTitle }),
                /* @__PURE__ */ jsx("p", { className: "text-yellow-800 mb-4", children: t.manageOrder.updateSubmittedBody }),
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-yellow-700 mb-4", children: [
                  /* @__PURE__ */ jsx("span", { className: "inline-flex h-2.5 w-2.5 rounded-full bg-yellow-500 animate-pulse" }),
                  /* @__PURE__ */ jsx("span", { className: "text-sm", children: t.manageOrder.awaiting })
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: () => setSelfUpdateOpen(false),
                    className: "bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors",
                    children: t.common.close
                  }
                )
              ] })
            }
          )
        }
      ),
      saved && null,
      /* @__PURE__ */ jsxs("div", { className: "p-6 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "bg-blue-50 rounded-lg p-4", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-3", children: t.manageOrder.transferRoute }),
          /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-blue-600" }),
              /* @__PURE__ */ jsxs("span", { className: "text-gray-700", children: [
                order.route.from,
                " → ",
                order.route.to
              ] })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs("span", { className: "text-gray-700", children: [
              t.manageOrder.priceLabel,
              " ",
              order.price > 0 ? /* @__PURE__ */ jsxs("span", { className: "font-bold text-blue-600", children: [
                order.price,
                " PLN"
              ] }) : /* @__PURE__ */ jsx("span", { className: "font-semibold text-blue-700", children: t.manageOrder.pricePending })
            ] }) }),
            order.price > 0 && formatEur(order.price, eurRate) && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 text-gray-500", children: [
              /* @__PURE__ */ jsx("span", { className: "eur-text", children: formatEur(order.price, eurRate) }),
              /* @__PURE__ */ jsx("span", { className: "live-badge", children: t.common.actualBadge })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx("span", { className: `px-3 py-1 rounded-full text-sm ${order.status === "confirmed" ? "bg-green-100 text-green-800" : order.status === "completed" ? "bg-emerald-100 text-emerald-800" : order.status === "failed" ? "bg-orange-100 text-orange-800" : order.status === "rejected" ? "bg-red-100 text-red-800" : order.status === "price_proposed" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`, children: order.status === "confirmed" ? t.manageOrder.statusConfirmed : order.status === "completed" ? t.manageOrder.statusCompleted : order.status === "failed" ? t.manageOrder.statusFailed : order.status === "rejected" ? t.manageOrder.statusRejected : order.status === "price_proposed" ? t.manageOrder.statusPriceProposed : t.manageOrder.statusPending }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
            /* @__PURE__ */ jsx("h3", { className: "text-gray-900", children: t.manageOrder.bookingDetails }),
            !isEditing && canEdit && /* @__PURE__ */ jsxs(
              "button",
              {
                onClick: () => setIsEditing(true),
                className: "flex items-center gap-2 text-blue-600 hover:text-blue-700",
                children: [
                  /* @__PURE__ */ jsx(Edit, { className: "w-4 h-4" }),
                  effectiveUpdateRequest ? t.manageOrder.updateRequested : t.manageOrder.editDetails
                ]
              }
            )
          ] }),
          !isEditing && order.status === "confirmed" && !effectiveUpdateRequest && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900", children: t.manageOrder.confirmedEditNote }),
          effectiveUpdateRequest && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800", children: t.manageOrder.updateFieldsNote }),
          !canEdit && /* @__PURE__ */ jsxs("div", { className: `border-l-4 p-4 ${order.status === "confirmed" ? "bg-green-50 border-green-500" : order.status === "completed" ? "bg-emerald-50 border-emerald-500" : order.status === "failed" ? "bg-orange-50 border-orange-500" : order.status === "price_proposed" ? "bg-blue-50 border-blue-500" : "bg-red-50 border-red-500"}`, children: [
            /* @__PURE__ */ jsx("p", { className: `text-sm ${order.status === "confirmed" ? "text-green-700" : order.status === "completed" ? "text-emerald-700" : order.status === "failed" ? "text-orange-700" : order.status === "price_proposed" ? "text-blue-700" : "text-red-700"}`, children: order.status === "confirmed" ? t.manageOrder.confirmedNote : order.status === "completed" ? t.manageOrder.completedNote : order.status === "failed" ? t.manageOrder.failedNote : order.status === "price_proposed" ? t.manageOrder.priceProposedNote : t.manageOrder.rejectedNote }),
            order.status === "rejected" && order.rejectionReason && /* @__PURE__ */ jsxs("p", { className: "mt-2 text-sm text-red-700", children: [
              t.manageOrder.rejectionReasonLabel,
              " ",
              order.rejectionReason
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "date", className: "block text-gray-700 mb-2", children: [
                /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 inline mr-2" }),
                t.manageOrder.date
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  id: "date",
                  name: "date",
                  value: formData.date,
                  onChange: handleChange,
                  min: getTodayDateString(),
                  disabled: !isFieldEditable("date"),
                  className: inputClass("date", isFieldEditable("date"))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { htmlFor: "time", className: "block text-gray-700 mb-2", children: t.manageOrder.pickupTime }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "time",
                  id: "time",
                  name: "time",
                  value: formData.time,
                  onChange: handleChange,
                  min: formData.date === getTodayDateString() ? getCurrentTimeString() : void 0,
                  disabled: !isFieldEditable("time"),
                  className: inputClass("time", isFieldEditable("time"))
                }
              )
            ] })
          ] }),
          order.pickupType === "airport" && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-2", children: t.manageOrder.signServiceTitle }),
              /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.signService === "sign" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "signService",
                      value: "sign",
                      checked: formData.signService === "sign",
                      onChange: () => setFormData((prev) => ({ ...prev, signService: "sign" })),
                      className: "w-4 h-4 text-blue-600",
                      disabled: !isFieldEditable("signText")
                    }
                  ),
                  /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-gray-700" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-gray-900", children: t.manageOrder.signServiceSign }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t.manageOrder.signServiceFee })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.signService === "self" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`, children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "radio",
                      name: "signService",
                      value: "self",
                      checked: formData.signService === "self",
                      onChange: () => setFormData((prev) => ({ ...prev, signService: "self", signText: "" })),
                      className: "w-4 h-4 text-blue-600",
                      disabled: !isFieldEditable("signText")
                    }
                  ),
                  /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 text-gray-700 flex-shrink-0" }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "text-gray-900", children: t.manageOrder.signServiceSelf }),
                    /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t.manageOrder.signServiceSelfNote })
                  ] })
                ] })
              ] })
            ] }),
            formData.signService === "sign" && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "signText", className: "block text-gray-700 mb-2", children: [
                /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 inline mr-2" }),
                t.manageOrder.signText
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "signText",
                  name: "signText",
                  value: formData.signText,
                  onChange: handleChange,
                  disabled: !isFieldEditable("signText"),
                  className: inputClass("signText", isFieldEditable("signText"))
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "flightNumber", className: "block text-gray-700 mb-2", children: [
                /* @__PURE__ */ jsx(Plane, { className: "w-4 h-4 inline mr-2" }),
                t.manageOrder.flightNumber
              ] }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  id: "flightNumber",
                  name: "flightNumber",
                  value: formData.flightNumber,
                  onChange: handleChange,
                  disabled: !isFieldEditable("flight"),
                  className: inputClass("flight", isFieldEditable("flight"))
                }
              )
            ] })
          ] }),
          order.pickupType === "address" && /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("label", { htmlFor: "address", className: "block text-gray-700 mb-2", children: [
              /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 inline mr-2" }),
              t.manageOrder.pickupAddress
            ] }),
            /* @__PURE__ */ jsx(
              "textarea",
              {
                id: "address",
                name: "address",
                value: formData.address,
                onChange: handleChange,
                disabled: !isFieldEditable("address"),
                rows: 3,
                className: inputClass("address", isFieldEditable("address"))
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "passengers", className: "block text-gray-700 mb-2", children: [
                /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 inline mr-2" }),
                t.manageOrder.passengers
              ] }),
              /* @__PURE__ */ jsx(
                "select",
                {
                  id: "passengers",
                  name: "passengers",
                  value: formData.passengers,
                  onChange: handleChange,
                  disabled: !isFieldEditable("passengers"),
                  className: inputClass("passengers", isFieldEditable("passengers")),
                  children: order.route.type === "bus" ? /* @__PURE__ */ jsx(Fragment, { children: t.manageOrder.passengersBus.map((label, index) => /* @__PURE__ */ jsx("option", { value: 5 + index, children: label }, label)) }) : /* @__PURE__ */ jsx(Fragment, { children: t.manageOrder.passengersStandard.map((label, index) => /* @__PURE__ */ jsx("option", { value: 1 + index, children: label }, label)) })
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "largeLuggage", className: "block text-gray-700 mb-2", children: [
                /* @__PURE__ */ jsx(Luggage, { className: "w-4 h-4 inline mr-2" }),
                t.manageOrder.largeLuggage
              ] }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "largeLuggage",
                  name: "largeLuggage",
                  value: formData.largeLuggage,
                  onChange: handleChange,
                  disabled: !isFieldEditable("largeLuggage"),
                  className: inputClass("largeLuggage", isFieldEditable("largeLuggage")),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "no", children: t.manageOrder.luggageNo }),
                    /* @__PURE__ */ jsx("option", { value: "yes", children: t.manageOrder.luggageYes })
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "border-t pt-4", children: [
            /* @__PURE__ */ jsx("h4", { className: "text-gray-900 mb-4", children: t.manageOrder.contactTitle }),
            /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-gray-700 mb-2", children: t.manageOrder.fullName }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    id: "name",
                    name: "name",
                    value: formData.name,
                    onChange: handleChange,
                    disabled: !isFieldEditable("name"),
                    className: inputClass("name", isFieldEditable("name"))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "phone", className: "block text-gray-700 mb-2", children: t.manageOrder.phoneNumber }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "tel",
                    id: "phone",
                    name: "phone",
                    value: formData.phone,
                    onChange: handleChange,
                    disabled: !isFieldEditable("phone"),
                    className: inputClass("phone", isFieldEditable("phone"))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-gray-700 mb-2", children: t.manageOrder.email }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "email",
                    id: "email",
                    name: "email",
                    value: formData.email,
                    onChange: handleChange,
                    disabled: !isFieldEditable("email"),
                    className: inputClass("email", isFieldEditable("email"))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "description", className: "block text-gray-700 mb-2", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 inline mr-2" }),
                  t.manageOrder.notesTitle
                ] }),
                /* @__PURE__ */ jsx(
                  "textarea",
                  {
                    id: "description",
                    name: "description",
                    value: formData.description,
                    onChange: handleChange,
                    disabled: !isFieldEditable("description"),
                    rows: 3,
                    className: inputClass("description", isFieldEditable("description"))
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "border-t pt-6 space-y-3", children: isEditing ? /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleSave,
              className: "flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors",
              disabled: !canEdit,
              children: t.manageOrder.saveChanges
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => {
                setFormData({
                  signService: order.signService,
                  signText: order.signText,
                  flightNumber: order.flightNumber,
                  passengers: order.passengers,
                  largeLuggage: order.largeLuggage,
                  date: order.date,
                  time: order.time,
                  name: order.name,
                  email: order.email,
                  phone: order.phone,
                  address: order.pickupType === "address" ? order.pickupAddress : "",
                  description: order.description
                });
                setIsEditing(false);
              },
              className: "flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors",
              children: t.manageOrder.cancelEdit
            }
          )
        ] }) : /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
          canEdit && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsEditing(true),
              className: "w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Edit, { className: "w-5 h-5" }),
                t.manageOrder.editBooking
              ]
            }
          ),
          canEdit && /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setShowCancelConfirm(true),
              className: "w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "w-5 h-5" }),
                t.manageOrder.cancelBooking
              ]
            }
          )
        ] }) }),
        /* @__PURE__ */ jsx("div", { className: "bg-yellow-50 border-l-4 border-yellow-400 p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex", children: [
          /* @__PURE__ */ jsx("div", { className: "flex-shrink-0", children: /* @__PURE__ */ jsx(AlertCircle, { className: "h-5 w-5 text-yellow-400" }) }),
          /* @__PURE__ */ jsx("div", { className: "ml-3", children: /* @__PURE__ */ jsx("p", { className: "text-sm text-yellow-700", children: t.manageOrder.changesNotice }) })
        ] }) })
      ] })
    ] }) }),
    showCancelConfirm && /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl max-w-md w-full p-6", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3 mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "w-12 h-12 bg-red-100 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx(AlertCircle, { className: "w-6 h-6 text-red-600" }) }),
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900", children: t.manageOrder.cancelPromptTitle })
      ] }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-700 mb-6", children: t.manageOrder.cancelPromptBody }),
      /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: handleCancel,
            className: "flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors",
            children: t.manageOrder.confirmCancel
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowCancelConfirm(false),
            className: "flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors",
            children: t.manageOrder.keepBooking
          }
        )
      ] })
    ] }) })
  ] });
}

export { ManageOrder };
