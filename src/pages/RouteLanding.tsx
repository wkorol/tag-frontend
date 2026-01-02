import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

interface RouteLandingProps {
  title: string;
  description: string;
  route: string;
  examples: string[];
}

export function RouteLanding({ title, description, route, examples }: RouteLandingProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h1 className="text-3xl text-gray-900 mb-4">{title}</h1>
            <p className="text-gray-600 mb-6">{description}</p>
            <a
              href="/#vehicle-selection"
              className="inline-flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-orange-400 transition-colors animate-pulse-glow"
            >
              Order Online Now
            </a>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 grid gap-8 md:grid-cols-2">
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl text-gray-900 mb-3">What is included</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              <li>Meet &amp; greet at the airport with clear pickup instructions.</li>
              <li>Flight tracking and flexible pickup time.</li>
              <li>Fixed pricing with no hidden fees.</li>
              <li>Professional, English-speaking drivers.</li>
            </ul>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h2 className="text-xl text-gray-900 mb-3">Popular destinations</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
              {examples.map((example) => (
                <li key={example}>{example}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl text-gray-900 mb-4">FAQ</h2>
          <div className="grid gap-4 md:grid-cols-2 max-w-4xl">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-gray-900 mb-2">How fast is confirmation?</h3>
              <p className="text-sm text-gray-600">
                Most bookings are confirmed within 5–10 minutes by email.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-gray-900 mb-2">Do you track flights?</h3>
              <p className="text-sm text-gray-600">
                Yes, we monitor arrivals and adjust pickup time accordingly.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-gray-900 mb-2">Can I cancel?</h3>
              <p className="text-sm text-gray-600">
                You can cancel using the link sent in your confirmation email.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-gray-900 mb-2">Do you offer child seats?</h3>
              <p className="text-sm text-gray-600">
                Yes, child seats are available on request during booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
