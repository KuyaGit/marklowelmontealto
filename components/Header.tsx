import Image from "next/image";
import { getProfile } from "@/lib/contentful";
import { BASE_PATH } from "@/lib/site";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  FacebookIcon,
  LinkedInIcon,
  UpworkIcon,
  YouTubeIcon,
  OnlineJobsIcon,
  ExternalLinkIcon,
} from "@/components/icons";

export async function Header() {
  const profile = await getProfile();

  const socialLinks = [
    { href: profile.social.facebook, label: "Facebook", icon: <FacebookIcon size={16} /> },
    { href: profile.social.linkedin, label: "LinkedIn", icon: <LinkedInIcon size={16} /> },
    { href: profile.social.onlinejobs, label: "OnlineJobs", icon: <OnlineJobsIcon size={16} /> },
    { href: profile.social.upwork, label: "Upwork", icon: <UpworkIcon size={16} /> },
    { href: profile.social.youtube, label: "YouTube", icon: <YouTubeIcon size={16} /> },
  ].filter(({ href }) => Boolean(href));

  const resumeHref = profile.resume
    ? profile.resume.startsWith("http")
      ? profile.resume
      : `${BASE_PATH}${profile.resume}`
    : `${BASE_PATH}/assets/MarkLowelMontealto.pdf`;

  return (
    <header className="rounded-2xl bg-surface border border-border p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-xl border border-border overflow-hidden relative">
            <Image
              src={
                profile.avatar
                  ? profile.avatar
                  : `${BASE_PATH}/profile.JPG`
              }
              alt="Mark Lowel Montealto — Full Stack Developer & DevOps Engineer"
              fill
              sizes="(max-width: 640px) 176px, 208px"
              className="object-cover object-[center_15%]"
              priority
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col min-w-0 relative">
          {/* Theme toggle — absolute top-right so it doesn't push content down */}
          <div className="absolute top-0 right-0">
            <ThemeToggle />
          </div>

          {/* Name + role at the very top */}
          <div>
            <p className="text-4xl sm:text-5xl font-bold tracking-tight leading-none text-foreground">
              {profile.name.split(" ").slice(0, 2).join(" ")}
              <br />
              {profile.name.split(" ").slice(2).join(" ")}
            </p>
            <p className="mt-1 text-sm font-medium tracking-wider text-foreground/50 uppercase">
              {profile.role}
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Social icons + résumé at the bottom */}
          <div className="flex items-center gap-2 flex-wrap">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
              >
                {icon}
              </a>
            ))}

            {/* Résumé download */}
            <a
              href={resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 h-8 px-3 rounded-lg border border-border text-xs font-medium text-muted hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
            >
              <ExternalLinkIcon size={12} />
              Résumé
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
