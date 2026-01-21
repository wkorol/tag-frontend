import { useI18n } from '../lib/i18n';
import { trackContactClick } from '../lib/tracking';

export function PrivacyPolicy() {
  const { t } = useI18n();
  const controllerLines = t.privacyPolicy.controllerBody.split('\n');

  return (
    <section className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-4xl mx-auto px-4 text-gray-700 space-y-6">
        <div>
          <h2 className="text-2xl text-gray-900 mb-2">{t.privacyPolicy.title}</h2>
          <p className="text-sm text-gray-500">{t.privacyPolicy.updated}</p>
        </div>

        <p>
          {t.privacyPolicy.intro}
        </p>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.controllerTitle}</h3>
          <p>
            {controllerLines[0]}
            <br />
            {controllerLines[1]}
            <br />
            {controllerLines[2]}{' '}
            <a
              href="mailto:booking@taxiairportgdansk.com"
              onClick={() => trackContactClick('email')}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              booking@taxiairportgdansk.com
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.dataTitle}</h3>
          <ul className="list-disc pl-5 space-y-2">
            {t.privacyPolicy.dataList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.whyTitle}</h3>
          <ul className="list-disc pl-5 space-y-2">
            {t.privacyPolicy.whyList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.legalTitle}</h3>
          <ul className="list-disc pl-5 space-y-2">
            {t.privacyPolicy.legalList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.storageTitle}</h3>
          <p>
            {t.privacyPolicy.storageBody}
          </p>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.shareTitle}</h3>
          <p>
            {t.privacyPolicy.shareBody}
          </p>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.rightsTitle}</h3>
          <ul className="list-disc pl-5 space-y-2">
            {t.privacyPolicy.rightsList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-900 mb-2">{t.privacyPolicy.contactTitle}</h3>
          <p>
            {t.privacyPolicy.contactBody}{' '}
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
      </div>
    </section>
  );
}
