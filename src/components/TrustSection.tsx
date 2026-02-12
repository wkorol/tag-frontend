import { useI18n } from '../lib/i18n';
import { TripadvisorWidget } from './TripadvisorWidget';

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 17.27l5.18 3.04-1.64-5.81 4.46-3.86-5.88-.5L12 4.5 9.88 10.14l-5.88.5 4.46 3.86-1.64 5.81L12 17.27z" />
    </svg>
  );
}

export function TrustSection() {
  const { t } = useI18n();

  const reviewsUrl =
    (import.meta.env.VITE_GOOGLE_REVIEWS_URL as string | undefined) ||
    'https://maps.app.goo.gl/bG8hYPYhdD6cT394A';

  const ratingRaw = Number(import.meta.env.VITE_GOOGLE_REVIEWS_RATING);
  const rating = Number.isFinite(ratingRaw) && ratingRaw > 0 ? ratingRaw : null;

  const countRaw = Number(import.meta.env.VITE_GOOGLE_REVIEWS_COUNT);
  const count = Number.isFinite(countRaw) && countRaw > 0 ? Math.round(countRaw) : null;

  const ratingText = rating ? rating.toFixed(1) : null;

  return (
    <section className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <a
            href={reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5 sm:py-5 shadow-sm hover:shadow-md transition-shadow text-center"
          >
            <div className="flex-1 min-w-0 flex w-full flex-col items-center px-2 sm:px-3">
              <div className="text-gray-900 font-semibold text-lg">
                {t.trust.googleReviewsTitle}
              </div>
              <div className="mt-3 w-full rounded-xl bg-slate-50 px-3 py-3">
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <StarIcon
                      key={idx}
                      className={[
                        'h-5 w-5 sm:h-6 sm:w-6',
                        rating && rating >= idx + 1 ? 'opacity-100' : 'opacity-30',
                      ].join(' ')}
                    />
                  ))}
                </div>
                {ratingText && (
                    <span className="text-base sm:text-lg text-gray-900 whitespace-nowrap">
                    {ratingText}/5
                  </span>
                )}
                {count && (
                  <span className="text-sm sm:text-base text-gray-500 whitespace-nowrap">
                    ({count} {t.trust.googleReviewsCountLabel})
                  </span>
                )}
              </div>
              </div>
            </div>

            <div className="pt-5 px-2 sm:px-3">
              <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 group-hover:bg-blue-700 group-hover:shadow-blue-600/35 transition">
                {t.trust.googleReviewsCta}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 sm:h-5 sm:w-5 opacity-90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 17L17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </span>
            </div>
          </a>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm h-full flex items-center justify-center">
            <TripadvisorWidget
              requireConsent={false}
              wtype="cdsratingsonlynarrow"
              uniq="18"
              border
              backgroundColor="gray"
              ulId="26DzK4vLpG"
              ulClassName="TA_links zxoY1N7DGTdr"
              liId="8Elkc7FwaL0"
              liClassName="jv6ugdR"
            />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-gray-900 mb-2">{t.trust.companyTitle}</h3>
            <p className="text-sm text-gray-600">
              WK DRIVE
              <br />
              VAT ID (NIP): 5862330063
              <br />
              Gdańsk, Poland
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
