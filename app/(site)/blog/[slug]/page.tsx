import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SectionBar } from "@/components/SectionBar";
import { RichText } from "@/components/RichText";
import { MdxContent } from "@/components/MdxContent";
import { getPosts, getPostBySlug } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph, buildBlogPostingGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { ArrowRightIcon } from "@/components/icons";
import { readingTime } from "@/lib/reading-time";
import { extractToc } from "@/lib/toc";
import { getRelated } from "@/lib/blog";
import { TagChips } from "../_components/TagChips";
import { TableOfContents } from "../_components/TableOfContents";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found", robots: { index: false } };

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
    keywords: [
      "Mark Lowel Montealto",
      post.title,
      "Full Stack Developer",
      "AWS Engineer",
      "Cloud Engineer",
      ...(post.tags ?? []),
    ],
    image: post.coverImage ?? "/og.png",
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPostBySlug(slug), getPosts()]);
  if (!post) notFound();

  // Reading time & TOC (MDX path only)
  const rt = post.bodyMdx ? readingTime(post.bodyMdx) : null;
  const toc = post.bodyMdx ? extractToc(post.bodyMdx) : [];

  // Related posts — scored by shared tags/category
  const relatedPosts = getRelated(post, allPosts);

  // Reading time as ISO 8601 duration for schema
  const timeRequired = rt ? `PT${rt.minutes}M` : undefined;

  return (
    <>
      {/* WebPage node — breadcrumb + page identity */}
      <JsonLd
        data={buildPageGraph({
          path: `/blog/${post.slug}`,
          name: post.title,
          description: post.excerpt,
          type: "WebPage",
          image: post.coverImage,
        })}
      />
      {/* BlogPosting node — article metadata for rich results */}
      <JsonLd
        data={buildBlogPostingGraph(post, {
          tags: post.tags,
          category: post.category,
          wordCount: rt?.words,
          timeRequired,
        })}
      />
      <SectionBar title="Blog" />

      <div className="flex gap-8 p-6 sm:p-8">
        {/* Article */}
        <article className="flex-1 min-w-0 max-w-2xl">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted">
                {formatDate(post.date)}
              </p>
              {rt && (
                <>
                  <span className="text-foreground/20 text-xs">·</span>
                  <p className="text-xs text-muted">{rt.text}</p>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            <p className="text-base leading-relaxed text-muted mb-4">
              {post.excerpt}
            </p>

            {(post.category || post.tags.length > 0) && (
              <TagChips tags={post.tags} category={post.category} />
            )}
          </header>

          <div className="border-t border-border pt-8">
            {post.bodyMdx ? (
              <MdxContent source={post.bodyMdx} />
            ) : post.body ? (
              <RichText document={post.body} />
            ) : (
              <p className="text-sm text-muted italic">Full article coming soon.</p>
            )}
          </div>

          {/* Back to blog */}
          <div className="mt-10 pt-8 border-t border-border">
            <Link
              href="/blog"
              className="text-sm font-medium text-foreground/50 hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              ← All articles
            </Link>
          </div>
        </article>

        {/* Sidebar — TOC (only if there are headings) */}
        {toc.length > 0 && (
          <aside className="hidden xl:block w-52 flex-shrink-0 pt-1">
            <div className="sticky top-6">
              <TableOfContents entries={toc} />
            </div>
          </aside>
        )}
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section
          aria-labelledby="related-posts-heading"
          className="px-6 sm:px-8 pb-8 max-w-2xl"
        >
          <h2
            id="related-posts-heading"
            className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-4"
          >
            Related articles
          </h2>
          <div className="space-y-3">
            {relatedPosts.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="block group">
                <article className="p-4 rounded-xl border border-border group-hover:border-foreground/20 transition-colors">
                  <h3 className="text-sm font-semibold text-foreground leading-tight mb-1">
                    {p.title}
                  </h3>
                  <p className="text-xs text-foreground/40 mb-1.5">{formatDate(p.date)}</p>
                  <p className="text-xs text-foreground/60 line-clamp-2">{p.excerpt}</p>
                  <p className="mt-2 text-xs font-medium text-foreground/40 group-hover:text-foreground/60 transition-colors flex items-center gap-1">
                    Read article <ArrowRightIcon size={11} />
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
