import { useLocation, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { Navbar } from '../components/Navbar';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';
import { trackCtaClick, trackNavClick } from '../lib/tracking';
import { getCityRouteBySlug, getCityRoutes } from '../lib/cityRoutes';
import { NotFoundPage } from './NotFoundPage';

export function CityRouteLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const { routeSlug } = useParams<{ routeSlug: string }>();
  const location = useLocation();
  const slugFromPath = location.pathname.replace(/\/$/, '').split('/').pop() ?? null;
  const resolvedSlug = routeSlug ?? slugFromPath;
  const route = resolvedSlug ? getCityRouteBySlug(locale, resolvedSlug) : null;
  const cityRoutes = getCityRoutes(locale).filter((entry) => entry.slug !== resolvedSlug);

  if (!route) {
    return <NotFoundPage />;
  }

  const destination = route.destination;
  const cityTaxi = t.cityTaxi;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <Breadcrumbs
                items={[
                  { label: t.common.home, href: `${basePath}/` },
                  { label: `Taxi Gdańsk → ${destination}` },
                ]}
              />
              <h1 className="text-3xl text-gray-900 mb-4">
                Cena taxi z lotniska Gdańsk do {destination}
              </h1>
              <p className="text-gray-600 mb-4">
                Sprawdź aktualną cenę przejazdu z lotniska Gdańsk do {destination}. Kalkulator pokaże cenę na dziś w kilka sekund.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Taxi Gdańsk z lotniska do {destination} – stałe ceny, 24/7 i szybkie potwierdzenie.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`${basePath}/${getRouteSlug(locale, 'pricing')}?from=airport&to=${encodeURIComponent(destination)}#pricing-calculator`}
                  onClick={(event) => {
                    event.preventDefault();
                    trackCtaClick('city_route_calculator');
                    const scrolled = requestScrollTo('pricing-calculator');
                    if (!scrolled) {
                      window.location.href = `${basePath}/${getRouteSlug(locale, 'pricing')}?from=airport&to=${encodeURIComponent(destination)}#pricing-calculator`;
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow"
                >
                  Sprawdź cenę w kalkulatorze
                </a>
                <a
                  href={`${basePath}/`}
                  onClick={(event) => {
                    event.preventDefault();
                    trackNavClick('city_route_booking');
                    const scrolled = requestScrollTo('vehicle-selection');
                    if (!scrolled) {
                      window.location.href = `${basePath}/`;
                    }
                  }}
                  className="gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50"
                >
                  Zarezerwuj przejazd
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">Dlaczego warto</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {cityTaxi.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">Obsługiwane trasy</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {cityTaxi.routes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-4">{cityTaxi.faqTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
              {cityTaxi.faq.map((entry) => (
                <div key={entry.question} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7">
                  <h3 className="text-gray-900 mb-2">{entry.question}</h3>
                  <p className="text-sm text-gray-600">{entry.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {cityRoutes.length > 0 && (
          <section className="py-12 bg-white border-t border-gray-200">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-xl text-gray-900 mb-3">{cityTaxi.cityRoutesTitle}</h2>
              <p className="text-sm text-gray-600 mb-4">{cityTaxi.cityRoutesDescription}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {cityRoutes.map((entry) => (
                  <a
                    key={entry.slug}
                    href={`${basePath}/${entry.slug}`}
                    onClick={() => trackNavClick('city_routes_link')}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50"
                  >
                    {cityTaxi.cityRoutesItem(entry.destination)}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
