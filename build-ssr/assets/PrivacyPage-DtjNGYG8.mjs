import { jsxs, jsx } from 'react/jsx-runtime';
import { B as Breadcrumbs } from './Breadcrumbs-BLHIqKga.mjs';
import { P as PrivacyPolicy } from './PrivacyPolicy-DKpoyPXB.mjs';
import { N as Navbar, T as TrustSection, F as Footer } from './TrustSection-vNKajofe.mjs';
import { u as useI18n, a as usePageTitle, l as localeToPath, F as FloatingActions } from '../entry-server.mjs';
import 'lucide-react';
import 'react';
import 'react-router-dom';
import './TripadvisorWidget-BVBwrnhD.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-dom';

function PrivacyPage() {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  usePageTitle(t.privacyPolicy.title);
  return /* @__PURE__ */ jsxs("div", { className: "min-h-screen bg-gray-50", children: [
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto px-4 pt-6", children: /* @__PURE__ */ jsx(
        Breadcrumbs,
        {
          items: [
            { label: t.common.home, href: `${basePath}/` },
            { label: t.privacyPolicy.title }
          ]
        }
      ) }),
      /* @__PURE__ */ jsx(PrivacyPolicy, {})
    ] }),
    /* @__PURE__ */ jsx(TrustSection, {}),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingActions, {})
  ] });
}

export { PrivacyPage };
