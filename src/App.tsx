import { Suspense, lazy, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleTypeSelector } from './components/VehicleTypeSelector';
import { Pricing } from './components/Pricing';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { FloatingActions } from './components/FloatingActions';
import { CookiesPage } from './pages/CookiesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { CountryLanding } from './pages/CountryLanding';
import { CountryAirportLanding } from './pages/CountryAirportLanding';
import { CityRouteLanding } from './pages/CityRouteLanding';
import { TaxiGdanskPage } from './pages/TaxiGdanskPage';
import { TrustSection } from './components/TrustSection';
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
        </div>

        <div className="defer-render">
          <TrustSection />
        </div>
      </main>

      <div className="defer-render">
        <Footer />
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
          <Route path="/en" element={<LocalizedShell locale="en" />}>
            <Route index element={<Landing />} />
            <Route path={getRouteSlug('en', 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
            <Route path={getRouteSlug('en', 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
            <Route path={getRouteSlug('en', 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
            <Route path={getRouteSlug('en', 'orderCustom')} element={<CustomOrderPage />} />
            <Route path={getRouteSlug('en', 'pricing')} element={<PricingPage />} />
            <Route path="admin" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderPage />} />
            <Route path={getRouteSlug('en', 'cookies')} element={<CookiesPage />} />
            <Route path={getRouteSlug('en', 'privacy')} element={<PrivacyPage />} />
            <Route path={getRouteSlug('en', 'countryLanding')} element={<CountryLanding />} />
            <Route path={getRouteSlug('en', 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
            {renderCountryAirportRoutes('en')}
            <Route
              path={getRouteSlug('en', 'airportTaxi')}
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
              path={getRouteSlug('en', 'airportSopot')}
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
              path={getRouteSlug('en', 'airportGdynia')}
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/de" element={<LocalizedShell locale="de" />}>
            <Route index element={<Landing />} />
            <Route path={getRouteSlug('de', 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
            <Route path={getRouteSlug('de', 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
            <Route path={getRouteSlug('de', 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
            <Route path={getRouteSlug('de', 'orderCustom')} element={<CustomOrderPage />} />
            <Route path={getRouteSlug('de', 'pricing')} element={<PricingPage />} />
            <Route path="admin" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderPage />} />
            <Route path={getRouteSlug('de', 'cookies')} element={<CookiesPage />} />
            <Route path={getRouteSlug('de', 'privacy')} element={<PrivacyPage />} />
            <Route path={getRouteSlug('de', 'countryLanding')} element={<CountryLanding />} />
            <Route path={getRouteSlug('de', 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
            {renderCountryAirportRoutes('de')}
            <Route
              path={getRouteSlug('de', 'airportTaxi')}
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
              path={getRouteSlug('de', 'airportSopot')}
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
              path={getRouteSlug('de', 'airportGdynia')}
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/fi" element={<LocalizedShell locale="fi" />}>
            <Route index element={<Landing />} />
            <Route path={getRouteSlug('fi', 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
            <Route path={getRouteSlug('fi', 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
            <Route path={getRouteSlug('fi', 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
            <Route path={getRouteSlug('fi', 'orderCustom')} element={<CustomOrderPage />} />
            <Route path={getRouteSlug('fi', 'pricing')} element={<PricingPage />} />
            <Route path="admin" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderPage />} />
            <Route path={getRouteSlug('fi', 'cookies')} element={<CookiesPage />} />
            <Route path={getRouteSlug('fi', 'privacy')} element={<PrivacyPage />} />
            <Route path={getRouteSlug('fi', 'countryLanding')} element={<CountryLanding />} />
            <Route path={getRouteSlug('fi', 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
            {renderCountryAirportRoutes('fi')}
            <Route
              path={getRouteSlug('fi', 'airportTaxi')}
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
              path={getRouteSlug('fi', 'airportSopot')}
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
              path={getRouteSlug('fi', 'airportGdynia')}
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/no" element={<LocalizedShell locale="no" />}>
            <Route index element={<Landing />} />
            <Route path={getRouteSlug('no', 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
            <Route path={getRouteSlug('no', 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
            <Route path={getRouteSlug('no', 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
            <Route path={getRouteSlug('no', 'orderCustom')} element={<CustomOrderPage />} />
            <Route path={getRouteSlug('no', 'pricing')} element={<PricingPage />} />
            <Route path="admin" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderPage />} />
            <Route path={getRouteSlug('no', 'cookies')} element={<CookiesPage />} />
            <Route path={getRouteSlug('no', 'privacy')} element={<PrivacyPage />} />
            <Route path={getRouteSlug('no', 'countryLanding')} element={<CountryLanding />} />
            <Route path={getRouteSlug('no', 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
            {renderCountryAirportRoutes('no')}
            <Route
              path={getRouteSlug('no', 'airportTaxi')}
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
              path={getRouteSlug('no', 'airportSopot')}
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
              path={getRouteSlug('no', 'airportGdynia')}
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/sv" element={<LocalizedShell locale="sv" />}>
            <Route index element={<Landing />} />
            <Route path={getRouteSlug('sv', 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
            <Route path={getRouteSlug('sv', 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
            <Route path={getRouteSlug('sv', 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
            <Route path={getRouteSlug('sv', 'orderCustom')} element={<CustomOrderPage />} />
            <Route path={getRouteSlug('sv', 'pricing')} element={<PricingPage />} />
            <Route path="admin" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderPage />} />
            <Route path={getRouteSlug('sv', 'cookies')} element={<CookiesPage />} />
            <Route path={getRouteSlug('sv', 'privacy')} element={<PrivacyPage />} />
            <Route path={getRouteSlug('sv', 'countryLanding')} element={<CountryLanding />} />
            <Route path={getRouteSlug('sv', 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
            {renderCountryAirportRoutes('sv')}
            <Route
              path={getRouteSlug('sv', 'airportTaxi')}
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
              path={getRouteSlug('sv', 'airportSopot')}
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
              path={getRouteSlug('sv', 'airportGdynia')}
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/da" element={<LocalizedShell locale="da" />}>
            <Route index element={<Landing />} />
            <Route path={getRouteSlug('da', 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
            <Route path={getRouteSlug('da', 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
            <Route path={getRouteSlug('da', 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
            <Route path={getRouteSlug('da', 'orderCustom')} element={<CustomOrderPage />} />
            <Route path={getRouteSlug('da', 'pricing')} element={<PricingPage />} />
            <Route path="admin" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderPage />} />
            <Route path={getRouteSlug('da', 'cookies')} element={<CookiesPage />} />
            <Route path={getRouteSlug('da', 'privacy')} element={<PrivacyPage />} />
            <Route path={getRouteSlug('da', 'countryLanding')} element={<CountryLanding />} />
            <Route path={getRouteSlug('da', 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
            {renderCountryAirportRoutes('da')}
            <Route
              path={getRouteSlug('da', 'airportTaxi')}
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
              path={getRouteSlug('da', 'airportSopot')}
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
              path={getRouteSlug('da', 'airportGdynia')}
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
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/pl" element={<LocalizedShell locale="pl" />}>
            <Route index element={<Landing />} />
            <Route path={getRouteSlug('pl', 'orderAirportGdansk')} element={<OrderRoutePage routeKey="airportTaxi" />} />
            <Route path={getRouteSlug('pl', 'orderAirportSopot')} element={<OrderRoutePage routeKey="airportSopot" />} />
            <Route path={getRouteSlug('pl', 'orderAirportGdynia')} element={<OrderRoutePage routeKey="airportGdynia" />} />
            <Route path={getRouteSlug('pl', 'orderCustom')} element={<CustomOrderPage />} />
            <Route path={getRouteSlug('pl', 'pricing')} element={<PricingPage />} />
            <Route path="admin" element={<AdminOrdersPage />} />
            <Route path="admin/orders/:id" element={<AdminOrderPage />} />
            <Route path={getRouteSlug('pl', 'cookies')} element={<CookiesPage />} />
            <Route path={getRouteSlug('pl', 'privacy')} element={<PrivacyPage />} />
            <Route path={getRouteSlug('pl', 'countryLanding')} element={<CountryLanding />} />
            <Route path={getRouteSlug('pl', 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
            {renderCountryAirportRoutes('pl')}
            {renderCityRouteRoutes('pl')}
            <Route
              path={getRouteSlug('pl', 'airportTaxi')}
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
              path={getRouteSlug('pl', 'airportSopot')}
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
              path={getRouteSlug('pl', 'airportGdynia')}
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
            <Route
              path="gdansk-airport-taxi"
              element={<LegacyRedirectToRoute routeKey="airportTaxi" />}
            />
            <Route
              path="gdansk-airport-to-sopot"
              element={<LegacyRedirectToRoute routeKey="airportSopot" />}
            />
            <Route
              path="gdansk-airport-to-gdynia"
              element={<LegacyRedirectToRoute routeKey="airportGdynia" />}
            />
            <Route
              path="cookies"
              element={<LegacyRedirectToRoute routeKey="cookies" />}
            />
            <Route
              path="privacy"
              element={<LegacyRedirectToRoute routeKey="privacy" />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
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
