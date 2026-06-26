import type { Metadata } from "next";
import { SectionBar } from "@/components/SectionBar";
import { getWorks } from "@/lib/contentful";

export const metadata: Metadata = {
  title: "Works",
  description:
    "Work experience of Mark Lowel Montealto — DevOps Engineer, Full Stack Developer, and Angular Developer across multiple companies in the Philippines.",
  alternates: { canonical: "/works" },
  openGraph: {
    title: "Works — Mark Lowel Montealto",
    description:
      "Professional experience in DevOps engineering, full-stack development, and Angular at Whitecloak Technologies, Pru Life UK, and more.",
    url: "/works",
  },
  twitter: {
    title: "Works — Mark Lowel Montealto",
    description:
      "DevOps, Full Stack, and Angular developer experience across multiple companies.",
  },
};

export default async function WorksPage() {
  const works = await getWorks();

  return (
    <>
      <SectionBar title="Work Experiences" />

      <div className="p-4 sm:p-6 space-y-3">
        {works.map((work) => (
          <article
            key={work.slug}
            className="p-4 sm:p-5 rounded-xl border border-border hover:border-foreground/20 transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-4 mb-1.5">
              <div>
                <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">
                  {work.title}
                </h3>
                <p className="text-xs font-semibold text-muted mt-0.5">
                  {work.company}
                </p>
              </div>
              {work.isFeatured && (
                <span className="flex-shrink-0 text-xs font-semibold tracking-wider uppercase text-accent border border-accent/30 rounded-full px-2.5 py-0.5">
                  Current
                </span>
              )}
            </div>
            <p className="text-xs text-foreground/40 font-medium mb-2.5">
              {work.period}
            </p>
            <p className="text-sm leading-relaxed text-foreground/70">
              {work.description}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}
