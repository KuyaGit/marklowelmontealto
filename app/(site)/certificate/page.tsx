import type { Metadata } from "next";
import Image from "next/image";
import { SectionBar } from "@/components/SectionBar";
import { ExternalLinkIcon } from "@/components/icons";
import { getCertificates } from "@/lib/contentful";
import { JsonLd } from "@/components/JsonLd";
import { buildPageGraph } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Certificates",
  description:
    "Professional certifications earned by Mark Lowel Montealto — AWS Certified Cloud Practitioner, AWS re/Start Graduate, Google UX Design, and more.",
  alternates: { canonical: "/certificate" },
  openGraph: {
    title: "Certificates — Mark Lowel Montealto",
    description:
      "AWS Certified Cloud Practitioner, AWS re/Start Graduate, AWS Academy Cloud Foundations, Google UX Design.",
    url: "/certificate",
  },
  twitter: {
    title: "Certificates — Mark Lowel Montealto",
    description:
      "AWS and professional certifications by Mark Lowel Montealto.",
  },
};

export default async function CertificatePage() {
  const certificates = await getCertificates();

  return (
    <>
      <JsonLd
        data={buildPageGraph({
          path: "/certificate",
          name: "Certificates — Mark Lowel Montealto",
          description:
            "Professional certifications earned by Mark Lowel Montealto — AWS Certified Cloud Practitioner, AWS re/Start Graduate, Google UX Design, and more.",
          type: "CollectionPage",
        })}
      />
      <SectionBar title="Certificates" />

      <div className="p-4 sm:p-6 space-y-3">
        {certificates.map((cert) => (
          <article
            key={cert.slug}
            className="p-4 sm:p-5 rounded-xl border border-border hover:border-foreground/20 transition-colors duration-200 flex gap-4"
          >
            {/* Certificate image */}
            {cert.image && (
              <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg border border-border overflow-hidden relative bg-surface-alt">
                <Image
                  src={cert.image}
                  alt={`${cert.title} certificate`}
                  fill
                  sizes="80px"
                  className="object-contain p-1"
                />
              </div>
            )}

            {/* Text content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-1">
                <h3 className="font-bold text-sm sm:text-base text-foreground leading-tight">
                  {cert.title}
                </h3>
                {cert.isFeatured && (
                  <span className="flex-shrink-0 text-xs font-semibold tracking-wider uppercase text-accent border border-accent/30 rounded-full px-2.5 py-0.5">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-muted mb-1">
                {cert.issuer} · {cert.date}
              </p>
              <p className="text-sm leading-relaxed text-foreground/70">
                {cert.description}
              </p>
              {cert.verifiedUrl && (
                <a
                  href={cert.verifiedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-accent hover:opacity-75 transition-opacity"
                >
                  <ExternalLinkIcon size={12} />
                  Verify certificate
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
