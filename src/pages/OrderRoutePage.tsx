import { Suspense, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FloatingActions } from '../components/FloatingActions';
import { OrderForm } from '../components/OrderForm';
import { QuoteForm } from '../components/QuoteForm';
import { trackFormOpen } from '../lib/tracking';
import { localeToPath, useI18n } from '../lib/i18n';
import { usePageTitle } from '../lib/usePageTitle';

type OrderRouteKey = 'airportTaxi' | 'airportSopot' | 'airportGdynia';

interface OrderRoutePageProps {
  routeKey: OrderRouteKey;
}

export function OrderRoutePage({ routeKey }: OrderRoutePageProps) {
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);
  const orderTitle =
    routeKey === 'airportSopot'
      ? t.routeLanding.orderLinks.airportSopot
      : routeKey === 'airportGdynia'
        ? t.routeLanding.orderLinks.airportGdynia
        : t.routeLanding.orderLinks.airportGdansk;
  usePageTitle(orderTitle);

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
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const basePath = localeToPath(locale);
  usePageTitle(t.routeLanding.orderLinks.custom);
  const vehicleParam = searchParams.get('vehicle');
  const initialVehicleType = vehicleParam === 'bus' ? 'bus' : 'standard';

  useEffect(() => {
    trackFormOpen('quote');
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <QuoteForm onClose={() => navigate(`${basePath}/`, { replace: true })} initialVehicleType={initialVehicleType} />
      </Suspense>
      <FloatingActions hide />
    </>
  );
}
