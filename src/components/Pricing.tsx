import { Moon, Sun, MapPin, Calculator, ChevronLeft } from 'lucide-react';
import { useEffect } from 'react';
import { preloadEurRate, useEurRate } from '../lib/useEurRate';
import { formatEur } from '../lib/currency';
import { FIXED_PRICES } from '../lib/fixedPricing';
import { useI18n } from '../lib/i18n';
import { trackPricingAction, trackPricingRouteSelect, trackVehicleSelect } from '../lib/tracking';

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
      key: 'airport_gdansk',
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: FIXED_PRICES.standard.gdansk.day,
      priceNight: FIXED_PRICES.standard.gdansk.night,
      type: 'standard' as const,
    },
    {
      key: 'airport_sopot',
      from: t.pricing.routes.airport,
      to: 'Sopot',
      priceDay: FIXED_PRICES.standard.sopot.day,
      priceNight: FIXED_PRICES.standard.sopot.night,
      type: 'standard' as const,
    },
    {
      key: 'airport_gdynia',
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: FIXED_PRICES.standard.gdynia.day,
      priceNight: FIXED_PRICES.standard.gdynia.night,
      type: 'standard' as const,
    },
  ];
  const busRoutes = [
    {
      key: 'airport_gdansk',
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdansk,
      priceDay: FIXED_PRICES.bus.gdansk.day,
      priceNight: FIXED_PRICES.bus.gdansk.night,
      type: 'bus' as const,
    },
    {
      key: 'airport_sopot',
      from: t.pricing.routes.airport,
      to: 'Sopot',
      priceDay: FIXED_PRICES.bus.sopot.day,
      priceNight: FIXED_PRICES.bus.sopot.night,
      type: 'bus' as const,
    },
    {
      key: 'airport_gdynia',
      from: t.pricing.routes.airport,
      to: t.pricing.routes.gdynia,
      priceDay: FIXED_PRICES.bus.gdynia.day,
      priceNight: FIXED_PRICES.bus.gdynia.night,
      type: 'bus' as const,
    },
  ];
  const displayRoutes = vehicleType === 'bus' ? busRoutes : routes;
  const title = vehicleType === 'bus' ? t.pricing.titleBus : t.pricing.titleStandard;
  const eurRate = useEurRate();
  const eurText = (pln: number) => formatEur(pln, eurRate);
  const renderPriceWithEur = (pln: number | null | undefined, plnLineClassName?: string) => {
    if (typeof pln !== 'number' || !Number.isFinite(pln)) {
      return (
        <div className="leading-tight">
          <div className={plnLineClassName}>—</div>
          <div className="min-h-[16px] text-xs text-gray-500" />
        </div>
      );
    }
    const eur = eurText(pln);
	    return (
	      <div className="leading-tight">
	        <div className={plnLineClassName}>
	          <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
	            <span className="tabular-nums">{pln}</span>
	            <span className="pricing-rate-currency font-semibold text-slate-500 tracking-wider">PLN</span>
	          </span>
	        </div>
	        <div className="min-h-[16px] text-xs text-gray-500">{eur ? <span className="eur-text">{eur}</span> : ''}</div>
	      </div>
	    );
	  };
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
              <th className="border border-slate-200 px-4 py-3 text-right">
                <div className="leading-tight text-right">
                  <div>{t.pricing.tableStandardNight}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.pricing.sundayNote}</div>
                </div>
              </th>
              <th className="border border-slate-200 px-4 py-3 text-right">{t.pricing.tableBusDay}</th>
              <th className="border border-slate-200 px-4 py-3 text-right">
                <div className="leading-tight text-right">
                  <div>{t.pricing.tableBusNight}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.pricing.sundayNote}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route, index) => (
              <tr key={`${route.to}-${index}`} className="odd:bg-white even:bg-slate-50">
                <td className="border border-slate-200 px-4 py-3">
                  {route.from} ↔ {route.to}
                </td>
                <td className="border border-slate-200 px-4 py-3 text-right">{renderPriceWithEur(route.priceDay)}</td>
                <td className="border border-slate-200 px-4 py-3 text-right">{renderPriceWithEur(route.priceNight)}</td>
                <td className="border border-slate-200 px-4 py-3 text-right">{renderPriceWithEur(busRoutes[index]?.priceDay)}</td>
                <td className="border border-slate-200 px-4 py-3 text-right">{renderPriceWithEur(busRoutes[index]?.priceNight)}</td>
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
                {renderPriceWithEur(route.priceDay, 'mt-1 text-sm font-semibold text-gray-900')}
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.pricing.tableStandardNight}</div>
	                <div className="pricing-sunday-note mt-0.5 text-slate-400">{t.pricing.sundayNote}</div>
	                {renderPriceWithEur(route.priceNight, 'mt-1 text-sm font-semibold text-gray-900')}
	              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.pricing.tableBusDay}</div>
                {renderPriceWithEur(busRoutes[index]?.priceDay, 'mt-1 text-sm font-semibold text-gray-900')}
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="text-[10px] uppercase tracking-wide text-slate-500">{t.pricing.tableBusNight}</div>
	                <div className="pricing-sunday-note mt-0.5 text-slate-400">{t.pricing.sundayNote}</div>
	                {renderPriceWithEur(busRoutes[index]?.priceNight, 'mt-1 text-sm font-semibold text-gray-900')}
	              </div>
            </div>
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
            <div className="pricing-rate-box flex items-center justify-between gap-3 bg-white/90 p-4 rounded-lg border border-blue-200 shadow-sm">
              <div className="flex items-center gap-2 min-w-0">
                <Sun className="pricing-rate-icon w-5 h-5 text-yellow-500" />
                <span className="pricing-rate-label text-gray-800 font-medium text-sm">{t.pricing.dayRate}</span>
              </div>
	              <div className="text-right flex-shrink-0">
	                <div className="inline-flex items-baseline justify-end gap-1 whitespace-nowrap">
	                  <span className="pricing-rate-value text-blue-900 font-semibold text-base tabular-nums leading-none">{route.priceDay}</span>
	                  <span className="pricing-rate-currency font-semibold text-blue-900/70 tracking-wider leading-none">PLN</span>
	                </div>
	                {eurText(route.priceDay) && (
	                  <div className="eur-row flex items-center justify-end text-gray-500 text-xs whitespace-nowrap">
	                    <span className="eur-text">{eurText(route.priceDay)}</span>
	                  </div>
                )}
              </div>
            </div>
            
			            <div className="pricing-rate-box bg-gray-900 p-4 rounded-lg border border-blue-800 shadow-sm text-white">
			              <div className="flex items-start justify-between gap-3">
			                <div className="flex items-start gap-2 min-w-0">
			                  <Moon className="pricing-rate-icon w-5 h-5 text-blue-300 mt-0.5" />
                      <div className="pricing-rate-label font-medium text-sm leading-tight">{t.pricing.nightRate}</div>
			                </div>
				                <div className="text-right flex-shrink-0">
	                  <div className="inline-flex items-baseline justify-end gap-1 whitespace-nowrap">
	                    <span className="pricing-rate-value font-semibold text-base tabular-nums leading-none">{route.priceNight}</span>
	                    <span className="pricing-rate-currency font-semibold text-white/70 tracking-wider leading-none">PLN</span>
	                  </div>
	                  {eurText(route.priceNight) && (
	                    <div className="eur-row flex items-center justify-end text-blue-200 text-xs whitespace-nowrap">
	                      <span className="eur-text">{eurText(route.priceNight)}</span>
	                    </div>
                  )}
                </div>
              </div>
	                  <div className="pricing-sunday-note mt-1 text-center text-blue-200/70 whitespace-nowrap">
	                    {t.pricing.sundayNote}
	                  </div>
			            </div>
			          </div>

          <button
            onClick={() => {
              trackPricingRouteSelect(route.key, vehicleType);
              onOrderRoute(route);
            }}
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
            <div className="pricing-custom-note text-gray-600 text-xs mt-2">
              {t.pricing.customRouteAutoNote}
            </div>
          </div>

          <button
            onClick={() => {
              trackPricingAction('request_quote', vehicleType);
              onRequestQuote();
            }}
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
            onClick={() => {
              trackPricingAction('back', vehicleType);
              onBack();
            }}
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
            <div id="pricing-booking" className="mt-12 text-center">
              <h3 className="text-2xl text-gray-900">{t.pricing.bookingTitle}</h3>
              <p className="text-gray-600 mt-2">{t.pricing.bookingSubtitle}</p>
              {onVehicleTypeChange && (
                <div className="mt-8 inline-flex flex-wrap items-center gap-4 bg-white border border-gray-200 rounded-full px-4 py-3 shadow-sm">
                  <button
                    type="button"
                    onClick={() => {
                      trackVehicleSelect('standard');
                      onVehicleTypeChange('standard');
                    }}
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
                    onClick={() => {
                      trackVehicleSelect('bus');
                      onVehicleTypeChange('bus');
                    }}
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
            <div className="mt-14" style={{ marginTop: '3.5rem' }}>
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
