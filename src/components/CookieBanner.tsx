import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getConsentStatus, setConsentStatus, updateGtagConsent } from '../lib/consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    try {
      const existing = getConsentStatus();
      if (existing) {
        updateGtagConsent(existing);
        setVisible(existing !== 'accepted');
        return;
      }
      setVisible(true);
    } catch {
      setVisible(true);
    }
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
        className="mx-auto max-w-3xl rounded-3xl text-white border border-slate-800 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
        style={{ backgroundColor: '#0b0f1a' }}
      >
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <p className="text-base font-semibold tracking-wide">Cookie settings</p>
            <p className="text-sm text-slate-200 leading-relaxed">
              We use essential cookies to keep the booking process secure and reliable. With your
              permission, we also use marketing cookies to measure ad conversions and improve how we
              communicate offers. You can update your choice at any time by clearing your browser
              storage.
            </p>
            <a
              href="/cookies"
              className="inline-block text-sm text-slate-300 hover:text-white underline"
            >
              Read the policy
            </a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={reject}
              className="border border-white/25 text-white text-base font-semibold px-7 py-3 rounded-full hover:border-white/60 transition"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={accept}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 text-base font-semibold px-8 py-3 rounded-full shadow-lg shadow-amber-400/35 transition"
            >
              Accept cookies
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
