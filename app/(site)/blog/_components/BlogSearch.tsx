"use client";

import { useState, useEffect, useCallback } from "react";
import { BlogCard } from "./BlogCard";
import type { Post } from "@/lib/types";
import { SearchIcon, XIcon } from "@/components/icons";

interface SearchIndexEntry {
  slug: string;
  title: string;
  excerpt: string;
  tags: string[];
  category?: string;
  date: string;
}

export function BlogSearch() {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<SearchIndexEntry[]>([]);
  const [results, setResults] = useState<Post[] | null>(null);
  // Start as true — we always fetch on mount; avoids a setState-in-effect lint error
  const [loading, setLoading] = useState(true);

  // Load the search index on mount
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    fetch("/search-index.json", { signal: controller.signal })
      .then((r) => r.json())
      .then((data: SearchIndexEntry[]) => {
        if (!cancelled) {
          setIndex(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const handleSearch = useCallback(
    (q: string) => {
      setQuery(q);
      const trimmed = q.trim().toLowerCase();
      if (!trimmed) {
        setResults(null);
        return;
      }
      const matched = index.filter(
        (entry) =>
          entry.title.toLowerCase().includes(trimmed) ||
          entry.excerpt.toLowerCase().includes(trimmed) ||
          entry.tags.some((t) => t.toLowerCase().includes(trimmed)) ||
          (entry.category?.toLowerCase().includes(trimmed) ?? false)
      );
      // Cast minimal shape to Post (the BlogCard only uses these fields)
      setResults(
        matched.map((e) => ({
          slug: e.slug,
          title: e.title,
          excerpt: e.excerpt,
          tags: e.tags,
          category: e.category,
          date: e.date,
          isFeatured: false,
        }))
      );
    },
    [index]
  );

  const showResults = query.trim().length > 0;

  return (
    <div>
      {/* Search box */}
      <div className="relative mb-4">
        <SearchIcon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30 pointer-events-none"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search articles…"
          aria-label="Search blog articles"
          className="w-full pl-9 pr-9 py-2 text-sm bg-surface border border-border rounded-xl text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/30 transition-colors"
        />
        {query && (
          <button
            onClick={() => handleSearch("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60 transition-colors"
          >
            <XIcon size={12} />
          </button>
        )}
      </div>

      {/* Results */}
      {showResults && (
        <div className="mb-6">
          {loading ? (
            <p className="text-sm text-foreground/40 px-1">Loading…</p>
          ) : results && results.length > 0 ? (
            <>
              <p className="text-xs text-foreground/40 mb-3 px-1">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
              <div className="space-y-3">
                {results.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-foreground/40 px-1">
              No results for &ldquo;{query}&rdquo;.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
