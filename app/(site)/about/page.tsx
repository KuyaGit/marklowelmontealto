import type { Metadata } from "next";
import { SectionBar } from "@/components/SectionBar";
import { profile } from "@/data/profile";
import { ExternalLinkIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "About",
  description:
    "Mark Lowel Montealto — Full Stack Developer and DevOps Engineer based in Manila, Philippines. 4+ years experience in Angular, TypeScript, AWS, and CI/CD automation.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Mark Lowel Montealto",
    description:
      "Full Stack Developer and DevOps Engineer specializing in Angular, TypeScript, AWS, and CI/CD pipelines. Community Lead at Angular Philippines.",
    url: "/about",
  },
  twitter: {
    title: "About — Mark Lowel Montealto",
    description:
      "Full Stack Developer and DevOps Engineer — Angular, TypeScript, AWS, CI/CD.",
  },
};

const skills = [
  {
    category: "Frontend",
    items: ["Angular", "TypeScript", "JavaScript", "HTML5 / CSS3", "Tailwind CSS", "Angular Material"],
  },
  {
    category: "Backend",
    items: ["Node.js", "NestJS", "PHP", "REST APIs"],
  },
  {
    category: "Cloud & DevOps",
    items: ["Amazon Web Services", "CI/CD Pipelines", "GitHub Actions", "GitLab CI/CD", "Docker", "Infrastructure Automation"],
  },
  {
    category: "Database",
    items: ["MySQL", "PostgreSQL", "SQLite"],
  },
  {
    category: "Testing & Tools",
    items: ["Cypress", "Git", "Postman", "Jira"],
  },
];

export default function AboutPage() {
  return (
    <>
      <SectionBar title="About" />

      <div className="p-6 sm:p-8 space-y-8">
        {/* Bio */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-3">
            Background
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            {profile.intro} I&apos;m also the Community Lead of{" "}
            <strong className="text-foreground font-semibold">Angular Philippines</strong>,
            where I help developers grow through knowledge sharing, mentorship, and community
            initiatives. My goal is to leverage software engineering, cloud technologies, and
            DevOps practices to build scalable, reliable, and impactful solutions.
          </p>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-4">
            Skills
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map(({ category, items }) => (
              <div
                key={category}
                className="rounded-xl bg-surface border border-border p-4"
              >
                <p className="text-xs font-bold tracking-wider uppercase text-foreground/50 mb-3">
                  {category}
                </p>
                <ul className="space-y-1.5">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="text-sm text-foreground/70 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-foreground/30 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Resume download */}
        <section>
          <a
            href={profile.resume}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-sm font-medium text-muted hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
          >
            Download Résumé
            <ExternalLinkIcon size={14} />
          </a>
        </section>
      </div>
    </>
  );
}
