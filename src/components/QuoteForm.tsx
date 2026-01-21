import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, DollarSign, Info, Lock } from 'lucide-react';
import { centerPolygons } from '../lib/centerPolygons';
import { cityPolygons } from '../lib/cityPolygons';
import { distanceKm, isPointInsideGeoJson } from '../lib/geo';
import { FIXED_PRICES, FixedCityKey } from '../lib/fixedPricing';
import { formatEur } from '../lib/currency';
import { preloadEurRate, useEurRate } from '../lib/useEurRate';
import { buildAdditionalNotes } from '../lib/orderNotes';
import { hasMarketingConsent } from '../lib/consent';
import { getApiBaseUrl } from '../lib/api';
import { trackFormClose, trackFormStart, trackFormSubmit, trackFormValidation } from '../lib/tracking';
import { Locale, localeToPath, useI18n } from '../lib/i18n';

const AIRPORT_COORD = { lat: 54.3776, lon: 18.4662 };
const AIRPORT_RADIUS_KM = 2.5;
const SHORT_ROUTE_STRAIGHT_KM = 5;
const POMORSKIE_VIEWBOX = '16.3,53.2,19.6,54.9';
const TAXIMETER_RATES = {
  gdansk: { day: 3.9, night: 5.85 },
  outside: { day: 7.8, night: 11.7 },
} as const;

const roundPrice = (value: number, step = 10) => Math.round(value / step) * step;
const formatDistance = (value: number) => Math.round(value * 10) / 10;
const normalizeSuggestionQuery = (value: string) => value.trim().replace(/hitlon/gi, 'hilton');
const estimateInsideRatio = (
  start: { lat: number; lon: number },
  end: { lat: number; lon: number },
  isInside: (point: { lat: number; lon: number }) => boolean,
  steps = 30,
) => {
  if (steps <= 0) {
    return isInside(start) ? 1 : 0;
  }
  let insideCount = 0;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const point = {
      lat: start.lat + (end.lat - start.lat) * t,
      lon: start.lon + (end.lon - start.lon) * t,
    };
    if (isInside(point)) {
      insideCount += 1;
    }
  }
  return insideCount / (steps + 1);
};

const getGdanskCityPrice = (distance: number) => {
  if (distance <= 6) return 50;
  if (distance <= 10) return 80;
  if (distance <= 15) return 100;
  if (distance <= 20) return 120;
  if (distance <= 25) return 150;
  return null;
};

const getAirportOutsidePrice = (distance: number, isNight: boolean) => {
  if (distance <= 20) return isNight ? 150 : 120;
  if (distance <= 30) return isNight ? 250 : 200;
  if (distance <= 40) return isNight ? 350 : 300;
  if (distance <= 50) return isNight ? 600 : 400;
  if (distance <= 60) return isNight ? 700 : 500;
  if (distance <= 80) return isNight ? 800 : 600;
  if (distance <= 100) return isNight ? 900 : 700;
  return null;
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

const isPastDate = (value: string) => {
  if (!value) return false;
  return value < getTodayDateString();
};

const isPolishPublicHoliday = (date: Date, apiHolidayKeys: Set<string> | null) => {
  if (apiHolidayKeys && apiHolidayKeys.has(date.toISOString().split('T')[0])) {
    return true;
  }
  const month = date.getMonth();
  const day = date.getDate();
  const fixedHolidays = [
    { month: 0, day: 1 },
    { month: 0, day: 6 },
    { month: 4, day: 1 },
    { month: 4, day: 3 },
    { month: 7, day: 15 },
    { month: 10, day: 1 },
    { month: 10, day: 11 },
    { month: 11, day: 25 },
    { month: 11, day: 26 },
  ];
  return fixedHolidays.some((holiday) => holiday.month === month && holiday.day === day);
};

interface QuoteFormProps {
  onClose: () => void;
  initialVehicleType?: 'standard' | 'bus';
}

export function QuoteForm({ onClose, initialVehicleType = 'standard' }: QuoteFormProps) {
  const { t, locale } = useI18n();
  const emailLocale: Locale = locale === 'pl' ? 'pl' : 'en';
  const basePath = localeToPath(locale);
  const priceInputRef = useRef<HTMLInputElement | null>(null);
  const eurRate = useEurRate();
  const geocodeCache = useRef(new Map<string, { lat: number; lon: number } | null>());
  const routeDistanceCache = useRef(new Map<string, number | null>());
  const [formData, setFormData] = useState({
    pickupAddress: '',
    destinationAddress: '',
    proposedPrice: 'taximeter',
    pickupType: '',
    signService: 'self',
    signText: '',
    flightNumber: '',
    passengers: '1',
    largeLuggage: 'no',
    date: getTodayDateString(),
    time: '',
    name: '',
    phone: '',
    email: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [fixedRoute, setFixedRoute] = useState<{
    vehicleType: 'standard' | 'bus';
    price: number;
    isNight: boolean;
    rateLabel?: string;
    routeLabel: string;
    routeFrom: string;
    routeTo: string;
  } | null>(null);
  const [longRouteInfo, setLongRouteInfo] = useState<{
    distanceKm: number;
    taximeterRate: number;
    taximeterPrice: number;
    proposedPrice: number;
    savingsPercent: number;
  } | null>(null);
  const [fixedRouteChecking, setFixedRouteChecking] = useState(false);
  const [holidayKeys, setHolidayKeys] = useState<Set<string> | null>(null);
  const [holidayYear, setHolidayYear] = useState<number | null>(null);
  const formStartedRef = useRef(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const lastSuggestedPriceRef = useRef<number | null>(null);
  const suggestedContextRef = useRef<string>('');
  const proposedPriceDirtyRef = useRef(false);
  const [pickupSuggestions, setPickupSuggestions] = useState<Array<{ label: string }>>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{ label: string }>>([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState<'pickup' | 'destination' | null>(null);
  const signFee = formData.pickupType === 'airport' && formData.signService === 'sign' ? 20 : 0;
  const isPhoneValid = !validatePhoneNumber(formData.phone, t.quoteForm.validation);
  const isEmailValid = !validateEmail(formData.email, t.quoteForm.validation.email);
  const isPriceValid = showPriceInput ? formData.proposedPrice.trim() !== '' : true;
  const showValidation = submitAttempted;
  const pickupTypeError = showValidation && !formData.pickupType;
  const pickupAddressError = showValidation && formData.pickupType === 'address' && !formData.pickupAddress.trim();
  const destinationError = showValidation && !formData.destinationAddress.trim();
  const signTextError = showValidation && formData.pickupType === 'airport' && formData.signService === 'sign' && !formData.signText.trim();
  const flightNumberError = showValidation && formData.pickupType === 'airport' && !formData.flightNumber.trim();
  const dateError = showValidation && (!formData.date || isPastDate(formData.date));
  const timeError = showValidation && !formData.time;
  const passengersError = showValidation && !formData.passengers;
  const luggageError = showValidation && !formData.largeLuggage;
  const nameError = showValidation && !formData.name.trim();
  const phoneErrorState = showValidation && (!formData.phone.trim() || !isPhoneValid);
  const emailErrorState = showValidation && (!formData.email.trim() || !isEmailValid);
  const priceError = showValidation && !isPriceValid;
  const signServiceTitle = t.quoteForm.signServiceTitle ?? 'Airport pickup options';
  const signServiceSign = t.quoteForm.signServiceSign ?? 'Meet with a name sign';
  const signServiceFee = t.quoteForm.signServiceFee ?? '+20 PLN added to final price';
  const signServiceSelf = t.quoteForm.signServiceSelf ?? 'Find the driver myself at the parking';
  const fixedTotalPrice = fixedRoute ? fixedRoute.price + signFee : null;
  const eurText = fixedTotalPrice ? formatEur(fixedTotalPrice, eurRate) : null;
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

  const getIsNightRate = () => {
    let isNight = false;
    if (formData.time) {
      const [hours, minutes] = formData.time.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + 30;
      const adjustedHours = Math.floor(totalMinutes / 60) % 24;
      isNight = adjustedHours >= 22 || adjustedHours < 6;
    }
    if (formData.date) {
      const date = new Date(`${formData.date}T00:00:00`);
      if (!Number.isNaN(date.getTime()) && isPolishPublicHoliday(date, holidayKeys)) {
        isNight = true;
      }
    }
    return isNight;
  };

  // Auto-fill airport address when airport pickup is selected
  useEffect(() => {
    if (formData.pickupType === 'airport' && !formData.pickupAddress) {
      setFormData(prev => ({
        ...prev,
        pickupAddress: 'Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk',
      }));
    }
  }, [formData.pickupType, formData.pickupAddress]);

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

  useEffect(() => {
    preloadEurRate();
  }, []);

  useEffect(() => {
    if (fixedRoute) {
      setShowPriceInput(false);
    }
  }, [fixedRoute]);

  useEffect(() => {
    if (initialVehicleType === 'bus' && Number(formData.passengers) < 5) {
      setFormData((prev) => ({ ...prev, passengers: '5' }));
    }
  }, [formData.passengers, initialVehicleType]);

  useEffect(() => {
    if (formData.pickupType === 'airport') {
      setPickupSuggestions([]);
      return;
    }
    const query = normalizeSuggestionQuery(formData.pickupAddress);
    if (query.length < 3) {
      setPickupSuggestions([]);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const buildUrl = (bounded: boolean) => {
          const url = new URL('https://nominatim.openstreetmap.org/search');
          url.searchParams.set('format', 'jsonv2');
          url.searchParams.set('limit', '5');
          url.searchParams.set('q', query);
          url.searchParams.set('addressdetails', '1');
          url.searchParams.set('countrycodes', 'pl');
          url.searchParams.set('accept-language', locale === 'pl' ? 'pl' : 'en');
          if (bounded) {
            url.searchParams.set('viewbox', POMORSKIE_VIEWBOX);
            url.searchParams.set('bounded', '1');
          }
          return url;
        };
        const response = await fetch(buildUrl(true).toString(), { signal: controller.signal });
        let data = response.ok ? await response.json() : [];
        if (!active) return;
        const results = Array.isArray(data)
          ? data.map((item) => ({
              label: String(item.display_name ?? ''),
              state: String(item.address?.state ?? ''),
              countryCode: String(item.address?.country_code ?? ''),
            })).filter((item) => item.label)
          : [];
        const isPomorskie = (item: { state: string; label: string; countryCode: string }) =>
          item.countryCode.toLowerCase() === 'pl'
          && (item.state.toLowerCase().includes('pomorsk')
            || item.label.toLowerCase().includes('pomorsk'));
        let pomorskie = results.filter(isPomorskie);
        if (pomorskie.length === 0 && query.length >= 10) {
          const fallbackResponse = await fetch(buildUrl(false).toString(), { signal: controller.signal });
          data = fallbackResponse.ok ? await fallbackResponse.json() : [];
          const fallback = Array.isArray(data)
            ? data.map((item) => ({
                label: String(item.display_name ?? ''),
                state: String(item.address?.state ?? ''),
                countryCode: String(item.address?.country_code ?? ''),
              })).filter((item) => item.label)
            : [];
          pomorskie = fallback.filter(isPomorskie);
          const others = fallback.filter((item) => !isPomorskie(item));
          setPickupSuggestions([...pomorskie, ...others]);
        } else {
          setPickupSuggestions(pomorskie);
        }
      } catch {
        if (!active) return;
        setPickupSuggestions([]);
      }
    }, 350);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [formData.pickupAddress, formData.pickupType, locale]);

  useEffect(() => {
    const query = normalizeSuggestionQuery(formData.destinationAddress);
    if (query.length < 3) {
      setDestinationSuggestions([]);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        const buildUrl = (bounded: boolean) => {
          const url = new URL('https://nominatim.openstreetmap.org/search');
          url.searchParams.set('format', 'jsonv2');
          url.searchParams.set('limit', '5');
          url.searchParams.set('q', query);
          url.searchParams.set('addressdetails', '1');
          url.searchParams.set('countrycodes', 'pl');
          url.searchParams.set('accept-language', locale === 'pl' ? 'pl' : 'en');
          if (bounded) {
            url.searchParams.set('viewbox', POMORSKIE_VIEWBOX);
            url.searchParams.set('bounded', '1');
          }
          return url;
        };
        const response = await fetch(buildUrl(true).toString(), { signal: controller.signal });
        let data = response.ok ? await response.json() : [];
        if (!active) return;
        const results = Array.isArray(data)
          ? data.map((item) => ({
              label: String(item.display_name ?? ''),
              state: String(item.address?.state ?? ''),
              countryCode: String(item.address?.country_code ?? ''),
            })).filter((item) => item.label)
          : [];
        const isPomorskie = (item: { state: string; label: string; countryCode: string }) =>
          item.countryCode.toLowerCase() === 'pl'
          && (item.state.toLowerCase().includes('pomorsk')
            || item.label.toLowerCase().includes('pomorsk'));
        let pomorskie = results.filter(isPomorskie);
        if (pomorskie.length === 0 && query.length >= 10) {
          const fallbackResponse = await fetch(buildUrl(false).toString(), { signal: controller.signal });
          data = fallbackResponse.ok ? await fallbackResponse.json() : [];
          const fallback = Array.isArray(data)
            ? data.map((item) => ({
                label: String(item.display_name ?? ''),
                state: String(item.address?.state ?? ''),
                countryCode: String(item.address?.country_code ?? ''),
              })).filter((item) => item.label)
            : [];
          pomorskie = fallback.filter(isPomorskie);
          const others = fallback.filter((item) => !isPomorskie(item));
          setDestinationSuggestions([...pomorskie, ...others]);
        } else {
          setDestinationSuggestions(pomorskie);
        }
      } catch {
        if (!active) return;
        setDestinationSuggestions([]);
      }
    }, 350);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [formData.destinationAddress, locale]);

  useEffect(() => {
    if (!longRouteInfo) {
      lastSuggestedPriceRef.current = null;
      suggestedContextRef.current = '';
      proposedPriceDirtyRef.current = false;
      return;
    }

    const nextContext = `${formData.pickupType}|${formData.pickupAddress}|${formData.destinationAddress}|${formData.passengers}`;
    if (suggestedContextRef.current !== nextContext) {
      proposedPriceDirtyRef.current = false;
      suggestedContextRef.current = nextContext;
    }

    setShowPriceInput(true);
    if (!proposedPriceDirtyRef.current) {
      setFormData((prev) => ({
        ...prev,
        proposedPrice: String(longRouteInfo.proposedPrice),
      }));
    }
    lastSuggestedPriceRef.current = longRouteInfo.proposedPrice;
  }, [longRouteInfo]);

  useEffect(() => {
    const pickupReady =
      formData.pickupType === 'airport' || formData.pickupAddress.trim().length >= 3;
    const destinationReady = formData.destinationAddress.trim().length >= 3;

    if (!formData.pickupType || !pickupReady || !destinationReady) {
      setFixedRoute(null);
      setLongRouteInfo(null);
      setFixedRouteChecking(false);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setFixedRouteChecking(true);

      const normalize = (value: string) => value.trim().toLowerCase();
      const geocodeAddress = async (value: string) => {
        const key = normalize(value);
        if (!key) return null;
        if (geocodeCache.current.has(key)) {
          return geocodeCache.current.get(key) ?? null;
        }
        const url = new URL('https://nominatim.openstreetmap.org/search');
        url.searchParams.set('format', 'jsonv2');
        url.searchParams.set('limit', '1');
        url.searchParams.set('q', value);
        const response = await fetch(url.toString(), { signal: controller.signal });
        if (!response.ok) {
          geocodeCache.current.set(key, null);
          return null;
        }
        const data = await response.json();
        if (!Array.isArray(data) || !data[0]?.lat || !data[0]?.lon) {
          geocodeCache.current.set(key, null);
          return null;
        }
        const point = { lat: Number(data[0].lat), lon: Number(data[0].lon) };
        if (!Number.isFinite(point.lat) || !Number.isFinite(point.lon)) {
          geocodeCache.current.set(key, null);
          return null;
        }
        geocodeCache.current.set(key, point);
        return point;
      };

      const getRouteDistanceKm = async (
        from: { lat: number; lon: number },
        to: { lat: number; lon: number },
      ) => {
        const key = `${from.lat.toFixed(5)},${from.lon.toFixed(5)}|${to.lat.toFixed(5)},${to.lon.toFixed(5)}`;
        if (routeDistanceCache.current.has(key)) {
          return routeDistanceCache.current.get(key);
        }
        const url = new URL('https://router.project-osrm.org/route/v1/driving');
        url.pathname += `/${from.lon},${from.lat};${to.lon},${to.lat}`;
        url.searchParams.set('overview', 'false');
        url.searchParams.set('alternatives', 'false');
        url.searchParams.set('steps', 'false');
        const response = await fetch(url.toString(), { signal: controller.signal });
        if (!response.ok) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const data = await response.json().catch(() => null);
        const meters = data?.routes?.[0]?.distance;
        if (typeof meters !== 'number' || !Number.isFinite(meters)) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const km = meters / 1000;
        routeDistanceCache.current.set(key, km);
        return km;
      };

      const isAirportPoint = (point: { lat: number; lon: number }) =>
        distanceKm(point, AIRPORT_COORD) <= AIRPORT_RADIUS_KM;

      const getCenterKey = (point: { lat: number; lon: number }) => {
        const entries = Object.entries(centerPolygons) as Array<[FixedCityKey, typeof centerPolygons.gdansk]>;
        for (const [key, shape] of entries) {
          if (isPointInsideGeoJson(point, shape)) {
            return key;
          }
        }
        return null;
      };

      try {
        const pickup =
          formData.pickupType === 'airport'
            ? AIRPORT_COORD
            : await geocodeAddress(formData.pickupAddress);
        const destination = await geocodeAddress(formData.destinationAddress);

        if (!pickup || !destination) {
          if (!active) return;
          setFixedRoute(null);
          setLongRouteInfo(null);
          setFixedRouteChecking(false);
          return;
        }

        const pickupIsAirport = isAirportPoint(pickup);
        const destinationIsAirport = isAirportPoint(destination);
        const isAirportRoute = pickupIsAirport || destinationIsAirport;
        const otherPoint = pickupIsAirport ? destination : destinationIsAirport ? pickup : null;
        const passengersNumber = Number(formData.passengers);
        const vehicleType = passengersNumber >= 5 ? 'bus' : 'standard';
        const busMultiplier = vehicleType === 'bus' ? 1.5 : 1;
        const isNight = getIsNightRate();
        const routedDistance = await getRouteDistanceKm(pickup, destination);
        const straightDistance = distanceKm(pickup, destination);
        const distance = straightDistance <= SHORT_ROUTE_STRAIGHT_KM
          ? straightDistance
          : (routedDistance ?? straightDistance);
        const pickupInGdansk = isPointInsideGeoJson(pickup, cityPolygons.gdansk);
        const destinationInGdansk = isPointInsideGeoJson(destination, cityPolygons.gdansk);
        const gdanskCenterPickup = getCenterKey(pickup) === 'gdansk';
        const gdanskCenterDestination = getCenterKey(destination) === 'gdansk';

        if (!active) return;

        if (isAirportRoute && otherPoint) {
          const cityKey = getCenterKey(otherPoint);
          if (cityKey) {
            const price = isNight
              ? FIXED_PRICES[vehicleType][cityKey].night
              : FIXED_PRICES[vehicleType][cityKey].day;
            const cityLabel =
              cityKey === 'gdansk'
                ? t.pricing.routes.gdansk
                : cityKey === 'gdynia'
                  ? t.pricing.routes.gdynia
                  : 'Sopot';
            const routeLabel = `${t.pricing.routes.airport} ↔ ${cityLabel}`;
            const routeFrom = pickupIsAirport ? t.pricing.routes.airport : cityLabel;
            const routeTo = pickupIsAirport ? cityLabel : t.pricing.routes.airport;

            setFixedRoute({
              vehicleType,
              price,
              isNight,
              routeLabel,
              routeFrom,
              routeTo,
            });
            setLongRouteInfo(null);
            setFixedRouteChecking(false);
            return;
          }
        }

        if (isAirportRoute && otherPoint && isPointInsideGeoJson(otherPoint, cityPolygons.gdansk) && getCenterKey(otherPoint) !== 'gdansk') {
          const gdanskAirportPrice = getGdanskCityPrice(distance);
          if (gdanskAirportPrice) {
            const routeLabel = t.quoteForm.fixedRouteDistance(formatDistance(distance));
            setFixedRoute({
              vehicleType,
              price: Math.round(gdanskAirportPrice * busMultiplier),
              isNight: false,
              rateLabel: t.quoteForm.fixedRouteAllDay,
              routeLabel,
              routeFrom: pickupIsAirport ? t.pricing.routes.airport : formData.pickupAddress,
              routeTo: pickupIsAirport ? formData.destinationAddress : t.pricing.routes.airport,
            });
            setLongRouteInfo(null);
            setFixedRouteChecking(false);
            return;
          }
        }

        const gdanskFixedPrice =
          !isAirportRoute &&
          pickupInGdansk &&
          destinationInGdansk &&
          !gdanskCenterPickup &&
          !gdanskCenterDestination
            ? getGdanskCityPrice(distance)
            : null;

        if (gdanskFixedPrice) {
          const routeLabel = t.quoteForm.fixedRouteDistance(formatDistance(distance));
          setFixedRoute({
            vehicleType,
            price: Math.round(gdanskFixedPrice * busMultiplier),
            isNight: false,
            rateLabel: t.quoteForm.fixedRouteAllDay,
            routeLabel,
            routeFrom: formData.pickupAddress,
            routeTo: formData.destinationAddress,
          });
          setLongRouteInfo(null);
          setFixedRouteChecking(false);
          return;
        }

        if (isAirportRoute && otherPoint && !isPointInsideGeoJson(otherPoint, cityPolygons.gdansk)) {
          const airportOutsidePrice = getAirportOutsidePrice(distance, isNight);
          if (airportOutsidePrice) {
            const routeLabel = t.quoteForm.fixedRouteDistance(formatDistance(distance));
            setFixedRoute({
              vehicleType,
              price: Math.round(airportOutsidePrice * busMultiplier),
              isNight,
              routeLabel,
              routeFrom: pickupIsAirport ? t.pricing.routes.airport : formData.pickupAddress,
              routeTo: pickupIsAirport ? formData.destinationAddress : t.pricing.routes.airport,
            });
            setLongRouteInfo(null);
            setFixedRouteChecking(false);
            return;
          }
        }

        if (distance > 100) {
          const gdanskRate = isNight ? TAXIMETER_RATES.gdansk.night : TAXIMETER_RATES.gdansk.day;
          const outsideRate = isNight ? TAXIMETER_RATES.outside.night : TAXIMETER_RATES.outside.day;
          const insideRatio = estimateInsideRatio(
            pickup,
            destination,
            (point) => isPointInsideGeoJson(point, cityPolygons.gdansk),
          );
          const gdanskDistance = distance * insideRatio;
          const outsideDistance = Math.max(0, distance - gdanskDistance);
          const taximeterPrice = roundPrice(
            ((gdanskDistance * gdanskRate) + (outsideDistance * outsideRate)) * busMultiplier,
            10,
          );
          const taximeterRate = distance > 0 ? Math.round((taximeterPrice / distance) * 100) / 100 : gdanskRate;
          const proposedPrice = roundPrice(distance * 2 * 3 * busMultiplier, 10);
          const savingsPercent = taximeterPrice > 0
            ? Math.max(0, Math.round((1 - proposedPrice / taximeterPrice) * 100))
            : 0;

          setFixedRoute(null);
          setLongRouteInfo({
            distanceKm: formatDistance(distance),
            taximeterRate,
            taximeterPrice,
            proposedPrice,
            savingsPercent,
          });
          setFixedRouteChecking(false);
          return;
        }

        setFixedRoute(null);
        setLongRouteInfo(null);
        setFixedRouteChecking(false);
      } catch {
        if (!active) return;
        setFixedRoute(null);
        setLongRouteInfo(null);
        setFixedRouteChecking(false);
      }
    }, 700);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [
    formData.pickupType,
    formData.pickupAddress,
    formData.destinationAddress,
    formData.passengers,
    formData.date,
    formData.time,
    t,
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPhoneError(null);
    setEmailError(null);
    setSubmitAttempted(true);
    const missingFieldIds: string[] = [];
    if (!formData.pickupType) {
      missingFieldIds.push('pickupType');
    }
    if (formData.pickupType === 'address' && !formData.pickupAddress.trim()) {
      missingFieldIds.push('pickupAddress');
    }
    if (!formData.destinationAddress.trim()) {
      missingFieldIds.push('destinationAddress');
    }
    if (formData.pickupType === 'airport') {
      if (formData.signService === 'sign' && !formData.signText.trim()) {
        missingFieldIds.push('signText');
      }
      if (!formData.flightNumber.trim()) {
        missingFieldIds.push('flightNumber');
      }
    }
    if (!formData.date) {
      missingFieldIds.push('date');
    }
    if (formData.date && isPastDate(formData.date)) {
      trackFormValidation('quote', 1, 'date');
      trackFormSubmit('quote', 'validation_error');
      setError(t.quoteForm.validation.datePast);
      scrollToField('date');
      return;
    }
    if (!formData.time) {
      missingFieldIds.push('time');
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
    if (!isPriceValid && showPriceInput) {
      missingFieldIds.push('proposedPrice');
    }
    if (missingFieldIds.length > 0) {
      trackFormValidation('quote', missingFieldIds.length, missingFieldIds[0]);
      trackFormSubmit('quote', 'validation_error');
      scrollToField(missingFieldIds[0]);
      return;
    }
    const phoneError = validatePhoneNumber(formData.phone, t.quoteForm.validation);
    if (phoneError) {
      trackFormValidation('quote', 1, 'phone');
      trackFormSubmit('quote', 'validation_error');
      setPhoneError(phoneError);
      setError(phoneError);
      return;
    }
    const emailError = validateEmail(formData.email, t.quoteForm.validation.email);
    if (emailError) {
      trackFormValidation('quote', 1, 'email');
      trackFormSubmit('quote', 'validation_error');
      setEmailError(emailError);
      setError(emailError);
      return;
    }
    setSubmitting(true);

    const apiBaseUrl = getApiBaseUrl();
    const passengersNumber = Number(formData.passengers);
    const carType = passengersNumber >= 5 ? 1 : 2;
    const routeFrom = fixedRoute ? fixedRoute.routeFrom : formData.pickupAddress;
    const routeTo = fixedRoute ? fixedRoute.routeTo : formData.destinationAddress;
    const additionalNotes = buildAdditionalNotes({
      pickupType: formData.pickupType as 'airport' | 'address',
      signService: formData.pickupType === 'airport' ? formData.signService : 'self',
      signFee,
      signText: formData.signText,
      passengers: formData.passengers,
      largeLuggage: formData.largeLuggage,
      route: {
        from: routeFrom,
        to: routeTo,
        type: fixedRoute ? fixedRoute.vehicleType : carType === 1 ? 'bus' : 'standard',
      },
      notes: formData.description.trim(),
    });

    const payload = {
      carType: fixedRoute ? (fixedRoute.vehicleType === 'bus' ? 1 : 2) : carType,
      pickupAddress: formData.pickupAddress,
      proposedPrice: fixedRoute && fixedTotalPrice ? String(fixedTotalPrice) : formData.proposedPrice,
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: formData.pickupType === 'airport' ? formData.flightNumber : 'N/A',
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
        trackFormSubmit('quote', 'error', 'api');
        setError(data?.error ?? t.quoteForm.submitError);
        return;
      }

      setOrderId(data?.id ?? null);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackFormSubmit('quote', 'success');
      trackConversion();
    } catch {
      trackFormSubmit('quote', 'error', 'network');
      setError(t.quoteForm.submitNetworkError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart('quote');
    }
    const { name, value } = e.target;
    const today = getTodayDateString();
    const nowTime = getCurrentTimeString();
    if (name === 'date') {
      const nextDate = value < today ? today : value;
      const nextTime = nextDate === today && formData.time && formData.time < nowTime ? nowTime : formData.time;
      setFormData({
        ...formData,
        date: nextDate,
        time: nextTime,
      });
      return;
    }
    if (name === 'time' && formData.date === today && value < nowTime) {
      setFormData({
        ...formData,
        time: nowTime,
      });
      return;
    }
    const nextValue = value;
    if (name === 'proposedPrice') {
      proposedPriceDirtyRef.current = true;
    }
    
    // Auto-fill airport address when Airport Pickup is selected
    if (name === 'pickupType' && nextValue === 'airport') {
      setFormData({
        ...formData,
        [name]: nextValue,
        pickupAddress: 'Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk',
      });
    } else if (name === 'pickupType' && nextValue === 'address') {
      // Clear pickup address when switching to Address Pickup
      setFormData({
        ...formData,
        [name]: nextValue,
        pickupAddress: '',
        signService: 'self',
        signText: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: nextValue,
      });
    }
  };

  const handleSignServiceChange = (value: 'sign' | 'self') => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart('quote');
    }
    setFormData((prev) => ({
      ...prev,
      signService: value,
      signText: value === 'self' ? '' : prev.signText,
    }));
  };

  const handlePhoneChange = (value: string) => {
    const nextError = validatePhoneNumber(value, t.quoteForm.validation);
    setPhoneError(nextError);
    if (!nextError && error === phoneError) {
      setError(null);
    }
  };

  const handlePhoneBlur = () => {
    const phoneError = validatePhoneNumber(formData.phone, t.quoteForm.validation);
    setPhoneError(phoneError);
  };

  const handleEmailChange = (value: string) => {
    const nextError = validateEmail(value, t.quoteForm.validation.email);
    setEmailError(nextError);
    if (!nextError && error === emailError) {
      setError(null);
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-green-900 mb-2">{t.quoteForm.submittedTitle}</h3>
            <p className="text-green-800 mb-4">
              {t.quoteForm.submittedBody}
            </p>
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
                  {t.quoteForm.manageLink}
                </a>
              </div>
            )}
            <button
              onClick={() => {
                trackFormClose('quote');
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-gray-900">{t.quoteForm.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{t.quoteForm.subtitle}</p>
          </div>
          <button 
            onClick={() => {
              trackFormClose('quote');
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
          noValidate
          className="booking-form p-6 space-y-6 overflow-y-auto cursor-default"
          onPointerDownCapture={(event) => {
            if (
              showPriceInput
              && formData.proposedPrice.trim() === ''
              && priceInputRef.current
              && !priceInputRef.current.contains(event.target as Node)
            ) {
              setShowPriceInput(false);
              setFormData(prev => ({ ...prev, proposedPrice: 'taximeter' }));
            }
          }}
        >
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Pickup Type */}
          <div id="pickupType" tabIndex={-1}>
            <label className="block text-gray-700 mb-2">
              {t.quoteForm.pickupType}
            </label>
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
                <span className="text-sm leading-snug">{t.quoteForm.airportPickup}</span>
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
                <span className="text-sm leading-snug">{t.quoteForm.addressPickup}</span>
              </label>
            </div>
          </div>

          {!formData.pickupType ? (
            <div className="rounded-xl bg-slate-900/85 px-6 py-10 text-center text-white shadow-inner">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <Lock className="h-4 w-4" />
                {t.quoteForm.lockMessage}
              </div>
            </div>
          ) : (
            <>
              {/* Pickup Address */}
              <div>
                <label htmlFor="pickupAddress" className="block text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t.quoteForm.pickupAddress}
                </label>
                <textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  onFocus={() => setActiveSuggestionField('pickup')}
                  onBlur={() => setActiveSuggestionField(null)}
                  placeholder={t.quoteForm.pickupPlaceholder}
                  rows={2}
                  className={fieldClass(
                    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed',
                    pickupAddressError,
                  )}
                  disabled={formData.pickupType === 'airport'}
                  required
                />
                {activeSuggestionField === 'pickup' && pickupSuggestions.length > 0 && formData.pickupType !== 'airport' && (
                  <ul className="mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm">
                    {pickupSuggestions.map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setFormData(prev => ({ ...prev, pickupAddress: item.label }));
                            setPickupSuggestions([]);
                            setActiveSuggestionField(null);
                          }}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {formData.pickupType === 'airport' && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    {t.quoteForm.pickupAutoNote}
                  </p>
                )}
              </div>

              {/* Destination Address */}
              <div>
                <label htmlFor="destinationAddress" className="block text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t.quoteForm.destinationAddress}
                </label>
                <textarea
                  id="destinationAddress"
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleChange}
                  onFocus={() => setActiveSuggestionField('destination')}
                  onBlur={() => setActiveSuggestionField(null)}
                  placeholder={t.quoteForm.destinationPlaceholder}
                  rows={2}
                  className={fieldClass(
                    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    destinationError,
                  )}
                  required
                />
                {activeSuggestionField === 'destination' && destinationSuggestions.length > 0 && (
                  <ul className="mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm">
                    {destinationSuggestions.map((item, index) => (
                      <li key={`${item.label}-${index}`}>
                        <button
                          type="button"
                          className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                          onMouseDown={(event) => {
                            event.preventDefault();
                            setFormData(prev => ({ ...prev, destinationAddress: item.label }));
                            setDestinationSuggestions([]);
                            setActiveSuggestionField(null);
                          }}
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-sm text-slate-600 mt-2 flex items-center gap-2">
                  <Info className="w-4 h-4 text-slate-400" />
                  {t.quoteForm.autoPriceNote}
                </p>
              </div>

              {fixedRouteChecking && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4 text-sm text-blue-700 flex items-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-300 border-t-blue-700" />
                  <span className="font-medium">{t.quoteForm.fixedRouteChecking}</span>
                </div>
              )}

              {fixedRoute && (
                <div className="rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-amber-100 px-6 pt-20 pb-20 mt-4">
                  <div className="text-xs uppercase tracking-wide text-amber-700 mb-2">{t.quoteForm.fixedRouteTitle}</div>
                  <div className="mt-2 text-sm text-gray-700">{fixedRoute.routeLabel}</div>
                  <div className="mt-2 flex flex-col items-start gap-1">
                    <span className="text-base font-semibold text-amber-900">
                      {t.quoteForm.fixedRouteComputed(fixedTotalPrice ?? fixedRoute.price)}
                    </span>
                    {eurText && (
                      <span className="inline-flex items-center gap-2 text-[11px] text-amber-700">
                        <span>{eurText}</span>
                        <span className="live-badge">{t.common.actualBadge}</span>
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {fixedRoute.rateLabel ?? (fixedRoute.isNight ? t.quoteForm.fixedRouteNight : t.quoteForm.fixedRouteDay)}
                  </div>
                </div>
              )}

              {!fixedRoute && longRouteInfo && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-6 mt-4">
                  <div className="text-xs uppercase tracking-wide text-slate-600 mb-2">
                    {t.quoteForm.longRouteTitle}
                  </div>
                  <div className="text-sm text-slate-700">
                    {t.quoteForm.longRouteDistance(longRouteInfo.distanceKm)}
                  </div>
                  <div className="mt-3 space-y-1 text-sm text-slate-700">
                    <div>
                      {t.quoteForm.longRouteTaximeter(longRouteInfo.taximeterPrice, longRouteInfo.taximeterRate)}
                    </div>
                    <div>
                      {t.quoteForm.longRouteProposed(longRouteInfo.proposedPrice)}
                    </div>
                    <div>
                      {t.quoteForm.longRouteSavings(longRouteInfo.savingsPercent)}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600">{t.quoteForm.longRouteNote}</div>
                </div>
              )}

              {/* Proposed Price */}
              {!fixedRoute && (
                <div>
                  <label htmlFor="proposedPrice" className="block text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    {t.quoteForm.price}
                  </label>
                  {!showPriceInput ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (!formStartedRef.current) {
                          formStartedRef.current = true;
                          trackFormStart('quote');
                        }
                        setShowPriceInput(true);
                        setFormData(prev => ({ ...prev, proposedPrice: '' }));
                      }}
                      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-left text-slate-800 shadow-sm hover:border-blue-500 hover:bg-blue-50/40 transition-colors"
                    >
                      <span className="block text-sm font-semibold text-slate-900">
                        {t.quoteForm.taximeterTitle}
                      </span>
                      <span className="mt-3 block text-xs font-semibold text-blue-700">
                        {t.quoteForm.fixedPriceHint}
                      </span>
                    </button>
                  ) : (
                    <>
                      <input
                        type="number"
                        id="proposedPrice"
                        name="proposedPrice"
                        value={formData.proposedPrice}
                        ref={priceInputRef}
                        onChange={(e) => {
                          handleChange(e);
                          handlePhoneChange(e.target.value);
                        }}
                        onBlur={(event) => {
                          if (event.currentTarget.value.trim() === '') {
                            setShowPriceInput(false);
                            setFormData(prev => ({ ...prev, proposedPrice: 'taximeter' }));
                          }
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape' && formData.proposedPrice.trim() === '') {
                            setShowPriceInput(false);
                            setFormData(prev => ({ ...prev, proposedPrice: 'taximeter' }));
                          }
                        }}
                        placeholder={t.quoteForm.pricePlaceholder}
                        min="0"
                        step="10"
                        className={fieldClass(
                          'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                          priceError,
                        )}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        {t.quoteForm.priceHelp}
                      </p>
                    </>
                  )}
                </div>
              )}

              {/* Date and Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {t.quoteForm.date}
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
                    {t.quoteForm.pickupTime}
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    min={formData.date === getTodayDateString() ? getCurrentTimeString() : undefined}
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
                          <div className="text-xs text-gray-500">{t.quoteForm.signServiceSelfNote}</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.signService === 'sign' && (
                    <div>
                      <label htmlFor="signText" className="block text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-2" />
                        {t.quoteForm.signText}
                      </label>
                      <input
                        type="text"
                        id="signText"
                        name="signText"
                        value={formData.signText}
                        onChange={handleChange}
                        placeholder={t.quoteForm.signPlaceholder}
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
                            {t.quoteForm.signHelp}
                          </p>
                        </div>
                        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
                          <p className="text-xs text-gray-500 mb-2 text-center">{t.quoteForm.signPreview}</p>
                          <div className="bg-white border-4 border-blue-900 rounded p-3 text-center min-h-[60px] flex items-center justify-center">
                            <p className="text-blue-900 text-lg break-words">
                              {formData.signText || t.quoteForm.signEmpty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="flightNumber" className="block text-gray-700 mb-2">
                      <Plane className="w-4 h-4 inline mr-2" />
                      {t.quoteForm.flightNumber}
                    </label>
                    <input
                      type="text"
                      id="flightNumber"
                      name="flightNumber"
                      value={formData.flightNumber}
                      onChange={handleChange}
                      placeholder={t.quoteForm.flightPlaceholder}
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        flightNumberError,
                      )}
                      required
                    />
                  </div>
                </>
              )}

              {/* Passengers and Luggage */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="passengers" className="block text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    {t.quoteForm.passengers}
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
                    {(initialVehicleType === 'bus'
                      ? t.orderForm.passengersBus
                      : t.quoteForm.passengersOptions
                    ).map((label, index) => (
                      <option key={label} value={initialVehicleType === 'bus' ? index + 5 : index + 1}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="largeLuggage" className="block text-gray-700 mb-2">
                    <Luggage className="w-4 h-4 inline mr-2" />
                    {t.quoteForm.largeLuggage}
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
                    <option value="no">{t.quoteForm.luggageNo}</option>
                    <option value="yes">{t.quoteForm.luggageYes}</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h4 className="text-gray-900 mb-4">{t.quoteForm.contactTitle}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      {t.quoteForm.fullName}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.quoteForm.namePlaceholder}
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        nameError,
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      {t.quoteForm.phoneNumber}
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
                      {t.quoteForm.email}
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
                      placeholder={t.quoteForm.emailPlaceholder}
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
                      {t.quoteForm.emailHelp}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      {t.quoteForm.notesTitle}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={t.quoteForm.notesPlaceholder}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.quoteForm.notesHelp}
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
                  t.quoteForm.submitting
                ) : fixedRoute && fixedTotalPrice ? (
                  <span className="flex flex-col items-center gap-1">
                    <span>{t.orderForm.confirmOrder(fixedTotalPrice)}</span>
                    {eurText && (
                      <span className="inline-flex items-center gap-2 text-[11px] text-blue-100">
                        <span>{eurText}</span>
                        <span className="live-badge">{t.common.actualBadge}</span>
                      </span>
                    )}
                  </span>
                ) : longRouteInfo ? (
                  <span className="flex flex-col items-center gap-1">
                    <span>{t.orderForm.confirmOrder(longRouteInfo.proposedPrice)}</span>
                    {formatEur(longRouteInfo.proposedPrice, eurRate) && (
                      <span className="inline-flex items-center gap-2 text-[11px] text-blue-100">
                        <span>{formatEur(longRouteInfo.proposedPrice, eurRate)}</span>
                        <span className="live-badge">{t.common.actualBadge}</span>
                      </span>
                    )}
                  </span>
                ) : (
                  t.quoteForm.submit
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
