import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { nav } from "@/data/nav";
import { posts } from "@/data/posts";

const LAST_UPDATED = new Date("2026-06-20");

export default function sitemap(): MetadataRoute.Sitemap {
  const navRoutes = nav.map(({ href }) => ({
    url: `${SITE_URL}${href}`,
    lastModified: LAST_UPDATED,
    changeFrequency: (href === "/about" ? "monthly" : "yearly") as
      | "monthly"
      | "yearly",
    priority: href === "/about" ? 1 : href === "/works" ? 0.8 : 0.7,
  }));

  const blogRoutes = posts.map(({ slug }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...navRoutes, ...blogRoutes];
}
