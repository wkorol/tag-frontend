import { useEffect, useState } from 'react';

const STORAGE_KEY = 'cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = window.localStorage.getItem(STORAGE_KEY);
    if (existing !== 'accepted') {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    window.localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 z-50 px-4">
      <div className="mx-auto max-w-4xl rounded-2xl bg-gray-900 text-white shadow-xl border border-white/10 p-5 sm:flex sm:items-center sm:justify-between gap-4">
        <div className="text-sm">
          <p className="font-semibold">We use essential cookies</p>
          <p className="text-gray-300">
            We only use necessary cookies to keep the site secure and make booking work.
          </p>
        </div>
        <div className="mt-4 flex items-center gap-3 sm:mt-0">
          <a
            href="/cookies"
            className="text-sm text-gray-200 hover:text-white underline"
          >
            Learn more
          </a>
          <button
            type="button"
            onClick={accept}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
