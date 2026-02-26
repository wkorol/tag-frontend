import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
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
const BANINO_COORD = { lat: 54.3723, lon: 18.3837 };
const BANINO_RADIUS_KM = 3;
const ZUKOWO_COORD = { lat: 54.3426, lon: 18.364 };
const ZUKOWO_RADIUS_KM = 4;
const GDYNIA_CENTER_COORD = { lat: 54.5189, lon: 18.5305 };
const GDYNIA_CENTER_RADIUS_KM = 4;
const SOPOT_CENTER_COORD = { lat: 54.4416, lon: 18.5601 };
const SOPOT_CENTER_RADIUS_KM = 3;
const TAXIMETER_RATES = {
  gdansk: { day: 3.9, night: 5.85 },
  outside: { day: 7.8, night: 11.7 },
} as const;

const roundPrice = (value: number, step = 10) => Math.round(value / step) * step;
const formatDistance = (value: number) => Math.round(value * 10) / 10;
const normalizeSuggestionQuery = (value: string) => value.trim().replace(/hitlon/gi, 'hilton');
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

const getPathInsideStats = (
  path: Array<{ lat: number; lon: number }>,
  isInside: (point: { lat: number; lon: number }) => boolean,
) => {
  if (path.length < 2) {
    return { totalKm: 0, insideKm: 0, outsideKm: 0, insideRatio: 0 };
  }
  const stepKm = 0.25;
  const maxSubsegments = 50;
  let totalKm = 0;
  let insideKm = 0;
  for (let i = 1; i < path.length; i += 1) {
    const a = path[i - 1];
    const b = path[i];
    const segmentKm = distanceKm(a, b);
    if (!Number.isFinite(segmentKm) || segmentKm <= 0) {
      continue;
    }
    totalKm += segmentKm;
    const subsegments = Math.min(maxSubsegments, Math.max(1, Math.ceil(segmentKm / stepKm)));
    const segmentPart = segmentKm / subsegments;
    for (let s = 0; s < subsegments; s += 1) {
      const t0 = s / subsegments;
      const t1 = (s + 1) / subsegments;
      const midpoint = {
        lat: a.lat + (b.lat - a.lat) * ((t0 + t1) / 2),
        lon: a.lon + (b.lon - a.lon) * ((t0 + t1) / 2),
      };
      if (isInside(midpoint)) {
        insideKm += segmentPart;
      }
    }
  }
  const insideRatio = totalKm > 0 ? insideKm / totalKm : 0;
  return { totalKm, insideKm, outsideKm: Math.max(0, totalKm - insideKm), insideRatio };
};

const getGdanskCityPrice = (distance: number) => {
  if (distance <= 15) return 100;
  if (distance <= 20) return 120;
  if (distance <= 25) return 150;
  return null;
};

const getAirportOutsidePrice = (distance: number, isNight: boolean) => {
  if (distance <= 20) return isNight ? 150 : 120;
  if (distance <= 30) return isNight ? 250 : 200;
  if (distance <= 45) return isNight ? 350 : 300;
  if (distance <= 50) return isNight ? 600 : 400;
  if (distance <= 55) return isNight ? 700 : 500;
  if (distance <= 80) return isNight ? 800 : 600;
  if (distance <= 100) return isNight ? 900 : 700;
  return null;
};

const getOutsideShortMinPrice = (distance: number, isNight: boolean) => {
  if (distance <= 20) return isNight ? 150 : 120;
  if (distance <= 30) return isNight ? 200 : 150;
  if (distance <= 40) return isNight ? 250 : 200;
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
  insideRatio: number;
  gdanskKm: number;
  outsideKm: number;
};

export function PricingCalculator() {
  const { t, locale } = useI18n();
  const location = useLocation();
  const eurRate = useEurRate();
  const taximeterDayLabel = t.pricingCalculator.dayRateLabel;
  const guaranteedDayLabel = () => t.pricingCalculator.dayRateLabel;
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
  const directionsServiceRef = useRef<any>(null);
  const placesLibRef = useRef<{
    AutocompleteSuggestion: any;
    AutocompleteSessionToken: any;
    Place: any;
  } | null>(null);
  const sessionTokenRef = useRef<any>(null);
  const prefillSearchRef = useRef<string | null>(null);

  useEffect(() => {
    if (!location.search) {
      return;
    }
    if (prefillSearchRef.current === location.search) {
      return;
    }
    prefillSearchRef.current = location.search;
    const params = new URLSearchParams(location.search);
    const to = params.get('to');
    const from = params.get('from');
    if (from === 'airport') {
      setPickupMode('airport');
      setPickupAddress(airportAddress);
      setPickupPoint(null);
      setPickupSuggestions([]);
    }
    if (from === 'custom') {
      setPickupMode('custom');
    }
    if (to) {
      setDestinationMode('custom');
      setDestinationAddress(to);
      setDestinationPoint(null);
      setDestinationSuggestions([]);
    }
  }, [location.search, airportAddress]);

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

  const ensureDirectionsService = () => {
    if (!googleReady) {
      return null;
    }
    if (directionsServiceRef.current) {
      return directionsServiceRef.current;
    }
    const google = (window as any).google;
    if (!google?.maps) {
      return null;
    }
    directionsServiceRef.current = new google.maps.DirectionsService();
    return directionsServiceRef.current;
  };

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

  const geocodeByPlaceId = async (placeId: string): Promise<{ lat: number; lon: number } | null> => {
    try {
      const google = (window as any).google;
      if (!google?.maps) { console.warn('[geo] no google.maps'); return null; }
      if (!google.maps.Geocoder && google.maps.importLibrary) {
        await google.maps.importLibrary('geocoding');
      }
      if (!google.maps.Geocoder) { console.warn('[geo] Geocoder unavailable after importLibrary'); return null; }
      return new Promise((resolve) => {
        new google.maps.Geocoder().geocode({ placeId }, (results: any, status: any) => {
          if (status !== 'OK' || !results?.[0]?.geometry?.location) {
            console.warn('[geo] geocode status:', status, 'placeId:', placeId);
            resolve(null);
            return;
          }
          const loc = results[0].geometry.location;
          const lat = typeof loc.lat === 'function' ? loc.lat() : Number(loc.lat);
          const lon = typeof loc.lng === 'function' ? loc.lng() : Number(loc.lng);
          resolve(Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null);
        });
      });
    } catch (err) {
      console.warn('[geo] geocodeByPlaceId error:', err);
      return null;
    }
  };

  const retrieveSuggestionPoint = async (placeId: string) => {
    const lib = await ensurePlacesLibrary();
    if (!lib) {
      return geocodeByPlaceId(placeId);
    }
    try {
      const place = new lib.Place({ id: placeId });
      await place.fetchFields({ fields: ['location'] });
      const location = place.location;
      const lat = typeof location?.lat === 'function' ? location.lat() : Number(location?.lat);
      const lon = typeof location?.lng === 'function' ? location.lng() : Number(location?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return geocodeByPlaceId(placeId);
      }
      resetSessionToken();
      return { lat, lon };
    } catch {
      return geocodeByPlaceId(placeId);
    }
  };
  const [activeSuggestionField, setActiveSuggestionField] = useState<'pickup' | 'destination' | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const geocodeCache = useRef(new Map<string, { lat: number; lon: number } | null>());
  const routeDistanceCache = useRef(new Map<string, { km: number; source: 'google'; path?: Array<{ lat: number; lon: number }> } | null>());

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
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          setPickupSuggestions([]);
          return;
        }
        const getPredictions = async (useBias: boolean) => {
          const sessionToken = await getSessionToken();
          const request: any = {
            input: query,
            region: 'pl',
            language: locale,
            sessionToken: sessionToken ?? undefined,
          };
          if (useBias) {
            request.locationBias = getLocationBounds(GDANSK_BIAS, GDANSK_RADIUS_METERS);
          }
          const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
          return Array.isArray(suggestions) ? suggestions : [];
        };
        let predictions = await getPredictions(true);
        if (predictions.length === 0) {
          predictions = await getPredictions(false);
        }
        const results = predictions
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
        setPickupSuggestions(results);
        setPickupSuggestionStatus(results.length > 0 ? null : 'ZERO_RESULTS');
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
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          setDestinationSuggestions([]);
          return;
        }
        const getPredictions = async (useBias: boolean) => {
          const sessionToken = await getSessionToken();
          const request: any = {
            input: query,
            region: 'pl',
            language: locale,
            sessionToken: sessionToken ?? undefined,
          };
          if (useBias) {
            request.locationBias = getLocationBounds(GDANSK_BIAS, GDANSK_RADIUS_METERS);
          }
          const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
          return Array.isArray(suggestions) ? suggestions : [];
        };
        let predictions = await getPredictions(true);
        if (predictions.length === 0) {
          predictions = await getPredictions(false);
        }
        const results = predictions
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
        setDestinationSuggestions(results);
        setDestinationSuggestionStatus(results.length > 0 ? null : 'ZERO_RESULTS');
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
    if (GOOGLE_MAPS_KEY && !googleReady) {
      setIsChecking(false);
      setError(null);
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
          return null;
        }
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          return null;
        }
        const sessionToken = await getSessionToken();
        const request: any = {
          input: value,
          region: 'pl',
          language: locale,
          locationBias: getLocationBounds(GDANSK_BIAS, GDANSK_RADIUS_METERS),
          sessionToken: sessionToken ?? undefined,
        };
        const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        const prediction = Array.isArray(suggestions)
          ? suggestions[0]?.placePrediction
          : null;
        if (!prediction?.placeId) {
          geocodeCache.current.set(key, null);
          return null;
        }
        const place = prediction.toPlace ? prediction.toPlace() : new lib.Place({ id: prediction.placeId });
        let point: { lat: number; lon: number } | null = null;
        try {
          await place.fetchFields({ fields: ['location'] });
          const location = place.location;
          const lat = typeof location?.lat === 'function' ? location.lat() : Number(location?.lat);
          const lon = typeof location?.lng === 'function' ? location.lng() : Number(location?.lng);
          point = Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
          console.warn('[geocodeAddr] fetchFields result:', point, 'placeId:', prediction.placeId);
        } catch (err) {
          console.warn('[geocodeAddr] fetchFields failed:', err, 'placeId:', prediction.placeId);
          point = null;
        }
        if (!point) {
          console.warn('[geocodeAddr] trying geocodeByPlaceId fallback');
          point = await geocodeByPlaceId(prediction.placeId);
          console.warn('[geocodeAddr] fallback result:', point);
        }
        if (!point) {
          geocodeCache.current.set(key, null);
          return null;
        }
        resetSessionToken();
        geocodeCache.current.set(key, point);
        return point;
      };

      const getRouteInfo = async (
        from: { lat: number; lon: number },
        to: { lat: number; lon: number },
      ): Promise<{ km: number; source: 'google'; path?: Array<{ lat: number; lon: number }> } | null> => {
        const key = `${from.lat.toFixed(5)},${from.lon.toFixed(5)}|${to.lat.toFixed(5)},${to.lon.toFixed(5)}`;
        if (routeDistanceCache.current.has(key)) {
          const cached = routeDistanceCache.current.get(key);
          return cached ?? null;
        }
        if (!GOOGLE_MAPS_KEY) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const directions = ensureDirectionsService();
        if (!directions) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const google = (window as any).google;
        const origin = new google.maps.LatLng(from.lat, from.lon);
        const destination = new google.maps.LatLng(to.lat, to.lon);
        const resultInfo = await new Promise<{ distance: number | null; path?: Array<{ lat: number; lon: number }> }>((resolve) => {
          directions.route(
            {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: false,
            },
            (result: any, status: any) => {
              if (status !== google.maps.DirectionsStatus.OK) {
                resolve({ distance: null });
                return;
              }
              const meters = result?.routes?.[0]?.legs?.[0]?.distance?.value;
              if (typeof meters !== 'number' || !Number.isFinite(meters)) {
                resolve({ distance: null });
                return;
              }
              const overviewPath = result?.routes?.[0]?.overview_path;
              const path = Array.isArray(overviewPath)
                ? overviewPath
                  .map((point: any) => ({
                    lat: typeof point?.lat === 'function' ? point.lat() : Number(point?.lat),
                    lon: typeof point?.lng === 'function' ? point.lng() : Number(point?.lng),
                  }))
                  .filter((point: any) => Number.isFinite(point.lat) && Number.isFinite(point.lon))
                : undefined;
              resolve({ distance: meters, path: path && path.length > 1 ? path : undefined });
            },
          );
        });
        if (resultInfo.distance === null) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const km = resultInfo.distance / 1000;
        const info = { km, source: 'google' as const, path: resultInfo.path };
        routeDistanceCache.current.set(key, info);
        return info;
      };

      const isAirportPoint = (point: { lat: number; lon: number }) =>
        distanceKm(point, AIRPORT_COORD) <= AIRPORT_RADIUS_KM;
      const isBaninoPoint = (point: { lat: number; lon: number }) =>
        distanceKm(point, BANINO_COORD) <= BANINO_RADIUS_KM;
      const isZukowoPoint = (point: { lat: number; lon: number }) =>
        distanceKm(point, ZUKOWO_COORD) <= ZUKOWO_RADIUS_KM;

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
          let cityKey = getCenterKey(otherPoint);
          if (!cityKey) {
            if (distanceKm(otherPoint, GDYNIA_CENTER_COORD) <= GDYNIA_CENTER_RADIUS_KM) {
              cityKey = 'gdynia';
            } else if (distanceKm(otherPoint, SOPOT_CENTER_COORD) <= SOPOT_CENTER_RADIUS_KM) {
              cityKey = 'sopot';
            }
          }
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

        if (isAirportRoute && otherPoint && isBaninoPoint(otherPoint)) {
          return {
            price: Math.round(120 * busMultiplier),
            allDay: true,
            routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance)),
          };
        }

        if (isAirportRoute && otherPoint && isZukowoPoint(otherPoint)) {
          return {
            price: Math.round(150 * busMultiplier),
            allDay: true,
            routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance)),
          };
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
          destinationInGdansk
            ? getGdanskCityPrice(distance)
            : null;

        if (gdanskFixedPrice) {
          return {
            price: Math.round(gdanskFixedPrice * busMultiplier),
            allDay: true,
            routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance)),
          };
        }

        return null;
      };

      try {
        console.warn('[calc] pickupMode:', pickupMode, 'destMode:', destinationMode, 'pickupPoint:', pickupPoint, 'destPoint:', destinationPoint);
        const pickup = pickupMode === 'airport'
          ? (await geocodeAddress(AIRPORT_GEOCODE_QUERY) ?? AIRPORT_COORD)
          : (pickupPoint ?? await geocodeAddress(pickupAddress));
        const destination = destinationMode === 'airport'
          ? (await geocodeAddress(AIRPORT_GEOCODE_QUERY) ?? AIRPORT_COORD)
          : (destinationPoint ?? await geocodeAddress(destinationAddress));
        console.warn('[calc] pickup:', pickup, 'destination:', destination);

        if (!pickup || !destination) {
          if (!active) return;
          console.warn('[calc] FAILED — pickup or destination is null');
          setResult(null);
          setError(t.pricingCalculator.noResult);
          setIsChecking(false);
          return;
        }

        let routedDistanceResult: { km: number; source: 'google'; path?: Array<{ lat: number; lon: number }> } | null = null;
        try {
          routedDistanceResult = await getRouteInfo(pickup, destination);
        } catch (err) {
          if (import.meta.env.DEV) {
            console.error('PricingCalculator: route distance failed', err);
          }
          routedDistanceResult = null;
        }
        const straightDistance = distanceKm(pickup, destination);
        const distance = routedDistanceResult?.km ?? straightDistance;
        const distanceRounded = formatDistance(distance);
        const pickupInGdansk = isPointInsideGeoJson(pickup, cityPolygons.gdansk);
        const destinationInGdansk = isPointInsideGeoJson(destination, cityPolygons.gdansk);
        const pathStats = routedDistanceResult?.path
          ? getPathInsideStats(routedDistanceResult.path, (point) => isPointInsideGeoJson(point, cityPolygons.gdansk))
          : null;
        const insideRatio = pathStats
          ? pathStats.insideRatio
          : estimateInsideRatio(
            pickup,
            destination,
            (point) => isPointInsideGeoJson(point, cityPolygons.gdansk),
          );
        const gdanskDistance = pathStats ? pathStats.insideKm : distance * insideRatio;
        const outsideDistance = pathStats ? pathStats.outsideKm : Math.max(0, distance - gdanskDistance);
        const debugInfo: DebugInfo | undefined = showDebug ? {
          pickup,
          destination,
          straightDistance: Math.round(straightDistance * 100) / 100,
          routedDistance: routedDistanceResult?.km ?? null,
          routeSource: routedDistanceResult?.source ?? 'none',
          insideRatio: Math.round(insideRatio * 1000) / 1000,
          gdanskKm: Math.round(gdanskDistance * 100) / 100,
          outsideKm: Math.round(outsideDistance * 100) / 100,
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

        const outsideGdanskRoute = !(pickupInGdansk && destinationInGdansk);

        const touchesGdynia = centerPolygons.gdynia
          ? (
            isPointInsideGeoJson(pickup, centerPolygons.gdynia)
            || isPointInsideGeoJson(destination, centerPolygons.gdynia)
          )
          : false;

        const computeLong = (vehicleType: 'standard' | 'bus', isNight: boolean): LongPrice => {
          const busMultiplier = vehicleType === 'bus' ? 1.5 : 1;
          const gdanskRate = isNight ? TAXIMETER_RATES.gdansk.night : TAXIMETER_RATES.gdansk.day;
          const outsideRate = isNight ? TAXIMETER_RATES.outside.night : TAXIMETER_RATES.outside.day;
          const taximeterPrice = roundPrice(
            ((gdanskDistance * gdanskRate) + (outsideDistance * outsideRate)) * busMultiplier,
            10,
          );
          const taximeterRate = distance > 0 ? Math.round((taximeterPrice / distance) * 100) / 100 : gdanskRate;
          const proposedBase = distance > 100
            ? distance * 2 * (isNight ? 4 : 3) * busMultiplier
            : taximeterPrice * 0.9;
          const baseMinPrice = 120 * busMultiplier;
          const nightMinPrice = touchesGdynia ? 150 * busMultiplier : baseMinPrice;
          const outsideMinBase = outsideGdanskRoute ? getOutsideShortMinPrice(distance, isNight) : null;
          const outsideMinPrice = outsideMinBase ? outsideMinBase * busMultiplier : 0;
          const minPrice = Math.max(isNight ? nightMinPrice : baseMinPrice, outsideMinPrice);
          const proposedPrice = roundPrice(Math.max(proposedBase, minPrice), 10);
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
        console.warn('[calc] outer catch:', err);
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
  }, [pickupAddress, destinationAddress, pickupPoint, destinationPoint, locale, t, googleReady]);

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
              <span className="text-sm text-gray-600 leading-tight">
                {t.pricingCalculator.nightRate}{' '}
                <span className="pricing-sunday-note text-gray-400">{t.pricing.sundayNote}</span>
              </span>
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
  ) => {
    const showTaximeter =
      day.proposedPrice <= day.taximeterPrice
      && night.proposedPrice <= night.taximeterPrice;
    return (
      <div className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
        <div className="mt-4 space-y-4">
          {showTaximeter && (
            <div>
              <div className="text-sm text-gray-600 mb-2">{t.pricingCalculator.taximeterLabel}</div>
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium">Taryfa</th>
                      <th className="px-3 py-2 text-right font-medium">Stawka</th>
                      <th className="px-3 py-2 text-right font-medium">Cena</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    <tr className="border-t border-slate-200">
                      <td className="px-3 py-2">{taximeterDayLabel}</td>
                      <td className="px-3 py-2 text-right">{day.taximeterRate} PLN/km</td>
                      <td className="px-3 py-2 text-right">{renderPriceSmall(day.taximeterPrice)}</td>
                    </tr>
                    <tr className="border-t border-slate-200">
                      <td className="px-3 py-2">
                        <div className="leading-tight">
                          <div>{t.pricingCalculator.nightRate}</div>
                          <div className="pricing-sunday-note text-slate-500">{t.pricing.sundayNote}</div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-right">{night.taximeterRate} PLN/km</td>
                      <td className="px-3 py-2 text-right">{renderPriceSmall(night.taximeterPrice)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        <div
          className="rounded-xl px-4 py-3 shadow-sm"
          style={{ border: '1px solid #bfdbfe', backgroundColor: '#eff6ff' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className="inline-flex items-center gap-2 rounded-full font-semibold uppercase tracking-wide shadow-sm"
                  style={{
                    backgroundColor: '#bbf7d0',
                    color: '#065f46',
                    padding: 'clamp(4px, 1.5vw, 6px) clamp(10px, 2.5vw, 12px)',
                    fontSize: 'clamp(10px, 2.6vw, 11px)',
                  }}
                >
                  {t.pricingCalculator.guaranteedPriceLabel}
                </div>
              </div>
            </div>
            <div className="w-full max-w-[420px]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                  <div className="text-emerald-700" style={{ fontSize: 'clamp(11px, 2.8vw, 12px)' }}>
                    {guaranteedDayLabel()}
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {renderPrice(day.proposedPrice)}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-white/70 px-3 py-2">
                  <div className="leading-tight">
                    <div className="text-emerald-700" style={{ fontSize: 'clamp(11px, 2.8vw, 12px)' }}>
                      {t.pricingCalculator.nightRate}
                    </div>
                    <div className="pricing-sunday-note text-slate-500">{t.pricing.sundayNote}</div>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    {renderPrice(night.proposedPrice)}
                  </div>
                </div>
              </div>
              {showTaximeter && day.savingsPercent > 0 && (
                <div className="mt-2 hidden gap-3 sm:grid sm:grid-cols-2">
                  <div className="flex items-center justify-center">
                    <div
                      className="inline-flex items-center rounded-full font-semibold shadow-sm"
                      style={{
                        backgroundColor: '#ffe4e6',
                        color: '#be123c',
                        padding: 'clamp(3px, 1.2vw, 5px) clamp(8px, 2vw, 10px)',
                        fontSize: 'clamp(9px, 2.2vw, 10px)',
                      }}
                    >
                      -{day.savingsPercent}%
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    {night.savingsPercent > 0 && (
                      <div
                        className="inline-flex items-center rounded-full font-semibold shadow-sm"
                        style={{
                          backgroundColor: '#ffe4e6',
                          color: '#be123c',
                          padding: 'clamp(3px, 1.2vw, 5px) clamp(8px, 2vw, 10px)',
                          fontSize: 'clamp(9px, 2.2vw, 10px)',
                        }}
                      >
                        -{night.savingsPercent}%
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  };

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
                    <div>insideRatio: {result.debug.insideRatio}</div>
                    <div>gdanskKm: {result.debug.gdanskKm} km</div>
                    <div>outsideKm: {result.debug.outsideKm} km</div>
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
