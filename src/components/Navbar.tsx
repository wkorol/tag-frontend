import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Locale, localeToPath, useI18n } from '../lib/i18n';
import { getRouteKeyFromSlug, getRoutePath, getRouteSlug } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';
import favicon from '../../public/favicon.svg';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
    const nextBasePath = localeToPath(nextLocale);
    const strippedPath = location.pathname.replace(/^\/(en|pl|de|fi|no|sv|da)/, '');
    const pathWithoutLeading = strippedPath.replace(/^\//, '');
    const [firstSegment, ...restSegments] = pathWithoutLeading.split('/').filter(Boolean);
    const routeKey = firstSegment ? getRouteKeyFromSlug(locale, firstSegment) : null;
    const nextSlug = routeKey ? getRouteSlug(nextLocale, routeKey) : '';
    const nextPath =
      nextSlug !== ''
        ? `/${[nextSlug, ...restSegments].filter(Boolean).join('/')}`
        : strippedPath;
    const targetPath = `${nextBasePath}${nextPath || ''}${location.search}${location.hash}`;
    navigate(targetPath || nextBasePath);
    setIsMenuOpen(false);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    const scrolled = requestScrollTo(sectionId);
    if (!scrolled) {
      navigate(basePath);
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href={`${basePath}/`}
            onClick={(event) => handleNavClick(event, 'hero')}
            className="flex items-center gap-3"
          >
            <img src={favicon} alt="" aria-hidden="true" className="h-8 w-8 rounded-md" />
            <span className="leading-tight text-sm font-semibold text-gray-900">
              <span className="block text-base tracking-wide">Taxi Airport</span>
              <span className="block text-xs font-semibold text-blue-700">Gdańsk</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex flex-1 flex-nowrap items-center justify-center gap-4 lg:gap-6 text-[11px] lg:text-[13px] xl:text-sm min-w-0 tracking-tight">
            <a
              href={`${basePath}/`}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.home}
            </a>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleNavClick(event, 'fleet')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.fleet}
            </a>
            <a
              href={getRoutePath(locale, 'airportTaxi')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.airportTaxi}
            </a>
            <a
              href={getRoutePath(locale, 'airportSopot')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.airportSopot}
            </a>
            <a
              href={getRoutePath(locale, 'airportGdynia')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.airportGdynia}
            </a>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="text-gray-700 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {t.navbar.prices}
            </a>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Globe className="w-4 h-4" />
              <label className="sr-only" htmlFor="language-select">
                {t.navbar.language}
              </label>
              <select
                id="language-select"
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
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="bg-blue-600 text-white px-3 py-2 lg:px-5 lg:py-3 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              {t.navbar.orderNow}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            className="md:hidden text-gray-700 hover:text-blue-600"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-nav" className="md:hidden pb-4 space-y-3 text-sm">
            <a
              href={`${basePath}/`}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.home}
            </a>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleNavClick(event, 'fleet')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.fleet}
            </a>
            <a
              href={getRoutePath(locale, 'airportTaxi')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportTaxi}
            </a>
            <a
              href={getRoutePath(locale, 'airportSopot')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportSopot}
            </a>
            <a
              href={getRoutePath(locale, 'airportGdynia')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportGdynia}
            </a>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.prices}
            </a>
            <div className="flex items-center gap-2 py-2 text-gray-700">
              <Globe className="w-4 h-4" />
              <label className="text-sm" htmlFor="language-select-mobile">
                {t.navbar.language}
              </label>
              <select
                id="language-select-mobile"
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
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
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
