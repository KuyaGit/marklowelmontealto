import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionBar } from "@/components/SectionBar";
import { getPosts } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { paginate } from "@/lib/blog";
import { BlogCard } from "../../_components/BlogCard";
import { Pagination } from "../../_components/Pagination";

interface Props {
  params: Promise<{ n: string }>;
}

export async function generateStaticParams() {
  const allPosts = await getPosts();
  const { totalPages } = paginate(allPosts, 1);
  // Page 1 is served by /blog/page.tsx; only emit 2..N
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, i) => ({
    n: String(i + 2),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { n } = await params;
  const page = parseInt(n, 10);
  if (isNaN(page) || page < 2) return { robots: { index: false } };

  return buildMetadata({
    title: `Blog — Page ${page}`,
    description: `Page ${page} of technical articles by Mark Lowel Montealto on Angular, TypeScript, AWS, and DevOps.`,
    path: `/blog/page/${page}`,
    keywords: ["Mark Lowel Montealto", "Full Stack Developer", "Blog"],
  });
}

export default async function BlogPageN({ params }: Props) {
  const { n } = await params;
  const page = parseInt(n, 10);

  if (isNaN(page) || page < 2) notFound();

  const allPosts = await getPosts();
  const { posts, totalPages, currentPage } = paginate(allPosts, page);

  if (page > totalPages) notFound();

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: `/blog/page/${page}`,
          name: `Blog — Page ${page}`,
          description: `Page ${page} of technical articles by Mark Lowel Montealto.`,
          type: "CollectionPage",
        })}
      />
      <SectionBar title="Blog" />

      <div className="p-4 sm:p-6 space-y-3">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
