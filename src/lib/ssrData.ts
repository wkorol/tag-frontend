import { createContext, useContext, type ReactNode } from 'react';
import { createElement } from 'react';

export type BlogArticleSummary = {
  slug: string;
  locale: string;
  title: string;
  metaDescription: string;
  publishedAt: string | null;
  ogImageUrl: string | null;
};

export type BlogArticleFull = {
  id: string;
  slug: string;
  locale: string;
  title: string;
  content: string;
  metaDescription: string;
  publishedAt: string | null;
  ogImageUrl: string | null;
};

export type SSRData = {
  blogArticles?: BlogArticleSummary[];
  blogArticle?: BlogArticleFull;
};

const GLOBAL_SSR_DATA_CONTEXT_KEY = '__tag_ssr_data_context__';
const SSRDataContext: ReturnType<typeof createContext<SSRData | null>> =
  (globalThis as unknown as Record<string, unknown>)[GLOBAL_SSR_DATA_CONTEXT_KEY] as
    | ReturnType<typeof createContext<SSRData | null>>
    | undefined
  ?? createContext<SSRData | null>(null);
if (!(globalThis as unknown as Record<string, unknown>)[GLOBAL_SSR_DATA_CONTEXT_KEY]) {
  (globalThis as unknown as Record<string, unknown>)[GLOBAL_SSR_DATA_CONTEXT_KEY] = SSRDataContext;
}

export function SSRDataProvider({ data, children }: { data: SSRData | null; children: ReactNode }) {
  return createElement(SSRDataContext.Provider, { value: data }, children);
}

export function useSSRData(): SSRData | null {
  return useContext(SSRDataContext);
}
