import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionBar } from "@/components/SectionBar";
import { getAllTags, getPostsByTag } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { labelFromSlug } from "@/lib/blog";
import { BlogCard } from "../../_components/BlogCard";

interface Props {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const label = labelFromSlug(tag);
  return buildMetadata({
    title: `#${label} Articles`,
    description: `Browse all technical articles tagged "${label}" by Mark Lowel Montealto — Full Stack Developer.`,
    path: `/blog/tag/${tag}`,
    keywords: ["Mark Lowel Montealto", label, "Full Stack Developer", "Blog"],
  });
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);

  if (posts.length === 0) notFound();

  const label = labelFromSlug(tag);

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: `/blog/tag/${tag}`,
          name: `Articles tagged "${label}"`,
          description: `Technical articles tagged "${label}" by Mark Lowel Montealto.`,
          type: "CollectionPage",
        })}
      />
      <SectionBar title="Blog" />

      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-1">
            Tag
          </p>
          <h1 className="text-lg font-bold text-foreground">#{label}</h1>
          <p className="text-xs text-foreground/40 mt-1">
            {posts.length} article{posts.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="space-y-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </>
  );
}
