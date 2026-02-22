import logoAvif384 from '../assets/logo-384.avif';
import logoAvif512 from '../assets/logo-512.avif';
import logoAvif640 from '../assets/logo-640.avif';
import logoWebp384 from '../assets/logo-384.webp';
import logoWebp512 from '../assets/logo-512.webp';
import logoWebp640 from '../assets/logo-640.webp';
import { useI18n, localeToPath } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';

export function Hero() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);

  const heroBgUrl = '/background-640.webp';
  const quickLinks = [
    { href: `${basePath}/${getRouteSlug(locale, 'pricing')}`, label: t.navbar.prices },
    { href: `${basePath}/${getRouteSlug(locale, 'orderAirportGdansk')}`, label: t.routeLanding.orderLinks.airportGdansk },
    { href: `${basePath}/${getRouteSlug(locale, 'orderAirportSopot')}`, label: t.routeLanding.orderLinks.airportSopot },
    { href: `${basePath}/${getRouteSlug(locale, 'orderAirportGdynia')}`, label: t.routeLanding.orderLinks.airportGdynia },
    { href: `${basePath}/${getRouteSlug(locale, 'orderCustom')}`, label: t.routeLanding.orderLinks.custom },
  ];

  return (
    <div id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <img
          src={heroBgUrl}
          srcSet="/background-400.webp 400w, /background-480.webp 480w, /background-640.webp 640w, /background-960.webp 960w, /background-1280.webp 1280w, /background-1600.webp 1600w"
          sizes="(max-width: 640px) 68vw, (max-width: 1024px) 85vw, 1400px"
        alt="Taxi Airport Gdansk hero background"
        className="hero-bg absolute inset-0 -z-10 h-full w-full object-cover opacity-20 pointer-events-none"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        width={1600}
        height={900}
      />
      
      <div className="hero-content relative max-w-6xl mx-auto px-4 py-12 sm:py-24">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-2 text-xs sm:text-sm text-white shadow-sm backdrop-blur-sm">
                <span className="font-semibold">{t.hero.promo.dayPrice}</span>
                <span>{t.hero.promo.dayLabel}</span>
                <span className="text-white/70">•</span>
                <span className="font-semibold">{t.hero.promo.nightPrice}</span>
                <span>{t.hero.promo.nightLabel}</span>
              </div>
            </div>
            <div className="hero-logo flex justify-center mb-2">
              <picture>
                <source
                  srcSet={`${logoAvif384} 384w, ${logoAvif512} 512w, ${logoAvif640} 640w`}
                  type="image/avif"
                  sizes="(max-width: 640px) 62vw, 16rem"
                />
                <source
                  srcSet={`${logoWebp384} 384w, ${logoWebp512} 512w, ${logoWebp640} 640w`}
                  type="image/webp"
                  sizes="(max-width: 640px) 62vw, 16rem"
                />
                <img
                  src={logoWebp384}
                  alt={t.hero.logoAlt}
                  className="hero-logo-image h-auto animate-hero-logo-pulse"
                  style={{ width: 'min(16rem, 62vw)' }}
                  width={384}
                  height={384}
                  decoding="async"
                  loading="eager"
                  sizes="(max-width: 640px) 62vw, 16rem"
                />
              </picture>
            </div>
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {t.common.noPrepayment}
            </span>
          </div>
          <div className="mt-4 flex flex-col items-center px-2 text-xs text-white/80">
            <span className="mb-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/60">
              {t.routeLanding.quickLinks}
            </span>
            <div className="quick-links">
              {quickLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5 max-w-2xl mx-auto">
            <h1 className="text-xl sm:text-2xl text-blue-100 mb-3">
              {t.hero.headline}
            </h1>
            <p className="text-blue-200">
              {t.hero.subheadline}
            </p>
          </div>

          {/* Additional Services - SEO optimized */}
          <div className="mt-12 mb-10 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm px-6 py-6 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <h2 className="text-blue-100 text-lg sm:text-xl">{t.hero.whyChoose}</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-blue-200/80">{t.hero.benefits}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span aria-hidden="true" className="text-2xl mb-2">✈️</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.flightTrackingTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.flightTrackingBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span aria-hidden="true" className="text-2xl mb-2">✅</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.meetGreetTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.meetGreetBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span aria-hidden="true" className="text-2xl mb-2">⏱️</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.fastConfirmationTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.fastConfirmationBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span className="text-2xl block text-center mb-2">💳</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.flexiblePaymentsTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.flexiblePaymentsBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span aria-hidden="true" className="text-2xl mb-2">📅</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.freePrebookingTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.freePrebookingBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span aria-hidden="true" className="text-2xl mb-2">💵</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.fixedPriceTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.fixedPriceBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span aria-hidden="true" className="text-2xl mb-2">📍</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.localExpertiseTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.localExpertiseBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span aria-hidden="true" className="text-2xl mb-2">🎧</span>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.assistanceTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.assistanceBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Section */}
        <div id="fleet" className="mt-12">
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-blue-800/40 to-blue-700/20 backdrop-blur-sm px-6 py-8 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h3 className="text-blue-100 text-lg sm:text-xl">{t.hero.fleetTitle}</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-blue-200/80">{t.hero.fleetLabel}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Standard Cars Card */}
            <div
                className="bg-gradient-to-br from-gray-100/20 to-gray-200/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all flex flex-col items-center justify-center p-8">
              <span aria-hidden="true" className="text-5xl mb-3">🚕</span>
              <p className="text-white text-center mb-2">{t.hero.standardCarsTitle}</p>
              <p className="text-blue-200 text-sm text-center">
                {t.hero.standardCarsBody}
              </p>
            </div>

            {/* Buses Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-blue-300/30 hover:border-blue-300/50 transition-all flex flex-col items-center justify-center p-8">
              <span aria-hidden="true" className="text-5xl mb-3">🚌</span>
              <p className="text-white text-center mb-2">{t.hero.busTitle}</p>
              <p className="text-blue-200 text-sm text-center">
                {t.hero.busBody}
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
