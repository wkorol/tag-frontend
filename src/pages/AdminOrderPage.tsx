import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { getApiBaseUrl } from '../lib/api';
import { Locale, localeToPath, useI18n } from '../lib/i18n';

type AdminOrder = {
  id: string;
  generatedId: string;
  status: string;
  date: string;
  pickupTime: string;
  pickupAddress: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  proposedPrice: string;
  pendingPrice?: string | null;
  rejectionReason?: string | null;
  additionalNotes?: string | null;
  canViewAll?: boolean;
};

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  price_proposed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-orange-100 text-orange-800',
};

const parseNotes = (notes?: string | null) => {
  if (!notes) {
    return null;
  }
  try {
    return JSON.parse(notes);
  } catch {
    return null;
  }
};

const mapFixedLabelToPolish = (value: string) => {
  const normalized = value.trim();
  const map: Record<string, string> = {
    Airport: 'Lotnisko',
    Flughafen: 'Lotnisko',
    Lentokenttä: 'Lotnisko',
    Flyplass: 'Lotnisko',
    Flygplats: 'Lotnisko',
    Lufthavn: 'Lotnisko',
    Lotnisko: 'Lotnisko',
    'Gdańsk City Center': 'Centrum Gdańska',
    'Gdańsk Zentrum': 'Centrum Gdańska',
    'Gdańsk centrum': 'Centrum Gdańska',
    'Gdańsk sentrum': 'Centrum Gdańska',
    'Gdańskin keskusta': 'Centrum Gdańska',
    'Centrum Gdańska': 'Centrum Gdańska',
    'Gdynia City Center': 'Centrum Gdyni',
    'Gdynia Zentrum': 'Centrum Gdyni',
    'Gdynia centrum': 'Centrum Gdyni',
    'Gdynia sentrum': 'Centrum Gdyni',
    'Gdynian keskusta': 'Centrum Gdyni',
    'Centrum Gdyni': 'Centrum Gdyni',
  };
  return map[normalized] ?? value;
};

const normalizeWhatsappNumber = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (!digits) {
    return null;
  }
  if (digits.startsWith('48')) {
    return digits;
  }
  if (digits.length === 9) {
    return `48${digits}`;
  }
  if (digits.length === 10 && digits.startsWith('0')) {
    return `48${digits.slice(1)}`;
  }
  return digits;
};

const buildWhatsappLink = (phone: string, fullName: string) => {
  const digits = normalizeWhatsappNumber(phone);
  if (!digits) {
    return null;
  }
  const message = `Cześć ${fullName}, tu Taxi Airport Gdańsk.`;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
};

export function AdminOrderPage() {
  const { t, locale, setLocale } = useI18n();
  const adminLocale: Locale = 'pl';
  const basePath = localeToPath(adminLocale);
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [updateFields, setUpdateFields] = useState({
    phone: false,
    email: false,
    flight: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const parsedNotes = useMemo(() => parseNotes(order?.additionalNotes), [order?.additionalNotes]);

  const pickupDateTime = useMemo(() => {
    if (!order?.date || !order?.pickupTime) {
      return null;
    }
    const dateTime = new Date(`${order.date}T${order.pickupTime}:00`);
    return Number.isNaN(dateTime.getTime()) ? null : dateTime;
  }, [order?.date, order?.pickupTime]);

  const canFulfill = order?.status === 'confirmed' && pickupDateTime && pickupDateTime.getTime() < Date.now();

  const fetchOrder = () => {
    if (!id || !token) {
      setError(t.adminOrder.missingToken);
      setLoading(false);
      return;
    }
    const apiBaseUrl = getApiBaseUrl();
    setLoading(true);
    fetch(`${apiBaseUrl}/api/admin/orders/${id}?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error ?? t.adminOrder.errorLoad);
        }
        return data;
      })
      .then((data) => {
        setOrder(data);
        setPriceInput(data?.proposedPrice ?? '');
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (locale !== adminLocale) {
      setLocale(adminLocale);
    }
    fetchOrder();
  }, [id, token, locale, setLocale]);

  const postDecision = async (payload: Record<string, string>) => {
    if (!id || !token) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/decision?token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? 'Failed to update order.');
      }
      setActionMessage(t.adminOrder.updated);
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };

  const postAdminCancel = async () => {
    if (!id || !token) {
      return;
    }
    if (!window.confirm(t.adminOrder.cancelConfirmedConfirm)) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/cancel?token=${encodeURIComponent(token)}`,
        { method: 'POST' }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? t.adminOrder.updateError);
      }
      setActionMessage(t.adminOrder.cancelConfirmedSuccess);
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };

  const postAdminDelete = async () => {
    if (!id || !token) {
      return;
    }
    if (!window.confirm(t.adminOrder.deleteRejectedConfirm)) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/delete?token=${encodeURIComponent(token)}`,
        { method: 'DELETE' }
      );
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error ?? t.adminOrder.updateError);
      }
      setActionMessage(t.adminOrder.deleteRejectedSuccess);
      navigate(`${basePath}/admin?token=${encodeURIComponent(token)}`, { replace: true });
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };

  const postFulfillment = async (action: 'completed' | 'failed') => {
    if (!id || !token) {
      return;
    }
    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/fulfillment?token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action }),
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? 'Failed to update order.');
      }
      setActionMessage(t.adminOrder.statusUpdated);
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateError);
    } finally {
      setSubmitting(false);
    }
  };

  const postUpdateRequest = async () => {
    if (!id || !token) {
      return;
    }

    const fields = Object.entries(updateFields)
      .filter(([, selected]) => selected)
      .map(([field]) => field);

    if (fields.length === 0) {
      setActionMessage(t.adminOrder.updateRequestSelect);
      return;
    }

    setSubmitting(true);
    setActionMessage(null);
    const apiBaseUrl = getApiBaseUrl();
    try {
      const response = await fetch(
        `${apiBaseUrl}/api/admin/orders/${id}/request-update?token=${encodeURIComponent(token)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields }),
        }
      );
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error ?? t.adminOrder.updateRequestError);
      }
      setActionMessage(t.adminOrder.updateRequestSent);
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : t.adminOrder.updateRequestError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-slate-900">{t.adminOrder.title}</h1>
            <p className="text-sm text-slate-600">{t.adminOrder.subtitle}</p>
          </div>
          {order?.canViewAll && (
            <Link
              to={`${basePath}/admin?token=${encodeURIComponent(token)}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {t.adminOrder.back}
            </Link>
          )}
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            {t.adminOrder.loading}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && order && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl text-slate-900">{t.adminOrder.orderLabel} #{order.generatedId}</h2>
                  <p className="text-sm text-slate-600">{t.adminOrder.idLabel}: {order.id}</p>
                </div>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                    statusStyles[order.status] ?? 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {order.status.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">{t.adminOrder.customerLabel}</div>
                  <div className="text-slate-900">{order.fullName}</div>
                  <div className="text-sm text-slate-600">{order.emailAddress}</div>
                  {(() => {
                    const whatsappLink = buildWhatsappLink(order.phoneNumber, order.fullName);
                    if (!whatsappLink) {
                      return <div className="text-sm text-slate-600">{order.phoneNumber}</div>;
                    }
                    return (
                      <a
                        className="text-sm text-slate-600 underline underline-offset-2 hover:text-emerald-600"
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {order.phoneNumber}
                      </a>
                    );
                  })()}
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">{t.adminOrder.pickupLabel}</div>
                  <div className="flex items-center gap-2 text-slate-900">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {order.date} {order.pickupTime}
                  </div>
                  <div className="text-sm text-slate-600">{mapFixedLabelToPolish(order.pickupAddress)}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">{t.adminOrder.priceLabel}</div>
                  <div className="text-slate-900">{order.proposedPrice} PLN</div>
                  {order.pendingPrice && (
                    <div className="text-sm text-blue-700">{t.adminOrder.pendingPrice(order.pendingPrice)}</div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">{t.adminOrder.additionalInfo}</div>
                  <div className="text-sm text-slate-700">
                    {t.adminOrder.passengers} {parsedNotes?.passengers ?? '—'}
                  </div>
                  <div className="text-sm text-slate-700">
                    {t.adminOrder.largeLuggage} {parsedNotes?.largeLuggage ?? '—'}
                  </div>
                  <div className="text-sm text-slate-700">
                    {t.adminOrder.pickupType} {parsedNotes?.pickupType ?? '—'}
                  </div>
                  {parsedNotes?.signService && (
                    <div className="text-sm text-slate-700">
                      {t.adminOrder.signService}{' '}
                      {parsedNotes.signService === 'sign'
                        ? t.adminOrder.signServiceSign
                        : t.adminOrder.signServiceSelf}
                    </div>
                  )}
                  {typeof parsedNotes?.signFee === 'number' && parsedNotes.signFee > 0 && (
                    <div className="text-sm text-slate-700">
                      {t.adminOrder.signFee} {parsedNotes.signFee} PLN
                    </div>
                  )}
                  {parsedNotes?.pickupType === 'airport' && (
                    <div className="text-sm text-slate-700">
                      {t.adminOrder.flightNumber} {order.flightNumber || '—'}
                    </div>
                  )}
                  {parsedNotes?.signText && (
                    <div className="text-sm text-slate-700">
                      {t.adminOrder.signText} {parsedNotes.signText}
                    </div>
                  )}
                  <div className="text-sm text-slate-700">
                    {t.adminOrder.route}{' '}
                    {parsedNotes?.route?.from ? mapFixedLabelToPolish(parsedNotes.route.from) : '—'} →{' '}
                    {parsedNotes?.route?.to ? mapFixedLabelToPolish(parsedNotes.route.to) : '—'}
                  </div>
                  {parsedNotes?.notes && (
                    <div className="text-sm text-slate-700">
                      {t.adminOrder.notes} {parsedNotes.notes}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {actionMessage && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-700">
                {actionMessage}
              </div>
            )}

            {order.status === 'pending' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg text-slate-900">{t.adminOrder.adminActions}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 transition-colors"
                    disabled={submitting}
                    onClick={() => postDecision({ action: 'confirm' })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {t.adminOrder.confirmOrder}
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition-colors"
                    disabled={submitting}
                    onClick={() => postDecision({ action: 'reject', message: rejectReason })}
                  >
                    <XCircle className="h-4 w-4" />
                    {t.adminOrder.rejectOrder}
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-700">{t.adminOrder.proposePrice}</label>
                    <input
                      type="text"
                      value={priceInput}
                      onChange={(event) => setPriceInput(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                    <button
                      className="mt-3 w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-700 hover:bg-blue-50 transition-colors"
                      disabled={submitting}
                      onClick={() => postDecision({ action: 'price', price: priceInput })}
                    >
                      {t.adminOrder.sendPrice}
                    </button>
                  </div>
                  <div>
                    <label className="text-sm text-slate-700">{t.adminOrder.rejectionReason}</label>
                    <textarea
                      value={rejectReason}
                      onChange={(event) => setRejectReason(event.target.value)}
                      rows={4}
                      className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {(order.status === 'pending' || order.status === 'confirmed') && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-lg text-slate-900">{t.adminOrder.requestUpdate}</h3>
                <p className="text-sm text-slate-600">
                  {t.adminOrder.requestUpdateBody}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(['phone', 'email', 'flight'] as const).map((field) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <input
                        type="checkbox"
                        checked={updateFields[field]}
                        onChange={(event) =>
                          setUpdateFields((prev) => ({
                            ...prev,
                            [field]: event.target.checked,
                          }))
                        }
                      />
                      {field === 'phone'
                        ? t.adminOrder.fieldPhone
                        : field === 'email'
                          ? t.adminOrder.fieldEmail
                          : t.adminOrder.fieldFlight}
                    </label>
                  ))}
                </div>
                <button
                  className="w-full rounded-lg border border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 transition-colors"
                  disabled={submitting}
                  onClick={postUpdateRequest}
                >
                  {t.adminOrder.requestUpdateAction}
                </button>
              </div>
            )}

            {order.status === 'confirmed' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h3 className="text-lg text-slate-900">{t.adminOrder.cancelConfirmedTitle}</h3>
                <p className="text-sm text-slate-600">
                  {t.adminOrder.cancelConfirmedBody}
                </p>
                <button
                  className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition-colors"
                  disabled={submitting}
                  onClick={postAdminCancel}
                >
                  {t.adminOrder.cancelConfirmedAction}
                </button>
              </div>
            )}

            {order.status === 'rejected' && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
                <h3 className="text-lg text-slate-900">{t.adminOrder.deleteRejectedTitle}</h3>
                <p className="text-sm text-slate-600">
                  {t.adminOrder.deleteRejectedBody}
                </p>
                <button
                  className="w-full rounded-lg border border-red-600 px-4 py-2 text-red-700 hover:bg-red-50 transition-colors"
                  disabled={submitting}
                  onClick={postAdminDelete}
                >
                  {t.adminOrder.deleteRejectedAction}
                </button>
              </div>
            )}

            {canFulfill && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg text-slate-900 mb-3">{t.adminOrder.completionTitle}</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 transition-colors"
                    disabled={submitting}
                    onClick={() => postFulfillment('completed')}
                  >
                    {t.adminOrder.markCompleted}
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600 transition-colors"
                    disabled={submitting}
                    onClick={() => postFulfillment('failed')}
                  >
                    {t.adminOrder.markFailed}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
