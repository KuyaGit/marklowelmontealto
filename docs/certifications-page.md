# Certifications Page — Enhancement Guide

Full step-by-step record of the changes made to enhance the `/certificate` page with
Credential ID, Skills learned, per-certificate JSON-LD, and visible breadcrumbs.

---

## Background

The portfolio ships a working `/certificate` listing page backed by a Contentful
`certificate` content type. This enhancement adds the fields and UI required for a
more professional certifications page:

| Requirement | Status before | After this change |
|---|---|---|
| Issuing organization | ✅ rendered | ✅ (unchanged) |
| Issue date | ✅ rendered | ✅ (unchanged) |
| Credential ID | ❌ missing | ✅ optional, rendered when present |
| Skills learned | ❌ missing | ✅ optional, rendered as pill badges |
| Verification link | ✅ rendered | ✅ (unchanged) |
| SEO metadata | ✅ via `buildMetadata` | ✅ (unchanged) |
| Page JSON-LD (CollectionPage) | ✅ via `buildPageGraph` | ✅ (unchanged) |
| Per-certificate JSON-LD | ❌ missing | ✅ `EducationalOccupationalCredential` |
| Breadcrumbs (JSON-LD) | ✅ via `buildPageGraph` | ✅ (unchanged) |
| Breadcrumbs (visible UI) | ❌ missing | ✅ `<Breadcrumbs>` component |

---

## Files Changed

### 1. `lib/types.ts` — `Certificate` type

Added two optional fields:

```ts
/** Issuer-provided credential or license number. */
credentialId?: string;
/** Skills demonstrated by this credential. */
skills?: string[];
```

Fields are optional so existing certificates without them keep rendering unchanged.

---

### 2. `lib/contentful.ts` — `getCertificates` fetcher

Inside the `.map()` that transforms each Contentful entry, added:

```ts
credentialId: f.credentialId ?? "",
skills:
  typeof f.skills === "string"
    ? f.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(f.skills)
      ? (f.skills as string[])
      : [],
```

The `skills` mapping handles both a **comma-separated Short text** field and a
native Contentful **list** field, so either content-model choice works.

---

### 3. `lib/jsonld.ts` — `buildCertificationsGraph`

New exported function that takes `Certificate[]` and emits an `ItemList` of
`EducationalOccupationalCredential` nodes — the schema.org type Google uses for
certifications and licenses.

```ts
export function buildCertificationsGraph(certs: Certificate[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/certificate#credentials`,
    itemListElement: certs.map((cert, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "EducationalOccupationalCredential",
        name: cert.title,
        credentialCategory: "certificate",
        ...(cert.credentialId && { identifier: cert.credentialId }),
        ...(cert.date && { dateCreated: cert.date }),
        recognizedBy: { "@type": "Organization", name: cert.issuer },
        ...(cert.verifiedUrl && { url: cert.verifiedUrl }),
        ...(cert.skills?.length && { competencyRequired: cert.skills }),
        about: { "@id": `${SITE_URL}/#person` },
      },
    })),
  };
}
```

This is rendered **alongside** (not replacing) the existing `buildPageGraph`
`CollectionPage` + `BreadcrumbList` block.

---

### 4. `components/Breadcrumbs.tsx` — New reusable component

A pure Server Component (no `"use client"`) that renders a `<nav aria-label="Breadcrumb">`
with an ordered list. API:

```tsx
type BreadcrumbItem = {
  label: string;
  href?: string;  // omit on the last (current-page) crumb
};

<Breadcrumbs items={[
  { label: "Home", href: "/about" },
  { label: "Certificates" },
]} />
```

Design details:
- Last crumb: plain text with `aria-current="page"` (not a link — follows Google's
  recommendation that the current page should not be linked in its own breadcrumb,
  mirrored in the `buildBreadcrumbs` JSON-LD helper).
- First crumb: shows a `HomeIcon` inline.
- Separators: `ChevronRightIcon` between crumbs.
- Tokens: `text-muted`, `text-foreground`, `border-border`, `hover:text-foreground transition-colors`.

---

### 5. `app/(site)/certificate/page.tsx` — Page redesign

Key changes:
1. Import and render `<Breadcrumbs>` below `<SectionBar>`.
2. Import `buildCertificationsGraph`; add a second `<JsonLd>` block.
3. Card redesign — added three new conditional sections inside each `<article>`:
   - **Credential ID**: `font-mono text-xs text-muted` — rendered only when
     `cert.credentialId` is truthy.
   - **Skills**: a flex-wrap row of pill badges (`rounded-full border border-border
     px-2.5 py-0.5 text-foreground/70`) — rendered only when `cert.skills?.length > 0`.
   - Both sections use `sr-only` `<p>` / `<h4>` labels for screen readers.
4. All existing fields (issuer, date, description, "Featured" badge, verify link,
   internal-links footer) are retained.

---

## Contentful Content Model — New Fields

Add these two fields to the **certificate** content type
(`CONTENTFUL_SETUP.md` has been updated):

| Field ID | Display name | Type | Required | Notes |
|---|---|---|---|---|
| `credentialId` | Credential ID | Short text | | Issuer-provided number, e.g. `ABC-1234-XYZ` |
| `skills` | Skills | Short text | | Comma-separated, e.g. `AWS, Cloud Security, Terraform` |

**Steps in Contentful:**

1. Open your space → **Content model** → **certificate**.
2. **Add field → Short text** → Field ID: `credentialId`, Display name: "Credential ID".
3. **Add field → Short text** → Field ID: `skills`, Display name: "Skills".
   - In the field settings, add a helptext: "Comma-separated list of skills, e.g. `AWS, Cloud Security, Terraform`".
4. **Save** the content type.
5. For existing entries: fill in the new fields if desired, then **Publish**.
   Entries without these fields will simply not display the credential ID or skill
   badges — no broken UI.

---

## Verification Checklist

- [ ] `npm run lint` — no ESLint errors.
- [ ] `npm run build` — production build succeeds (all RSC, no client-only content).
- [ ] `npm run dev`, open `http://localhost:3000/certificate`:
  - Breadcrumb trail **Home › Certificates** is visible; "Home" links to `/about`.
  - Existing certificate cards render correctly (no regressions on issuer, date, description, verify link, Featured badge).
  - Certs with `credentialId` show the monospaced credential line.
  - Certs with `skills` show the pill badge row.
  - Certs without either new field show no empty labels or broken layout.
- [ ] View source or DevTools → search for `EducationalOccupationalCredential` —
      the new `ItemList` JSON-LD block is present.
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) on
      `/certificate`:
  - `CollectionPage` valid.
  - `BreadcrumbList` valid.
  - New `ItemList` / `EducationalOccupationalCredential` items detected.
- [ ] `/sitemap.xml` still lists `/certificate` (no sitemap changes were needed —
      the entry was already present).

---

## No Changes Required To

- `data/nav.ts` — Certificate nav entry already exists.
- `components/Sidebar.tsx` — `AwardIcon` already mapped to `/certificate`.
- `app/sitemap.ts` — `/certificate` entry already registered.
- `lib/seo.ts` — `buildMetadata` used unchanged.
- `components/JsonLd.tsx` — used unchanged.
