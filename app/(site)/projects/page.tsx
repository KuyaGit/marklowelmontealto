import type { Metadata } from "next";
import { SectionBar } from "@/components/SectionBar";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/contentful";
import { buildMetadata } from "@/lib/seo";

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
      </div>
    </>
  );
}
