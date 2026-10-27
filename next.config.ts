import type { NextConfig } from "next";

/**
 * Two build modes:
 * - default (sandbox / standalone server): output "standalone"
 * - STATIC_EXPORT=1 (GitHub Pages): fully static export into `out/`,
 *   served from https://<user>.github.io/math-quest/ so basePath matters.
 * distDir is split so an export build never clobbers the dev server's .next.
 */
const isStatic = process.env.STATIC_EXPORT === "1";
const REPO_BASE = "/math-quest";

const nextConfig: NextConfig = {
  output: isStatic ? "export" : "standalone",
  distDir: isStatic ? ".next-static" : ".next",
  ...(isStatic
    ? {
        basePath: REPO_BASE,
        assetPrefix: REPO_BASE,
        images: { unoptimized: true },
      }
    : {}),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
