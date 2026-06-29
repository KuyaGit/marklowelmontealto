import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function pageHref(page: number): string {
  return page === 1 ? "/blog" : `/blog/page/${page}`;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  // Build page number list — show up to 5 pages around current
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (
      (i === currentPage - 2 && currentPage - 2 > 1) ||
      (i === currentPage + 2 && currentPage + 2 < totalPages)
    ) {
      pages.push("…");
    }
  }
  // Deduplicate consecutive ellipses
  const deduped = pages.filter(
    (p, idx) => !(p === "…" && pages[idx - 1] === "…")
  );

  return (
    <nav
      aria-label="Blog pagination"
      className="flex items-center justify-center gap-1 py-6"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          aria-label="Previous page"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <ChevronLeftIcon size={14} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg text-foreground/20">
          <ChevronLeftIcon size={14} />
        </span>
      )}

      {/* Page numbers */}
      {deduped.map((p, idx) =>
        p === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="flex items-center justify-center w-8 h-8 text-xs text-foreground/30"
          >
            …
          </span>
        ) : (
          <Link
            key={p}
            href={pageHref(p)}
            aria-label={`Page ${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            className={`flex items-center justify-center w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              p === currentPage
                ? "bg-foreground text-background"
                : "border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          aria-label="Next page"
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-border text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-colors"
        >
          <ChevronRightIcon size={14} />
        </Link>
      ) : (
        <span className="flex items-center justify-center w-8 h-8 rounded-lg text-foreground/20">
          <ChevronRightIcon size={14} />
        </span>
      )}
    </nav>
  );
}
