import Image from "next/image";
import { BASE_PATH } from "@/lib/site";
import { ExternalLinkIcon, techIconMap, techIconLabel } from "@/components/icons";
import type { Project } from "@/lib/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="rounded-xl border border-border bg-surface overflow-hidden hover:border-foreground/20 transition-colors duration-200 flex flex-col">
      {/* Screenshot / Preview */}
      <div className="relative aspect-video w-full bg-surface-alt border-b border-border overflow-hidden">
        {project.image ? (
          <Image
            src={project.image.startsWith("http") ? project.image : `${BASE_PATH}${project.image}`}
            alt={`${project.name} screenshot`}
            fill
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-foreground/20">
            <svg
              width={40}
              height={40}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span className="text-xs font-medium tracking-wider uppercase">Preview</span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        {/* Name + description */}
        <div>
          <h3 className="font-bold text-sm text-foreground leading-snug">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-xs leading-relaxed text-foreground/60">{project.description}</p>
          )}
        </div>

        {/* Tech-stack icons */}
        {project.techStack.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {project.techStack.map((key) => {
              const Icon = techIconMap[key];
              return (
                <span
                  key={key}
                  title={techIconLabel[key]}
                  aria-label={techIconLabel[key]}
                  className="text-muted hover:text-foreground transition-colors duration-150"
                >
                  <Icon size={18} />
                </span>
              );
            })}
          </div>
        )}

        {/* Spacer + Live URL */}
        <div className="flex-1" />
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="self-start flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
        >
          <ExternalLinkIcon size={12} />
          Visit site
        </a>
      </div>
    </article>
  );
}
