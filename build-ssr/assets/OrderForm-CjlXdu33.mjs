import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { Plane, MapPin, Calendar, FileText, Users, Info, Luggage } from 'lucide-react';
import { u as useEurRate, f as formatEur } from './currency-U83_MmBu.mjs';
import { b as buildAdditionalNotes } from './orderNotes-Bh0j39S6.mjs';
import { u as useI18n, l as localeToPath, h as trackFormClose, i as trackFormValidation, j as trackFormSubmit, k as trackFormStart, m as isAnalyticsEnabled, n as hasMarketingConsent } from '../entry-server.mjs';
import { g as getApiBaseUrl } from './api-DBSK1IQb.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';

const POLISH_FIXED_HOLIDAYS = [
  [1, 1],
  [1, 6],
  [5, 1],
  [5, 3],
  [8, 15],
  [11, 1],
  [11, 11],
  [12, 25],
  [12, 26]
];
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
const isPastDate = (value) => {
  if (!value) return false;
  return value < getTodayDateString();
};
const validatePhoneNumber = (value, messages) => {
  const trimmed = value.trim();
  if (/[A-Za-z]/.test(trimmed)) {
    return messages.phoneLetters;
  }
  const digitsOnly = trimmed.replace(/\D/g, "");
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return messages.phoneLength;
  }
  return null;
};
const validateEmail = (value, message) => {
  const trimmed = value.trim();
  const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmail.test(trimmed)) {
    return message;
  }
  return null;
};
const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const getEasterSunday = (year) => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = (h + l - 7 * m + 114) % 31 + 1;
  return new Date(year, month - 1, day);
};
const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};
const getPolishHolidayKeys = (year) => {
  const keys = /* @__PURE__ */ new Set();
  POLISH_FIXED_HOLIDAYS.forEach(([month, day]) => {
    keys.add(formatDateKey(new Date(year, month - 1, day)));
  });
  const easterSunday = getEasterSunday(year);
  keys.add(formatDateKey(easterSunday));
  keys.add(formatDateKey(addDays(easterSunday, 1)));
  keys.add(formatDateKey(addDays(easterSunday, 49)));
  keys.add(formatDateKey(addDays(easterSunday, 60)));
  return keys;
};
const isPolishPublicHoliday = (date, apiHolidayKeys) => {
  if (date.getDay() === 0) {
    return true;
  }
  const dateKey = formatDateKey(date);
  if (apiHolidayKeys?.has(dateKey)) {
    return true;
  }
  const fallbackKeys = getPolishHolidayKeys(date.getFullYear());
  return fallbackKeys.has(dateKey);
};
function OrderForm({ route, onClose }) {
  const { t, locale } = useI18n();
  const emailLocale = locale === "pl" ? "pl" : "en";
  const basePath = localeToPath(locale);
  const [formData, setFormData] = useState({
    pickupType: "",
    signService: "self",
    signText: "",
    flightNumber: "",
    passengers: "1",
    largeLuggage: "no",
    address: "",
    date: getTodayDateString(),
    time: "",
    name: "",
    phone: "",
    email: "",
    description: ""
  });
  const handlePhoneBlur = () => {
    const phoneError2 = validatePhoneNumber(formData.phone, t.orderForm.validation);
    setPhoneError(phoneError2);
  };
  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [generatedId, setGeneratedId] = useState(null);
  const [error, setError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(route.priceDay);
  const [rateContext, setRateContext] = useState({
    label: t.orderForm.rate.day,
    reason: t.orderForm.rate.reasonDay,
    price: route.priceDay
  });
  const [rateBanner, setRateBanner] = useState(null);
  const lastRatePriceRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const [holidayKeys, setHolidayKeys] = useState(null);
  const [holidayYear, setHolidayYear] = useState(null);
  const eurRate = useEurRate();
  const formStartedRef = useRef(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const signFee = formData.pickupType === "airport" && formData.signService === "sign" ? 20 : 0;
  const totalPrice = currentPrice + signFee;
  const eurText = formatEur(totalPrice, eurRate);
  const displayRoute = formData.pickupType === "address" ? { from: route.to, to: route.from, type: route.type } : route;
  const signServiceTitle = t.orderForm.signServiceTitle ?? "Airport pickup options";
  const signServiceSign = t.orderForm.signServiceSign ?? "Meet with a name sign";
  const signServiceFee = t.orderForm.signServiceFee ?? "+20 PLN added to final price";
  const signServiceSelf = t.orderForm.signServiceSelf ?? "Find the driver yourself";
  const signServiceSelfNote = t.orderForm.signServiceSelfNote ?? "";
  const isPhoneValid = !validatePhoneNumber(formData.phone, t.orderForm.validation);
  const isEmailValid = !validateEmail(formData.email, t.orderForm.validation.email);
  const showRateBanner = (message) => {
    setRateBanner(message);
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  };
  const renderRateBanner = () => {
    if (!rateBanner) {
      return null;
    }
    return /* @__PURE__ */ jsx("div", { className: "mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-900", children: rateBanner })
    ] }) });
  };
  const showValidation = submitAttempted;
  const pickupTypeError = showValidation && !formData.pickupType;
  const pickupAddressError = showValidation && formData.pickupType === "address" && !formData.address.trim();
  const signTextError = showValidation && formData.pickupType === "airport" && formData.signService === "sign" && !formData.signText.trim();
  const flightNumberError = showValidation && formData.pickupType === "airport" && !formData.flightNumber.trim();
  const dateError = showValidation && (!formData.date || isPastDate(formData.date));
  const timeError = showValidation && !formData.time;
  const passengersError = showValidation && !formData.passengers;
  const luggageError = showValidation && !formData.largeLuggage;
  const nameError = showValidation && !formData.name.trim();
  const phoneErrorState = showValidation && (!formData.phone.trim() || !isPhoneValid);
  const emailErrorState = showValidation && (!formData.email.trim() || !isEmailValid);
  const fieldClass = (base, invalid) => `${base}${invalid ? " border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500" : ""}`;
  const scrollToField = (fieldId) => {
    if (typeof window === "undefined") {
      return;
    }
    window.requestAnimationFrame(() => {
      const target = document.getElementById(fieldId);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        if (target instanceof HTMLElement) {
          target.focus({ preventScroll: true });
        }
      }
    });
  };
  const trackConversion = () => {
    if (typeof window === "undefined" || !isAnalyticsEnabled()) {
      return;
    }
    const gtag = window.gtag;
    if (typeof gtag !== "function") {
      return;
    }
    if (!hasMarketingConsent()) {
      return;
    }
    gtag("event", "conversion", {
      send_to: "AW-17848598074/JQ0kCLvpq9sbELr8775C",
      value: 1,
      currency: "PLN"
    });
  };
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const resolvedYear = formData.date ? (/* @__PURE__ */ new Date(`${formData.date}T00:00:00`)).getFullYear() : (/* @__PURE__ */ new Date()).getFullYear();
    if (!Number.isFinite(resolvedYear) || holidayYear === resolvedYear) {
      return;
    }
    setHolidayYear(resolvedYear);
    const cacheKey = `pl-holidays-${resolvedYear}`;
    const cached = window.localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setHolidayKeys(new Set(parsed));
          return;
        }
      } catch {
      }
    }
    fetch(`https://date.nager.at/api/v3/PublicHolidays/${resolvedYear}/PL`).then((res) => res.ok ? res.json() : []).then((data) => {
      const keys = Array.isArray(data) ? data.map((entry) => entry.date).filter((date) => Boolean(date)) : [];
      setHolidayKeys(new Set(keys));
      window.localStorage.setItem(cacheKey, JSON.stringify(keys));
    }).catch(() => {
      setHolidayKeys(null);
    });
  }, [formData.date, holidayYear]);
  useEffect(() => {
    let isNight = false;
    const reasons = [];
    if (formData.time) {
      const [hours, minutes] = formData.time.split(":").map(Number);
      const totalMinutes = hours * 60 + minutes + 30;
      const adjustedHours = Math.floor(totalMinutes / 60) % 24;
      const isNightTime = adjustedHours >= 22 || adjustedHours < 6;
      if (isNightTime) {
        reasons.push(t.orderForm.rate.reasonLate);
      }
      isNight = isNight || isNightTime;
    }
    if (formData.date) {
      const date = /* @__PURE__ */ new Date(`${formData.date}T00:00:00`);
      if (!Number.isNaN(date.getTime()) && isPolishPublicHoliday(date, holidayKeys)) {
        reasons.push(t.orderForm.rate.reasonHoliday);
        isNight = true;
      }
    }
    const price = isNight ? route.priceNight : route.priceDay;
    setCurrentPrice(price);
    setRateContext({
      label: isNight ? t.orderForm.rate.night : t.orderForm.rate.day,
      reason: reasons.length ? reasons.join(" + ") : t.orderForm.rate.reasonDay,
      price
    });
  }, [formData.time, formData.date, holidayKeys, route.priceDay, route.priceNight, t]);
  useEffect(() => {
    if (!formData.time && !formData.date) {
      return;
    }
    if (lastRatePriceRef.current === null) {
      lastRatePriceRef.current = rateContext.price;
      showRateBanner(t.orderForm.rate.banner(rateContext.label, rateContext.price, rateContext.reason));
      return;
    }
    if (lastRatePriceRef.current !== rateContext.price) {
      lastRatePriceRef.current = rateContext.price;
      showRateBanner(t.orderForm.rate.banner(rateContext.label, rateContext.price, rateContext.reason));
    }
  }, [rateContext.price, rateContext.label, rateContext.reason, formData.time, formData.date, t]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPhoneError(null);
    setEmailError(null);
    setSubmitAttempted(true);
    const missingFieldIds = [];
    if (!formData.date) {
      missingFieldIds.push("date");
    }
    if (formData.date && isPastDate(formData.date)) {
      trackFormValidation("order", 1, "date");
      trackFormSubmit("order", "validation_error");
      setError(t.orderForm.validation.datePast);
      scrollToField("date");
      return;
    }
    if (!formData.time) {
      missingFieldIds.push("time");
    }
    if (!formData.pickupType) {
      missingFieldIds.push("pickupType");
    }
    if (formData.pickupType === "airport") {
      if (formData.signService === "sign" && !formData.signText.trim()) {
        missingFieldIds.push("signText");
      }
      if (!formData.flightNumber.trim()) {
        missingFieldIds.push("flightNumber");
      }
    }
    if (formData.pickupType === "address" && !formData.address.trim()) {
      missingFieldIds.push("address");
    }
    if (!formData.passengers) {
      missingFieldIds.push("passengers");
    }
    if (!formData.largeLuggage) {
      missingFieldIds.push("largeLuggage");
    }
    if (!formData.name.trim()) {
      missingFieldIds.push("name");
    }
    if (!formData.phone.trim() || !isPhoneValid) {
      missingFieldIds.push("phone");
    }
    if (!formData.email.trim() || !isEmailValid) {
      missingFieldIds.push("email");
    }
    if (missingFieldIds.length > 0) {
      trackFormValidation("order", missingFieldIds.length, missingFieldIds[0]);
      trackFormSubmit("order", "validation_error");
      scrollToField(missingFieldIds[0]);
      return;
    }
    const phoneError2 = validatePhoneNumber(formData.phone, t.orderForm.validation);
    if (phoneError2) {
      trackFormValidation("order", 1, "phone");
      trackFormSubmit("order", "validation_error");
      setPhoneError(phoneError2);
      setError(phoneError2);
      return;
    }
    const emailError2 = validateEmail(formData.email, t.orderForm.validation.email);
    if (emailError2) {
      trackFormValidation("order", 1, "email");
      trackFormSubmit("order", "validation_error");
      setEmailError(emailError2);
      setError(emailError2);
      return;
    }
    setSubmitting(true);
    const apiBaseUrl = getApiBaseUrl();
    const additionalNotes = buildAdditionalNotes({
      pickupType: formData.pickupType,
      signService: formData.pickupType === "airport" ? formData.signService : "self",
      signFee,
      signText: formData.signText,
      passengers: formData.passengers,
      largeLuggage: formData.largeLuggage,
      route: {
        from: displayRoute.from,
        to: displayRoute.to,
        type: displayRoute.type
      },
      notes: formData.description.trim()
    });
    const payload = {
      carType: route.type === "bus" ? 1 : 2,
      pickupAddress: formData.pickupType === "address" ? formData.address : route.from,
      proposedPrice: String(totalPrice),
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: formData.pickupType === "airport" ? formData.flightNumber : "N/A",
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      additionalNotes,
      locale: emailLocale
    };
    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": emailLocale
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        trackFormSubmit("order", "error", "api");
        setError(data?.error ?? t.orderForm.submitError);
        return;
      }
      setOrderId(data?.id ?? null);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackFormSubmit("order", "success");
      trackConversion();
    } catch (submitError) {
      trackFormSubmit("order", "error", "network");
      setError(t.orderForm.submitNetworkError);
    } finally {
      setSubmitting(false);
    }
  };
  const handleEmailChange = (value) => {
    const nextError = validateEmail(value, t.orderForm.validation.email);
    setEmailError(nextError);
    if (!nextError && error === emailError) {
      setError(null);
    }
  };
  const handleChange = (e) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart("order");
    }
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
  const handleSignServiceChange = (value) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart("order");
    }
    setFormData((prev) => ({
      ...prev,
      signService: value,
      signText: value === "self" ? "" : prev.signText
    }));
  };
  if (submitted) {
    return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4", children: /* @__PURE__ */ jsx("div", { className: "bg-white rounded-xl max-w-md w-full p-8 relative", children: /* @__PURE__ */ jsxs("div", { className: "bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center", children: [
      /* @__PURE__ */ jsx("div", { className: "w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsx("svg", { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" }) }) }),
      /* @__PURE__ */ jsx("h3", { className: "text-green-900 mb-2", children: t.orderForm.submittedTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-green-800 mb-4", children: t.orderForm.submittedBody }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center gap-2 text-green-700 mb-4", children: [
        /* @__PURE__ */ jsx("span", { className: "inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse" }),
        /* @__PURE__ */ jsx("span", { className: "text-sm", children: t.orderForm.awaiting })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-4 mb-2", children: [
        /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
          t.orderForm.totalPrice,
          " ",
          /* @__PURE__ */ jsxs("span", { className: "font-bold text-blue-600", children: [
            totalPrice,
            " PLN"
          ] })
        ] }),
        eurText && /* @__PURE__ */ jsxs("div", { className: "mt-1 flex items-center justify-center gap-2 text-gray-500", children: [
          /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText }),
          /* @__PURE__ */ jsx("span", { className: "live-badge", children: t.common.actualBadge })
        ] })
      ] }),
      renderRateBanner(),
      orderId && /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-lg p-4 mb-4", children: [
        generatedId && /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
          t.orderForm.orderNumber,
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: generatedId })
        ] }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-700", children: [
          t.orderForm.orderId,
          " ",
          /* @__PURE__ */ jsx("span", { className: "font-semibold", children: orderId })
        ] }),
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `${basePath}/?orderId=${orderId}`,
            className: "text-blue-600 hover:text-blue-700 text-sm underline",
            children: t.orderForm.manageLink
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            trackFormClose("order");
            onClose();
          },
          className: "bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors",
          children: t.common.close
        }
      )
    ] }) }) });
  }
  return /* @__PURE__ */ jsx("div", { className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b flex items-center justify-between flex-shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900", children: t.orderForm.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm mt-1", children: [
          displayRoute.from,
          " ↔ ",
          displayRoute.to
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => {
            trackFormClose("order");
            onClose();
          },
          className: "text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4",
          children: /* @__PURE__ */ jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleSubmit,
        noValidate: true,
        className: "booking-form p-6 space-y-6 overflow-y-auto cursor-default",
        children: [
          error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800", children: error }),
          /* @__PURE__ */ jsxs("div", { id: "pickupType", tabIndex: -1, children: [
            /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-2", children: t.orderForm.pickupType }),
            /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-3", children: t.orderForm.pickupTypeHint }),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.pickupType === "airport" ? "border-blue-500 bg-blue-50" : pickupTypeError ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 hover:border-gray-300"}`, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: "pickupType",
                    value: "airport",
                    checked: formData.pickupType === "airport",
                    onChange: (e) => {
                      handleChange(e);
                    },
                    className: "w-4 h-4 text-blue-600"
                  }
                ),
                /* @__PURE__ */ jsx(Plane, { className: "w-5 h-5 text-gray-700" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm leading-snug", children: t.orderForm.airportPickup })
              ] }),
              /* @__PURE__ */ jsxs("label", { className: `flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.pickupType === "address" ? "border-blue-500 bg-blue-50" : pickupTypeError ? "border-red-400 ring-1 ring-red-200" : "border-gray-200 hover:border-gray-300"}`, children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "radio",
                    name: "pickupType",
                    value: "address",
                    checked: formData.pickupType === "address",
                    onChange: handleChange,
                    className: "w-4 h-4 text-blue-600"
                  }
                ),
                /* @__PURE__ */ jsx(MapPin, { className: "w-5 h-5 text-gray-700" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm leading-snug", children: t.orderForm.addressPickup })
              ] })
            ] })
          ] }),
          formData.pickupType && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border-2 border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t.orderForm.totalPrice }),
              /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                /* @__PURE__ */ jsxs("span", { className: "text-blue-900 text-2xl", children: [
                  totalPrice,
                  " PLN"
                ] }),
                eurText && /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-end gap-2 text-gray-500", children: [
                  /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText }),
                  /* @__PURE__ */ jsx("span", { className: "live-badge", children: t.common.actualBadge })
                ] })
              ] })
            ] }) }),
            renderRateBanner(),
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "date", className: "block text-gray-700 mb-2", children: [
                  /* @__PURE__ */ jsx(Calendar, { className: "w-4 h-4 inline mr-2" }),
                  t.orderForm.date
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
                    className: fieldClass(
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      dateError
                    ),
                    required: true
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("label", { htmlFor: "time", className: "block text-gray-700 mb-2", children: t.orderForm.pickupTime }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "time",
                    id: "time",
                    name: "time",
                    value: formData.time,
                    onChange: handleChange,
                    min: formData.date === getTodayDateString() ? getCurrentTimeString() : void 0,
                    className: fieldClass(
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      timeError
                    ),
                    required: true
                  }
                )
              ] })
            ] }),
            formData.pickupType === "airport" && /* @__PURE__ */ jsxs(Fragment, { children: [
              /* @__PURE__ */ jsxs("div", { id: "signService", tabIndex: -1, children: [
                /* @__PURE__ */ jsx("label", { className: "block text-gray-700 mb-2", children: signServiceTitle }),
                /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                  /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.signService === "sign" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`, children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "signService",
                        value: "sign",
                        checked: formData.signService === "sign",
                        onChange: () => handleSignServiceChange("sign"),
                        className: "w-4 h-4 text-blue-600"
                      }
                    ),
                    /* @__PURE__ */ jsx(FileText, { className: "w-5 h-5 text-gray-700" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-gray-900", children: signServiceSign }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: signServiceFee })
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxs("label", { className: `flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.signService === "self" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`, children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "radio",
                        name: "signService",
                        value: "self",
                        checked: formData.signService === "self",
                        onChange: () => handleSignServiceChange("self"),
                        className: "w-4 h-4 text-blue-600"
                      }
                    ),
                    /* @__PURE__ */ jsx(Users, { className: "w-5 h-5 text-gray-700 flex-shrink-0" }),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx("div", { className: "text-gray-900", children: signServiceSelf }),
                      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: signServiceSelfNote })
                    ] })
                  ] })
                ] })
              ] }),
              formData.signService === "sign" ? /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "signText", className: "block text-gray-700 mb-2", children: [
                  /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 inline mr-2" }),
                  t.orderForm.signText
                ] }),
                /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      id: "signText",
                      name: "signText",
                      value: formData.signText,
                      onChange: handleChange,
                      placeholder: t.orderForm.signPlaceholder,
                      className: fieldClass(
                        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        signTextError
                      ),
                      required: true
                    }
                  ),
                  /* @__PURE__ */ jsxs("div", { className: "mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4", children: [
                    /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
                      /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" }),
                      /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-900", children: t.orderForm.signHelp })
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm", children: [
                      /* @__PURE__ */ jsx("p", { className: "text-[8px] text-gray-500 mb-2 text-center", children: t.orderForm.signPreview }),
                      /* @__PURE__ */ jsx("div", { className: "bg-white border-4 border-blue-900 rounded p-3 text-center min-h-[60px] flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-blue-900 text-lg break-words", children: formData.signText || t.orderForm.signEmpty }) })
                    ] })
                  ] })
                ] })
              ] }) : null,
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "flightNumber", className: "block text-gray-700 mb-2", children: [
                  /* @__PURE__ */ jsx(Plane, { className: "w-4 h-4 inline mr-2" }),
                  t.orderForm.flightNumber
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    id: "flightNumber",
                    name: "flightNumber",
                    value: formData.flightNumber,
                    onChange: handleChange,
                    placeholder: t.orderForm.flightPlaceholder,
                    className: fieldClass(
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      flightNumberError
                    ),
                    required: true
                  }
                )
              ] })
            ] }),
            formData.pickupType === "address" && /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("label", { htmlFor: "address", className: "block text-gray-700 mb-2", children: [
                /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 inline mr-2" }),
                t.orderForm.pickupAddress
              ] }),
              /* @__PURE__ */ jsx(
                "textarea",
                {
                  id: "address",
                  name: "address",
                  value: formData.address,
                  onChange: handleChange,
                  placeholder: t.orderForm.pickupPlaceholder,
                  rows: 3,
                  className: fieldClass(
                    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                    pickupAddressError
                  ),
                  required: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "passengers", className: "block text-gray-700 mb-2", children: [
                  /* @__PURE__ */ jsx(Users, { className: "w-4 h-4 inline mr-2" }),
                  t.orderForm.passengers
                ] }),
                /* @__PURE__ */ jsx(
                  "select",
                  {
                    id: "passengers",
                    name: "passengers",
                    value: formData.passengers,
                    onChange: handleChange,
                    className: fieldClass(
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      passengersError
                    ),
                    required: true,
                    children: route.type === "bus" ? /* @__PURE__ */ jsx(Fragment, { children: t.orderForm.passengersBus.map((label, index) => /* @__PURE__ */ jsx("option", { value: 5 + index, children: label }, label)) }) : /* @__PURE__ */ jsx(Fragment, { children: t.orderForm.passengersStandard.map((label, index) => /* @__PURE__ */ jsx("option", { value: 1 + index, children: label }, label)) })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("label", { htmlFor: "largeLuggage", className: "block text-gray-700 mb-2", children: [
                  /* @__PURE__ */ jsx(Luggage, { className: "w-4 h-4 inline mr-2" }),
                  t.orderForm.largeLuggage
                ] }),
                /* @__PURE__ */ jsxs(
                  "select",
                  {
                    id: "largeLuggage",
                    name: "largeLuggage",
                    value: formData.largeLuggage,
                    onChange: handleChange,
                    className: fieldClass(
                      "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      luggageError
                    ),
                    required: true,
                    children: [
                      /* @__PURE__ */ jsx("option", { value: "no", children: t.orderForm.luggageNo }),
                      /* @__PURE__ */ jsx("option", { value: "yes", children: t.orderForm.luggageYes })
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "border-t pt-6", children: [
              /* @__PURE__ */ jsx("h4", { className: "text-gray-900 mb-4", children: t.orderForm.contactTitle }),
              /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "name", className: "block text-gray-700 mb-2", children: t.orderForm.fullName }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "text",
                      id: "name",
                      name: "name",
                      value: formData.name,
                      onChange: handleChange,
                      placeholder: t.orderForm.namePlaceholder,
                      className: fieldClass(
                        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        nameError
                      ),
                      required: true
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "phone", className: "block text-gray-700 mb-2", children: t.orderForm.phoneNumber }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "tel",
                      id: "phone",
                      name: "phone",
                      value: formData.phone,
                      onChange: handleChange,
                      onBlur: handlePhoneBlur,
                      inputMode: "tel",
                      placeholder: "+48 123 456 789",
                      className: fieldClass(
                        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        phoneErrorState
                      ),
                      required: true
                    }
                  ),
                  phoneError && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-2", children: phoneError })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsx("label", { htmlFor: "email", className: "block text-gray-700 mb-2", children: t.orderForm.email }),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      id: "email",
                      name: "email",
                      value: formData.email,
                      onChange: (e) => {
                        handleChange(e);
                        handleEmailChange(e.target.value);
                      },
                      placeholder: t.orderForm.emailPlaceholder,
                      className: fieldClass(
                        "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                        emailErrorState
                      ),
                      required: true
                    }
                  ),
                  emailError && /* @__PURE__ */ jsx("p", { className: "text-sm text-red-600 mt-2", children: emailError }),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: t.orderForm.emailHelp })
                ] }),
                /* @__PURE__ */ jsxs("div", { children: [
                  /* @__PURE__ */ jsxs("label", { htmlFor: "description", className: "block text-gray-700 mb-2", children: [
                    /* @__PURE__ */ jsx(FileText, { className: "w-4 h-4 inline mr-2" }),
                    t.orderForm.notesTitle
                  ] }),
                  /* @__PURE__ */ jsx(
                    "textarea",
                    {
                      id: "description",
                      name: "description",
                      value: formData.description,
                      onChange: handleChange,
                      placeholder: t.orderForm.notesPlaceholder,
                      rows: 4,
                      className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: t.orderForm.notesHelp })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "submit",
                className: `w-full py-4 rounded-lg transition-colors ${submitting ? "bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`,
                disabled: submitting,
                children: submitting ? t.orderForm.submitting : /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center gap-1", children: [
                  /* @__PURE__ */ jsx("span", { children: t.orderForm.confirmOrder(totalPrice) }),
                  eurText && /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-2 text-[11px] text-blue-100", children: [
                    /* @__PURE__ */ jsx("span", { children: eurText }),
                    /* @__PURE__ */ jsx("span", { className: "live-badge", children: t.common.actualBadge })
                  ] })
                ] })
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-gray-500 mt-2", children: t.orderForm.reassurance })
          ] })
        ]
      }
    )
  ] }) });
}

export { OrderForm };
