import { jsx, jsxs } from "react/jsx-runtime";
import { u as useI18n, w as trackContactClick } from "../entry-server.mjs";
function PrivacyPolicy() {
  const { t } = useI18n();
  const controllerLines = t.privacyPolicy.controllerBody.split("\n");
  return /* @__PURE__ */ jsx("section", { className: "bg-white border-t border-gray-200 py-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto px-4 text-gray-700 space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl text-gray-900 mb-2", children: t.privacyPolicy.title }),
      /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: t.privacyPolicy.updated })
    ] }),
    /* @__PURE__ */ jsx("p", { children: t.privacyPolicy.intro }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.controllerTitle }),
      /* @__PURE__ */ jsxs("p", { children: [
        controllerLines[0],
        /* @__PURE__ */ jsx("br", {}),
        controllerLines[1],
        /* @__PURE__ */ jsx("br", {}),
        controllerLines[2],
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "mailto:booking@taxiairportgdansk.com",
            onClick: () => trackContactClick("email"),
            className: "text-blue-600 hover:text-blue-700 underline",
            children: "booking@taxiairportgdansk.com"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.dataTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.dataList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.whyTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.whyList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.legalTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.legalList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.storageTitle }),
      /* @__PURE__ */ jsx("p", { children: t.privacyPolicy.storageBody })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.shareTitle }),
      /* @__PURE__ */ jsx("p", { children: t.privacyPolicy.shareBody })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.rightsTitle }),
      /* @__PURE__ */ jsx("ul", { className: "list-disc pl-5 space-y-2", children: t.privacyPolicy.rightsList.map((item) => /* @__PURE__ */ jsx("li", { children: item }, item)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h3", { className: "text-lg text-gray-900 mb-2", children: t.privacyPolicy.contactTitle }),
      /* @__PURE__ */ jsxs("p", { children: [
        t.privacyPolicy.contactBody,
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
    ] })
  ] }) });
}
export {
  PrivacyPolicy as P
};
