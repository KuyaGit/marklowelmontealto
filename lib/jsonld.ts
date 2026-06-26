import { getProfile } from "@/lib/contentful";
import { SITE_URL } from "./site";

export async function getStructuredData() {
  const profile = await getProfile();

  const sameAs = [
    profile.social.linkedin,
    profile.social.github,
    profile.social.facebook,
    profile.social.youtube,
  ].filter(Boolean);

  const person = {
    "@type": "Person",
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
    ...(profile.knowsAbout.length > 0 && { knowsAbout: profile.knowsAbout }),
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
    name: `${profile.name} — Portfolio`,
    url: SITE_URL,
    description:
      "Full Stack Developer and DevOps Engineer portfolio — Angular, TypeScript, AWS, CI/CD, and cloud-native solutions.",
    author: { "@type": "Person", name: profile.name },
  };

  return {
    "@context": "https://schema.org",
    "@graph": [person, website],
  };
}
