import { jsx } from 'react/jsx-runtime';
import { useRef, useState, useMemo, useEffect } from 'react';
import { u as useI18n, v as hasMarketingConsent } from '../entry-server.mjs';
import 'react-dom/server';
import 'react-router-dom/server.js';
import 'react-router-dom';
import 'lucide-react';

const localeToTripadvisorLang = {
  en: "en_US",
  pl: "pl_PL",
  de: "de_DE",
  fi: "fi_FI",
  no: "nb_NO",
  sv: "sv_SE",
  da: "da_DK"
};
function TripadvisorWidget({
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
  liClassName: liClassNameProp
}) {
  const { locale } = useI18n();
  const hostRef = useRef(null);
  const [isInViewport, setIsInViewport] = useState(false);
  const [canLoad, setCanLoad] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return requireConsent ? hasMarketingConsent() : true;
  });
  const locationId = locationIdProp || undefined                                             || "34104207";
  const uniq = uniqProp || undefined                                      || "444";
  const href = hrefProp || undefined                                     || "https://www.tripadvisor.com/Attraction_Review-g274725-d34104207-Reviews-Taxi_Airport_Gdansk-Gdansk_Pomerania_Province_Northern_Poland.html";
  const wtype = wtypeProp || undefined                                       || "cdsratingsonlywide";
  const border = borderProp ?? ("true") === "true";
  const shadow = typeof shadowProp === "boolean" ? shadowProp : null;
  const backgroundColor = backgroundColorProp || undefined                                                  || null;
  const lang = localeToTripadvisorLang[locale] || "en_US";
  const containerId = useMemo(() => `TA_${wtype}${uniq}`, [uniq, wtype]);
  const ulId = useMemo(() => ulIdProp || `TA_links_${uniq}`, [ulIdProp, uniq]);
  const ulClassName = useMemo(() => ulClassNameProp || "TA_links", [ulClassNameProp]);
  const liId = useMemo(() => liIdProp || void 0, [liIdProp]);
  const liClassName = useMemo(() => liClassNameProp || void 0, [liClassNameProp]);
  const markupRef = useRef(null);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (isInViewport) {
      return;
    }
    const node = hostRef.current;
    if (!node) {
      return;
    }
    if (!("IntersectionObserver" in window)) {
      setIsInViewport(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsInViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [isInViewport]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!requireConsent) {
      setCanLoad(true);
      return;
    }
    const update = () => setCanLoad(hasMarketingConsent());
    update();
    const onCustom = () => update();
    const onStorage = (e) => {
      if (e.key === "cookie-consent") {
        update();
      }
    };
    window.addEventListener("cookie-consent", onCustom);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("cookie-consent", onCustom);
      window.removeEventListener("storage", onStorage);
    };
  }, [requireConsent]);
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (!canLoad || !isInViewport) {
      return;
    }
    if (markupRef.current) {
      const safeLiId = liId ? ` id="${liId}"` : "";
      const safeLiClass = liClassName ? ` class="${liClassName}"` : "";
      markupRef.current.innerHTML = `
        <div id="${containerId}" class="TA_${wtype}">
          <ul id="${ulId}" class="${ulClassName}">
            <li${safeLiId}${safeLiClass}>
              <a target="_blank" rel="noopener noreferrer" href="${href}">
                <img src="https://www.tripadvisor.com/img/cdsi/img2/branding/v2/Tripadvisor_lockup_horizontal_secondary_registered-18034-2.svg" alt="TripAdvisor" width="180" height="28" decoding="async" />
              </a>
            </li>
          </ul>
        </div>
      `.trim();
    }
    const scriptId = `tripadvisor-widget-script-${uniq}`;
    const existing = document.getElementById(scriptId);
    if (existing && existing.src.includes(`lang=${encodeURIComponent(lang)}`)) {
      return;
    }
    if (existing) {
      existing.remove();
    }
    const script = document.createElement("script");
    script.id = scriptId;
    script.async = true;
    const params = new URLSearchParams();
    params.set("wtype", wtype);
    params.set("uniq", uniq);
    params.set("locationId", locationId);
    params.set("lang", lang);
    params.set("border", border ? "true" : "false");
    if (shadow !== null) {
      params.set("shadow", shadow ? "true" : "false");
    }
    if (backgroundColor) {
      params.set("backgroundColor", backgroundColor);
    }
    params.set("display_version", "2");
    script.src = `https://www.jscache.com/wejs?${params.toString()}`;
    script.setAttribute("data-loadtrk", "");
    script.onload = () => {
      script.loadtrk = true;
    };
    const containerEl = document.getElementById(containerId);
    if (containerEl && typeof containerEl.insertAdjacentElement === "function") {
      containerEl.insertAdjacentElement("afterend", script);
    } else {
      document.body.appendChild(script);
    }
    return () => {
    };
  }, [backgroundColor, border, canLoad, isInViewport, lang, locationId, shadow, uniq, wtype]);
  return /* @__PURE__ */ jsx("div", { ref: hostRef, children: /* @__PURE__ */ jsx("div", { ref: markupRef }) });
}

export { TripadvisorWidget };
