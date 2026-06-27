import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionBar } from "@/components/SectionBar";
import { RichText } from "@/components/RichText";
import { getPosts, getPostBySlug } from "@/lib/contentful";
import { buildMetadata } from "@/lib/seo";

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
    ],
    image: post.coverImage ?? "/og.png",
    type: "article",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <SectionBar title="Blog" />

      <article className="p-6 sm:p-8 max-w-2xl">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
            {formatDate(post.date)}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-base leading-relaxed text-muted">
            {post.excerpt}
          </p>
        </header>

        <div className="border-t border-border pt-8">
          {post.body ? (
            <RichText document={post.body} />
          ) : (
            <p className="text-sm text-muted italic">Full article coming soon.</p>
          )}
        </div>
      </article>
    </>
  );
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}
