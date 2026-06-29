/**
 * Shared MDX compile options.
 *
 * Used by both MdxContent (rendering) and toc.ts (heading extraction).
 * Keep this file server-only — it references rehype/remark plugins that
 * should never be bundled into client components.
 */
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { getHighlighter } from "./shiki";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

export type MdxOptions = NonNullable<MDXRemoteProps["options"]>["mdxOptions"];

export const mdxOptions: MdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [
    rehypeSlug,
    [
      rehypePrettyCode,
      {
        // Use our fine-grained singleton instead of the full shiki bundle
        getHighlighter,
        // Keep the dark background from github-dark theme
        keepBackground: true,
        defaultLang: "text",
      },
    ],
  ],
};
