import { useEffect, useState } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { VehicleTypeSelector } from './components/VehicleTypeSelector';
import { Pricing } from './components/Pricing';
import { OrderForm } from './components/OrderForm';
import { QuoteForm } from './components/QuoteForm';
import { ManageOrder } from './components/ManageOrder';
import { Footer } from './components/Footer';
import { CookieBanner } from './components/CookieBanner';
import { CookiesPage } from './pages/CookiesPage';

function Landing() {
  const [step, setStep] = useState<'vehicle' | 'pricing'>('vehicle');
  const [vehicleType, setVehicleType] = useState<'standard' | 'bus'>('standard');
  const [selectedRoute, setSelectedRoute] = useState<{ from: string; to: string; priceDay: number; priceNight: number; type: 'standard' | 'bus' } | null>(null);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const [floatingReady, setFloatingReady] = useState(false);
  
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');

  // If orderId is present, show manage order page
  if (orderId) {
    return <ManageOrder orderId={orderId} />;
  }

  const handleVehicleSelect = (type: 'standard' | 'bus') => {
    setVehicleType(type);
    setStep('pricing');
    window.requestAnimationFrame(() => {
      document.getElementById('vehicle-selection')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

  const handleBackToVehicleSelection = () => {
    setStep('vehicle');
  };

  useEffect(() => {
    const updateVisibility = () => {
      const target = document.getElementById('vehicle-selection');
      if (!target) {
        setTargetVisible(false);
        return;
      }

      const targetTop = target.getBoundingClientRect().top + window.scrollY;
      const reached = window.scrollY >= targetTop - 120;
      setTargetVisible(reached);
    };

    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateVisibility);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateVisibility);
    };
  }, []);

  const showFloating = !targetVisible && !selectedRoute && !showQuoteForm;

  useEffect(() => {
    if (!showFloating) {
      setFloatingReady(false);
      return;
    }

    const timeout = window.setTimeout(() => setFloatingReady(true), 30);
    return () => window.clearTimeout(timeout);
  }, [showFloating]);

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

      {showFloating && (
        <a
          href="#vehicle-selection"
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-pulse-glow transition-all duration-300 ease-out z-50 ${
            floatingReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Order Online Now
        </a>
      )}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/cookies" element={<CookiesPage />} />
      </Routes>
      <CookieBanner />
    </>
  );
}
