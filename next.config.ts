import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // IMPORTANT: Remove 'output: export' when using Keystatic admin panel.
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
