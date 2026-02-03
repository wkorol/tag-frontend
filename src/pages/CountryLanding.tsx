import { Breadcrumbs } from '../components/Breadcrumbs';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { Navbar } from '../components/Navbar';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';
import { trackCtaClick, trackNavClick } from '../lib/tracking';
import { getCountryAirports } from '../lib/countryAirports';

export function CountryLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const airportPages = getCountryAirports(locale);
  const country = t.countryLanding ?? {
    title: t.routeLanding?.orderNow ?? 'Airport transfer',
    description: t.routeLanding?.seoParagraph?.('Gdańsk') ?? '',
    intro: '',
    ctaPrimary: t.routeLanding?.orderNow ?? 'Book',
    ctaSecondary: t.routeLanding?.pricingLink ?? 'Pricing',
    highlightsTitle: t.routeLanding?.includedTitle ?? 'Highlights',
    highlights: t.routeLanding?.includedList ?? [],
    airportsTitle: t.routeLanding?.destinationsTitle ?? 'Popular destinations',
    airports: t.pages?.gdanskTaxi?.examples ?? [],
    faqTitle: t.routeLanding?.faqTitle ?? 'FAQ',
    faq: t.routeLanding?.faq ?? [],
  };

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
                  { label: country.title },
                ]}
              />
              <h1 className="text-3xl text-gray-900 mb-4">{country.title}</h1>
              <p className="text-gray-600 mb-4">{country.description}</p>
              <p className="text-sm text-gray-500 mb-6">{country.intro}</p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`${basePath}/`}
                  onClick={(event) => {
                    event.preventDefault();
                    trackCtaClick('country_landing_order');
                    const scrolled = requestScrollTo('vehicle-selection');
                    if (!scrolled) {
                      window.location.href = `${basePath}/`;
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow"
                >
                  {country.ctaPrimary}
                </a>
                <a
                  href={`${basePath}/${getRouteSlug(locale, 'pricing')}`}
                  onClick={() => trackNavClick('country_landing_pricing')}
                  className="gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50"
                >
                  {country.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{country.highlightsTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {country.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{country.airportsTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {country.airports.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {airportPages.length > 0 && (
                <div className="mt-4 grid gap-2 text-sm">
                  {airportPages.map((airport) => (
                    <a
                      key={airport.slug}
                      href={`${basePath}/${airport.slug}`}
                      onClick={() => trackNavClick('country_landing_airport_link')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {airport.airport}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-4">{country.faqTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
              {country.faq.map((entry) => (
                <div key={entry.question} className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-7">
                  <h3 className="text-gray-900 mb-2">{entry.question}</h3>
                  <p className="text-sm text-gray-600">{entry.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
}
