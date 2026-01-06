import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { I18nProvider } from './lib/i18n';

export function render(url: string) {
  return renderToString(
    <StrictMode>
      <StaticRouter location={url}>
        <I18nProvider>
          <App />
        </I18nProvider>
      </StaticRouter>
    </StrictMode>
  );
}
