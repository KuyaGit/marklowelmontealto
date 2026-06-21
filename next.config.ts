import type { NextConfig } from "next";

// STATIC_EXPORT=true → GitHub Pages static build (output: "export" → out/)
// Unset → Cloudflare Worker SSR build via OpenNext
const isStaticExport = process.env.STATIC_EXPORT === "true";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  images: { unoptimized: true },
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
};

export default nextConfig;
