import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { getApiBaseUrl } from '../lib/api';

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

export function AdminOrderPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [priceInput, setPriceInput] = useState('');
  const [rejectReason, setRejectReason] = useState('');
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
      setError('Missing admin token.');
      setLoading(false);
      return;
    }
    const apiBaseUrl = getApiBaseUrl();
    setLoading(true);
    fetch(`${apiBaseUrl}/api/admin/orders/${id}?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error ?? 'Failed to load order.');
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
    fetchOrder();
  }, [id, token]);

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
      setActionMessage('Order updated.');
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to update order.');
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
      setActionMessage('Order status updated.');
      fetchOrder();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : 'Failed to update order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-slate-900">Admin Order Details</h1>
            <p className="text-sm text-slate-600">Manage, confirm, or reject this order.</p>
          </div>
          {order?.canViewAll && (
            <Link
              to={`/admin?token=${encodeURIComponent(token)}`}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Back to all orders
            </Link>
          )}
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading order...
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
                  <h2 className="text-xl text-slate-900">Order #{order.generatedId}</h2>
                  <p className="text-sm text-slate-600">ID: {order.id}</p>
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
                  <div className="text-xs uppercase text-slate-500">Customer</div>
                  <div className="text-slate-900">{order.fullName}</div>
                  <div className="text-sm text-slate-600">{order.emailAddress}</div>
                  <div className="text-sm text-slate-600">{order.phoneNumber}</div>
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">Pickup</div>
                  <div className="flex items-center gap-2 text-slate-900">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    {order.date} {order.pickupTime}
                  </div>
                  <div className="text-sm text-slate-600">{order.pickupAddress}</div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">Price</div>
                  <div className="text-slate-900">{order.proposedPrice} PLN</div>
                  {order.pendingPrice && (
                    <div className="text-sm text-blue-700">Pending: {order.pendingPrice} PLN</div>
                  )}
                </div>
                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="text-xs uppercase text-slate-500">Additional info</div>
                  <div className="text-sm text-slate-700">
                    Passengers: {parsedNotes?.passengers ?? '—'}
                  </div>
                  <div className="text-sm text-slate-700">
                    Route: {parsedNotes?.route?.from ?? '—'} → {parsedNotes?.route?.to ?? '—'}
                  </div>
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
                <h3 className="text-lg text-slate-900">Admin Actions</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-white hover:bg-green-700 transition-colors"
                    disabled={submitting}
                    onClick={() => postDecision({ action: 'confirm' })}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Confirm order
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-white hover:bg-red-700 transition-colors"
                    disabled={submitting}
                    onClick={() => postDecision({ action: 'reject', message: rejectReason })}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject order
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm text-slate-700">Propose new price (PLN)</label>
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
                      Send price proposal
                    </button>
                  </div>
                  <div>
                    <label className="text-sm text-slate-700">Rejection reason (optional)</label>
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

            {canFulfill && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg text-slate-900 mb-3">Completion status</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-white hover:bg-emerald-700 transition-colors"
                    disabled={submitting}
                    onClick={() => postFulfillment('completed')}
                  >
                    Mark completed
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-white hover:bg-orange-600 transition-colors"
                    disabled={submitting}
                    onClick={() => postFulfillment('failed')}
                  >
                    Mark not completed
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
