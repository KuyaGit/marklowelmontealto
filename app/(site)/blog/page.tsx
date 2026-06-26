import type { Metadata } from "next";
import Link from "next/link";
import { SectionBar } from "@/components/SectionBar";
import { getPosts } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical articles by Mark Lowel Montealto on Angular, TypeScript, AWS, CI/CD pipelines, and DevOps engineering.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — Mark Lowel Montealto",
    description:
      "Technical articles on Angular, TypeScript, AWS cloud architecture, and CI/CD automation by a Full Stack Developer and DevOps Engineer.",
    url: "/blog",
  },
  twitter: {
    title: "Blog — Mark Lowel Montealto",
    description:
      "Technical articles on Angular, TypeScript, AWS, and CI/CD by Mark Lowel Montealto.",
  },
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <>
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
