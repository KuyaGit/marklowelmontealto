import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionBar } from "@/components/SectionBar";
import { getAllCategories, getPostsByCategory } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { labelFromSlug } from "@/lib/blog";
import { BlogCard } from "../../_components/BlogCard";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const label = labelFromSlug(category);
  return buildMetadata({
    title: `${label} Articles`,
    description: `Browse all ${label} articles by Mark Lowel Montealto — Full Stack Developer.`,
    path: `/blog/category/${category}`,
    keywords: ["Mark Lowel Montealto", label, "Full Stack Developer", "Blog"],
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const posts = await getPostsByCategory(category);

  if (posts.length === 0) notFound();

  const label = labelFromSlug(category);

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: `/blog/category/${category}`,
          name: `${label} Articles`,
          description: `${label} articles by Mark Lowel Montealto.`,
          type: "CollectionPage",
        })}
      />
      <SectionBar title="Blog" />

      <div className="p-4 sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-1">
            Category
          </p>
          <h1 className="text-lg font-bold text-foreground">{label}</h1>
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
