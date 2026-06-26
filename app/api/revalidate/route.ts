import { revalidateTag } from "next/cache";
import type { NextRequest } from "next/server";

/**
 * POST /api/revalidate
 *
 * Triggered by a Contentful webhook on entry/asset publish or unpublish.
 * Revalidates all Contentful-backed cache entries via the "contentful" tag.
 *
 * Configure the webhook in Contentful:
 *   URL: https://marklowelmontealto.com/api/revalidate
 *   Triggers: Entry publish, Entry unpublish, Asset publish, Asset unpublish
 *   Custom header: x-revalidate-secret: <CONTENTFUL_REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret");

  if (!process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return Response.json({ error: "Revalidate secret not configured" }, { status: 500 });
  }

  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Stale-while-revalidate: serves cached content while fresh data loads in the background.
  revalidateTag("contentful", "max");

  return Response.json({ revalidated: true });
}
