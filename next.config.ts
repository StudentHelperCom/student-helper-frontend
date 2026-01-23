import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable standalone output for Docker optimization
  // This creates a minimal production bundle with only required dependencies
  output: 'standalone',
};

export default nextConfig;
