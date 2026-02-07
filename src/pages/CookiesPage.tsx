import { Breadcrumbs } from '../components/Breadcrumbs';
import { CookiePolicy } from '../components/CookiePolicy';
import { PrivacyPolicy } from '../components/PrivacyPolicy';
import { Footer } from '../components/Footer';
import { FloatingActions } from '../components/FloatingActions';
import { Navbar } from '../components/Navbar';
import { localeToPath, useI18n } from '../lib/i18n';
import { usePageTitle } from '../lib/usePageTitle';

export function CookiesPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  usePageTitle(t.cookiePolicy.title);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <div className="max-w-4xl mx-auto px-4 pt-6">
          <Breadcrumbs
            items={[
              { label: t.common.home, href: `${basePath}/` },
              { label: t.cookiePolicy.title },
            ]}
          />
        </div>
        <CookiePolicy />
        <PrivacyPolicy />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}
