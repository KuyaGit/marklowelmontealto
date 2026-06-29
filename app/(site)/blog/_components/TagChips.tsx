import Link from "next/link";
import { slugify } from "@/lib/blog";

interface TagChipsProps {
  tags: string[];
  category?: string;
  className?: string;
}

export function TagChips({ tags, category, className = "" }: TagChipsProps) {
  if (!category && tags.length === 0) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {category && (
        <Link
          href={`/blog/category/${slugify(category)}`}
          className="text-xs font-semibold tracking-wide uppercase text-accent border border-accent/30 rounded-full px-2.5 py-0.5 hover:bg-accent/5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {category}
        </Link>
      )}
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/blog/tag/${slugify(tag)}`}
          className="text-xs font-medium text-foreground/50 border border-border rounded-full px-2.5 py-0.5 hover:border-foreground/30 hover:text-foreground/80 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          {tag}
        </Link>
      ))}
    </div>
  );
}
