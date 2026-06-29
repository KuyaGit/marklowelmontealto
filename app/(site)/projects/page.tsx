import type { Metadata } from "next";
import Link from "next/link";
import { SectionBar } from "@/components/SectionBar";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Full stack developer projects by Mark Lowel Montealto — web apps built with Angular, React, Next.js, Node.js, AWS, and Docker.",
  path: "/projects",
  keywords: [
    "Mark Lowel Montealto",
    "Full Stack Developer",
    "React Developer",
    "Angular Developer",
    "Laravel Developer",
    "Terraform Developer",
  ],
  ogDescription:
    "A showcase of full stack development projects: DevOps dashboards, inspection systems, and more — built with Angular, TypeScript, AWS, and Next.js.",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: "/projects",
          name: "Projects — Mark Lowel Montealto",
          description:
            "Full stack developer projects by Mark Lowel Montealto — web apps built with Angular, React, Next.js, Node.js, AWS, and Docker.",
          type: "CollectionPage",
        })}
      />
      <h1 className="sr-only">
        Mark Lowel Montealto — Full Stack Developer Projects: Angular, React, Laravel &amp; Terraform
      </h1>
      <SectionBar title="Projects" />

      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {/* Internal links */}
        <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
          <Link
            href="/works"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Work experience <ArrowRightIcon size={13} />
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            About me <ArrowRightIcon size={13} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Get in touch <ArrowRightIcon size={13} />
          </Link>
        </div>
      </div>
    </>
  );
}
