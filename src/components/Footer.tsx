import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white mb-4">Taxi Airport Gdańsk</h3>
            <p className="text-sm">
              Professional airport transfer service in the Tri-City area. Available 24/7. TEST123
            </p>
          </div>

          <div>
            <h4 className="text-white mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:booking@taxiairportgdansk.pl" className="hover:text-white transition-colors">
                  booking@taxiairportgdansk.pl
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Gdańsk, Poland</span>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                Book online or via email only
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
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Taxi Airport Gdańsk. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}