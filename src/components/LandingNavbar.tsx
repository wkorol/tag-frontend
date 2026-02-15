import { useState } from 'react';
import { Locale, localeToPath, localeToRootPath, useI18n } from '../lib/i18n';
import { getRoutePath } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';
import { trackLocaleChange, trackNavClick } from '../lib/tracking';
import favicon from '/favicon.svg?url';

export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const basePath = localeToPath(locale);

  const handleLocaleChange = (nextLocale: Locale) => {
    trackLocaleChange(locale, nextLocale);
    setLocale(nextLocale);
    window.location.href = `${localeToRootPath(nextLocale)}${window.location.search}${window.location.hash}`;
  };

  const handleSectionNav = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string, label: string) => {
    event.preventDefault();
    trackNavClick(label);
    const scrolled = requestScrollTo(sectionId);
    if (!scrolled) {
      window.location.href = `${basePath}/`;
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <a
            href={`${basePath}/`}
            onClick={(event) => handleSectionNav(event, 'hero', 'landing_logo')}
            className="flex items-center gap-3"
          >
            <img src={favicon} alt="Taxi Airport Gdansk logo" className="h-8 w-8 rounded-md" />
            <span className="leading-tight text-sm font-semibold text-gray-900">
              <span className="block text-base tracking-wide">Taxi Airport</span>
              <span className="block text-xs font-semibold text-blue-700">Gdańsk</span>
            </span>
          </a>

          <div className="hidden md:flex flex-1 flex-nowrap items-center justify-center gap-4 lg:gap-6 text-[11px] lg:text-[13px] xl:text-sm min-w-0 tracking-tight">
            <a
              href={`${basePath}/`}
              onClick={(event) => handleSectionNav(event, 'fleet', 'landing_fleet')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.fleet}
            </a>
            <a
              href={getRoutePath(locale, 'airportTaxi')}
              onClick={() => trackNavClick('landing_airport_taxi')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.airportTaxi}
            </a>
            <a
              href={getRoutePath(locale, 'airportSopot')}
              onClick={() => trackNavClick('landing_airport_sopot')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.airportSopot}
            </a>
            <a
              href={getRoutePath(locale, 'airportGdynia')}
              onClick={() => trackNavClick('landing_airport_gdynia')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.airportGdynia}
            </a>
            <a
              href={getRoutePath(locale, 'pricing')}
              onClick={() => trackNavClick('landing_pricing')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.prices}
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span aria-hidden="true" className="text-sm">🌐</span>
              <label className="sr-only" htmlFor="landing-language-select">
                {t.navbar.language}
              </label>
              <select
                id="landing-language-select"
                value={locale}
                onChange={(event) => handleLocaleChange(event.target.value as Locale)}
                className="border border-gray-200 rounded-md px-2 py-1 text-[11px] lg:text-[13px] xl:text-sm text-gray-700 bg-white"
              >
                <option value="en">EN</option>
                <option value="pl">PL</option>
                <option value="de">DE</option>
                <option value="fi">FI</option>
                <option value="no">NO</option>
                <option value="sv">SV</option>
                <option value="da">DA</option>
              </select>
            </div>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleSectionNav(event, 'vehicle-selection', 'landing_order_now')}
              className="bg-blue-600 text-white px-3 py-2 lg:px-5 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {t.navbar.orderNow}
            </a>
          </div>

          <button
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
              trackNavClick(isMenuOpen ? 'landing_menu_close' : 'landing_menu_open');
            }}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="landing-mobile-nav"
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? (
              <span aria-hidden="true" className="block text-2xl leading-none">×</span>
            ) : (
              <span aria-hidden="true" className="block text-xl leading-none">☰</span>
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div id="landing-mobile-nav" className="md:hidden pb-4 space-y-3 text-sm">
            <a
              href={`${basePath}/`}
              onClick={(event) => handleSectionNav(event, 'fleet', 'landing_mobile_fleet')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.fleet}
            </a>
            <a
              href={getRoutePath(locale, 'airportTaxi')}
              onClick={() => trackNavClick('landing_mobile_airport_taxi')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportTaxi}
            </a>
            <a
              href={getRoutePath(locale, 'airportSopot')}
              onClick={() => trackNavClick('landing_mobile_airport_sopot')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportSopot}
            </a>
            <a
              href={getRoutePath(locale, 'airportGdynia')}
              onClick={() => trackNavClick('landing_mobile_airport_gdynia')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportGdynia}
            </a>
            <a
              href={getRoutePath(locale, 'pricing')}
              onClick={() => trackNavClick('landing_mobile_pricing')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.prices}
            </a>
            <div className="flex items-center gap-2 py-2 text-gray-700">
              <span aria-hidden="true" className="text-sm">🌐</span>
              <label className="text-sm" htmlFor="landing-language-select-mobile">
                {t.navbar.language}
              </label>
              <select
                id="landing-language-select-mobile"
                value={locale}
                onChange={(event) => handleLocaleChange(event.target.value as Locale)}
                className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 bg-white"
              >
                <option value="en">EN</option>
                <option value="pl">PL</option>
                <option value="de">DE</option>
                <option value="fi">FI</option>
                <option value="no">NO</option>
                <option value="sv">SV</option>
                <option value="da">DA</option>
              </select>
            </div>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleSectionNav(event, 'vehicle-selection', 'landing_mobile_order_now')}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.navbar.orderNow}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
