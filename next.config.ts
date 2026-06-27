import type { NextConfig } from "next";

// STATIC_EXPORT=true  → GitHub Pages static build (output: "export" → out/)
// DOCKER_BUILD=true   → standalone Node SSR image (output: "standalone")
// Unset              → Cloudflare Worker SSR build via OpenNext
const isStaticExport = process.env.STATIC_EXPORT === "true";
const isDockerBuild = process.env.DOCKER_BUILD === "true";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : isDockerBuild ? "standalone" : undefined,
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
  // SSR (Cloudflare/Node) mode: 308 permanent redirect for SEO.
  // Static export (GitHub Pages) ignores this; app/page.tsx handles it via meta-refresh there.
  ...(!isStaticExport && {
    redirects: async () => [
      { source: "/", destination: "/about", permanent: true },
    ],
  }),
};

export default nextConfig;

// Only run the Cloudflare dev proxy when targeting Cloudflare Workers locally.
// Skipped for Docker builds (workerd binary is not present in the image) and
// static exports.
if (!isDockerBuild && !isStaticExport) {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}