// Fetch a product page and reduce it to clean text for the model.

export interface PageText {
  url: string;
  title: string;
  description: string;
  text: string;
}

export async function fetchPageText(url: string): Promise<PageText> {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    throw new Error(`Could not fetch the page (HTTP ${res.status})`);
  }

  const html = await res.text();

  const title = match(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description =
    attr(html, /<meta[^>]+name=["']description["'][^>]*>/i, "content") ||
    attr(html, /<meta[^>]+property=["']og:description["'][^>]*>/i, "content");

  const text = html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 12000);

  return { url, title, description, text };
}

function match(html: string, re: RegExp): string {
  const m = html.match(re);
  return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function attr(html: string, tagRe: RegExp, name: string): string {
  const tag = html.match(tagRe)?.[0];
  if (!tag) return "";
  const m = tag.match(new RegExp(`${name}=["']([^"']*)["']`, "i"));
  return m ? m[1].trim() : "";
}
