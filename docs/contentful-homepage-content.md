# Contentful: Homepage Long-Form Content Schema

The following content types and field additions will allow the editorial sections
of the homepage to be managed in Contentful rather than hardcoded in
`app/(site)/page.tsx`.

**Current state:** About Me, Professional Summary, Services, FAQ answers, and the
Testimonials section are hardcoded constants at the top of `page.tsx`. They render
immediately on the SSR homepage and are fully indexed by search crawlers.

**Migration target:** once these content types are populated in Contentful, swap
the hardcoded arrays for Contentful fetchers (see each section below for the
corresponding `lib/contentful.ts` additions).

---

## Part 1 — Additions to the `profile` content type

These two fields extend the existing singleton `profile` entry.

### 1a — `aboutLong` (About Me paragraphs)

1. Open **Content model → profile**
2. Click **Add field → Text → Long text**
3. Set:
   - **Name:** `About (long)`
   - **Field ID:** `aboutLong` ← exact ID required
   - **Appearance tab:** choose **Rich text** editor (supports paragraph breaks,
     links, and emphasis)
4. Leave Required **unchecked** — the page falls back to hardcoded copy while this
   field is empty
5. Click **Confirm**, then **Save**

### 1b — `professionalSummary` (Professional Summary paragraphs)

1. Click **Add field → Text → Long text**
2. Set:
   - **Name:** `Professional Summary`
   - **Field ID:** `professionalSummary` ← exact ID required
   - **Appearance tab:** choose **Rich text** or **Markdown** (either works;
     Markdown is simpler for plain paragraphs)
3. Leave Required **unchecked**
4. Click **Confirm**, then **Save**

### Corresponding `lib/contentful.ts` changes

Add both fields to the `Profile` type in `lib/types.ts`:

```ts
// lib/types.ts
export type Profile = {
  // ... existing fields ...
  aboutLong?: Document;        // Contentful Rich Text
  professionalSummary?: string; // Markdown string
};
```

Update `getProfile()` in `lib/contentful.ts` to include both fields in the
field selection and parse `aboutLong` as a `Document` (same pattern as the
existing `body` field on `blogPost`).

In `app/(site)/page.tsx`, replace the hardcoded `<p>` blocks in the "About me"
and "Professional summary" sections with a `<RichText document={profile.aboutLong} />`
and a Markdown-rendered `professionalSummary` respectively, falling back to the
current hardcoded JSX when those fields are absent.

---

## Part 2 — New content type: `service`

### Step 1 — Create the content type

1. Go to **Content model → Add content type**
2. Set:
   - **Name:** `Service`
   - **API identifier:** `service` ← exact ID required
3. Click **Create**

### Step 2 — Add fields

| UI Name | Field ID | Contentful type | Required |
|---|---|---|---|
| Title | `title` | Short text | Yes |
| Description | `description` | Long text (Markdown) | Yes |
| Order | `order` | Integer | Yes |
| Icon | `icon` | Short text | No |

**Title:** the service name, e.g. "Full-Stack Web Development".

**Description:** 40–80 word natural-language description of the service.

**Order:** integer controlling display order (1 = first). Ascending.

**Icon:** optional short string for an icon key (e.g. a tech icon name from
`components/icons`). Reserved for future UI use.

### Step 3 — Populate entries

Create one entry per service (same four as the current hardcoded `SERVICES`
array in `page.tsx`). Publish each entry.

### Corresponding `lib/contentful.ts` changes

Add the type to `lib/types.ts`:

```ts
// lib/types.ts
export type Service = {
  title: string;
  description: string;
  order: number;
  icon?: string;
};
```

Add the fetcher to `lib/contentful.ts` (mirror `getWorks`):

```ts
export const getServices = unstable_cache(
  async (): Promise<Service[]> => {
    const client = getClient();
    const res = await client.getEntries<EntrySkeletonType>({
      content_type: "service",
      order: ["fields.order"],
    });
    return res.items.map((item) => ({
      title: item.fields.title as string,
      description: item.fields.description as string,
      order: item.fields.order as number,
      icon: item.fields.icon as string | undefined,
    }));
  },
  ["services"],
  { revalidate: 300, tags: ["contentful", "services"] }
);
```

In `app/(site)/page.tsx`, replace the hardcoded `SERVICES` constant with
`await getServices()` (add to the `Promise.all` block).

---

## Part 3 — New content type: `testimonial`

### Step 1 — Create the content type

1. Go to **Content model → Add content type**
2. Set:
   - **Name:** `Testimonial`
   - **API identifier:** `testimonial` ← exact ID required
3. Click **Create**

### Step 2 — Add fields

| UI Name | Field ID | Contentful type | Required |
|---|---|---|---|
| Quote | `quote` | Long text | Yes |
| Author name | `author` | Short text | Yes |
| Role / title | `role` | Short text | Yes |
| Company | `company` | Short text | No |
| Avatar | `avatar` | Media (image) | No |
| Order | `order` | Integer | Yes |

**Quote:** the full testimonial text (1–4 sentences). No quotation marks needed
— the UI adds them.

**Role:** the author's job title at the time of the testimonial,
e.g. "Engineering Manager".

**Order:** integer controlling display order (1 = first).

### Step 3 — Populate entries

Collect testimonials from past clients or collaborators, get explicit permission
to publish, then create one entry per testimonial. Publish each entry.

### Corresponding `lib/contentful.ts` changes

Add the type to `lib/types.ts`:

```ts
// lib/types.ts
export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  order: number;
};
```

Add the fetcher:

```ts
export const getTestimonials = unstable_cache(
  async (): Promise<Testimonial[]> => {
    const client = getClient();
    const res = await client.getEntries<EntrySkeletonType>({
      content_type: "testimonial",
      order: ["fields.order"],
    });
    return res.items.map((item) => ({
      quote: item.fields.quote as string,
      author: item.fields.author as string,
      role: item.fields.role as string,
      company: item.fields.company as string | undefined,
      avatar: (item.fields.avatar as { fields: { file: { url: string } } } | undefined)
        ?.fields.file.url,
      order: item.fields.order as number,
    }));
  },
  ["testimonials"],
  { revalidate: 300, tags: ["contentful", "testimonials"] }
);
```

In `app/(site)/page.tsx`, replace the placeholder testimonials section with a
grid of testimonial cards driven by `await getTestimonials()`. Only render the
section when the array is non-empty; preserve the placeholder when it is empty.

---

## Part 4 — New content type: `faqItem`

### Step 1 — Create the content type

1. Go to **Content model → Add content type**
2. Set:
   - **Name:** `FAQ Item`
   - **API identifier:** `faqItem` ← exact ID required
3. Click **Create**

### Step 2 — Add fields

| UI Name | Field ID | Contentful type | Required |
|---|---|---|---|
| Question | `question` | Short text | Yes |
| Answer | `answer` | Long text (Markdown) | Yes |
| Order | `order` | Integer | Yes |

**Question:** the full question string, e.g. "Where are you based, and do you
work remotely?".

**Answer:** plain-text answer (Markdown but avoid formatting — the JSON-LD
`FAQPage` `acceptedAnswer.text` must be plain text, and rendering Markdown in
the JSON-LD node adds unwanted markup). Keep answers to 2–4 sentences.

**Important:** the visible on-page text and the `acceptedAnswer.text` in the
`FAQPage` JSON-LD must match exactly. `buildFaqGraph` in `lib/jsonld.ts` takes
the same `FaqItem[]` array used for visual rendering — as long as both come from
the same Contentful data, parity is guaranteed.

### Step 3 — Populate entries

Recreate the seven FAQ items currently hardcoded in `page.tsx` as Contentful
entries so the CMS becomes the single source of truth. Publish each entry.

### Corresponding `lib/contentful.ts` changes

Add the type to `lib/types.ts`:

```ts
// lib/types.ts — FaqItem matches the existing interface in lib/jsonld.ts
export type FaqItem = {
  question: string;
  answer: string;
  order: number;
};
```

Add the fetcher:

```ts
export const getFaqs = unstable_cache(
  async (): Promise<FaqItem[]> => {
    const client = getClient();
    const res = await client.getEntries<EntrySkeletonType>({
      content_type: "faqItem",
      order: ["fields.order"],
    });
    return res.items.map((item) => ({
      question: item.fields.question as string,
      answer: item.fields.answer as string,
      order: item.fields.order as number,
    }));
  },
  ["faqs"],
  { revalidate: 300, tags: ["contentful", "faqs"] }
);
```

In `app/(site)/page.tsx`, replace the hardcoded `FAQS` constant with
`await getFaqs()` (add to the `Promise.all` block). The `buildFaqGraph(FAQS)`
call is already imported and wired — just pass the Contentful data instead.

---

## Migration checklist

- [ ] Add `aboutLong` and `professionalSummary` to the `profile` content type
- [ ] Populate both fields on the existing profile entry and publish
- [ ] Create `service` content type with 4 fields; create and publish 4 entries
- [ ] Create `testimonial` content type with 6 fields; collect and publish entries
- [ ] Create `faqItem` content type with 3 fields; create and publish 7 entries
- [ ] Update `lib/types.ts` with the new types
- [ ] Add `getServices`, `getTestimonials`, `getFaqs` to `lib/contentful.ts`
- [ ] Update `app/(site)/page.tsx` to fetch from Contentful and remove hardcoded arrays
- [ ] Verify `buildFaqGraph` still receives the correct plain-text answers
- [ ] Run `npm run build` to confirm no TypeScript errors
- [ ] Trigger a Contentful webhook revalidation (`POST /api/revalidate`) after publishing
