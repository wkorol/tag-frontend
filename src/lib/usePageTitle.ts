import { useEffect } from 'react';

const BRAND_TITLE = 'Taxi Airport Gdańsk';

export function usePageTitle(title?: string | null) {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    const trimmed = (title ?? '').trim();
    document.title = trimmed ? `${trimmed} | ${BRAND_TITLE}` : BRAND_TITLE;
  }, [title]);
}
