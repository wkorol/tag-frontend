import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useMemo, useEffect, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { u as useI18n, a as usePageTitle, d as trackFormOpen, l as localeToPath, c as FloatingActions } from '../entry-server.mjs';
import { OrderForm } from './OrderForm-B6Q1Hrxn.mjs';
import { Q as QuoteForm } from './QuoteForm-yCDM8bAf.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'lucide-react';
import 'react-dom';
import './currency-BfL_L89a.mjs';
import './orderNotes-Bh0j39S6.mjs';
import './scrollLock-Db1Ed-19.mjs';
import './fixedPricing-BrEVc9Vy.mjs';

function OrderRoutePage({ routeKey }) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);
  const orderTitle = routeKey === "airportSopot" ? t.routeLanding.orderLinks.airportSopot : routeKey === "airportGdynia" ? t.routeLanding.orderLinks.airportGdynia : t.routeLanding.orderLinks.airportGdansk;
  usePageTitle(orderTitle);
  const route = useMemo(() => {
    if (routeKey === "airportSopot") {
      return {
        from: t.pricing.routes.airport,
        to: "Sopot",
        priceDay: t.pages.gdanskSopot.priceDay,
        priceNight: t.pages.gdanskSopot.priceNight,
        type: "standard"
      };
    }
    if (routeKey === "airportGdynia") {
      return {
        from: t.pricing.routes.airport,
        to: t.pricing.routes.gdynia,
        priceDay: t.pages.gdanskGdynia.priceDay,
        priceNight: t.pages.gdanskGdynia.priceNight,
        type: "standard"
      };
    }
    return {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: t.pages.gdanskTaxi.priceDay,
      priceNight: t.pages.gdanskTaxi.priceNight,
      type: "standard"
    };
  }, [routeKey, t]);
  useEffect(() => {
    trackFormOpen("order");
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(
      OrderForm,
      {
        route,
        onClose: () => navigate(`${basePath}/`, { replace: true })
      }
    ) }),
    /* @__PURE__ */ jsx(FloatingActions, { hide: true })
  ] });
}
function CustomOrderPage() {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const basePath = localeToPath(locale);
  usePageTitle(t.routeLanding.orderLinks.custom);
  const vehicleParam = searchParams.get("vehicle");
  const initialVehicleType = vehicleParam === "bus" ? "bus" : "standard";
  useEffect(() => {
    trackFormOpen("quote");
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(QuoteForm, { onClose: () => navigate(`${basePath}/`, { replace: true }), initialVehicleType }) }),
    /* @__PURE__ */ jsx(FloatingActions, { hide: true })
  ] });
}

export { CustomOrderPage, OrderRoutePage };
