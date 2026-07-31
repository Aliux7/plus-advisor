import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.plusadvisor.co.id",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "lh7-rt.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
