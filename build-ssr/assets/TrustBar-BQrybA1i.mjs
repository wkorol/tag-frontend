import { jsx, jsxs } from 'react/jsx-runtime';
import { CheckCircle2 } from 'lucide-react';
import { u as useI18n } from '../entry-server.mjs';

function TrustBar({ className }) {
  const { t } = useI18n();
  const items = [
    t.trustBar.instantConfirmation,
    t.trustBar.meetGreetOptional,
    t.trustBar.noPrepayment,
    t.trustBar.supportWhatsappEmail,
    t.trustBar.vatInvoice
  ];
  return /* @__PURE__ */ jsx("div", { className, children: /* @__PURE__ */ jsx("ul", { className: "trust-bar", "aria-label": t.trustBar.ariaLabel, children: items.map((label) => /* @__PURE__ */ jsxs("li", { className: "trust-bar__item", children: [
    /* @__PURE__ */ jsx(CheckCircle2, { className: "trust-bar__icon", "aria-hidden": "true" }),
    /* @__PURE__ */ jsx("span", { className: "trust-bar__text", children: label })
  ] }, label)) }) });
}

export { TrustBar as T };
