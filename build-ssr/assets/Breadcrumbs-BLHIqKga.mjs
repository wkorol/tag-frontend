import { jsx, jsxs } from 'react/jsx-runtime';

function Breadcrumbs({ items }) {
  if (!items.length) {
    return null;
  }
  return /* @__PURE__ */ jsx("nav", { "aria-label": "Breadcrumb", className: "text-xs text-gray-500", children: /* @__PURE__ */ jsx("ol", { className: "flex flex-wrap items-center gap-2", children: items.map((item, index) => {
    const isLast = index === items.length - 1;
    return /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-2", children: [
      item.href && !isLast ? /* @__PURE__ */ jsx("a", { href: item.href, className: "text-blue-600 hover:text-blue-700", children: item.label }) : /* @__PURE__ */ jsx("span", { className: "text-gray-700", children: item.label }),
      !isLast && /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "/" })
    ] }, `${item.label}-${index}`);
  }) }) });
}

export { Breadcrumbs as B };
