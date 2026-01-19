import { Suspense, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FloatingActions } from '../components/FloatingActions';
import { OrderForm } from '../components/OrderForm';
import { QuoteForm } from '../components/QuoteForm';
import { trackFormOpen } from '../lib/tracking';
import { localeToPath, useI18n } from '../lib/i18n';

type OrderRouteKey = 'airportTaxi' | 'airportSopot' | 'airportGdynia';

interface OrderRoutePageProps {
  routeKey: OrderRouteKey;
}

export function OrderRoutePage({ routeKey }: OrderRoutePageProps) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);

  const route = useMemo(() => {
    if (routeKey === 'airportSopot') {
      return {
        from: t.pricing.routes.airport,
        to: 'Sopot',
        priceDay: t.pages.gdanskSopot.priceDay,
        priceNight: t.pages.gdanskSopot.priceNight,
        type: 'standard' as const,
      };
    }
    if (routeKey === 'airportGdynia') {
      return {
        from: t.pricing.routes.airport,
        to: t.pricing.routes.gdynia,
        priceDay: t.pages.gdanskGdynia.priceDay,
        priceNight: t.pages.gdanskGdynia.priceNight,
        type: 'standard' as const,
      };
    }
    return {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: t.pages.gdanskTaxi.priceDay,
      priceNight: t.pages.gdanskTaxi.priceNight,
      type: 'standard' as const,
    };
  }, [routeKey, t]);

  useEffect(() => {
    trackFormOpen('order');
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <OrderForm
          route={route}
          onClose={() => navigate(`${basePath}/`, { replace: true })}
        />
      </Suspense>
      <FloatingActions hide />
    </>
  );
}

export function CustomOrderPage() {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);

  useEffect(() => {
    trackFormOpen('quote');
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <QuoteForm onClose={() => navigate(`${basePath}/`, { replace: true })} />
      </Suspense>
      <FloatingActions hide />
    </>
  );
}
