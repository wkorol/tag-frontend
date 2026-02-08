import { Breadcrumbs } from '../components/Breadcrumbs';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { Navbar } from '../components/Navbar';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';
import { trackCtaClick, trackNavClick } from '../lib/tracking';
import { requestScrollTo } from '../lib/scroll';
import { usePageTitle } from '../lib/usePageTitle';

interface RouteLandingProps {
  title: string;
  description: string;
  route: string;
  examples: string[];
  pricing: {
    day: number;
    night: number;
  };
}

export function RouteLanding({ title, description, route, examples, pricing }: RouteLandingProps) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  usePageTitle(title);

  const fallbackSeoParagraphByLocale: Record<string, string> = {
    pl: `Zarezerwuj prywatny transfer lotniskowy na trasie ${route} ze stałą ceną, dostępnością 24/7 i szybkim potwierdzeniem.`,
    de: `Buchen Sie einen privaten Flughafentransfer auf der Strecke ${route} mit Festpreis, 24/7 Verfügbarkeit und schneller Bestätigung.`,
    fi: `Varaa yksityinen lentokenttäkuljetus reitille ${route} kiinteällä hinnalla, 24/7 saatavuudella ja nopealla vahvistuksella.`,
    no: `Bestill privat flyplasstransport på ruten ${route} med fast pris, 24/7 tilgjengelighet og rask bekreftelse.`,
    sv: `Boka privat flygplatstransfer på sträckan ${route} med fast pris, tillgänglighet dygnet runt och snabb bekräftelse.`,
    da: `Book privat lufthavnstransfer på ruten ${route} med fast pris, 24/7 tilgængelighed og hurtig bekræftelse.`,
    en: `Book private airport transfer on route ${route} with fixed prices, 24/7 availability, and quick confirmation.`,
  };
  const fallbackPricingSubtitleByLocale: Record<string, string> = {
    pl: `Szacunkowe ceny dla trasy ${route}.`,
    de: `Beispielpreise für die Strecke ${route}.`,
    fi: `Arvioidut hinnat reitille ${route}.`,
    no: `Estimerte priser for ruten ${route}.`,
    sv: `Uppskattade priser för sträckan ${route}.`,
    da: `Estimerede priser for ruten ${route}.`,
    en: `Estimated prices for route ${route}.`,
  };

  const seoParagraph =
    typeof t.routeLanding?.seoParagraph === 'function'
      ? t.routeLanding.seoParagraph(route)
      : fallbackSeoParagraphByLocale[locale] ?? fallbackSeoParagraphByLocale.en;
  const pricingSubtitle =
    typeof t.routeLanding?.pricingSubtitle === 'function'
      ? t.routeLanding.pricingSubtitle(route)
      : fallbackPricingSubtitleByLocale[locale] ?? fallbackPricingSubtitleByLocale.en;
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
                  { label: title },
                ]}
              />
              <h1 className="text-3xl text-gray-900 mb-4">{title}</h1>
              <p className="text-gray-600 mb-6">{description}</p>
              <p className="text-sm text-gray-500 mb-6">{seoParagraph}</p>
              <a
                href={`${basePath}/`}
                onClick={(event) => {
                  event.preventDefault();
                  trackCtaClick('route_landing_order');
                  const scrolled = requestScrollTo('vehicle-selection');
                  if (!scrolled) {
                    window.location.href = `${basePath}/`;
                  }
                }}
                className="inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow"
              >
                {t.routeLanding.orderNow}
              </a>
              <div className="mt-4 flex flex-col items-start gap-2 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <span className="text-xs uppercase tracking-wide text-gray-400">
                  {t.routeLanding.quickLinks}
                </span>
                {orderLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => trackNavClick('route_landing_order_link')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href={`${basePath}/${getRouteSlug(locale, 'pricing')}`}
                  onClick={() => trackNavClick('route_landing_pricing')}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {t.routeLanding.pricingLink}
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-5xl mx-auto px-4 grid gap-8 md:grid-cols-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{t.routeLanding.includedTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {t.routeLanding.includedList.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-xl text-gray-900 mb-3">{t.routeLanding.destinationsTitle}</h2>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
                {examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div>
                  <h2 className="text-xl text-gray-900">{t.routeLanding.pricingTitle}</h2>
                  <p className="text-sm text-gray-600">{pricingSubtitle}</p>
                </div>
                <span className="text-xs uppercase tracking-wide text-gray-500">{t.routeLanding.vehicleLabel}</span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <div className="text-sm text-gray-500 mb-1">{t.routeLanding.dayLabel}</div>
                  <div className="text-2xl text-gray-900 font-semibold">
                    {pricing.day} {t.routeLanding.currency}
                  </div>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-4">
                  <div className="text-sm text-gray-500 mb-1 leading-tight">
                    {t.routeLanding.nightLabel}{' '}
                    <span className="text-[10px] text-gray-400">{t.pricing.sundayNote}</span>
                  </div>
                  <div className="text-2xl text-gray-900 font-semibold">
                    {pricing.night} {t.routeLanding.currency}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">{t.routeLanding.pricingNote}</p>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white border-t border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-xl text-gray-900 mb-4">{t.routeLanding.faqTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
              {t.routeLanding.faq.map((entry) => (
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
