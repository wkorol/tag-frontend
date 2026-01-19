import { Suspense, useEffect, useState } from 'react';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { Pricing } from '../components/Pricing';
import { OrderForm } from '../components/OrderForm';
import { QuoteForm } from '../components/QuoteForm';
import { getRouteSlug } from '../lib/routes';
import { localeToPath, useI18n } from '../lib/i18n';
import { trackCtaClick, trackFormOpen } from '../lib/tracking';
import { requestScrollTo } from '../lib/scroll';

export function PricingPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const [vehicleType, setVehicleType] = useState<'standard' | 'bus'>('standard');
  const [selectedRoute, setSelectedRoute] = useState<{
    from: string;
    to: string;
    priceDay: number;
    priceNight: number;
    type: 'standard' | 'bus';
  } | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const orderLinks = [
    {
      href: `${basePath}/${getRouteSlug(locale, 'orderAirportGdansk')}`,
      label: t.routeLanding.orderLinks.airportGdansk,
    },
    {
      href: `${basePath}/${getRouteSlug(locale, 'orderAirportSopot')}`,
      label: t.routeLanding.orderLinks.airportSopot,
    },
    {
      href: `${basePath}/${getRouteSlug(locale, 'orderAirportGdynia')}`,
      label: t.routeLanding.orderLinks.airportGdynia,
    },
    {
      href: `${basePath}/${getRouteSlug(locale, 'orderCustom')}`,
      label: t.routeLanding.orderLinks.custom,
    },
  ];

  useEffect(() => {
    if (showQuoteForm) {
      trackFormOpen('quote');
    }
  }, [showQuoteForm]);

  return (
    <div className="min-h-screen bg-gray-50 pb-32 sm:pb-0">
      <Navbar />
      <main>
        <section className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-12">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h1 className="text-3xl text-gray-900 mb-4">{t.pricingLanding.title}</h1>
              <p className="text-gray-600 mb-4">{t.pricingLanding.subtitle}</p>
              <p className="text-sm text-gray-500 mb-6">{t.pricingLanding.description}</p>
              <a
                href={`${basePath}/`}
                onClick={(event) => {
                  event.preventDefault();
                  trackCtaClick('pricing_landing_order');
                  const scrolled = requestScrollTo('vehicle-selection');
                  if (!scrolled) {
                    window.location.href = `${basePath}/`;
                  }
                }}
                className="inline-flex items-center gap-2 bg-orange-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-600 transition-colors animate-pulse-glow"
              >
                {t.pricingLanding.cta}
              </a>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  {t.routeLanding.quickLinks}
                </span>
                {orderLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid gap-6 md:grid-cols-3">
            {t.pricingLanding.highlights.map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-6">
                <h2 className="text-gray-900 mb-2">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </section>

        <Pricing
          vehicleType={vehicleType}
          onOrderRoute={(route) => {
            trackFormOpen('order');
            setSelectedRoute(route);
          }}
          onRequestQuote={() => setShowQuoteForm(true)}
          onBack={() => setVehicleType('standard')}
          showBack={false}
          variant="landing"
          onVehicleTypeChange={setVehicleType}
        />

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-4">{t.pricingLanding.faqTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
              {t.pricingLanding.faq.map((entry) => (
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

      {selectedRoute && (
        <Suspense fallback={null}>
          <OrderForm route={selectedRoute} onClose={() => setSelectedRoute(null)} />
        </Suspense>
      )}

      {showQuoteForm && (
        <Suspense fallback={null}>
          <QuoteForm onClose={() => setShowQuoteForm(false)} />
        </Suspense>
      )}
    </div>
  );
}
