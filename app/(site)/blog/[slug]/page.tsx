import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionBar } from "@/components/SectionBar";
import { posts } from "@/data/posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: `${post.title} — Mark Lowel Montealto`,
      description: post.excerpt,
      url: `/blog/${slug}`,
      type: "article",
    },
    twitter: {
      title: `${post.title} — Mark Lowel Montealto`,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <SectionBar title="Blog" />

      <article className="p-6 sm:p-8 max-w-2xl">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
            {post.date}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-base leading-relaxed text-muted">
            {post.excerpt}
          </p>
        </header>

        <div className="border-t border-border pt-8">
          <p className="text-sm text-muted italic">
            Full article coming soon.
          </p>
        </div>
      </article>
    </>
  );
}
