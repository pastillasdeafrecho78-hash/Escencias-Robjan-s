import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // El servidor de desarrollo puede seguir abierto mientras se ejecuta `next build`.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
