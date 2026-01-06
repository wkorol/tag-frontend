import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleTypeSelector } from './components/VehicleTypeSelector';
import { Pricing } from './components/Pricing';
import { OrderForm } from './components/OrderForm';
import { QuoteForm } from './components/QuoteForm';
import { ManageOrder } from './components/ManageOrder';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { CookiesPage } from './pages/CookiesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TrustSection } from './components/TrustSection';
import { RouteLanding } from './pages/RouteLanding';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminOrderPage } from './pages/AdminOrderPage';
import { trackContactClick } from './lib/tracking';
import { Locale, localeToPath, useI18n } from './lib/i18n';

function Landing() {
  const { t } = useI18n();
  const [step, setStep] = useState<'vehicle' | 'pricing'>('vehicle');
  const [vehicleType, setVehicleType] = useState<'standard' | 'bus'>('standard');
  const [selectedRoute, setSelectedRoute] = useState<{ from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' } | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const [floatingReady, setFloatingReady] = useState(false);
  
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // If orderId is present, show manage order page
  if (orderId) {
    return <ManageOrder orderId={orderId} />;
  }

  const handleVehicleSelect = (type: 'standard' | 'bus') => {
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

  useEffect(() => {
    const updateVisibility = () => {
      const target = document.getElementById('vehicle-selection');
      if (!target) {
        setTargetVisible(false);
        return;
      }

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const reached = window.scrollY >= targetTop - 120;
      setTargetVisible(reached);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      return;
    }

    const targetId = hash.replace('#', '');
    if (!targetId) {
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }, []);

  const showFloating = !targetVisible && !selectedRoute && !showQuoteForm;
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;

  useEffect(() => {
    if (!showFloating) {
      setFloatingReady(false);
      return;
    }

    const timeout = window.setTimeout(() => setFloatingReady(true), 30);
    return () => window.clearTimeout(timeout);
  }, [showFloating]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      {step === 'vehicle' ? (
        <VehicleTypeSelector onSelectType={handleVehicleSelect} />
      ) : (
        <Pricing 
          vehicleType={vehicleType}
          onOrderRoute={(route) => setSelectedRoute(route)}
          onRequestQuote={() => setShowQuoteForm(true)}
          onBack={handleBackToVehicleSelection}
        />
      )}

      <TrustSection />
      
      <Footer />

      {selectedRoute && (
        <OrderForm 
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}

      {showQuoteForm && (
        <QuoteForm 
          onClose={() => {
            setShowQuoteForm(false);
          }}
        />
      )}

      {showFloating && (
        <a
          href="#vehicle-selection"
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-pulse-glow transition-all duration-300 ease-out z-50 ${
            floatingReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {t.common.orderOnlineNow}
        </a>
      )}

      <div className="fixed bottom-6 right-4 z-50 sm:hidden flex flex-col gap-3">
        <a
          href={whatsappLink}
          onClick={() => trackContactClick('whatsapp')}
          className="bg-white text-slate-900 px-4 py-3 rounded-full shadow-lg border border-slate-200 flex items-center gap-2"
        >
          {t.common.whatsapp}
        </a>
      </div>
    </div>
  );
}

export default function App() {
  const { t } = useI18n();

  return (
    <>
      <Routes>
        <Route path="/" element={<AutoRedirect />} />
        <Route path="/en" element={<LocalizedShell locale="en" />}>
          <Route index element={<Landing />} />
          <Route path="admin" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route
            path="gdansk-airport-taxi"
            element={
              <RouteLanding
                title={t.pages.gdanskTaxi.title}
                description={t.pages.gdanskTaxi.description}
                route={t.pages.gdanskTaxi.route}
                examples={t.pages.gdanskTaxi.examples}
              />
            }
          />
          <Route
            path="gdansk-airport-to-sopot"
            element={
              <RouteLanding
                title={t.pages.gdanskSopot.title}
                description={t.pages.gdanskSopot.description}
                route={t.pages.gdanskSopot.route}
                examples={t.pages.gdanskSopot.examples}
              />
            }
          />
          <Route
            path="gdansk-airport-to-gdynia"
            element={
              <RouteLanding
                title={t.pages.gdanskGdynia.title}
                description={t.pages.gdanskGdynia.description}
                route={t.pages.gdanskGdynia.route}
                examples={t.pages.gdanskGdynia.examples}
              />
            }
          />
        </Route>
        <Route path="/pl" element={<LocalizedShell locale="pl" />}>
          <Route index element={<Landing />} />
          <Route path="admin" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderPage />} />
          <Route path="cookies" element={<CookiesPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route
            path="gdansk-airport-taxi"
            element={
              <RouteLanding
                title={t.pages.gdanskTaxi.title}
                description={t.pages.gdanskTaxi.description}
                route={t.pages.gdanskTaxi.route}
                examples={t.pages.gdanskTaxi.examples}
              />
            }
          />
          <Route
            path="gdansk-airport-to-sopot"
            element={
              <RouteLanding
                title={t.pages.gdanskSopot.title}
                description={t.pages.gdanskSopot.description}
                route={t.pages.gdanskSopot.route}
                examples={t.pages.gdanskSopot.examples}
              />
            }
          />
          <Route
            path="gdansk-airport-to-gdynia"
            element={
              <RouteLanding
                title={t.pages.gdanskGdynia.title}
                description={t.pages.gdanskGdynia.description}
                route={t.pages.gdanskGdynia.route}
                examples={t.pages.gdanskGdynia.examples}
              />
            }
          />
        </Route>
        <Route path="/cookies" element={<LegacyRedirect to="cookies" />} />
        <Route path="/privacy" element={<LegacyRedirect to="privacy" />} />
        <Route path="/admin" element={<LegacyRedirect to="admin" />} />
        <Route path="/admin/orders/:id" element={<LegacyAdminOrderRedirect />} />
        <Route path="/gdansk-airport-taxi" element={<LegacyRedirect to="gdansk-airport-taxi" />} />
        <Route path="/gdansk-airport-to-sopot" element={<LegacyRedirect to="gdansk-airport-to-sopot" />} />
        <Route path="/gdansk-airport-to-gdynia" element={<LegacyRedirect to="gdansk-airport-to-gdynia" />} />
      </Routes>
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
  const target = `${localeToPath(locale)}${location.search}${location.hash}`;

  return <Navigate to={target} replace />;
}

function LegacyRedirect({ to }: { to: string }) {
  const { locale } = useI18n();
  const location = useLocation();
  const basePath = localeToPath(locale);
  const target = `${basePath}/${to}${location.search}${location.hash}`;

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
