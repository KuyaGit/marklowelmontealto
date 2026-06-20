import { profile } from "@/data/profile";
import { SITE_URL } from "./site";

export function getStructuredData() {
  const person = {
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    url: SITE_URL,
    email: profile.email,
    image: `${SITE_URL}/profile.JPG`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Manila",
      addressCountry: "PH",
    },
    knowsAbout: [
      "Angular",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "NestJS",
      "Amazon Web Services",
      "CI/CD Pipelines",
      "DevOps",
      "Docker",
      "PostgreSQL",
      "Full Stack Development",
    ],
    worksFor: {
      "@type": "Organization",
      name: "Whitecloak Technologies, Inc.",
    },
    memberOf: [
      {
        "@type": "Organization",
        name: "Angular Philippines",
        url: "https://www.facebook.com/angularphilippines",
      },
    ],
    sameAs: [
      "https://www.linkedin.com/in/mmarklowelmontealto",
      "https://github.com/marklowelmontealto",
    ],
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
