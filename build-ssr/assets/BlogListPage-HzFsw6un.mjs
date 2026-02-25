import { jsxs, jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { N as Navbar } from "./Navbar-BJLcl6ZC.mjs";
import { u as useI18n, D as useSSRData, c as usePageTitle, l as localeToPath, F as FloatingActions } from "../entry-server.mjs";
import { g as getApiBaseUrl } from "./api-Ck-Mugua.mjs";
import "react-dom/server";
import "react-router-dom/server.js";
import "lucide-react";
function BlogListPage() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const ssrData = useSSRData();
  const [articles, setArticles] = useState((_a = ssrData == null ? void 0 : ssrData.blogArticles) != null ? _a : []);
  const [loading, setLoading] = useState(!(ssrData == null ? void 0 : ssrData.blogArticles));
  usePageTitle((_c = (_b = t.blog) == null ? void 0 : _b.title) != null ? _c : "Blog");
  useEffect(() => {
    if (ssrData == null ? void 0 : ssrData.blogArticles) return;
    const apiBaseUrl = getApiBaseUrl();
    fetch(`${apiBaseUrl}/api/blog/articles?locale=${encodeURIComponent(locale)}`).then((res) => res.json()).then((data) => {
      var _a2;
      setArticles((_a2 = data == null ? void 0 : data.articles) != null ? _a2 : []);
    }).catch(() => {
    }).finally(() => setLoading(false));
  }, [locale, ssrData]);
  const formatDate = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    } catch {
      return iso.slice(0, 10);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-4xl px-4 py-12", children: [
      /* @__PURE__ */ jsxs("div", { className: "mb-10", children: [
        /* @__PURE__ */ jsx("h1", { className: "text-3xl font-bold text-slate-900 sm:text-4xl", children: (_e = (_d = t.blog) == null ? void 0 : _d.title) != null ? _e : "Blog" }),
        /* @__PURE__ */ jsx("p", { className: "mt-2 text-lg text-slate-600", children: (_g = (_f = t.blog) == null ? void 0 : _f.subtitle) != null ? _g : "Travel tips and airport guides" })
      ] }),
      loading && /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-500", children: "Loading..." }),
      !loading && articles.length === 0 && /* @__PURE__ */ jsx("div", { className: "rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500", children: (_i = (_h = t.blog) == null ? void 0 : _h.noArticles) != null ? _i : "No articles yet." }),
      /* @__PURE__ */ jsx("div", { className: "grid gap-6 sm:grid-cols-2", children: articles.map((article) => {
        var _a2, _b2;
        return /* @__PURE__ */ jsxs(
          Link,
          {
            to: `${basePath}/blog/${article.slug}`,
            className: "group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
            children: [
              /* @__PURE__ */ jsx("h2", { className: "text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors", children: article.title }),
              /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600 line-clamp-3", children: article.metaDescription }),
              /* @__PURE__ */ jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-xs text-slate-400", children: article.publishedAt ? formatDate(article.publishedAt) : "" }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm font-medium text-blue-600 group-hover:text-blue-700", children: [
                  (_b2 = (_a2 = t.blog) == null ? void 0 : _a2.readMore) != null ? _b2 : "Read more",
                  " →"
                ] })
              ] })
            ]
          },
          article.slug
        );
      }) })
    ] }),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}
export {
  BlogListPage
};
