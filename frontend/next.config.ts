import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // OMDb images come from various sources
      },
      {
        protocol: 'http',
        hostname: '**', // Some OMDb images may use HTTP
      },
    ],
  },
};

export default nextConfig;
