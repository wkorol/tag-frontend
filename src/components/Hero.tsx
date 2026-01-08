import { MessageCircle, Mail, Bus, Car, Clock, BadgeCheck, Plane, CalendarCheck2, BadgeDollarSign, MapPin, Headphones } from 'lucide-react';
import logo from 'figma:asset/9bf12920b9f211a57ac7e4ff94480c867662dafa.png';
import logoAvif from '../assets/7a4ddc58-4604-4ddd-9d85-e57bfd26feba.avif';
import { trackContactClick, trackCtaClick } from '../lib/tracking';
import { useI18n, localeToPath } from '../lib/i18n';
import { requestScrollTo } from '../lib/scroll';

export function Hero() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;

  const heroBgBase = 'https://images.unsplash.com/photo-1727806823305-451437800778?crop=entropy&cs=tinysrgb&fit=max&fm=webp&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXhpJTIwYWlycG9ydHxlbnwxfHx8fDE3NjcwODUyODV8MA&ixlib=rb-4.1.0&q=70&utm_source=figma&utm_medium=referral';

  return (
    <div id="hero" className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <img
        src={`${heroBgBase}&w=1920`}
        srcSet={`${heroBgBase}&w=960 960w, ${heroBgBase}&w=1440 1440w, ${heroBgBase}&w=1920 1920w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        className="hero-bg absolute inset-0 -z-10 h-full w-full object-cover opacity-20 pointer-events-none"
        loading="eager"
        fetchpriority="high"
        decoding="async"
        width={960}
        height={640}
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
                <source srcSet={logoAvif} type="image/avif" />
                <img
                  src={logo}
                  alt={t.hero.logoAlt}
                  className="h-auto"
                  style={{ width: '31rem' }}
                  width={1024}
                  height={1024}
                  decoding="async"
                  loading="eager"
                  fetchpriority="high"
                />
              </picture>
            </div>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
                href={whatsappLink}
                onClick={() => trackContactClick('whatsapp')}
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5"/>
              {t.common.whatsapp}
            </a>
            <a
                href="mailto:booking@taxiairportgdansk.com"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Mail className="w-5 h-5" />
              {t.hero.orderViaEmail}
            </a>
            <a
                href={`${basePath}/`}
                onClick={(event) => {
                  event.preventDefault();
                  trackCtaClick('hero_order_online');
                  requestScrollTo('vehicle-selection');
                }}
                className="inline-flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-500 transition-colors animate-pulse-glow"
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
                  <Plane className="w-8 h-8 text-orange-400 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.flightTrackingTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.flightTrackingBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <BadgeCheck className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.meetGreetTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.meetGreetBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-2"/>
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
                  <CalendarCheck2 className="w-8 h-8 text-cyan-300 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.freePrebookingTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.freePrebookingBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <BadgeDollarSign className="w-8 h-8 text-emerald-300 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.fixedPriceTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.fixedPriceBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <MapPin className="w-8 h-8 text-indigo-200 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">{t.hero.benefitsList.localExpertiseTitle}</h3>
                  <p className="text-blue-200 text-sm">
                    {t.hero.benefitsList.localExpertiseBody}
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <Headphones className="w-8 h-8 text-rose-200 mx-auto mb-2"/>
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
              <Car className="w-16 h-16 text-blue-100 mb-3"/>
              <p className="text-white text-center mb-2">{t.hero.standardCarsTitle}</p>
              <p className="text-blue-200 text-sm text-center">
                {t.hero.standardCarsBody}
              </p>
            </div>

            {/* Buses Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-blue-300/30 hover:border-blue-300/50 transition-all flex flex-col items-center justify-center p-8">
              <Bus className="w-16 h-16 text-blue-200 mb-3" />
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
