import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// ---------------------------------------------------------------------------
// force-static: robots.txt has no per-request input, so prerender it once at
// build time rather than running this function on every request.
// ---------------------------------------------------------------------------
export const dynamic = "force-static";

// ---------------------------------------------------------------------------
// robots() — Next.js App Router metadata route.
//
// Next.js calls this default export and serialises the return value as
// /robots.txt, which search engine crawlers fetch before indexing the site.
//
// Rule breakdown:
//
//   userAgent: "*"
//     Apply this rule to every crawler (Googlebot, Bingbot, etc.).
//
//   allow: "/"
//     Explicitly grant access to the entire site.  This line is redundant when
//     there are no other restrictions, but it makes the intent unambiguous — we
//     *want* all indexable pages crawled.
//
//   disallow: ["/api/", "/_next/"]
//     /api/    — internal API route (on-demand revalidation trigger).  Crawling
//                it is pointless and needlessly burns crawl budget.
//     /_next/  — Next.js build artifacts (JS chunks, static assets addressed by
//                hashed filenames).  Not human-readable pages; keeping crawlers
//                out prevents them from wasting budget on assets.
//
//   Note: The root "/" is fully indexable — it is the canonical landing page for
//   the brand query "Mark Lowel Montealto".  Crawlers should index it directly.
//
//   sitemap: `${SITE_URL}/sitemap.xml`
//     Points every crawler to the sitemap so they discover all URLs and their
//     freshness signals without relying solely on link-following.
//
//   host: SITE_URL
//     Declares the canonical host (preferred domain, no www vs www ambiguity).
//     Respected by Yandex; treated as advisory by Google/Bing.
// ---------------------------------------------------------------------------
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
