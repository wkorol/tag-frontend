import { MessageCircle, Mail, Bus, Car, Clock, BadgeCheck, Plane } from 'lucide-react';
import logo from 'figma:asset/9bf12920b9f211a57ac7e4ff94480c867662dafa.png';
import { trackContactClick } from '../lib/tracking';

export function Hero() {
  const whatsappLink = 'https://wa.me/48694347548?text=Hello%20Taxi%20Airport%20Gda%C5%84sk,%20I%20would%20like%20to%20book%20a%20transfer.';

  return (
    <div id="hero" className="relative bg-gradient-to-br from-blue-900 to-blue-700 text-white">
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1727806823305-451437800778?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YXhpJTIwYWlycG9ydHxlbnwxfHx8fDE3NjcwODUyODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')` }}
      />
      
      <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img
                src={logo}
                alt="Taxi Airport Gdańsk - Airport Transfer & Limousine Service"
                className="w-64 sm:w-80 h-auto"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
                href={whatsappLink}
                onClick={() => trackContactClick('whatsapp')}
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <MessageCircle className="w-5 h-5"/>
              WhatsApp
            </a>
            <a
                href="mailto:booking@taxiairportgdansk.com"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Order via email
            </a>
            <a
                href="#vehicle-selection"
                className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-400 transition-colors animate-pulse-glow"
            >
              Order Online Now
            </a>
          </div>
          <div className="mt-8 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-5 max-w-2xl mx-auto">
            <h1 className="text-xl sm:text-2xl text-blue-100 mb-3">
              Professional Airport Transfer Service in Gdańsk, Sopot & Gdynia
            </h1>
            <p className="text-blue-200">
              Reliable, comfortable, and on time transfers across Tri-City area
            </p>
          </div>

          {/* Additional Services - SEO optimized */}
          <div className="mt-12 mb-10 max-w-4xl mx-auto">
            <div className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm px-6 py-6 shadow-xl">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <h2 className="text-blue-100 text-lg sm:text-xl">Why choose Taxi Airport Gdańsk</h2>
                <span className="text-xs uppercase tracking-[0.2em] text-blue-200/80">Benefits</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <Plane className="w-8 h-8 text-orange-400 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">Flight tracking</h3>
                  <p className="text-blue-200 text-sm">
                    We monitor arrivals and adjust pickup time automatically.
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <BadgeCheck className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">Meet &amp; greet</h3>
                  <p className="text-blue-200 text-sm">
                    Professional drivers, clear communication, and help with luggage.
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <Clock className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                  <h3 className="text-white mb-1">Fast confirmation</h3>
                  <p className="text-blue-200 text-sm">
                    Most bookings are confirmed within 5–10 minutes.
                  </p>
                </div>
                <div
                    className="bg-white/10 rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all aspect-square flex flex-col items-center justify-center text-center">
                  <span className="text-2xl block text-center mb-2">💳</span>
                  <h3 className="text-white mb-1">Flexible payments</h3>
                  <p className="text-blue-200 text-sm">
                    Card, Apple Pay, Google Pay, Revolut, or cash.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Section */}
        <div id="fleet" className="mt-12">
          <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-gradient-to-br from-blue-800/40 to-blue-700/20 backdrop-blur-sm px-6 py-8 shadow-xl">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <h3 className="text-blue-100 text-lg sm:text-xl">Our Fleet</h3>
              <span className="text-xs uppercase tracking-[0.2em] text-blue-200/80">Vehicles</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Standard Cars Card */}
            <div
                className="bg-gradient-to-br from-gray-100/20 to-gray-200/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-white/30 hover:border-white/50 transition-all flex flex-col items-center justify-center p-8">
              <Car className="w-16 h-16 text-blue-100 mb-3"/>
              <p className="text-white text-center mb-2">Standard Cars</p>
              <p className="text-blue-200 text-sm text-center">
                1-4 passengers | Comfortable sedans and SUVs
              </p>
            </div>

            {/* Buses Card */}
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-lg overflow-hidden border-2 border-blue-300/30 hover:border-blue-300/50 transition-all flex flex-col items-center justify-center p-8">
              <Bus className="w-16 h-16 text-blue-200 mb-3" />
              <p className="text-white text-center mb-2">& More Buses</p>
              <p className="text-blue-200 text-sm text-center">
                5-8 passengers | Perfect for larger groups
              </p>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
