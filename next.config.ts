import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mark native modules as external so Next.js doesn't try to bundle them
  serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],

  images: {
    // Allow SVG placeholder images from /public
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
