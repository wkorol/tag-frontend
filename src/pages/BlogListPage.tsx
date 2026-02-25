import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FloatingActions } from '../components/FloatingActions';
import { getApiBaseUrl } from '../lib/api';
import { localeToPath, useI18n } from '../lib/i18n';
import { useSSRData, type BlogArticleSummary } from '../lib/ssrData';
import { usePageTitle } from '../lib/usePageTitle';

export function BlogListPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const ssrData = useSSRData();
  const [articles, setArticles] = useState<BlogArticleSummary[]>(ssrData?.blogArticles ?? []);
  const [loading, setLoading] = useState(!ssrData?.blogArticles);
  usePageTitle(t.blog?.title ?? 'Blog');

  useEffect(() => {
    if (ssrData?.blogArticles) return;
    const apiBaseUrl = getApiBaseUrl();
    fetch(`${apiBaseUrl}/api/blog/articles?locale=${encodeURIComponent(locale)}`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data?.articles ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [locale, ssrData]);

  const formatDate = (iso: string | null) => {
    if (!iso) return '';
    try {
      return new Date(iso).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso.slice(0, 10);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t.blog?.title ?? 'Blog'}
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            {t.blog?.subtitle ?? 'Travel tips and airport guides'}
          </p>
        </div>

        {loading && (
          <div className="text-sm text-slate-500">Loading...</div>
        )}

        {!loading && articles.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            {t.blog?.noArticles ?? 'No articles yet.'}
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`${basePath}/blog/${article.slug}`}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                {article.title}
              </h2>
              <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                {article.metaDescription}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {article.publishedAt ? formatDate(article.publishedAt) : ''}
                </span>
                <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  {t.blog?.readMore ?? 'Read more'} →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <FloatingActions />
    </div>
  );
}
