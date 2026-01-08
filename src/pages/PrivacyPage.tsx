import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { Footer } from '../components/Footer';
import { Navbar } from '../components/Navbar';
import { localeToPath, useI18n } from '../lib/i18n';

export function PrivacyPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <a
            href={`${basePath}/`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
            {t.common.backToHome}
          </a>
        </div>
        <PrivacyPolicy />
      </main>
      <Footer />
    </div>
  );
}
