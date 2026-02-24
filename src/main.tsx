
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { I18nProvider, getLocaleFromPathname, getTranslations, type Locale, type Translation } from "./lib/i18n";

declare global {
  interface Window {
    __I18N_LOCALE__?: Locale;
    __I18N_TRANSLATIONS__?: Translation | null;
  }
}

const rootElement = document.getElementById("root")!;

const renderStartupError = () => {
  rootElement.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px;text-align:center;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;background:#f8fafc;">
      <div style="max-width:540px;">
        <p style="margin:0 0 12px;font-size:18px;font-weight:600;">Page could not be loaded.</p>
        <p style="margin:0;font-size:14px;line-height:1.5;">Please refresh the page. If the issue continues, clear Safari website data for this domain and try again.</p>
      </div>
    </div>
  `;
};

const bootstrap = async () => {
  const initialLocale =
    window.__I18N_LOCALE__ ?? getLocaleFromPathname(window.location.pathname) ?? "en";
  const initialTranslations: Translation =
    (window.__I18N_TRANSLATIONS__ as Translation | null | undefined) ??
    (await getTranslations(initialLocale));
  // Reduce memory footprint after hydration.
  window.__I18N_TRANSLATIONS__ = null;

  const app = (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <I18nProvider initialLocale={initialLocale} initialTranslations={initialTranslations}>
        <App />
      </I18nProvider>
    </BrowserRouter>
  );

  if (rootElement.hasChildNodes()) {
    hydrateRoot(rootElement, app);
  } else {
    createRoot(rootElement).render(app);
  }
};

void bootstrap().catch((error) => {
  console.error("Application bootstrap failed:", error);
  renderStartupError();
});
  
