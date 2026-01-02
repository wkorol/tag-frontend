export function CookiePolicy() {
  return (
    <section id="cookie-policy" className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-4xl mx-auto px-4 text-gray-700">
        <h2 className="text-2xl text-gray-900 mb-4">Cookie Policy</h2>
        <p className="text-sm text-gray-500 mb-6">Last updated: January 2, 2026</p>

        <p className="mb-4">
          This website uses cookies to ensure the site works reliably and to keep your booking safe.
          We do not use marketing or analytics cookies at this time.
        </p>

        <h3 className="text-lg text-gray-900 mb-2">What cookies we use</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Essential cookies to keep the site secure and prevent abuse.</li>
          <li>Preference cookies to remember basic choices during a session.</li>
        </ul>

        <h3 className="text-lg text-gray-900 mb-2">How you can manage cookies</h3>
        <p className="mb-4">
          You can delete cookies at any time from your browser settings. Blocking essential cookies may
          prevent the booking form and order management from working properly.
        </p>

        <h3 className="text-lg text-gray-900 mb-2">Contact</h3>
        <p>
          If you have questions about this policy, contact us at{' '}
          <a
            href="mailto:booking@taxiairportgdansk.com"
            className="text-blue-600 hover:text-blue-700 underline"
          >
            booking@taxiairportgdansk.com
          </a>
          .
        </p>
      </div>
    </section>
  );
}
