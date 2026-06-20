import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-4">
          404
        </p>
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-surface text-sm font-medium text-muted hover:border-foreground/40 hover:text-foreground transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}
