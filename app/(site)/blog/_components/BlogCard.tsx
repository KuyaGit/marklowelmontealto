import Link from "next/link";
import type { Post } from "@/lib/types";
import { readingTime } from "@/lib/reading-time";
import { TagChips } from "./TagChips";

interface BlogCardProps {
  post: Post;
}

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function BlogCard({ post }: BlogCardProps) {
  const rt = post.bodyMdx ? readingTime(post.bodyMdx) : null;

  return (
    <article className="relative group p-4 sm:p-5 rounded-xl border border-border hover:border-foreground/20 transition-colors duration-200">
      {/* Stretched overlay — covers the card, sits below chips */}
      <Link
        href={`/blog/${post.slug}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={post.title}
      />

      <div className="flex items-start justify-between gap-4 mb-1.5">
        <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">
          {post.title}
        </h3>
        {post.isFeatured && (
          <span className="flex-shrink-0 text-xs font-semibold tracking-wider uppercase text-accent border border-accent/30 rounded-full px-2.5 py-0.5">
            Featured
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2">
        <p className="text-xs text-foreground/40 font-medium">
          {formatDate(post.date)}
        </p>
        {rt && (
          <>
            <span className="text-foreground/20 text-xs">·</span>
            <p className="text-xs text-foreground/40">{rt.text}</p>
          </>
        )}
      </div>

      <p className="text-sm leading-relaxed text-muted line-clamp-2 mb-3">
        {post.excerpt}
      </p>

      {(post.category || post.tags.length > 0) && (
        <TagChips tags={post.tags} category={post.category} className="relative z-10" />
      )}
    </article>
  );
}
