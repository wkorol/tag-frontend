import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from 'figma:asset/9bf12920b9f211a57ac7e4ff94480c867662dafa.png';
import { Locale, localeToPath, useI18n } from '../lib/i18n';

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
    const targetPath = `${nextBasePath}${strippedPath || ''}${location.search}${location.hash}`;
    navigate(targetPath || nextBasePath);
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }
    window.location.href = `${basePath}/#${sectionId}`;
    setIsMenuOpen(false);
  };

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      event.preventDefault();
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href={`${basePath}/#hero`}
            onClick={(event) => handleNavClick(event, 'hero')}
            className="flex items-center"
          >
            <img
              src={logo}
              alt={t.hero.logoAlt}
              className="h-12 w-auto"
            />
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
              href={`${basePath}/#fleet`}
              onClick={(event) => handleNavClick(event, 'fleet')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.fleet}
            </a>
            <a
              href={`${basePath}/gdansk-airport-taxi`}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportTaxi}
            </a>
            <a
              href={`${basePath}/gdansk-airport-to-sopot`}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportSopot}
            </a>
            <a
              href={`${basePath}/gdansk-airport-to-gdynia`}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportGdynia}
            </a>
            <a
              href={`${basePath}/#vehicle-selection`}
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
              href={`${basePath}/#vehicle-selection`}
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
              href={`${basePath}/#fleet`}
              onClick={(event) => handleNavClick(event, 'fleet')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.fleet}
            </a>
            <a
              href={`${basePath}/gdansk-airport-taxi`}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportTaxi}
            </a>
            <a
              href={`${basePath}/gdansk-airport-to-sopot`}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportSopot}
            </a>
            <a
              href={`${basePath}/gdansk-airport-to-gdynia`}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {t.navbar.airportGdynia}
            </a>
            <a
              href={`${basePath}/#vehicle-selection`}
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
              href={`${basePath}/#vehicle-selection`}
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
