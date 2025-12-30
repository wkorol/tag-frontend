import { Car, Users } from 'lucide-react';

interface VehicleTypeSelectorProps {
  onSelectType: (type: 'standard' | 'bus') => void;
}

export function VehicleTypeSelector({ onSelectType }: VehicleTypeSelectorProps) {
  return (
    <section id="vehicle-selection" className="py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">Choose Your Vehicle</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Select the vehicle type that best fits your group size
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
            
            <h3 className="text-gray-900 text-center mb-3">Standard Car</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-blue-600" />
                <span>1-4 passengers</span>
              </div>
              <p className="text-center text-gray-600 text-sm">
                Perfect for individuals, couples, and small families
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Example prices:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Airport → Gdańsk</span>
                  <span className="text-blue-900">from 120 PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Airport → Sopot</span>
                  <span className="text-blue-900">from 120 PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Airport → Gdynia</span>
                  <span className="text-blue-900">from 200 PLN</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white py-3 px-6 rounded-lg text-center group-hover:bg-blue-700 transition-colors">
              Select Standard Car
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
            
            <h3 className="text-gray-900 text-center mb-3">BUS Service</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-blue-600" />
                <span>5-8 passengers</span>
              </div>
              <p className="text-center text-gray-600 text-sm">
                Ideal for larger groups and families with extra luggage
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-2">Example prices:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Airport → Gdańsk</span>
                  <span className="text-blue-900">from 140 PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Airport → Sopot</span>
                  <span className="text-blue-900">from 140 PLN</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Airport → Gdynia</span>
                  <span className="text-blue-900">from 250 PLN</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 text-white py-3 px-6 rounded-lg text-center group-hover:bg-blue-700 transition-colors">
              Select BUS Service
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}