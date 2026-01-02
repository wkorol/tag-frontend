import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <a
          href="/"
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
        >
          ← Back to home
        </a>
      </div>
      <PrivacyPolicy />
      <Footer />
    </div>
  );
}
