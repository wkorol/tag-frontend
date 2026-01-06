import { Car, Users } from 'lucide-react';
import { useEurRate } from '../lib/useEurRate';
import { formatEur } from '../lib/currency';
import { useI18n } from '../lib/i18n';

interface VehicleTypeSelectorProps {
  onSelectType: (type: 'standard' | 'bus') => void;
}

export function VehicleTypeSelector({ onSelectType }: VehicleTypeSelectorProps) {
  const { t } = useI18n();
  const eurRate = useEurRate();
  const eurText = (pln: number) => formatEur(pln, eurRate);

  return (
    <section id="vehicle-selection" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">{t.vehicle.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.vehicle.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Standard Car */}
          <button
            onClick={() => onSelectType('standard')}
            className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-3 border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all text-left"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Car className="w-12 h-12 text-blue-600" />
              </div>
            </div>
            
            <h3 className="text-gray-900 text-center mb-3">{t.vehicle.standardTitle}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{t.vehicle.standardPassengers}</span>
              </div>
              <p className="text-center text-gray-600 text-sm">
                {t.vehicle.standardDescription}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">{t.vehicle.examplePrices}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-700">{t.vehicle.airportGdansk}</span>
                  <div className="text-right">
                    <span className="text-blue-900">{t.common.priceFrom} 90 PLN</span>
                    {eurText(90) && (
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText(90)}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-700">{t.vehicle.airportSopot}</span>
                  <div className="text-right">
                    <span className="text-blue-900">{t.common.priceFrom} 120 PLN</span>
                    {eurText(120) && (
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText(120)}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-700">{t.vehicle.airportGdynia}</span>
                  <div className="text-right">
                    <span className="text-blue-900">{t.common.priceFrom} 200 PLN</span>
                    {eurText(200) && (
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText(200)}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white py-3 px-6 rounded-lg text-center group-hover:bg-blue-700 transition-colors">
              {t.vehicle.selectStandard}
            </div>
          </button>

          {/* Bus */}
          <button
            onClick={() => onSelectType('bus')}
            className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-3 border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all text-left"
          >
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors">
                <Users className="w-12 h-12 text-blue-700" />
              </div>
            </div>
            
            <h3 className="text-gray-900 text-center mb-3">{t.vehicle.busTitle}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-blue-600" />
                <span>{t.vehicle.busPassengers}</span>
              </div>
              <p className="text-center text-gray-600 text-sm">
                {t.vehicle.busDescription}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">{t.vehicle.examplePrices}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-700">{t.vehicle.airportGdansk}</span>
                  <div className="text-right">
                    <span className="text-blue-900">{t.common.priceFrom} 120 PLN</span>
                    {eurText(120) && (
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText(120)}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-700">{t.vehicle.airportSopot}</span>
                  <div className="text-right">
                    <span className="text-blue-900">{t.common.priceFrom} 140 PLN</span>
                    {eurText(140) && (
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText(140)}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-gray-700">{t.vehicle.airportGdynia}</span>
                  <div className="text-right">
                    <span className="text-blue-900">{t.common.priceFrom} 250 PLN</span>
                    {eurText(250) && (
                      <div className="flex items-center justify-end gap-2 text-gray-500">
                        <span className="eur-text">{eurText(250)}</span>
                        <span className="live-badge">
                          {t.common.actualBadge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white py-3 px-6 rounded-lg text-center group-hover:bg-blue-700 transition-colors">
              {t.vehicle.selectBus}
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
