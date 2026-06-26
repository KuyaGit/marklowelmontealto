import type { NextConfig } from "next";

// STATIC_EXPORT=true → GitHub Pages static build (output: "export" → out/)
// Unset → Cloudflare Worker SSR build via OpenNext
const isStaticExport = process.env.STATIC_EXPORT === "true";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.ctfassets.net" },
      { protocol: "https", hostname: "assets.ctfassets.net" },
    ],
  },
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  // SSR (Cloudflare) mode: 308 permanent redirect is stronger than meta-refresh for SEO.
  // Static export (GitHub Pages) ignores this; app/page.tsx handles it via meta-refresh there.
  ...(!isStaticExport && {
    redirects: async () => [
      { source: "/", destination: "/about", permanent: true },
    ],
  }),
};

export default nextConfig;
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();