export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  isFeatured?: boolean;
};

export const posts: Post[] = [
  {
    slug: "cicd-github-actions",
    title: "Building CI/CD Pipelines with GitHub Actions",
    excerpt:
      "A practical guide to automating deployments with GitHub Actions — from environment setup and secrets management to multi-stage pipelines that cut deployment time by 40%.",
    date: "May 2026",
    isFeatured: true,
  },
  {
    slug: "angular-nestjs-scalable-apps",
    title: "Scalable Full Stack Apps with Angular and NestJS",
    excerpt:
      "How Angular and NestJS share TypeScript types end-to-end, enabling a single source of truth for your data models and dramatically reducing runtime errors.",
    date: "March 2026",
  },
  {
    slug: "aws-cloud-architecture-web-devs",
    title: "AWS Cloud Architecture Patterns for Web Developers",
    excerpt:
      "Practical AWS patterns — Lambda, S3, CloudFront, RDS — that every web developer should know to build cost-effective, highly available applications.",
    date: "January 2026",
  },
];
