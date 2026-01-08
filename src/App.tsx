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
import { trackContactClick, trackCtaClick, trackFormOpen, trackSectionView } from './lib/tracking';
import { consumeScrollTarget, requestScrollTo, scrollToId } from './lib/scroll';
import { getRouteSlug, PublicRouteKey } from './lib/routes';
import { Locale, localeToPath, useI18n } from './lib/i18n';

function Landing() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const [step, setStep] = useState<'vehicle' | 'pricing'>('vehicle');
  const [vehicleType, setVehicleType] = useState<'standard' | 'bus'>('standard');
  const [selectedRoute, setSelectedRoute] = useState<{ from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' } | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const [floatingReady, setFloatingReady] = useState(false);
  const [cookieBannerOffset, setCookieBannerOffset] = useState(0);
  const [pricingTracked, setPricingTracked] = useState(false);
  const [showStickyCtas, setShowStickyCtas] = useState(false);
  
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
        setTargetVisible(false);
        return;
      }

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const reached = window.scrollY >= targetTop - 120;
      setTargetVisible(reached);
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
    const updateSticky = () => {
      if (window.innerWidth >= 640) {
        setShowStickyCtas(true);
        return;
      }
      const footer = document.querySelector('footer');
      if (!footer) {
        setShowStickyCtas(window.scrollY > 120);
        return;
      }
      const footerTop = footer.getBoundingClientRect().top + window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;
      const nearFooter = viewportBottom >= footerTop - 80;
      setShowStickyCtas(window.scrollY > 120 && !nearFooter);
    };

    updateSticky();
    window.addEventListener('scroll', updateSticky, { passive: true });
    window.addEventListener('resize', updateSticky);
    return () => {
      window.removeEventListener('scroll', updateSticky);
      window.removeEventListener('resize', updateSticky);
    };
  }, []);

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

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let resizeObserver: ResizeObserver | null = null;

    const updateOffset = () => {
      const banner = document.querySelector('[data-cookie-banner]') as HTMLElement | null;
      if (!banner) {
        setCookieBannerOffset(0);
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        return;
      }

      const height = banner.getBoundingClientRect().height;
      setCookieBannerOffset(Math.ceil(height) + 12);

      if (!resizeObserver && 'ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(() => {
          const nextHeight = banner.getBoundingClientRect().height;
          setCookieBannerOffset(Math.ceil(nextHeight) + 12);
        });
        resizeObserver.observe(banner);
      }
    };

    updateOffset();

    const observer = new MutationObserver(updateOffset);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-0">
      <Navbar />
      <main>
        <Hero />
        
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

        <TrustSection />
      </main>
      
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
          href={`${basePath}/`}
          onClick={(event) => {
            event.preventDefault();
            trackCtaClick('floating_order_online');
            requestScrollTo('vehicle-selection');
          }}
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-orange-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-pulse-glow hover:bg-orange-500 transition-all duration-300 ease-out z-50 ${
            floatingReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {t.common.orderOnlineNow}
        </a>
      )}

      {!selectedRoute && !showQuoteForm && showStickyCtas && (
        <div
          className="fixed left-0 right-0 z-50 sm:hidden border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"
          style={{ bottom: cookieBannerOffset }}
        >
          <div className="flex gap-3">
            <a
              href={whatsappLink}
              onClick={() => trackContactClick('whatsapp')}
              className="flex-1 rounded-full px-4 py-3 text-center text-white shadow-sm flex items-center justify-center gap-2"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M19.11 17.72c-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.79-1.92-.21-.5-.43-.43-.58-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.81 2.76 4.4 3.87.62.27 1.1.43 1.48.55.62.2 1.18.17 1.63.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.17-.5-.3z" />
                <path d="M26.67 5.33A14.9 14.9 0 0016.03 1.5C8.12 1.5 1.5 8.13 1.5 16.03c0 2.4.63 4.76 1.83 6.85L1.5 30.5l7.81-1.79a14.93 14.93 0 006.72 1.61h.01c7.9 0 14.53-6.63 14.53-14.53 0-3.88-1.52-7.53-4.4-10.46zm-10.64 22.3h-.01a12.4 12.4 0 01-6.32-1.73l-.45-.27-4.64 1.06 1.24-4.52-.3-.46a12.45 12.45 0 01-2-6.68c0-6.86 5.58-12.44 12.45-12.44 3.32 0 6.43 1.3 8.77 3.65a12.33 12.33 0 013.64 8.79c0 6.86-5.59 12.44-12.38 12.44z" />
              </svg>
              {t.common.whatsapp}
            </a>
            <a
              href={`${basePath}/`}
              onClick={(event) => {
                event.preventDefault();
                trackCtaClick('sticky_order_online');
                requestScrollTo('vehicle-selection');
              }}
              className="flex-1 rounded-full px-4 py-3 text-center text-white shadow-sm"
              style={{ backgroundColor: '#ea580c' }}
            >
              {t.common.orderOnlineNow}
            </a>
          </div>
        </div>
      )}
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
          <Route path={getRouteSlug('en', 'cookies')} element={<CookiesPage />} />
          <Route path={getRouteSlug('en', 'privacy')} element={<PrivacyPage />} />
          <Route
            path={getRouteSlug('en', 'airportTaxi')}
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
            path={getRouteSlug('en', 'airportSopot')}
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
            path={getRouteSlug('en', 'airportGdynia')}
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
        <Route path="/de" element={<LocalizedShell locale="de" />}>
          <Route index element={<Landing />} />
          <Route path="admin" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderPage />} />
          <Route path={getRouteSlug('de', 'cookies')} element={<CookiesPage />} />
          <Route path={getRouteSlug('de', 'privacy')} element={<PrivacyPage />} />
          <Route
            path={getRouteSlug('de', 'airportTaxi')}
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
            path={getRouteSlug('de', 'airportSopot')}
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
            path={getRouteSlug('de', 'airportGdynia')}
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
        <Route path="/fi" element={<LocalizedShell locale="fi" />}>
          <Route index element={<Landing />} />
          <Route path="admin" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderPage />} />
          <Route path={getRouteSlug('fi', 'cookies')} element={<CookiesPage />} />
          <Route path={getRouteSlug('fi', 'privacy')} element={<PrivacyPage />} />
          <Route
            path={getRouteSlug('fi', 'airportTaxi')}
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
            path={getRouteSlug('fi', 'airportSopot')}
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
            path={getRouteSlug('fi', 'airportGdynia')}
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
        <Route path="/no" element={<LocalizedShell locale="no" />}>
          <Route index element={<Landing />} />
          <Route path="admin" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderPage />} />
          <Route path={getRouteSlug('no', 'cookies')} element={<CookiesPage />} />
          <Route path={getRouteSlug('no', 'privacy')} element={<PrivacyPage />} />
          <Route
            path={getRouteSlug('no', 'airportTaxi')}
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
            path={getRouteSlug('no', 'airportSopot')}
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
            path={getRouteSlug('no', 'airportGdynia')}
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
        <Route path="/sv" element={<LocalizedShell locale="sv" />}>
          <Route index element={<Landing />} />
          <Route path="admin" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderPage />} />
          <Route path={getRouteSlug('sv', 'cookies')} element={<CookiesPage />} />
          <Route path={getRouteSlug('sv', 'privacy')} element={<PrivacyPage />} />
          <Route
            path={getRouteSlug('sv', 'airportTaxi')}
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
            path={getRouteSlug('sv', 'airportSopot')}
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
            path={getRouteSlug('sv', 'airportGdynia')}
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
        <Route path="/da" element={<LocalizedShell locale="da" />}>
          <Route index element={<Landing />} />
          <Route path="admin" element={<AdminOrdersPage />} />
          <Route path="admin/orders/:id" element={<AdminOrderPage />} />
          <Route path={getRouteSlug('da', 'cookies')} element={<CookiesPage />} />
          <Route path={getRouteSlug('da', 'privacy')} element={<PrivacyPage />} />
          <Route
            path={getRouteSlug('da', 'airportTaxi')}
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
            path={getRouteSlug('da', 'airportSopot')}
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
            path={getRouteSlug('da', 'airportGdynia')}
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
          <Route path={getRouteSlug('pl', 'cookies')} element={<CookiesPage />} />
          <Route path={getRouteSlug('pl', 'privacy')} element={<PrivacyPage />} />
          <Route
            path={getRouteSlug('pl', 'airportTaxi')}
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
            path={getRouteSlug('pl', 'airportSopot')}
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
            path={getRouteSlug('pl', 'airportGdynia')}
            element={
              <RouteLanding
                title={t.pages.gdanskGdynia.title}
                description={t.pages.gdanskGdynia.description}
                route={t.pages.gdanskGdynia.route}
                examples={t.pages.gdanskGdynia.examples}
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
        </Route>
        <Route path="/cookies" element={<LegacyRedirectToRoute routeKey="cookies" />} />
        <Route path="/privacy" element={<LegacyRedirectToRoute routeKey="privacy" />} />
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
