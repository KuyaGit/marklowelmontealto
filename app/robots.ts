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
//   Note: The root "/" is NOT disallowed even though app/page.tsx sets
//   `robots: { index: false }`.  We *want* crawlers to reach "/" so they can
//   follow the <meta http-equiv="refresh"> redirect to "/about" and index the
//   canonical landing page.  The noindex directive on "/" tells crawlers not to
//   add "/" itself to the index — it does not prevent them from crawling it or
//   following its redirect.
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
