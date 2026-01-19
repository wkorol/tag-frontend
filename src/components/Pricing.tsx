import { Moon, Sun, MapPin, Calculator, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { preloadEurRate, useEurRate } from '../lib/useEurRate';
import { formatEur } from '../lib/currency';
import { useI18n } from '../lib/i18n';

interface PricingProps {
  vehicleType: 'standard' | 'bus';
  onOrderRoute: (route: { from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' }) => void;
  onRequestQuote: () => void;
  onBack: () => void;
  showBack?: boolean;
  variant?: 'flow' | 'landing';
  onVehicleTypeChange?: (type: 'standard' | 'bus') => void;
}

export function Pricing({
  vehicleType,
  onOrderRoute,
  onRequestQuote,
  onBack,
  showBack = true,
  variant = 'flow',
  onVehicleTypeChange,
}: PricingProps) {
  const { t } = useI18n();
  const routes = [
    {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: 100,
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
      priceDay: 150,
      priceNight: 180,
      type: 'bus' as const,
    },
    {
      from: t.pricing.routes.airport,
      to: 'Sopot',
      priceDay: 170,
      priceNight: 200,
      type: 'bus' as const,
    },
    {
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: 280,
      priceNight: 330,
      type: 'bus' as const,
    },
  ];
  const displayRoutes = vehicleType === 'bus' ? busRoutes : routes;
  const title = vehicleType === 'bus' ? t.pricing.titleBus : t.pricing.titleStandard;
  const eurRate = useEurRate();
  const eurText = (pln: number) => formatEur(pln, eurRate);
  const tariffRows = [
    t.quoteForm.tariff1,
    t.quoteForm.tariff2,
    t.quoteForm.tariff3,
    t.quoteForm.tariff4,
  ].map((row) => {
    const parts = row.split(':');
    return {
      label: parts[0]?.trim() || row,
      value: parts.slice(1).join(':').trim(),
    };
  });

  useEffect(() => {
    preloadEurRate();
  }, []);

  const pricingTable = (
    <div className={variant === 'landing' ? 'rounded-3xl border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-slate-50 p-8 shadow-lg' : ''}>
      <h3 className={`text-lg font-semibold text-gray-900 ${variant === 'landing' ? 'text-center' : ''}`}>{t.pricing.tableTitle}</h3>
      <div className="mt-6 hidden sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="border border-slate-200 px-4 py-3 text-left">{t.pricing.tableRoute}</th>
              <th className="border border-slate-200 px-4 py-3 text-right">{t.pricing.tableStandardDay}</th>
              <th className="border border-slate-200 px-4 py-3 text-right">{t.pricing.tableStandardNight}</th>
              <th className="border border-slate-200 px-4 py-3 text-right">{t.pricing.tableBusDay}</th>
              <th className="border border-slate-200 px-4 py-3 text-right">{t.pricing.tableBusNight}</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => (
              <tr key={`${route.to}-${index}`} className="odd:bg-white even:bg-slate-50">
                <td className="border border-slate-200 px-4 py-3">
                  {route.from} ↔ {route.to}
                </td>
                <td className="border border-slate-200 px-4 py-3 text-right">{route.priceDay} PLN</td>
                <td className="border border-slate-200 px-4 py-3 text-right">{route.priceNight} PLN</td>
                <td className="border border-slate-200 px-4 py-3 text-right">{busRoutes[index]?.priceDay} PLN</td>
                <td className="border border-slate-200 px-4 py-3 text-right">{busRoutes[index]?.priceNight} PLN</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h4 className={`mt-10 text-base font-semibold text-gray-900 ${variant === 'landing' ? 'text-center' : ''}`}>
        {t.pricing.tariffsTitle}
      </h4>
      <div className="mt-4 hidden sm:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-700">
              <th className="border border-slate-200 px-4 py-3 text-left">{t.pricing.tariffsName}</th>
              <th className="border border-slate-200 px-4 py-3 text-left">{t.pricing.tariffsRate}</th>
            </tr>
          </thead>
          <tbody>
            {tariffRows.map((row) => (
              <tr key={row.label} className="odd:bg-white even:bg-slate-50">
                <td className="border border-slate-200 px-4 py-3">{row.label}</td>
                <td className="border border-slate-200 px-4 py-3">{row.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 space-y-4 sm:hidden">
        {routes.map((route, index) => (
          <div key={`${route.to}-mobile-${index}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-900">
              {route.from} ↔ {route.to}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.pricing.tableStandardDay}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{route.priceDay} PLN</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.pricing.tableStandardNight}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{route.priceNight} PLN</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.pricing.tableBusDay}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{busRoutes[index]?.priceDay} PLN</div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.pricing.tableBusNight}</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{busRoutes[index]?.priceNight} PLN</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-3 sm:hidden">
        {tariffRows.map((row) => (
          <div key={`${row.label}-mobile`} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="text-xs uppercase tracking-wide text-slate-500">{row.label}</div>
            <div className="mt-1 text-sm text-gray-900">{row.value}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const pricingCards = (
    <div className="pricing-grid-mobile grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
      {displayRoutes.map((route, index) => (
        <div 
          key={index}
          className={`pricing-card-mobile rounded-2xl p-6 border-2 hover:shadow-xl transition-all ${
            vehicleType === 'bus' 
              ? 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 border-blue-300 hover:border-blue-500'
              : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 border-gray-200 hover:border-blue-500'
          }`}
        >
          <div className="flex items-start gap-3 mb-4">
            <MapPin className="pricing-icon w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <div className="pricing-route text-gray-900 font-semibold text-base">{route.from}</div>
              <div className="pricing-route text-gray-500 text-sm">↕</div>
              <div className="pricing-route text-gray-900 font-semibold text-base">{route.to}</div>
            </div>
          </div>

          <div className="space-y-3 mt-6">
            <div className="pricing-rate-box flex items-center justify-between bg-white/90 p-4 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2">
                <Sun className="pricing-rate-icon w-5 h-5 text-yellow-500" />
                <span className="pricing-rate-label text-gray-800 font-medium text-sm">{t.pricing.dayRate}</span>
              </div>
              <div className="text-right">
                <span className="pricing-rate-value text-blue-900 font-semibold text-sm">{route.priceDay} PLN</span>
                {eurText(route.priceDay) && (
                  <div className="eur-row flex items-center justify-end gap-2 text-gray-500 text-xs whitespace-nowrap">
                    <span className="eur-text">{eurText(route.priceDay)}</span>
                    <span className="live-badge">
                      {t.common.actualBadge}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pricing-rate-box bg-gray-900 p-4 rounded-lg border border-blue-800 shadow-sm text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="pricing-rate-icon w-5 h-5 text-blue-300" />
                  <span className="pricing-rate-label font-medium text-sm">{t.pricing.nightRate}</span>
                </div>
                <div className="text-right">
                  <span className="pricing-rate-value font-semibold text-sm">{route.priceNight} PLN</span>
                  {eurText(route.priceNight) && (
                    <div className="eur-row flex items-center justify-end gap-2 text-blue-200 text-xs whitespace-nowrap">
                      <span className="eur-text">{eurText(route.priceNight)}</span>
                      <span className="live-badge">
                        {t.common.actualBadge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <span className="pricing-sunday mt-2 block text-center text-blue-200 leading-none text-[10px]">
                {t.pricing.sundayNote}
              </span>
            </div>
          </div>

          <button
            onClick={() => onOrderRoute(route)}
            className="pricing-cta w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            {t.common.orderNow}
          </button>
        </div>
      ))}
      
      <div className="pricing-card-mobile pricing-card--custom bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-lg h-full flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <Calculator className="pricing-icon w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <div className="pricing-custom-title text-gray-900 text-base">{t.pricing.customRouteTitle}</div>
            <div className="pricing-custom-body text-gray-600 text-sm mt-1">{t.pricing.customRouteBody}</div>
          </div>
        </div>

        <div className="space-y-4 mt-6 flex-1 flex flex-col">
          <div className="pricing-rate-box bg-white rounded-lg p-4">
            <div className="pricing-custom-price text-gray-700 text-sm mb-2">{t.pricing.customRoutePrice}</div>
            <div className="pricing-custom-note text-gray-600 text-xs">
              {t.pricing.customRoutePriceBody}
            </div>
          </div>

          <button
            onClick={onRequestQuote}
            className="pricing-cta mt-auto block w-full text-center bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm"
          >
            {t.pricing.requestQuote}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section id="vehicle-selection" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {showBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            {t.pricing.back}
          </button>
        )}

        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-2">
            {title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.pricing.description}
          </p>
        </div>

        {variant === 'landing' ? (
          <>
            <div id="pricing-table" className="mt-12">
              {pricingTable}
            </div>
            <div className="mt-12 text-center">
              <h3 className="text-2xl text-gray-900">{t.pricing.bookingTitle}</h3>
              <p className="text-gray-600 mt-2">{t.pricing.bookingSubtitle}</p>
              {onVehicleTypeChange && (
                <div className="mt-8 inline-flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm">
                  <button
                    type="button"
                    onClick={() => onVehicleTypeChange('standard')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      vehicleType === 'standard'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {t.vehicle.standardTitle}
                  </button>
                  <button
                    type="button"
                    onClick={() => onVehicleTypeChange('bus')}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      vehicleType === 'bus'
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                  >
                    {t.vehicle.busTitle}
                  </button>
                </div>
              )}
            </div>
            <div className="mt-10">
              {pricingCards}
            </div>
          </>
        ) : (
          <>
            {pricingCards}
            <div className="mt-12">
              {pricingTable}
            </div>
          </>
        )}

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>{t.pricing.pricesNote}</p>
        </div>
      </div>
    </section>
  );
}
