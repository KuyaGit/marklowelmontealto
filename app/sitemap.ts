import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getPosts, getCertificates, getAllTags, getAllCategories } from "@/lib/contentful";
import { paginate } from "@/lib/blog";

// ---------------------------------------------------------------------------
// Fallback date used for pages that have no Contentful date field.
// Update this whenever static portfolio content is meaningfully edited.
// ---------------------------------------------------------------------------
const LAST_UPDATED = new Date("2026-06-20");

// ---------------------------------------------------------------------------
// toDate — safe ISO-string → Date conversion.
//
// Contentful date fields can be empty strings or undefined when content
// editors leave them blank. Passing an invalid string to `new Date()` emits
// "Invalid Date", which Next.js serialises as `NaN` in <lastmod> and breaks
// sitemap validation. This helper returns the fallback instead.
// ---------------------------------------------------------------------------
function toDate(iso: string | undefined, fallback: Date): Date {
  if (!iso) return fallback;
  const d = new Date(iso);
  return isNaN(d.getTime()) ? fallback : d;
}

// ---------------------------------------------------------------------------
// Static route config
//
// Each entry declares the explicit priority and changeFrequency for a top-level
// page.  Keeping this table instead of inline ternaries makes the rationale
// visible and easy to adjust without touching the builder logic.
//
// Priority scale (0.0 – 1.0, relative hints for crawlers):
//   1.0  canonical landing page  — highest crawl priority
//   0.8  core portfolio content  — primary resume-equivalent pages
//   0.7  content hub             — gains new entries, moderately important
//   0.6  secondary content       — listing changes rarely
//   0.4  utility page            — contact form, low SEO value
//
// changeFrequency:
//   monthly  → layout/content tweaks happen occasionally
//   weekly   → blog hub picks up new posts regularly
//   yearly   → certifications list is rarely touched
// ---------------------------------------------------------------------------
type StaticRoute = {
  href: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const STATIC_ROUTES: StaticRoute[] = [
  // / is the canonical landing page — the rich homepage Google should rank for
  // the brand query "Mark Lowel Montealto".
  { href: "/",            priority: 1.0, changeFrequency: "monthly" },

  // /about is a secondary profile page — useful but not the primary result.
  { href: "/about",       priority: 0.8, changeFrequency: "monthly" },

  // Core portfolio content — shown prominently to potential clients/employers.
  { href: "/works",       priority: 0.8, changeFrequency: "monthly" },
  { href: "/projects",    priority: 0.8, changeFrequency: "monthly" },

  // Blog hub — new posts appear here; lastModified set dynamically below.
  { href: "/blog",        priority: 0.7, changeFrequency: "weekly"  },

  // Certificate listing — Contentful-backed but rarely updated.
  // lastModified set dynamically to newest cert date below.
  { href: "/certificate", priority: 0.6, changeFrequency: "yearly"  },

  // Contact — static form, not a ranking target.
  { href: "/contact",     priority: 0.4, changeFrequency: "yearly"  },
];

// ---------------------------------------------------------------------------
// sitemap() — Next.js App Router metadata route.
//
// Next.js reads the default export, calls it at build time (or on-demand when
// revalidate triggers), and serves the result as /sitemap.xml.  The return type
// MetadataRoute.Sitemap is an array of objects Next converts to <url> nodes.
//
// Dynamic data strategy:
//   - Blog posts  → fetched from Contentful; each post's own date drives
//     <lastmod> so crawlers know exactly which articles changed.
//   - Certificates → fetched to derive the /certificate listing <lastmod>
//     (newest cert date); individual certs have no detail routes.
//   - Projects    → no date field in Contentful, so /projects uses the
//     LAST_UPDATED constant.  getProjects() is intentionally NOT called here.
//
// Both Contentful helpers are wrapped in unstable_cache (revalidate: 300 s)
// so the sitemap stays fresh without hammering the API on every request.
// ---------------------------------------------------------------------------
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch content — all derived from the already-cached getPosts() where possible.
  const [posts, certificates, tags, categories] = await Promise.all([
    getPosts(),
    getCertificates(),
    getAllTags(),
    getAllCategories(),
  ]);

  // Derive freshness dates for the two listing pages from their newest item.
  // getPosts / getCertificates both return entries ordered by -fields.date, so
  // index 0 is the most recent.
  const newestPostDate        = toDate(posts[0]?.date,         LAST_UPDATED);
  const newestCertificateDate = toDate(certificates[0]?.date,  LAST_UPDATED);

  // Build the static/nav route entries, substituting dynamic lastModified
  // where relevant.
  const staticEntries = STATIC_ROUTES.map(({ href, priority, changeFrequency }) => {
    let lastModified: Date;
    if (href === "/blog")             lastModified = newestPostDate;
    else if (href === "/certificate") lastModified = newestCertificateDate;
    else                              lastModified = LAST_UPDATED;

    return {
      url: `${SITE_URL}${href}`,
      lastModified,
      changeFrequency,
      priority,
    };
  });

  // Per-post detail routes (/blog/[slug]).
  // Each entry uses that post's own publish date as lastModified so crawlers
  // re-index updated articles promptly.
  const blogPostEntries = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: toDate(post.date, LAST_UPDATED),
    // Individual articles receive incremental edits (typo fixes, updates).
    changeFrequency: "monthly" as const,
    // Same priority as the /certificate listing — useful but secondary to the
    // main portfolio sections.
    priority: 0.6,
  }));

  // Pagination pages 2..N
  const { totalPages } = paginate(posts, 1);
  const paginationEntries = Array.from(
    { length: Math.max(0, totalPages - 1) },
    (_, i) => ({
      url: `${SITE_URL}/blog/page/${i + 2}`,
      lastModified: newestPostDate,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    })
  );

  // Tag listing pages
  const tagEntries = tags.map((tag) => ({
    url: `${SITE_URL}/blog/tag/${tag}`,
    lastModified: newestPostDate,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Category listing pages
  const categoryEntries = categories.map((cat) => ({
    url: `${SITE_URL}/blog/category/${cat}`,
    lastModified: newestPostDate,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  // Canonical URLs intentionally omit trailing slashes, matching the
  // `alternates.canonical` values set in each page's generateMetadata/metadata
  // export. Consistency here prevents duplicate-URL penalties.
  return [
    ...staticEntries,
    ...blogPostEntries,
    ...paginationEntries,
    ...tagEntries,
    ...categoryEntries,
  ];
}
