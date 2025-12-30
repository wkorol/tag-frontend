import { Mail, Bus, Car, Target, Sparkles, Plus } from 'lucide-react';
import logo from 'figma:asset/9bf12920b9f211a57ac7e4ff94480c867662dafa.png';

export function Hero() {
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
                href="mailto:booking@taxiairportgdansk.com"
                className="inline-flex items-center gap-2 bg-white text-blue-900 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Mail className="w-5 h-5"/>
              Book via Email
            </a>
            <a
                href="#vehicle-selection"
                className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-lg transition-colors animate-pulse-glow"
            >
              Order Online Now
            </a>
          </div>
          <h1 className="text-xl sm:text-2xl text-blue-100 mb-4 max-w-2xl mx-auto">
            Professional Airport Transfer Service in Gdańsk, Sopot & Gdynia TEST666
          </h1>
          <p className="text-blue-200 mb-6 max-w-2xl mx-auto">
            Reliable, comfortable, and on time transfers across Tri-City area
          </p>

          {/* Additional Services - SEO optimized */}
          <div className="mb-8 max-w-3xl mx-auto">
            <h2 className="text-blue-100 mb-4">Our Premium Services</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
                <Target className="w-8 h-8 text-orange-400 mx-auto mb-2"/>
                <h3 className="text-white mb-1">Shooting Range</h3>
                <p className="text-blue-200 text-sm">
                  Organize shooting experiences in Gdańsk area
                </p>
              </div>
              <div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
                <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                <h3 className="text-white mb-1">Limousine Service</h3>
                <p className="text-blue-200 text-sm">
                  Luxury transportation for special occasions
                </p>
              </div>
              <div
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/15 transition-all">
                <Plus className="w-8 h-8 text-green-400 mx-auto mb-2"/>
                <h3 className="text-white mb-1">+18 Entertainment</h3>
                <p className="text-blue-200 text-sm">
                  Adult entertainment & nightlife organization
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Section */}
        <div id="fleet" className="mt-12">
          <h3 className="text-center text-blue-100 mb-6">Our Fleet</h3>
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
  );
}