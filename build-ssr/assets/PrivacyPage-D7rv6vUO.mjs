import { jsxs, jsx } from "react/jsx-runtime";
import { B as Breadcrumbs } from "./Breadcrumbs-rDtPqfkB.mjs";
import { P as PrivacyPolicy } from "./PrivacyPolicy-H0fYosua.mjs";
import { Footer } from "./Footer-S_X6anZC.mjs";
import { u as useI18n, c as usePageTitle, l as localeToPath, F as FloatingActions } from "../entry-server.mjs";
import { N as Navbar, T as TrustSection } from "./TrustSection-CXktLlh-.mjs";
import "lucide-react";
import "react";
import "react-dom/server";
import "react-router-dom/server.js";
import "react-router-dom";
import "./TripadvisorWidget-CPezc-jA.mjs";
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
export {
  PrivacyPage
};
