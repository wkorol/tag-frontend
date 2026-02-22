import { jsx, jsxs } from 'react/jsx-runtime';
import { B as Breadcrumbs } from './Breadcrumbs-BLHIqKga.mjs';
import { u as useI18n, w as trackContactClick, c as usePageTitle, l as localeToPath } from '../entry-server.mjs';
import { P as PrivacyPolicy } from './PrivacyPolicy-DzLCkClm.mjs';
import { Footer } from './Footer-BpSYvjMW.mjs';
import { FloatingActions } from './FloatingActions-CZ2NL3hv.mjs';
import { N as Navbar, T as TrustSection } from './TrustSection-XEWoJqKU.mjs';
import 'react';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'lucide-react';
import './TripadvisorWidget-DqBnXr23.mjs';

function CookiePolicy() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("section", { id: "cookie-policy", className: "bg-white border-t border-gray-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 text-gray-700", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-2xl text-gray-900 mb-4", children: t.cookiePolicy.title }),
    /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mb-6", children: t.cookiePolicy.updated }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: t.cookiePolicy.intro }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.cookiePolicy.sectionCookies }),
    /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2 mb-6", children: t.cookiePolicy.cookiesList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.cookiePolicy.sectionManage }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: t.cookiePolicy.manageBody1 }),
    /* @__PURE__ */ jsx("p", { className: "mb-4", children: t.cookiePolicy.manageBody2 }),
    /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.cookiePolicy.contact }),
    /* @__PURE__ */ jsxs("p", { children: [
      t.cookiePolicy.contactBody,
      " ",
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "mailto:booking@taxiairportgdansk.com",
          onClick: () => trackContactClick("email"),
          className: "text-blue-600 hover:text-blue-700 underline",
          children: "booking@taxiairportgdansk.com"
        }
      ),
      "."
    ] })
  ] }) });
}

function CookiesPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  usePageTitle(t.cookiePolicy.title);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 pt-6", children: /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: t.common.home, href: `${basePath}/` },
            { label: t.cookiePolicy.title }
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(CookiePolicy, {}),
      /* @__PURE__ */ jsx(PrivacyPolicy, {})
    ] }),
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

export { CookiesPage };
