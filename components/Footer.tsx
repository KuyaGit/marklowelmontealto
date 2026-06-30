import Link from "next/link";
import { getProfile } from "@/lib/contentful";
import { nav } from "@/data/nav";

// Footer nav excludes the root "/" entry — the meaningful content pages are
// what sitelinks are generated from.
const FOOTER_NAV = nav.filter(({ href }) => href !== "/");

/**
 * Site-wide footer rendered inside every page's scrollable main panel.
 *
 * Provides prominent text navigation links that search engines use to generate
 * sitelinks (the indented sub-results under the main Google result). The sidebar
 * navigation is icon-only, so this footer is the primary source of crawlable
 * text anchors.
 */
export async function Footer() {
  const profile = await getProfile();

  const socialLinks = [
    { href: profile.social.github,    label: "GitHub"    },
    { href: profile.social.linkedin,  label: "LinkedIn"  },
    { href: profile.social.facebook,  label: "Facebook"  },
    { href: profile.social.youtube,   label: "YouTube"   },
    { href: profile.social.upwork,    label: "Upwork"    },
  ].filter(({ href }) => Boolean(href));

  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-border px-6 sm:px-8 py-8">
      <div className="flex flex-col gap-6">

        {/* Identity */}
        <div>
          <p className="text-sm font-semibold text-foreground">
            {profile.name}
          </p>
          <p className="text-xs text-foreground/50 mt-0.5">
            {profile.role}
          </p>
        </div>

        {/* Primary navigation — text links for crawlers/sitelinks */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_NAV.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-xs text-foreground/60 hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Social + copyright */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {socialLinks.length > 0 && (
            <ul className="flex flex-wrap gap-x-4 gap-y-1">
              {socialLinks.map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-foreground/40 hover:text-foreground/70 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p className="text-xs text-foreground/30">
            © {year} {profile.name}
          </p>
        </div>

      </div>
    </footer>
  );
}
