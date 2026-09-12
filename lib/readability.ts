import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export interface ExtractedContent {
  title: string;
  text: string;
  faviconUrl: string | null;
}

export async function extractContent(url: string): Promise<ExtractedContent> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  let html: string;
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; Short-App/1.0; +https://short.app)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    html = await response.text();
  } finally {
    clearTimeout(timeout);
  }

  const dom = new JSDOM(html, { url });
  const document = dom.window.document;

  // Extract favicon
  let faviconUrl: string | null = null;
  const iconLink =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]') ||
    document.querySelector<HTMLLinkElement>('link[rel="shortcut icon"]') ||
    document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');

  if (iconLink?.href) {
    faviconUrl = iconLink.href;
  } else {
    const { hostname } = new URL(url);
    faviconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  }

  // Extract readable content
  const reader = new Readability(document);
  const article = reader.parse();

  const title =
    article?.title ||
    document.querySelector("title")?.textContent ||
    new URL(url).hostname;

  const text = article?.textContent?.slice(0, 8000) || "";

  return { title: title.trim(), text, faviconUrl };
}
