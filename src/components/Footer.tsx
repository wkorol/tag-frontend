import { Mail, MapPin } from 'lucide-react';
import { useI18n } from '../lib/i18n';
import { getRoutePath } from '../lib/routes';

export function Footer() {
  const { t, locale } = useI18n();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white mb-4">Taxi Airport Gdańsk</h3>
            <p className="text-sm">
              {t.footer.description}
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">{t.footer.contactTitle}</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:booking@taxiairportgdansk.com" className="hover:text-white transition-colors">
                  booking@taxiairportgdansk.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t.footer.location}</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                {t.footer.bookingNote}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4">{t.footer.hoursTitle}</h4>
            <p className="text-sm">{t.footer.hoursBody}</p>
            <p className="text-sm mt-2">
              {t.footer.hoursSub}
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">{t.footer.routesTitle}</h4>
            <div className="space-y-2 text-sm">
              <a href={getRoutePath(locale, 'airportTaxi')} className="block hover:text-white transition-colors">
                {t.navbar.airportTaxi}
              </a>
              <a href={getRoutePath(locale, 'airportSopot')} className="block hover:text-white transition-colors">
                {t.navbar.airportSopot}
              </a>
              <a href={getRoutePath(locale, 'airportGdynia')} className="block hover:text-white transition-colors">
                {t.navbar.airportGdynia}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Taxi Airport Gdańsk. {t.footer.rights}
            {' '}
            <a href={getRoutePath(locale, 'cookies')} className="text-gray-300 hover:text-white underline">
              {t.footer.cookiePolicy}
            </a>
            {' '}
            <span className="text-gray-500">|</span>
            {' '}
            <a href={getRoutePath(locale, 'privacy')} className="text-gray-300 hover:text-white underline">
              {t.footer.privacyPolicy}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
