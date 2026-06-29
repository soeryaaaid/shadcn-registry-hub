import { NextRequest, NextResponse } from "next/server";

function parseFavicon(html: string, baseUrl: string): string {
  for (const [, attrs] of html.matchAll(/<link([^>]+?)\s*\/?>/gi)) {
    const rel = attrs.match(/rel=["']([^"']+)["']/i)?.[1] ?? "";
    if (!rel.toLowerCase().includes("icon")) continue;
    const href = attrs.match(/href=["']([^"']+)["']/i)?.[1];
    if (!href) continue;
    try { return new URL(href, baseUrl).href; } catch { continue; }
  }
  try { return new URL("/favicon.ico", baseUrl).href; } catch { return ""; }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    // Fetch the homepage HTML with a 5s timeout
    const response = await fetch(url, {
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
      cache: "no-store", // Disable Next.js fetch cache — response is too large; caching is handled via Cache-Control on the API response
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.statusText}`);
    }

    // Read only the first 50KB — title and favicon are always in <head>
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let html = "";
    if (reader) {
      while (html.length < 50_000) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
      }
      reader.cancel();
    }
    
    // Extract title using regex supporting newlines and spaces
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1].trim() : "";

    // Clean up HTML entities and whitespace
    if (title) {
      title = title
        .replace(/&amp;/g, "&")
        .replace(/&#x27;/g, "'")
    }

    // Extract favicon
    const favicon = parseFavicon(html, url);

    return NextResponse.json(
      { title, favicon },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=600",
        },
      }
    );
  } catch (error: any) {
    // Log a clean warning instead of a loud stack trace for expected network/timeout failures
    const errMsg = error instanceof Error ? error.message : String(error);
    console.warn(`[Metadata Fetch] Failed for ${url} - ${errMsg}`);
    
    // Return empty title fallback so the UI still works
    return NextResponse.json(
      { title: "", favicon: "" },
      {
        headers: {
          "Cache-Control": "public, max-age=300", // Cache failures briefly
        },
      }
    );
  }
}
