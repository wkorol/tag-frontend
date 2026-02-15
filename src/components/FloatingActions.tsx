import { useEffect, useState } from 'react';
import { localeToPath, useI18n } from '../lib/i18n';
import { requestScrollTo } from '../lib/scroll';
import { trackContactClick, trackCtaClick } from '../lib/tracking';

interface FloatingActionsProps {
  orderTargetId?: string;
  hide?: boolean;
}

export function FloatingActions({ orderTargetId = 'vehicle-selection', hide = false }: FloatingActionsProps) {
  const { t, locale } = useI18n();
  const basePath = localeToPath(locale);
  const whatsappLink = `https://wa.me/48694347548?text=${encodeURIComponent(t.common.whatsappMessage)}`;
  const [cookieBannerOffset, setCookieBannerOffset] = useState(0);
  const [isCookieBannerVisible, setIsCookieBannerVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTargetVisible, setIsTargetVisible] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let resizeObserver: ResizeObserver | null = null;

    const updateOffset = () => {
      const banner = document.querySelector('[data-cookie-banner]') as HTMLElement | null;
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

      if (!resizeObserver && 'ResizeObserver' in window) {
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
    if (typeof window === 'undefined') {
      return;
    }
    if (!('IntersectionObserver' in window)) {
      return;
    }
    let observer: IntersectionObserver | null = null;
    const observed = new Set<Element>();

    const connect = () => {
      const targets = [
        document.getElementById(orderTargetId),
        document.getElementById('pricing-booking'),
      ].filter(Boolean) as Element[];

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
            threshold: 0.2,
          }
        );
      }

      targets.forEach((target) => {
        if (!observed.has(target)) {
          observer!.observe(target);
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
    if (typeof window === 'undefined') {
      return;
    }
    const doc = document.documentElement;
    let pageHeight = Math.max(doc.scrollHeight, document.body.scrollHeight);
    let rafId: number | null = null;

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
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', refreshPageHeight);
    return () => {
      mutationObserver.disconnect();
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', refreshPageHeight);
    };
  }, []);

  if (hide || !isVisible || isCookieBannerVisible || isTargetVisible) {
    return null;
  }

  return (
    <>
      <div
        className="fixed right-6 bottom-6 z-50 hidden sm:flex flex-col gap-3"
        style={{ bottom: cookieBannerOffset + 24 }}
      >
        <a
          href={whatsappLink}
          onClick={() => trackContactClick('whatsapp')}
          className="rounded-full px-5 py-3 text-gray-900 shadow-lg flex items-center justify-center gap-2"
          style={{ backgroundColor: '#25D366' }}
        >
          {t.common.whatsapp}
        </a>
        <a
          href={`${basePath}/`}
          onClick={(event) => {
            event.preventDefault();
            trackCtaClick('floating_order_online');
            const scrolled = requestScrollTo(orderTargetId);
            if (!scrolled) {
              window.location.href = `${basePath}/`;
            }
          }}
          className="rounded-full px-5 py-3 text-white shadow-lg text-center"
          style={{ backgroundColor: '#c2410c' }}
        >
          {t.common.orderOnlineNow}
        </a>
      </div>

      <div
        className="fixed left-0 right-0 z-50 sm:hidden border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur"
        style={{ bottom: cookieBannerOffset }}
      >
        <div className="flex gap-3">
          <a
            href={whatsappLink}
            onClick={() => trackContactClick('whatsapp')}
            className="flex-1 rounded-full px-4 py-3 text-center text-gray-900 shadow-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg viewBox="0 0 32 32" aria-hidden="true" className="h-5 w-5 fill-current">
              <path d="M19.11 17.72c-.26-.13-1.52-.75-1.75-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.09-1.28-.77-.69-1.29-1.54-1.44-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.06-.13-.58-1.4-.79-1.92-.21-.5-.43-.43-.58-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.15s.92 2.49 1.05 2.66c.13.17 1.81 2.76 4.4 3.87.62.27 1.1.43 1.48.55.62.2 1.18.17 1.63.1.5-.07 1.52-.62 1.74-1.22.21-.6.21-1.12.15-1.22-.06-.1-.24-.17-.5-.3z" />
              <path d="M26.67 5.33A14.9 14.9 0 0016.03 1.5C8.12 1.5 1.5 8.13 1.5 16.03c0 2.4.63 4.76 1.83 6.85L1.5 30.5l7.81-1.79a14.93 14.93 0 006.72 1.61h.01c7.9 0 14.53-6.63 14.53-14.53 0-3.88-1.52-7.53-4.4-10.46zm-10.64 22.3h-.01a12.4 12.4 0 01-6.32-1.73l-.45-.27-4.64 1.06 1.24-4.52-.3-.46a12.45 12.45 0 01-2-6.68c0-6.86 5.58-12.44 12.45-12.44 3.32 0 6.43 1.3 8.77 3.65a12.33 12.33 0 013.64 8.79c0 6.86-5.59 12.44-12.38 12.44z" />
            </svg>
            {t.common.whatsapp}
          </a>
          <a
            href={`${basePath}/`}
            onClick={(event) => {
              event.preventDefault();
              trackCtaClick('sticky_order_online');
              const scrolled = requestScrollTo(orderTargetId);
              if (!scrolled) {
                window.location.href = `${basePath}/`;
              }
            }}
            className="flex-1 rounded-full px-4 py-3 text-center text-white shadow-sm"
            style={{ backgroundColor: '#c2410c' }}
          >
            {t.common.orderOnlineNow}
          </a>
        </div>
      </div>
    </>
  );
}
