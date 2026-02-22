import { Calculator, Car, Info, Users } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRouteSlug } from '../lib/routes';
import { TrustBar } from './TrustBar';

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
        </div>

	        <div className="vehicle-grid-mobile grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
	          {/* Standard Car */}
	          <button
	            onClick={() => onSelectType('standard')}
	            className="vehicle-card-mobile group self-stretch min-h-[22rem] md:min-h-[26rem] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-3 border-gray-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col"
	          >
	            <div className="flex justify-center mb-6">
	              <div className="vehicle-card__icon w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
	                <Car className="vehicle-card__icon-svg w-12 h-12 text-blue-600" />
	              </div>
	            </div>
	            
	            <h3 className="vehicle-card__title text-gray-900 text-center mb-3 text-base">{t.vehicle.standardTitle}</h3>
	            
	            <div className="vehicle-card__info flex flex-1 flex-col gap-3">
	              <div className="vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base">
	                <Users className="vehicle-card__meta-icon w-5 h-5 text-blue-600" />
	                <span className="vehicle-card__text">{t.vehicle.standardPassengers}</span>
	              </div>
	              <p className="vehicle-card__desc text-center text-gray-600 text-sm">
	                {t.vehicle.standardDescription}
	              </p>
	            </div>

		            <div className="mt-auto pt-6 grid gap-2">
		              <div className="vehicle-selfmanage-badge rounded-xl bg-blue-50/90 px-3 text-slate-700 shadow-sm ring-1 ring-inset ring-blue-200/80">
		                <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 ring-1 ring-inset ring-blue-200/70">
		                  <Info className="h-3 w-3 text-blue-700" />
		                </span>
		                <span className="ml-2 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap">
		                  {t.vehicle.selfManageBadge}
		                </span>
		              </div>
		              <div
		                className="vehicle-select-cta gemini-cta w-full px-6 rounded-lg text-center font-semibold text-blue-800 transition-colors whitespace-nowrap overflow-hidden"
		                style={{ ['--cta-bg' as string]: '#ffffff' }}
		              >
		                <span className="max-w-full truncate">{t.vehicle.selectStandard}</span>
		              </div>
		            </div>
	          </button>

	          {/* Bus */}
	          <button
	            onClick={() => onSelectType('bus')}
	            className="vehicle-card-mobile group self-stretch min-h-[22rem] md:min-h-[26rem] bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border-3 border-blue-300 hover:border-blue-500 hover:shadow-xl transition-all text-left flex h-full flex-col"
	          >
            <div className="flex justify-center mb-6">
              <div className="vehicle-card__icon w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center group-hover:bg-blue-300 transition-colors">
                <Users className="vehicle-card__icon-svg w-12 h-12 text-blue-700" />
              </div>
            </div>
            
            <h3 className="vehicle-card__title text-gray-900 text-center mb-3 text-base">{t.vehicle.busTitle}</h3>
            
	            <div className="vehicle-card__info flex flex-1 flex-col gap-3">
	              <div className="vehicle-card__meta flex items-center justify-center gap-2 text-gray-700 text-base">
	                <Users className="vehicle-card__meta-icon w-5 h-5 text-blue-600" />
	                <span className="vehicle-card__text">{t.vehicle.busPassengers}</span>
	              </div>
	              <p className="vehicle-card__desc text-center text-gray-600 text-sm">
	                {t.vehicle.busDescription}
	              </p>
	            </div>

		            <div className="mt-auto pt-6 grid gap-2">
		              <div className="vehicle-selfmanage-badge rounded-xl bg-blue-50/90 px-3 text-slate-700 shadow-sm ring-1 ring-inset ring-blue-200/80">
		                <span className="inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-blue-600/10 ring-1 ring-inset ring-blue-200/70">
		                  <Info className="h-3 w-3 text-blue-700" />
		                </span>
		                <span className="ml-2 min-w-0 text-center overflow-hidden text-ellipsis whitespace-nowrap">
		                  {t.vehicle.selfManageBadge}
		                </span>
		              </div>
		              <div
		                className="vehicle-select-cta gemini-cta w-full px-6 rounded-lg text-center font-semibold text-blue-800 transition-colors whitespace-nowrap overflow-hidden"
		                style={{ ['--cta-bg' as string]: '#ffffff' }}
		              >
		                <span className="max-w-full truncate">{t.vehicle.selectBus}</span>
		              </div>
		            </div>
	          </button>
	        </div>

        {/* Keep trust badges and calculator directly under vehicle choice cards. */}
        <div className="mt-8">
          <TrustBar className="vehicle-trustbar" />
          <div className="mt-6 flex justify-center">
            <a
              href={pricingPath}
              className="gemini-cta inline-flex w-full items-center justify-center gap-3 rounded-full px-12 py-4 text-base font-semibold text-blue-800 shadow-sm transition-colors hover:bg-blue-50 sm:w-auto"
            >
              <Calculator className="h-4 w-4" />
              {t.pricingCalculator.title}
            </a>
          </div>
        </div>
	      </div>
	    </section>
  );
}
