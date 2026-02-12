
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

void bootstrap();
  
