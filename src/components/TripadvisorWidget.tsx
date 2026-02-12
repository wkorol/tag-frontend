import { useEffect, useMemo, useRef, useState } from 'react';
import { hasMarketingConsent } from '../lib/consent';
import { useI18n } from '../lib/i18n';

const localeToTripadvisorLang: Record<string, string> = {
  en: 'en_US',
  pl: 'pl_PL',
  de: 'de_DE',
  fi: 'fi_FI',
  no: 'nb_NO',
  sv: 'sv_SE',
  da: 'da_DK',
};

type TripadvisorWidgetProps = {
  locationId?: string;
  uniq?: string;
  href?: string;
  requireConsent?: boolean;
  wtype?: string;
  border?: boolean;
  shadow?: boolean;
  backgroundColor?: string;
  ulId?: string;
  ulClassName?: string;
  liId?: string;
  liClassName?: string;
};

export function TripadvisorWidget({
  locationId: locationIdProp,
  uniq: uniqProp,
  href: hrefProp,
  requireConsent = true,
  wtype: wtypeProp,
  border: borderProp,
  shadow: shadowProp,
  backgroundColor: backgroundColorProp,
  ulId: ulIdProp,
  ulClassName: ulClassNameProp,
  liId: liIdProp,
  liClassName: liClassNameProp,
}: TripadvisorWidgetProps) {
  const { locale } = useI18n();
  const [canLoad, setCanLoad] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return requireConsent ? hasMarketingConsent() : true;
  });

  const locationId =
    locationIdProp ||
    (import.meta.env.VITE_TRIPADVISOR_LOCATION_ID as string | undefined) ||
    '34104207';

  const uniq =
    uniqProp ||
    (import.meta.env.VITE_TRIPADVISOR_UNIQ as string | undefined) ||
    '444';

  const href =
    hrefProp ||
    (import.meta.env.VITE_TRIPADVISOR_URL as string | undefined) ||
    'https://www.tripadvisor.com/Attraction_Review-g274725-d34104207-Reviews-Taxi_Airport_Gdansk-Gdansk_Pomerania_Province_Northern_Poland.html';

  const wtype =
    wtypeProp ||
    (import.meta.env.VITE_TRIPADVISOR_WTYPE as string | undefined) ||
    'cdsratingsonlywide';

  const border =
    borderProp ??
    ((import.meta.env.VITE_TRIPADVISOR_BORDER as string | undefined) ?? 'true') === 'true';

  // Only include `shadow` in the querystring when explicitly set (matches TA snippets).
  const shadowEnv = import.meta.env.VITE_TRIPADVISOR_SHADOW as string | undefined;
  const shadow: boolean | null =
    typeof shadowProp === 'boolean'
      ? shadowProp
      : typeof shadowEnv === 'string'
        ? shadowEnv === 'true'
        : null;

  const backgroundColor =
    backgroundColorProp ||
    (import.meta.env.VITE_TRIPADVISOR_BACKGROUND_COLOR as string | undefined) ||
    null;

  const lang = localeToTripadvisorLang[locale] || 'en_US';

  const containerId = useMemo(() => `TA_${wtype}${uniq}`, [uniq, wtype]);
  const ulId = useMemo(() => ulIdProp || `TA_links_${uniq}`, [ulIdProp, uniq]);
  const ulClassName = useMemo(() => ulClassNameProp || 'TA_links', [ulClassNameProp]);
  const liId = useMemo(() => liIdProp || undefined, [liIdProp]);
  const liClassName = useMemo(() => liClassNameProp || undefined, [liClassNameProp]);

  // TripAdvisor modifies the DOM directly. If React owns these nodes, rerenders can
  // revert the widget back to our fallback markup (logo only). So we render empty
  // containers and manage DOM imperatively.
  const markupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!requireConsent) {
      setCanLoad(true);
      return;
    }

    const update = () => setCanLoad(hasMarketingConsent());
    update();

    const onCustom = () => update();
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'cookie-consent') {
        update();
      }
    };

    window.addEventListener('cookie-consent', onCustom as EventListener);
    window.addEventListener('storage', onStorage);

    return () => {
      window.removeEventListener('cookie-consent', onCustom as EventListener);
      window.removeEventListener('storage', onStorage);
    };
  }, [requireConsent]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!canLoad) {
      return;
    }

    if (markupRef.current) {
      const safeLiId = liId ? ` id="${liId}"` : '';
      const safeLiClass = liClassName ? ` class="${liClassName}"` : '';
      // This is intentionally close to TripAdvisor's snippet structure.
      markupRef.current.innerHTML = `
        <div id="${containerId}" class="TA_${wtype}">
          <ul id="${ulId}" class="${ulClassName}">
            <li${safeLiId}${safeLiClass}>
              <a target="_blank" rel="noopener noreferrer" href="${href}">
                <img src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg" alt="TripAdvisor" />
              </a>
            </li>
          </ul>
        </div>
      `.trim();
    }

    const scriptId = `tripadvisor-widget-script-${uniq}`;
    const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

    // If we already injected the widget script (e.g. SPA navigation), do nothing.
    // TripAdvisor script scans the DOM on load; for locale changes we re-inject below.
    if (existing && existing.src.includes(`lang=${encodeURIComponent(lang)}`)) {
      return;
    }

    if (existing) {
      existing.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    const params = new URLSearchParams();
    params.set('wtype', wtype);
    params.set('uniq', uniq);
    params.set('locationId', locationId);
    params.set('lang', lang);
    params.set('border', border ? 'true' : 'false');
    if (shadow !== null) {
      params.set('shadow', shadow ? 'true' : 'false');
    }
    if (backgroundColor) {
      params.set('backgroundColor', backgroundColor);
    }
    params.set('display_version', '2');
    script.src = `https://www.jscache.com/wejs?${params.toString()}`;
    script.setAttribute('data-loadtrk', '');
    script.onload = () => {
      // TripAdvisor uses this in their snippet.
      (script as unknown as { loadtrk?: boolean }).loadtrk = true;
    };

    // Insert the script right after the widget container element (as in the original snippet).
    const containerEl = document.getElementById(containerId);
    if (containerEl && typeof (containerEl as any).insertAdjacentElement === 'function') {
      (containerEl as HTMLElement).insertAdjacentElement('afterend', script);
    } else {
      document.body.appendChild(script);
    }

    return () => {
      // Keep the script in DOM to avoid re-downloading on small navigations.
      // If you want strict cleanup, uncomment:
      // script.remove();
    };
  }, [backgroundColor, border, canLoad, lang, locationId, shadow, uniq, wtype]);

  return (
    <div>
      <div ref={markupRef} />
    </div>
  );
}
