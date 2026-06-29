/**
 * Shared blog utilities: slugify, related-post ranking, pagination.
 */
import type { Post } from "./types";

// ---------------------------------------------------------------------------
// Slugify
// ---------------------------------------------------------------------------

/**
 * Converts a tag or category string to a URL-safe slug.
 * e.g. "Next.js" → "nextjs", "CI/CD" → "cicd", "AWS" → "aws"
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-");
}

/** Reverses a slug back to a display label (best-effort). */
export function labelFromSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ---------------------------------------------------------------------------
// Related posts
// ---------------------------------------------------------------------------

/**
 * Returns up to 3 posts related to `current` by scoring shared tags + category.
 * Falls back to recency order when there is no tag/category overlap.
 */
export function getRelated(current: Post, all: Post[]): Post[] {
  const others = all.filter((p) => p.slug !== current.slug);

  const scored = others.map((post) => {
    let score = 0;
    // +1 per shared tag
    for (const tag of current.tags ?? []) {
      if (post.tags?.includes(tag)) score += 1;
    }
    // +2 for same category
    if (current.category && post.category === current.category) score += 2;
    return { post, score };
  });

  // Sort by score desc, then by date desc as tiebreaker
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.post.date ?? "").localeCompare(a.post.date ?? "");
  });

  return scored.slice(0, 3).map(({ post }) => post);
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export const PAGE_SIZE = 10;

export interface PaginatedPosts {
  posts: Post[];
  totalPages: number;
  currentPage: number;
  hasPrev: boolean;
  hasNext: boolean;
}

/**
 * Returns the slice of posts for a given 1-based page number.
 */
export function paginate(all: Post[], page: number): PaginatedPosts {
  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const clamped = Math.min(Math.max(1, page), totalPages);
  const start = (clamped - 1) * PAGE_SIZE;
  return {
    posts: all.slice(start, start + PAGE_SIZE),
    totalPages,
    currentPage: clamped,
    hasPrev: clamped > 1,
    hasNext: clamped < totalPages,
  };
}
