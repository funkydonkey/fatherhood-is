import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.fatherhood.is",
        pathname: "/**",
      },
    ],
    // Disable optimization for localhost in development
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
