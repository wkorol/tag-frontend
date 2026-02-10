import { Mail, MapPin } from 'lucide-react';
import { localeToPath, useI18n } from '../lib/i18n';
import { getCityRoutes } from '../lib/cityRoutes';
import { getRoutePath } from '../lib/routes';
import { trackContactClick, trackNavClick } from '../lib/tracking';

export function Footer() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const popularPlCitySlugs = [
    'taxi-lotnisko-gdansk-wejherowo',
    'taxi-lotnisko-gdansk-rumia',
    'taxi-lotnisko-gdansk-reda',
    'taxi-lotnisko-gdansk-malbork',
    'taxi-lotnisko-gdansk-slupsk',
    'taxi-lotnisko-gdansk-hel',
  ];
  const popularPlCityRoutes =
    locale === 'pl'
      ? getCityRoutes('pl').filter((route) => popularPlCitySlugs.includes(route.slug))
      : [];

  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white mb-4">Taxi Airport Gdańsk</h3>
            <p className="text-sm text-gray-200">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">{t.footer.contactTitle}</h4>
            <div className="space-y-3 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:booking@taxiairportgdansk.com"
                  onClick={() => trackContactClick('email')}
                  className="text-white visited:text-white hover:text-gray-200 transition-colors"
                >
                  booking@taxiairportgdansk.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t.footer.location}</span>
              </div>
              <p className="text-xs text-gray-200 mt-4">
                {t.footer.bookingNote}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4">{t.footer.hoursTitle}</h4>
            <p className="text-sm text-gray-200">{t.footer.hoursBody}</p>
            <p className="text-sm mt-2 text-gray-200">
              {t.footer.hoursSub}
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">{t.footer.routesTitle}</h4>
            <div className="space-y-2 text-sm">
              <a
                href={getRoutePath(locale, 'pricing')}
                onClick={() => trackNavClick('footer_pricing')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.navbar.prices}
              </a>
              <a
                href={getRoutePath(locale, 'orderAirportGdansk')}
                onClick={() => trackNavClick('footer_order_airport_gdansk')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.routeLanding.orderLinks.airportGdansk}
              </a>
              <a
                href={getRoutePath(locale, 'orderAirportSopot')}
                onClick={() => trackNavClick('footer_order_airport_sopot')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.routeLanding.orderLinks.airportSopot}
              </a>
              <a
                href={getRoutePath(locale, 'orderAirportGdynia')}
                onClick={() => trackNavClick('footer_order_airport_gdynia')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.routeLanding.orderLinks.airportGdynia}
              </a>
              <a
                href={getRoutePath(locale, 'orderCustom')}
                onClick={() => trackNavClick('footer_order_custom')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.routeLanding.orderLinks.custom}
              </a>
              <div className="h-2" />
              <a
                href={getRoutePath(locale, 'countryLanding')}
                onClick={() => trackNavClick('footer_country_landing')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.countryLanding?.title ?? t.navbar.airportTaxi}
              </a>
              <a
                href={getRoutePath(locale, 'taxiGdanskCity')}
                onClick={() => trackNavClick('footer_taxi_gdansk')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.cityTaxi?.title ?? 'Taxi Gdańsk'}
              </a>
              <a
                href={getRoutePath(locale, 'airportTaxi')}
                onClick={() => trackNavClick('footer_airport_taxi')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.navbar.airportTaxi}
              </a>
              <a
                href={getRoutePath(locale, 'airportSopot')}
                onClick={() => trackNavClick('footer_airport_sopot')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.navbar.airportSopot}
              </a>
              <a
                href={getRoutePath(locale, 'airportGdynia')}
                onClick={() => trackNavClick('footer_airport_gdynia')}
                className="block text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.navbar.airportGdynia}
              </a>

              {locale === 'pl' && popularPlCityRoutes.length > 0 ? (
                <>
                  <div className="h-3" />
                  <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
                    Popularne trasy (PL)
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] leading-snug text-gray-200">
                    {popularPlCityRoutes.map((route) => (
                      <a
                        key={route.slug}
                        href={`${basePath}/${route.slug}`}
                        onClick={() => trackNavClick(`footer_city_${route.slug}`)}
                        className="text-white visited:text-white hover:text-gray-200 transition-colors"
                      >
                        Lotnisko ↔ {route.destination}
                      </a>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center text-sm text-gray-200">
          <p>
            &copy; {new Date().getFullYear()} Taxi Airport Gdańsk. {t.footer.rights}
            {' '}
            <a
              href={getRoutePath(locale, 'cookies')}
              onClick={() => trackNavClick('footer_cookies')}
              className="text-white visited:text-white hover:text-gray-200 underline"
            >
              {t.footer.cookiePolicy}
            </a>
            {' '}
            <span className="text-gray-300">|</span>
            {' '}
            <a
              href={getRoutePath(locale, 'privacy')}
              onClick={() => trackNavClick('footer_privacy')}
              className="text-white visited:text-white hover:text-gray-200 underline"
            >
              {t.footer.privacyPolicy}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
