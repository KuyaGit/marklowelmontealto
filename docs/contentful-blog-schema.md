# Contentful `blogPost` Schema Changes

Follow these steps in the Contentful web app to add MDX support, tags, and categories to
the existing `blogPost` content type. All existing fields stay — this is purely additive.

---

## Step 1 — Open the blogPost content model

1. Log in at **https://app.contentful.com**
2. Select your space → **Content model** (top nav)
3. Click **blogPost** in the content type list

---

## Step 2 — Add the Body (MDX) field

1. Click **Add field**
2. Choose **Text → Long text**
3. Set:
   - **Name:** `Body (MDX)`
   - **Field ID:** `bodyMdx` ← exact ID required
   - **Appearance tab:** choose **Markdown** editor (makes authoring MDX comfortable)
4. Leave Required **unchecked** during the migration period (posts without `bodyMdx` will
   fall back to the legacy Rich Text `body` field automatically)
5. Click **Confirm**, then **Save**

> After all posts are migrated, return here and mark `bodyMdx` as **Required** and
> deprecate/delete the old `body` field.

---

## Step 3 — Add the Tags field

1. Click **Add field**
2. Choose **Text → Short text, list**
3. Set:
   - **Name:** `Tags`
   - **Field ID:** `tags` ← exact ID required
4. **Validations tab:**
   - Prohibit expression: ✓ — pattern `^[A-Za-z0-9 \-]+$` with message
     _"Tags may only contain letters, numbers, spaces, and hyphens"_
   - Maximum length: `32` characters per item
5. Leave Required **unchecked**
6. Click **Confirm**, then **Save**

**Tagging convention:** use kebab-friendly values — e.g. `Next.js`, `AWS`, `CI/CD`,
`TypeScript`. The site slugifies them automatically for URLs (`/blog/tag/nextjs`).

---

## Step 4 — Add the Category field

1. Click **Add field**
2. Choose **Text → Short text**
3. Set:
   - **Name:** `Category`
   - **Field ID:** `category` ← exact ID required
4. **Validations tab:**
   - Predefined values: ✓ — enter exactly (one per line):
     ```
     Frontend
     Backend
     DevOps
     Cloud
     ```
   - Add more as needed — just extend the list here **and** in `lib/contentful.ts`
5. Recommended: mark Required **checked**
6. Click **Confirm**, then **Save**

**Model:** one category per post (broad bucket → `/blog/category/frontend`).
Tags are many-per-post (fine-grained → `/blog/tag/typescript`).

---

## Step 5 — Migrate existing posts

For each existing post:

1. Open the post entry
2. In the **Body (MDX)** field, paste the Markdown/MDX equivalent of the current Rich Text
   body. Code blocks use triple backticks with a language tag:
   ````
   ```typescript
   const greeting = "hello";
   ```
   ````
3. Set a **Category** from the dropdown
4. Enter comma-separated **Tags** in the tags field (Contentful shows a list UI)
5. **Publish** the entry

The site will continue serving the old Rich Text rendering for any post without `bodyMdx`
content — so there is no downtime during the migration.

---

## Step 6 — Finalize (after all posts migrated)

1. Return to the `blogPost` content model
2. Mark `bodyMdx` as **Required**
3. Optionally: hide or delete the legacy `body` (Rich Text) field — the code fallback will
   silently skip it once `bodyMdx` is present on every post

---

## Field reference summary

| UI Name | Field ID | Contentful Type | Required (post-migration) |
|---|---|---|---|
| Body (MDX) | `bodyMdx` | Long text (Markdown editor) | Yes |
| Tags | `tags` | Short text, list | No |
| Category | `category` | Short text (predefined values) | Yes |

All other existing fields (`title`, `slug`, `excerpt`, `date`, `coverImage`, `isFeatured`,
`body`) are **unchanged**.
