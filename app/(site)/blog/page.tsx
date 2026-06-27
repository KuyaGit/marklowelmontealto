import type { Metadata } from "next";
import Link from "next/link";
import { SectionBar } from "@/components/SectionBar";
import { getPosts } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description:
    "Technical articles by Mark Lowel Montealto on Angular, TypeScript, AWS, CI/CD pipelines, and DevOps engineering.",
  path: "/blog",
  keywords: [
    "Mark Lowel Montealto",
    "Full Stack Developer",
    "AWS Engineer",
    "Cloud Engineer",
    "Terraform Developer",
    "Angular Developer",
  ],
  ogDescription:
    "Technical articles on Angular, TypeScript, AWS cloud architecture, and CI/CD automation by a Full Stack Developer and DevOps Engineer.",
});

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: "/blog",
          name: "Blog — Mark Lowel Montealto",
          description:
            "Technical articles by Mark Lowel Montealto on Angular, TypeScript, AWS, CI/CD pipelines, and DevOps engineering.",
          type: "CollectionPage",
        })}
      />
      <h1 className="sr-only">
        Mark Lowel Montealto — Blog: Angular, AWS, Cloud Engineering &amp; Full Stack Development
      </h1>
      <SectionBar title="Blog" />

      <div className="p-4 sm:p-6 space-y-3">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
            <article className="p-4 sm:p-5 rounded-xl border border-border group-hover:border-foreground/20 transition-colors duration-200">
              <div className="flex items-start justify-between gap-4 mb-1.5">
                <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">
                  {post.title}
                </h3>
                {post.isFeatured && (
                  <span className="flex-shrink-0 text-xs font-semibold tracking-wider uppercase text-accent border border-accent/30 rounded-full px-2.5 py-0.5">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-foreground/40 font-medium mb-2">
                {formatDate(post.date)}
              </p>
              <p className="text-sm leading-relaxed text-muted line-clamp-2">
                {post.excerpt}
              </p>
            </article>
          </Link>
        ))}
      </div>
    </>
  );
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
