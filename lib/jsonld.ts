import { getProfile } from "@/lib/contentful";
import { SITE_URL } from "./site";

// Core technologies — used in knowsAbout and hasOccupation if not populated in Contentful.
const CORE_TECHNOLOGIES = [
  "Angular",
  "React",
  "Next.js",
  "React Native",
  "TypeScript",
  "Laravel",
  "AWS",
  "Terraform",
  "Cloudflare",
  "Node.js",
  "Docker",
  "CI/CD",
];

export async function getStructuredData() {
  const profile = await getProfile();

  const sameAs = [
    profile.social.linkedin,
    profile.social.github,
    profile.social.facebook,
    profile.social.youtube,
  ].filter(Boolean);

  // Merge Contentful knowsAbout with core technologies, deduplicating.
  const knowsAboutSet = new Set<string>([
    ...CORE_TECHNOLOGIES,
    ...profile.knowsAbout,
  ]);
  const knowsAbout = Array.from(knowsAboutSet);

  const person: Record<string, unknown> = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    email: profile.email,
    image: profile.avatar || `${SITE_URL}/profile.JPG`,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location || "Manila",
      addressCountry: "PH",
    },
    knowsAbout,
    hasOccupation: {
      "@type": "Occupation",
      name: "Full Stack Developer",
      occupationLocation: {
        "@type": "Country",
        name: "Philippines",
      },
      skills: CORE_TECHNOLOGIES.join(", "),
    },
    ...(profile.worksForOrg && {
      worksFor: { "@type": "Organization", name: profile.worksForOrg },
    }),
    ...(profile.communityOrg && {
      memberOf: [
        {
          "@type": "Organization",
          name: profile.communityOrg,
          ...(profile.communityOrgUrl && { url: profile.communityOrgUrl }),
        },
      ],
    }),
    ...(sameAs.length > 0 && { sameAs }),
  };

  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: `${profile.name} — Portfolio`,
    url: SITE_URL,
    description:
      "Official website and portfolio of Mark Lowel Montealto — Full Stack Developer and DevOps Engineer specializing in Angular, React, Next.js, Laravel, AWS, Terraform, and Cloudflare.",
    author: { "@type": "Person", "@id": `${SITE_URL}/#person` },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: `${profile.name} — Full Stack Developer`,
    description:
      "Official portfolio of Mark Lowel Montealto, a Full Stack Developer and DevOps Engineer based in Manila, Philippines.",
    mainEntity: { "@type": "Person", "@id": `${SITE_URL}/#person` },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage],
  };
}
