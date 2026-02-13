import { useMemo, useState, useEffect, useRef } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useEurRate } from '../lib/useEurRate';
import { formatEur } from '../lib/currency';
import { buildAdditionalNotes } from '../lib/orderNotes';
import { hasMarketingConsent } from '../lib/consent';
import { getApiBaseUrl } from '../lib/api';
import { trackFormClose, trackFormStart, trackFormSubmit, trackFormValidation } from '../lib/tracking';
import { isAnalyticsEnabled } from '../lib/analytics';
import { Locale, localeToPath, useI18n } from '../lib/i18n';
import { isPolishPublicHoliday } from '../lib/polishHolidays';
import { lockBodyScroll, unlockBodyScroll } from '../lib/scrollLock';

interface OrderFormProps {
  route: {
    from: string;
    to: string;
    priceDay: number;
    priceNight: number;
    type: 'standard' | 'bus';
    pickupTypeDefault?: 'airport' | 'address';
  };
  onClose: () => void;
}

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;
const GDANSK_BIAS = { lat: 54.3520, lon: 18.6466 };
const GDANSK_RADIUS_METERS = 60000;

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentTimeString = () => {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const normalizeSuggestionQuery = (value: string) => value.trim();

const getLocationBounds = (center: { lat: number; lon: number }, radiusMeters: number) => {
  const latDelta = radiusMeters / 111320;
  const lonDelta = radiusMeters / (111320 * Math.cos((center.lat * Math.PI) / 180));
  return {
    north: center.lat + latDelta,
    south: center.lat - latDelta,
    east: center.lon + lonDelta,
    west: center.lon - lonDelta,
  };
};

const MIN_LEAD_TIME_MINUTES = 40;

const isPickupTooSoon = (date: string, time: string) => {
  if (!date || !time) return false;
  const selected = new Date(`${date}T${time}:00`);
  if (Number.isNaN(selected.getTime())) return false;
  const minAllowed = new Date(Date.now() + MIN_LEAD_TIME_MINUTES * 60 * 1000);
  return selected.getTime() < minAllowed.getTime();
};

const isPastDate = (value: string) => {
  if (!value) return false;
  return value < getTodayDateString();
};

const validatePhoneNumber = (value: string, messages: { phoneLetters: string; phoneLength: string }) => {
  const trimmed = value.trim();
  if (/[A-Za-z]/.test(trimmed)) {
    return messages.phoneLetters;
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return messages.phoneLength;
  }
  return null;
};

const validateEmail = (value: string, messages: { emailRequired: string; email: string }) => {
  const trimmed = value.trim();
  if (!trimmed) return messages.emailRequired;
  const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmail.test(trimmed)) {
    return messages.email;
  }
  return null;
};

export function OrderForm({ route, onClose }: OrderFormProps) {
  const { t, locale } = useI18n();
  const emailLocale: Locale = locale === 'pl' ? 'pl' : 'en';
  const basePath = localeToPath(locale);
  const defaultPickupType = useMemo<'airport' | 'address' | ''>(() => {
    if (route.pickupTypeDefault) {
      return route.pickupTypeDefault;
    }
    if (route.from === t.pricing.routes.airport) {
      return 'airport';
    }
    if (route.to === t.pricing.routes.airport) {
      return 'address';
    }
    return '';
  }, [route.pickupTypeDefault, route.from, route.to, t.pricing.routes.airport]);
  const [googleReady, setGoogleReady] = useState(false);
  const placesLibRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<Array<{ label: string; placeId: string }>>([]);
  const [addressFocused, setAddressFocused] = useState(false);
  const [step, setStep] = useState<'trip' | 'details'>('trip');
  const [stepAttempted, setStepAttempted] = useState(false);
  const [formData, setFormData] = useState({
    pickupType: defaultPickupType,
    signService: 'self',
    signText: '',
    flightNumber: '',
    flightUnknown: false,
    passengers: '1',
    largeLuggage: 'no',
    address: '',
    date: getTodayDateString(),
    time: '',
    name: '',
    phone: '',
    email: '',
    description: '',
  });

  useEffect(() => {
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, []);

  // Workaround: browsers/dev HMR sometimes restore <input type="time"> values.
  // Force the time field to start empty.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = window.setTimeout(() => {
      setFormData((prev) => ({ ...prev, time: '' }));
      setTimeTouched(false);
      setTimeEditing(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    if ((window as any).google?.maps) {
      setGoogleReady(true);
      return;
    }
    const existing = document.querySelector('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => setGoogleReady(true), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&loading=async&v=weekly`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.addEventListener('load', () => setGoogleReady(true));
    document.head.appendChild(script);
  }, []);

  const ensurePlacesLibrary = async () => {
    if (!googleReady) {
      return null;
    }
    const google = (window as any).google;
    if (!google?.maps?.importLibrary) {
      return null;
    }
    if (placesLibRef.current) {
      return placesLibRef.current;
    }
    const lib = await google.maps.importLibrary('places');
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
    const phoneError = validatePhoneNumber(formData.phone, t.orderForm.validation);
    setPhoneError(phoneError);
  };

  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(route.priceDay);
  const [rateContext, setRateContext] = useState({
    label: t.orderForm.rate.day,
    reason: t.orderForm.rate.reasonDay,
    price: route.priceDay,
  });
  const [rateBanner, setRateBanner] = useState<string | null>(null);
  const lastRatePriceRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const [holidayKeys, setHolidayKeys] = useState<Set<string> | null>(null);
  const [holidayYear, setHolidayYear] = useState<number | null>(null);
  const eurRate = useEurRate();
  const formStartedRef = useRef(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [timeTouched, setTimeTouched] = useState(false);
  const [timeEditing, setTimeEditing] = useState(false);
  const signFee = formData.pickupType === 'airport' && formData.signService === 'sign' ? 20 : 0;
  const totalPrice = currentPrice + signFee;
  const eurText = formatEur(totalPrice, eurRate);
  const routeStartsAtAirport = defaultPickupType ? defaultPickupType === 'airport' : route.from === t.pricing.routes.airport;
  const shouldSwapRoute =
    formData.pickupType === 'airport'
      ? !routeStartsAtAirport
      : formData.pickupType === 'address'
        ? routeStartsAtAirport
        : false;
  const displayRoute = shouldSwapRoute
    ? { from: route.to, to: route.from, type: route.type }
    : { from: route.from, to: route.to, type: route.type };
  const signServiceTitle = t.orderForm.signServiceTitle ?? 'Airport pickup options';
  const signServiceSign = t.orderForm.signServiceSign ?? 'Meet with a name sign';
  const signServiceFee = t.orderForm.signServiceFee ?? '+20 PLN added to final price';
  const signServiceSelf = t.orderForm.signServiceSelf ?? 'Find the driver yourself';
  const signServiceSelfNote = t.orderForm.signServiceSelfNote ?? '';
  const isPhoneValid = !validatePhoneNumber(formData.phone, t.orderForm.validation);
  const isEmailValid = !validateEmail(formData.email, t.orderForm.validation);
  const showRateBanner = (message: string) => {
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
    return (
      <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-900">{rateBanner}</p>
        </div>
      </div>
    );
  };

  const showValidation = step === 'trip' ? stepAttempted : submitAttempted;
  const pickupTypeError = showValidation && !formData.pickupType;
  const pickupAddressError = showValidation && formData.pickupType === 'address' && !formData.address.trim();
  const flightNumberError =
    showValidation &&
    formData.pickupType === 'airport' &&
    !formData.flightUnknown &&
    !formData.flightNumber.trim();
  const dateError = showValidation && (!formData.date || isPastDate(formData.date));
  const isTimeTooSoon = isPickupTooSoon(formData.date, formData.time);
  const showTimeValidation = (step === 'trip' ? stepAttempted : submitAttempted) || timeTouched;
  const timeError = showTimeValidation && !timeEditing && (!formData.time || isTimeTooSoon);
  const nameError = showValidation && !formData.name.trim();
  const phoneErrorState = showValidation && (!formData.phone.trim() || !isPhoneValid);
  const emailErrorState = showValidation && (!formData.email.trim() || !isEmailValid);

  const fieldClass = (base: string, invalid: boolean) =>
    `${base}${invalid ? ' border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500' : ''}`;

  const remainingFields = useMemo(() => {
    const isDateOk = Boolean(formData.date) && !isPastDate(formData.date);
    const isTimeOk = Boolean(formData.time) && !isPickupTooSoon(formData.date, formData.time);
    const isPickupOk = Boolean(formData.pickupType);
    const isAddressOk = formData.pickupType === 'address' ? Boolean(formData.address.trim()) : true;
    const isFlightOk =
      formData.pickupType === 'airport'
        ? (formData.flightUnknown ? true : Boolean(formData.flightNumber.trim()))
        : true;
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
      isEmailOk,
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
    isEmailValid,
  ]);
  const remainingFieldsLabel =
    typeof t.common.remainingFields === 'function'
      ? t.common.remainingFields(remainingFields)
      : `Remaining fields: ${remainingFields}`;

  const scrollToField = (fieldId: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    window.requestAnimationFrame(() => {
      const target = document.getElementById(fieldId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (target instanceof HTMLElement) {
          target.focus({ preventScroll: true });
        }
      }
    });
  };

  const trackConversion = (transactionId?: string | null) => {
    if (typeof window === 'undefined' || !isAnalyticsEnabled()) {
      return;
    }

    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') {
      return;
    }
    if (!hasMarketingConsent()) {
      return;
    }

    const payload: Record<string, unknown> = {
      send_to: 'AW-17948664296/MWNwCK_nz_cbEOjDy-5C',
    };
    if (transactionId) {
      payload.transaction_id = transactionId;
    }
    gtag('event', 'conversion', payload);
  };

  useEffect(() => {
    if (formData.pickupType !== 'address') {
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
        if (!GOOGLE_MAPS_KEY) {
          setAddressSuggestions([]);
          return;
        }
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          setAddressSuggestions([]);
          return;
        }
        const sessionToken = await getSessionToken();
        const request: any = {
          input: query,
          region: 'pl',
          language: locale,
          locationBias: getLocationBounds(GDANSK_BIAS, GDANSK_RADIUS_METERS),
          sessionToken: sessionToken ?? undefined,
        };
        const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        const results = (Array.isArray(suggestions) ? suggestions : [])
          .map((suggestion: any) => suggestion.placePrediction)
          .filter((prediction: any) => prediction?.placeId)
          .map((prediction: any) => {
            const label = typeof prediction?.text?.text === 'string'
              ? prediction.text.text
              : prediction?.text?.toString?.() ?? '';
            return {
              label,
              placeId: String(prediction.placeId ?? ''),
            };
          })
          .filter((item: any) => item.label && item.placeId);
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
    if (typeof window === 'undefined') {
      return;
    }

    const resolvedYear = formData.date
      ? new Date(`${formData.date}T00:00:00`).getFullYear()
      : new Date().getFullYear();

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
        // ignore cache parse errors
      }
    }

    fetch(`https://date.nager.at/api/v3/PublicHolidays/${resolvedYear}/PL`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: Array<{ date?: string }>) => {
        const keys = Array.isArray(data)
          ? data.map((entry) => entry.date).filter((date): date is string => Boolean(date))
          : [];
        setHolidayKeys(new Set(keys));
        window.localStorage.setItem(cacheKey, JSON.stringify(keys));
      })
      .catch(() => {
        setHolidayKeys(null);
      });
  }, [formData.date, holidayYear]);

  // Calculate if it's night rate based on time or Polish public holidays
  useEffect(() => {
    let isNight = false;
    const reasons: string[] = [];

    if (formData.time) {
      const [hours, minutes] = formData.time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + 30; // Add 30 minutes for travel
      const adjustedHours = Math.floor(totalMinutes / 60) % 24;
      const isNightTime = adjustedHours >= 22 || adjustedHours < 6;
      if (isNightTime) {
        reasons.push(t.orderForm.rate.reasonLate);
      }
      isNight = isNight || isNightTime;
    }

    if (formData.date) {
      const date = new Date(`${formData.date}T00:00:00`);
      if (!Number.isNaN(date.getTime()) && isPolishPublicHoliday(date, holidayKeys)) {
        reasons.push(t.orderForm.rate.reasonHoliday);
        isNight = true;
      }
    }

    const price = isNight ? route.priceNight : route.priceDay;
    setCurrentPrice(price);
    setRateContext({
      label: isNight ? t.orderForm.rate.night : t.orderForm.rate.day,
      reason: reasons.length ? reasons.join(' + ') : t.orderForm.rate.reasonDay,
      price,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhoneError(null);
    setEmailError(null);
    setSubmitAttempted(true);
    const missingFieldIds: string[] = [];
    if (!formData.date) {
      missingFieldIds.push('date');
    }
    if (formData.date && isPastDate(formData.date)) {
      trackFormValidation('order', 1, 'date');
      trackFormSubmit('order', 'validation_error');
      setError(t.orderForm.validation.datePast);
      scrollToField('date');
      return;
    }
    if (!formData.time) {
      missingFieldIds.push('time');
    }
    if (!formData.pickupType) {
      missingFieldIds.push('pickupType');
    }
    if (formData.pickupType === 'airport') {
      if (!formData.flightUnknown && !formData.flightNumber.trim()) {
        missingFieldIds.push('flightNumber');
      }
    }
    if (formData.pickupType === 'address' && !formData.address.trim()) {
      missingFieldIds.push('address');
    }
    if (!formData.name.trim()) {
      missingFieldIds.push('name');
    }
    if (!formData.phone.trim() || !isPhoneValid) {
      missingFieldIds.push('phone');
    }
    if (!formData.email.trim() || !isEmailValid) {
      missingFieldIds.push('email');
    }
    if (missingFieldIds.length > 0) {
      trackFormValidation('order', missingFieldIds.length, missingFieldIds[0]);
      trackFormSubmit('order', 'validation_error');
      scrollToField(missingFieldIds[0]);
      return;
    }
    if (isPickupTooSoon(formData.date, formData.time)) {
      trackFormValidation('order', 1, 'time');
      trackFormSubmit('order', 'validation_error');
      setError(t.orderForm.validation.timeSoon);
      scrollToField('time');
      return;
    }
    const phoneError = validatePhoneNumber(formData.phone, t.orderForm.validation);
    if (phoneError) {
      trackFormValidation('order', 1, 'phone');
      trackFormSubmit('order', 'validation_error');
      setPhoneError(phoneError);
      setError(phoneError);
      return;
    }
    const emailError = validateEmail(formData.email, t.orderForm.validation);
    if (emailError) {
      trackFormValidation('order', 1, 'email');
      trackFormSubmit('order', 'validation_error');
      setEmailError(emailError);
      setError(emailError);
      return;
    }
    setSubmitting(true);

    const apiBaseUrl = getApiBaseUrl();
    const additionalNotes = buildAdditionalNotes({
      pickupType: formData.pickupType as 'airport' | 'address',
      signService: formData.pickupType === 'airport' ? formData.signService : 'self',
      signFee,
      signText: formData.signText,
      passengers: formData.passengers,
      largeLuggage: formData.largeLuggage,
      route: {
        from: displayRoute.from,
        to: displayRoute.to,
        type: displayRoute.type,
      },
      notes: formData.description.trim(),
    });

    const payload = {
      carType: route.type === 'bus' ? 1 : 2,
      pickupAddress: formData.pickupType === 'address' ? formData.address : displayRoute.from,
      proposedPrice: String(totalPrice),
      date: formData.date,
      pickupTime: formData.time,
      flightNumber:
        formData.pickupType === 'airport'
          ? (formData.flightUnknown ? 'TBD' : formData.flightNumber)
          : 'N/A',
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      additionalNotes,
      locale: emailLocale,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': emailLocale,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        trackFormSubmit('order', 'error', 'api');
        // If API rejects due to missing email, offer WhatsApp as a fallback.
        const apiError: string = data?.error ?? t.orderForm.submitError;
        setError(apiError);
        return;
      }

      const createdId = (data?.id ?? null) as string | null;
      setOrderId(createdId);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackFormSubmit('order', 'success');
      trackConversion(createdId);
    } catch (submitError) {
      trackFormSubmit('order', 'error', 'network');
      setError(t.orderForm.submitNetworkError);
    } finally {
      setSubmitting(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    const nextError = validatePhoneNumber(value, t.orderForm.validation);
    setPhoneError(nextError);
    if (!nextError && error === phoneError) {
      setError(null);
    }
  };

  const handleEmailChange = (value: string) => {
    const nextError = validateEmail(value, t.orderForm.validation);
    setEmailError(nextError);
    if (!nextError && error === emailError) {
      setError(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart('order');
    }
    const { name, value } = e.target;
    const today = getTodayDateString();
    if (name === 'pickupType') {
      setStep('trip');
      setStepAttempted(false);
    }
    if (name === 'date' && value < today) {
      setFormData({
        ...formData,
        [name]: today,
      });
      return;
    }
    if (name === 'date') {
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
        time: nextTime,
      });
      return;
    }
    if (name === 'time' && error === t.orderForm.validation.timeSoon) {
      // Hide the banner error while the user is actively fixing the time.
      setError(null);
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSignServiceChange = (value: 'sign' | 'self') => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart('order');
    }
    setFormData((prev) => ({
      ...prev,
      signService: value,
      signText: value === 'self' ? '' : prev.signText,
    }));
  };

  const formScrollRef = useRef<HTMLDivElement | null>(null);

  const handleContinue = () => {
    setStepAttempted(true);
    if (!formData.pickupType) {
      scrollToField('pickupType');
      return;
    }
    if (!formData.date || isPastDate(formData.date)) {
      scrollToField('date');
      return;
    }
    if (!formData.time) {
      scrollToField('time');
      return;
    }
    if (isPickupTooSoon(formData.date, formData.time)) {
      setError(t.orderForm.validation.timeSoon);
      scrollToField('time');
      return;
    }
    setStep('details');
    window.requestAnimationFrame(() => {
      formScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-green-900 mb-2">{t.orderForm.submittedTitle}</h3>
            <p className="text-green-800 mb-4">
              {t.orderForm.submittedBody}
            </p>
            <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm">{t.orderForm.awaiting}</span>
            </div>
            <div className="bg-white rounded-lg p-4 mb-2">
              <p className="text-gray-700">
                {t.orderForm.totalPrice} <span className="font-bold text-blue-600">{totalPrice} PLN</span>
              </p>
              {eurText && (
                <div className="mt-1 text-gray-500">
                  <span className="eur-text">{eurText}</span>
                </div>
              )}
            </div>
            {renderRateBanner()}
            {orderId && (
              <div className="bg-white rounded-lg p-4 mb-4">
                {generatedId && (
                  <p className="text-gray-700">{t.orderForm.orderNumber} <span className="font-semibold">{generatedId}</span></p>
                )}
                <p className="text-gray-700">{t.orderForm.orderId} <span className="font-semibold">{orderId}</span></p>
                <a
                  href={`${basePath}/?orderId=${orderId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  {t.orderForm.manageLink}
                </a>
              </div>
            )}
            <button
              onClick={() => {
                trackFormClose('order');
                onClose();
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {t.common.close}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-hidden">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col relative">
	        <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
	          <div>
	            <h3 className="text-gray-900">{t.orderForm.title}</h3>
	            <p className="text-gray-600 text-sm mt-1">{displayRoute.from} ↔ {displayRoute.to}</p>
              {remainingFields > 0 && (
                <p className="text-[11px] text-gray-600 mt-3">
                  {remainingFieldsLabel}
                </p>
              )}
	          </div>
          <button 
            onClick={() => {
              trackFormClose('order');
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

	        <form
	          onSubmit={handleSubmit}
	          autoComplete="off"
	          noValidate
	          className="booking-form flex-1 flex flex-col overflow-hidden cursor-default"
	        >
	          <div
	            ref={formScrollRef}
	            className={`modal-scroll p-6 space-y-6 overflow-y-auto ${
	              step === 'details' ? 'order-form--details' : ''
	            }`}
	          >
	            {error && (
	              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800">
	                {error}
	              </div>
	            )}

	            {step === 'trip' ? (
	              <>
	              {/* Pickup Type */}
	              <div id="pickupType" tabIndex={-1}>
	                <label className="block text-gray-700 mb-2">
	                  {t.orderForm.pickupType}
	                </label>
	                <p className="text-sm text-gray-500 mb-3">
	                  {t.orderForm.pickupTypeHint}
	                </p>
	                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
	                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
	                    formData.pickupType === 'airport'
	                      ? 'border-blue-500 bg-blue-50'
	                      : pickupTypeError ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200 hover:border-gray-300'
	                  }`}>
	                    <input
	                      type="radio"
	                      name="pickupType"
	                      value="airport"
	                      checked={formData.pickupType === 'airport'}
	                      onChange={handleChange}
	                      className="w-4 h-4 text-blue-600"
	                    />
	                    <Plane className="w-5 h-5 text-gray-700" />
	                    <span className="text-sm leading-snug">{t.orderForm.airportPickup}</span>
	                  </label>

	                  <label className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
	                    formData.pickupType === 'address'
	                      ? 'border-blue-500 bg-blue-50'
	                      : pickupTypeError ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200 hover:border-gray-300'
	                  }`}>
	                    <input
	                      type="radio"
	                      name="pickupType"
	                      value="address"
	                      checked={formData.pickupType === 'address'}
	                      onChange={handleChange}
	                      className="w-4 h-4 text-blue-600"
	                    />
	                    <MapPin className="w-5 h-5 text-gray-700" />
	                    <span className="text-sm leading-snug">{t.orderForm.addressPickup}</span>
	                  </label>
	                </div>
	              </div>

	              {formData.pickupType && (
	                <>
	                  {/* Price Display */}
	                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
	                    <div className="flex items-center justify-between">
	                      <span className="text-gray-700">{t.orderForm.totalPrice}</span>
	                      <div className="text-right">
	                        <span className="text-blue-900 text-2xl">{totalPrice} PLN</span>
	                        {eurText && (
	                          <div className="text-gray-500">
	                            <span className="eur-text">{eurText}</span>
	                          </div>
	                        )}
	                      </div>
	                    </div>
	                  </div>
	                  {renderRateBanner()}

	                  {/* Date and Time */}
	                  <div className="grid sm:grid-cols-2 gap-4">
	                    <div>
	                      <label htmlFor="date" className="block text-gray-700 mb-2">
	                        <Calendar className="w-4 h-4 inline mr-2" />
	                        {t.orderForm.date}
	                      </label>
	                      <input
	                        type="date"
	                        id="date"
	                        name="date"
	                        value={formData.date}
	                        onChange={handleChange}
	                        min={getTodayDateString()}
	                        className={fieldClass(
	                          'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
	                          dateError,
	                        )}
	                        required
	                      />
	                    </div>

	                    <div>
	                      <label htmlFor="time" className="block text-gray-700 mb-2">
	                        {t.orderForm.pickupTime}
	                      </label>
	                      <input
	                        type="time"
	                        id="time"
	                        name="time"
	                        value={formData.time}
	                        autoComplete="off"
	                        onChange={handleChange}
	                        onFocus={() => setTimeEditing(true)}
	                        onBlur={(event) => {
	                          setTimeEditing(false);
	                          setTimeTouched(true);
	                          if (event.currentTarget.value && isPickupTooSoon(formData.date, event.currentTarget.value)) {
	                            setError(t.orderForm.validation.timeSoon);
	                          }
	                        }}
	                        className={fieldClass(
	                          'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
	                          timeError,
	                        )}
	                        required
	                      />
	                      {!timeEditing && showTimeValidation && formData.time && isTimeTooSoon && (
	                        <p className="mt-1 text-sm text-red-600">{t.orderForm.validation.timeSoon}</p>
	                      )}
	                    </div>
	                  </div>

	                  {/* Actions moved to footer panel */}
	                </>
	              )}
	              </>
	            ) : (
	              <>
	              <div className="flex items-center justify-between">
	                <button
	                  type="button"
	                  onClick={() => {
	                    setStep('trip');
	                    window.requestAnimationFrame(() => {
	                      formScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
	                    });
	                  }}
	                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
	                >
	                  {t.common.back}
	                </button>
	              </div>

	              {/* Price Display */}
	              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
	                <div className="flex items-center justify-between">
	                  <span className="text-gray-700">{t.orderForm.totalPrice}</span>
	                  <div className="text-right">
	                    <span className="text-blue-900 text-2xl">{totalPrice} PLN</span>
	                    {eurText && (
	                      <div className="text-gray-500">
	                        <span className="eur-text">{eurText}</span>
	                      </div>
	                    )}
	                  </div>
	                </div>
	              </div>
	              {renderRateBanner()}

	              {/* Airport Pickup Fields */}
	              {formData.pickupType === 'airport' && (
	                <>
	                  <div id="signService" tabIndex={-1}>
	                    <label className="block text-gray-700 mb-2">
	                      {signServiceTitle}
	                    </label>
	                    <div className="grid sm:grid-cols-2 gap-4">
	                      <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
	                        formData.signService === 'sign'
	                          ? 'border-blue-500 bg-blue-50'
	                          : 'border-gray-200 hover:border-gray-300'
	                      }`}>
	                        <input
	                          type="radio"
	                          name="signService"
	                          value="sign"
	                          checked={formData.signService === 'sign'}
	                          onChange={() => handleSignServiceChange('sign')}
	                          className="w-4 h-4 text-blue-600"
	                        />
	                        <FileText className="w-5 h-5 text-gray-700" />
	                        <div>
	                          <div className="text-gray-900">{signServiceSign}</div>
	                          <div className="text-xs text-gray-500">{signServiceFee}</div>
	                        </div>
	                      </label>

	                      <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
	                        formData.signService === 'self'
	                          ? 'border-blue-500 bg-blue-50'
	                          : 'border-gray-200 hover:border-gray-300'
	                      }`}>
	                        <input
	                          type="radio"
	                          name="signService"
	                          value="self"
	                          checked={formData.signService === 'self'}
	                          onChange={() => handleSignServiceChange('self')}
	                          className="w-4 h-4 text-blue-600"
	                        />
	                        <Users className="w-5 h-5 text-gray-700 flex-shrink-0" />
	                        <div>
	                          <div className="text-gray-900">{signServiceSelf}</div>
	                          <div className="text-xs text-gray-500">{signServiceSelfNote}</div>
	                        </div>
	                      </label>
	                    </div>
	                  </div>

	                  {formData.signService === 'sign' ? (
	                    <div>
	                      <label htmlFor="signText" className="block text-gray-700 mb-2">
	                        <FileText className="w-4 h-4 inline mr-2" />
	                        {t.orderForm.signText}
	                      </label>
	                      <input
	                        type="text"
	                        id="signText"
	                        name="signText"
	                        value={formData.signText}
	                        onChange={handleChange}
	                        placeholder={t.orderForm.signPlaceholder}
	                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
	                      />
	                      <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
	                        <div className="flex items-start gap-3 mb-3">
	                          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
	                          <p className="text-sm text-amber-900">
	                            {t.orderForm.signHelp}
	                          </p>
	                        </div>
	                        {/* Visual Sign Preview */}
	                        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
	                          <p className="text-[8px] text-gray-500 mb-2 text-center">{t.orderForm.signPreview}</p>
	                          <div className="bg-white border-4 border-blue-900 rounded p-3 text-center min-h-[60px] flex items-center justify-center">
	                            <p className="text-blue-900 text-lg break-words">
	                              {formData.signText || formData.name || t.orderForm.signEmpty}
	                            </p>
	                          </div>
	                        </div>
	                      </div>
	                    </div>
	                  ) : null}

	                  <div>
	                    <label htmlFor="flightNumber" className="block text-gray-700 mb-2">
	                      <Plane className="w-4 h-4 inline mr-2" />
	                      {t.orderForm.flightNumber}
	                    </label>
	                    <input
	                      type="text"
	                      id="flightNumber"
	                      name="flightNumber"
	                      value={formData.flightNumber}
	                      onChange={handleChange}
	                      placeholder={t.orderForm.flightPlaceholder}
	                      className={fieldClass(
	                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
	                        flightNumberError,
	                      )}
	                      disabled={formData.flightUnknown}
	                      autoComplete="off"
	                    />
	                    <label className="mt-2 flex items-center gap-2 text-sm text-gray-600">
	                      <input
	                        type="checkbox"
	                        checked={formData.flightUnknown}
	                        onChange={(e) => {
	                          const next = e.target.checked;
	                          setFormData((prev) => ({
	                            ...prev,
	                            flightUnknown: next,
	                            flightNumber: next ? '' : prev.flightNumber,
	                          }));
	                        }}
	                      />
	                      {t.orderForm.flightUnknown}
	                    </label>
	                  </div>
	                </>
	              )}

	              {/* Address Pickup Field */}
	              {formData.pickupType === 'address' && (
	                <div>
	                  <label htmlFor="address" className="block text-gray-700 mb-2">
	                    <MapPin className="w-4 h-4 inline mr-2" />
	                    {t.orderForm.pickupAddress}
	                  </label>
	                  <div className="relative">
	                    <input
	                      type="text"
	                      id="address"
	                      name="address"
	                      value={formData.address}
	                      onChange={handleChange}
	                      onFocus={() => setAddressFocused(true)}
	                      onBlur={() => {
	                        window.setTimeout(() => setAddressFocused(false), 150);
	                      }}
	                      placeholder={t.orderForm.pickupPlaceholder}
	                      autoComplete="street-address"
	                      className={fieldClass(
	                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
	                        pickupAddressError,
	                      )}
	                      required
	                    />

	                    {addressFocused && addressSuggestions.length > 0 && (
	                      <div className="absolute z-50 mt-2 w-full rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden">
	                        {addressSuggestions.slice(0, 6).map((item) => (
	                          <button
	                            key={item.placeId}
	                            type="button"
	                            className="block w-full px-4 py-3 text-left text-sm text-slate-800 hover:bg-slate-50 focus:outline-none focus:bg-slate-50"
	                            onMouseDown={(event) => {
	                              event.preventDefault();
	                              setFormData((prev) => ({ ...prev, address: item.label }));
	                              setAddressSuggestions([]);
	                              setAddressFocused(false);
	                              resetSessionToken();
	                            }}
	                          >
	                            {item.label}
	                          </button>
	                        ))}
	                      </div>
	                    )}
	                  </div>
	                </div>
	              )}

	              {/* Passengers and Luggage */}
	              <div className="grid sm:grid-cols-2 gap-4">
	                <div>
	                  <label htmlFor="passengers" className="block text-gray-700 mb-2">
	                    <Users className="w-4 h-4 inline mr-2" />
	                    {t.orderForm.passengers}
	                  </label>
	                  <select
	                    id="passengers"
	                    name="passengers"
	                    value={formData.passengers}
	                    onChange={handleChange}
	                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
	                  >
	                    {route.type === 'bus' ? (
	                      <>
	                        {t.orderForm.passengersBus.map((label, index) => (
	                          <option key={label} value={5 + index}>{label}</option>
	                        ))}
	                      </>
	                    ) : (
	                      <>
	                        {t.orderForm.passengersStandard.map((label, index) => (
	                          <option key={label} value={1 + index}>{label}</option>
	                        ))}
	                      </>
	                    )}
	                  </select>
	                </div>

	                <div>
	                  <label htmlFor="largeLuggage" className="block text-gray-700 mb-2">
	                    <Luggage className="w-4 h-4 inline mr-2" />
	                    {t.orderForm.largeLuggage}
	                  </label>
	                  <select
	                    id="largeLuggage"
	                    name="largeLuggage"
	                    value={formData.largeLuggage}
	                    onChange={handleChange}
	                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
	                  >
	                    <option value="no">{t.orderForm.luggageNo}</option>
	                    <option value="yes">{t.orderForm.luggageYes}</option>
	                  </select>
	                </div>
	              </div>

	              {/* Contact Information */}
	              <div className="border-t pt-6">
	                <h4 className="text-gray-900 mb-4">{t.orderForm.contactTitle}</h4>

	                <div className="space-y-4">
	                  <div>
	                    <label htmlFor="name" className="block text-gray-700 mb-2">
	                      {t.orderForm.fullName}
	                    </label>
	                    <input
	                      type="text"
	                      id="name"
	                      name="name"
	                      value={formData.name}
	                      onChange={handleChange}
	                      placeholder={t.orderForm.namePlaceholder}
	                      autoComplete="name"
	                      className={fieldClass(
	                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
	                        nameError,
	                      )}
	                      required
	                    />
	                  </div>

	                  <div>
	                    <label htmlFor="phone" className="block text-gray-700 mb-2">
	                      {t.orderForm.phoneNumber}
	                    </label>
	                    <input
	                      type="tel"
	                      id="phone"
	                      name="phone"
	                      value={formData.phone}
	                      onChange={handleChange}
	                      onBlur={handlePhoneBlur}
	                      inputMode="tel"
	                      autoComplete="tel"
	                      placeholder="+48 123 456 789"
	                      className={fieldClass(
	                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
	                        phoneErrorState,
	                      )}
	                      required
	                    />
	                    {phoneError && (
	                      <p className="text-sm text-red-600 mt-2">{phoneError}</p>
	                    )}
	                  </div>

	                  <div>
	                    <label htmlFor="email" className="block text-gray-700 mb-2">
	                      {t.orderForm.email}
	                    </label>
	                    <input
	                      type="email"
	                      id="email"
	                      name="email"
	                      value={formData.email}
	                      onChange={(e) => {
	                        handleChange(e);
	                        handleEmailChange(e.target.value);
	                      }}
	                      placeholder={t.orderForm.emailPlaceholder}
	                      autoComplete="email"
	                      className={fieldClass(
	                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
	                        emailErrorState,
	                      )}
	                      required
	                    />
	                    {emailError && (
	                      <p className="text-sm text-red-600 mt-2">{emailError}</p>
	                    )}
	                    <p className="text-sm text-gray-500 mt-1">
	                      {t.orderForm.emailHelp}
	                    </p>
	                  </div>

	                  <details className="rounded-lg border border-gray-200 bg-gray-50 p-4">
	                    <summary className="cursor-pointer text-sm font-semibold text-gray-800">
	                      {t.orderForm.notesTitle}
	                    </summary>
	                    <div className="mt-3">
	                      <textarea
	                        id="description"
	                        name="description"
	                        value={formData.description}
	                        onChange={handleChange}
	                        placeholder={t.orderForm.notesPlaceholder}
	                        rows={4}
	                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
	                      />
	                      <p className="text-sm text-gray-500 mt-1">
	                        {t.orderForm.notesHelp}
	                      </p>
	                    </div>
	                  </details>
	                </div>
	              </div>
	            </>
	          )}
	          </div>

	          <div className="order-actions-footer">
	            {step === 'trip' ? (
	              <>
	                <button
	                  type="button"
	                  onClick={handleContinue}
	                  className={`order-actions-btn w-full py-4 rounded-lg transition-colors ${
	                    submitting
	                      ? 'bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed'
	                      : 'bg-blue-600 text-white hover:bg-blue-700'
	                  }`}
	                  disabled={submitting}
	                  style={{ minHeight: '56px' }}
	                >
	                  {t.common.continue}
	                </button>
	                <p className="text-xs text-center text-gray-500 mt-2">
	                  {t.orderForm.reassurance}
	                </p>
	              </>
	            ) : (
	              <>
	              <div className="order-actions-grid grid grid-cols-2 gap-2 sm:gap-3">
	                <button
	                  type="button"
	                  onClick={() => {
	                    setStep('trip');
	                    window.requestAnimationFrame(() => {
	                      formScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
	                    });
	                  }}
	                  className={`order-actions-btn w-full py-4 rounded-lg transition-colors ${
	                    submitting
	                      ? 'bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed'
	                      : 'bg-blue-600 text-white hover:bg-blue-700'
	                  }`}
	                  disabled={submitting}
	                  style={{ minHeight: '56px' }}
	                >
	                  {t.common.back}
	                </button>

	                <button
	                  type="submit"
	                  className={`order-actions-btn w-full py-4 rounded-lg transition-colors ${
	                    submitting
	                      ? 'bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed'
	                      : 'bg-blue-600 text-white hover:bg-blue-700'
	                  }`}
	                  disabled={submitting}
	                  style={{ minHeight: '56px' }}
	                >
	                  {submitting ? (
	                    t.orderForm.submitting
	                  ) : (
	                    <span className="flex flex-col items-center gap-1">
	                      <span>{t.orderForm.confirmOrder(totalPrice)}</span>
	                      {eurText && (
	                        <span className="order-actions-eur text-[11px] text-blue-100">{eurText}</span>
	                      )}
	                    </span>
	                  )}
	                </button>
	              </div>
	              <p className="text-xs text-center text-gray-500 mt-2">
	                {t.orderForm.reassurance}
	              </p>
	              </>
	            )}
	          </div>
	        </form>
	      </div>
	    </div>
	  );
	}
