import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { getGlobalGraph } from "@/lib/jsonld";
import { SITE_URL } from "@/lib/site";
import { MouseGlow } from "@/components/MouseGlow";
import "./globals.css";

const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
    template: "%s | Mark Lowel Montealto",
  },
  description:
    "Official website of Mark Lowel Montealto — Full Stack Developer and DevOps Engineer based in Manila, Philippines. Angular, React, Next.js, Laravel, AWS, Terraform, Cloudflare.",
  openGraph: {
    type: "website",
    siteName: "Mark Lowel Montealto",
    url: "/",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mark Lowel Montealto — Full Stack Developer & DevOps Engineer",
    description:
      "Full Stack Developer and DevOps Engineer — Angular, TypeScript, AWS, CI/CD.",
    images: ["/og.png"],
  },

};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0c" },
  ],
};

// Inline script runs before first paint — reads localStorage and sets data-theme
// so the correct theme colors render without a flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme:dark)').matches){document.documentElement.setAttribute('data-theme','dark');localStorage.setItem('theme','dark')}}catch(e){}})()`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = await getGlobalGraph();

  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* No-flash theme init — must run synchronously before paint */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/* Structured data for SEO crawlers */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {/* RSS feed discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Mark Lowel Montealto — Blog"
          href="/rss.xml"
        />
      </head>
      <body className="min-h-full text-foreground">
        <MouseGlow />
        {children}
      </body>
    </html>
  );
}
