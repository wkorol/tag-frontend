import { useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { Navbar } from '../components/Navbar';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';
import { trackCtaClick, trackNavClick } from '../lib/tracking';
import { getCountryAirportBySlug, getCountryAirportCountry } from '../lib/countryAirports';
import { NotFoundPage } from './NotFoundPage';

const replaceTokens = (text: string, tokens: Record<string, string>) =>
  Object.entries(tokens).reduce((acc, [key, value]) => acc.replaceAll(`{${key}}`, value), text);

export function CountryAirportLanding() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const { airportSlug } = useParams<{ airportSlug: string }>();
  const airportData = airportSlug ? getCountryAirportBySlug(locale, airportSlug) : null;

  if (!airportData) {
    return <NotFoundPage />;
  }

  const country = getCountryAirportCountry(locale);
  const tokens = {
    city: airportData.city,
    airport: airportData.airport,
    country,
  };
  const landing = t.airportLanding;
  const destinations = t.pages?.gdanskTaxi?.examples ?? [];

  const highlights = landing.highlights.map((item) => replaceTokens(item, tokens));
  const faq = landing.faq.map((entry) => ({
    question: replaceTokens(entry.question, tokens),
    answer: replaceTokens(entry.answer, tokens),
  }));

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
                  { label: landing.title(airportData.city, airportData.airport) },
                ]}
              />
              <h1 className="text-3xl text-gray-900 mb-4">
                {landing.title(airportData.city, airportData.airport)}
              </h1>
              <p className="text-gray-600 mb-4">
                {landing.description(airportData.city, airportData.airport)}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {landing.intro(airportData.city, airportData.airport)}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`${basePath}/`}
                  onClick={(event) => {
                    event.preventDefault();
                    trackCtaClick('airport_landing_order');
                    const scrolled = requestScrollTo('vehicle-selection');
                    if (!scrolled) {
                      window.location.href = `${basePath}/`;
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow"
                >
                  {landing.ctaPrimary}
                </a>
                <a
                  href={`${basePath}/${getRouteSlug(locale, 'pricing')}`}
                  onClick={() => trackNavClick('airport_landing_pricing')}
                  className="gemini-cta inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-blue-800 shadow-sm transition-colors hover:bg-blue-50"
                >
                  {landing.ctaSecondary}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{landing.routeTitle(airportData.airport)}</h2>
              <p className="text-sm text-gray-600">
                {landing.routeBody(airportData.airport)}
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{landing.highlightsTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-3">{landing.destinationsTitle}</h2>
            <ul className="grid gap-2 text-sm text-gray-600 md:grid-cols-2">
              {destinations.map((item) => (
                <li key={item} className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-4">{landing.faqTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
              {faq.map((entry) => (
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
