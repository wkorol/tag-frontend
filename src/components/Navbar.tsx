import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from 'figma:asset/9bf12920b9f211a57ac7e4ff94480c867662dafa.png';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }
    window.location.href = `/#${sectionId}`;
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
            href="/#hero"
            onClick={(event) => handleNavClick(event, 'hero')}
            className="flex items-center"
          >
            <img
              src={logo}
              alt="Taxi Airport Gdańsk"
              className="h-12 w-auto"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/#fleet"
              onClick={(event) => handleNavClick(event, 'fleet')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Our Fleet
            </a>
            <a
              href="/#vehicle-selection"
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Prices
            </a>
            <a
              href="/#vehicle-selection"
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ORDER NOW
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
              href="/#fleet"
              onClick={(event) => handleNavClick(event, 'fleet')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Our Fleet
            </a>
            <a
              href="/#vehicle-selection"
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              Prices
            </a>
            <a
              href="/#vehicle-selection"
              onClick={(event) => handleNavClick(event, 'vehicle-selection')}
              className="block w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ORDER NOW
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
