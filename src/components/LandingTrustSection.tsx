import { Suspense, lazy } from 'react';
import { useI18n } from '../lib/i18n';

const TripadvisorWidget = lazy(() =>
  import('./TripadvisorWidget').then((mod) => ({ default: mod.TripadvisorWidget }))
);

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 17.27l5.18 3.04-1.64-5.81 4.46-3.86-5.88-.5L12 4.5 9.88 10.14l-5.88.5 4.46 3.86-1.64 5.81L12 17.27z" />
    </svg>
  );
}

export function LandingTrustSection() {
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
          <div className="rounded-2xl border border-slate-200 bg-white px-5 pt-14 pb-16 sm:pt-16 sm:pb-20 shadow-sm">
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div className="text-gray-900 font-semibold text-lg">
                {t.trust.googleReviewsTitle}
              </div>
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
              <div className="flex items-center justify-center gap-2 text-gray-700">
                {ratingText && <span className="text-base sm:text-lg">{ratingText}/5</span>}
                {count && <span className="text-sm sm:text-base text-gray-500">({count} {t.trust.googleReviewsCountLabel})</span>}
              </div>
              <a
                href={reviewsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm sm:text-base font-semibold text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition"
              >
                {t.trust.googleReviewsCta}
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm h-full flex items-center justify-center">
            <Suspense fallback={null}>
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
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  );
}
