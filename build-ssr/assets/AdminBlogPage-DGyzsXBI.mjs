import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { g as getApiBaseUrl } from "./api-Ck-Mugua.mjs";
import { c as usePageTitle } from "../entry-server.mjs";
import "react-dom/server";
import "react-router-dom/server.js";
import "lucide-react";
const emptyForm = {
  slug: "",
  locale: "en",
  title: "",
  content: "",
  metaDescription: "",
  published: false,
  ogImageUrl: ""
};
function AdminBlogPage() {
  var _a;
  usePageTitle("Admin Blog");
  const [searchParams] = useSearchParams();
  const token = (_a = searchParams.get("token")) != null ? _a : "";
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const apiBaseUrl = getApiBaseUrl();
  const fetchArticles = () => {
    if (!token) {
      setError("Missing admin token.");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`${apiBaseUrl}/api/admin/blog/articles?token=${encodeURIComponent(token)}`).then(async (res) => {
      var _a2;
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : "Failed to load articles.");
      return data;
    }).then((data) => {
      var _a2;
      setArticles((_a2 = data == null ? void 0 : data.articles) != null ? _a2 : []);
      setError(null);
    }).catch((err) => setError(err.message)).finally(() => setLoading(false));
  };
  useEffect(() => {
    fetchArticles();
  }, [token]);
  const openCreate = () => {
    setEditingId("new");
    setForm(emptyForm);
    setMessage(null);
  };
  const openEdit = (article) => {
    var _a2;
    setEditingId(article.id);
    setForm({
      slug: article.slug,
      locale: article.locale,
      title: article.title,
      content: article.content,
      metaDescription: article.metaDescription,
      published: article.published,
      ogImageUrl: (_a2 = article.ogImageUrl) != null ? _a2 : ""
    });
    setMessage(null);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(null);
  };
  const handleSave = async () => {
    var _a2;
    setSaving(true);
    setMessage(null);
    try {
      const isNew = editingId === "new";
      const url = isNew ? `${apiBaseUrl}/api/admin/blog/articles?token=${encodeURIComponent(token)}` : `${apiBaseUrl}/api/admin/blog/articles/${editingId}?token=${encodeURIComponent(token)}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: form.slug,
          locale: form.locale,
          title: form.title,
          content: form.content,
          metaDescription: form.metaDescription,
          published: form.published,
          ogImageUrl: form.ogImageUrl || null
        })
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : "Failed to save article.");
      setMessage(isNew ? "Article created." : "Article updated.");
      setEditingId(null);
      setForm(emptyForm);
      fetchArticles();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };
  const handleDelete = async (id) => {
    var _a2;
    if (!confirm("Delete this article?")) return;
    try {
      const res = await fetch(
        `${apiBaseUrl}/api/admin/blog/articles/${id}?token=${encodeURIComponent(token)}`,
        { method: "DELETE" }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error((_a2 = data == null ? void 0 : data.error) != null ? _a2 : "Failed to delete article.");
      }
      fetchArticles();
    } catch (err) {
      setMessage(err.message);
    }
  };
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-slate-50 px-4 py-10", children: /* @__PURE__ */ jsxs("div", { className: "mx-auto max-w-5xl", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-6 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-2xl text-slate-900", children: "Admin Blog" }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-slate-600", children: "Manage blog articles." })
      ] }),
      !editingId && /* @__PURE__ */ jsx(
        "button",
        {
          onClick: openCreate,
          className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700",
          children: "New Article"
        }
      )
    ] }),
    message && /* @__PURE__ */ jsx("div", { className: "mb-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800", children: message }),
    loading && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-6 text-slate-600", children: "Loading articles..." }),
    !loading && error && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-red-200 bg-red-50 p-6 text-red-700", children: error }),
    editingId && /* @__PURE__ */ jsxs("div", { className: "mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm", children: [
      /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-medium text-slate-900", children: editingId === "new" ? "Create Article" : "Edit Article" }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-slate-700", children: "Slug" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: form.slug,
                onChange: (e) => updateField("slug", e.target.value),
                className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm",
                placeholder: "my-article-slug"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-slate-700", children: "Locale" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                value: form.locale,
                onChange: (e) => updateField("locale", e.target.value),
                className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm",
                children: [
                  /* @__PURE__ */ jsx("option", { value: "en", children: "en" }),
                  /* @__PURE__ */ jsx("option", { value: "pl", children: "pl" }),
                  /* @__PURE__ */ jsx("option", { value: "de", children: "de" }),
                  /* @__PURE__ */ jsx("option", { value: "fi", children: "fi" }),
                  /* @__PURE__ */ jsx("option", { value: "no", children: "no" }),
                  /* @__PURE__ */ jsx("option", { value: "sv", children: "sv" }),
                  /* @__PURE__ */ jsx("option", { value: "da", children: "da" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-slate-700", children: "Title" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.title,
              onChange: (e) => updateField("title", e.target.value),
              className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-slate-700", children: "Meta Description" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.metaDescription,
              onChange: (e) => updateField("metaDescription", e.target.value),
              className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-slate-700", children: "OG Image URL" }),
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "text",
              value: form.ogImageUrl,
              onChange: (e) => updateField("ogImageUrl", e.target.value),
              className: "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm",
              placeholder: "https://..."
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("label", { className: "mb-1 block text-sm font-medium text-slate-700", children: "Content (HTML)" }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: form.content,
              onChange: (e) => updateField("content", e.target.value),
              rows: 16,
              className: "w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              id: "published",
              checked: form.published,
              onChange: (e) => updateField("published", e.target.checked),
              className: "h-4 w-4 rounded border-slate-300"
            }
          ),
          /* @__PURE__ */ jsx("label", { htmlFor: "published", className: "text-sm text-slate-700", children: "Published" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "flex gap-3", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleSave,
              disabled: saving,
              className: "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50",
              children: saving ? "Saving..." : "Save"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: cancelEdit,
              className: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50",
              children: "Cancel"
            }
          )
        ] })
      ] })
    ] }),
    !loading && !error && !editingId && /* @__PURE__ */ jsxs("div", { className: "overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm", children: [
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-12 gap-4 border-b border-slate-200 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500", children: [
        /* @__PURE__ */ jsx("div", { className: "col-span-4", children: "Title" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-1", children: "Locale" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Status" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-2", children: "Date" }),
        /* @__PURE__ */ jsx("div", { className: "col-span-3 text-right", children: "Actions" })
      ] }),
      articles.length === 0 && /* @__PURE__ */ jsx("div", { className: "px-6 py-8 text-sm text-slate-500", children: "No articles found." }),
      articles.map((article) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "grid grid-cols-12 gap-4 border-b border-slate-100 px-6 py-4 text-sm text-slate-700",
          children: [
            /* @__PURE__ */ jsxs("div", { className: "col-span-4", children: [
              /* @__PURE__ */ jsx("div", { className: "font-medium text-slate-900", children: article.title }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-slate-500", children: article.slug })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "col-span-1", children: /* @__PURE__ */ jsx("span", { className: "inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700", children: article.locale }) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2", children: /* @__PURE__ */ jsx(
              "span",
              {
                className: `inline-flex rounded-full px-3 py-1 text-xs font-medium ${article.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`,
                children: article.published ? "Published" : "Draft"
              }
            ) }),
            /* @__PURE__ */ jsx("div", { className: "col-span-2 text-xs text-slate-500", children: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date(article.createdAt).toLocaleDateString() }),
            /* @__PURE__ */ jsxs("div", { className: "col-span-3 flex justify-end gap-2", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => openEdit(article),
                  className: "text-blue-600 hover:text-blue-700 text-sm",
                  children: "Edit"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => handleDelete(article.id),
                  className: "text-red-600 hover:text-red-700 text-sm",
                  children: "Delete"
                }
              )
            ] })
          ]
        },
        article.id
      ))
    ] })
  ] }) });
}
export {
  AdminBlogPage
};
