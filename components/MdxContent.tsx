/**
 * Server component that renders an MDX source string using next-mdx-remote/rsc.
 *
 * Keep this as a server component — it imports rehype/remark plugins and the
 * Shiki highlighter, which should never be bundled into the client.
 */
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "@/lib/mdx-components";
import { mdxOptions } from "@/lib/mdx";

interface MdxContentProps {
  source: string;
}

export function MdxContent({ source }: MdxContentProps) {
  return (
    <div className="prose-content">
      <MDXRemote
        source={source}
        components={mdxComponents}
        options={{ mdxOptions }}
      />
    </div>
  );
}
