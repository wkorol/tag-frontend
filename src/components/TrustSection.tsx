export function TrustSection() {
  return (
    <section className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-gray-900 mb-2">Company details</h3>
            <p className="text-sm text-gray-600">
              WK DRIVE
              <br />
              NIP: 5862330063
              <br />
              Gdańsk
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">Payment & invoices</h3>
            <p className="text-sm text-gray-600">
              Cash or card on request. Invoices available for business clients.
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">Comfort & safety</h3>
            <p className="text-sm text-gray-600">
              Child seats available on request. Professional, licensed drivers and
              door-to-door assistance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
