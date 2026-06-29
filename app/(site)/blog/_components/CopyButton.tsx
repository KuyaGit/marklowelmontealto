"use client";

import { useState, useCallback, useRef } from "react";
import { CopyIcon, CheckIcon } from "@/components/icons";

/**
 * Copy-to-clipboard button for syntax-highlighted code blocks.
 *
 * Positioned absolutely in the top-right corner of a relative `<pre>` wrapper.
 * It walks up to the nearest `<pre>` sibling to get the code text.
 */
export function CopyButton() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Walk up from the button to find the sibling <pre> element
    const wrapper = e.currentTarget.closest(".group");
    const pre = wrapper?.querySelector("pre");
    const text = pre?.textContent ?? "";

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API not available (e.g. http dev)
    }
  }, []);

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy code"}
      className="absolute top-3 right-3 p-1.5 rounded-md text-foreground/40 hover:text-foreground/80 hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
    >
      {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
    </button>
  );
}
