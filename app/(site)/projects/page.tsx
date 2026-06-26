import type { Metadata } from "next";
import { SectionBar } from "@/components/SectionBar";
import { ProjectCard } from "@/components/ProjectCard";
import { getProjects } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Full stack developer projects by Mark Lowel Montealto — web apps built with Angular, React, Next.js, Node.js, AWS, and Docker.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Mark Lowel Montealto",
    description:
      "A showcase of full stack development projects: DevOps dashboards, inspection systems, and more — built with Angular, TypeScript, AWS, and Next.js.",
    url: "/projects",
  },
  twitter: {
    title: "Projects — Mark Lowel Montealto",
    description:
      "Full stack and DevOps projects by Mark Lowel Montealto — Angular, TypeScript, AWS, Next.js.",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
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
