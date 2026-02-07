import logo from 'figma:asset/9bf12920b9f211a57ac7e4ff94480c867662dafa.png';
import logoAvif384 from '../assets/logo-384.avif';
import logoAvif512 from '../assets/logo-512.avif';
import logoAvif640 from '../assets/logo-640.avif';
import { trackContactClick, trackCtaClick } from '../lib/tracking';
import { useI18n, localeToPath } from '../lib/i18n';
import { requestScrollTo } from '../lib/scroll';

export function Hero() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;

  const heroBgUrl = '/background-960.webp';

  return (
    <div id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <img
          src={heroBgUrl}
          srcSet="/background-480.webp 480w, /background-640.webp 640w, /background-960.webp 960w, /background-1280.webp 1280w, /background-1600.webp 1600w"
          sizes="(max-width: 640px) 75vw, (max-width: 1024px) 90vw, 1600px"
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
                  sizes="(max-width: 640px) 68vw, 22rem"
                />
                <img
                  src={logo}
                  alt={t.hero.logoAlt}
                  className="h-auto"
                  style={{ width: 'min(22rem, 68vw)' }}
                  width={768}
                  height={768}
                  decoding="async"
                  loading="eager"
                  fetchpriority="low"
                  sizes="(max-width: 640px) 68vw, 22rem"
                />
              </picture>
            </div>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
                href={whatsappLink}
                onClick={() => trackContactClick('whatsapp')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-gray-900 font-semibold text-base shadow-sm transition-colors"
                style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 fill-current">
                <path d="M19.11 17.72c-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.79-1.92-.21-.5-.43-.43-.58-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.81 2.76 4.4 3.87.62.27 1.1.43 1.48.55.62.2 1.18.17 1.63.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.17-.5-.3z" />
                <path d="M26.67 5.33A14.9 14.9 0 0016.03 1.5C8.12 1.5 1.5 8.13 1.5 16.03c0 2.4.63 4.76 1.83 6.85L1.5 30.5l7.81-1.79a14.93 14.93 0 006.72 1.61h.01c7.9 0 14.53-6.63 14.53-14.53 0-3.88-1.52-7.53-4.4-10.46zm-10.64 22.3h-.01a12.4 12.4 0 01-6.32-1.73l-.45-.27-4.64 1.06 1.24-4.52-.3-.46a12.45 12.45 0 01-2-6.68c0-6.86 5.58-12.44 12.45-12.44 3.32 0 6.43 1.3 8.77 3.65a12.33 12.33 0 013.64 8.79c0 6.86-5.59 12.44-12.38 12.44z" />
              </svg>
              {t.common.whatsapp}
            </a>
            <a
                href="mailto:booking@taxiairportgdansk.com"
                onClick={() => trackContactClick('email')}
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              <span aria-hidden="true">✉️</span>
              {t.hero.orderViaEmail}
            </a>
            <a
                href={`${basePath}/`}
                onClick={(event) => {
                  event.preventDefault();
                  trackCtaClick('hero_order_online');
                  requestScrollTo('vehicle-selection');
                }}
                className="inline-flex items-center gap-2 bg-orange-800 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-700 transition-colors animate-pulse-glow"
            >
              {t.common.orderOnlineNow}
            </a>
          </div>
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white">
              {t.common.noPrepayment}
            </span>
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
