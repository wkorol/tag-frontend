import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getApiBaseUrl } from '../lib/api';
import { usePageTitle } from '../lib/usePageTitle';

type Article = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  content: string;
  metaDescription: string;
  published: boolean;
  ogImageUrl: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ArticleForm = {
  slug: string;
  locale: string;
  title: string;
  content: string;
  metaDescription: string;
  published: boolean;
  ogImageUrl: string;
};

const emptyForm: ArticleForm = {
  slug: '',
  locale: 'en',
  title: '',
  content: '',
  metaDescription: '',
  published: false,
  ogImageUrl: '',
};

export function AdminBlogPage() {
  usePageTitle('Admin Blog');
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const apiBaseUrl = getApiBaseUrl();

  const fetchArticles = () => {
    if (!token) {
      setError('Missing admin token.');
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${apiBaseUrl}/api/admin/blog/articles?token=${encodeURIComponent(token)}`)
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) throw new Error(data?.error ?? 'Failed to load articles.');
        return data;
      })
      .then((data) => {
        setArticles(data?.articles ?? []);
        setError(null);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchArticles();
  }, [token]);

  const openCreate = () => {
    setEditingId('new');
    setForm(emptyForm);
    setMessage(null);
  };

  const openEdit = (article: Article) => {
    setEditingId(article.id);
    setForm({
      slug: article.slug,
      locale: article.locale,
      title: article.title,
      content: article.content,
      metaDescription: article.metaDescription,
      published: article.published,
      ogImageUrl: article.ogImageUrl ?? '',
    });
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const isNew = editingId === 'new';
      const url = isNew
        ? `${apiBaseUrl}/api/admin/blog/articles?token=${encodeURIComponent(token)}`
        : `${apiBaseUrl}/api/admin/blog/articles/${editingId}?token=${encodeURIComponent(token)}`;
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: form.slug,
          locale: form.locale,
          title: form.title,
          content: form.content,
          metaDescription: form.metaDescription,
          published: form.published,
          ogImageUrl: form.ogImageUrl || null,
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error ?? 'Failed to save article.');
      setMessage(isNew ? 'Article created.' : 'Article updated.');
      setEditingId(null);
      setForm(emptyForm);
      fetchArticles();
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/admin/blog/articles/${id}?token=${encodeURIComponent(token)}`,
        { method: 'DELETE' },
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? 'Failed to delete article.');
      }
      fetchArticles();
    } catch (err) {
      setMessage((err as Error).message);
    }
  };

  const updateField = <K extends keyof ArticleForm>(key: K, value: ArticleForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-slate-900">Admin Blog</h1>
            <p className="text-sm text-slate-600">Manage blog articles.</p>
          </div>
          {!editingId && (
            <button
              onClick={openCreate}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              New Article
            </button>
          )}
        </div>

        {message && (
          <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
            {message}
          </div>
        )}

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading articles...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">{error}</div>
        )}

        {editingId && (
          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-medium text-slate-900">
              {editingId === 'new' ? 'Create Article' : 'Edit Article'}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Slug</label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) => updateField('slug', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="my-article-slug"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Locale</label>
                  <select
                    value={form.locale}
                    onChange={(e) => updateField('locale', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="en">en</option>
                    <option value="pl">pl</option>
                    <option value="de">de</option>
                    <option value="fi">fi</option>
                    <option value="no">no</option>
                    <option value="sv">sv</option>
                    <option value="da">da</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Meta Description
                </label>
                <input
                  type="text"
                  value={form.metaDescription}
                  onChange={(e) => updateField('metaDescription', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  OG Image URL
                </label>
                <input
                  type="text"
                  value={form.ogImageUrl}
                  onChange={(e) => updateField('ogImageUrl', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Content (HTML)
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => updateField('content', e.target.value)}
                  rows={16}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => updateField('published', e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300"
                />
                <label htmlFor="published" className="text-sm text-slate-700">
                  Published
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={cancelEdit}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !editingId && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="grid grid-cols-12 gap-4 border-b border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <div className="col-span-4">Title</div>
              <div className="col-span-1">Locale</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>
            {articles.length === 0 && (
              <div className="px-6 py-8 text-sm text-slate-500">No articles found.</div>
            )}
            {articles.map((article) => (
              <div
                key={article.id}
                className="grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-700"
              >
                <div className="col-span-4">
                  <div className="font-medium text-slate-900">{article.title}</div>
                  <div className="text-xs text-slate-500">{article.slug}</div>
                </div>
                <div className="col-span-1">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {article.locale}
                  </span>
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                      article.published
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="col-span-2 text-xs text-slate-500">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString()
                    : new Date(article.createdAt).toLocaleDateString()}
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button
                    onClick={() => openEdit(article)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
