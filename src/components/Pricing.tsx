import { Moon, Sun, MapPin, Calculator, ChevronLeft } from 'lucide-react';
import { useEurRate } from '../lib/useEurRate';
import { formatEur } from '../lib/currency';
import { useI18n } from '../lib/i18n';

interface PricingProps {
  vehicleType: 'standard' | 'bus';
  onOrderRoute: (route: { from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' }) => void;
  onRequestQuote: () => void;
  onBack: () => void;
}

export function Pricing({ vehicleType, onOrderRoute, onRequestQuote, onBack }: PricingProps) {
  const { t } = useI18n();
  const routes = [
    {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: 90,
      priceNight: 120,
      type: 'standard' as const,
    },
    {
      from: t.pricing.routes.airport,
      to: 'Sopot',
      priceDay: 120,
      priceNight: 150,
      type: 'standard' as const,
    },
    {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: 200,
      priceNight: 250,
      type: 'standard' as const,
    },
  ];
  const busRoutes = [
    {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: 120,
      priceNight: 150,
      type: 'bus' as const,
    },
    {
      from: t.pricing.routes.airport,
      to: 'Sopot',
      priceDay: 140,
      priceNight: 170,
      type: 'bus' as const,
    },
    {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: 250,
      priceNight: 300,
      type: 'bus' as const,
    },
  ];
  const displayRoutes = vehicleType === 'bus' ? busRoutes : routes;
  const title = vehicleType === 'bus' ? t.pricing.titleBus : t.pricing.titleStandard;
  const eurRate = useEurRate();
  const eurText = (pln: number) => formatEur(pln, eurRate);
  
  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {t.pricing.back}
        </button>

        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.pricing.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayRoutes.map((route, index) => (
            <div 
              key={index}
              className={`rounded-2xl p-6 border-2 hover:shadow-xl transition-all ${
                vehicleType === 'bus' 
                  ? 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-blue-300 hover:border-blue-500'
                  : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 border-gray-200 hover:border-blue-500'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-gray-900 font-semibold">{route.from}</div>
                  <div className="text-gray-500 text-sm">↕</div>
                  <div className="text-gray-900 font-semibold">{route.to}</div>
                </div>
              </div>

              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between bg-white/90 p-3 rounded-lg border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Sun className="w-5 h-5 text-yellow-500" />
                    <span className="text-gray-800 font-medium">{t.pricing.dayRate}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-900 font-semibold">{route.priceDay} PLN</span>
                    {eurText(route.priceDay) && (
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText(route.priceDay)}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-900 p-3 rounded-lg border border-blue-800 shadow-sm text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Moon className="w-5 h-5 text-blue-300" />
                      <span className="font-medium">{t.pricing.nightRate}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold">{route.priceNight} PLN</span>
                      {eurText(route.priceNight) && (
                        <div className="flex items-center justify-end gap-2 text-blue-200">
                          <span className="eur-text">{eurText(route.priceNight)}</span>
                          <span className="live-badge">
                            {t.common.actualBadge}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="mt-2 block text-center text-blue-200 leading-none" style={{ fontSize: '8px' }}>
                    {t.pricing.sundayNote}
                  </span>
                </div>
              </div>

              <button
                onClick={() => onOrderRoute(route)}
                className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.common.orderNow}
              </button>
            </div>
          ))}
          
          {/* Custom Route Card */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-lg">
            <div className="flex items-start gap-3 mb-4">
              <Calculator className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <div className="text-gray-900">{t.pricing.customRouteTitle}</div>
                <div className="text-gray-600 text-sm mt-1">{t.pricing.customRouteBody}</div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <div className="bg-white rounded-lg p-3">
                <div className="text-gray-700 text-sm mb-2">{t.pricing.customRoutePrice}</div>
                <div className="text-[8px] text-gray-600">
                  {t.pricing.customRoutePriceBody}
                </div>
              </div>

              <button
                onClick={onRequestQuote}
                className="block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
              >
                {t.pricing.requestQuote}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>{t.pricing.pricesNote}</p>
        </div>
      </div>
    </section>
  );
}
