import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useMemo, useEffect, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { u as useI18n, d as trackFormOpen, l as localeToPath, c as FloatingActions } from '../entry-server.mjs';
import { OrderForm } from './OrderForm-BKkVBRaJ.mjs';
import { Q as QuoteForm } from './QuoteForm-Ds4HynrK.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'lucide-react';
import 'react-dom';
import './orderNotes-Bh0j39S6.mjs';
import './api-DBSK1IQb.mjs';

function OrderRoutePage({ routeKey }) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);
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
  const { locale } = useI18n();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);
  useEffect(() => {
    trackFormOpen("quote");
  }, []);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Suspense, { fallback: null, children: /* @__PURE__ */ jsx(QuoteForm, { onClose: () => navigate(`${basePath}/`, { replace: true }), initialVehicleType: "standard" }) }),
    /* @__PURE__ */ jsx(FloatingActions, { hide: true })
  ] });
}

export { CustomOrderPage, OrderRoutePage };
