import type { Metadata } from "next";
import Link from "next/link";
import { getProfile, getWorks, getProjects, getCertificates, getServices, getTestimonials, getFaqs } from "@/lib/contentful";
import { buildMetadata } from "@/lib/seo";
import { buildPageGraph, buildFaqGraph } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { BASE_PATH } from "@/lib/site";
import { ExternalLinkIcon, ArrowRightIcon } from "@/components/icons";


// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = buildMetadata({
  title: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
  description:
    "Official website of Mark Lowel Montealto, a Full Stack Developer and DevOps Engineer based in Manila, Philippines. Specialising in Angular, React, Next.js, Laravel, AWS, Terraform, and Cloudflare.",
  path: "/",
  keywords: [
    "Mark Lowel Montealto",
    "Full Stack Developer",
    "DevOps Engineer",
    "Angular Developer",
    "React Developer",
    "Next.js Developer",
    "Laravel Developer",
    "AWS Engineer",
    "Philippines",
    "Manila",
    "Freelance Developer",
    "Cloud Infrastructure",
    "Terraform",
    "CI/CD",
  ],
  ogTitle: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
  ogDescription:
    "Full Stack Developer and DevOps Engineer based in Manila, Philippines. Angular, React, Next.js, Laravel, AWS, Terraform, Cloudflare.",
});

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function HomePage() {
  const [profile, works, projects, certificates, services, testimonials, faqs] = await Promise.all([
    getProfile(),
    getWorks(),
    getProjects(),
    getCertificates(),
    getServices(),
    getTestimonials(),
    getFaqs(),
  ]);

  const resumeHref = profile.resume
    ? profile.resume.startsWith("http")
      ? profile.resume
      : `${BASE_PATH}${profile.resume}`
    : `${BASE_PATH}/assets/MarkLowelMontealto.pdf`;

  const recentWorks = works.slice(0, 3);
  const featuredProjects =
    projects.filter((p) => p.isFeatured).length > 0
      ? projects.filter((p) => p.isFeatured)
      : projects.slice(0, 3);
  const recentCerts = certificates.slice(0, 3);

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: "/",
          name: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
          description:
            "Official portfolio of Mark Lowel Montealto, a Full Stack Developer and DevOps Engineer based in Manila, Philippines.",
          type: "ProfilePage",
        })}
      />
      {faqs.length > 0 && <JsonLd data={buildFaqGraph(faqs)} />}

      <div className="p-6 sm:p-8 space-y-12">

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
            , a full-stack developer and DevOps engineer with over four years of
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
            , where I help grow the local developer community. Whether it&apos;s
            engineering a performant Angular front-end, designing a RESTful API
            with Laravel, or automating an AWS deployment pipeline with Terraform,
            I focus on writing software that teams can maintain and build on long
            after the initial release.
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

        {/* ── About Me ── */}
        <section aria-labelledby="about-heading">
          <h2
            id="about-heading"
            className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
          >
            About me
          </h2>

          <div className="space-y-4 max-w-prose">
            {profile.aboutLongText ? (
              profile.aboutLongText
                .split(/\n\n+/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/70">
                    {para.trim()}
                  </p>
                ))
            ) : (
              <>
                <p className="text-sm leading-relaxed text-foreground/70">
                  I&apos;m a full-stack developer and DevOps engineer based in{" "}
                  {profile.location || "Manila, Philippines"}. I&apos;ve spent the
                  last four-plus years working across the full breadth of web
                  development — designing interfaces in Angular and React, building
                  APIs in Laravel and Node.js, and provisioning the cloud
                  infrastructure that keeps those systems running on AWS. Most of the
                  projects I work on require me to think about the whole system, not
                  just one layer of it.
                </p>

                <p className="text-sm leading-relaxed text-foreground/70">
                  I started my career on the front end, which gave me a strong
                  foundation in performance, accessibility, and the interaction
                  details that make software feel intentional. Over time, I grew into
                  back-end and infrastructure work because I wanted a complete picture
                  of the systems I was building — the data model, the API boundaries,
                  the deployment topology, the monitoring setup. That breadth has
                  proven more useful than I expected; the ability to move between
                  layers fluently makes it easier to find and fix problems at their
                  source.
                </p>

                <p className="text-sm leading-relaxed text-foreground/70">
                  Outside of my day job and client work, I serve as Community Lead
                  at{" "}
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
                  , where I help organise meetups, workshops, and learning resources
                  for software developers in the Philippines. I believe that strong
                  local developer communities create better engineers — the
                  conversations you have at a meetup or in a study group often teach
                  you things that months of solo work simply won&apos;t.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ── Professional Summary ── */}
        <section aria-labelledby="summary-heading">
          <h2
            id="summary-heading"
            className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
          >
            Professional summary
          </h2>

          <div className="space-y-4 max-w-prose">
            {profile.professionalSummary ? (
              profile.professionalSummary
                .split(/\n\n+/)
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-sm leading-relaxed text-foreground/70">
                    {para.trim()}
                  </p>
                ))
            ) : (
              <>
                <p className="text-sm leading-relaxed text-foreground/70">
                  I specialise in building full-stack web products and the
                  infrastructure that supports them. My strongest areas are
                  Angular-based enterprise applications, React and Next.js
                  front-ends, Laravel back-ends, and AWS environments managed with
                  Terraform. I&apos;m comfortable leading technical decisions end to
                  end — from architecture discussions and database design through to
                  deployment automation and operational monitoring — without requiring
                  close management overhead.
                </p>

                <p className="text-sm leading-relaxed text-foreground/70">
                  My approach to software is practical and systems-aware. I prefer
                  well-understood tools that fit the problem over novelty, and I write
                  code with the next developer in mind. I&apos;ve worked as a sole
                  developer in small startups and as part of larger engineering teams
                  with formal processes — both experiences have shaped how I think
                  about reliability, maintainability, and the kind of work that&apos;s
                  worth doing carefully. The goal is always software that keeps
                  working long after it ships.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ── Technology Stack ── */}
        {profile.skills.length > 0 && (
          <section aria-labelledby="stack-heading">
            <h2
              id="stack-heading"
              className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
            >
              Technology stack
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.skills.map(({ category, items }) => (
                <div
                  key={category}
                  className="rounded-xl bg-surface border border-border p-5 space-y-3"
                >
                  <p className="text-xs font-bold tracking-wider uppercase text-foreground/50">
                    {category}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="text-xs px-2 py-0.5 rounded-md bg-foreground/5 text-foreground/60 border border-border"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Experience ── */}
        {recentWorks.length > 0 && (
          <section aria-labelledby="experience-heading">
            <h2
              id="experience-heading"
              className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
            >
              Experience
            </h2>

            <div className="space-y-3">
              {recentWorks.map((work) => (
                <article
                  key={work.slug}
                  className="rounded-xl bg-surface border border-border p-5 hover:border-foreground/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <h3 className="font-bold text-sm text-foreground leading-tight">
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

            <div className="mt-4">
              <Link
                href="/works"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                See full work history <ArrowRightIcon size={13} />
              </Link>
            </div>
          </section>
        )}

        {/* ── Featured Projects ── */}
        {featuredProjects.length > 0 && (
          <section aria-labelledby="projects-heading">
            <h2
              id="projects-heading"
              className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
            >
              Featured projects
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                Browse all projects <ArrowRightIcon size={13} />
              </Link>
            </div>
          </section>
        )}

        {/* ── Certifications ── */}
        {recentCerts.length > 0 && (
          <section aria-labelledby="certifications-heading">
            <h2
              id="certifications-heading"
              className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
            >
              Certifications
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCerts.map((cert) => (
                <article
                  key={cert.slug}
                  className="rounded-xl bg-surface border border-border p-5 flex flex-col gap-2 hover:border-foreground/30 transition-colors"
                >
                  <p className="text-xs font-bold tracking-wider uppercase text-foreground/50">
                    {cert.issuer}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-foreground/40 font-medium">
                    {new Date(cert.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </p>
                  {cert.description && (
                    <p className="text-xs leading-relaxed text-foreground/60 line-clamp-2">
                      {cert.description}
                    </p>
                  )}
                  <div className="flex-1" />
                  {cert.verifiedUrl && (
                    <a
                      href={cert.verifiedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="self-start inline-flex items-center gap-1 text-xs font-medium text-foreground/50 hover:text-foreground transition-colors underline underline-offset-2"
                    >
                      <ExternalLinkIcon size={11} />
                      Verify credential
                    </a>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-4">
              <Link
                href="/certificate"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
              >
                View all certifications <ArrowRightIcon size={13} />
              </Link>
            </div>
          </section>
        )}

        {/* ── Services ── */}
        <section aria-labelledby="services-heading">
          <h2
            id="services-heading"
            className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
          >
            Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-xl bg-surface border border-border p-5 space-y-2"
              >
                <h3 className="text-sm font-bold text-foreground">
                  {service.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonials (placeholder) ── */}
        <section aria-labelledby="testimonials-heading">
          <h2
            id="testimonials-heading"
            className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
          >
            Testimonials
          </h2>

          {testimonials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <blockquote
                  key={t.author}
                  className="rounded-xl bg-surface border border-border p-5 space-y-3 flex flex-col"
                >
                  <p className="text-sm leading-relaxed text-foreground/70 flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="flex items-center gap-3 pt-2 border-t border-border">
                    {t.avatar && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={t.avatar}
                        alt={t.author}
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-8 h-8 flex-shrink-0"
                      />
                    )}
                    <div>
                      <p className="text-xs font-semibold text-foreground">{t.author}</p>
                      <p className="text-xs text-foreground/50">
                        {t.role}{t.company ? `, ${t.company}` : ""}
                      </p>
                    </div>
                  </footer>
                </blockquote>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center space-y-2">
              <p className="text-sm font-medium text-foreground/60">
                Client testimonials coming soon
              </p>
              <p className="text-xs leading-relaxed text-foreground/40 max-w-sm mx-auto">
                I&apos;m in the process of collecting testimonials from past
                clients and collaborators. In the meantime, recommendations from
                colleagues are available on my{" "}
                {profile.social.linkedin ? (
                  <a
                    href={profile.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2 hover:text-foreground/60 transition-colors"
                  >
                    LinkedIn profile
                  </a>
                ) : (
                  "LinkedIn profile"
                )}
                .
              </p>
            </div>
          )}
        </section>

        {/* ── Call to Action ── */}
        <section aria-labelledby="cta-heading">
          <div className="rounded-xl border border-border bg-foreground/[0.03] p-6 sm:p-8 text-center space-y-4">
            <h2
              id="cta-heading"
              className="text-lg sm:text-xl font-bold text-foreground"
            >
              Let&apos;s work together
            </h2>
            <p className="text-sm leading-relaxed text-foreground/70 max-w-prose mx-auto">
              Whether you&apos;re building something new, scaling an existing
              product, or looking for experienced engineering support, I&apos;d
              be glad to hear about it. Send me a message and let&apos;s figure
              out whether I&apos;m the right fit for what you need.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Get in touch
                <ArrowRightIcon size={14} />
              </Link>
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-sm font-medium text-foreground/70 hover:border-foreground/40 hover:text-foreground transition-colors"
              >
                <ExternalLinkIcon size={13} />
                Download résumé
              </a>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-5"
          >
            Frequently asked questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl bg-surface border border-border p-5 space-y-2"
              >
                <h3 className="text-sm font-semibold text-foreground">
                  {faq.question}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/70">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>

          {/* Social proof links */}
          <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-3">
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
    </>
  );
}
