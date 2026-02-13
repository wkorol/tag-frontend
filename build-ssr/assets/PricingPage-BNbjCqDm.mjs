import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect, Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { u as useI18n, l as localeToPath, g as getRouteSlug, r as requestScrollTo, a as usePageTitle, d as trackFormOpen, N as Navbar, B as Breadcrumbs, t as trackCtaClick, b as trackNavClick, T as TrustSection, F as Footer, c as FloatingActions, s as scrollToId } from '../entry-server.mjs';
import { Pricing } from './Pricing-BxciKOQA.mjs';
import { Calculator, MapPin, X, Navigation } from 'lucide-react';
import { d as distanceKm, i as isPointInsideGeoJson, c as cityPolygons, a as centerPolygons, Q as QuoteForm } from './QuoteForm-BB9f8ybG.mjs';
import { F as FIXED_PRICES } from './fixedPricing-BrEVc9Vy.mjs';
import { u as useEurRate, p as preloadEurRate, f as formatEur } from './currency-BfL_L89a.mjs';
import { OrderForm } from './OrderForm-MiTM1NyG.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-dom';
import './orderNotes-Bh0j39S6.mjs';
import './scrollLock-Db1Ed-19.mjs';

const AIRPORT_COORD = { lat: 54.3776, lon: 18.4662 };
const AIRPORT_GEOCODE_QUERY = "Terminal pasazerski odloty, Port Lotniczy Gdansk im. Lecha Walesy";
const GOOGLE_MAPS_KEY = "AIzaSyCZn_Y7YkTDjJe8715PJ0jVbcwaim7kKFE";
const GDANSK_BIAS = { lat: 54.352, lon: 18.6466 };
const GDANSK_RADIUS_METERS = 6e4;
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
  outside: { day: 7.8, night: 11.7 }
};
const roundPrice = (value, step = 10) => Math.round(value / step) * step;
const formatDistance = (value) => Math.round(value * 10) / 10;
const normalizeSuggestionQuery = (value) => value.trim().replace(/hitlon/gi, "hilton");
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
const estimateInsideRatio = (start, end, isInside, steps = 30) => {
  if (steps <= 0) {
    return isInside(start) ? 1 : 0;
  }
  let insideCount = 0;
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    const point = {
      lat: start.lat + (end.lat - start.lat) * t,
      lon: start.lon + (end.lon - start.lon) * t
    };
    if (isInside(point)) {
      insideCount += 1;
    }
  }
  return insideCount / (steps + 1);
};
const getPathInsideStats = (path, isInside) => {
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
        lon: a.lon + (b.lon - a.lon) * ((t0 + t1) / 2)
      };
      if (isInside(midpoint)) {
        insideKm += segmentPart;
      }
    }
  }
  const insideRatio = totalKm > 0 ? insideKm / totalKm : 0;
  return { totalKm, insideKm, outsideKm: Math.max(0, totalKm - insideKm), insideRatio };
};
const getGdanskCityPrice = (distance) => {
  if (distance <= 5) return 50;
  if (distance <= 10) return 80;
  if (distance <= 15) return 100;
  if (distance <= 20) return 120;
  if (distance <= 25) return 150;
  return null;
};
const getOutsideShortMinPrice = (distance, isNight) => {
  if (distance <= 20) return isNight ? 150 : 120;
  if (distance <= 30) return isNight ? 200 : 150;
  if (distance <= 40) return isNight ? 250 : 200;
  return null;
};
function PricingCalculator() {
  const { t, locale } = useI18n();
  const location = useLocation();
  const eurRate = useEurRate();
  const taximeterDayLabel = t.pricingCalculator.dayRateLabel;
  const guaranteedDayLabel = () => t.pricingCalculator.dayRateLabel;
  const airportAddress = t.pricingCalculator.airportAddress;
  const pricingBookingHref = `${localeToPath(locale)}/${getRouteSlug(locale, "pricing")}#pricing-booking`;
  const [pickupAddress, setPickupAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [pickupMode, setPickupMode] = useState("custom");
  const [destinationMode, setDestinationMode] = useState("custom");
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [pickupSuggestionStatus, setPickupSuggestionStatus] = useState(null);
  const [destinationSuggestionStatus, setDestinationSuggestionStatus] = useState(null);
  const [pickupPoint, setPickupPoint] = useState(null);
  const [destinationPoint, setDestinationPoint] = useState(null);
  const showDebug = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1";
  const [googleReady, setGoogleReady] = useState(false);
  const directionsServiceRef = useRef(null);
  const placesLibRef = useRef(null);
  const sessionTokenRef = useRef(null);
  const prefillSearchRef = useRef(null);
  useEffect(() => {
    if (!location.search) {
      return;
    }
    if (prefillSearchRef.current === location.search) {
      return;
    }
    prefillSearchRef.current = location.search;
    const params = new URLSearchParams(location.search);
    const to = params.get("to");
    const from = params.get("from");
    if (from === "airport") {
      setPickupMode("airport");
      setPickupAddress(airportAddress);
      setPickupPoint(null);
      setPickupSuggestions([]);
    }
    if (from === "custom") {
      setPickupMode("custom");
    }
    if (to) {
      setDestinationMode("custom");
      setDestinationAddress(to);
      setDestinationPoint(null);
      setDestinationSuggestions([]);
    }
  }, [location.search, airportAddress]);
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
  const ensureDirectionsService = () => {
    if (!googleReady) {
      return null;
    }
    if (directionsServiceRef.current) {
      return directionsServiceRef.current;
    }
    const google = window.google;
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
  const retrieveSuggestionPoint = async (placeId) => {
    const lib = await ensurePlacesLibrary();
    if (!lib) {
      return null;
    }
    try {
      const place = new lib.Place({ id: placeId });
      await place.fetchFields({ fields: ["location"] });
      const location2 = place.location;
      const lat = typeof location2?.lat === "function" ? location2.lat() : Number(location2?.lat);
      const lon = typeof location2?.lng === "function" ? location2.lng() : Number(location2?.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        return null;
      }
      resetSessionToken();
      return { lat, lon };
    } catch {
      return null;
    }
  };
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const geocodeCache = useRef(/* @__PURE__ */ new Map());
  const routeDistanceCache = useRef(/* @__PURE__ */ new Map());
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
        if (!GOOGLE_MAPS_KEY) ;
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          setPickupSuggestions([]);
          return;
        }
        const getPredictions = async (useBias) => {
          const sessionToken = await getSessionToken();
          const request = {
            input: query,
            region: "pl",
            language: locale,
            sessionToken: sessionToken ?? void 0
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
        const results = predictions.map((suggestion) => suggestion.placePrediction).filter((prediction) => prediction?.placeId).map((prediction) => {
          const label = typeof prediction?.text?.text === "string" ? prediction.text.text : prediction?.text?.toString?.() ?? "";
          return {
            label,
            placeId: String(prediction.placeId ?? "")
          };
        }).filter((item) => item.label && item.placeId);
        if (!active) return;
        setPickupSuggestions(results);
        setPickupSuggestionStatus(results.length > 0 ? null : "ZERO_RESULTS");
      } catch {
        if (!active) return;
        setPickupSuggestions([]);
        setPickupSuggestionStatus("ERROR");
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
        if (!GOOGLE_MAPS_KEY) ;
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          setDestinationSuggestions([]);
          return;
        }
        const getPredictions = async (useBias) => {
          const sessionToken = await getSessionToken();
          const request = {
            input: query,
            region: "pl",
            language: locale,
            sessionToken: sessionToken ?? void 0
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
        const results = predictions.map((suggestion) => suggestion.placePrediction).filter((prediction) => prediction?.placeId).map((prediction) => {
          const label = typeof prediction?.text?.text === "string" ? prediction.text.text : prediction?.text?.toString?.() ?? "";
          return {
            label,
            placeId: String(prediction.placeId ?? "")
          };
        }).filter((item) => item.label && item.placeId);
        if (!active) return;
        setDestinationSuggestions(results);
        setDestinationSuggestionStatus(results.length > 0 ? null : "ZERO_RESULTS");
      } catch {
        if (!active) return;
        setDestinationSuggestions([]);
        setDestinationSuggestionStatus("ERROR");
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
    if (!googleReady) {
      setIsChecking(false);
      setError(null);
      return;
    }
    let active = true;
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsChecking(true);
      setError(null);
      const normalize = (value) => value.trim().toLowerCase();
      const geocodeAddress = async (value) => {
        const key = normalize(value);
        if (!key) return null;
        if (geocodeCache.current.has(key)) {
          return geocodeCache.current.get(key) ?? null;
        }
        const lib = await ensurePlacesLibrary();
        if (!lib) {
          return null;
        }
        const sessionToken = await getSessionToken();
        const request = {
          input: value,
          region: "pl",
          language: locale,
          locationBias: getLocationBounds(GDANSK_BIAS, GDANSK_RADIUS_METERS),
          sessionToken: sessionToken ?? void 0
        };
        const { suggestions } = await lib.AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        const prediction = Array.isArray(suggestions) ? suggestions[0]?.placePrediction : null;
        if (!prediction?.placeId) {
          geocodeCache.current.set(key, null);
          return null;
        }
        const place = prediction.toPlace ? prediction.toPlace() : new lib.Place({ id: prediction.placeId });
        await place.fetchFields({ fields: ["location"] });
        const location2 = place.location;
        const lat = typeof location2?.lat === "function" ? location2.lat() : Number(location2?.lat);
        const lon = typeof location2?.lng === "function" ? location2.lng() : Number(location2?.lng);
        const point = Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null;
        if (!point) {
          geocodeCache.current.set(key, null);
          return null;
        }
        resetSessionToken();
        geocodeCache.current.set(key, point);
        return point;
      };
      const getRouteInfo = async (from, to) => {
        const key = `${from.lat.toFixed(5)},${from.lon.toFixed(5)}|${to.lat.toFixed(5)},${to.lon.toFixed(5)}`;
        if (routeDistanceCache.current.has(key)) {
          const cached = routeDistanceCache.current.get(key);
          return cached ?? null;
        }
        const directions = ensureDirectionsService();
        if (!directions) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const google = window.google;
        const origin = new google.maps.LatLng(from.lat, from.lon);
        const destination = new google.maps.LatLng(to.lat, to.lon);
        const resultInfo = await new Promise((resolve) => {
          directions.route(
            {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
              provideRouteAlternatives: false
            },
            (result2, status) => {
              if (status !== google.maps.DirectionsStatus.OK) {
                resolve({ distance: null });
                return;
              }
              const meters = result2?.routes?.[0]?.legs?.[0]?.distance?.value;
              if (typeof meters !== "number" || !Number.isFinite(meters)) {
                resolve({ distance: null });
                return;
              }
              const overviewPath = result2?.routes?.[0]?.overview_path;
              const path = Array.isArray(overviewPath) ? overviewPath.map((point) => ({
                lat: typeof point?.lat === "function" ? point.lat() : Number(point?.lat),
                lon: typeof point?.lng === "function" ? point.lng() : Number(point?.lng)
              })).filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon)) : void 0;
              resolve({ distance: meters, path: path && path.length > 1 ? path : void 0 });
            }
          );
        });
        if (resultInfo.distance === null) {
          routeDistanceCache.current.set(key, null);
          return null;
        }
        const km = resultInfo.distance / 1e3;
        const info = { km, source: "google", path: resultInfo.path };
        routeDistanceCache.current.set(key, info);
        return info;
      };
      const isAirportPoint = (point) => distanceKm(point, AIRPORT_COORD) <= AIRPORT_RADIUS_KM;
      const isBaninoPoint = (point) => distanceKm(point, BANINO_COORD) <= BANINO_RADIUS_KM;
      const isZukowoPoint = (point) => distanceKm(point, ZUKOWO_COORD) <= ZUKOWO_RADIUS_KM;
      const getCenterKey = (point) => {
        const entries = Object.entries(centerPolygons);
        for (const [key, shape] of entries) {
          if (isPointInsideGeoJson(point, shape)) {
            return key;
          }
        }
        return null;
      };
      const getCityLabel = (cityKey) => {
        if (cityKey === "gdansk") return t.pricing.routes.gdansk;
        if (cityKey === "gdynia") return t.pricing.routes.gdynia;
        return "Sopot";
      };
      const computeFixedPrice = (vehicleType, isNight, distance, pickup, destination) => {
        const pickupIsAirport = isAirportPoint(pickup);
        const destinationIsAirport = isAirportPoint(destination);
        const isAirportRoute = pickupIsAirport || destinationIsAirport;
        const otherPoint = pickupIsAirport ? destination : destinationIsAirport ? pickup : null;
        const busMultiplier = vehicleType === "bus" ? 1.5 : 1;
        const pickupInGdansk = isPointInsideGeoJson(pickup, cityPolygons.gdansk);
        const destinationInGdansk = isPointInsideGeoJson(destination, cityPolygons.gdansk);
        getCenterKey(pickup) === "gdansk";
        getCenterKey(destination) === "gdansk";
        if (isAirportRoute && otherPoint) {
          let cityKey = getCenterKey(otherPoint);
          if (!cityKey) {
            if (distanceKm(otherPoint, GDYNIA_CENTER_COORD) <= GDYNIA_CENTER_RADIUS_KM) {
              cityKey = "gdynia";
            } else if (distanceKm(otherPoint, SOPOT_CENTER_COORD) <= SOPOT_CENTER_RADIUS_KM) {
              cityKey = "sopot";
            }
          }
          if (cityKey) {
            const price = isNight ? FIXED_PRICES[vehicleType][cityKey].night : FIXED_PRICES[vehicleType][cityKey].day;
            const cityLabel = getCityLabel(cityKey);
            return {
              price,
              allDay: false,
              routeLabel: `${t.pricing.routes.airport} ↔ ${cityLabel}`
            };
          }
        }
        if (isAirportRoute && otherPoint && isBaninoPoint(otherPoint)) {
          return {
            price: Math.round(120 * busMultiplier),
            allDay: true,
            routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance))
          };
        }
        if (isAirportRoute && otherPoint && isZukowoPoint(otherPoint)) {
          return {
            price: Math.round(150 * busMultiplier),
            allDay: true,
            routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance))
          };
        }
        if (isAirportRoute && otherPoint && isPointInsideGeoJson(otherPoint, cityPolygons.gdansk) && getCenterKey(otherPoint) !== "gdansk") {
          const gdanskAirportPrice = getGdanskCityPrice(distance);
          if (gdanskAirportPrice) {
            return {
              price: Math.round(gdanskAirportPrice * busMultiplier),
              allDay: true,
              routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance))
            };
          }
        }
        const gdanskFixedPrice = !isAirportRoute && pickupInGdansk && destinationInGdansk ? getGdanskCityPrice(distance) : null;
        if (gdanskFixedPrice) {
          return {
            price: Math.round(gdanskFixedPrice * busMultiplier),
            allDay: true,
            routeLabel: t.quoteForm.fixedRouteDistance(formatDistance(distance))
          };
        }
        return null;
      };
      try {
        const pickup = pickupMode === "airport" ? await geocodeAddress(AIRPORT_GEOCODE_QUERY) ?? AIRPORT_COORD : pickupPoint ?? await geocodeAddress(pickupAddress);
        const destination = destinationMode === "airport" ? await geocodeAddress(AIRPORT_GEOCODE_QUERY) ?? AIRPORT_COORD : destinationPoint ?? await geocodeAddress(destinationAddress);
        if (!pickup || !destination) {
          if (!active) return;
          setResult(null);
          setError(t.pricingCalculator.noResult);
          setIsChecking(false);
          return;
        }
        let routedDistanceResult = null;
        try {
          routedDistanceResult = await getRouteInfo(pickup, destination);
        } catch (err) {
          if (false) ;
          routedDistanceResult = null;
        }
        const straightDistance = distanceKm(pickup, destination);
        const distance = routedDistanceResult?.km ?? straightDistance;
        const distanceRounded = formatDistance(distance);
        const pickupInGdansk = isPointInsideGeoJson(pickup, cityPolygons.gdansk);
        const destinationInGdansk = isPointInsideGeoJson(destination, cityPolygons.gdansk);
        const pathStats = routedDistanceResult?.path ? getPathInsideStats(routedDistanceResult.path, (point) => isPointInsideGeoJson(point, cityPolygons.gdansk)) : null;
        const insideRatio = pathStats ? pathStats.insideRatio : estimateInsideRatio(
          pickup,
          destination,
          (point) => isPointInsideGeoJson(point, cityPolygons.gdansk)
        );
        const gdanskDistance = pathStats ? pathStats.insideKm : distance * insideRatio;
        const outsideDistance = pathStats ? pathStats.outsideKm : Math.max(0, distance - gdanskDistance);
        const debugInfo = showDebug ? {
          pickup,
          destination,
          straightDistance: Math.round(straightDistance * 100) / 100,
          routedDistance: routedDistanceResult?.km ?? null,
          routeSource: routedDistanceResult?.source ?? "none",
          insideRatio: Math.round(insideRatio * 1e3) / 1e3,
          gdanskKm: Math.round(gdanskDistance * 100) / 100,
          outsideKm: Math.round(outsideDistance * 100) / 100
        } : void 0;
        const standardDay = computeFixedPrice("standard", false, distance, pickup, destination);
        const standardNight = computeFixedPrice("standard", true, distance, pickup, destination);
        const busDay = computeFixedPrice("bus", false, distance, pickup, destination);
        const busNight = computeFixedPrice("bus", true, distance, pickup, destination);
        if (standardDay && busDay && standardNight && busNight) {
          setResult({
            type: "fixed",
            distanceKm: distanceRounded,
            routeLabel: standardDay.routeLabel,
            standard: { day: standardDay, night: standardNight },
            bus: { day: busDay, night: busNight },
            debug: debugInfo
          });
          setError(null);
          setIsChecking(false);
          return;
        }
        const outsideGdanskRoute = !(pickupInGdansk && destinationInGdansk);
        const touchesGdynia = centerPolygons.gdynia ? isPointInsideGeoJson(pickup, centerPolygons.gdynia) || isPointInsideGeoJson(destination, centerPolygons.gdynia) : false;
        const computeLong = (vehicleType, isNight) => {
          const busMultiplier = vehicleType === "bus" ? 1.5 : 1;
          const gdanskRate = isNight ? TAXIMETER_RATES.gdansk.night : TAXIMETER_RATES.gdansk.day;
          const outsideRate = isNight ? TAXIMETER_RATES.outside.night : TAXIMETER_RATES.outside.day;
          const taximeterPrice = roundPrice(
            (gdanskDistance * gdanskRate + outsideDistance * outsideRate) * busMultiplier,
            10
          );
          const taximeterRate = distance > 0 ? Math.round(taximeterPrice / distance * 100) / 100 : gdanskRate;
          const proposedBase = distance > 100 ? distance * 2 * (isNight ? 4 : 3) * busMultiplier : taximeterPrice * 0.9;
          const baseMinPrice = 120 * busMultiplier;
          const nightMinPrice = touchesGdynia ? 150 * busMultiplier : baseMinPrice;
          const outsideMinBase = outsideGdanskRoute ? getOutsideShortMinPrice(distance, isNight) : null;
          const outsideMinPrice = outsideMinBase ? outsideMinBase * busMultiplier : 0;
          const minPrice = Math.max(isNight ? nightMinPrice : baseMinPrice, outsideMinPrice);
          const proposedPrice = roundPrice(Math.max(proposedBase, minPrice), 10);
          const savingsPercent = taximeterPrice > 0 ? Math.max(0, Math.round((1 - proposedPrice / taximeterPrice) * 100)) : 0;
          return {
            taximeterPrice,
            taximeterRate,
            proposedPrice,
            savingsPercent
          };
        };
        setResult({
          type: "long",
          distanceKm: distanceRounded,
          routeLabel: `${pickupAddress} → ${destinationAddress}`,
          standard: {
            day: computeLong("standard", false),
            night: computeLong("standard", true)
          },
          bus: {
            day: computeLong("bus", false),
            night: computeLong("bus", true)
          },
          debug: debugInfo
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
  }, [pickupAddress, destinationAddress, pickupPoint, destinationPoint, locale, t, googleReady]);
  const renderPrice = (value) => {
    const eur = formatEur(value, eurRate);
    return /* @__PURE__ */ jsxs("div", { className: "min-w-[96px] text-right leading-tight", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-lg font-semibold text-gray-900", children: [
        value,
        " PLN"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-h-[16px] text-xs text-gray-500", children: eur ?? "" })
    ] });
  };
  const renderPriceSmall = (value) => {
    const eur = formatEur(value, eurRate);
    return /* @__PURE__ */ jsxs("div", { className: "min-w-[96px] text-right leading-tight", children: [
      /* @__PURE__ */ jsxs("div", { className: "text-xs font-semibold text-gray-700", children: [
        value,
        " PLN"
      ] }),
      /* @__PURE__ */ jsx("div", { className: "min-h-[16px] text-xs text-gray-500", children: eur ?? "" })
    ] });
  };
  const renderFixedCard = (label, day, night) => {
    const allDay = day.allDay || day.price === night.price;
    return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-3", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: allDay ? t.pricingCalculator.fixedAllDay : taximeterDayLabel }),
          renderPrice(day.price)
        ] }),
        !allDay && /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
          /* @__PURE__ */ jsxs("span", { className: "text-sm text-gray-600 leading-tight", children: [
            t.pricingCalculator.nightRate,
            " ",
            /* @__PURE__ */ jsx("span", { className: "pricing-sunday-note text-gray-400", children: t.pricing.sundayNote })
          ] }),
          renderPrice(night.price)
        ] })
      ] })
    ] });
  };
  const renderLongCard = (label, day, night) => {
    const showTaximeter = day.proposedPrice <= day.taximeterPrice && night.proposedPrice <= night.taximeterPrice;
    return /* @__PURE__ */ jsxs("div", { className: "flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500", children: label }),
      /* @__PURE__ */ jsxs("div", { className: "mt-4 space-y-4", children: [
        showTaximeter && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 mb-2", children: t.pricingCalculator.taximeterLabel }),
          /* @__PURE__ */ jsx("div", { className: "overflow-hidden rounded-lg border border-slate-200", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-xs", children: [
            /* @__PURE__ */ jsx("thead", { className: "bg-slate-50 text-slate-500", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-left font-medium", children: "Taryfa" }),
              /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-medium", children: "Stawka" }),
              /* @__PURE__ */ jsx("th", { className: "px-3 py-2 text-right font-medium", children: "Cena" })
            ] }) }),
            /* @__PURE__ */ jsxs("tbody", { className: "text-slate-700", children: [
              /* @__PURE__ */ jsxs("tr", { className: "border-t border-slate-200", children: [
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: taximeterDayLabel }),
                /* @__PURE__ */ jsxs("td", { className: "px-3 py-2 text-right", children: [
                  day.taximeterRate,
                  " PLN/km"
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right", children: renderPriceSmall(day.taximeterPrice) })
              ] }),
              /* @__PURE__ */ jsxs("tr", { className: "border-t border-slate-200", children: [
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2", children: /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
                  /* @__PURE__ */ jsx("div", { children: t.pricingCalculator.nightRate }),
                  /* @__PURE__ */ jsx("div", { className: "pricing-sunday-note text-slate-500", children: t.pricing.sundayNote })
                ] }) }),
                /* @__PURE__ */ jsxs("td", { className: "px-3 py-2 text-right", children: [
                  night.taximeterRate,
                  " PLN/km"
                ] }),
                /* @__PURE__ */ jsx("td", { className: "px-3 py-2 text-right", children: renderPriceSmall(night.taximeterPrice) })
              ] })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "rounded-xl px-4 py-3 shadow-sm",
            style: { border: "1px solid #bfdbfe", backgroundColor: "#eff6ff" },
            children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-4", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(
                "div",
                {
                  className: "inline-flex items-center gap-2 rounded-full font-semibold uppercase tracking-wide shadow-sm",
                  style: {
                    backgroundColor: "#bbf7d0",
                    color: "#065f46",
                    padding: "clamp(4px, 1.5vw, 6px) clamp(10px, 2.5vw, 12px)",
                    fontSize: "clamp(10px, 2.6vw, 11px)"
                  },
                  children: t.pricingCalculator.guaranteedPriceLabel
                }
              ) }) }),
              /* @__PURE__ */ jsxs("div", { className: "w-full max-w-[420px]", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-3 sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-white/70 px-3 py-2", children: [
                    /* @__PURE__ */ jsx("div", { className: "text-emerald-700", style: { fontSize: "clamp(11px, 2.8vw, 12px)" }, children: guaranteedDayLabel() }),
                    /* @__PURE__ */ jsx("div", { className: "mt-1 flex items-center gap-2", children: renderPrice(day.proposedPrice) })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "rounded-lg border border-slate-200 bg-white/70 px-3 py-2", children: [
                    /* @__PURE__ */ jsxs("div", { className: "leading-tight", children: [
                      /* @__PURE__ */ jsx("div", { className: "text-emerald-700", style: { fontSize: "clamp(11px, 2.8vw, 12px)" }, children: t.pricingCalculator.nightRate }),
                      /* @__PURE__ */ jsx("div", { className: "pricing-sunday-note text-slate-500", children: t.pricing.sundayNote })
                    ] }),
                    /* @__PURE__ */ jsx("div", { className: "mt-1 flex items-center gap-2", children: renderPrice(night.proposedPrice) })
                  ] })
                ] }),
                showTaximeter && day.savingsPercent > 0 && /* @__PURE__ */ jsxs("div", { className: "mt-2 hidden gap-3 sm:grid sm:grid-cols-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "inline-flex items-center rounded-full font-semibold shadow-sm",
                      style: {
                        backgroundColor: "#ffe4e6",
                        color: "#be123c",
                        padding: "clamp(3px, 1.2vw, 5px) clamp(8px, 2vw, 10px)",
                        fontSize: "clamp(9px, 2.2vw, 10px)"
                      },
                      children: [
                        "-",
                        day.savingsPercent,
                        "%"
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ jsx("div", { className: "flex items-center justify-center", children: night.savingsPercent > 0 && /* @__PURE__ */ jsxs(
                    "div",
                    {
                      className: "inline-flex items-center rounded-full font-semibold shadow-sm",
                      style: {
                        backgroundColor: "#ffe4e6",
                        color: "#be123c",
                        padding: "clamp(3px, 1.2vw, 5px) clamp(8px, 2vw, 10px)",
                        fontSize: "clamp(9px, 2.2vw, 10px)"
                      },
                      children: [
                        "-",
                        night.savingsPercent,
                        "%"
                      ]
                    }
                  ) })
                ] })
              ] })
            ] })
          }
        )
      ] })
    ] });
  };
  return /* @__PURE__ */ jsx("section", { id: "pricing-calculator", className: "py-12 bg-slate-50", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "rounded-3xl border border-slate-200 bg-white p-8 shadow-sm", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-start justify-between gap-4 flex-wrap", children: /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700", children: [
        /* @__PURE__ */ jsx(Calculator, { className: "h-3.5 w-3.5" }),
        t.pricingCalculator.title
      ] }),
      /* @__PURE__ */ jsx("h2", { className: "text-2xl text-gray-900 mt-4", children: t.pricingCalculator.title }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-600 mt-2", children: t.pricingCalculator.subtitle })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: t.pricingCalculator.pickupLabel }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", style: { height: "2.5rem" }, children: destinationMode !== "airport" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-nowrap items-center gap-4 text-sm text-slate-700 whitespace-nowrap", style: { height: "2.5rem" }, children: [
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "pickup-mode",
                value: "airport",
                checked: pickupMode === "airport",
                onChange: () => {
                  setPickupMode("airport");
                  setPickupAddress(airportAddress);
                  setPickupPoint(null);
                  setPickupSuggestions([]);
                },
                className: "h-4 w-4 text-blue-600"
              }
            ),
            t.pricingCalculator.airportLabel
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "pickup-mode",
                value: "custom",
                checked: pickupMode === "custom",
                onChange: () => {
                  setPickupMode("custom");
                  setPickupAddress("");
                  setPickupPoint(null);
                },
                className: "h-4 w-4 text-blue-600"
              }
            ),
            t.pricingCalculator.pickupCustomLabel
          ] })
        ] }) : /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: { height: "2.5rem" } }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus-within:border-blue-500 ${pickupMode === "airport" ? "bg-slate-100" : "bg-white"}`,
            children: [
              /* @__PURE__ */ jsx(MapPin, { className: "h-4 w-4 text-blue-600" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: pickupAddress,
                  onChange: (event) => {
                    setPickupAddress(event.target.value);
                    setPickupPoint(null);
                  },
                  onFocus: () => setActiveSuggestionField("pickup"),
                  onBlur: () => setActiveSuggestionField(null),
                  placeholder: t.pricingCalculator.pickupPlaceholder,
                  className: "w-full bg-transparent text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500",
                  disabled: pickupMode === "airport"
                }
              ),
              pickupAddress.trim().length > 0 && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setPickupAddress("");
                    setPickupPoint(null);
                    setPickupSuggestions([]);
                    if (pickupMode === "airport") {
                      setPickupMode("custom");
                    }
                  },
                  className: "inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700",
                  "aria-label": "Clear pickup",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ]
          }
        ),
        activeSuggestionField === "pickup" && pickupSuggestions.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm", children: pickupSuggestions.map((item, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50",
            onMouseDown: (event) => {
              event.preventDefault();
              setPickupAddress(item.label);
              setPickupPoint(null);
              setPickupSuggestions([]);
              setActiveSuggestionField(null);
              retrieveSuggestionPoint(item.placeId).then((point) => {
                if (point) {
                  setPickupPoint(point);
                }
              }).catch(() => void 0);
            },
            children: item.label
          }
        ) }, `${item.placeId}-${index}`)) }),
        activeSuggestionField === "pickup" && pickupSuggestions.length === 0 && pickupSuggestionStatus && /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600", children: "Brak podpowiedzi." })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "block", children: [
        /* @__PURE__ */ jsx("span", { className: "text-sm text-gray-600", children: t.pricingCalculator.destinationLabel }),
        /* @__PURE__ */ jsx("div", { className: "mt-2", style: { height: "2.5rem" }, children: pickupMode !== "airport" ? /* @__PURE__ */ jsxs("div", { className: "flex flex-nowrap items-center gap-4 text-sm text-slate-700 whitespace-nowrap", style: { height: "2.5rem" }, children: [
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "destination-mode",
                value: "airport",
                checked: destinationMode === "airport",
                onChange: () => {
                  setDestinationMode("airport");
                  setDestinationAddress(airportAddress);
                  setDestinationPoint(null);
                  setDestinationSuggestions([]);
                },
                className: "h-4 w-4 text-blue-600"
              }
            ),
            t.pricingCalculator.airportLabel
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "inline-flex items-center gap-2 whitespace-nowrap", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "radio",
                name: "destination-mode",
                value: "custom",
                checked: destinationMode === "custom",
                onChange: () => {
                  setDestinationMode("custom");
                  setDestinationAddress("");
                  setDestinationPoint(null);
                },
                className: "h-4 w-4 text-blue-600"
              }
            ),
            t.pricingCalculator.destinationCustomLabel
          ] })
        ] }) : /* @__PURE__ */ jsx("div", { "aria-hidden": "true", style: { height: "2.5rem" } }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: `mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 shadow-sm focus-within:border-blue-500 ${destinationMode === "airport" ? "bg-slate-100" : "bg-white"}`,
            children: [
              /* @__PURE__ */ jsx(Navigation, { className: "h-4 w-4 text-blue-600" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: destinationAddress,
                  onChange: (event) => {
                    setDestinationAddress(event.target.value);
                    setDestinationPoint(null);
                  },
                  onFocus: () => setActiveSuggestionField("destination"),
                  onBlur: () => setActiveSuggestionField(null),
                  placeholder: t.pricingCalculator.destinationPlaceholder,
                  className: "w-full bg-transparent text-sm text-gray-900 outline-none disabled:cursor-not-allowed disabled:text-slate-500",
                  disabled: destinationMode === "airport"
                }
              ),
              destinationAddress.trim().length > 0 && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setDestinationAddress("");
                    setDestinationPoint(null);
                    setDestinationSuggestions([]);
                    if (destinationMode === "airport") {
                      setDestinationMode("custom");
                    }
                  },
                  className: "inline-flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700",
                  "aria-label": "Clear destination",
                  children: /* @__PURE__ */ jsx(X, { className: "h-4 w-4" })
                }
              )
            ]
          }
        ),
        activeSuggestionField === "destination" && destinationSuggestions.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-2 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg text-sm", children: destinationSuggestions.map((item, index) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "w-full px-3 py-2 text-left text-slate-700 hover:bg-blue-50",
            onMouseDown: (event) => {
              event.preventDefault();
              setDestinationAddress(item.label);
              setDestinationPoint(null);
              setDestinationSuggestions([]);
              setActiveSuggestionField(null);
              retrieveSuggestionPoint(item.placeId).then((point) => {
                if (point) {
                  setDestinationPoint(point);
                }
              }).catch(() => void 0);
            },
            children: item.label
          }
        ) }, `${item.placeId}-${index}`)) }),
        activeSuggestionField === "destination" && destinationSuggestions.length === 0 && destinationSuggestionStatus && /* @__PURE__ */ jsx("div", { className: "mt-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600", children: "Brak podpowiedzi." })
      ] })
    ] }),
    isChecking && /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-700", children: t.pricingCalculator.loading }),
    !isChecking && error && /* @__PURE__ */ jsx("div", { className: "mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800", children: error }),
    !isChecking && result && /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "rounded-2xl border border-slate-200 bg-slate-50 p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-xs uppercase tracking-wide text-slate-500", children: t.pricingCalculator.distanceLabel }),
        /* @__PURE__ */ jsx("div", { className: "mt-2 text-sm text-gray-700", children: result.routeLabel }),
        /* @__PURE__ */ jsxs("div", { className: "mt-1 text-lg font-semibold text-gray-900", children: [
          result.distanceKm,
          " km"
        ] }),
        showDebug && result.debug && /* @__PURE__ */ jsxs("div", { className: "mt-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            "pickup: ",
            result.debug.pickup.lat.toFixed(5),
            ", ",
            result.debug.pickup.lon.toFixed(5)
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "destination: ",
            result.debug.destination.lat.toFixed(5),
            ", ",
            result.debug.destination.lon.toFixed(5)
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "straight: ",
            result.debug.straightDistance,
            " km"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "routed: ",
            result.debug.routedDistance ? `${Math.round(result.debug.routedDistance * 100) / 100} km` : "null"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "source: ",
            result.debug.routeSource
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "insideRatio: ",
            result.debug.insideRatio
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "gdanskKm: ",
            result.debug.gdanskKm,
            " km"
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            "outsideKm: ",
            result.debug.outsideKm,
            " km"
          ] })
        ] })
      ] }),
      result.type === "fixed" ? /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 mb-3", children: t.pricingCalculator.resultsTitle }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          renderFixedCard(t.pricingCalculator.standard, result.standard.day, result.standard.night),
          renderFixedCard(t.pricingCalculator.bus, result.bus.day, result.bus.night)
        ] })
      ] }) : /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-600 mb-3", children: t.pricingCalculator.longRouteTitle }),
        /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
          renderLongCard(t.pricingCalculator.standard, result.standard.day, result.standard.night),
          renderLongCard(t.pricingCalculator.bus, result.bus.day, result.bus.night)
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: t.pricingCalculator.note }),
      /* @__PURE__ */ jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsx(
        "a",
        {
          href: pricingBookingHref,
          onClick: (event) => {
            event.preventDefault();
            const scrolled = requestScrollTo("pricing-booking");
            if (!scrolled) {
              window.location.href = pricingBookingHref;
            }
          },
          className: "inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700",
          children: t.pricingCalculator.orderNow
        }
      ) })
    ] })
  ] }) }) });
}

function PricingPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);
  usePageTitle(t.pricingLanding.title);
  const isDirectEntryRef = useRef(false);
  const [vehicleType, setVehicleType] = useState("standard");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const orderLinks = [
    {
      href: `${basePath}/${getRouteSlug(locale, "orderAirportGdansk")}`,
      label: t.routeLanding.orderLinks.airportGdansk
    },
    {
      href: `${basePath}/${getRouteSlug(locale, "orderAirportSopot")}`,
      label: t.routeLanding.orderLinks.airportSopot
    },
    {
      href: `${basePath}/${getRouteSlug(locale, "orderAirportGdynia")}`,
      label: t.routeLanding.orderLinks.airportGdynia
    },
    {
      href: `${basePath}/${getRouteSlug(locale, "orderCustom")}`,
      label: t.routeLanding.orderLinks.custom
    }
  ];
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const referrer = document.referrer;
    if (!referrer) {
      isDirectEntryRef.current = true;
      return;
    }
    try {
      const referrerOrigin = new URL(referrer).origin;
      isDirectEntryRef.current = referrerOrigin !== window.location.origin;
    } catch {
      isDirectEntryRef.current = true;
    }
  }, []);
  useEffect(() => {
    if (showQuoteForm) {
      trackFormOpen("quote");
    }
  }, [showQuoteForm]);
  const handleCloseModal = (close) => {
    if (isDirectEntryRef.current) {
      navigate(`${basePath}/`, { replace: true });
      return;
    }
    close();
  };
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const hash = window.location.hash;
    if (!hash) {
      return;
    }
    const targetId = hash.replace("#", "");
    if (!targetId) {
      return;
    }
    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      if (scrollToId(targetId) || attempts > 10) {
        return;
      }
      window.setTimeout(tryScroll, 120);
    };
    tryScroll();
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50 pb-32 sm:pb-0", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "bg-white border-b border-gray-200", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 py-12", children: /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-3xl p-8 shadow-sm", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { label: t.common.home, href: `${basePath}/` },
              { label: t.pricingLanding.title }
            ]
          }
        ),
        /* @__PURE__ */ jsx("h1", { className: "text-3xl text-gray-900 mb-4", children: t.pricingLanding.title }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-600 mb-4", children: t.pricingLanding.subtitle }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: t.pricingLanding.description }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-stretch gap-3 sm:flex-row sm:items-center", children: [
          /* @__PURE__ */ jsx(
            "a",
            {
              href: `${basePath}/${getRouteSlug(locale, "pricing")}#pricing-booking`,
              onClick: (event) => {
                event.preventDefault();
                trackCtaClick("pricing_landing_order");
                const scrolled = requestScrollTo("pricing-booking");
                if (!scrolled) {
                  window.location.href = `${basePath}/${getRouteSlug(locale, "pricing")}#pricing-booking`;
                }
              },
              className: "inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-700 px-6 py-3 text-white shadow-lg transition-colors hover:bg-orange-600 sm:w-auto animate-pulse-glow",
              children: t.pricingLanding.cta
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                trackCtaClick("pricing_landing_calculator");
                const scrolled = requestScrollTo("pricing-calculator");
                if (!scrolled) {
                  window.location.href = `${basePath}/${getRouteSlug(locale, "pricing")}#pricing-calculator`;
                }
              },
              className: "gemini-cta inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50 sm:w-auto",
              children: [
                /* @__PURE__ */ jsx(Calculator, { className: "h-4 w-4" }),
                t.pricingLanding.calculatorCta
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => {
                trackNavClick("pricing_table");
                requestScrollTo("pricing-table");
              },
              className: "inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm transition-colors hover:border-gray-400 hover:text-gray-900 sm:w-auto",
              children: t.routeLanding.pricingLink
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-4 flex flex-col items-start gap-2 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3", children: [
          /* @__PURE__ */ jsx("span", { className: "text-xs uppercase tracking-wide text-gray-400", children: t.routeLanding.quickLinks }),
          orderLinks.map((link) => /* @__PURE__ */ jsx(
            "a",
            {
              href: link.href,
              onClick: () => trackNavClick("pricing_landing_order_link"),
              className: "text-blue-600 hover:text-blue-700",
              children: link.label
            },
            link.href
          ))
        ] })
      ] }) }) }),
      /* @__PURE__ */ jsx(PricingCalculator, {}),
      /* @__PURE__ */ jsx("section", { className: "py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-3", children: t.pricingLanding.highlights.map((item) => /* @__PURE__ */ jsxs("div", { className: "bg-white border border-gray-200 rounded-2xl p-6", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-gray-900 mb-2", children: item.title }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: item.body })
      ] }, item.title)) }) }),
      /* @__PURE__ */ jsx(
        Pricing,
        {
          vehicleType,
          onOrderRoute: (route) => {
            trackFormOpen("order");
            setSelectedRoute(route);
          },
          onRequestQuote: () => setShowQuoteForm(true),
          onBack: () => setVehicleType("standard"),
          showBack: false,
          variant: "landing",
          onVehicleTypeChange: setVehicleType
        }
      ),
      /* @__PURE__ */ jsx("section", { className: "py-12 bg-white border-t border-gray-200", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto px-4", children: [
        /* @__PURE__ */ jsx("h2", { className: "text-xl text-gray-900 mb-4", children: t.pricingLanding.faqTitle }),
        /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-2 max-w-4xl", children: t.pricingLanding.faq.map((entry) => /* @__PURE__ */ jsxs("div", { className: "bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: entry.question }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: entry.answer })
        ] }, entry.question)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, { orderTargetId: "pricing-booking", hide: Boolean(selectedRoute || showQuoteForm) }),
    selectedRoute && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(OrderForm, { route: selectedRoute, onClose: () => handleCloseModal(() => setSelectedRoute(null)) }) }),
    showQuoteForm && /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(QuoteForm, { onClose: () => handleCloseModal(() => setShowQuoteForm(false)), initialVehicleType: vehicleType }) })
  ] });
}

export { PricingPage };
