import { createClient } from "contentful";
import { unstable_cache } from "next/cache";
import type { Post, Project, TechKey, Work, Certificate, Profile } from "./types";
import { slugify } from "./blog";

// ---------------------------------------------------------------------------
// Client (singleton – server-only, no NEXT_PUBLIC_ prefix)
// ---------------------------------------------------------------------------

function getClient() {
  const space = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const environment = process.env.CONTENTFUL_ENVIRONMENT ?? "master";

  if (!space || !accessToken) {
    throw new Error(
      "Missing Contentful env vars: CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN are required."
    );
  }

  return createClient({ space, accessToken, environment });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalise protocol-relative Contentful asset URLs to https:// */
function assetUrl(raw: string | undefined): string {
  if (!raw) return "";
  return raw.startsWith("//") ? `https:${raw}` : raw;
}

// ---------------------------------------------------------------------------
// Profile (singleton entry)
// ---------------------------------------------------------------------------

export const getProfile = unstable_cache(
  async (): Promise<Profile> => {
    const client = getClient();
    const result = await client.getEntries({ content_type: "profile", limit: 1 });
    const entry = result.items[0];
    if (!entry) throw new Error("No profile entry found in Contentful.");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = entry.fields as Record<string, any>;

    // skills: may be a Short text list (array split by Contentful on commas)
    // or a Long/Short text field (single string). Normalise to string[].
    const rawSkills: string[] = Array.isArray(f.skills)
      ? f.skills
      : typeof f.skills === "string"
      ? [f.skills]
      : [];

    // Parse structured skills – Contentful stores as array of "Category: item1, item2" or
    // as a JSON field. Fallback: wrap every string as an individual "Skills" group.
    const skills: Profile["skills"] = parseSkills(rawSkills);

    return {
      name: f.name ?? "",
      role: f.role ?? "",
      dateLine: f.dateLine ?? "",
      intro: f.intro ?? "",
      bioCommunity: f.bioCommunity ?? "",
      location: f.location ?? "",
      email: f.email ?? "",
      avatar: assetUrl(f.avatar?.fields?.file?.url),
      resume: f.resume?.fields?.file?.url
        ? assetUrl(f.resume.fields.file.url)
        : "",
      social: {
        facebook: f.social?.facebook ?? "",
        linkedin: f.social?.linkedin ?? "",
        github: f.social?.github ?? "",
        onlinejobs: f.social?.onlinejobs ?? "",
        upwork: f.social?.upwork ?? "",
        youtube: f.social?.youtube ?? "",
      },
      skills,
      knowsAbout: Array.isArray(f.knowsAbout) ? f.knowsAbout : [],
      worksForOrg: f.worksForOrg ?? "",
      communityOrg: f.communityOrg ?? "",
      communityOrgUrl: f.communityOrgUrl ?? "",
    };
  },
  ["profile"],
  { tags: ["contentful", "profile"], revalidate: 300 }
);

/**
 * Parse the skills stored in Contentful.
 * Contentful's "Short text, list" field splits on commas, so the stored string
 * "Frontend: Angular, TypeScript|Backend: Node.js" arrives as the array
 * ["Frontend: Angular", " TypeScript|Backend: Node.js"]. Rejoining on commas
 * restores the original string before splitting on "|".
 * Also handles a plain string field (Long text / Short text single).
 */
function parseSkills(raw: string[]): Profile["skills"] {
  const fullString = raw.join(",");
  const entries = fullString.split("|").map((e) => e.trim()).filter(Boolean);
  const grouped: Record<string, string[]> = {};
  for (const entry of entries) {
    const colonIdx = entry.indexOf(":");
    if (colonIdx > 0) {
      const cat = entry.slice(0, colonIdx).trim();
      const items = entry
        .slice(colonIdx + 1)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      grouped[cat] = [...(grouped[cat] ?? []), ...items];
    }
  }
  return Object.entries(grouped).map(([category, items]) => ({
    category,
    items,
  }));
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------

export const getPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const client = getClient();
    const result = await client.getEntries({
      content_type: "blogPost",
      order: ["-fields.date"],
    });

    return result.items.map((entry) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = entry.fields as Record<string, any>;
      return {
        slug: f.slug ?? "",
        title: f.title ?? "",
        excerpt: f.excerpt ?? "",
        date: f.date ?? "",
        body: f.body,
        bodyMdx: typeof f.bodyMdx === "string" ? f.bodyMdx : undefined,
        coverImage: assetUrl(f.coverImage?.fields?.file?.url),
        isFeatured: f.isFeatured ?? false,
        tags: Array.isArray(f.tags) ? f.tags : [],
        category: typeof f.category === "string" ? f.category : undefined,
      };
    });
  },
  ["posts"],
  { tags: ["contentful", "posts"], revalidate: 300 }
);

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<Post | null> => {
    const client = getClient();
    const result = await client.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
    });

    const entry = result.items[0];
    if (!entry) return null;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const f = entry.fields as Record<string, any>;
    return {
      slug: f.slug ?? "",
      title: f.title ?? "",
      excerpt: f.excerpt ?? "",
      date: f.date ?? "",
      body: f.body,
      bodyMdx: typeof f.bodyMdx === "string" ? f.bodyMdx : undefined,
      coverImage: assetUrl(f.coverImage?.fields?.file?.url),
      isFeatured: f.isFeatured ?? false,
      tags: Array.isArray(f.tags) ? f.tags : [],
      category: typeof f.category === "string" ? f.category : undefined,
    };
  },
  ["post-by-slug"],
  { tags: ["contentful", "posts"], revalidate: 300 }
);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export const getProjects = unstable_cache(
  async (): Promise<Project[]> => {
    const client = getClient();
    const result = await client.getEntries({ content_type: "projects" });

    return result.items.map((entry) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = entry.fields as Record<string, any>;
      return {
        slug: f.slug ?? "",
        name: f.name ?? "",
        description: f.description ?? undefined,
        liveUrl: f.liveUrl ?? "",
        techStack: (f.techStack ?? []) as TechKey[],
        image: assetUrl(f.image?.fields?.file?.url),
        isFeatured: f.isFeatured ?? false,
      };
    });
  },
  ["projects"],
  { tags: ["contentful", "projects"], revalidate: 300 }
);

// ---------------------------------------------------------------------------
// Works
// ---------------------------------------------------------------------------

export const getWorks = unstable_cache(
  async (): Promise<Work[]> => {
    const client = getClient();
    const result = await client.getEntries({
      content_type: "work",
      order: ["fields.order"],
    });
    
    return result.items.map((entry) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = entry.fields as Record<string, any>;
      return {
        slug: f.slug ?? "",
        title: f.title ?? "",
        company: f.company ?? "",
        period: f.period ?? "",
        description: f.description ?? "",
        order: f.order ?? undefined,
        image: assetUrl(f.image?.fields?.file?.url),
        isFeatured: f.isFeatured ?? false,
      };
    });
  },
  ["works"],
  { tags: ["contentful", "works"], revalidate: 300 }
);

// ---------------------------------------------------------------------------
// Certificates
// ---------------------------------------------------------------------------

export const getCertificates = unstable_cache(
  async (): Promise<Certificate[]> => {
    const client = getClient();
    const result = await client.getEntries({
      content_type: "certificate",
      order: ["-fields.date"],
    });

    return result.items.map((entry) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const f = entry.fields as Record<string, any>;
      return {
        slug: f.slug ?? f.title ?? "",
        title: f.title ?? "",
        issuer: f.issuer ?? "",
        date: f.date ?? "",
        description: f.description ?? "",
        image: assetUrl(f.image?.fields?.file?.url),
        verifiedUrl: f.verifiedUrl ?? "",
        isFeatured: f.isFeatured ?? false,
        credentialId: f.credentialId ?? "",
        // Contentful can store skills as a comma-separated Short text field
        // or as a native Short text, list field — handle both gracefully.
        skills:
          typeof f.skills === "string"
            ? f.skills.split(",").map((s: string) => s.trim()).filter(Boolean)
            : Array.isArray(f.skills)
              ? (f.skills as string[])
              : [],
      };
    });
  },
  ["certificates"],
  { tags: ["contentful", "certificates"], revalidate: 300 }
);

// ---------------------------------------------------------------------------
// Tag & category derivations (derived from cached getPosts() — no extra fetch)
// ---------------------------------------------------------------------------

/** Returns all unique tag slugs derived from published posts. */
export async function getAllTags(): Promise<string[]> {
  const posts = await getPosts();
  const slugSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      const s = slugify(tag);
      if (s) slugSet.add(s);
    }
  }
  return Array.from(slugSet).sort();
}

/** Returns all unique category slugs derived from published posts. */
export async function getAllCategories(): Promise<string[]> {
  const posts = await getPosts();
  const slugSet = new Set<string>();
  for (const post of posts) {
    if (post.category) {
      const s = slugify(post.category);
      if (s) slugSet.add(s);
    }
  }
  return Array.from(slugSet).sort();
}

/** Returns posts that have a given tag (matched by slug). */
export async function getPostsByTag(tagSlug: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.tags.some((t) => slugify(t) === tagSlug));
}

/** Returns posts that belong to a given category (matched by slug). */
export async function getPostsByCategory(categorySlug: string): Promise<Post[]> {
  const posts = await getPosts();
  return posts.filter((p) => p.category && slugify(p.category) === categorySlug);
}
