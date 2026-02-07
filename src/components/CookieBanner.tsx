import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getConsentStatus, setConsentStatus, updateGtagConsent } from '../lib/consent';
import { useI18n } from '../lib/i18n';
import { getRoutePath } from '../lib/routes';

export function CookieBanner() {
  const { t, locale } = useI18n();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    let cleaned = false;

    const cleanup = () => {
      if (cleaned) {
        return;
      }
      cleaned = true;
      window.removeEventListener('pointerdown', reveal);
      window.removeEventListener('keydown', reveal);
      window.removeEventListener('touchstart', reveal);
      if (timer) {
        window.clearTimeout(timer);
      }
    };

    const reveal = () => {
      cleanup();
      setVisible(true);
    };

    try {
      const existing = getConsentStatus();
      if (existing) {
        updateGtagConsent(existing);
        setVisible(existing !== 'accepted');
        return cleanup;
      }
      window.addEventListener('pointerdown', reveal, { once: true, passive: true });
      window.addEventListener('keydown', reveal, { once: true });
      window.addEventListener('touchstart', reveal, { once: true, passive: true });
      timer = window.setTimeout(reveal, 12000);
    } catch {
      reveal();
    }

    return cleanup;
  }, []);

  const accept = () => {
    setConsentStatus('accepted');
    updateGtagConsent('accepted');
    setVisible(false);
  };

  const reject = () => {
    setConsentStatus('rejected');
    updateGtagConsent('rejected');
    setVisible(false);
  };

  if (!visible || !mounted) {
    return null;
  }

  return createPortal(
    <div
      className="px-4"
      style={{ position: 'fixed', left: 0, right: 0, bottom: 16, zIndex: 2147483647 }}
      data-cookie-banner
      aria-live="polite"
    >
      <div
        className="mx-auto max-w-3xl overflow-hidden rounded-3xl text-white border border-slate-800 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        style={{ backgroundColor: '#0b0f1a' }}
      >
        <div className="p-6 sm:p-7">
          <div className="space-y-2">
            <p className="text-base font-semibold tracking-wide">{t.cookieBanner.title}</p>
            <p className="text-sm text-slate-200 leading-relaxed">
              {t.cookieBanner.body}
            </p>
            <a
              href={getRoutePath(locale, 'cookies')}
              className="inline-block text-sm text-slate-300 hover:text-white underline"
            >
              {t.cookieBanner.readPolicy}
            </a>
          </div>
        </div>
        <div className="border-t border-white/10 bg-slate-900/60 px-6 py-4 sm:px-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={reject}
              className="w-full sm:w-auto border border-white/25 text-white text-base font-semibold px-7 py-3 rounded-full hover:border-white/60 transition"
            >
              {t.cookieBanner.decline}
            </button>
            <button
              type="button"
              onClick={accept}
              className="w-full sm:w-auto bg-amber-400 hover:bg-amber-300 text-slate-900 text-base font-semibold px-8 py-3 rounded-full shadow-lg shadow-amber-400/35 transition"
            >
              {t.cookieBanner.accept}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
