import Link from "next/link";
import { HomeIcon, ChevronRightIcon } from "@/components/icons";

export type BreadcrumbItem = {
  /** Human-readable label for this crumb. */
  label: string;
  /**
   * Href for the crumb link.  Omit on the last (current-page) crumb — it
   * is rendered as plain text with `aria-current="page"` instead of a link,
   * mirroring the convention in the `buildBreadcrumbs` JSON-LD helper.
   */
  href?: string;
};

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Visual breadcrumb trail rendered as a `<nav>` with an ordered list.
 *
 * - Pairs with the `BreadcrumbList` JSON-LD produced by `buildPageGraph`
 *   so the visible trail and the structured data stay in sync.
 * - The first item is always "Home" pointing to `/about` (the canonical
 *   landing page), consistent with the JSON-LD helper convention.
 * - The last crumb is `aria-current="page"` and not a link.
 * - Pure Server Component — no `"use client"` needed.
 *
 * @example
 * <Breadcrumbs items={[
 *   { label: "Home", href: "/about" },
 *   { label: "Certificates" },
 * ]} />
 */
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center px-4 sm:px-6 py-2.5 border-b border-border"
    >
      <ol className="flex items-center gap-1 text-xs text-muted flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={item.label} className="flex items-center gap-1">
              {/* Separator — skip before first crumb */}
              {!isFirst && (
                <ChevronRightIcon
                  size={12}
                  className="text-foreground/30 flex-shrink-0"
                />
              )}

              {isLast || !item.href ? (
                /* Current page — not a link */
                <span
                  aria-current="page"
                  className="font-medium text-foreground/80 truncate max-w-[180px]"
                >
                  {item.label}
                </span>
              ) : (
                /* Ancestor crumb — clickable link */
                <Link
                  href={item.href}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {isFirst && (
                    <HomeIcon size={12} className="flex-shrink-0" />
                  )}
                  <span>{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
