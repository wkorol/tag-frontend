import { useI18n } from '../lib/i18n';

export function TrustSection() {
  const { t } = useI18n();

  return (
    <section className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-gray-900 mb-2">{t.trust.companyTitle}</h3>
            <p className="text-sm text-gray-600">
              WK DRIVE
              <br />
              NIP: 5862330063
              <br />
              Gdańsk
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">{t.trust.paymentTitle}</h3>
            <p className="text-sm text-gray-600">
              {t.trust.paymentBody}
            </p>
          </div>
          <div>
            <h3 className="text-gray-900 mb-2">{t.trust.comfortTitle}</h3>
            <p className="text-sm text-gray-600">
              {t.trust.comfortBody}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
