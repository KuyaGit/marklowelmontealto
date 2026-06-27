import type { Metadata } from "next";
import { SectionBar } from "@/components/SectionBar";
import { getProfile } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Mark Lowel Montealto — Full Stack Developer and DevOps Engineer based in Manila, Philippines. 4+ years experience in Angular, TypeScript, AWS, and CI/CD automation.",
  path: "/about",
  keywords: [
    "Mark Lowel Montealto",
    "Full Stack Developer",
    "Angular Developer",
    "Laravel Developer",
    "React Developer",
    "AWS Engineer",
    "Cloud Engineer",
    "Terraform Developer",
  ],
  ogDescription:
    "Full Stack Developer and DevOps Engineer specializing in Angular, TypeScript, AWS, and CI/CD pipelines. Community Lead at Angular Philippines.",
});

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: "/about",
          name: "About — Mark Lowel Montealto",
          description:
            "Mark Lowel Montealto — Full Stack Developer and DevOps Engineer based in Manila, Philippines. 4+ years experience in Angular, TypeScript, AWS, and CI/CD automation.",
          type: "ProfilePage",
        })}
      />
      <h1 className="sr-only">
        Mark Lowel Montealto — Full Stack Developer, Angular &amp; React Developer,
        Laravel Developer, AWS Cloud Engineer, Terraform Developer
      </h1>
      <SectionBar title="About" />

      <div className="p-6 sm:p-8 space-y-8">
        {/* Bio */}
        <section>
          <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-3">
            Background
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80">
            {profile.intro}
            {profile.bioCommunity && (
              <> {profile.bioCommunity}</>
            )}
          </p>
        </section>

        {/* Skills */}
        {profile.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest uppercase text-foreground/40 mb-4">
              Skills
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profile.skills.map(({ category, items }) => (
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
        )}
      </div>
    </>
  );
}
