import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gutenberg.org",
      },
    ],
  },
};

export default nextConfig;
