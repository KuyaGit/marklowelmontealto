/**
 * Client-side search index.
 *
 * Rendered to a static JSON file at build time (force-static + GET only,
 * no request access) — works on static export, Cloudflare, and Docker.
 *
 * The payload intentionally excludes the full body to keep the file small.
 */
import { getPosts } from "@/lib/contentful";

export const dynamic = "force-static";

export async function GET() {
  const posts = await getPosts();

  const index = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    tags: post.tags,
    category: post.category,
    date: post.date,
  }));

  return Response.json(index, {
    headers: {
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}
