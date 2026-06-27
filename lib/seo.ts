import type { Metadata } from "next";

/**
 * Robots directive applied to every indexable page.
 * Explicitly grants Googlebot the most generous crawl/index permissions.
 */
const INDEXABLE_ROBOTS: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
};

export interface SeoInput {
  /** Short page title — root layout template appends "| Mark Lowel Montealto". */
  title: string;
  description: string;
  /** Canonical path, e.g. "/about". metadataBase is set in the root layout. */
  path: string;
  keywords: string[];
  /** Overrides the default OG title (`${title} — Mark Lowel Montealto`). */
  ogTitle?: string;
  /** Overrides the default OG description (same as `description`). */
  ogDescription?: string;
  /** OG image path relative to `metadataBase`. Defaults to "/og.png". */
  image?: string;
  /** OG type. Defaults to "website". Use "article" for blog posts. */
  type?: "website" | "article";
}

/**
 * Builds a complete Next.js Metadata object that includes all required SEO
 * fields: title, description, keywords, robots, canonical, OpenGraph, and
 * Twitter card.
 *
 * Always re-declares `images` and `card` explicitly — Next.js replaces (not
 * deep-merges) `openGraph`/`twitter` from the root layout when a child segment
 * defines its own, so omitting them would drop the OG image entirely.
 */
export function buildMetadata(input: SeoInput): Metadata {
  const ogTitle =
    input.ogTitle ?? `${input.title} — Mark Lowel Montealto`;
  const ogDescription = input.ogDescription ?? input.description;
  const image = input.image ?? "/og.png";

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: input.path },
    robots: INDEXABLE_ROBOTS,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: input.path,
      type: input.type ?? "website",
      images: [{ url: image, width: 1200, height: 630, alt: ogTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [image],
    },
  };
}
