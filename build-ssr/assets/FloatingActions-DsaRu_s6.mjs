import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { u as useI18n, l as localeToPath, t as trackCtaClick, r as requestScrollTo, w as trackContactClick } from '../entry-server.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'lucide-react';

function FloatingActions({ orderTargetId = "vehicle-selection", hide = false }) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;
  const callLink = "tel:+48694347548";
  const iMessageLink = "sms:+48537523437";
  const [cookieBannerOffset, setCookieBannerOffset] = useState(0);
  const [isCookieBannerVisible, setIsCookieBannerVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTargetVisible, setIsTargetVisible] = useState(false);
  const [isOrderMenuOpen, setIsOrderMenuOpen] = useState(false);
  const desktopMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    let resizeObserver = null;
    const updateOffset = () => {
      const banner = document.querySelector("[data-cookie-banner]");
      if (!banner) {
        setCookieBannerOffset(0);
        setIsCookieBannerVisible(false);
        if (resizeObserver) {
          resizeObserver.disconnect();
          resizeObserver = null;
        }
        return;
      }
      setIsCookieBannerVisible(true);
      const height = banner.getBoundingClientRect().height;
      setCookieBannerOffset(Math.ceil(height) + 12);
      if (!resizeObserver && "ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(() => {
          const nextHeight = banner.getBoundingClientRect().height;
          setCookieBannerOffset(Math.ceil(nextHeight) + 12);
        });
        resizeObserver.observe(banner);
      }
    };
    updateOffset();
    const observer = new MutationObserver(updateOffset);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      observer.disconnect();
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    if (!isOrderMenuOpen || typeof window === "undefined") {
      return;
    }
    const closeOnOutsideClick = (event) => {
      const target = event.target;
      if (!target) {
        return;
      }
      const clickedInsideDesktop = desktopMenuRef.current?.contains(target) ?? false;
      const clickedInsideMobile = mobileMenuRef.current?.contains(target) ?? false;
      if (!clickedInsideDesktop && !clickedInsideMobile) {
        setIsOrderMenuOpen(false);
      }
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOrderMenuOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOrderMenuOpen]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      return;
    }
    let observer = null;
    const observed = /* @__PURE__ */ new Set();
    const connect = () => {
      const targets = [
        document.getElementById(orderTargetId),
        document.getElementById("pricing-booking")
      ].filter(Boolean);
      if (targets.length === 0) {
        setIsTargetVisible(false);
        return;
      }
      if (!observer) {
        observer = new IntersectionObserver(
          (entries) => {
            setIsTargetVisible(entries.some((entry) => entry.isIntersecting));
          },
          {
            root: null,
            threshold: 0.2
          }
        );
      }
      targets.forEach((target) => {
        if (!observed.has(target)) {
          observer.observe(target);
          observed.add(target);
        }
      });
    };
    connect();
    const mutationObserver = new MutationObserver(connect);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutationObserver.disconnect();
      if (observer) {
        observer.disconnect();
      }
    };
  }, [orderTargetId]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const doc = document.documentElement;
    let pageHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
    let rafId = null;
    const updateVisibility = () => {
      const topVisible = window.scrollY <= 120;
      const bottomVisible = window.innerHeight + window.scrollY >= pageHeight - 120;
      setIsVisible(!topVisible && !bottomVisible);
      rafId = null;
    };
    const requestUpdate = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(updateVisibility);
    };
    const refreshPageHeight = () => {
      pageHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
      requestUpdate();
    };
    const mutationObserver = new MutationObserver(refreshPageHeight);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    updateVisibility();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", refreshPageHeight);
    return () => {
      mutationObserver.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", refreshPageHeight);
    };
  }, []);
  const shouldHideActions = hide || !isVisible || isCookieBannerVisible || isTargetVisible;
  useEffect(() => {
    if (shouldHideActions && isOrderMenuOpen) {
      setIsOrderMenuOpen(false);
    }
  }, [shouldHideActions, isOrderMenuOpen]);
  if (shouldHideActions) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed right-6 bottom-6 z-50 hidden sm:block",
        style: { bottom: cookieBannerOffset + 24 },
        children: /* @__PURE__ */ jsxs("div", { ref: desktopMenuRef, className: "flex flex-col items-end gap-2", children: [
          isOrderMenuOpen ? /* @__PURE__ */ jsxs("div", { id: "floating-order-menu-desktop", className: "mb-2 flex w-64 flex-col gap-2 animate-slideDown", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `${basePath}/`,
                onClick: (event) => {
                  event.preventDefault();
                  setIsOrderMenuOpen(false);
                  trackCtaClick("floating_order_online");
                  const scrolled = requestScrollTo(orderTargetId);
                  if (!scrolled) {
                    window.location.href = `${basePath}/`;
                  }
                },
                className: "rounded-full px-5 py-3 text-white shadow-lg text-center",
                style: { backgroundColor: "#c2410c" },
                children: t.common.orderOnlineNow
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: whatsappLink,
                onClick: () => {
                  setIsOrderMenuOpen(false);
                  trackContactClick("whatsapp");
                },
                className: "rounded-full px-5 py-3 text-gray-900 shadow-lg flex items-center justify-center gap-2",
                style: { backgroundColor: "#25D366" },
                children: t.common.whatsapp
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: callLink,
                onClick: () => {
                  setIsOrderMenuOpen(false);
                  trackContactClick("call");
                },
                className: "rounded-full px-5 py-3 text-gray-900 shadow-lg flex items-center justify-center gap-2",
                style: { backgroundColor: "#fbbf24" },
                "aria-label": "Call +48 694 347 548",
                children: [
                  /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "📞" }),
                  /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1.5 leading-none", children: [
                    /* @__PURE__ */ jsx("span", { children: t.common.callNow }),
                    /* @__PURE__ */ jsx("span", { className: "call-lang-badge", children: "EN/PL" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: iMessageLink,
                onClick: () => {
                  setIsOrderMenuOpen(false);
                  trackContactClick("imessage");
                },
                className: "rounded-full px-5 py-3 text-white shadow-lg flex items-center justify-center gap-2",
                style: { backgroundColor: "#2563eb" },
                "aria-label": "iMessage +48 537 523 437",
                children: [
                  /* @__PURE__ */ jsx("svg", { viewBox: "0 0 384 512", "aria-hidden": "true", className: "h-6 w-6", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx("path", { d: "M318.7 268.7c-.2-36.7 30-54.3 31.3-55.1-17.1-25-43.7-28.4-53.1-28.8-22.6-2.3-44.1 13.3-55.6 13.3-11.5 0-29.3-13-48.2-12.7-24.8.4-47.6 14.4-60.4 36.7-25.8 44.7-6.6 110.8 18.5 147 12.3 17.6 26.9 37.4 46.1 36.7 18.5-.7 25.5-12 47.8-12 22.3 0 28.6 12 47.9 11.6 19.8-.4 32.3-17.9 44.5-35.6 14.1-20.6 19.9-40.5 20.1-41.5-.4-.2-38.5-14.8-38.7-58.6zm-37.7-108.4c10.2-12.4 17.1-29.7 15.2-46.9-14.7.6-32.5 9.8-43 22.2-9.5 11-17.8 28.6-15.6 45.4 16.4 1.3 33.2-8.3 43.4-20.7z" }) }),
                  "iMessage"
                ]
              }
            )
          ] }) : null,
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                trackCtaClick("floating_order_now_toggle");
                setIsOrderMenuOpen((prev) => !prev);
              },
              className: "relative inline-flex h-28 w-28 shrink-0 flex-col items-center justify-center overflow-hidden rounded-full text-white shadow-xl ring-4 ring-white/35 animate-order-now-pulse cursor-pointer transition-[filter] duration-200 hover:brightness-110",
              style: { backgroundColor: "#c2410c" },
              "aria-expanded": isOrderMenuOpen,
              "aria-controls": "floating-order-menu-desktop",
              "aria-label": t.common.orderNow,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_58%)]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "relative max-w-[86px] px-4 text-center text-[11px] font-semibold leading-tight tracking-tight", children: t.common.orderNow }),
                /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", "aria-hidden": "true", className: "relative mt-0.5 h-4 w-4", children: isOrderMenuOpen ? /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M14.7 12.7a1 1 0 01-1.4 0L10 9.42l-3.3 3.3a1 1 0 01-1.4-1.42l4-4a1 1 0 011.4 0l4 4a1 1 0 010 1.42z" }) : /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M5.3 7.3a1 1 0 011.4 0L10 10.58l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.42z" }) })
              ]
            }
          )
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "fixed left-0 right-0 z-50 sm:hidden border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur",
        style: { bottom: cookieBannerOffset },
        children: /* @__PURE__ */ jsxs("div", { ref: mobileMenuRef, className: "flex flex-col gap-2", children: [
          isOrderMenuOpen ? /* @__PURE__ */ jsxs("div", { id: "floating-order-menu-mobile", className: "grid gap-2 animate-slideDown", children: [
            /* @__PURE__ */ jsx(
              "a",
              {
                href: `${basePath}/`,
                onClick: (event) => {
                  event.preventDefault();
                  setIsOrderMenuOpen(false);
                  trackCtaClick("sticky_order_online");
                  const scrolled = requestScrollTo(orderTargetId);
                  if (!scrolled) {
                    window.location.href = `${basePath}/`;
                  }
                },
                className: "rounded-full px-4 py-3 text-center text-white shadow-sm",
                style: { backgroundColor: "#c2410c" },
                children: t.common.orderOnlineNow
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-2", children: [
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: whatsappLink,
                  onClick: () => {
                    setIsOrderMenuOpen(false);
                    trackContactClick("whatsapp");
                  },
                  className: "rounded-full px-4 py-3 text-center text-gray-900 shadow-sm flex items-center justify-center gap-2",
                  style: { backgroundColor: "#25D366" },
                  children: [
                    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 32 32", "aria-hidden": "true", className: "h-5 w-5 fill-current", children: [
                      /* @__PURE__ */ jsx("path", { d: "M19.11 17.72c-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.79-1.92-.21-.5-.43-.43-.58-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.81 2.76 4.4 3.87.62.27 1.1.43 1.48.55.62.2 1.18.17 1.63.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.17-.5-.3z" }),
                      /* @__PURE__ */ jsx("path", { d: "M26.67 5.33A14.9 14.9 0 0016.03 1.5C8.12 1.5 1.5 8.13 1.5 16.03c0 2.4.63 4.76 1.83 6.85L1.5 30.5l7.81-1.79a14.93 14.93 0 006.72 1.61h.01c7.9 0 14.53-6.63 14.53-14.53 0-3.88-1.52-7.53-4.4-10.46zm-10.64 22.3h-.01a12.4 12.4 0 01-6.32-1.73l-.45-.27-4.64 1.06 1.24-4.52-.3-.46a12.45 12.45 0 01-2-6.68c0-6.86 5.58-12.44 12.45-12.44 3.32 0 6.43 1.3 8.77 3.65a12.33 12.33 0 013.64 8.79c0 6.86-5.59 12.44-12.38 12.44z" })
                    ] }),
                    t.common.whatsapp
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: callLink,
                  onClick: () => {
                    setIsOrderMenuOpen(false);
                    trackContactClick("call");
                  },
                  className: "rounded-full px-4 py-3 text-center text-gray-900 shadow-sm flex items-center justify-center gap-2",
                  style: { backgroundColor: "#fbbf24" },
                  "aria-label": "Call +48 694 347 548",
                  children: [
                    /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "📞" }),
                    /* @__PURE__ */ jsxs("span", { className: "inline-flex items-center gap-1 leading-none", children: [
                      /* @__PURE__ */ jsx("span", { children: t.common.callNow }),
                      /* @__PURE__ */ jsx("span", { className: "call-lang-badge", children: "EN/PL" })
                    ] })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "a",
                {
                  href: iMessageLink,
                  onClick: () => {
                    setIsOrderMenuOpen(false);
                    trackContactClick("imessage");
                  },
                  className: "rounded-full px-4 py-3 text-center text-white shadow-sm flex items-center justify-center gap-2",
                  style: { backgroundColor: "#2563eb" },
                  "aria-label": "iMessage +48 537 523 437",
                  children: [
                    /* @__PURE__ */ jsx("svg", { viewBox: "0 0 384 512", "aria-hidden": "true", className: "h-6 w-6", style: { fill: "#ffffff" }, children: /* @__PURE__ */ jsx("path", { d: "M318.7 268.7c-.2-36.7 30-54.3 31.3-55.1-17.1-25-43.7-28.4-53.1-28.8-22.6-2.3-44.1 13.3-55.6 13.3-11.5 0-29.3-13-48.2-12.7-24.8.4-47.6 14.4-60.4 36.7-25.8 44.7-6.6 110.8 18.5 147 12.3 17.6 26.9 37.4 46.1 36.7 18.5-.7 25.5-12 47.8-12 22.3 0 28.6 12 47.9 11.6 19.8-.4 32.3-17.9 44.5-35.6 14.1-20.6 19.9-40.5 20.1-41.5-.4-.2-38.5-14.8-38.7-58.6zm-37.7-108.4c10.2-12.4 17.1-29.7 15.2-46.9-14.7.6-32.5 9.8-43 22.2-9.5 11-17.8 28.6-15.6 45.4 16.4 1.3 33.2-8.3 43.4-20.7z" }) }),
                    "iMessage"
                  ]
                }
              )
            ] })
          ] }) : null,
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => {
                trackCtaClick("sticky_order_now_toggle");
                setIsOrderMenuOpen((prev) => !prev);
              },
              className: "relative mx-auto inline-flex h-24 w-24 shrink-0 flex-col items-center justify-center overflow-hidden rounded-full text-white shadow-xl ring-4 ring-white/35 animate-order-now-pulse cursor-pointer transition-[filter] duration-200 hover:brightness-110",
              style: { backgroundColor: "#c2410c" },
              "aria-expanded": isOrderMenuOpen,
              "aria-controls": "floating-order-menu-mobile",
              "aria-label": t.common.orderNow,
              children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    "aria-hidden": "true",
                    className: "pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_58%)]"
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "relative max-w-[70px] px-3 text-center text-[10px] font-semibold leading-tight tracking-tight", children: t.common.orderNow }),
                /* @__PURE__ */ jsx("svg", { viewBox: "0 0 20 20", "aria-hidden": "true", className: "relative mt-0.5 h-4 w-4", children: isOrderMenuOpen ? /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M14.7 12.7a1 1 0 01-1.4 0L10 9.42l-3.3 3.3a1 1 0 01-1.4-1.42l4-4a1 1 0 011.4 0l4 4a1 1 0 010 1.42z" }) : /* @__PURE__ */ jsx("path", { fill: "currentColor", d: "M5.3 7.3a1 1 0 011.4 0L10 10.58l3.3-3.3a1 1 0 111.4 1.42l-4 4a1 1 0 01-1.4 0l-4-4a1 1 0 010-1.42z" }) })
              ]
            }
          )
        ] })
      }
    )
  ] });
}

export { FloatingActions };
