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

export type Project = {
  slug: string;
  name: string;
  description?: string;
  liveUrl: string;
  techStack: TechKey[];
  /** Path under public/, e.g. "/assets/projects/foo.png". Empty string → "Preview" placeholder. */
  image: string;
  isFeatured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "devops-dashboard",
    name: "DevOps Monitoring Dashboard",
    description: "Real-time cloud infrastructure monitoring with alerting and cost analytics.",
    liveUrl: "https://marklowelmontealto.com",
    techStack: ["angular", "typescript", "aws", "docker", "nestjs"],
    image: "",
    isFeatured: true,
  },
  {
    slug: "inspection-app",
    name: "Outdoor Inspection System",
    description: "Field inspection management with Google Maps integration and route planning.",
    liveUrl: "https://marklowelmontealto.com",
    techStack: ["angular", "typescript", "nodejs", "postgresql"],
    image: "",
  },
  {
    slug: "portfolio-site",
    name: "Developer Portfolio",
    description: "SSR portfolio built with Next.js — fully optimised for SEO and Core Web Vitals.",
    liveUrl: "https://kuyagit.github.io/marklowelmontealto",
    techStack: ["nextjs", "react", "typescript", "tailwind"],
    image: "",
  },
];
