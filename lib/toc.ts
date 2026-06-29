/**
 * Extracts table-of-contents headings from an MDX/markdown source string.
 *
 * Uses the same slug algorithm as `rehype-slug` (github-slugger) so that the
 * anchor hrefs match the ids injected into the rendered HTML.
 */
import GithubSlugger from "github-slugger";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import type { Root, Heading } from "mdast";
import type { Plugin } from "unified";

export interface TocEntry {
  depth: 2 | 3;
  value: string;
  slug: string;
}

// ---------------------------------------------------------------------------
// Internal remark plugin — collects h2/h3 headings into the vfile.data bucket
// ---------------------------------------------------------------------------

function extractTextFromHeading(node: Heading): string {
  return node.children
    .map((child) => {
      if (child.type === "text" || child.type === "inlineCode") return child.value;
      return "";
    })
    .join("")
    .trim();
}

const collectHeadings: Plugin<[], Root> = function () {
  return (tree, file) => {
    const headings: TocEntry[] = [];
    const slugger = new GithubSlugger();

    tree.children.forEach((node) => {
      if (node.type === "heading" && (node.depth === 2 || node.depth === 3)) {
        const value = extractTextFromHeading(node);
        if (value) {
          headings.push({ depth: node.depth, value, slug: slugger.slug(value) });
        }
      }
    });

    file.data.headings = headings;
  };
};

// ---------------------------------------------------------------------------
// Public API — parse and return headings synchronously
// ---------------------------------------------------------------------------

export function extractToc(source: string): TocEntry[] {
  // Strip front matter before parsing
  const clean = source.replace(/^---[\s\S]*?---\n?/, "");

  const processor = remark().use(remarkGfm).use(collectHeadings);
  const file = processor.processSync(clean);
  return (file.data.headings as TocEntry[]) ?? [];
}
