import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { FloatingActions } from '../components/FloatingActions';
import { getApiBaseUrl } from '../lib/api';
import { localeToPath, useI18n } from '../lib/i18n';
import { getRoutePath } from '../lib/routes';
import { useSSRData, type BlogArticleFull } from '../lib/ssrData';
import { usePageTitle } from '../lib/usePageTitle';

export function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const ssrData = useSSRData();
  const ssrArticle = ssrData?.blogArticle?.slug === slug ? ssrData.blogArticle : null;
  const [article, setArticle] = useState<BlogArticleFull | null>(ssrArticle);
  const [loading, setLoading] = useState(!ssrArticle);
  const [notFound, setNotFound] = useState(false);
  usePageTitle(article?.title ?? 'Blog');

  useEffect(() => {
    if (ssrArticle) return;
    if (!slug) return;
    const apiBaseUrl = getApiBaseUrl();
    fetch(`${apiBaseUrl}/api/blog/articles/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`)
      .then(async (res) => {
        if (!res.ok) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setArticle(data?.article ?? null);
        if (!data?.article) setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug, locale, ssrArticle]);

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
      <main className="mx-auto max-w-3xl px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-slate-500">
          <Link to={`${basePath}/`} className="hover:text-blue-600 transition-colors">
            {t.navbar.home}
          </Link>
          <span className="mx-2">/</span>
          <Link to={`${basePath}/blog`} className="hover:text-blue-600 transition-colors">
            {t.blog?.title ?? 'Blog'}
          </Link>
          {article && (
            <>
              <span className="mx-2">/</span>
              <span className="text-slate-700">{article.title}</span>
            </>
          )}
        </nav>

        {loading && (
          <div className="text-sm text-slate-500">Loading...</div>
        )}

        {!loading && notFound && (
          <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
            <p className="text-slate-600">Article not found.</p>
            <Link
              to={`${basePath}/blog`}
              className="mt-4 inline-block text-blue-600 hover:text-blue-700"
            >
              ← {t.blog?.backToList ?? 'Back to blog'}
            </Link>
          </div>
        )}

        {!loading && article && (
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl leading-tight">
                {article.title}
              </h1>
              {article.publishedAt && (
                <p className="mt-3 text-sm text-slate-500">
                  {t.blog?.publishedOn ?? 'Published on'} {formatDate(article.publishedAt)}
                </p>
              )}
            </header>

            <div
              className="prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-a:text-blue-600 hover:prose-a:text-blue-700"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            <footer className="mt-10 border-t border-slate-200 pt-6">
              <Link
                to={`${basePath}/blog`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                ← {t.blog?.backToList ?? 'Back to blog'}
              </Link>

              <div className="mt-6 rounded-xl bg-blue-50 px-6 pt-6 pb-8">
                <p className="text-base font-medium text-slate-900">
                  {t.blog?.ctaTitle ?? 'Need a transfer from Gdansk Airport?'}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  {t.blog?.ctaBody ?? 'Book online with fixed prices and 24/7 service.'}
                </p>
                <div className="pt-6">
                  <Link
                    to={getRoutePath(locale, 'orderAirportGdansk')}
                    className="inline-block rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white hover:bg-blue-700 transition-colors"
                  >
                    {t.blog?.ctaButton ?? 'Book a TAXI'}
                  </Link>
                </div>
              </div>
            </footer>
          </article>
        )}
      </main>
      <FloatingActions />
    </div>
  );
}
