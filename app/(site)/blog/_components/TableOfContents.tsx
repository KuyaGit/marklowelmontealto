"use client";

import { useEffect, useRef, useState } from "react";
import type { TocEntry } from "@/lib/toc";

interface TableOfContentsProps {
  entries: TocEntry[];
}

export function TableOfContents({ entries }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!entries.length) return;

    const headingEls = entries
      .map(({ slug }) => document.getElementById(slug))
      .filter((el): el is HTMLElement => el !== null);

    if (!headingEls.length) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSlug(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "-20% 0% -70% 0%",
        threshold: 0,
      }
    );

    headingEls.forEach((el) => observerRef.current?.observe(el));

    return () => observerRef.current?.disconnect();
  }, [entries]);

  if (!entries.length) return null;

  return (
    <nav aria-label="Table of contents" className="text-xs">
      <p className="font-semibold tracking-widest uppercase text-foreground/40 mb-3">
        On this page
      </p>
      <ol className="space-y-2">
        {entries.map(({ slug, value, depth }) => (
          <li key={slug} className={depth === 3 ? "pl-3" : ""}>
            <a
              href={`#${slug}`}
              className={`block leading-snug transition-colors duration-150 hover:text-foreground ${
                activeSlug === slug
                  ? "text-foreground font-medium"
                  : "text-foreground/40"
              }`}
            >
              {value}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
