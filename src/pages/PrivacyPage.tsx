import { Breadcrumbs } from '../components/Breadcrumbs';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { Navbar } from '../components/Navbar';
import { TrustSection } from '../components/TrustSection';
import { localeToPath, useI18n } from '../lib/i18n';
import { usePageTitle } from '../lib/usePageTitle';

export function PrivacyPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  usePageTitle(t.privacyPolicy.title);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <Breadcrumbs
            items={[
              { label: t.common.home, href: `${basePath}/` },
              { label: t.privacyPolicy.title },
            ]}
          />
        </div>
        <PrivacyPolicy />
      </main>
      <TrustSection />
      <Footer />
      <FloatingActions />
    </div>
  );
}
