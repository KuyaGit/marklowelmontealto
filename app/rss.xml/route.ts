/**
 * RSS 2.0 feed for the blog.
 *
 * force-static: this route is pre-rendered at build time and served as a
 * static file on static export / Cloudflare, refreshing on revalidation.
 * It must NOT read from `request` — that would break static export.
 */
import { getPosts } from "@/lib/contentful";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(iso: string): string {
  if (!iso) return new Date().toUTCString();
  const d = new Date(iso);
  return isNaN(d.getTime()) ? new Date().toUTCString() : d.toUTCString();
}

export async function GET() {
  const posts = await getPosts();

  const items = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const categories = post.tags
        .map((t) => `    <category>${escapeXml(t)}</category>`)
        .join("\n");

      return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(post.excerpt)}</description>
    <pubDate>${toRfc822(post.date)}</pubDate>
${categories}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mark Lowel Montealto — Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Technical articles on Angular, TypeScript, AWS, CI/CD, and DevOps by Mark Lowel Montealto.</description>
    <language>en-us</language>
    <managingEditor>lowel.montealto@whitecloak.com (Mark Lowel Montealto)</managingEditor>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}
