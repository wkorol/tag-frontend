import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useEurRate } from '../lib/useEurRate';
import { formatEur } from '../lib/currency';
import { buildAdditionalNotes } from '../lib/orderNotes';
import { hasMarketingConsent } from '../lib/consent';
import { getApiBaseUrl } from '../lib/api';
import { trackFormStart } from '../lib/tracking';
import { localeToPath, useI18n } from '../lib/i18n';

interface OrderFormProps {
  route: {
    from: string;
    to: string;
    priceDay: number;
    priceNight: number;
    type: 'standard' | 'bus';
  };
  onClose: () => void;
}

const POLISH_FIXED_HOLIDAYS: Array<[number, number]> = [
  [1, 1],
  [1, 6],
  [5, 1],
  [5, 3],
  [8, 15],
  [11, 1],
  [11, 11],
  [12, 25],
  [12, 26],
];

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
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

const validateEmail = (value: string, message: string) => {
  const trimmed = value.trim();
  const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmail.test(trimmed)) {
    return message;
  }
  return null;
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getEasterSunday = (year: number) => {
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
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
};

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const getPolishHolidayKeys = (year: number) => {
  const keys = new Set<string>();
  POLISH_FIXED_HOLIDAYS.forEach(([month, day]) => {
    keys.add(formatDateKey(new Date(year, month - 1, day)));
  });

  const easterSunday = getEasterSunday(year);
  keys.add(formatDateKey(easterSunday));
  keys.add(formatDateKey(addDays(easterSunday, 1))); // Easter Monday
  keys.add(formatDateKey(addDays(easterSunday, 49))); // Pentecost Sunday
  keys.add(formatDateKey(addDays(easterSunday, 60))); // Corpus Christi

  return keys;
};

const isPolishPublicHoliday = (date: Date, apiHolidayKeys: Set<string> | null) => {
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

export function OrderForm({ route, onClose }: OrderFormProps) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const [formData, setFormData] = useState({
    pickupType: '',
    signService: 'self',
    signText: '',
    flightNumber: '',
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
  const signFee = formData.pickupType === 'airport' && formData.signService === 'sign' ? 20 : 0;
  const totalPrice = currentPrice + signFee;
  const eurText = formatEur(totalPrice, eurRate);
  const displayRoute = formData.pickupType === 'address'
    ? { from: route.to, to: route.from, type: route.type }
    : route;
  const signServiceTitle = t.orderForm.signServiceTitle ?? 'Airport pickup options';
  const signServiceSign = t.orderForm.signServiceSign ?? 'Meet with a name sign';
  const signServiceFee = t.orderForm.signServiceFee ?? '+20 PLN added to final price';
  const signServiceSelf = t.orderForm.signServiceSelf ?? 'Find the driver yourself';
  const signServiceSelfNote = t.orderForm.signServiceSelfNote ?? '';
  const isPhoneValid = !validatePhoneNumber(formData.phone, t.orderForm.validation);
  const isEmailValid = !validateEmail(formData.email, t.orderForm.validation.email);
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

  const showValidation = submitAttempted;
  const pickupTypeError = showValidation && !formData.pickupType;
  const pickupAddressError = showValidation && formData.pickupType === 'address' && !formData.address.trim();
  const signTextError = showValidation && formData.pickupType === 'airport' && formData.signService === 'sign' && !formData.signText.trim();
  const flightNumberError = showValidation && formData.pickupType === 'airport' && !formData.flightNumber.trim();
  const dateError = showValidation && !formData.date;
  const timeError = showValidation && !formData.time;
  const passengersError = showValidation && !formData.passengers;
  const luggageError = showValidation && !formData.largeLuggage;
  const nameError = showValidation && !formData.name.trim();
  const phoneErrorState = showValidation && (!formData.phone.trim() || !isPhoneValid);
  const emailErrorState = showValidation && (!formData.email.trim() || !isEmailValid);

  const fieldClass = (base: string, invalid: boolean) =>
    `${base}${invalid ? ' border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500' : ''}`;

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

  const trackConversion = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') {
      return;
    }
    if (!hasMarketingConsent()) {
      return;
    }

    gtag('event', 'conversion', {
      send_to: 'AW-17848598074/JQ0kCLvpq9sbELr8775C',
      value: 1.0,
      currency: 'PLN',
    });
  };

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
    if (!formData.time) {
      missingFieldIds.push('time');
    }
    if (!formData.pickupType) {
      missingFieldIds.push('pickupType');
    }
    if (formData.pickupType === 'airport') {
      if (formData.signService === 'sign' && !formData.signText.trim()) {
        missingFieldIds.push('signText');
      }
      if (!formData.flightNumber.trim()) {
        missingFieldIds.push('flightNumber');
      }
    }
    if (formData.pickupType === 'address' && !formData.address.trim()) {
      missingFieldIds.push('address');
    }
    if (!formData.passengers) {
      missingFieldIds.push('passengers');
    }
    if (!formData.largeLuggage) {
      missingFieldIds.push('largeLuggage');
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
      scrollToField(missingFieldIds[0]);
      return;
    }
    const phoneError = validatePhoneNumber(formData.phone, t.orderForm.validation);
    if (phoneError) {
      setPhoneError(phoneError);
      setError(phoneError);
      return;
    }
    const emailError = validateEmail(formData.email, t.orderForm.validation.email);
    if (emailError) {
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
      pickupAddress: formData.pickupType === 'address' ? formData.address : route.from,
      proposedPrice: String(totalPrice),
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: formData.pickupType === 'airport' ? formData.flightNumber : 'N/A',
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      additionalNotes,
      locale,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? t.orderForm.submitError);
        return;
      }

      setOrderId(data?.id ?? null);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackConversion();
    } catch (submitError) {
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
    const nextError = validateEmail(value, t.orderForm.validation.email);
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
                <div className="mt-1 flex items-center justify-center gap-2 text-gray-500">
                  <span className="eur-text">{eurText}</span>
                  <span className="live-badge">
                    {t.common.actualBadge}
                  </span>
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
              onClick={onClose}
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col relative">
        <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-gray-900">{t.orderForm.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{displayRoute.from} ↔ {displayRoute.to}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="booking-form p-6 space-y-6 overflow-y-auto cursor-default"
        >
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Pickup Type */}
          <div id="pickupType" tabIndex={-1}>
            <label className="block text-gray-700 mb-2">
              {t.orderForm.pickupType}
            </label>
            <p className="text-sm text-gray-500 mb-3">
              {t.orderForm.pickupTypeHint}
            </p>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.pickupType === 'airport'
                  ? 'border-blue-500 bg-blue-50'
                  : pickupTypeError ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="pickupType"
                  value="airport"
                  checked={formData.pickupType === 'airport'}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  className="w-4 h-4 text-blue-600"
                />
                <Plane className="w-5 h-5 text-gray-700" />
                <span>{t.orderForm.airportPickup}</span>
              </label>
              
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
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
                <span>{t.orderForm.addressPickup}</span>
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
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
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
                    onChange={handleChange}
                    className={fieldClass(
                      'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      timeError,
                    )}
                    required
                  />
                </div>
              </div>

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
                  <>
                    <input
                      type="text"
                      id="signText"
                      name="signText"
                      value={formData.signText}
                      onChange={handleChange}
                      placeholder={t.orderForm.signPlaceholder}
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        signTextError,
                      )}
                      required
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
                            {formData.signText || t.orderForm.signEmpty}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
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
                  required
                />
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
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t.orderForm.pickupPlaceholder}
                rows={3}
                className={fieldClass(
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  pickupAddressError,
                )}
                required
              />
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
                className={fieldClass(
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  passengersError,
                )}
                required
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
                className={fieldClass(
                  'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                  luggageError,
                )}
                required
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

              <div>
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  {t.orderForm.notesTitle}
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={t.orderForm.notesPlaceholder}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  {t.orderForm.notesHelp}
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-lg transition-colors ${
              submitting
                ? 'bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={submitting}
          >
            {submitting ? (
              t.orderForm.submitting
            ) : (
              <span className="flex flex-col items-center gap-1">
                <span>{t.orderForm.confirmOrder(totalPrice)}</span>
                {eurText && (
                  <span className="inline-flex items-center gap-2 text-[11px] text-blue-100">
                    <span>{eurText}</span>
                    <span className="live-badge">
                      {t.common.actualBadge}
                    </span>
                  </span>
                )}
              </span>
            )}
          </button>
          <p className="text-xs text-center text-gray-500 mt-2">
            {t.orderForm.reassurance}
          </p>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
