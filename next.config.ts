import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT: Remove 'output: export' when using Keystatic admin panel.
  // For static-only deployment (no admin), uncomment the line below:
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
