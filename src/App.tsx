import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CookieBanner } from './components/CookieBanner';
import { FloatingActions } from './components/FloatingActions';
import { CookiesPage } from './pages/CookiesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CountryLanding } from './pages/CountryLanding';
import { CountryAirportLanding } from './pages/CountryAirportLanding';
import { CityRouteLanding } from './pages/CityRouteLanding';
import { TaxiGdanskPage } from './pages/TaxiGdanskPage';
const VehicleTypeSelector = lazy(() =>
  import('./components/VehicleTypeSelector').then((mod) => ({ default: mod.VehicleTypeSelector }))
);
const Pricing = lazy(() => import('./components/Pricing').then((mod) => ({ default: mod.Pricing })));
const TrustSection = lazy(() =>
  import('./components/TrustSection').then((mod) => ({ default: mod.TrustSection }))
);
const Footer = lazy(() => import('./components/Footer').then((mod) => ({ default: mod.Footer })));
const OrderForm = lazy(() => import('./components/OrderForm').then((mod) => ({ default: mod.OrderForm })));
const QuoteForm = lazy(() => import('./components/QuoteForm').then((mod) => ({ default: mod.QuoteForm })));
const ManageOrder = lazy(() => import('./components/ManageOrder').then((mod) => ({ default: mod.ManageOrder })));
const RouteLanding = lazy(() => import('./pages/RouteLanding').then((mod) => ({ default: mod.RouteLanding })));
const OrderRoutePage = lazy(() => import('./pages/OrderRoutePage').then((mod) => ({ default: mod.OrderRoutePage })));
const CustomOrderPage = lazy(() => import('./pages/OrderRoutePage').then((mod) => ({ default: mod.CustomOrderPage })));
const PricingPage = lazy(() => import('./pages/PricingPage').then((mod) => ({ default: mod.PricingPage })));
const AdminOrdersPage = lazy(() => import('./pages/AdminOrdersPage').then((mod) => ({ default: mod.AdminOrdersPage })));
const AdminOrderPage = lazy(() => import('./pages/AdminOrderPage').then((mod) => ({ default: mod.AdminOrderPage })));
import { trackFormOpen, trackPageView, trackSectionView, trackVehicleSelect } from './lib/tracking';
import { consumeScrollTarget, scrollToId } from './lib/scroll';
import { getRouteSlug, PublicRouteKey } from './lib/routes';
import { Locale, localeToPath, localeToRootPath, useI18n } from './lib/i18n';
import { getCountryAirports } from './lib/countryAirports';
import { getCityRoutes } from './lib/cityRoutes';

const renderCountryAirportRoutes = (locale: Locale) =>
  getCountryAirports(locale).map((airport) => (
    <Route key={airport.slug} path={airport.slug} element={<CountryAirportLanding />} />
  ));

const renderCityRouteRoutes = (locale: Locale) =>
  getCityRoutes(locale).map((route) => (
    <Route key={route.slug} path={route.slug} element={<CityRouteLanding />} />
  ));

const SUPPORTED_LOCALES: Locale[] = ['en', 'de', 'fi', 'no', 'sv', 'da', 'pl'];

function Landing() {
  const { t } = useI18n();
  const [step, setStep] = useState<'vehicle' | 'pricing'>('vehicle');
  const [vehicleType, setVehicleType] = useState<'standard' | 'bus'>('standard');
  const [selectedRoute, setSelectedRoute] = useState<{ from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' } | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [pricingTracked, setPricingTracked] = useState(false);
  
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // If orderId is present, show manage order page
  if (orderId) {
    return (
      <Suspense fallback={null}>
        <ManageOrder orderId={orderId} />
      </Suspense>
    );
  }

  const handleVehicleSelect = (type: 'standard' | 'bus') => {
    trackVehicleSelect(type);
    setVehicleType(type);
    setStep('pricing');
    window.requestAnimationFrame(() => {
      document.getElementById('vehicle-selection')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleBackToVehicleSelection = () => {
    setStep('vehicle');
  };

  const handleOrderRoute = (route: { from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' }) => {
    trackFormOpen('order');
    setSelectedRoute(route);
  };

  const handleRequestQuote = () => {
    trackFormOpen('quote');
    setShowQuoteForm(true);
  };

  useEffect(() => {
    const updateVisibility = () => {
      const target = document.getElementById('vehicle-selection');
      if (!target) {
        return;
      }
      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const reached = window.scrollY >= targetTop - 120;
      if (reached && !pricingTracked) {
        setPricingTracked(true);
        trackSectionView('vehicle_selection');
      }
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, [pricingTracked]);

  useEffect(() => {
    const hash = window.location.hash;
    let targetId = '';
    if (hash) {
      targetId = hash.replace('#', '');
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    if (!targetId) {
      targetId = consumeScrollTarget() ?? '';
    }
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
  }, [step]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-0">
      <Navbar />
      <main>
        <Hero />
        
        <div className="defer-render">
          <Suspense fallback={null}>
            {step === 'vehicle' ? (
              <VehicleTypeSelector onSelectType={handleVehicleSelect} />
            ) : (
              <Pricing
                vehicleType={vehicleType}
                onOrderRoute={handleOrderRoute}
                onRequestQuote={handleRequestQuote}
                onBack={handleBackToVehicleSelection}
              />
            )}
          </Suspense>
        </div>

        <div className="defer-render">
          <Suspense fallback={null}>
            <TrustSection />
          </Suspense>
        </div>
      </main>

      <div className="defer-render">
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>

      {selectedRoute && (
        <Suspense fallback={null}>
          <OrderForm 
            route={selectedRoute}
            onClose={() => setSelectedRoute(null)}
          />
        </Suspense>
      )}

      {showQuoteForm && (
        <Suspense fallback={null}>
          <QuoteForm 
            onClose={() => {
              setShowQuoteForm(false);
            }}
            initialVehicleType={vehicleType}
          />
        </Suspense>
      )}
      <FloatingActions hide={Boolean(selectedRoute || showQuoteForm)} />
    </div>
  );
}

const renderLocalizedRoutes = (locale: Locale, t: ReturnType<typeof useI18n>['t']) => {
  const isPolish = locale === 'pl';

  return (
    <Route key={locale} path={`/${locale}`} element={<LocalizedShell locale={locale} />}>
      <Route index element={<Landing />} />
      <Route path={getRouteSlug(locale, 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
      <Route path={getRouteSlug(locale, 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
      <Route path={getRouteSlug(locale, 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
      <Route path={getRouteSlug(locale, 'orderCustom')} element={<CustomOrderPage />} />
      <Route path={getRouteSlug(locale, 'pricing')} element={<PricingPage />} />
      <Route path="admin" element={<AdminOrdersPage />} />
      <Route path="admin/orders/:id" element={<AdminOrderPage />} />
      <Route path={getRouteSlug(locale, 'cookies')} element={<CookiesPage />} />
      <Route path={getRouteSlug(locale, 'privacy')} element={<PrivacyPage />} />
      <Route path={getRouteSlug(locale, 'countryLanding')} element={<CountryLanding />} />
      <Route path={getRouteSlug(locale, 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
      {renderCountryAirportRoutes(locale)}
      {isPolish ? renderCityRouteRoutes(locale) : null}
      <Route
        path={getRouteSlug(locale, 'airportTaxi')}
        element={
          <RouteLanding
            title={t.pages.gdanskTaxi.title}
            description={t.pages.gdanskTaxi.description}
            route={t.pages.gdanskTaxi.route}
            examples={t.pages.gdanskTaxi.examples}
            pricing={{ day: t.pages.gdanskTaxi.priceDay, night: t.pages.gdanskTaxi.priceNight }}
          />
        }
      />
      <Route
        path={getRouteSlug(locale, 'airportSopot')}
        element={
          <RouteLanding
            title={t.pages.gdanskSopot.title}
            description={t.pages.gdanskSopot.description}
            route={t.pages.gdanskSopot.route}
            examples={t.pages.gdanskSopot.examples}
            pricing={{ day: t.pages.gdanskSopot.priceDay, night: t.pages.gdanskSopot.priceNight }}
          />
        }
      />
      <Route
        path={getRouteSlug(locale, 'airportGdynia')}
        element={
          <RouteLanding
            title={t.pages.gdanskGdynia.title}
            description={t.pages.gdanskGdynia.description}
            route={t.pages.gdanskGdynia.route}
            examples={t.pages.gdanskGdynia.examples}
            pricing={{ day: t.pages.gdanskGdynia.priceDay, night: t.pages.gdanskGdynia.priceNight }}
          />
        }
      />
      {isPolish ? (
        <>
          <Route path="gdansk-airport-taxi" element={<LegacyRedirectToRoute routeKey="airportTaxi" />} />
          <Route path="gdansk-airport-to-sopot" element={<LegacyRedirectToRoute routeKey="airportSopot" />} />
          <Route path="gdansk-airport-to-gdynia" element={<LegacyRedirectToRoute routeKey="airportGdynia" />} />
          <Route path="cookies" element={<LegacyRedirectToRoute routeKey="cookies" />} />
          <Route path="privacy" element={<LegacyRedirectToRoute routeKey="privacy" />} />
        </>
      ) : null}
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  );
};

export default function App() {
  const { t } = useI18n();
  const location = useLocation();

  useEffect(() => {
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search]);

  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<AutoRedirect />} />
          {SUPPORTED_LOCALES.map((locale) => renderLocalizedRoutes(locale, t))}
          <Route path="/cookies" element={<LegacyRedirectToRoute routeKey="cookies" />} />
          <Route path="/privacy" element={<LegacyRedirectToRoute routeKey="privacy" />} />
          <Route path="/pricing" element={<LegacyRedirectToRoute routeKey="pricing" />} />
          <Route path="/admin" element={<LegacyRedirect to="admin" />} />
          <Route path="/admin/orders/:id" element={<LegacyAdminOrderRedirect />} />
          <Route path="/gdansk-airport-taxi" element={<LegacyRedirectToRoute routeKey="airportTaxi" />} />
          <Route path="/gdansk-airport-to-sopot" element={<LegacyRedirectToRoute routeKey="airportSopot" />} />
          <Route path="/gdansk-airport-to-gdynia" element={<LegacyRedirectToRoute routeKey="airportGdynia" />} />
          <Route path="/taxi-lotnisko-gdansk" element={<LegacyRedirectToRoute routeKey="airportTaxi" />} />
          <Route path="/lotnisko-gdansk-sopot" element={<LegacyRedirectToRoute routeKey="airportSopot" />} />
          <Route path="/lotnisko-gdansk-gdynia" element={<LegacyRedirectToRoute routeKey="airportGdynia" />} />
          <Route path="/polityka-cookies" element={<LegacyRedirectToRoute routeKey="cookies" />} />
          <Route path="/polityka-prywatnosci" element={<LegacyRedirectToRoute routeKey="privacy" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <CookieBanner />
    </>
  );
}

function LocalizedShell({ locale }: { locale: Locale }) {
  const { setLocale } = useI18n();

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return <Outlet />;
}

function AutoRedirect() {
  const { locale } = useI18n();
  const location = useLocation();
  const target = `${localeToRootPath(locale)}${location.search}${location.hash}`;

  return <Navigate to={target} replace />;
}

function LegacyRedirect({ to }: { to: string }) {
  const { locale } = useI18n();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/${to}${location.search}${location.hash}`;

  return <Navigate to={target} replace />;
}

function LegacyRedirectToRoute({ routeKey }: { routeKey: PublicRouteKey }) {
  const { locale } = useI18n();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/${getRouteSlug(locale, routeKey)}${location.search}${location.hash}`;

  return <Navigate to={target} replace />;
}

function LegacyAdminOrderRedirect() {
  const { locale } = useI18n();
  const { id } = useParams();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/admin/orders/${id ?? ''}${location.search}${location.hash}`;

  return <Navigate to={target} replace />;
}
