import type { Metadata } from "next";
import { SectionBar } from "@/components/SectionBar";
import { getPosts } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { paginate } from "@/lib/blog";
import { BlogCard } from "./_components/BlogCard";
import { Pagination } from "./_components/Pagination";
import { BlogSearch } from "./_components/BlogSearch";

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
  const allPosts = await getPosts();
  const { posts, totalPages, currentPage } = paginate(allPosts, 1);

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
        <BlogSearch />

        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}

        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </>
  );
}
