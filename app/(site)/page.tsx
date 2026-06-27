import type { Metadata } from "next";
import Link from "next/link";
import { getProfile } from "@/lib/contentful";
import { BASE_PATH } from "@/lib/site";
import { ExternalLinkIcon, ArrowRightIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
  description:
    "Official website of Mark Lowel Montealto, a Full Stack Developer and DevOps Engineer based in Manila, Philippines. Specializing in Angular, React, Next.js, Laravel, AWS, Terraform, and Cloudflare.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
    description:
      "Official website of Mark Lowel Montealto — Full Stack Developer and DevOps Engineer based in Manila, Philippines. Angular, React, Next.js, Laravel, AWS, Terraform, Cloudflare.",
    url: "/",
  },
  twitter: {
    title: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
    description:
      "Full Stack Developer & DevOps Engineer — Angular, React, Next.js, Laravel, AWS, Terraform, Cloudflare.",
  },
};

const expertise = [
  {
    area: "Frontend",
    description:
      "I build fast, accessible web and mobile interfaces with Angular, React, and Next.js, and craft cross-platform mobile apps with React Native — all typed end-to-end in TypeScript.",
    tags: ["Angular", "React", "Next.js", "React Native", "TypeScript"],
  },
  {
    area: "Backend",
    description:
      "On the server side I reach for Laravel for robust PHP APIs and Node.js for lightweight services, designing systems that are easy to maintain and scale.",
    tags: ["Laravel", "Node.js"],
  },
  {
    area: "Cloud & Infrastructure",
    description:
      "I provision and manage cloud infrastructure with Terraform on AWS, distribute traffic and secure applications through Cloudflare, and automate delivery with CI/CD pipelines.",
    tags: ["AWS", "Terraform", "Cloudflare", "CI/CD"],
  },
];

export default async function HomePage() {
  const profile = await getProfile();

  const resumeHref = profile.resume
    ? profile.resume.startsWith("http")
      ? profile.resume
      : `${BASE_PATH}${profile.resume}`
    : `${BASE_PATH}/assets/MarkLowelMontealto.pdf`;

  return (
    <div className="p-6 sm:p-8 space-y-10">
      {/* ── Hero ── */}
      <section aria-labelledby="hero-heading">
        <h1
          id="hero-heading"
          className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug"
        >
          Full Stack &amp; DevOps Developer
          <br />
          <span className="text-foreground/50 font-medium">
            based in Manila, Philippines
          </span>
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-foreground/70 max-w-prose">
          Hi, I&apos;m{" "}
          <strong className="text-foreground font-semibold">
            Mark Lowel Montealto
          </strong>
          , a full-stack developer and DevOps engineer with 4+ years of
          professional experience building web applications, mobile apps, and
          cloud infrastructure. I currently work at{" "}
          {profile.worksForOrg ? (
            <span className="text-foreground">{profile.worksForOrg}</span>
          ) : (
            "a software company"
          )}{" "}
          and serve as Community Lead at{" "}
          {profile.communityOrg ? (
            profile.communityOrgUrl ? (
              <a
                href={profile.communityOrgUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground underline underline-offset-2 hover:text-foreground/70 transition-colors"
              >
                {profile.communityOrg}
              </a>
            ) : (
              <span className="text-foreground">{profile.communityOrg}</span>
            )
          ) : (
            "Angular Philippines"
          )}
          , where I help grow the local developer community.
        </p>

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/works"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
          >
            View my work
            <ArrowRightIcon size={14} />
          </Link>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground/70 hover:border-foreground/40 hover:text-foreground transition-colors"
          >
            Projects
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground/70 hover:border-foreground/40 hover:text-foreground transition-colors"
          >
            Get in touch
          </Link>
          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground/70 hover:border-foreground/40 hover:text-foreground transition-colors"
          >
            <ExternalLinkIcon size={13} />
            Résumé
          </a>
        </div>
      </section>

      {/* ── Expertise ── */}
      <section aria-labelledby="expertise-heading">
        <h2
          id="expertise-heading"
          className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
        >
          What I do
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertise.map(({ area, description, tags }) => (
            <div
              key={area}
              className="rounded-xl bg-surface border border-border p-5 space-y-3"
            >
              <p className="text-xs font-bold tracking-wider uppercase text-foreground/50">
                {area}
              </p>
              <p className="text-sm leading-relaxed text-foreground/70">
                {description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/60 border border-border"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust / EEAT ── */}
      <section aria-labelledby="trust-heading">
        <h2
          id="trust-heading"
          className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
        >
          Experience &amp; credentials
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/works"
            className="group rounded-xl bg-surface border border-border p-5 hover:border-foreground/30 transition-colors"
          >
            <p className="text-xs font-bold tracking-wider uppercase text-foreground/50 mb-1">
              Work history
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              4+ years across startups and enterprises — from building SPAs in
              Angular to architecting cloud-native pipelines on AWS.
            </p>
            <p className="mt-3 text-xs font-medium text-foreground/40 group-hover:text-foreground/60 transition-colors flex items-center gap-1">
              See experience <ArrowRightIcon size={12} />
            </p>
          </Link>

          <Link
            href="/projects"
            className="group rounded-xl bg-surface border border-border p-5 hover:border-foreground/30 transition-colors"
          >
            <p className="text-xs font-bold tracking-wider uppercase text-foreground/50 mb-1">
              Projects
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Open-source tools, client work, and personal projects spanning
              web, mobile, and infrastructure.
            </p>
            <p className="mt-3 text-xs font-medium text-foreground/40 group-hover:text-foreground/60 transition-colors flex items-center gap-1">
              Browse projects <ArrowRightIcon size={12} />
            </p>
          </Link>

          <Link
            href="/certificate"
            className="group rounded-xl bg-surface border border-border p-5 hover:border-foreground/30 transition-colors"
          >
            <p className="text-xs font-bold tracking-wider uppercase text-foreground/50 mb-1">
              Certifications
            </p>
            <p className="text-sm text-foreground/70 leading-relaxed">
              Verified credentials from AWS, and other industry-recognized
              certification bodies.
            </p>
            <p className="mt-3 text-xs font-medium text-foreground/40 group-hover:text-foreground/60 transition-colors flex items-center gap-1">
              View certificates <ArrowRightIcon size={12} />
            </p>
          </Link>
        </div>

        {/* Social proof links */}
        <div className="mt-4 flex flex-wrap gap-3">
          {profile.social.github && (
            <a
              href={profile.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
            >
              GitHub
            </a>
          )}
          {profile.social.linkedin && (
            <a
              href={profile.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
            >
              LinkedIn
            </a>
          )}
          {profile.social.upwork && (
            <a
              href={profile.social.upwork}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
            >
              Upwork
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
