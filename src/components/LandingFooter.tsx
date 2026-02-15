import { Mail, MapPin } from 'lucide-react';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRoutePath } from '../lib/routes';
import { trackContactClick, trackNavClick } from '../lib/tracking';

export function LandingFooter() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);

  return (
    <footer className="bg-gray-900 text-gray-200 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-white mb-3">Taxi Airport Gdańsk</h3>
            <p className="text-sm text-gray-200">{t.footer.description}</p>
          </div>

          <div>
            <h4 className="text-white mb-3">{t.footer.contactTitle}</h4>
            <div className="space-y-2 text-sm text-gray-200">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:booking@taxiairportgdansk.com"
                  onClick={() => trackContactClick('email')}
                  className="inline-flex min-h-11 items-center py-1 text-white visited:text-white hover:text-gray-200 transition-colors"
                >
                  booking@taxiairportgdansk.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{t.footer.location}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-3">{t.footer.routesTitle}</h4>
            <div className="space-y-1 text-sm">
              <a
                href={getRoutePath(locale, 'pricing')}
                onClick={() => trackNavClick('landing_footer_pricing')}
                className="block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.navbar.prices}
              </a>
              <a
                href={`${basePath}/#vehicle-selection`}
                onClick={() => trackNavClick('landing_footer_book')}
                className="block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.common.orderOnlineNow}
              </a>
              <a
                href={getRoutePath(locale, 'orderCustom')}
                onClick={() => trackNavClick('landing_footer_custom')}
                className="block min-h-11 py-1 text-white visited:text-white hover:text-gray-200 transition-colors"
              >
                {t.routeLanding.orderLinks.custom}
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-6 text-center text-sm text-gray-200">
          <p>
            &copy; {new Date().getFullYear()} Taxi Airport Gdańsk. {t.footer.rights}{' '}
            <a
              href={getRoutePath(locale, 'cookies')}
              onClick={() => trackNavClick('landing_footer_cookies')}
              className="text-white visited:text-white hover:text-gray-200 underline"
            >
              {t.footer.cookiePolicy}
            </a>{' '}
            <span className="text-gray-300">|</span>{' '}
            <a
              href={getRoutePath(locale, 'privacy')}
              onClick={() => trackNavClick('landing_footer_privacy')}
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
