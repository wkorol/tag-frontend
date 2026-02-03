import { jsx, jsxs } from 'react/jsx-runtime';
import { u as useI18n } from '../entry-server.mjs';
import 'react';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'react-dom';
import 'lucide-react';

function TrustSection() {
  const { t } = useI18n();
  return /* @__PURE__ */ jsx("section", { className: "bg-slate-50 border-t border-slate-200 py-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-6xl mx-auto px-4", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-8 md:grid-cols-3", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.companyTitle }),
      /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
        "WK DRIVE",
        /* @__PURE__ */ jsx("br", {}),
        "NIP: 5862330063",
        /* @__PURE__ */ jsx("br", {}),
        "Gdańsk"
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.paymentTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: t.trust.paymentBody })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-gray-900 mb-2", children: t.trust.comfortTitle }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600", children: t.trust.comfortBody })
    ] })
  ] }) }) });
}

export { TrustSection };
