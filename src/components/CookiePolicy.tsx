import { useI18n } from '../lib/i18n';
import { trackContactClick } from '../lib/tracking';

export function CookiePolicy() {
  const { t } = useI18n();

  return (
    <section id="cookie-policy" className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-4xl mx-auto px-4 text-gray-700">
        <h2 className="text-2xl text-gray-900 mb-4">{t.cookiePolicy.title}</h2>
        <p className="text-sm text-gray-500 mb-6">{t.cookiePolicy.updated}</p>

        <p className="mb-4">
          {t.cookiePolicy.intro}
        </p>

        <h3 className="text-lg text-gray-900 mb-2">{t.cookiePolicy.sectionCookies}</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          {t.cookiePolicy.cookiesList.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <h3 className="text-lg text-gray-900 mb-2">{t.cookiePolicy.sectionManage}</h3>
        <p className="mb-4">
          {t.cookiePolicy.manageBody1}
        </p>
        <p className="mb-4">
          {t.cookiePolicy.manageBody2}
        </p>

        <h3 className="text-lg text-gray-900 mb-2">{t.cookiePolicy.contact}</h3>
        <p>
          {t.cookiePolicy.contactBody}{' '}
          <a
            href="mailto:booking@taxiairportgdansk.com"
            onClick={() => trackContactClick('email')}
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
