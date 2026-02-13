import { Link, useLocation } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { TrustSection } from '../components/TrustSection';
import { getRoutePath } from '../lib/routes';
import { localeToRootPath, useI18n } from '../lib/i18n';
import { usePageTitle } from '../lib/usePageTitle';

export function NotFoundPage() {
  const { t, locale } = useI18n();
  const location = useLocation();
  const homePath = localeToRootPath(locale);
  usePageTitle(t.common.notFoundTitle);
  const links = [
    { href: getRoutePath(locale, 'pricing'), label: t.navbar.prices },
    { href: getRoutePath(locale, 'airportTaxi'), label: t.navbar.airportTaxi },
    { href: getRoutePath(locale, 'airportSopot'), label: t.navbar.airportSopot },
    { href: getRoutePath(locale, 'airportGdynia'), label: t.navbar.airportGdynia },
    { href: getRoutePath(locale, 'cookies'), label: t.footer.cookiePolicy },
    { href: getRoutePath(locale, 'privacy'), label: t.footer.privacyPolicy },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-0">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:py-24">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-600">404</p>
          <h1 className="mt-3 text-3xl text-gray-900 sm:text-4xl">{t.common.notFoundTitle}</h1>
          <p className="mt-3 text-base text-gray-600">{t.common.notFoundBody}</p>
          <p className="mt-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">{t.common.notFoundSupport}</span>{' '}
            <a className="text-blue-600 hover:text-blue-700" href="mailto:booking@taxiairportgdansk.com">
              booking@taxiairportgdansk.com
            </a>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={homePath}
              className="inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow"
            >
              {t.common.notFoundCta}
            </Link>
            <Link
              to={getRoutePath(locale, 'orderCustom')}
              className="gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50"
            >
              {t.common.orderNow}
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t.common.notFoundRequested}
            </h2>
            <p className="mt-2 break-all text-sm text-gray-700">
              {location.pathname}
              {location.search}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t.common.notFoundPopular}
            </h2>
            <div className="mt-3 grid gap-2 text-sm">
              {links.map((link) => (
                <Link key={link.href} to={link.href} className="text-blue-600 hover:text-blue-700">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <TrustSection />
      <Footer />
    </div>
  );
}
