/**
 * MDX component map — maps HTML elements to styled React components.
 *
 * Mirrors the Tailwind classes used in components/RichText.tsx so that MDX
 * posts look identical to Rich Text posts. Extended with syntax-highlighted
 * code blocks and a CopyButton wrapper.
 */
import Link from "next/link";
import type { MDXComponents } from "mdx/types";
import { CopyButton } from "@/app/(site)/blog/_components/CopyButton";

export const mdxComponents: MDXComponents = {
  // ---------------------------------------------------------------------------
  // Headings — rehype-slug injects `id` props automatically
  // ---------------------------------------------------------------------------
  h2: ({ children, ...props }) => (
    <h2 className="text-xl font-bold text-foreground mt-8 mb-3 first:mt-0" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-base font-bold text-foreground mt-6 mb-2 first:mt-0" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-sm font-semibold text-foreground mt-4 mb-1.5 first:mt-0" {...props}>
      {children}
    </h4>
  ),

  // ---------------------------------------------------------------------------
  // Block elements
  // ---------------------------------------------------------------------------
  p: ({ children }) => (
    <p className="text-sm leading-relaxed text-foreground/80 mb-4 last:mb-0">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc list-inside space-y-1.5 mb-4 text-sm text-foreground/80 pl-2">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal list-inside space-y-1.5 mb-4 text-sm text-foreground/80 pl-2">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-accent/40 pl-4 italic text-foreground/60 my-4 text-sm">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-border my-6" />,

  // ---------------------------------------------------------------------------
  // Code — inline and block
  // ---------------------------------------------------------------------------
  /** Inline code — rendered by rehype-pretty-code when bypassInlineCode is off */
  code: ({ children, ...props }) => (
    <code
      className="font-mono text-sm bg-surface border border-border rounded px-1.5 py-0.5 text-accent"
      {...props}
    >
      {children}
    </code>
  ),
  /**
   * Fenced code blocks — rehype-pretty-code wraps them in <pre data-language="…">
   * We add a relative container with a CopyButton in the top-right corner.
   */
  pre: ({ children, ...props }) => (
    <div className="relative my-6 group">
      <pre
        className="overflow-x-auto rounded-xl border border-border bg-[#0d1117] p-4 text-sm leading-relaxed"
        {...props}
      >
        {children}
      </pre>
      <CopyButton />
    </div>
  ),

  // ---------------------------------------------------------------------------
  // Links — internal links use next/link, external open in a new tab
  // ---------------------------------------------------------------------------
  a: ({ href = "", children, ...props }) => {
    const isExternal = href.startsWith("http://") || href.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-2 hover:opacity-75 transition-opacity"
          {...props}
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href}
        className="text-accent underline underline-offset-2 hover:opacity-75 transition-opacity"
        {...props}
      >
        {children}
      </Link>
    );
  },

  // ---------------------------------------------------------------------------
  // Images — lazy-loaded with border, matches the RichText embedded-asset style
  // ---------------------------------------------------------------------------
  img: ({ src, alt = "", ...props }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="rounded-lg w-full my-6 border border-border"
      loading="lazy"
      {...props}
    />
  ),
};
