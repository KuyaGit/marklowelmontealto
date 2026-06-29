import type { Metadata } from "next";
import Link from "next/link";
import { SectionBar } from "@/components/SectionBar";
import { MailIcon, ExternalLinkIcon, ArrowRightIcon } from "@/components/icons";
import { getProfile } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Mark Lowel Montealto — Full Stack Developer and DevOps Engineer based in Manila, Philippines. Available for freelance and full-time opportunities.",
  path: "/contact",
  keywords: [
    "Mark Lowel Montealto",
    "Full Stack Developer",
    "Hire Full Stack Developer",
    "AWS Engineer",
    "Cloud Engineer",
  ],
  ogDescription:
    "Get in touch — available for freelance projects and full-time opportunities in full-stack development and DevOps.",
});

export default async function ContactPage() {
  const profile = await getProfile();

  const links = [
    {
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: <MailIcon size={18} />,
    },
    ...(profile.social.linkedin
      ? [
          {
            label: "LinkedIn",
            value: profile.social.linkedin.replace("https://www.", ""),
            href: profile.social.linkedin,
            icon: <ExternalLinkIcon size={18} />,
          },
        ]
      : []),
    ...(profile.social.github
      ? [
          {
            label: "GitHub",
            value: profile.social.github.replace("https://", ""),
            href: profile.social.github,
            icon: <ExternalLinkIcon size={18} />,
          },
        ]
      : []),
  ];

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: "/contact",
          name: "Contact — Mark Lowel Montealto",
          description:
            "Get in touch with Mark Lowel Montealto — Full Stack Developer and DevOps Engineer based in Manila, Philippines. Available for freelance and full-time opportunities.",
          type: "ContactPage",
        })}
      />
      <h1 className="sr-only">
        Hire Mark Lowel Montealto — Full Stack Developer &amp; AWS Cloud Engineer in Manila, Philippines
      </h1>
      <SectionBar title="Contact" />

      <div className="p-6 sm:p-8 space-y-8">
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-3">
            Get in touch
          </h2>
          <p className="text-sm leading-relaxed text-foreground/70 max-w-md">
            I&apos;m open to freelance projects, collaborations, and full-time
            opportunities in Full Stack Development and DevOps. Drop me a line
            and I&apos;ll get back to you promptly.
          </p>
        </section>

        <section className="space-y-3">
          {links.map(({ label, value, href, icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("mailto") ? undefined : "_blank"}
              rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
              className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border hover:border-foreground/30 transition-colors duration-200 group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border text-muted flex-shrink-0 transition-colors duration-200 group-hover:border-foreground/30">
                {icon}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold tracking-wider uppercase text-foreground/40">
                  {label}
                </p>
                <p className="text-sm font-medium text-foreground/80 truncate">
                  {value}
                </p>
              </div>
              <ExternalLinkIcon
                size={14}
                className="ml-auto text-foreground/30 flex-shrink-0"
              />
            </a>
          ))}
        </section>

        {/* Internal links */}
        <section aria-labelledby="see-work-heading">
          <h2
            id="see-work-heading"
            className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-3"
          >
            See my work first
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/works", label: "Work experience" },
              { href: "/projects", label: "Projects" },
              { href: "/certificate", label: "Certifications" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-medium text-foreground/60 hover:border-foreground/30 hover:text-foreground transition-colors"
              >
                {label} <ArrowRightIcon size={13} />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
