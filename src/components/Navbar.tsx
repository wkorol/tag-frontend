import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Locale, localeToPath, useI18n } from '../lib/i18n';
import { getRoutePath } from '../lib/routes';
import { requestScrollTo } from '../lib/scroll';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const basePath = localeToPath(locale);

  const handleLocaleChange = (nextLocale: Locale) => {
    setLocale(nextLocale);
    const nextBasePath = localeToPath(nextLocale);
    const strippedPath = location.pathname.replace(/^\/(en|pl)/, '');
    const targetPath = `${nextBasePath}${strippedPath || ''}${location.search}`;
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
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href={`${basePath}/`}
            onClick={(event) => handleNavClick(event, 'hero')}
            className="flex items-center"
          >
            <span className="leading-tight text-sm font-semibold text-gray-900">
              <span className="block">Taxi Airport</span>
              <span className="block text-xs font-medium text-gray-500">Gdańsk</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div
            className={`hidden md:flex items-center gap-8 ${locale === 'pl' ? 'text-sm' : 'text-base'}`}
          >
            <a
              href={`${basePath}/`}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.home}
            </a>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleNavClick(event, 'fleet')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.fleet}
            </a>
            <a
              href={getRoutePath(locale, 'airportTaxi')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportTaxi}
            </a>
            <a
              href={getRoutePath(locale, 'airportSopot')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportSopot}
            </a>
            <a
              href={getRoutePath(locale, 'airportGdynia')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportGdynia}
            </a>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
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
                className="border border-gray-200 rounded-md px-2 py-1 text-sm text-gray-700 bg-white"
              >
                <option value="en">EN</option>
                <option value="pl">PL</option>
              </select>
            </div>
            <a
              href={`${basePath}/`}
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t.navbar.orderNow}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
          <div className="md:hidden pb-4 space-y-3">
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
