import { Breadcrumbs } from '../components/Breadcrumbs';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { Navbar } from '../components/Navbar';
import { TrustSection } from '../components/TrustSection';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';
import { trackCtaClick, trackNavClick } from '../lib/tracking';
import { getCityRoutes } from '../lib/cityRoutes';
import { usePageTitle } from '../lib/usePageTitle';

export function TaxiGdanskPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const content = t.cityTaxi;
  const cityRoutes = getCityRoutes(locale);
  const cityRouteItemLabel = (destination: string) =>
    typeof content.cityRoutesItem === 'function'
      ? content.cityRoutesItem(destination)
      : `Gdańsk Airport → ${destination}`;
  usePageTitle(content.title);

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
                  { label: content.title },
                ]}
              />
              <h1 className="text-3xl text-gray-900 mb-4">{content.title}</h1>
              <p className="text-gray-600 mb-4">{content.subtitle}</p>
              <p className="text-sm text-gray-500 mb-6">{content.intro}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`${basePath}/`}
                  onClick={(event) => {
                    event.preventDefault();
                    trackCtaClick('city_taxi_order');
                    const scrolled = requestScrollTo('vehicle-selection');
                    if (!scrolled) {
                      window.location.href = `${basePath}/`;
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow"
                >
                  {content.ctaPrimary}
                </a>
                <a
                  href={`${basePath}/${getRouteSlug(locale, 'pricing')}`}
                  onClick={() => trackNavClick('city_taxi_pricing')}
                  className="gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50"
                >
                  {content.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{content.highlightsTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {content.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{content.serviceAreaTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {content.serviceArea.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-3">{content.routesTitle}</h2>
            <ul className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
              {content.routes.map((item) => (
                <li key={item} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {cityRoutes.length > 0 && (
          <section className="py-12 bg-white border-t border-gray-200">
            <div className="max-w-5xl mx-auto px-4">
              <h2 className="text-xl text-gray-900 mb-3">{content.cityRoutesTitle}</h2>
              <p className="text-sm text-gray-600 mb-4">{content.cityRoutesDescription}</p>
              <div className="grid gap-3 md:grid-cols-2">
                {cityRoutes.map((route) => (
                  <a
                    key={route.slug}
                    href={`${basePath}/${route.slug}`}
                    onClick={() => trackNavClick('city_routes_link')}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 transition-colors hover:border-orange-200 hover:bg-orange-50"
                  >
                    {cityRouteItemLabel(route.destination)}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-4">{content.faqTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
              {content.faq.map((entry) => (
                <div key={entry.question} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7">
                  <h3 className="text-gray-900 mb-2">{entry.question}</h3>
                  <p className="text-sm text-gray-600">{entry.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <TrustSection />
      <Footer />
      <FloatingActions />
    </div>
  );
}
