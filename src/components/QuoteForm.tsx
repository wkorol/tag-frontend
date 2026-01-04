import { useState, useEffect } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, DollarSign, Info, Lock } from 'lucide-react';
import { buildAdditionalNotes } from '../lib/orderNotes';
import { hasMarketingConsent } from '../lib/consent';
import { getApiBaseUrl } from '../lib/api';

const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

interface QuoteFormProps {
  onClose: () => void;
}

export function QuoteForm({ onClose }: QuoteFormProps) {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    destinationAddress: '',
    proposedPrice: 'taximeter',
    pickupType: '',
    signText: '',
    flightNumber: '',
    passengers: '1',
    largeLuggage: 'no',
    date: getTodayDateString(),
    time: '',
    name: '',
    phone: '',
    email: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);

  const trackConversion = () => {
    if (typeof window === 'undefined') {
      return;
    }

    const gtag = (window as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') {
      return;
    }
    if (!hasMarketingConsent()) {
      return;
    }

    gtag('event', 'conversion', {
      send_to: 'AW-17848598074/JQ0kCLvpq9sbELr8775C',
      value: 1.0,
      currency: 'PLN',
    });
  };

  // Auto-fill airport address when airport pickup is selected
  useEffect(() => {
    if (formData.pickupType === 'airport' && !formData.pickupAddress) {
      setFormData(prev => ({
        ...prev,
        pickupAddress: 'Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk',
      }));
    }
  }, [formData.pickupType, formData.pickupAddress]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const apiBaseUrl = getApiBaseUrl();
    const passengersNumber = Number(formData.passengers);
    const carType = passengersNumber >= 5 ? 1 : 2;
    const additionalNotes = buildAdditionalNotes({
      pickupType: formData.pickupType as 'airport' | 'address',
      signText: formData.signText,
      passengers: formData.passengers,
      largeLuggage: formData.largeLuggage,
      route: {
        from: formData.pickupAddress,
        to: formData.destinationAddress,
        type: carType === 1 ? 'bus' : 'standard',
      },
      notes: formData.description.trim(),
    });

    const payload = {
      carType,
      pickupAddress: formData.pickupAddress,
      proposedPrice: formData.proposedPrice,
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: formData.pickupType === 'airport' ? formData.flightNumber : 'N/A',
      fullName: formData.name,
      emailAddress: formData.email,
      phoneNumber: formData.phone,
      additionalNotes,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? 'Failed to submit quote request. Please try again.');
        return;
      }

      setOrderId(data?.id ?? null);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackConversion();
    } catch {
      setError('Network error while submitting the quote request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-fill airport address when Airport Pickup is selected
    if (name === 'pickupType' && value === 'airport') {
      setFormData({
        ...formData,
        [name]: value,
        pickupAddress: 'Gdańsk Airport, ul. Słowackiego 200, 80-298 Gdańsk',
      });
    } else if (name === 'pickupType' && value === 'address') {
      // Clear pickup address when switching to Address Pickup
      setFormData({
        ...formData,
        [name]: value,
        pickupAddress: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-green-900 mb-2">Quote Request Received!</h3>
            <p className="text-green-800 mb-4">
              Thank you for your request. You will receive an email within 5-10 minutes confirming whether your offer has been accepted or declined.
            </p>
            {orderId && (
              <div className="bg-white rounded-lg p-4 mb-4">
                {generatedId && (
                  <p className="text-gray-700">Order #: <span className="font-semibold">{generatedId}</span></p>
                )}
                <p className="text-gray-700">Order ID: <span className="font-semibold">{orderId}</span></p>
                <a
                  href={`/?orderId=${orderId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  Manage your order
                </a>
              </div>
            )}
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-2xl w-full my-8 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-gray-900">Request Custom Quote</h3>
            <p className="text-gray-600 text-sm mt-1">Propose your price and get a response within 5-10 minutes</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Pickup Type */}
          <div>
            <label className="block text-gray-700 mb-2">
              Pickup Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.pickupType === 'airport' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="pickupType"
                  value="airport"
                  checked={formData.pickupType === 'airport'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <Plane className="w-5 h-5 text-gray-700" />
                <span>Airport Pickup</span>
              </label>
              
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.pickupType === 'address' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="pickupType"
                  value="address"
                  checked={formData.pickupType === 'address'}
                  onChange={handleChange}
                  className="w-4 h-4 text-blue-600"
                />
                <MapPin className="w-5 h-5 text-gray-700" />
                <span>Address Pickup</span>
              </label>
            </div>
          </div>

          {!formData.pickupType ? (
            <div className="rounded-xl bg-slate-900/85 px-6 py-10 text-center text-white shadow-inner">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <Lock className="h-4 w-4" />
                Select a pickup type to unlock the rest of the form.
              </div>
            </div>
          ) : (
            <>
              {/* Pickup Address */}
              <div>
                <label htmlFor="pickupAddress" className="block text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Pickup Address
                </label>
                <textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder="Enter full pickup address (e.g., Gdańsk Airport, ul. Słowackiego 200)"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  disabled={formData.pickupType === 'airport'}
                  required
                />
                {formData.pickupType === 'airport' && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    Airport pickup location is automatically set
                  </p>
                )}
              </div>

              {/* Destination Address */}
              <div>
                <label htmlFor="destinationAddress" className="block text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Destination Address
                </label>
                <textarea
                  id="destinationAddress"
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleChange}
                  placeholder="Enter destination address (e.g., Gdańsk Centrum, ul. Długa 1)"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Proposed Price */}
              <div>
                <label htmlFor="proposedPrice" className="block text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  Your Proposed Price (PLN)
                </label>
                {!showPriceInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      setShowPriceInput(true);
                      setFormData(prev => ({ ...prev, proposedPrice: '' }));
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-left text-slate-800 shadow-sm hover:border-blue-500 hover:bg-blue-50/40 transition-colors"
                  >
                    <span className="block text-sm font-semibold text-slate-900">
                      Price is calculated by taximeter.
                    </span>
                    <span className="mt-2 block text-xs text-slate-600">
                      Tariff 1 (city, 6–22): 3.90 PLN/km.
                    </span>
                    <span className="block text-xs text-slate-600">
                      Tariff 2 (city, 22–6): 5.85 PLN/km.
                    </span>
                    <span className="block text-xs text-slate-600">
                      Tariff 3 (outside city, 6–22): 7.80 PLN/km.
                    </span>
                    <span className="block text-xs text-slate-600">
                      Tariff 4 (outside city, 22–6): 11.70 PLN/km.
                    </span>
                    <span className="mt-3 block text-xs font-semibold text-blue-700">
                      If you want to propose a fixed price, click here and fill the input.
                    </span>
                  </button>
                ) : (
                  <>
                    <input
                      type="number"
                      id="proposedPrice"
                      name="proposedPrice"
                      value={formData.proposedPrice}
                      onChange={handleChange}
                      placeholder="Enter your offer in PLN (e.g., 150)"
                      min="0"
                      step="10"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Propose your price for this ride. We'll review and respond within 5-10 minutes.
                    </p>
                  </>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-gray-700 mb-2">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Airport Pickup Fields */}
              {formData.pickupType === 'airport' && (
                <>
                  <div>
                    <label htmlFor="signText" className="block text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Name Sign Text
                    </label>
                    <input
                      type="text"
                      id="signText"
                      name="signText"
                      value={formData.signText}
                      onChange={handleChange}
                      placeholder="Text to display on the pickup sign"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900">
                          The driver will be waiting for you with a sign displaying this text until you exit the arrivals hall
                        </p>
                      </div>
                      {/* Visual Sign Preview */}
                      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-2 text-center">Sign Preview:</p>
                        <div className="bg-white border-4 border-blue-900 rounded p-3 text-center min-h-[60px] flex items-center justify-center">
                          <p className="text-blue-900 text-lg break-words">
                            {formData.signText || 'Your name will appear here'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="flightNumber" className="block text-gray-700 mb-2">
                      <Plane className="w-4 h-4 inline mr-2" />
                      Flight Number
                    </label>
                    <input
                      type="text"
                      id="flightNumber"
                      name="flightNumber"
                      value={formData.flightNumber}
                      onChange={handleChange}
                      placeholder="e.g. LO123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                </>
              )}

              {/* Passengers and Luggage */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="passengers" className="block text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-2" />
                    Number of Passengers
                  </label>
                  <select
                    id="passengers"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="1">1 person</option>
                    <option value="2">2 people</option>
                    <option value="3">3 people</option>
                    <option value="4">4 people</option>
                    <option value="5">5+ people</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="largeLuggage" className="block text-gray-700 mb-2">
                    <Luggage className="w-4 h-4 inline mr-2" />
                    Large Luggage
                  </label>
                  <select
                    id="largeLuggage"
                    name="largeLuggage"
                    value={formData.largeLuggage}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h4 className="text-gray-900 mb-4">Contact Information</h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+48 123 456 789"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      You'll receive a response within 5-10 minutes
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Any special requests or additional information..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      E.g., child seat required, waiting time, special instructions
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Quote Request'}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
