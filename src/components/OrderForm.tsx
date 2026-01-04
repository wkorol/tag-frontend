import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { useEurRate } from '../lib/useEurRate';
import { formatEur } from '../lib/currency';
import { buildAdditionalNotes } from '../lib/orderNotes';
import { hasMarketingConsent } from '../lib/consent';
import { getApiBaseUrl } from '../lib/api';

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
  const [formData, setFormData] = useState({
    pickupType: 'airport',
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

  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(route.priceDay);
  const [rateContext, setRateContext] = useState({
    label: 'Day rate',
    reason: 'standard day rate',
    price: route.priceDay,
  });
  const [rateBanner, setRateBanner] = useState<string | null>(null);
  const lastRatePriceRef = useRef<number | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);
  const [holidayKeys, setHolidayKeys] = useState<Set<string> | null>(null);
  const [holidayYear, setHolidayYear] = useState<number | null>(null);
  const eurRate = useEurRate();
  const eurText = formatEur(currentPrice, eurRate);

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
        reasons.push('pickup after 21:30 or before 5:30');
      }
      isNight = isNight || isNightTime;
    }

    if (formData.date) {
      const date = new Date(`${formData.date}T00:00:00`);
      if (!Number.isNaN(date.getTime()) && isPolishPublicHoliday(date, holidayKeys)) {
        reasons.push('Sunday/public holiday');
        isNight = true;
      }
    }

    const price = isNight ? route.priceNight : route.priceDay;
    setCurrentPrice(price);
    setRateContext({
      label: isNight ? 'Night rate' : 'Day rate',
      reason: reasons.length ? reasons.join(' + ') : 'standard day rate',
      price,
    });
  }, [formData.time, formData.date, holidayKeys, route.priceDay, route.priceNight]);

  useEffect(() => {
    if (!formData.time && !formData.date) {
      return;
    }
    if (lastRatePriceRef.current === null) {
      lastRatePriceRef.current = rateContext.price;
      showRateBanner(`Applied ${rateContext.label}: ${rateContext.price} PLN (${rateContext.reason}).`);
      return;
    }
    if (lastRatePriceRef.current !== rateContext.price) {
      lastRatePriceRef.current = rateContext.price;
      showRateBanner(`Applied ${rateContext.label}: ${rateContext.price} PLN (${rateContext.reason}).`);
    }
  }, [rateContext.price, formData.time, formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const apiBaseUrl = getApiBaseUrl();
    const additionalNotes = buildAdditionalNotes({
      pickupType: formData.pickupType as 'airport' | 'address',
      signText: formData.signText,
      passengers: formData.passengers,
      largeLuggage: formData.largeLuggage,
      route: {
        from: route.from,
        to: route.to,
        type: route.type,
      },
      notes: formData.description.trim(),
    });

    const payload = {
      carType: route.type === 'bus' ? 1 : 2,
      pickupAddress: formData.pickupType === 'address' ? formData.address : route.from,
      proposedPrice: String(currentPrice),
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: formData.pickupType === 'airport' ? formData.flightNumber : 'N/A',
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      additionalNotes,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? 'Failed to submit order. Please try again.');
        return;
      }

      setOrderId(data?.id ?? null);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackConversion();
    } catch (submitError) {
      setError('Network error while submitting the order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
            <h3 className="text-green-900 mb-2">Order received</h3>
            <p className="text-green-800 mb-4">
              Thanks! Your request is in the queue. Please wait for acceptance – it usually takes 5–10 minutes.
              You will receive a confirmation email shortly.
            </p>
            <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm">Awaiting confirmation...</span>
            </div>
            <div className="bg-white rounded-lg p-4 mb-2">
              <p className="text-gray-700">
                Total Price: <span className="font-bold text-blue-600">{currentPrice} PLN</span>
              </p>
              {eurText && (
                <div className="mt-1 flex items-center justify-center gap-2 text-gray-500">
                  <span className="eur-text">{eurText}</span>
                  <span className="live-badge">
                    ACTUAL
                  </span>
                </div>
              )}
            </div>
            {renderRateBanner()}
            {orderId && (
              <div className="bg-white rounded-lg p-4 mb-4">
                {generatedId && (
                  <p className="text-gray-700">Order #: <span className="font-semibold">{generatedId}</span></p>
                )}
                <p className="text-gray-700">Order ID: <span className="font-semibold">{orderId}</span></p>
                <a
                  href={`/?orderId=${orderId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Manage or edit your order
                </a>
              </div>
            )}
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
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
            <h3 className="text-gray-900">Order Transfer</h3>
            <p className="text-gray-600 text-sm mt-1">{route.from} → {route.to}</p>
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

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Price Display */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Price:</span>
              <div className="text-right">
                <span className="text-blue-900 text-2xl">{currentPrice} PLN</span>
                {eurText && (
                  <div className="flex items-center justify-end gap-2 text-gray-500">
                    <span className="eur-text">{eurText}</span>
                    <span className="live-badge">
                      ACTUAL
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
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="time" className="block text-gray-700 mb-2">
                Pickup Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Pickup Type */}
          <div>
            <label className="block text-gray-700 mb-2">
              Pickup Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.pickupType === 'airport' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
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
                <span>Airport Pickup</span>
              </label>
              
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.pickupType === 'address' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
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
                <span>Address Pickup</span>
              </label>
            </div>
          </div>

          {/* Airport Pickup Fields */}
          {formData.pickupType === 'airport' && (
            <>
              <div>
                <label htmlFor="signText" className="block text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Name Sign Text
                </label>
                <input
                  type="text"
                  id="signText"
                  name="signText"
                  value={formData.signText}
                  onChange={handleChange}
                  placeholder="Text to display on the pickup sign"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900">
                      The driver will be waiting for you with a sign displaying this text until you exit the arrivals hall
                    </p>
                  </div>
                  {/* Visual Sign Preview */}
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
                    <p className="text-[8px] text-gray-500 mb-2 text-center">Sign Preview:</p>
                    <div className="bg-white border-4 border-blue-900 rounded p-3 text-center min-h-[60px] flex items-center justify-center">
                      <p className="text-blue-900 text-lg break-words">
                        {formData.signText || 'Your name will appear here'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="flightNumber" className="block text-gray-700 mb-2">
                  <Plane className="w-4 h-4 inline mr-2" />
                  Flight Number
                </label>
                <input
                  type="text"
                  id="flightNumber"
                  name="flightNumber"
                  value={formData.flightNumber}
                  onChange={handleChange}
                  placeholder="e.g. LO123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                Pickup Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full pickup address"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          {/* Passengers and Luggage */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="passengers" className="block text-gray-700 mb-2">
                <Users className="w-4 h-4 inline mr-2" />
                Number of Passengers
              </label>
              <select
                id="passengers"
                name="passengers"
                value={formData.passengers}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                {route.type === 'bus' ? (
                  <>
                    <option value="5">5 people</option>
                    <option value="6">6 people</option>
                    <option value="7">7 people</option>
                    <option value="8">8 people</option>
                  </>
                ) : (
                  <>
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                  </>
                )}
              </select>
            </div>

            <div>
              <label htmlFor="largeLuggage" className="block text-gray-700 mb-2">
                <Luggage className="w-4 h-4 inline mr-2" />
                Large Luggage
              </label>
              <select
                id="largeLuggage"
                name="largeLuggage"
                value={formData.largeLuggage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t pt-6">
            <h4 className="text-gray-900 mb-4">Contact Information</h4>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+48 123 456 789"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  You'll receive a confirmation email with a link to edit or cancel your order
                </p>
              </div>

              <div>
                <label htmlFor="description" className="block text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Any special requests or additional information..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">
                  E.g., child seat required, waiting time, special instructions
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={submitting}
          >
            {submitting ? (
              'Submitting...'
            ) : (
              <span className="flex flex-col items-center gap-1">
                <span>{`Confirm Order - ${currentPrice} PLN`}</span>
                {eurText && (
                  <span className="inline-flex items-center gap-2 text-[11px] text-blue-100">
                    <span>{eurText}</span>
                    <span className="live-badge">
                      ACTUAL
                    </span>
                  </span>
                )}
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
