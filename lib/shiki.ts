/**
 * Fine-grained Shiki highlighter singleton.
 *
 * Only imports the specific theme and languages we need — NOT the full
 * `shiki` bundle (which ships all grammars/themes and can exceed the
 * Cloudflare 3 MiB worker bundle cap on its own).
 *
 * Import paths used:
 *   shiki/core          — createHighlighterCore (no bundled langs/themes)
 *   shiki/engine/oniguruma — WASM-based regex engine (~600 KB)
 *   shiki/langs/*       — explicit per-language grammars
 *   shiki/themes/*      — explicit per-theme definition
 */
import { createHighlighterCore } from "shiki/core";
import { createOnigurumaEngine } from "shiki/engine/oniguruma";
import type { HighlighterCore } from "@shikijs/core";

// ---------------------------------------------------------------------------
// Lang / theme imports — keep this list small to protect the worker bundle.
// Add a language here AND to the BundledLanguage union if you extend it.
// ---------------------------------------------------------------------------

import langTs from "shiki/langs/typescript.mjs";
import langTsx from "shiki/langs/tsx.mjs";
import langJs from "shiki/langs/javascript.mjs";
import langJsx from "shiki/langs/jsx.mjs";
import langBash from "shiki/langs/bash.mjs";
import langJson from "shiki/langs/json.mjs";
import langYaml from "shiki/langs/yaml.mjs";
import langSql from "shiki/langs/sql.mjs";
import langMd from "shiki/langs/markdown.mjs";
import langCss from "shiki/langs/css.mjs";
import themeGithubDark from "shiki/themes/github-dark.mjs";

// ---------------------------------------------------------------------------
// Singleton — one highlighter instance reused across all renders.
// The promise is module-level so it is created once and reused in all
// server components and ISR revalidation runs within the same worker isolate.
// ---------------------------------------------------------------------------

let highlighterPromise: Promise<HighlighterCore> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getHighlighter(): Promise<any> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighterCore({
      themes: [themeGithubDark],
      langs: [
        langTs, langTsx, langJs, langJsx,
        langBash, langJson, langYaml,
        langSql, langMd, langCss,
      ],
      engine: createOnigurumaEngine(import("shiki/wasm")),
    });
  }
  return highlighterPromise;
}
