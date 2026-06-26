import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES, MARKS } from "@contentful/rich-text-types";
import type { Document } from "@contentful/rich-text-types";
import type { Options } from "@contentful/rich-text-react-renderer";

const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <strong className="font-semibold text-foreground">{text}</strong>,
    [MARKS.ITALIC]: (text) => <em className="italic">{text}</em>,
    [MARKS.CODE]: (text) => (
      <code className="font-mono text-sm bg-surface border border-border rounded px-1.5 py-0.5 text-accent">
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="text-sm leading-relaxed text-foreground/80 mb-4 last:mb-0">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="text-xl font-bold text-foreground mt-8 mb-3 first:mt-0">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="text-base font-bold text-foreground mt-6 mb-2 first:mt-0">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <h4 className="text-sm font-semibold text-foreground mt-4 mb-1.5 first:mt-0">{children}</h4>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="list-disc list-inside space-y-1.5 mb-4 text-sm text-foreground/80 pl-2">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="list-decimal list-inside space-y-1.5 mb-4 text-sm text-foreground/80 pl-2">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (_node, children) => <li>{children}</li>,
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="border-l-2 border-accent/40 pl-4 italic text-foreground/60 my-4 text-sm">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="border-border my-6" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const url: string | undefined =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node.data?.target as any)?.fields?.file?.url;
      const alt: string =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (node.data?.target as any)?.fields?.title ?? "Image";
      if (!url) return null;
      const src = url.startsWith("//") ? `https:${url}` : url;
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="rounded-lg w-full my-6 border border-border"
          loading="lazy"
        />
      );
    },
    [INLINES.HYPERLINK]: (node, children) => (
      <a
        href={node.data.uri as string}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline underline-offset-2 hover:opacity-75 transition-opacity"
      >
        {children}
      </a>
    ),
  },
};

export function RichText({ document }: { document: Document }) {
  return (
    <div className="prose-content">
      {documentToReactComponents(document, options)}
    </div>
  );
}
