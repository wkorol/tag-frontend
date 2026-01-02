export function PrivacyPolicy() {
  return (
    <section className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-4xl mx-auto px-4 text-gray-700 space-y-6">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">Privacy Policy</h2>
          <p className="text-sm text-gray-500">Last updated: January 2, 2026</p>
        </div>

        <p>
          This Privacy Policy explains how Taxi Airport Gdańsk collects and processes personal data
          when you use our booking services and website.
        </p>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">Data controller</h3>
          <p>
            Taxi Airport Gdańsk
            <br />
            Gdańsk, Poland
            <br />
            Email: <a href="mailto:booking@taxiairportgdansk.com" className="text-blue-600 hover:text-blue-700 underline">booking@taxiairportgdansk.com</a>
          </p>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">What data we collect</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Contact details such as name, email address, and phone number.</li>
            <li>Booking details such as pickup location, date, time, flight number, and notes.</li>
            <li>Technical data such as IP address and basic browser information for security.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">Why we process your data</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>To respond to your booking request and deliver the requested service.</li>
            <li>To communicate about your booking, changes, or cancellations.</li>
            <li>To comply with legal obligations and prevent misuse.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">Legal basis</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Contract performance (Article 6(1)(b) GDPR).</li>
            <li>Legal obligation (Article 6(1)(c) GDPR).</li>
            <li>Legitimate interests (Article 6(1)(f) GDPR), such as security and fraud prevention.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">How long we store data</h3>
          <p>
            We keep booking data only as long as necessary to provide the service and meet legal or
            accounting requirements.
          </p>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">Who we share data with</h3>
          <p>
            We share data only with service providers necessary to deliver the booking service
            (such as email delivery providers). We do not sell your personal data.
          </p>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">Your rights</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access, rectification, or deletion of your personal data.</li>
            <li>Restriction or objection to processing.</li>
            <li>Data portability where applicable.</li>
            <li>Right to lodge a complaint with a supervisory authority.</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">Contact</h3>
          <p>
            For privacy-related requests, contact us at{' '}
            <a href="mailto:booking@taxiairportgdansk.com" className="text-blue-600 hover:text-blue-700 underline">
              booking@taxiairportgdansk.com
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
