/**
 * JsonLd — renders a <script type="application/ld+json"> block.
 *
 * This is a React Server Component (no "use client") — it SSRs immediately
 * and is invisible to the JS bundle. Use it inside any page or layout to
 * inject structured data for SEO crawlers.
 *
 * The `<` → `<` replacement prevents accidental script injection if
 * any string value contains a literal `<` character.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
