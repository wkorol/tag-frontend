import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useMemo, useState, useRef, useEffect } from 'react';
import { Plane, MapPin, Calendar, FileText, Users, Info, Luggage } from 'lucide-react';
import { u as useEurRate, f as formatEur, g as getApiBaseUrl } from './currency-BfL_L89a.mjs';
import { b as buildAdditionalNotes } from './orderNotes-Bh0j39S6.mjs';
import { u as useI18n, l as localeToPath, j as trackFormClose, k as trackFormValidation, m as trackFormSubmit, n as trackFormStart, o as isAnalyticsEnabled, p as hasMarketingConsent } from '../entry-server.mjs';
import { l as lockBodyScroll, u as unlockBodyScroll, i as isPolishPublicHoliday } from './scrollLock-Db1Ed-19.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';

const GOOGLE_MAPS_KEY = "AIzaSyCZn_Y7YkTDjJe8715PJ0jVbcwaim7kKFE";
const GDANSK_BIAS = { lat: 54.352, lon: 18.6466 };
const GDANSK_RADIUS_METERS = 6e4;
const getTodayDateString = () => {
  const now = /* @__PURE__ */ new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const normalizeSuggestionQuery = (value) => value.trim();
const getLocationBounds = (center, radiusMeters) => {
  const latDelta = radiusMeters / 111320;
  const lonDelta = radiusMeters / (111320 * Math.cos(center.lat * Math.PI / 180));
  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lon + lonDelta,
    west: center.lon - lonDelta
  };
};
const MIN_LEAD_TIME_MINUTES = 40;
const isPickupTooSoon = (date, time) => {
  if (!date || !time) return false;
  const selected = /* @__PURE__ */ new Date(`${date}T${time}:00`);
  if (Number.isNaN(selected.getTime())) return false;
  const minAllowed = new Date(Date.now() + MIN_LEAD_TIME_MINUTES * 60 * 1e3);
  return selected.getTime() < minAllowed.getTime();
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
const validateEmail = (value, messages) => {
  const trimmed = value.trim();
  if (!trimmed) return messages.emailRequired;
  const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmail.test(trimmed)) {
    return messages.email;
  }
  return null;
};
function OrderForm({ route, onClose }) {
  const { t, locale } = useI18n();
  const emailLocale = locale === "pl" ? "pl" : "en";
  const basePath = localeToPath(locale);
  const defaultPickupType = useMemo(() => {
    if (route.pickupTypeDefault) {
      return route.pickupTypeDefault;
    }
    if (route.from === t.pricing.routes.airport) {
      return "airport";
    }
    if (route.to === t.pricing.routes.airport) {
      return "address";
    }
    return "";
  }, [route.pickupTypeDefault, route.from, route.to, t.pricing.routes.airport]);
  const [googleReady, setGoogleReady] = useState(false);
  const placesLibRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [addressFocused, setAddressFocused] = useState(false);
  const [step, setStep] = useState("trip");
  const [stepAttempted, setStepAttempted] = useState(false);
  const [formData, setFormData] = useState({
    pickupType: defaultPickupType,
    signService: "self",
    signText: "",
    flightNumber: "",
    flightUnknown: false,
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
  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = window.setTimeout(() => {
      setFormData((prev) => ({ ...prev, time: "" }));
      setTimeTouched(false);
      setTimeEditing(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.google?.maps) {
      setGoogleReady(true);
      return;
    }
    const existing = document.querySelector('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener("load", () => setGoogleReady(true), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";
    script.addEventListener("load", () => setGoogleReady(true));
    document.head.appendChild(script);
  }, []);
  const ensurePlacesLibrary = async () => {
    if (!googleReady) {
      return null;
    }
    const google = window.google;
    if (!google?.maps?.importLibrary) {
      return null;
    }
    if (placesLibRef.current) {
      return placesLibRef.current;
    }
    const lib = await google.maps.importLibrary("places");
    placesLibRef.current = lib;
    return lib;
  };
  const getSessionToken = async () => {
    const lib = await ensurePlacesLibrary();
    if (!lib) {
      return null;
    }
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new lib.AutocompleteSessionToken();
    }
    return sessionTokenRef.current;
  };
  const resetSessionToken = () => {
    sessionTokenRef.current = null;
  };
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
  const [timeTouched, setTimeTouched] = useState(false);
  const [timeEditing, setTimeEditing] = useState(false);
  const signFee = formData.pickupType === "airport" && formData.signService === "sign" ? 20 : 0;
  const totalPrice = currentPrice + signFee;
  const eurText = formatEur(totalPrice, eurRate);
  const routeStartsAtAirport = defaultPickupType ? defaultPickupType === "airport" : route.from === t.pricing.routes.airport;
  const shouldSwapRoute = formData.pickupType === "airport" ? !routeStartsAtAirport : formData.pickupType === "address" ? routeStartsAtAirport : false;
  const displayRoute = shouldSwapRoute ? { from: route.to, to: route.from, type: route.type } : { from: route.from, to: route.to, type: route.type };
  const signServiceTitle = t.orderForm.signServiceTitle ?? "Airport pickup options";
  const signServiceSign = t.orderForm.signServiceSign ?? "Meet with a name sign";
  const signServiceFee = t.orderForm.signServiceFee ?? "+20 PLN added to final price";
  const signServiceSelf = t.orderForm.signServiceSelf ?? "Find the driver yourself";
  const signServiceSelfNote = t.orderForm.signServiceSelfNote ?? "";
  const isPhoneValid = !validatePhoneNumber(formData.phone, t.orderForm.validation);
  const isEmailValid = !validateEmail(formData.email, t.orderForm.validation);
  const showRateBanner = (message) => {
    setRateBanner(message);
    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = null;
    }
  };
  const formatRateBanner = (label, price, reason) => typeof t.orderForm.rate?.banner === "function" ? t.orderForm.rate.banner(label, price, reason) : `${label}: ${price} PLN (${reason})`;
  const renderRateBanner = () => {
    if (!rateBanner) {
      return null;
    }
    return /* @__PURE__ */ jsx("div", { className: "mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
      /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-900", children: rateBanner })
    ] }) });
  };
  const showValidation = step === "trip" ? stepAttempted : submitAttempted;
  const pickupTypeError = showValidation && !formData.pickupType;
  const pickupAddressError = showValidation && formData.pickupType === "address" && !formData.address.trim();
  const flightNumberError = showValidation && formData.pickupType === "airport" && !formData.flightUnknown && !formData.flightNumber.trim();
  const dateError = showValidation && (!formData.date || isPastDate(formData.date));
  const isTimeTooSoon = isPickupTooSoon(formData.date, formData.time);
  const showTimeValidation = (step === "trip" ? stepAttempted : submitAttempted) || timeTouched;
  const timeError = showTimeValidation && !timeEditing && (!formData.time || isTimeTooSoon);
  const nameError = showValidation && !formData.name.trim();
  const phoneErrorState = showValidation && (!formData.phone.trim() || !isPhoneValid);
  const emailErrorState = showValidation && (!formData.email.trim() || !isEmailValid);
  const fieldClass = (base, invalid) => `${base}${invalid ? " border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500" : ""}`;
  const remainingFields = useMemo(() => {
    const isDateOk = Boolean(formData.date) && !isPastDate(formData.date);
    const isTimeOk = Boolean(formData.time) && !isPickupTooSoon(formData.date, formData.time);
    const isPickupOk = Boolean(formData.pickupType);
    const isAddressOk = formData.pickupType === "address" ? Boolean(formData.address.trim()) : true;
    const isFlightOk = formData.pickupType === "airport" ? formData.flightUnknown ? true : Boolean(formData.flightNumber.trim()) : true;
    const isNameOk = Boolean(formData.name.trim());
    const isPhoneOk = Boolean(formData.phone.trim()) && isPhoneValid;
    const isEmailOk = Boolean(formData.email.trim()) && isEmailValid;
    const requiredChecks = [
      isPickupOk,
      isDateOk,
      isTimeOk,
      isAddressOk,
      isFlightOk,
      isNameOk,
      isPhoneOk,
      isEmailOk
    ];
    return requiredChecks.filter((ok) => !ok).length;
  }, [
    formData.date,
    formData.time,
    formData.pickupType,
    formData.address,
    formData.flightUnknown,
    formData.flightNumber,
    formData.name,
    formData.phone,
    formData.email,
    isPhoneValid,
    isEmailValid
  ]);
  const remainingFieldsLabel = typeof t.common.remainingFields === "function" ? t.common.remainingFields(remainingFields) : {
    pl: `Pozostało pól: ${remainingFields}`,
    de: `Verbleibende Felder: ${remainingFields}`,
    fi: `Jäljellä olevat kentät: ${remainingFields}`,
    no: `Gjenstående felt: ${remainingFields}`,
    sv: `Återstående fält: ${remainingFields}`,
    da: `Resterende felter: ${remainingFields}`,
    en: `Remaining fields: ${remainingFields}`
  }[locale] ?? `Remaining fields: ${remainingFields}`;
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
  const trackConversion = (transactionId) => {
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
    const payload = {
      send_to: "AW-17948664296/MWNwCK_nz_cbEOjDy-5C"
    };
    if (transactionId) {
      payload.transaction_id = transactionId;
    }
    gtag("event", "conversion", payload);
  };
  useEffect(() => {
    if (formData.pickupType !== "address") {
      setAddressSuggestions([]);
      return;
    }
    const query = normalizeSuggestionQuery(formData.address);
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        if (!GOOGLE_MAPS_KEY) ;
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          setAddressSuggestions([]);
          return;
        }
        const sessionToken = await getSessionToken();
        const request = {
          input: query,
          region: "pl",
          language: locale,
          locationBias: getLocationBounds(GDANSK_BIAS, GDANSK_RADIUS_METERS),
          sessionToken: sessionToken ?? void 0
        };
        const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        const results = (Array.isArray(suggestions) ? suggestions : []).map((suggestion) => suggestion.placePrediction).filter((prediction) => prediction?.placeId).map((prediction) => {
          const label = typeof prediction?.text?.text === "string" ? prediction.text.text : prediction?.text?.toString?.() ?? "";
          return {
            label,
            placeId: String(prediction.placeId ?? "")
          };
        }).filter((item) => item.label && item.placeId);
        if (!active) return;
        setAddressSuggestions(results);
      } catch {
        if (!active) return;
        setAddressSuggestions([]);
      }
    }, 350);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [formData.address, formData.pickupType, locale, googleReady]);
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
      showRateBanner(formatRateBanner(rateContext.label, rateContext.price, rateContext.reason));
      return;
    }
    if (lastRatePriceRef.current !== rateContext.price) {
      lastRatePriceRef.current = rateContext.price;
      showRateBanner(formatRateBanner(rateContext.label, rateContext.price, rateContext.reason));
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
      if (!formData.flightUnknown && !formData.flightNumber.trim()) {
        missingFieldIds.push("flightNumber");
      }
    }
    if (formData.pickupType === "address" && !formData.address.trim()) {
      missingFieldIds.push("address");
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
    if (isPickupTooSoon(formData.date, formData.time)) {
      trackFormValidation("order", 1, "time");
      trackFormSubmit("order", "validation_error");
      setError(t.orderForm.validation.timeSoon);
      scrollToField("time");
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
    const emailError2 = validateEmail(formData.email, t.orderForm.validation);
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
      pickupAddress: formData.pickupType === "address" ? formData.address : displayRoute.from,
      proposedPrice: String(totalPrice),
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: formData.pickupType === "airport" ? formData.flightUnknown ? "TBD" : formData.flightNumber : "N/A",
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
        const apiError = data?.error ?? t.orderForm.submitError;
        setError(apiError);
        return;
      }
      const createdId = data?.id ?? null;
      setOrderId(createdId);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackFormSubmit("order", "success");
      trackConversion(createdId);
    } catch (submitError) {
      trackFormSubmit("order", "error", "network");
      setError(t.orderForm.submitNetworkError);
    } finally {
      setSubmitting(false);
    }
  };
  const handleEmailChange = (value) => {
    const nextError = validateEmail(value, t.orderForm.validation);
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
    if (name === "pickupType") {
      setStep("trip");
      setStepAttempted(false);
    }
    if (name === "date" && value < today) {
      setFormData({
        ...formData,
        [name]: today
      });
      return;
    }
    if (name === "date") {
      const nextDate = value < today ? today : value;
      const nextTime = formData.time;
      if (error === t.orderForm.validation.timeSoon) {
        if (!isPickupTooSoon(nextDate, nextTime)) {
          setError(null);
        }
      }
      setFormData({
        ...formData,
        date: nextDate,
        time: nextTime
      });
      return;
    }
    if (name === "time" && error === t.orderForm.validation.timeSoon) {
      setError(null);
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
  const formScrollRef = useRef(null);
  const handleContinue = () => {
    setStepAttempted(true);
    if (!formData.pickupType) {
      scrollToField("pickupType");
      return;
    }
    if (!formData.date || isPastDate(formData.date)) {
      scrollToField("date");
      return;
    }
    if (!formData.time) {
      scrollToField("time");
      return;
    }
    if (isPickupTooSoon(formData.date, formData.time)) {
      setError(t.orderForm.validation.timeSoon);
      scrollToField("time");
      return;
    }
    setStep("details");
    window.requestAnimationFrame(() => {
      formScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    });
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
        eurText && /* @__PURE__ */ jsx("div", { className: "mt-1 text-gray-500", children: /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText }) })
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
  return /* @__PURE__ */ jsx("div", { className: "modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden", children: /* @__PURE__ */ jsxs("div", { className: "bg-white rounded-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col relative", children: [
    /* @__PURE__ */ jsxs("div", { className: "p-6 border-b flex items-center justify-between flex-shrink-0", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h3", { className: "text-gray-900", children: t.orderForm.title }),
        /* @__PURE__ */ jsxs("p", { className: "text-gray-600 text-sm mt-1", children: [
          displayRoute.from,
          " ↔ ",
          displayRoute.to
        ] }),
        remainingFields > 0 && /* @__PURE__ */ jsx("p", { className: "text-[11px] text-gray-600 mt-3", children: remainingFieldsLabel })
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
        autoComplete: "off",
        noValidate: true,
        className: "booking-form flex-1 flex flex-col overflow-hidden cursor-default",
        children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: formScrollRef,
              className: `modal-scroll p-6 space-y-6 overflow-y-auto ${step === "details" ? "order-form--details" : ""}`,
              children: [
                error && /* @__PURE__ */ jsx("div", { className: "bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800", children: error }),
                step === "trip" ? /* @__PURE__ */ jsxs(Fragment, { children: [
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
                            onChange: handleChange,
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
                        eurText && /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText }) })
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
                            autoComplete: "off",
                            onChange: handleChange,
                            onFocus: () => setTimeEditing(true),
                            onBlur: (event) => {
                              setTimeEditing(false);
                              setTimeTouched(true);
                              if (event.currentTarget.value && isPickupTooSoon(formData.date, event.currentTarget.value)) {
                                setError(t.orderForm.validation.timeSoon);
                              }
                            },
                            className: fieldClass(
                              "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                              timeError
                            ),
                            required: true
                          }
                        ),
                        !timeEditing && showTimeValidation && formData.time && isTimeTooSoon && /* @__PURE__ */ jsx("p", { className: "mt-1 text-sm text-red-600", children: t.orderForm.validation.timeSoon })
                      ] })
                    ] })
                  ] })
                ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-between", children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setStep("trip");
                        window.requestAnimationFrame(() => {
                          formScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                        });
                      },
                      className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700",
                      children: t.common.back
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "bg-blue-50 border-2 border-blue-200 rounded-lg p-4", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: t.orderForm.totalPrice }),
                    /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                      /* @__PURE__ */ jsxs("span", { className: "text-blue-900 text-2xl", children: [
                        totalPrice,
                        " PLN"
                      ] }),
                      eurText && /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: /* @__PURE__ */ jsx("span", { className: "eur-text", children: eurText }) })
                    ] })
                  ] }) }),
                  renderRateBanner(),
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
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          id: "signText",
                          name: "signText",
                          value: formData.signText,
                          onChange: handleChange,
                          placeholder: t.orderForm.signPlaceholder,
                          className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { className: "mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4", children: [
                        /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3 mb-3", children: [
                          /* @__PURE__ */ jsx(Info, { className: "w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" }),
                          /* @__PURE__ */ jsx("p", { className: "text-sm text-amber-900", children: t.orderForm.signHelp })
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm", children: [
                          /* @__PURE__ */ jsx("p", { className: "text-[8px] text-gray-500 mb-2 text-center", children: t.orderForm.signPreview }),
                          /* @__PURE__ */ jsx("div", { className: "bg-white border-4 border-blue-900 rounded p-3 text-center min-h-[60px] flex items-center justify-center", children: /* @__PURE__ */ jsx("p", { className: "text-blue-900 text-lg break-words", children: formData.signText || formData.name || t.orderForm.signEmpty }) })
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
                          disabled: formData.flightUnknown,
                          autoComplete: "off"
                        }
                      ),
                      /* @__PURE__ */ jsxs("label", { className: "mt-2 flex items-center gap-2 text-sm text-gray-600", children: [
                        /* @__PURE__ */ jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: formData.flightUnknown,
                            onChange: (e) => {
                              const next = e.target.checked;
                              setFormData((prev) => ({
                                ...prev,
                                flightUnknown: next,
                                flightNumber: next ? "" : prev.flightNumber
                              }));
                            }
                          }
                        ),
                        t.orderForm.flightUnknown
                      ] })
                    ] })
                  ] }),
                  formData.pickupType === "address" && /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("label", { htmlFor: "address", className: "block text-gray-700 mb-2", children: [
                      /* @__PURE__ */ jsx(MapPin, { className: "w-4 h-4 inline mr-2" }),
                      t.orderForm.pickupAddress
                    ] }),
                    /* @__PURE__ */ jsxs("div", { className: "relative", children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "text",
                          id: "address",
                          name: "address",
                          value: formData.address,
                          onChange: handleChange,
                          onFocus: () => setAddressFocused(true),
                          onBlur: () => {
                            window.setTimeout(() => setAddressFocused(false), 150);
                          },
                          placeholder: t.orderForm.pickupPlaceholder,
                          autoComplete: "street-address",
                          className: fieldClass(
                            "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                            pickupAddressError
                          ),
                          required: true
                        }
                      ),
                      addressFocused && addressSuggestions.length > 0 && /* @__PURE__ */ jsx("div", { className: "absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden", children: addressSuggestions.slice(0, 6).map((item) => /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: "block w-full px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-50 focus:outline-none focus:bg-slate-50",
                          onMouseDown: (event) => {
                            event.preventDefault();
                            setFormData((prev) => ({ ...prev, address: item.label }));
                            setAddressSuggestions([]);
                            setAddressFocused(false);
                            resetSessionToken();
                          },
                          children: item.label
                        },
                        item.placeId
                      )) })
                    ] })
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
                          className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
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
                          className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
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
                            autoComplete: "name",
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
                            autoComplete: "tel",
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
                            autoComplete: "email",
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
                      /* @__PURE__ */ jsxs("details", { className: "rounded-lg border border-gray-200 bg-gray-50 p-4", children: [
                        /* @__PURE__ */ jsx("summary", { className: "cursor-pointer text-sm font-semibold text-gray-800", children: t.orderForm.notesTitle }),
                        /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                          /* @__PURE__ */ jsx(
                            "textarea",
                            {
                              id: "description",
                              name: "description",
                              value: formData.description,
                              onChange: handleChange,
                              placeholder: t.orderForm.notesPlaceholder,
                              rows: 4,
                              className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                            }
                          ),
                          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: t.orderForm.notesHelp })
                        ] })
                      ] })
                    ] })
                  ] })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsx("div", { className: "order-actions-footer", children: step === "trip" ? /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: handleContinue,
                className: `order-actions-btn w-full py-4 rounded-lg transition-colors ${submitting ? "bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`,
                disabled: submitting,
                style: { minHeight: "56px" },
                children: t.common.continue
              }
            ),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-gray-500 mt-2", children: t.orderForm.reassurance })
          ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "order-actions-grid grid grid-cols-2 gap-2 sm:gap-3", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setStep("trip");
                    window.requestAnimationFrame(() => {
                      formScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                    });
                  },
                  className: `order-actions-btn w-full py-4 rounded-lg transition-colors ${submitting ? "bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`,
                  disabled: submitting,
                  style: { minHeight: "56px" },
                  children: t.common.back
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "submit",
                  className: `order-actions-btn w-full py-4 rounded-lg transition-colors ${submitting ? "bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`,
                  disabled: submitting,
                  style: { minHeight: "56px" },
                  children: submitting ? t.orderForm.submitting : /* @__PURE__ */ jsxs("span", { className: "flex flex-col items-center gap-1", children: [
                    /* @__PURE__ */ jsx("span", { children: t.orderForm.confirmOrder(totalPrice) }),
                    eurText && /* @__PURE__ */ jsx("span", { className: "order-actions-eur text-[11px] text-blue-100", children: eurText })
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("p", { className: "text-xs text-center text-gray-500 mt-2", children: t.orderForm.reassurance })
          ] }) })
        ]
      }
    )
  ] }) });
}

export { OrderForm };
