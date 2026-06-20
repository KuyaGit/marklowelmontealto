import type { Metadata } from "next";
import { SectionBar } from "@/components/SectionBar";
import { certificates } from "@/data/certificates";

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

export default function CertificatePage() {
  return (
    <>
      <SectionBar title="Certificates" />

      <div className="p-4 sm:p-6 space-y-3">
        {certificates.map((cert) => (
          <article
            key={cert.title}
            className="p-4 sm:p-5 rounded-xl border border-border hover:border-foreground/20 transition-colors duration-200"
          >
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
          </article>
        ))}
      </div>
    </>
  );
}
