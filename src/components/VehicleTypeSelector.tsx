import { Calculator, Car, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';

interface VehicleTypeSelectorProps {
  onSelectType: (type: 'standard' | 'bus') => void;
}

export function VehicleTypeSelector({ onSelectType }: VehicleTypeSelectorProps) {
  const { t, locale } = useI18n();
  const sectionRef = useRef<HTMLElement | null>(null);
  const pricingPath = `${localeToPath(locale)}/${getRouteSlug(locale, 'pricing')}#pricing-calculator`;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const element = sectionRef.current;
    if (!element) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="vehicle-selection" ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">{t.vehicle.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.vehicle.subtitle}
          </p>
          <div className="mt-6 flex justify-center">
            <a
              href={pricingPath}
              className="inline-flex w-full items-center justify-center gap-3 rounded-full border border-blue-600 bg-white px-12 py-4 text-base font-semibold text-blue-700 shadow-sm transition-colors hover:bg-blue-50 sm:w-auto"
            >
              <Calculator className="h-4 w-4" />
              {t.pricingCalculator.title}
            </a>
          </div>
        </div>

        <div className="vehicle-grid-mobile grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Standard Car */}
          <button
            onClick={() => onSelectType('standard')}
            className="vehicle-card-mobile group bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-3 border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col"
          >
            <div className="flex justify-center mb-6">
              <div className="vehicle-card__icon w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <Car className="vehicle-card__icon-svg w-12 h-12 text-blue-600" />
              </div>
            </div>
            
            <h3 className="vehicle-card__title text-gray-900 text-center mb-3 text-base">{t.vehicle.standardTitle}</h3>
            
            <div className="vehicle-card__info space-y-3 mb-0 sm:mb-6">
              <div className="vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base">
                <Users className="vehicle-card__meta-icon w-5 h-5 text-blue-600" />
                <span className="vehicle-card__text">{t.vehicle.standardPassengers}</span>
              </div>
              <p className="vehicle-card__desc text-center text-gray-600 text-sm">
                {t.vehicle.standardDescription}
              </p>
            </div>


            <div className="vehicle-card__cta bg-blue-600 text-white py-3 px-6 rounded-lg text-center group-hover:bg-blue-700 transition-colors text-sm mt-auto">
              {t.vehicle.selectStandard}
            </div>
          </button>

          {/* Bus */}
          <button
            onClick={() => onSelectType('bus')}
            className="vehicle-card-mobile group bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-3 border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col"
          >
            <div className="flex justify-center mb-6">
              <div className="vehicle-card__icon w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors">
                <Users className="vehicle-card__icon-svg w-12 h-12 text-blue-700" />
              </div>
            </div>
            
            <h3 className="vehicle-card__title text-gray-900 text-center mb-3 text-base">{t.vehicle.busTitle}</h3>
            
            <div className="vehicle-card__info space-y-3 mb-0 sm:mb-6">
              <div className="vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base">
                <Users className="vehicle-card__meta-icon w-5 h-5 text-blue-600" />
                <span className="vehicle-card__text">{t.vehicle.busPassengers}</span>
              </div>
              <p className="vehicle-card__desc text-center text-gray-600 text-sm">
                {t.vehicle.busDescription}
              </p>
            </div>


            <div className="vehicle-card__cta bg-blue-600 text-white py-3 px-6 rounded-lg text-center group-hover:bg-blue-700 transition-colors text-sm mt-auto">
              {t.vehicle.selectBus}
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
