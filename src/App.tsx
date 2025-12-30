import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleTypeSelector } from './components/VehicleTypeSelector';
import { Pricing } from './components/Pricing';
import { OrderForm } from './components/OrderForm';
import { QuoteForm } from './components/QuoteForm';
import { ManageOrder } from './components/ManageOrder';
import { Footer } from './components/Footer';

export default function App() {
  const [step, setStep] = useState<'vehicle' | 'pricing'>('vehicle');
  const [vehicleType, setVehicleType] = useState<'standard' | 'bus'>('standard');
  const [selectedRoute, setSelectedRoute] = useState<{ from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' } | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  
  // Check if URL has orderId parameter for managing existing orders
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  // If orderId is present, show manage order page
  if (orderId) {
    return <ManageOrder orderId={orderId} />;
  }

  const handleVehicleSelect = (type: 'standard' | 'bus') => {
    setVehicleType(type);
    setStep('pricing');
  };

  const handleBackToVehicleSelection = () => {
    setStep('vehicle');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />
      
      {step === 'vehicle' ? (
        <VehicleTypeSelector onSelectType={handleVehicleSelect} />
      ) : (
        <Pricing 
          vehicleType={vehicleType}
          onOrderRoute={(route) => setSelectedRoute(route)}
          onRequestQuote={() => setShowQuoteForm(true)}
          onBack={handleBackToVehicleSelection}
        />
      )}
      
      <Footer />

      {selectedRoute && (
        <OrderForm 
          route={selectedRoute}
          onClose={() => setSelectedRoute(null)}
        />
      )}

      {showQuoteForm && (
        <QuoteForm 
          onClose={() => setShowQuoteForm(false)}
        />
      )}
    </div>
  );
}