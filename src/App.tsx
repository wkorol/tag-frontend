import { Component, Suspense, lazy, useEffect, useState, type ErrorInfo, type ReactNode } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useParams, useSearchParams } from 'react-router-dom';
import { LandingNavbar } from './components/LandingNavbar';
import { Hero, HeroBenefits } from './components/Hero';
import { VehicleTypeSelector } from './components/VehicleTypeSelector';
import { LazyMount } from './components/LazyMount';
import { LandingTrustSection } from './components/LandingTrustSection';
import { FloatingActions } from './components/FloatingActions';
const CHUNK_ERROR_MESSAGE =
  /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk [\d]+ failed|dynamically imported module/i;

const withChunkRetry = <T,>(loader: () => Promise<T>, chunkKey: string) => async () => {
  try {
    const module = await loader();
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem(`chunk-retry:${chunkKey}`);
    }
    return module;
  } catch (error) {
    if (typeof window !== 'undefined') {
      const message = error instanceof Error ? error.message : String(error);
      const retryKey = `chunk-retry:${chunkKey}`;
      const hasRetried = window.sessionStorage.getItem(retryKey) === '1';
      if (CHUNK_ERROR_MESSAGE.test(message) && !hasRetried) {
        window.sessionStorage.setItem(retryKey, '1');
        window.location.reload();
        return new Promise<T>(() => {});
      }
    }
    throw error;
  }
};

function SuspenseFallback() {
  return (
    <div className="flex min-h-[120px] items-center justify-center text-sm text-slate-500">
      Loading...
    </div>
  );
}

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Application render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 px-6 text-center text-slate-700">
          <p className="max-w-md text-sm sm:text-base">
            We could not load this page on your device. Please refresh and try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const Pricing = lazy(withChunkRetry(() => import('./components/Pricing').then((mod) => ({ default: mod.Pricing })), 'pricing'));
const Footer = lazy(withChunkRetry(() => import('./components/Footer').then((mod) => ({ default: mod.Footer })), 'footer'));
const CookieBanner = lazy(withChunkRetry(() => import('./components/CookieBanner').then((mod) => ({ default: mod.CookieBanner })), 'cookie-banner'));
const OrderForm = lazy(withChunkRetry(() => import('./components/OrderForm').then((mod) => ({ default: mod.OrderForm })), 'order-form'));
const QuoteForm = lazy(withChunkRetry(() => import('./components/QuoteForm').then((mod) => ({ default: mod.QuoteForm })), 'quote-form'));
const ManageOrder = lazy(withChunkRetry(() => import('./components/ManageOrder').then((mod) => ({ default: mod.ManageOrder })), 'manage-order'));
const RouteLanding = lazy(withChunkRetry(() => import('./pages/RouteLanding').then((mod) => ({ default: mod.RouteLanding })), 'route-landing'));
const OrderRoutePage = lazy(withChunkRetry(() => import('./pages/OrderRoutePage').then((mod) => ({ default: mod.OrderRoutePage })), 'order-route-page'));
const CustomOrderPage = lazy(withChunkRetry(() => import('./pages/OrderRoutePage').then((mod) => ({ default: mod.CustomOrderPage })), 'custom-order-page'));
const PricingPage = lazy(withChunkRetry(() => import('./pages/PricingPage').then((mod) => ({ default: mod.PricingPage })), 'pricing-page'));
const AdminOrdersPage = lazy(withChunkRetry(() => import('./pages/AdminOrdersPage').then((mod) => ({ default: mod.AdminOrdersPage })), 'admin-orders-page'));
const AdminOrderPage = lazy(withChunkRetry(() => import('./pages/AdminOrderPage').then((mod) => ({ default: mod.AdminOrderPage })), 'admin-order-page'));
const CookiesPage = lazy(withChunkRetry(() => import('./pages/CookiesPage').then((mod) => ({ default: mod.CookiesPage })), 'cookies-page'));
const PrivacyPage = lazy(withChunkRetry(() => import('./pages/PrivacyPage').then((mod) => ({ default: mod.PrivacyPage })), 'privacy-page'));
const NotFoundPage = lazy(withChunkRetry(() => import('./pages/NotFoundPage').then((mod) => ({ default: mod.NotFoundPage })), 'not-found-page'));
const CountryLanding = lazy(withChunkRetry(() => import('./pages/CountryLanding').then((mod) => ({ default: mod.CountryLanding })), 'country-landing'));
const CountryAirportLanding = lazy(withChunkRetry(() => import('./pages/CountryAirportLanding').then((mod) => ({ default: mod.CountryAirportLanding })), 'country-airport-landing'));
const CityRouteLanding = lazy(withChunkRetry(() => import('./pages/CityRouteLanding').then((mod) => ({ default: mod.CityRouteLanding })), 'city-route-landing'));
const TaxiGdanskPage = lazy(withChunkRetry(() => import('./pages/TaxiGdanskPage').then((mod) => ({ default: mod.TaxiGdanskPage })), 'taxi-gdansk-page'));
const BlogListPage = lazy(withChunkRetry(() => import('./pages/BlogListPage').then((mod) => ({ default: mod.BlogListPage })), 'blog-list-page'));
const BlogArticlePage = lazy(withChunkRetry(() => import('./pages/BlogArticlePage').then((mod) => ({ default: mod.BlogArticlePage })), 'blog-article-page'));
const AdminBlogPage = lazy(withChunkRetry(() => import('./pages/AdminBlogPage').then((mod) => ({ default: mod.AdminBlogPage })), 'admin-blog-page'));
import {
  trackFormOpen,
  trackPageView,
  trackSectionView,
  trackVehicleSelect,
  trackScrollDepth,
  trackOutboundClick,
  trackLinkClick,
  trackButtonClick,
} from './lib/tracking';
import { consumeScrollTarget, scrollToId } from './lib/scroll';
import { getRouteSlug, PublicRouteKey } from './lib/routes';
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES, detectBrowserLocale, localeToPath, localeToRootPath, useI18n } from './lib/i18n';
import { getCountryAirports } from './lib/countryAirports';
import { getCityRoutes } from './lib/cityRoutes';
import { usePageTitle } from './lib/usePageTitle';

const localeRootPathSet = new Set(SUPPORTED_LOCALES.map((locale) => `/${locale}`));

const normalizeCanonicalPathname = (pathname: string) =>
  localeRootPathSet.has(pathname) ? `${pathname}/` : pathname;

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
  usePageTitle(t.hero.headline);
  const [step, setStep] = useState<'vehicle' | 'pricing'>('vehicle');
  const [vehicleType, setVehicleType] = useState<'standard' | 'bus'>('standard');
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
    priceDay: number;
    priceNight: number;
    type: 'standard' | 'bus';
    pickupTypeDefault?: 'airport' | 'address';
  } | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [pricingTracked, setPricingTracked] = useState(false);
  
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // If orderId is present, show manage order page
  if (orderId) {
    return (
      <Suspense fallback={<SuspenseFallback />}>
        <ManageOrder orderId={orderId} />
      </Suspense>
    );
  }

  const handleVehicleSelect = (type: 'standard' | 'bus') => {
    trackVehicleSelect(type);
    setVehicleType(type);
    setStep('pricing');
    const scrollToPricingTop = (attempt = 0) => {
      const target = document.getElementById('vehicle-selection');
      if (!target) {
        if (attempt < 10) {
          window.setTimeout(() => scrollToPricingTop(attempt + 1), 90);
        }
        return;
      }
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - 80);
      window.scrollTo({ top, behavior: 'smooth' });
    };
    window.setTimeout(() => scrollToPricingTop(0), 0);
  };

  const handleBackToVehicleSelection = () => {
    setStep('vehicle');
  };

  const handleOrderRoute = (route: {
    from: string;
    to: string;
    priceDay: number;
    priceNight: number;
    type: 'standard' | 'bus';
    pickupTypeDefault?: 'airport' | 'address';
  }) => {
    trackFormOpen('order');
    setSelectedRoute(route);
  };

  const handleRequestQuote = () => {
    trackFormOpen('quote');
    setShowQuoteForm(true);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window) || pricingTracked) {
      return;
    }
    const target = document.getElementById('vehicle-selection');
    if (!target) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPricingTracked(true);
          trackSectionView('vehicle_selection');
          observer.disconnect();
        }
      },
      {
        root: null,
        threshold: 0.2,
        rootMargin: '120px 0px 0px 0px',
      }
    );
    observer.observe(target);
    return () => observer.disconnect();
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
      <LandingNavbar />
      <main>
        <Hero />

        <div>
          {step === 'vehicle' ? (
            <VehicleTypeSelector onSelectType={handleVehicleSelect} />
          ) : (
            <Suspense fallback={<SuspenseFallback />}>
              <Pricing
                vehicleType={vehicleType}
                onOrderRoute={handleOrderRoute}
                onRequestQuote={handleRequestQuote}
                onBack={handleBackToVehicleSelection}
              />
            </Suspense>
          )}
        </div>

        <HeroBenefits />

        <LazyMount className="defer-render defer-render-md" rootMargin="300px 0px" minHeight={760}>
          <LandingTrustSection />
        </LazyMount>
      </main>

      <LazyMount className="defer-render defer-render-sm" rootMargin="240px 0px" minHeight={420}>
        <Suspense fallback={<SuspenseFallback />}>
          <Footer />
        </Suspense>
      </LazyMount>

      {selectedRoute && (
        <Suspense fallback={<SuspenseFallback />}>
          <OrderForm 
            route={selectedRoute}
            onClose={() => setSelectedRoute(null)}
          />
        </Suspense>
      )}

      {showQuoteForm && (
        <Suspense fallback={<SuspenseFallback />}>
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
      <Route path="admin/blog" element={<AdminBlogPage />} />
      <Route path="blog">
        <Route index element={<BlogListPage />} />
        <Route path=":slug" element={<BlogArticlePage />} />
      </Route>
      <Route path={getRouteSlug(locale, 'cookies')} element={<CookiesPage />} />
      <Route path={getRouteSlug(locale, 'privacy')} element={<PrivacyPage />} />
      <Route path={getRouteSlug(locale, 'countryLanding')} element={<CountryLanding />} />
      <Route path={getRouteSlug(locale, 'taxiGdanskCity')} element={<TaxiGdanskPage />} />
      {renderCountryAirportRoutes(locale)}
      {renderCityRouteRoutes(locale)}
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
  const [trackingReady, setTrackingReady] = useState(false);
  const [cookieBannerReady, setCookieBannerReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    let cancelled = false;
    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const enable = () => {
      if (!cancelled) {
        setTrackingReady(true);
      }
    };

    if ('requestIdleCallback' in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(enable, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(enable, 800);
    }

    return () => {
      cancelled = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let timeoutId: number | null = null;
    let idleId: number | null = null;

    const enable = () => setCookieBannerReady(true);

    timeoutId = window.setTimeout(enable, 1800);
    if ('requestIdleCallback' in window) {
      idleId = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(enable, { timeout: 2000 });
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
      if (idleId !== null && 'cancelIdleCallback' in window) {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(idleId);
      }
    };
  }, []);

  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    trackPageView(`${location.pathname}${location.search}`);
  }, [location.pathname, location.search, trackingReady]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const head = document.head;
    if (!head) {
      return;
    }
    let canonical = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      head.appendChild(canonical);
    }
    try {
      const nextUrl = new URL(window.location.href);
      nextUrl.pathname = normalizeCanonicalPathname(nextUrl.pathname);
      nextUrl.search = '';
      nextUrl.hash = '';
      canonical.href = nextUrl.toString();
    } catch {
      // noop: keep any existing canonical if URL parsing fails
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    const thresholds = [25, 50, 75, 100];
    const seen = new Set<number>();

    const onScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const height = doc.scrollHeight - doc.clientHeight;
      if (height <= 0) {
        return;
      }
      const percent = Math.round((scrollTop / height) * 100);
      thresholds.forEach((threshold) => {
        if (!seen.has(threshold) && percent >= threshold) {
          seen.add(threshold);
          trackScrollDepth(threshold);
        }
      });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [trackingReady]);

  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    if (typeof window === 'undefined') {
      return;
    }
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      const button = target.closest('button') as HTMLButtonElement | null;
      if (button) {
        const label = (button.innerText || button.getAttribute('aria-label') || '').trim();
        if (label) {
          trackButtonClick(label);
        }
      }
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor || !anchor.href) {
        return;
      }
      try {
        const href = new URL(anchor.href);
        const label = (anchor.innerText || anchor.getAttribute('aria-label') || '').trim();
        if (label) {
          trackLinkClick(label, href.toString());
        }
        if (href.origin !== window.location.origin) {
          trackOutboundClick(href.toString());
        }
      } catch {
        return;
      }
    };
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
    };
  }, [trackingReady]);

  useEffect(() => {
    if (!trackingReady) {
      return;
    }
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return;
    }
    const sections = Array.from(document.querySelectorAll('main section[id]')) as HTMLElement[];
    if (sections.length === 0) {
      return;
    }
    const seen = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }
          const id = (entry.target as HTMLElement).id;
          if (id && !seen.has(id)) {
            seen.add(id);
            trackSectionView(id);
          }
        });
      },
      { threshold: 0.35 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [location.pathname, trackingReady]);

  return (
    <AppErrorBoundary>
      <>
        <Suspense fallback={<SuspenseFallback />}>
          <Routes>
            <Route path="/" element={<RootLanding />} />
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
        {cookieBannerReady ? (
          <Suspense fallback={<SuspenseFallback />}>
            <CookieBanner />
          </Suspense>
        ) : null}
      </>
    </AppErrorBoundary>
  );
}

function LocalizedShell({ locale }: { locale: Locale }) {
  const { setLocale } = useI18n();

  useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  return <Outlet />;
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

function RootLanding() {
  const { locale } = useI18n();
  return (
    <>
      <LanguageBanner />
      <LocalePrompt />
      <Landing key={`root-${locale}`} />
    </>
  );
}

function LanguageBanner() {
  return (
    <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50 text-gray-900">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 text-sm sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-gray-800">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-amber-900">
            A
          </span>
          <span className="font-medium">
            Prefer another language?
          </span>
          <span className="text-gray-600">
            Choose a version:
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_LOCALES.map((lang) => (
            <a
              key={lang}
              href={localeToRootPath(lang)}
              className="rounded-full border border-amber-200 bg-white px-3 py-1 text-xs font-semibold text-amber-900 transition hover:border-amber-300 hover:bg-amber-100"
            >
              {lang.toUpperCase()}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function LocalePrompt() {
  const { locale, setLocale } = useI18n();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [suggested, setSuggested] = useState<Locale | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (location.pathname !== '/') return;
    const dismissed = window.localStorage.getItem('tag_locale_prompted');
    if (dismissed === '1') return;
    const detected = detectBrowserLocale();
    if (detected === DEFAULT_LOCALE) return;
    if (detected === locale) return;
    setSuggested(detected);
    setShow(true);
  }, [locale, location.pathname]);

  const accept = () => {
    if (!suggested) return;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tag_locale_prompted', '1');
    }
    setLocale(suggested);
    window.location.href = `${localeToRootPath(suggested)}${location.search}${location.hash}`;
  };

  const dismiss = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('tag_locale_prompted', '1');
    }
    setShow(false);
  };

  if (!show || !suggested) {
    return null;
  }

  const label = suggested.toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div
        className="rounded-3xl border border-amber-200 bg-white p-6 shadow-2xl"
        style={{ width: 'min(92vw, 420px)' }}
      >
        <div className="flex flex-col gap-4 text-center">
          <div className="text-lg font-semibold text-gray-900">
            We detected your browser language
          </div>
          <div className="text-sm text-gray-700">
            Switch to <span className="font-semibold text-gray-900">{label}</span>?
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={accept}
              className="w-full rounded-full bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 sm:w-auto"
            >
              Switch language
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="w-full rounded-full border border-gray-200 px-6 py-3 text-base font-medium text-gray-700 hover:border-gray-300 sm:w-auto"
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
