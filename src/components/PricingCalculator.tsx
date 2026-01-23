import { useEffect, useRef, useState } from 'react';
import { Calculator, MapPin, Navigation, X } from 'lucide-react';
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
const AIRPORT_GEOCODE_QUERY = 'Terminal pasazerski odloty, Port Lotniczy Gdansk im. Lecha Walesy';
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY as string | undefined;
const GDANSK_BIAS = { lat: 54.3520, lon: 18.6466 };
const GDANSK_RADIUS_METERS = 60000;
const AIRPORT_RADIUS_KM = 2.5;
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
  if (distance <= 45) return isNight ? 350 : 300;
  if (distance <= 50) return isNight ? 600 : 400;
  if (distance <= 55) return isNight ? 700 : 500;
  if (distance <= 80) return isNight ? 800 : 600;
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
      debug?: DebugInfo;
    }
  | {
      type: 'long';
      distanceKm: number;
      routeLabel: string;
      standard: LongPriceByVehicle;
      bus: LongPriceByVehicle;
      debug?: DebugInfo;
    };

type DebugInfo = {
  pickup: { lat: number; lon: number };
  destination: { lat: number; lon: number };
  straightDistance: number;
  routedDistance: number | null;
  routeSource: 'google' | 'none';
};

export function PricingCalculator() {
  const { t, locale } = useI18n();
  const eurRate = useEurRate();
  const taximeterDayLabel = 'Stawka dzienna';
  const guaranteedDayLabel = (distanceKm: number) => (distanceKm > 100 ? 'Całodobowa stawka' : 'Stawka dzienna');
  const airportAddress = t.pricingCalculator.airportAddress;
  const pricingBookingHref = `${localeToPath(locale)}/${getRouteSlug(locale, 'pricing')}#pricing-booking`;
  const [pickupAddress, setPickupAddress] = useState('');
  const [destinationAddress, setDestinationAddress] = useState('');
  const [pickupMode, setPickupMode] = useState<'airport' | 'custom'>('custom');
  const [destinationMode, setDestinationMode] = useState<'airport' | 'custom'>('custom');
  const [pickupSuggestions, setPickupSuggestions] = useState<Array<{ label: string; placeId: string }>>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Array<{ label: string; placeId: string }>>([]);
  const [pickupSuggestionStatus, setPickupSuggestionStatus] = useState<string | null>(null);
  const [destinationSuggestionStatus, setDestinationSuggestionStatus] = useState<string | null>(null);
  const [pickupPoint, setPickupPoint] = useState<{ lat: number; lon: number } | null>(null);
  const [destinationPoint, setDestinationPoint] = useState<{ lat: number; lon: number } | null>(null);
  const showDebug = typeof window !== 'undefined'
    && new URLSearchParams(window.location.search).get('debug') === '1';
  const [googleReady, setGoogleReady] = useState(false);
  const googleServicesRef = useRef<{
    autocomplete: any;
    places: any;
    directions: any;
  } | null>(null);
  const sessionTokenRef = useRef<any>(null);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    if ((window as any).google?.maps?.places) {
      setGoogleReady(true);
      return;
    }
    const existing = document.querySelector('script[data-google-maps="true"]');
    if (existing) {
      existing.addEventListener('load', () => setGoogleReady(true), { once: true });
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = 'true';
    script.addEventListener('load', () => setGoogleReady(true));
    document.head.appendChild(script);
  }, []);

  const ensureGoogleServices = () => {
    if (!googleReady) {
      return null;
    }
    if (googleServicesRef.current) {
      return googleServicesRef.current;
    }
    const google = (window as any).google;
    if (!google?.maps?.places) {
      return null;
    }
    const autocomplete = new google.maps.places.AutocompleteService();
    const dummyDiv = document.createElement('div');
    const places = new google.maps.places.PlacesService(dummyDiv);
    const directions = new google.maps.DirectionsService();
    sessionTokenRef.current = new google.maps.places.AutocompleteSessionToken();
    googleServicesRef.current = { autocomplete, places, directions };
    return googleServicesRef.current;
  };

  const retrieveSuggestionPoint = async (placeId: string) => {
    const services = ensureGoogleServices();
    if (!services) {
      return null;
    }
    return new Promise<{ lat: number; lon: number } | null>((resolve) => {
      services.places.getDetails(
        {
          placeId,
          fields: ['geometry'],
          sessionToken: sessionTokenRef.current ?? undefined,
        },
        (place: any, status: any) => {
          if (status !== (window as any).google?.maps?.places?.PlacesServiceStatus?.OK) {
            resolve(null);
            return;
          }
          const location = place?.geometry?.location;
          const lat = typeof location?.lat === 'function' ? location.lat() : Number(location?.lat);
          const lon = typeof location?.lng === 'function' ? location.lng() : Number(location?.lng);
          if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            resolve(null);
            return;
          }
          resolve({ lat, lon });
        },
      );
    });
  };
  const [activeSuggestionField, setActiveSuggestionField] = useState<'pickup' | 'destination' | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const geocodeCache = useRef(new Map<string, { lat: number; lon: number } | null>());
  const routeDistanceCache = useRef(new Map<string, { km: number; source: 'google' } | null>());

  useEffect(() => {
    preloadEurRate();
  }, []);

  useEffect(() => {
    const query = normalizeSuggestionQuery(pickupAddress);
    if (query.length < 3) {
      setPickupSuggestions([]);
      setPickupSuggestionStatus(null);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        if (!GOOGLE_MAPS_KEY) {
          setPickupSuggestions([]);
          return;
        }
        const services = ensureGoogleServices();
        if (!services) {
          setPickupSuggestions([]);
          return;
        }
        const google = (window as any).google;
        const getPredictions = (useBias: boolean) => new Promise<{ items: any[]; status: string }>((resolve) => {
          const request: any = {
            input: query,
            region: 'pl',
            sessionToken: sessionTokenRef.current ?? undefined,
          };
          if (useBias) {
            request.location = new google.maps.LatLng(GDANSK_BIAS.lat, GDANSK_BIAS.lon);
            request.radius = GDANSK_RADIUS_METERS;
          }
          services.autocomplete.getPlacePredictions(request, (items: any[], status: any) => {
            const list = Array.isArray(items) ? items : [];
            resolve({ items: list, status: String(status ?? '') });
          });
        });
        let { items: predictions, status } = await getPredictions(true);
        if (predictions.length === 0) {
          const fallback = await getPredictions(false);
          predictions = fallback.items;
          status = fallback.status;
        }
        const results = predictions.map((item: any) => {
          const main = item.structured_formatting?.main_text ?? item.description ?? '';
          const secondary = item.structured_formatting?.secondary_text ?? '';
          const label = secondary ? `${main}, ${secondary}` : String(main);
          return {
            label,
            placeId: String(item.place_id ?? ''),
          };
        }).filter((item: any) => item.label && item.placeId);
        if (!active) return;
        setPickupSuggestions(results);
        setPickupSuggestionStatus(results.length > 0 ? null : (status || 'ZERO_RESULTS'));
      } catch {
        if (!active) return;
        setPickupSuggestions([]);
        setPickupSuggestionStatus('ERROR');
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
      setDestinationSuggestionStatus(null);
      return;
    }

    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      try {
        if (!GOOGLE_MAPS_KEY) {
          setDestinationSuggestions([]);
          return;
        }
        const services = ensureGoogleServices();
        if (!services) {
          setDestinationSuggestions([]);
          return;
        }
        const google = (window as any).google;
        const getPredictions = (useBias: boolean) => new Promise<{ items: any[]; status: string }>((resolve) => {
          const request: any = {
            input: query,
            region: 'pl',
            sessionToken: sessionTokenRef.current ?? undefined,
          };
          if (useBias) {
            request.location = new google.maps.LatLng(GDANSK_BIAS.lat, GDANSK_BIAS.lon);
            request.radius = GDANSK_RADIUS_METERS;
          }
          services.autocomplete.getPlacePredictions(request, (items: any[], status: any) => {
            const list = Array.isArray(items) ? items : [];
            resolve({ items: list, status: String(status ?? '') });
          });
        });
        let { items: predictions, status } = await getPredictions(true);
        if (predictions.length === 0) {
          const fallback = await getPredictions(false);
          predictions = fallback.items;
          status = fallback.status;
        }
        const results = predictions.map((item: any) => {
          const main = item.structured_formatting?.main_text ?? item.description ?? '';
          const secondary = item.structured_formatting?.secondary_text ?? '';
          const label = secondary ? `${main}, ${secondary}` : String(main);
          return {
            label,
            placeId: String(item.place_id ?? ''),
          };
        }).filter((item: any) => item.label && item.placeId);
        if (!active) return;
        setDestinationSuggestions(results);
        setDestinationSuggestionStatus(results.length > 0 ? null : (status || 'ZERO_RESULTS'));
      } catch {
        if (!active) return;
        setDestinationSuggestions([]);
        setDestinationSuggestionStatus('ERROR');
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
        if (!GOOGLE_MAPS_KEY) {
          geocodeCache.current.set(key, null);
          return null;
        }
        const services = ensureGoogleServices();
        if (!services) {
          geocodeCache.current.set(key, null);
          return null;
        }
        const google = (window as any).google;
        const request = {
          input: value,
          location: new google.maps.LatLng(GDANSK_BIAS.lat, GDANSK_BIAS.lon),
          radius: GDANSK_RADIUS_METERS,
          region: 'pl',
          sessionToken: sessionTokenRef.current ?? undefined,
        };
        const prediction = await new Promise<any | null>((resolve) => {
          services.autocomplete.getPlacePredictions(request, (items: any[], status: any) => {
            if (status !== google.maps.places.PlacesServiceStatus.OK || !Array.isArray(items) || items.length === 0) {
              resolve(null);
              return;
            }
            resolve(items[0]);
          });
        });
        if (!prediction?.place_id) {
          geocodeCache.current.set(key, null);
          return null;
        }
        const point = await new Promise<{ lat: number; lon: number } | null>((resolve) => {
          services.places.getDetails(
            {
              placeId: prediction.place_id,
              fields: ['geometry'],
              sessionToken: sessionTokenRef.current ?? undefined,
            },
            (place: any, status: any) => {
              if (status !== google.maps.places.PlacesServiceStatus.OK) {
                resolve(null);
                return;
              }
              const location = place?.geometry?.location;
              const lat = typeof location?.lat === 'function' ? location.lat() : Number(location?.lat);
              const lon = typeof location?.lng === 'function' ? location.lng() : Number(location?.lng);
              if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                resolve(null);
                return;
              }
              resolve({ lat, lon });
            },
          );
        });
        if (!point) {
          geocodeCache.current.set(key, null);
          return null;
        }
        geocodeCache.current.set(key, point);
        return point;
      };

      const getRouteDistanceKm = async (
        from: { lat: number; lon: number },
        to: { lat: number; lon: number },
      ): Promise<{ km: number; source: 'google' } | null> => {
        const key = `${from.lat.toFixed(5)},${from.lon.toFixed(5)}|${to.lat.toFixed(5)},${to.lon.toFixed(5)}`;
        if (routeDistanceCache.current.has(key)) {
          const cached = routeDistanceCache.current.get(key);
          return cached ?? null;
        }
        if (!GOOGLE_MAPS_KEY) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const services = ensureGoogleServices();
        if (!services) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const google = (window as any).google;
        const origin = new google.maps.LatLng(from.lat, from.lon);
        const destination = new google.maps.LatLng(to.lat, to.lon);
        const distance = await new Promise<number | null>((resolve) => {
          services.directions.route(
            {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: false,
            },
            (result: any, status: any) => {
              if (status !== google.maps.DirectionsStatus.OK) {
                resolve(null);
                return;
              }
              const meters = result?.routes?.[0]?.legs?.[0]?.distance?.value;
              if (typeof meters !== 'number' || !Number.isFinite(meters)) {
                resolve(null);
                return;
              }
              resolve(meters);
            },
          );
        });
        if (distance === null) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const km = distance / 1000;
        routeDistanceCache.current.set(key, { km, source: 'google' });
        return { km, source: 'google' };
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
        const pickup = pickupMode === 'airport'
          ? (await geocodeAddress(AIRPORT_GEOCODE_QUERY) ?? AIRPORT_COORD)
          : (pickupPoint ?? await geocodeAddress(pickupAddress));
        const destination = destinationMode === 'airport'
          ? (await geocodeAddress(AIRPORT_GEOCODE_QUERY) ?? AIRPORT_COORD)
          : (destinationPoint ?? await geocodeAddress(destinationAddress));

        if (!pickup || !destination) {
          if (!active) return;
          setResult(null);
          setError(t.pricingCalculator.noResult);
          setIsChecking(false);
          return;
        }

        const routedDistanceResult = await getRouteDistanceKm(pickup, destination);
        const straightDistance = distanceKm(pickup, destination);
        const distance = routedDistanceResult?.km ?? straightDistance;
        const distanceRounded = formatDistance(distance);
        const debugInfo: DebugInfo | undefined = showDebug ? {
          pickup,
          destination,
          straightDistance: Math.round(straightDistance * 100) / 100,
          routedDistance: routedDistanceResult?.km ?? null,
          routeSource: routedDistanceResult?.source ?? 'none',
        } : undefined;

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
            debug: debugInfo,
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
          debug: debugInfo,
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
  }, [pickupAddress, destinationAddress, pickupPoint, destinationPoint, locale, t]);

  const renderPrice = (value: number) => {
    const eur = formatEur(value, eurRate);
    return (
      <div className="min-w-[96px] text-right leading-tight">
        <div className="text-lg font-semibold text-gray-900">{value} PLN</div>
        <div className="min-h-[16px] text-xs text-gray-500">{eur ?? ''}</div>
      </div>
    );
  };

  const renderPriceSmall = (value: number) => {
    const eur = formatEur(value, eurRate);
    return (
      <div className="min-w-[96px] text-right leading-tight">
        <div className="text-xs font-semibold text-gray-700">{value} PLN</div>
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
              {allDay ? t.pricingCalculator.fixedAllDay : taximeterDayLabel}
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
    distanceKm: number,
  ) => (
    <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-4 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600">{t.pricingCalculator.taximeterLabel}</div>
            <div className="text-xs text-gray-400">
              {taximeterDayLabel}: {day.taximeterRate} PLN/km
            </div>
            <div className="text-xs text-gray-400">
              {t.pricingCalculator.nightRate}: {night.taximeterRate} PLN/km
            </div>
          </div>
          <div className="min-w-[140px] text-right">
            <div className="text-sm text-gray-600">{taximeterDayLabel}</div>
            {renderPriceSmall(day.taximeterPrice)}
            <div className="mt-2 text-sm text-gray-600">{t.pricingCalculator.nightRate}</div>
            {renderPriceSmall(night.taximeterPrice)}
          </div>
        </div>
        <div className="rounded-xl px-4 py-3 shadow-sm" style={{ border: '1px solid #bfdbfe', backgroundColor: '#eff6ff' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide shadow-sm"
                  style={{ backgroundColor: '#bbf7d0', color: '#065f46' }}
                >
                  Gwarantowana cena
                </div>
              </div>
              <div className="mt-2 text-xs text-emerald-700">
                {t.pricingCalculator.savingsLabel}: {day.savingsPercent}% / {night.savingsPercent}%
              </div>
            </div>
            <div className="min-w-[140px] text-right">
              <div className="text-xs text-emerald-700">{guaranteedDayLabel(distanceKm)}</div>
              {renderPrice(day.proposedPrice)}
            </div>
          </div>
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
            <div className="block">
              <span className="text-sm text-gray-600">{t.pricingCalculator.pickupLabel}</span>
              <div className="mt-2" style={{ height: '2.5rem' }}>
                {destinationMode !== 'airport' ? (
                  <div className="flex flex-nowrap items-center gap-4 text-sm text-slate-700 whitespace-nowrap" style={{ height: '2.5rem' }}>
                    <label className="inline-flex items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name="pickup-mode"
                        value="airport"
                        checked={pickupMode === 'airport'}
                        onChange={() => {
                          setPickupMode('airport');
                          setPickupAddress(airportAddress);
                          setPickupPoint(null);
                          setPickupSuggestions([]);
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      {t.pricingCalculator.airportLabel}
                    </label>
                    <label className="inline-flex items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name="pickup-mode"
                        value="custom"
                        checked={pickupMode === 'custom'}
                        onChange={() => {
                          setPickupMode('custom');
                          setPickupAddress('');
                          setPickupPoint(null);
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      {t.pricingCalculator.pickupCustomLabel}
                    </label>
                  </div>
                ) : (
                  <div aria-hidden="true" style={{ height: '2.5rem' }} />
                )}
              </div>
              <div
                className={`mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus-within:border-blue-500 ${
                  pickupMode === 'airport' ? 'bg-slate-100' : 'bg-white'
                }`}
              >
                <MapPin className="h-4 w-4 text-blue-600" />
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(event) => {
                    setPickupAddress(event.target.value);
                    setPickupPoint(null);
                  }}
                  onFocus={() => setActiveSuggestionField('pickup')}
                  onBlur={() => setActiveSuggestionField(null)}
                  placeholder={t.pricingCalculator.pickupPlaceholder}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
                  disabled={pickupMode === 'airport'}
                />
                {pickupAddress.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setPickupAddress('');
                      setPickupPoint(null);
                      setPickupSuggestions([]);
                      if (pickupMode === 'airport') {
                        setPickupMode('custom');
                      }
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Clear pickup"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {activeSuggestionField === 'pickup' && pickupSuggestions.length > 0 && (
                <ul className="mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm">
                  {pickupSuggestions.map((item, index) => (
                    <li key={`${item.placeId}-${index}`}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setPickupAddress(item.label);
                          setPickupPoint(null);
                          setPickupSuggestions([]);
                          setActiveSuggestionField(null);
                          retrieveSuggestionPoint(item.placeId)
                            .then((point) => {
                              if (point) {
                                setPickupPoint(point);
                              }
                            })
                            .catch(() => undefined);
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {activeSuggestionField === 'pickup' && pickupSuggestions.length === 0 && pickupSuggestionStatus && (
                <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  Brak podpowiedzi.
                </div>
              )}
            </div>
            <div className="block">
              <span className="text-sm text-gray-600">{t.pricingCalculator.destinationLabel}</span>
              <div className="mt-2" style={{ height: '2.5rem' }}>
                {pickupMode !== 'airport' ? (
                  <div className="flex flex-nowrap items-center gap-4 text-sm text-slate-700 whitespace-nowrap" style={{ height: '2.5rem' }}>
                    <label className="inline-flex items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name="destination-mode"
                        value="airport"
                        checked={destinationMode === 'airport'}
                        onChange={() => {
                          setDestinationMode('airport');
                          setDestinationAddress(airportAddress);
                          setDestinationPoint(null);
                          setDestinationSuggestions([]);
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      {t.pricingCalculator.airportLabel}
                    </label>
                    <label className="inline-flex items-center gap-2 whitespace-nowrap">
                      <input
                        type="radio"
                        name="destination-mode"
                        value="custom"
                        checked={destinationMode === 'custom'}
                        onChange={() => {
                          setDestinationMode('custom');
                          setDestinationAddress('');
                          setDestinationPoint(null);
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      {t.pricingCalculator.destinationCustomLabel}
                    </label>
                  </div>
                ) : (
                  <div aria-hidden="true" style={{ height: '2.5rem' }} />
                )}
              </div>
              <div
                className={`mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus-within:border-blue-500 ${
                  destinationMode === 'airport' ? 'bg-slate-100' : 'bg-white'
                }`}
              >
                <Navigation className="h-4 w-4 text-blue-600" />
                <input
                  type="text"
                  value={destinationAddress}
                  onChange={(event) => {
                    setDestinationAddress(event.target.value);
                    setDestinationPoint(null);
                  }}
                  onFocus={() => setActiveSuggestionField('destination')}
                  onBlur={() => setActiveSuggestionField(null)}
                  placeholder={t.pricingCalculator.destinationPlaceholder}
                  className="w-full bg-transparent text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500"
                  disabled={destinationMode === 'airport'}
                />
                {destinationAddress.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setDestinationAddress('');
                      setDestinationPoint(null);
                      setDestinationSuggestions([]);
                      if (destinationMode === 'airport') {
                        setDestinationMode('custom');
                      }
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Clear destination"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              {activeSuggestionField === 'destination' && destinationSuggestions.length > 0 && (
                <ul className="mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm">
                  {destinationSuggestions.map((item, index) => (
                    <li key={`${item.placeId}-${index}`}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50"
                        onMouseDown={(event) => {
                          event.preventDefault();
                          setDestinationAddress(item.label);
                          setDestinationPoint(null);
                          setDestinationSuggestions([]);
                          setActiveSuggestionField(null);
                          retrieveSuggestionPoint(item.placeId)
                            .then((point) => {
                              if (point) {
                                setDestinationPoint(point);
                              }
                            })
                            .catch(() => undefined);
                        }}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {activeSuggestionField === 'destination' && destinationSuggestions.length === 0 && destinationSuggestionStatus && (
                <div className="mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                  Brak podpowiedzi.
                </div>
              )}
            </div>
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
                {showDebug && result.debug && (
                  <div className="mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
                    <div>pickup: {result.debug.pickup.lat.toFixed(5)}, {result.debug.pickup.lon.toFixed(5)}</div>
                    <div>destination: {result.debug.destination.lat.toFixed(5)}, {result.debug.destination.lon.toFixed(5)}</div>
                    <div>straight: {result.debug.straightDistance} km</div>
                    <div>routed: {result.debug.routedDistance ? `${Math.round(result.debug.routedDistance * 100) / 100} km` : 'null'}</div>
                    <div>source: {result.debug.routeSource}</div>
                  </div>
                )}
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
                    {renderLongCard(t.pricingCalculator.standard, result.standard.day, result.standard.night, result.distanceKm)}
                    {renderLongCard(t.pricingCalculator.bus, result.bus.day, result.bus.night, result.distanceKm)}
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
