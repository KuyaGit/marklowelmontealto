import type { Document } from "@contentful/rich-text-types";

export type TechKey =
  | "angular"
  | "react"
  | "nextjs"
  | "typescript"
  | "javascript"
  | "nodejs"
  | "nestjs"
  | "tailwind"
  | "aws"
  | "docker"
  | "postgresql"
  | "mysql";

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 8601 date string from Contentful (formatted on display). */
  date: string;
  /** Legacy Contentful Rich Text body — kept for fallback during MDX migration. */
  body?: Document;
  /** MDX/markdown source string — preferred over `body` when present. */
  bodyMdx?: string;
  coverImage?: string;
  isFeatured?: boolean;
  /** Fine-grained topic tags, e.g. ["TypeScript", "AWS"]. Slugified for URLs. */
  tags: string[];
  /** Broad category bucket, e.g. "Frontend" | "Backend" | "DevOps" | "Cloud". */
  category?: string;
};

export type Project = {
  slug: string;
  name: string;
  description?: string;
  liveUrl: string;
  techStack: TechKey[];
  /** Absolute URL (Contentful asset) or local public/ path. Empty → placeholder. */
  image: string;
  isFeatured?: boolean;
};

export type Work = {
  slug: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order?: number;
  image: string;
  isFeatured?: boolean;
};

export type Certificate = {
  slug: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
  image: string;
  verifiedUrl: string;
  isFeatured?: boolean;
};

export type Profile = {
  name: string;
  role: string;
  dateLine: string;
  intro: string;
  /** Continuation of the bio paragraph shown on the About page (community lead sentence etc.). */
  bioCommunity: string;
  location: string;
  email: string;
  avatar: string;
  resume: string;
  social: {
    facebook: string;
    linkedin: string;
    github: string;
    onlinejobs: string;
    upwork: string;
    youtube: string;
  };
  skills: Array<{
    category: string;
    items: string[];
  }>;
  /** Topics for JSON-LD Person.knowsAbout. */
  knowsAbout: string[];
  /** Current employer name for JSON-LD Person.worksFor. */
  worksForOrg: string;
  /** Community org name for JSON-LD Person.memberOf. */
  communityOrg: string;
  /** Community org URL for JSON-LD Person.memberOf. */
  communityOrgUrl: string;
  /** Plain-text paragraphs for the About Me section (extracted from Rich Text or Long Text). Falls back to hardcoded JSX when absent. */
  aboutLongText?: string;
  /** Markdown string — Professional Summary section. Falls back to hardcoded JSX when absent. */
  professionalSummary?: string;
};

export type Service = {
  title: string;
  description: string;
  order: number;
  icon?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
  order: number;
};

export type FaqItem = {
  question: string;
  answer: string;
};
