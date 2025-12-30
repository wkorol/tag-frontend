import { Moon, Sun, MapPin, Calculator, ChevronLeft } from 'lucide-react';

interface PricingProps {
  vehicleType: 'standard' | 'bus';
  onOrderRoute: (route: { from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' }) => void;
  onRequestQuote: () => void;
  onBack: () => void;
}

const routes = [
  {
    from: 'Airport',
    to: 'Gdańsk City Center',
    priceDay: 120,
    priceNight: 150,
    type: 'standard' as const,
  },
  {
    from: 'Airport',
    to: 'Sopot',
    priceDay: 120,
    priceNight: 150,
    type: 'standard' as const,
  },
  {
    from: 'Airport',
    to: 'Gdynia City Center',
    priceDay: 200,
    priceNight: 250,
    type: 'standard' as const,
  },
];

const busRoutes = [
  {
    from: 'Airport',
    to: 'Gdańsk City Center',
    priceDay: 140,
    priceNight: 170,
    type: 'bus' as const,
  },
  {
    from: 'Airport',
    to: 'Sopot',
    priceDay: 140,
    priceNight: 170,
    type: 'bus' as const,
  },
  {
    from: 'Airport',
    to: 'Gdynia City Center',
    priceDay: 250,
    priceNight: 300,
    type: 'bus' as const,
  },
];

export function Pricing({ vehicleType, onOrderRoute, onRequestQuote, onBack }: PricingProps) {
  const displayRoutes = vehicleType === 'bus' ? busRoutes : routes;
  const title = vehicleType === 'bus' ? 'BUS Service (5-8 passengers)' : 'Standard Car (1-4 passengers)';
  
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to vehicle selection
        </button>

        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Fixed prices for airport transfers. No hidden fees. Night rate applies from 10 PM to 6 AM.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayRoutes.map((route, index) => (
            <div 
              key={index}
              className={`rounded-xl p-6 border-2 hover:shadow-lg transition-all ${
                vehicleType === 'bus' 
                  ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-300 hover:border-blue-500'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 mb-1">{route.from}</div>
                  <div className="text-gray-500 text-sm">to</div>
                  <div className="text-gray-900">{route.to}</div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between bg-white p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-700">Day rate</span>
                  </div>
                  <span className="text-blue-900">{route.priceDay} PLN</span>
                </div>
                
                <div className="flex items-center justify-between bg-gray-900 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-300" />
                    <span className="text-gray-200">Night rate</span>
                  </div>
                  <span className="text-white">{route.priceNight} PLN</span>
                </div>
              </div>

              <button
                onClick={() => onOrderRoute(route)}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Order Now
              </button>
            </div>
          ))}
          
          {/* Custom Route Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <Calculator className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <div className="text-gray-900">Custom Route</div>
                <div className="text-gray-600 text-sm mt-1">Need a different destination?</div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-700 text-sm mb-2">Price per kilometer</div>
                <div className="text-xs text-gray-600">
                  Flexible pricing based on your specific route
                </div>
              </div>

              <button
                onClick={onRequestQuote}
                className="block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Request Quote
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>Prices include VAT. Additional destinations available on request.</p>
        </div>
      </div>
    </section>
  );
}