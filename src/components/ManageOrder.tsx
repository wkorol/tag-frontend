import { useEffect, useRef, useState } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, AlertCircle, Trash2, Edit, Copy } from 'lucide-react';
import { buildAdditionalNotes, parseAdditionalNotes, RouteType } from '../lib/orderNotes';
import { getApiBaseUrl } from '../lib/api';

const API_BASE_URL = getApiBaseUrl();

interface ManageOrderProps {
  orderId: string;
}

type ApiOrder = {
  id: string;
  generatedId?: string;
  carType: number;
  pickupAddress: string;
  proposedPrice: string;
  date: string;
  pickupTime: string;
  flightNumber: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  additionalNotes: string;
  status?: string;
  rejectionReason?: string;
};

type OrderState = {
  id: string;
  route: {
    from: string;
    to: string;
    type: RouteType;
  };
  pickupType: 'airport' | 'address';
  signText: string;
  flightNumber: string;
  passengers: string;
  largeLuggage: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  price: number;
  status: 'confirmed' | 'pending' | 'rejected' | 'price_proposed';
  generatedId: string;
  pickupAddress: string;
  description: string;
  rejectionReason: string;
};

export function ManageOrder({ orderId }: ManageOrderProps) {
  const cancelledParam = new URLSearchParams(window.location.search).get('cancelled') === '1';
  const [order, setOrder] = useState<OrderState | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inputEmail, setInputEmail] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [accessRequestId, setAccessRequestId] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const [formData, setFormData] = useState({
    signText: '',
    flightNumber: '',
    passengers: '1',
    largeLuggage: 'no',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    description: '',
  });

  useEffect(() => {
    const loadOrder = async () => {
      setIsAuthorizing(true);
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/access`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailAddress: authEmail }),
        });
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          setError(data?.error ?? 'Unable to load the order.');
          return;
        }

        const orderData = data as ApiOrder;
        const metadata = parseAdditionalNotes(orderData.additionalNotes);
        const routeType: RouteType = orderData.carType === 1 ? 'bus' : 'standard';
        const route = metadata.route ?? {
          from: orderData.pickupAddress,
          to: 'Destination',
          type: routeType,
        };
        const pickupType = metadata.pickupType === 'airport' ? 'airport' : 'address';
        const signText = metadata.signText ?? '';
        const passengers = metadata.passengers ?? '1';
        const largeLuggage = metadata.largeLuggage ?? 'no';
        const description = typeof metadata.notes === 'string' ? metadata.notes : '';
        const price = Number(orderData.proposedPrice) || 0;

        const nextOrder: OrderState = {
          id: orderData.id,
          generatedId: orderData.generatedId ?? orderData.id.slice(0, 4).toUpperCase(),
          route,
          pickupType,
          signText,
          flightNumber: orderData.flightNumber,
          passengers,
          largeLuggage,
          date: orderData.date,
          time: orderData.pickupTime,
          name: orderData.fullName,
          email: orderData.emailAddress,
          phone: orderData.phoneNumber,
          price,
          status: orderData.status === 'confirmed'
            ? 'confirmed'
            : orderData.status === 'rejected'
              ? 'rejected'
              : orderData.status === 'price_proposed'
                ? 'price_proposed'
                : 'pending',
          pickupAddress: orderData.pickupAddress,
          description,
          rejectionReason: orderData.rejectionReason ?? '',
        };

        setOrder(nextOrder);
        setFormData({
          signText,
          flightNumber: orderData.flightNumber,
          passengers,
          largeLuggage,
          date: orderData.date,
          time: orderData.pickupTime,
          name: orderData.fullName,
          email: orderData.emailAddress,
          phone: orderData.phoneNumber,
          address: pickupType === 'address' ? orderData.pickupAddress : '',
          description,
        });
      } catch (loadError) {
        setError('Network error while loading the order.');
      } finally {
        setLoading(false);
        setIsAuthorizing(false);
      }
    };

    if (authEmail) {
      loadOrder();
    } else {
      setLoading(false);
    }
  }, [orderId, authEmail, accessRequestId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!order) {
      return;
    }

    setError(null);

    const additionalNotes = buildAdditionalNotes({
      pickupType: order.pickupType,
      signText: formData.signText,
      passengers: formData.passengers,
      largeLuggage: formData.largeLuggage,
      route: order.route,
      notes: formData.description.trim(),
    });

    const payload = {
      carType: order.route.type === 'bus' ? 1 : 2,
      pickupAddress: order.pickupType === 'address' ? formData.address : order.route.from,
      proposedPrice: String(order.price),
      date: formData.date,
      pickupTime: formData.time,
      flightNumber: order.pickupType === 'airport' ? formData.flightNumber : 'N/A',
      fullName: formData.name,
      emailAddress: authEmail,
      phoneNumber: formData.phone,
      additionalNotes,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? 'Unable to save changes.');
        return;
      }

      setOrder({
        ...order,
        signText: formData.signText,
        flightNumber: payload.flightNumber,
        passengers: formData.passengers,
        largeLuggage: formData.largeLuggage,
        date: formData.date,
        time: formData.time,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickupAddress: payload.pickupAddress,
        description: formData.description.trim(),
      });
      setIsEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (saveError) {
      setError('Network error while saving changes.');
    }
  };

  const handleCancel = async () => {
    if (!order) {
      return;
    }

    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/orders/${order.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailAddress: authEmail }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? 'Unable to cancel the order.');
        return;
      }

      setCancelled(true);
      setShowCancelConfirm(false);
    } catch (cancelError) {
      setError('Network error while cancelling the order.');
    }
  };

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setToast('Copied to clipboard');
    } catch {
      setToast('Unable to copy to clipboard');
    }

    if (toastTimeoutRef.current !== null) {
      window.clearTimeout(toastTimeoutRef.current);
    }

    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <p className="text-gray-700">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8">
          <h2 className="text-xl text-gray-900 mb-4">Access your booking</h2>
          <p className="text-sm text-gray-600 mb-6">
            Enter the email address used for this order to manage your booking.
          </p>
          <div className="space-y-4">
            <input
              type="email"
              value={inputEmail}
              onChange={(event) => setInputEmail(event.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3 text-red-800 text-sm">
                {error}
              </div>
            )}
            <button
              onClick={() => {
                if (!inputEmail) {
                  setError('Please enter your email address.');
                  return;
                }
                setError(null);
                setAuthEmail(inputEmail.trim());
                setAccessRequestId((value) => value + 1);
              }}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70"
              disabled={isAuthorizing}
            >
              {isAuthorizing ? 'Checking...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cancelled || cancelledParam) {
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
            <p className="text-sm text-gray-600">Order ID: {order?.id ?? orderId}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden relative">
          {toast && (
            <div className="absolute right-6 top-6 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
              {toast}
            </div>
          )}
          {/* Header */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl mb-2">Manage Your Transfer</h1>
            <div className="space-y-2 text-blue-100 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span>Order #{order.generatedId}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(order.generatedId, 'Order #')}
                  className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-xs"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span>Order ID: {order.id}</span>
                <button
                  type="button"
                  onClick={() => handleCopy(order.id, 'Order ID')}
                  className="inline-flex items-center gap-1 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-xs"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 m-6">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

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
                    order.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : order.status === 'price_proposed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status === 'confirmed'
                      ? 'Confirmed'
                      : order.status === 'rejected'
                        ? 'Rejected'
                        : order.status === 'price_proposed'
                          ? 'Price Proposed'
                          : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Booking Details</h3>
                {!isEditing && order.status === 'pending' && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </button>
                )}
              </div>
              {order.status !== 'pending' && (
                <div className={`border-l-4 p-4 ${
                  order.status === 'confirmed'
                    ? 'bg-green-50 border-green-500'
                    : order.status === 'price_proposed'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-red-50 border-red-500'
                }`}>
                  <p className={`text-sm ${
                    order.status === 'confirmed'
                      ? 'text-green-700'
                      : order.status === 'price_proposed'
                        ? 'text-blue-700'
                        : 'text-red-700'
                  }`}>
                    {order.status === 'confirmed'
                      ? 'This order has been confirmed. Editing is disabled, but you can still cancel the booking.'
                      : order.status === 'price_proposed'
                        ? 'A new price has been proposed to you. Please check your email to accept or reject the new price.'
                        : 'This order has been rejected. Editing is disabled, but you can still cancel the booking.'}
                  </p>
                  {order.status === 'rejected' && order.rejectionReason && (
                    <p className="mt-2 text-sm text-red-700">
                      Reason: {order.rejectionReason}
                    </p>
                  )}
                </div>
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

              {/* Address Pickup */}
              {order.pickupType === 'address' && (
                <div>
                  <label htmlFor="address" className="block text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    Pickup Address
                  </label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    rows={3}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                  />
                </div>
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
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
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
                    disabled
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg ${
                      isEditing ? 'focus:ring-2 focus:ring-blue-500 focus:border-transparent' : 'bg-gray-50'
                    }`}
                  />
                </div>

                  <div>
                    <label htmlFor="description" className="block text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      Additional Notes
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows={3}
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
                    disabled={order.status !== 'pending'}
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
                        phone: order.phone,
                        address: order.pickupType === 'address' ? order.pickupAddress : '',
                        description: order.description,
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
