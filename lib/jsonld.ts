import { getProfile } from "@/lib/contentful";
import { SITE_URL } from "./site";
import type { Post } from "./types";

// ---------------------------------------------------------------------------
// Stable @id references used across the graph
// ---------------------------------------------------------------------------

const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const CORE_TECHNOLOGIES = [
  "Angular",
  "React",
  "Next.js",
  "React Native",
  "TypeScript",
  "Laravel",
  "AWS",
  "Terraform",
  "Cloudflare",
  "Node.js",
  "Docker",
  "CI/CD",
];

// ---------------------------------------------------------------------------
// Global graph — Person + WebSite (injected once in the root layout)
// ---------------------------------------------------------------------------

/**
 * Returns the site-wide `@graph` containing `Person` and `WebSite` nodes.
 * Both carry stable `@id`s so page-level nodes can reference them without
 * duplicating their full definitions.
 *
 * Called in `app/layout.tsx`; data is cached via Contentful's `unstable_cache`.
 */
export async function getGlobalGraph() {
  const profile = await getProfile();

  const sameAs = [
    profile.social.linkedin,
    profile.social.github,
    profile.social.facebook,
    profile.social.youtube,
  ].filter(Boolean);

  // Merge Contentful knowsAbout with core technologies, deduplicating.
  const knowsAboutSet = new Set<string>([
    ...CORE_TECHNOLOGIES,
    ...profile.knowsAbout,
  ]);
  const knowsAbout = Array.from(knowsAboutSet);

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    email: profile.email,
    // Prefer the Contentful avatar; fall back to the OG image (the only
    // guaranteed image in public/). The old fallback `/profile.JPG` does not
    // exist in production.
    image: profile.avatar || `${SITE_URL}/og.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location || "Manila",
      addressCountry: "PH",
    },
    knowsAbout,
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      occupationLocation: {
        "@type": "Country",
        name: "Philippines",
      },
      skills: CORE_TECHNOLOGIES.join(", "),
    },
    ...(profile.worksForOrg && {
      worksFor: { "@type": "Organization", name: profile.worksForOrg },
    }),
    ...(profile.communityOrg && {
      memberOf: [
        {
          "@type": "Organization",
          name: profile.communityOrg,
          ...(profile.communityOrgUrl && { url: profile.communityOrgUrl }),
        },
      ],
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  const website = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: `${profile.name} — Portfolio`,
    url: SITE_URL,
    description:
      "Full Stack Developer and DevOps Engineer portfolio — Angular, TypeScript, AWS, CI/CD, and cloud-native solutions.",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: `${profile.name} — Full Stack Developer`,
    description:
      "Official portfolio of Mark Lowel Montealto, a Full Stack Developer and DevOps Engineer based in Manila, Philippines.",
    mainEntity: { "@id": PERSON_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };
}

// ---------------------------------------------------------------------------
// Breadcrumb builder (internal helper)
// ---------------------------------------------------------------------------

/**
 * Builds a `BreadcrumbList` for `path`.
 *
 * The first crumb is always "Home" → `/about` (the canonical landing page).
 * For nested paths (e.g. `/blog/my-post`) intermediate segments are included.
 * The **last crumb omits an `item` URL**, following Google's guidance that the
 * current-page item should not be a clickable link.
 *
 * @param path   Absolute URL path, e.g. `/blog/my-post` or `/about`.
 * @param label  Human-readable label for the final crumb, e.g. the post title.
 */
function buildBreadcrumbs(path: string, label: string) {
  const pageUrl = `${SITE_URL}${path}`;
  const segments = path.replace(/^\//, "").split("/").filter(Boolean);

  // First crumb: Home → /about
  const items: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item?: string;
  }> = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: `${SITE_URL}/about`,
    },
  ];

  // Intermediate crumbs (all segments except the last)
  segments.slice(0, -1).forEach((seg, idx) => {
    items.push({
      "@type": "ListItem",
      position: idx + 2,
      name: seg.charAt(0).toUpperCase() + seg.slice(1),
      item: `${SITE_URL}/${segments.slice(0, idx + 1).join("/")}`,
    });
  });

  // Final crumb — current page (no `item` per Google's guidance)
  items.push({
    "@type": "ListItem",
    position: items.length + 1,
    name: label,
    // Only add `item` if we're not on a top-level page (to avoid duplicating
    // the Home crumb when path === '/about')
    ...(segments.length > 1 ? { item: pageUrl } : {}),
  });

  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items,
  };
}

// ---------------------------------------------------------------------------
// Page-level graph builder
// ---------------------------------------------------------------------------

export type PageType =
  | "WebPage"
  | "ProfilePage"
  | "ContactPage"
  | "CollectionPage";

export interface PageGraphOptions {
  /** Absolute URL path of the page, e.g. `/about` or `/blog`. */
  path: string;
  /** Page name / title used in the WebPage node. */
  name: string;
  /** Page description. */
  description: string;
  /** WebPage subtype. Defaults to "WebPage". */
  type?: PageType;
  /** Optional primary image URL (absolute). */
  image?: string;
}

/**
 * Builds a page-scoped `@graph` containing a `WebPage` (or subtype) and a
 * `BreadcrumbList`. Both reference the global `Person` and `WebSite` nodes by
 * their `@id` — no data is duplicated.
 *
 * Render the result with `<JsonLd data={buildPageGraph({...})} />` inside
 * each `(site)` page component.
 */
export function buildPageGraph({
  path,
  name,
  description,
  type = "WebPage",
  image,
}: PageGraphOptions) {
  const pageUrl = `${SITE_URL}${path}`;

  const webPage: Record<string, unknown> = {
    "@type": type,
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name,
    description,
    isPartOf: { "@id": WEBSITE_ID },
    breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
  };

  if (type === "ProfilePage") {
    // ProfilePage.mainEntity points to the Person this page describes
    webPage.mainEntity = { "@id": PERSON_ID };
  } else {
    // All other page types declare what they are about
    webPage.about = { "@id": PERSON_ID };
  }

  if (image) {
    webPage.primaryImageOfPage = { "@type": "ImageObject", url: image };
    webPage.image = image;
  }

  const breadcrumbs = buildBreadcrumbs(path, name);

  return {
    "@context": "https://schema.org",
    "@graph": [webPage, breadcrumbs],
  };
}

// ---------------------------------------------------------------------------
// BlogPosting graph builder
// ---------------------------------------------------------------------------

/**
 * Builds the `BlogPosting` node for a blog post page.
 *
 * `BlogPosting` is a subclass of `Article`, so this satisfies both schema
 * types. Render alongside `buildPageGraph(...)` on the post page.
 */
export function buildBlogPostingGraph(
  post: Pick<Post, "slug" | "title" | "excerpt" | "date" | "coverImage">
) {
  const pageUrl = `${SITE_URL}/blog/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${pageUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    url: pageUrl,
    datePublished: post.date,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
    ...(post.coverImage && {
      image: { "@type": "ImageObject", url: post.coverImage },
    }),
  };
}
