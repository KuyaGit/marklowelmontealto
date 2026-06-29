/**
 * Computes estimated reading time from an MDX/markdown source string.
 *
 * Strips common markdown syntax before counting words so that code fences,
 * links, and image tags don't inflate the word count.
 */
export interface ReadingTime {
  words: number;
  minutes: number;
  /** Human-readable label, e.g. "5 min read" */
  text: string;
}

const WORDS_PER_MINUTE = 220;

export function readingTime(source: string): ReadingTime {
  // Strip front matter (---…---) if present
  const withoutFrontmatter = source.replace(/^---[\s\S]*?---\n?/, "");

  const cleaned = withoutFrontmatter
    // Remove fenced code blocks (```…```)
    .replace(/```[\s\S]*?```/g, " ")
    // Remove inline code (`…`)
    .replace(/`[^`]*`/g, " ")
    // Remove HTML tags
    .replace(/<[^>]+>/g, " ")
    // Remove markdown images ![alt](url)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    // Remove markdown links [text](url) → keep link text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // Remove markdown headings (#, ##, etc.)
    .replace(/^#{1,6}\s+/gm, "")
    // Remove blockquote markers
    .replace(/^\s*>\s?/gm, "")
    // Remove horizontal rules
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // Remove emphasis/bold markers (*,**,_,__)
    .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned ? cleaned.split(" ").length : 0;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

  return {
    words,
    minutes,
    text: `${minutes} min read`,
  };
}
