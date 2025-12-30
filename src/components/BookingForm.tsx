import { useState } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, ChevronDown, ChevronUp, DollarSign } from 'lucide-react';

export function BookingForm() {
  const [formData, setFormData] = useState({
    pickupAddress: '',
    destinationAddress: '',
    proposedPrice: '',
    pickupType: 'airport',
    signText: '',
    flightNumber: '',
    passengers: '1',
    largeLuggage: 'no',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real application, you would send this data to a backend
    console.log('Booking submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (submitted) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-green-900 mb-2">Quote Request Received!</h3>
            <p className="text-green-800 mb-6">
              Thank you for your request. You will receive an email within 5-10 minutes confirming whether your ride has been accepted or declined.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setIsFormOpen(false);
              }}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Request Another Quote
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="py-16 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8">
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <span>Request Quote</span>
            {isFormOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
          
          {isFormOpen && (
            <p className="text-gray-600 mt-4">
              Provide your ride details and propose your price. You will receive an email within 5-10 minutes confirming whether your offer has been accepted or declined.
            </p>
          )}
        </div>

        {isFormOpen && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 sm:p-8 space-y-6 animate-slideDown">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
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
            </div>

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
                  Time
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
              <h3 className="text-gray-900 mb-4">Contact Information</h3>
              
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
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Request Quote
            </button>
          </form>
        )}
      </div>
    </section>
  );
}