import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white mb-4">Taxi Airport Gdańsk</h3>
            <p className="text-sm">
              Professional airport transfer service in the Tri-City area. Available 24/7.
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:booking@taxiairportgdansk.com" className="hover:text-white transition-colors">
                  booking@taxiairportgdansk.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Gdańsk, Poland</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Book online, via WhatsApp, or email
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-white mb-4">Service Hours</h4>
            <p className="text-sm">24/7 - Available every day</p>
            <p className="text-sm mt-2">
              Airport pickups, city transfers, and custom routes
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Popular Routes</h4>
            <div className="space-y-2 text-sm">
              <a href="/gdansk-airport-taxi" className="block hover:text-white transition-colors">
                Gdańsk Airport Taxi
              </a>
              <a href="/gdansk-airport-to-sopot" className="block hover:text-white transition-colors">
                Airport ↔ Sopot
              </a>
              <a href="/gdansk-airport-to-gdynia" className="block hover:text-white transition-colors">
                Airport ↔ Gdynia
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Taxi Airport Gdańsk. All rights reserved.
            {' '}
            <a href="/cookies" className="text-gray-300 hover:text-white underline">
              Cookie Policy
            </a>
            {' '}
            <span className="text-gray-500">|</span>
            {' '}
            <a href="/privacy" className="text-gray-300 hover:text-white underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
