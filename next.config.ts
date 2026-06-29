import type { NextConfig } from "next";

// STATIC_EXPORT=true  → GitHub Pages static build (output: "export" → out/)
// DOCKER_BUILD=true   → standalone Node SSR image (output: "standalone")
// Unset              → standard Next.js server build (next start)
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
};

export default nextConfig;