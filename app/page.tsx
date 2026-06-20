import type { Metadata } from "next";
import { BASE_PATH } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  robots: { index: false },
};

// GitHub Pages serves static files only — server-side redirects are unsupported.
// This page uses a meta-refresh to forward / → /about instantly.
export default function Home() {
  const target = `${BASE_PATH}/about/`;
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="refresh" content={`0;url=${target}`} />
        <link rel="canonical" href={target} />
      </head>
      <body>
        <p>
          Redirecting… <a href={target}>Click here if you are not redirected.</a>
        </p>
      </body>
    </html>
  );
}
