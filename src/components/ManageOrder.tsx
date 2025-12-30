import { useState } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, AlertCircle, Trash2, Edit } from 'lucide-react';

interface ManageOrderProps {
  orderId: string;
}

// Mock order data - in real app this would come from backend
const mockOrder = {
  id: 'ORD-12345',
  route: {
    from: 'Airport',
    to: 'Gdańsk City Center',
    priceDay: 120,
    priceNight: 150,
    type: 'standard' as const,
  },
  pickupType: 'airport',
  signText: 'John Smith',
  flightNumber: 'LO456',
  passengers: '2',
  largeLuggage: 'yes',
  date: '2025-01-15',
  time: '14:30',
  name: 'John Smith',
  email: 'john.smith@example.com',
  price: 120,
  status: 'confirmed' as const,
};

export function ManageOrder({ orderId }: ManageOrderProps) {
  const [order, setOrder] = useState(mockOrder);
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    signText: order.signText,
    flightNumber: order.flightNumber,
    passengers: order.passengers,
    largeLuggage: order.largeLuggage,
    date: order.date,
    time: order.time,
    name: order.name,
    email: order.email,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    setOrder({ ...order, ...formData });
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setCancelled(true);
    setShowCancelConfirm(false);
  };

  if (cancelled) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8">
          <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-red-900 mb-2">Order Cancelled</h3>
            <p className="text-red-800 mb-4">
              Your transfer booking has been cancelled. You will receive a confirmation email shortly.
            </p>
            <p className="text-sm text-gray-600">Order ID: {order.id}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl mb-2">Manage Your Transfer</h1>
            <p className="text-blue-100">Order ID: {order.id}</p>
          </div>

          {/* Success Message */}
          {saved && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your changes have been saved successfully!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Details */}
          <div className="p-6 space-y-6">
            {/* Route Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-gray-900 mb-3">Transfer Route</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <span className="text-gray-700">{order.route.from} → {order.route.to}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Price: <span className="font-bold text-blue-600">{order.price} PLN</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Booking Details</h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </button>
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
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
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
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                  />
                </div>
              </div>

              {/* Airport Pickup Details */}
              {order.pickupType === 'airport' && (
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
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                      }`}
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
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                      }`}
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
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                  >
                    {order.route.type === 'bus' ? (
                      <>
                        <option value="5">5 people</option>
                        <option value="6">6 people</option>
                        <option value="7">7 people</option>
                        <option value="8">8 people</option>
                      </>
                    ) : (
                      <>
                        <option value="1">1 person</option>
                        <option value="2">2 people</option>
                        <option value="3">3 people</option>
                        <option value="4">4 people</option>
                      </>
                    )}
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
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-4">
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
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                      }`}
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
                      disabled={!isEditing}
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                        isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t pt-6 space-y-3">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setFormData({
                        signText: order.signText,
                        flightNumber: order.flightNumber,
                        passengers: order.passengers,
                        largeLuggage: order.largeLuggage,
                        date: order.date,
                        time: order.time,
                        name: order.name,
                        email: order.email,
                      });
                      setIsEditing(false);
                    }}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Cancel Booking
                </button>
              )}
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Changes to your booking will be confirmed via email. For urgent changes, please contact us directly at booking@taxiairportgdansk.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-gray-900">Cancel Booking?</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to cancel your transfer booking? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
              >
                Yes, Cancel Booking
              </button>
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
