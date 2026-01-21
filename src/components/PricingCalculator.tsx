import { useEffect, useRef, useState } from 'react';
import { Calculator, MapPin, Navigation } from 'lucide-react';
import { centerPolygons } from '../lib/centerPolygons';
import { cityPolygons } from '../lib/cityPolygons';
import { distanceKm, isPointInsideGeoJson } from '../lib/geo';
import { FIXED_PRICES, FixedCityKey } from '../lib/fixedPricing';
import { formatEur } from '../lib/currency';
import { preloadEurRate, useEurRate } from '../lib/useEurRate';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';

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

type FixedPrice = {
  price: number;
  allDay: boolean;
  routeLabel: string;
};

type FixedPriceByVehicle = {
  day: FixedPrice | null;
  night: FixedPrice | null;
};

type LongPrice = {
  taximeterPrice: number;
  taximeterRate: number;
  proposedPrice: number;
  savingsPercent: number;
};

type LongPriceByVehicle = {
  day: LongPrice;
  night: LongPrice;
};

type CalculatorResult =
  | {
      type: 'fixed';
      distanceKm: number;
      routeLabel: string;
      standard: FixedPriceByVehicle;
      bus: FixedPriceByVehicle;
    }
  | {
      type: 'long';
      distanceKm: number;
      routeLabel: string;
      standard: LongPriceByVehicle;
      bus: LongPriceByVehicle;
    };

export function PricingCalculator() {
  const { t, locale } = useI18n();
  const eurRate = useEurRate();
  const airportAddress = t.pricingCalculator.airportAddress;
  const pricingBookingHref = `${localeToPath(locale)}/${getRouteSlug(locale, 'pricing')}#pricing-booking`;
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupMode, setPickupMode] = useState<'airport' | 'custom'>('custom');
  const [destinationMode, setDestinationMode] = useState<'airport' | 'custom'>('custom');
  const [pickupSuggestions, setPickupSuggestions] = useState<Array<{ label: string }>>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{ label: string }>>([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState<'pickup' | 'destination' | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const geocodeCache = useRef(new Map<string, { lat: number; lon: number } | null>());
  const routeDistanceCache = useRef(new Map<string, number | null>());

  useEffect(() => {
    preloadEurRate();
  }, []);

  useEffect(() => {
    const query = normalizeSuggestionQuery(pickupAddress);
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
  }, [pickupAddress, locale]);

  useEffect(() => {
    const query = normalizeSuggestionQuery(destinationAddress);
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
  }, [destinationAddress, locale]);

  useEffect(() => {
    const pickupReady = pickupAddress.trim().length >= 3;
    const destinationReady = destinationAddress.trim().length >= 3;
    if (!pickupReady || !destinationReady) {
      setResult(null);
      setError(null);
      setIsChecking(false);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsChecking(true);
      setError(null);

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

      const getCityLabel = (cityKey: FixedCityKey) => {
        if (cityKey === 'gdansk') return t.pricing.routes.gdansk;
        if (cityKey === 'gdynia') return t.pricing.routes.gdynia;
        return 'Sopot';
      };

      const computeFixedPrice = (
        vehicleType: 'standard' | 'bus',
        isNight: boolean,
        distance: number,
        pickup: { lat: number; lon: number },
        destination: { lat: number; lon: number },
      ): FixedPrice | null => {
        const pickupIsAirport = isAirportPoint(pickup);
        const destinationIsAirport = isAirportPoint(destination);
        const isAirportRoute = pickupIsAirport || destinationIsAirport;
        const otherPoint = pickupIsAirport ? destination : destinationIsAirport ? pickup : null;
        const busMultiplier = vehicleType === 'bus' ? 1.5 : 1;
        const pickupInGdansk = isPointInsideGeoJson(pickup, cityPolygons.gdansk);
        const destinationInGdansk = isPointInsideGeoJson(destination, cityPolygons.gdansk);
        const gdanskCenterPickup = getCenterKey(pickup) === 'gdansk';
        const gdanskCenterDestination = getCenterKey(destination) === 'gdansk';

        if (isAirportRoute && otherPoint) {
          const cityKey = getCenterKey(otherPoint);
          if (cityKey) {
            const price = isNight
              ? FIXED_PRICES[vehicleType][cityKey].night
              : FIXED_PRICES[vehicleType][cityKey].day;
            const cityLabel = getCityLabel(cityKey);
            return {
              price,
              allDay: false,
              routeLabel: `${t.pricing.routes.airport} ↔ ${cityLabel}`,
            };
          }
        }

        if (isAirportRoute && otherPoint && isPointInsideGeoJson(otherPoint, cityPolygons.gdansk) && getCenterKey(otherPoint) !== 'gdansk') {
          const gdanskAirportPrice = getGdanskCityPrice(distance);
          if (gdanskAirportPrice) {
            return {
              price: Math.round(gdanskAirportPrice * busMultiplier),
              allDay: true,
              routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance)),
            };
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
          return {
            price: Math.round(gdanskFixedPrice * busMultiplier),
            allDay: true,
            routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance)),
          };
        }

        if (isAirportRoute && otherPoint && !isPointInsideGeoJson(otherPoint, cityPolygons.gdansk)) {
          const airportOutsidePrice = getAirportOutsidePrice(distance, isNight);
          if (airportOutsidePrice) {
            return {
              price: Math.round(airportOutsidePrice * busMultiplier),
              allDay: false,
              routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance)),
            };
          }
        }

        return null;
      };

      try {
        const pickup = pickupMode === 'airport' ? AIRPORT_COORD : await geocodeAddress(pickupAddress);
        const destination = destinationMode === 'airport' ? AIRPORT_COORD : await geocodeAddress(destinationAddress);

        if (!pickup || !destination) {
          if (!active) return;
          setResult(null);
          setError(t.pricingCalculator.noResult);
          setIsChecking(false);
          return;
        }

        const routedDistance = await getRouteDistanceKm(pickup, destination);
        const straightDistance = distanceKm(pickup, destination);
        const distance = straightDistance <= SHORT_ROUTE_STRAIGHT_KM
          ? straightDistance
          : (routedDistance ?? straightDistance);
        const distanceRounded = formatDistance(distance);

        const standardDay = computeFixedPrice('standard', false, distance, pickup, destination);
        const standardNight = computeFixedPrice('standard', true, distance, pickup, destination);
        const busDay = computeFixedPrice('bus', false, distance, pickup, destination);
        const busNight = computeFixedPrice('bus', true, distance, pickup, destination);

        if (standardDay && busDay && standardNight && busNight) {
          setResult({
            type: 'fixed',
            distanceKm: distanceRounded,
            routeLabel: standardDay.routeLabel,
            standard: { day: standardDay, night: standardNight },
            bus: { day: busDay, night: busNight },
          });
          setError(null);
          setIsChecking(false);
          return;
        }

        const insideRatio = estimateInsideRatio(
          pickup,
          destination,
          (point) => isPointInsideGeoJson(point, cityPolygons.gdansk),
        );

        const computeLong = (vehicleType: 'standard' | 'bus', isNight: boolean): LongPrice => {
          const busMultiplier = vehicleType === 'bus' ? 1.5 : 1;
          const gdanskRate = isNight ? TAXIMETER_RATES.gdansk.night : TAXIMETER_RATES.gdansk.day;
          const outsideRate = isNight ? TAXIMETER_RATES.outside.night : TAXIMETER_RATES.outside.day;
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
          return {
            taximeterPrice,
            taximeterRate,
            proposedPrice,
            savingsPercent,
          };
        };

        setResult({
          type: 'long',
          distanceKm: distanceRounded,
          routeLabel: `${pickupAddress} → ${destinationAddress}`,
          standard: {
            day: computeLong('standard', false),
            night: computeLong('standard', true),
          },
          bus: {
            day: computeLong('bus', false),
            night: computeLong('bus', true),
          },
        });
        setError(null);
        setIsChecking(false);
        return;
      } catch (err) {
        if (!active) return;
        if (controller.signal.aborted) return;
        setResult(null);
        setError(t.pricingCalculator.noResult);
        setIsChecking(false);
      }
    }, 600);

    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [pickupAddress, destinationAddress, t]);

  const renderPrice = (value: number) => {
    const eur = formatEur(value, eurRate);
    return (
      <div className="min-w-[96px] text-right leading-tight">
        <div className="text-lg font-semibold text-gray-900">{value} PLN</div>
        <div className="min-h-[16px] text-xs text-gray-500">{eur ?? ''}</div>
      </div>
    );
  };

  const renderFixedCard = (
    label: string,
    day: FixedPrice,
    night: FixedPrice,
  ) => {
    const allDay = day.allDay || day.price === night.price;
    return (
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="mt-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
            <span className="text-sm text-gray-600">
              {allDay ? t.pricingCalculator.fixedAllDay : t.pricingCalculator.dayRate}
            </span>
            {renderPrice(day.price)}
          </div>
          {!allDay && (
            <div className="flex items-start justify-between gap-4">
              <span className="text-sm text-gray-600">{t.pricingCalculator.nightRate}</span>
              {renderPrice(night.price)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderLongCard = (
    label: string,
    day: LongPrice,
    night: LongPrice,
  ) => (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600">{t.pricingCalculator.taximeterLabel}</div>
            <div className="text-xs text-gray-400">
              {t.pricingCalculator.dayRate}: {day.taximeterRate} PLN/km
            </div>
            <div className="text-xs text-gray-400">
              {t.pricingCalculator.nightRate}: {night.taximeterRate} PLN/km
            </div>
          </div>
          <div className="min-w-[140px] text-right">
            <div className="text-sm text-gray-600">{t.pricingCalculator.dayRate}</div>
            {renderPrice(day.taximeterPrice)}
            <div className="mt-2 text-sm text-gray-600">{t.pricingCalculator.nightRate}</div>
            {renderPrice(night.taximeterPrice)}
          </div>
        </div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600">{t.pricingCalculator.proposedLabel}</div>
            <div className="text-xs text-emerald-600">
              {t.pricingCalculator.savingsLabel}: {day.savingsPercent}% / {night.savingsPercent}%
            </div>
          </div>
          {renderPrice(day.proposedPrice)}
        </div>
      </div>
    </div>
  );

  return (
    <section id="pricing-calculator" className="py-12 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <Calculator className="h-3.5 w-3.5" />
                {t.pricingCalculator.title}
              </div>
              <h2 className="text-2xl text-gray-900 mt-4">{t.pricingCalculator.title}</h2>
              <p className="text-gray-600 mt-2">{t.pricingCalculator.subtitle}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm text-gray-600">{t.pricingCalculator.pickupLabel}</span>
              {destinationMode !== 'airport' && (
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="pickup-mode"
                      value="airport"
                      checked={pickupMode === 'airport'}
                      onChange={() => {
                        setPickupMode('airport');
                        setPickupAddress(airportAddress);
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    {t.pricingCalculator.airportLabel}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="pickup-mode"
                      value="custom"
                      checked={pickupMode === 'custom'}
                      onChange={() => {
                        setPickupMode('custom');
                        setPickupAddress('');
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    {t.pricingCalculator.pickupCustomLabel}
                  </label>
                </div>
              )}
              <div
                className={`mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus-within:border-blue-500 ${
                  pickupMode === 'airport' ? 'bg-slate-100' : 'bg-white'
                }`}
              >
                <MapPin className="h-4 w-4 text-blue-600" />
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(event) => setPickupAddress(event.target.value)}
                  onFocus={() => setActiveSuggestionField('pickup')}
                  onBlur={() => setActiveSuggestionField(null)}
                  placeholder={t.pricingCalculator.pickupPlaceholder}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
                  disabled={pickupMode === 'airport'}
                />
              </div>
              {activeSuggestionField === 'pickup' && pickupSuggestions.length > 0 && (
                <ul className="mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm">
                  {pickupSuggestions.map((item, index) => (
                    <li key={`${item.label}-${index}`}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setPickupAddress(item.label);
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
            </label>
            <label className="block">
              <span className="text-sm text-gray-600">{t.pricingCalculator.destinationLabel}</span>
              {pickupMode !== 'airport' && (
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-700">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="destination-mode"
                      value="airport"
                      checked={destinationMode === 'airport'}
                      onChange={() => {
                        setDestinationMode('airport');
                        setDestinationAddress(airportAddress);
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    {t.pricingCalculator.airportLabel}
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="destination-mode"
                      value="custom"
                      checked={destinationMode === 'custom'}
                      onChange={() => {
                        setDestinationMode('custom');
                        setDestinationAddress('');
                      }}
                      className="h-4 w-4 text-blue-600"
                    />
                    {t.pricingCalculator.destinationCustomLabel}
                  </label>
                </div>
              )}
              <div
                className={`mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus-within:border-blue-500 ${
                  destinationMode === 'airport' ? 'bg-slate-100' : 'bg-white'
                }`}
              >
                <Navigation className="h-4 w-4 text-blue-600" />
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(event) => setDestinationAddress(event.target.value)}
                  onFocus={() => setActiveSuggestionField('destination')}
                  onBlur={() => setActiveSuggestionField(null)}
                  placeholder={t.pricingCalculator.destinationPlaceholder}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
                  disabled={destinationMode === 'airport'}
                />
              </div>
              {activeSuggestionField === 'destination' && destinationSuggestions.length > 0 && (
                <ul className="mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm">
                  {destinationSuggestions.map((item, index) => (
                    <li key={`${item.label}-${index}`}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setDestinationAddress(item.label);
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
            </label>
          </div>

          {isChecking && (
            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700">
              {t.pricingCalculator.loading}
            </div>
          )}

          {!isChecking && error && (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {error}
            </div>
          )}

          {!isChecking && result && (
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  {t.pricingCalculator.distanceLabel}
                </div>
                <div className="mt-2 text-sm text-gray-700">{result.routeLabel}</div>
                <div className="mt-1 text-lg font-semibold text-gray-900">{result.distanceKm} km</div>
              </div>

              {result.type === 'fixed' ? (
                <div>
                  <div className="text-sm text-gray-600 mb-3">{t.pricingCalculator.resultsTitle}</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {renderFixedCard(t.pricingCalculator.standard, result.standard.day!, result.standard.night!)}
                    {renderFixedCard(t.pricingCalculator.bus, result.bus.day!, result.bus.night!)}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm text-gray-600 mb-3">{t.pricingCalculator.longRouteTitle}</div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {renderLongCard(t.pricingCalculator.standard, result.standard.day, result.standard.night)}
                    {renderLongCard(t.pricingCalculator.bus, result.bus.day, result.bus.night)}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">{t.pricingCalculator.note}</div>
              <div className="pt-2">
                <a
                  href={pricingBookingHref}
                  onClick={(event) => {
                    event.preventDefault();
                    const scrolled = requestScrollTo('pricing-booking');
                    if (!scrolled) {
                      window.location.href = pricingBookingHref;
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  {t.pricingCalculator.orderNow}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
