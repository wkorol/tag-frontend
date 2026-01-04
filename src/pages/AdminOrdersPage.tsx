import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
};

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  price_proposed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-orange-100 text-orange-800',
};

export function AdminOrdersPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Missing admin token.');
      setLoading(false);
      return;
    }

    const apiBaseUrl = getApiBaseUrl();
    fetch(`${apiBaseUrl}/api/admin/orders?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          throw new Error(data?.error ?? 'Failed to load orders.');
        }
        return data;
      })
      .then((data) => {
        setOrders(data?.orders ?? []);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-slate-900">Admin Orders</h1>
            <p className="text-sm text-slate-600">All recent orders and statuses.</p>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading orders...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <div className="col-span-2">Order</div>
              <div className="col-span-2">Pickup</div>
              <div className="col-span-3">Customer</div>
              <div className="col-span-2">Price</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Open</div>
            </div>
            {orders.length === 0 && (
              <div className="px-6 py-8 text-sm text-slate-500">No orders found.</div>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className="grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-700"
              >
                <div className="col-span-2">
                  <div className="text-slate-900 font-medium">#{order.generatedId}</div>
                  <div className="text-xs text-slate-500">{order.id}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-900">{order.date}</div>
                  <div className="text-xs text-slate-500">{order.pickupTime}</div>
                </div>
                <div className="col-span-3">
                  <div className="text-slate-900">{order.fullName}</div>
                  <div className="text-xs text-slate-500">{order.emailAddress}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-slate-900">{order.proposedPrice} PLN</div>
                  {order.pendingPrice && (
                    <div className="text-xs text-blue-600">Pending: {order.pendingPrice} PLN</div>
                  )}
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      statusStyles[order.status] ?? 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="col-span-1 text-right">
                  <Link
                    to={`/admin/orders/${order.id}?token=${encodeURIComponent(token)}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
