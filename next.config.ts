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
  /**
   * Externalize the MDX compiler and Shiki so they are NOT bundled into the
   * Cloudflare worker chunk. This keeps the worker under the 3 MiB cap.
   * The WASM engine is loaded as an asset reference rather than inlined.
   */
  serverExternalPackages: [
    "@mdx-js/mdx",
    "shiki",
    "@shikijs/core",
    "@shikijs/engine-oniguruma",
  ],
};

export default nextConfig;

// Only run the Cloudflare dev proxy when targeting Cloudflare Workers locally.
// Skipped for Docker builds (workerd binary is not present in the image) and
// static exports.
if (!isDockerBuild && !isStaticExport) {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}