import { useState, useEffect, useRef } from 'react';
import { Calendar, Users, Luggage, MapPin, FileText, Plane, DollarSign, Info, Lock } from 'lucide-react';
import { buildAdditionalNotes } from '../lib/orderNotes';
import { hasMarketingConsent } from '../lib/consent';
import { getApiBaseUrl } from '../lib/api';
import { trackFormStart } from '../lib/tracking';
import { localeToPath, useI18n } from '../lib/i18n';

const validatePhoneNumber = (value: string, messages: { phoneLetters: string; phoneLength: string }) => {
  const trimmed = value.trim();
  if (/[A-Za-z]/.test(trimmed)) {
    return messages.phoneLetters;
  }
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return messages.phoneLength;
  }
  return null;
};

const validateEmail = (value: string, message: string) => {
  const trimmed = value.trim();
  const basicEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmail.test(trimmed)) {
    return message;
  }
  return null;
};

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
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const priceInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    pickupAddress: '',
    destinationAddress: '',
    proposedPrice: 'taximeter',
    pickupType: '',
    signService: 'self',
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
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPriceInput, setShowPriceInput] = useState(false);
  const formStartedRef = useRef(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const signFee = formData.pickupType === 'airport' && formData.signService === 'sign' ? 20 : 0;
  const isPhoneValid = !validatePhoneNumber(formData.phone, t.quoteForm.validation);
  const isEmailValid = !validateEmail(formData.email, t.quoteForm.validation.email);
  const isPriceValid = showPriceInput ? formData.proposedPrice.trim() !== '' : true;
  const showValidation = submitAttempted;
  const pickupTypeError = showValidation && !formData.pickupType;
  const pickupAddressError = showValidation && formData.pickupType === 'address' && !formData.pickupAddress.trim();
  const destinationError = showValidation && !formData.destinationAddress.trim();
  const signTextError = showValidation && formData.pickupType === 'airport' && formData.signService === 'sign' && !formData.signText.trim();
  const flightNumberError = showValidation && formData.pickupType === 'airport' && !formData.flightNumber.trim();
  const dateError = showValidation && !formData.date;
  const timeError = showValidation && !formData.time;
  const passengersError = showValidation && !formData.passengers;
  const luggageError = showValidation && !formData.largeLuggage;
  const nameError = showValidation && !formData.name.trim();
  const phoneErrorState = showValidation && (!formData.phone.trim() || !isPhoneValid);
  const emailErrorState = showValidation && (!formData.email.trim() || !isEmailValid);
  const priceError = showValidation && !isPriceValid;
  const signServiceTitle = t.quoteForm.signServiceTitle ?? 'Airport pickup options';
  const signServiceSign = t.quoteForm.signServiceSign ?? 'Meet with a name sign';
  const signServiceFee = t.quoteForm.signServiceFee ?? '+20 PLN added to final price';
  const signServiceSelf = t.quoteForm.signServiceSelf ?? 'Find the driver myself at the parking';
  const fieldClass = (base: string, invalid: boolean) =>
    `${base}${invalid ? ' border-red-400 bg-red-50 focus:ring-red-200 focus:border-red-500' : ''}`;

  const scrollToField = (fieldId: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    window.requestAnimationFrame(() => {
      const target = document.getElementById(fieldId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (target instanceof HTMLElement) {
          target.focus({ preventScroll: true });
        }
      }
    });
  };

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
    setPhoneError(null);
    setEmailError(null);
    setSubmitAttempted(true);
    const missingFieldIds: string[] = [];
    if (!formData.pickupType) {
      missingFieldIds.push('pickupType');
    }
    if (formData.pickupType === 'address' && !formData.pickupAddress.trim()) {
      missingFieldIds.push('pickupAddress');
    }
    if (!formData.destinationAddress.trim()) {
      missingFieldIds.push('destinationAddress');
    }
    if (formData.pickupType === 'airport') {
      if (formData.signService === 'sign' && !formData.signText.trim()) {
        missingFieldIds.push('signText');
      }
      if (!formData.flightNumber.trim()) {
        missingFieldIds.push('flightNumber');
      }
    }
    if (!formData.date) {
      missingFieldIds.push('date');
    }
    if (!formData.time) {
      missingFieldIds.push('time');
    }
    if (!formData.passengers) {
      missingFieldIds.push('passengers');
    }
    if (!formData.largeLuggage) {
      missingFieldIds.push('largeLuggage');
    }
    if (!formData.name.trim()) {
      missingFieldIds.push('name');
    }
    if (!formData.phone.trim() || !isPhoneValid) {
      missingFieldIds.push('phone');
    }
    if (!formData.email.trim() || !isEmailValid) {
      missingFieldIds.push('email');
    }
    if (!isPriceValid && showPriceInput) {
      missingFieldIds.push('proposedPrice');
    }
    if (missingFieldIds.length > 0) {
      scrollToField(missingFieldIds[0]);
      return;
    }
    const phoneError = validatePhoneNumber(formData.phone, t.quoteForm.validation);
    if (phoneError) {
      setPhoneError(phoneError);
      setError(phoneError);
      return;
    }
    const emailError = validateEmail(formData.email, t.quoteForm.validation.email);
    if (emailError) {
      setEmailError(emailError);
      setError(emailError);
      return;
    }
    setSubmitting(true);

    const apiBaseUrl = getApiBaseUrl();
    const passengersNumber = Number(formData.passengers);
    const carType = passengersNumber >= 5 ? 1 : 2;
    const additionalNotes = buildAdditionalNotes({
      pickupType: formData.pickupType as 'airport' | 'address',
      signService: formData.pickupType === 'airport' ? formData.signService : 'self',
      signFee,
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
      locale,
    };

    try {
      const response = await fetch(`${apiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setError(data?.error ?? t.quoteForm.submitError);
        return;
      }

      setOrderId(data?.id ?? null);
      setGeneratedId(data?.generatedId ?? null);
      setSubmitted(true);
      trackConversion();
    } catch {
      setError(t.quoteForm.submitNetworkError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart('quote');
    }
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
        signService: 'self',
        signText: '',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSignServiceChange = (value: 'sign' | 'self') => {
    if (!formStartedRef.current) {
      formStartedRef.current = true;
      trackFormStart('quote');
    }
    setFormData((prev) => ({
      ...prev,
      signService: value,
      signText: value === 'self' ? '' : prev.signText,
    }));
  };

  const handlePhoneChange = (value: string) => {
    const nextError = validatePhoneNumber(value, t.quoteForm.validation);
    setPhoneError(nextError);
    if (!nextError && error === phoneError) {
      setError(null);
    }
  };

  const handlePhoneBlur = () => {
    const phoneError = validatePhoneNumber(formData.phone, t.quoteForm.validation);
    setPhoneError(phoneError);
  };

  const handleEmailChange = (value: string) => {
    const nextError = validateEmail(value, t.quoteForm.validation.email);
    setEmailError(nextError);
    if (!nextError && error === emailError) {
      setError(null);
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
            <h3 className="text-green-900 mb-2">{t.quoteForm.submittedTitle}</h3>
            <p className="text-green-800 mb-4">
              {t.quoteForm.submittedBody}
            </p>
            {orderId && (
              <div className="bg-white rounded-lg p-4 mb-4">
                {generatedId && (
                  <p className="text-gray-700">{t.orderForm.orderNumber} <span className="font-semibold">{generatedId}</span></p>
                )}
                <p className="text-gray-700">{t.orderForm.orderId} <span className="font-semibold">{orderId}</span></p>
                <a
                  href={`${basePath}/?orderId=${orderId}`}
                  className="text-blue-600 hover:text-blue-700 text-sm underline"
                >
                  {t.quoteForm.manageLink}
                </a>
              </div>
            )}
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              {t.common.close}
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
            <h3 className="text-gray-900">{t.quoteForm.title}</h3>
            <p className="text-gray-600 text-sm mt-1">{t.quoteForm.subtitle}</p>
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

        <form
          onSubmit={handleSubmit}
          noValidate
          className="booking-form p-6 space-y-6 overflow-y-auto cursor-default"
          onPointerDownCapture={(event) => {
            if (
              showPriceInput
              && formData.proposedPrice.trim() === ''
              && priceInputRef.current
              && !priceInputRef.current.contains(event.target as Node)
            ) {
              setShowPriceInput(false);
              setFormData(prev => ({ ...prev, proposedPrice: 'taximeter' }));
            }
          }}
        >
          {error && (
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 text-red-800">
              {error}
            </div>
          )}

          {/* Pickup Type */}
          <div id="pickupType" tabIndex={-1}>
            <label className="block text-gray-700 mb-2">
              {t.quoteForm.pickupType}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.pickupType === 'airport'
                  ? 'border-blue-500 bg-blue-50'
                  : pickupTypeError ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200 hover:border-gray-300'
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
                <span>{t.quoteForm.airportPickup}</span>
              </label>
              
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                formData.pickupType === 'address'
                  ? 'border-blue-500 bg-blue-50'
                  : pickupTypeError ? 'border-red-400 ring-1 ring-red-200' : 'border-gray-200 hover:border-gray-300'
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
                <span>{t.quoteForm.addressPickup}</span>
              </label>
            </div>
          </div>

          {!formData.pickupType ? (
            <div className="rounded-xl bg-slate-900/85 px-6 py-10 text-center text-white shadow-inner">
              <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm backdrop-blur-sm">
                <Lock className="h-4 w-4" />
                {t.quoteForm.lockMessage}
              </div>
            </div>
          ) : (
            <>
              {/* Pickup Address */}
              <div>
                <label htmlFor="pickupAddress" className="block text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t.quoteForm.pickupAddress}
                </label>
                <textarea
                  id="pickupAddress"
                  name="pickupAddress"
                  value={formData.pickupAddress}
                  onChange={handleChange}
                  placeholder={t.quoteForm.pickupPlaceholder}
                  rows={2}
                  className={fieldClass(
                    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed',
                    pickupAddressError,
                  )}
                  disabled={formData.pickupType === 'airport'}
                  required
                />
                {formData.pickupType === 'airport' && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <Plane className="w-3 h-3" />
                    {t.quoteForm.pickupAutoNote}
                  </p>
                )}
              </div>

              {/* Destination Address */}
              <div>
                <label htmlFor="destinationAddress" className="block text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  {t.quoteForm.destinationAddress}
                </label>
                <textarea
                  id="destinationAddress"
                  name="destinationAddress"
                  value={formData.destinationAddress}
                  onChange={handleChange}
                  placeholder={t.quoteForm.destinationPlaceholder}
                  rows={2}
                  className={fieldClass(
                    'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                    destinationError,
                  )}
                  required
                />
              </div>

              {/* Proposed Price */}
              <div>
                <label htmlFor="proposedPrice" className="block text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 inline mr-2" />
                  {t.quoteForm.price}
                </label>
                {!showPriceInput ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!formStartedRef.current) {
                        formStartedRef.current = true;
                        trackFormStart('quote');
                      }
                      setShowPriceInput(true);
                      setFormData(prev => ({ ...prev, proposedPrice: '' }));
                    }}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-left text-slate-800 shadow-sm hover:border-blue-500 hover:bg-blue-50/40 transition-colors"
                  >
                    <span className="block text-sm font-semibold text-slate-900">
                      {t.quoteForm.taximeterTitle}
                    </span>
                    <span className="mt-2 block text-xs text-slate-600">
                      {t.quoteForm.tariff1}
                    </span>
                    <span className="block text-xs text-slate-600">
                      {t.quoteForm.tariff2}
                    </span>
                    <span className="block text-xs text-slate-600">
                      {t.quoteForm.tariff3}
                    </span>
                    <span className="block text-xs text-slate-600">
                      {t.quoteForm.tariff4}
                    </span>
                    <span className="mt-3 block text-xs font-semibold text-blue-700">
                      {t.quoteForm.fixedPriceHint}
                    </span>
                  </button>
                ) : (
                  <>
                    <input
                      type="number"
                      id="proposedPrice"
                      name="proposedPrice"
                      value={formData.proposedPrice}
                      ref={priceInputRef}
                      onChange={(e) => {
                        handleChange(e);
                        handlePhoneChange(e.target.value);
                      }}
                      onBlur={(event) => {
                        if (event.currentTarget.value.trim() === '') {
                          setShowPriceInput(false);
                          setFormData(prev => ({ ...prev, proposedPrice: 'taximeter' }));
                        }
                      }}
                      onKeyDown={(event) => {
                        if (event.key === 'Escape' && formData.proposedPrice.trim() === '') {
                          setShowPriceInput(false);
                          setFormData(prev => ({ ...prev, proposedPrice: 'taximeter' }));
                        }
                      }}
                      placeholder={t.quoteForm.pricePlaceholder}
                      min="0"
                      step="10"
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        priceError,
                      )}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.quoteForm.priceHelp}
                    </p>
                  </>
                )}
              </div>

              {/* Date and Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="date" className="block text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 inline mr-2" />
                    {t.quoteForm.date}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={fieldClass(
                      'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      dateError,
                    )}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="time" className="block text-gray-700 mb-2">
                    {t.quoteForm.pickupTime}
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={fieldClass(
                      'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      timeError,
                    )}
                    required
                  />
                </div>
              </div>

              {/* Airport Pickup Fields */}
              {formData.pickupType === 'airport' && (
                <>
                  <div id="signService" tabIndex={-1}>
                    <label className="block text-gray-700 mb-2">
                      {signServiceTitle}
                    </label>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.signService === 'sign'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="signService"
                          value="sign"
                          checked={formData.signService === 'sign'}
                          onChange={() => handleSignServiceChange('sign')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <FileText className="w-5 h-5 text-gray-700" />
                        <div>
                          <div className="text-gray-900">{signServiceSign}</div>
                          <div className="text-xs text-gray-500">{signServiceFee}</div>
                        </div>
                      </label>

                      <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        formData.signService === 'self'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <input
                          type="radio"
                          name="signService"
                          value="self"
                          checked={formData.signService === 'self'}
                          onChange={() => handleSignServiceChange('self')}
                          className="w-4 h-4 text-blue-600"
                        />
                        <Users className="w-5 h-5 text-gray-700 flex-shrink-0" />
                        <div>
                          <div className="text-gray-900">{signServiceSelf}</div>
                          <div className="text-xs text-gray-500">{t.quoteForm.signServiceSelfNote}</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  {formData.signService === 'sign' && (
                    <div>
                      <label htmlFor="signText" className="block text-gray-700 mb-2">
                        <FileText className="w-4 h-4 inline mr-2" />
                        {t.quoteForm.signText}
                      </label>
                      <input
                        type="text"
                        id="signText"
                        name="signText"
                        value={formData.signText}
                        onChange={handleChange}
                        placeholder={t.quoteForm.signPlaceholder}
                        className={fieldClass(
                          'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                          signTextError,
                        )}
                        required
                      />
                      <div className="mt-3 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-amber-900">
                            {t.quoteForm.signHelp}
                          </p>
                        </div>
                        <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
                          <p className="text-xs text-gray-500 mb-2 text-center">{t.quoteForm.signPreview}</p>
                          <div className="bg-white border-4 border-blue-900 rounded p-3 text-center min-h-[60px] flex items-center justify-center">
                            <p className="text-blue-900 text-lg break-words">
                              {formData.signText || t.quoteForm.signEmpty}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label htmlFor="flightNumber" className="block text-gray-700 mb-2">
                      <Plane className="w-4 h-4 inline mr-2" />
                      {t.quoteForm.flightNumber}
                    </label>
                    <input
                      type="text"
                      id="flightNumber"
                      name="flightNumber"
                      value={formData.flightNumber}
                      onChange={handleChange}
                      placeholder={t.quoteForm.flightPlaceholder}
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        flightNumberError,
                      )}
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
                    {t.quoteForm.passengers}
                  </label>
                  <select
                    id="passengers"
                    name="passengers"
                    value={formData.passengers}
                    onChange={handleChange}
                    className={fieldClass(
                      'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      passengersError,
                    )}
                    required
                  >
                    {t.quoteForm.passengersOptions.map((label, index) => (
                      <option key={label} value={index + 1}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="largeLuggage" className="block text-gray-700 mb-2">
                    <Luggage className="w-4 h-4 inline mr-2" />
                    {t.quoteForm.largeLuggage}
                  </label>
                  <select
                    id="largeLuggage"
                    name="largeLuggage"
                    value={formData.largeLuggage}
                    onChange={handleChange}
                    className={fieldClass(
                      'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                      luggageError,
                    )}
                    required
                  >
                    <option value="no">{t.quoteForm.luggageNo}</option>
                    <option value="yes">{t.quoteForm.luggageYes}</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t pt-6">
                <h4 className="text-gray-900 mb-4">{t.quoteForm.contactTitle}</h4>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 mb-2">
                      {t.quoteForm.fullName}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t.quoteForm.namePlaceholder}
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        nameError,
                      )}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-700 mb-2">
                      {t.quoteForm.phoneNumber}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={handlePhoneBlur}
                      inputMode="tel"
                      placeholder="+48 123 456 789"
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        phoneErrorState,
                      )}
                      required
                    />
                    {phoneError && (
                      <p className="text-sm text-red-600 mt-2">{phoneError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-gray-700 mb-2">
                      {t.quoteForm.email}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => {
                        handleChange(e);
                        handleEmailChange(e.target.value);
                      }}
                      placeholder={t.quoteForm.emailPlaceholder}
                      className={fieldClass(
                        'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        emailErrorState,
                      )}
                      required
                    />
                    {emailError && (
                      <p className="text-sm text-red-600 mt-2">{emailError}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {t.quoteForm.emailHelp}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-gray-700 mb-2">
                      <FileText className="w-4 h-4 inline mr-2" />
                      {t.quoteForm.notesTitle}
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={t.quoteForm.notesPlaceholder}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {t.quoteForm.notesHelp}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full py-4 rounded-lg transition-colors ${
                  submitting
                    ? 'bg-slate-200 text-slate-700 border border-slate-300 shadow-inner cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={submitting}
              >
                {submitting ? t.quoteForm.submitting : t.quoteForm.submit}
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
