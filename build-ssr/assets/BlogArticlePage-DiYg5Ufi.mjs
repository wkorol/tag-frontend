import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { N as Navbar } from "./Navbar-BJLcl6ZC.mjs";
import { u as useI18n, D as useSSRData, c as usePageTitle, l as localeToPath, F as FloatingActions } from "../entry-server.mjs";
import { g as getApiBaseUrl } from "./api-Ck-Mugua.mjs";
import "react-dom/server";
import "react-router-dom/server.js";
import "lucide-react";
function BlogArticlePage() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p;
  const { slug } = useParams();
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const ssrData = useSSRData();
  const ssrArticle = ((_a = ssrData == null ? void 0 : ssrData.blogArticle) == null ? void 0 : _a.slug) === slug ? ssrData.blogArticle : null;
  const [article, setArticle] = useState(ssrArticle);
  const [loading, setLoading] = useState(!ssrArticle);
  const [notFound, setNotFound] = useState(false);
  usePageTitle((_b = article == null ? void 0 : article.title) != null ? _b : "Blog");
  useEffect(() => {
    if (ssrArticle) return;
    if (!slug) return;
    const apiBaseUrl = getApiBaseUrl();
    fetch(`${apiBaseUrl}/api/blog/articles/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`).then(async (res) => {
      var _a2;
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setArticle((_a2 = data == null ? void 0 : data.article) != null ? _a2 : null);
      if (!(data == null ? void 0 : data.article)) setNotFound(true);
    }).catch(() => setNotFound(true)).finally(() => setLoading(false));
  }, [slug, locale, ssrArticle]);
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
    /* @__PURE__ */ jsxs("main", { className: "mx-auto max-w-3xl px-4 py-12", children: [
      /* @__PURE__ */ jsxs("nav", { className: "mb-6 text-sm text-slate-500", children: [
        /* @__PURE__ */ jsx(Link, { to: `${basePath}/`, className: "hover:text-blue-600 transition-colors", children: t.navbar.home }),
        /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
        /* @__PURE__ */ jsx(Link, { to: `${basePath}/blog`, className: "hover:text-blue-600 transition-colors", children: (_d = (_c = t.blog) == null ? void 0 : _c.title) != null ? _d : "Blog" }),
        article && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "mx-2", children: "/" }),
          /* @__PURE__ */ jsx("span", { className: "text-slate-700", children: article.title })
        ] })
      ] }),
      loading && /* @__PURE__ */ jsx("div", { className: "text-sm text-slate-500", children: "Loading..." }),
      !loading && notFound && /* @__PURE__ */ jsxs("div", { className: "rounded-xl border border-slate-200 bg-white p-8 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-slate-600", children: "Article not found." }),
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: `${basePath}/blog`,
            className: "mt-4 inline-block text-blue-600 hover:text-blue-700",
            children: [
              "← ",
              (_f = (_e = t.blog) == null ? void 0 : _e.backToList) != null ? _f : "Back to blog"
            ]
          }
        )
      ] }),
      !loading && article && /* @__PURE__ */ jsxs("article", { className: "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10", children: [
        /* @__PURE__ */ jsxs("header", { className: "mb-8", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold text-slate-900 sm:text-3xl leading-tight", children: article.title }),
          article.publishedAt && /* @__PURE__ */ jsxs("p", { className: "mt-3 text-sm text-slate-500", children: [
            (_h = (_g = t.blog) == null ? void 0 : _g.publishedOn) != null ? _h : "Published on",
            " ",
            formatDate(article.publishedAt)
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "prose prose-slate max-w-none prose-headings:font-semibold prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-lg prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-a:text-blue-600 hover:prose-a:text-blue-700",
            dangerouslySetInnerHTML: { __html: article.content }
          }
        ),
        /* @__PURE__ */ jsxs("footer", { className: "mt-10 border-t border-slate-200 pt-6", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: `${basePath}/blog`,
              className: "text-sm font-medium text-blue-600 hover:text-blue-700",
              children: [
                "← ",
                (_j = (_i = t.blog) == null ? void 0 : _i.backToList) != null ? _j : "Back to blog"
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "mt-6 rounded-xl bg-blue-50 px-6 pt-6 pb-8", children: [
            /* @__PURE__ */ jsx("p", { className: "text-base font-medium text-slate-900", children: (_l = (_k = t.blog) == null ? void 0 : _k.ctaTitle) != null ? _l : "Need a transfer from Gdansk Airport?" }),
            /* @__PURE__ */ jsx("p", { className: "mt-2 text-sm text-slate-600", children: (_n = (_m = t.blog) == null ? void 0 : _m.ctaBody) != null ? _n : "Book online with fixed prices and 24/7 service." }),
            /* @__PURE__ */ jsx(
              Link,
              {
                to: `${basePath}/`,
                className: "mt-8 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors",
                children: (_p = (_o = t.blog) == null ? void 0 : _o.ctaButton) != null ? _p : "Book a TAXI"
              }
            )
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}
export {
  BlogArticlePage
};
