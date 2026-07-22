import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Le dépôt parent contient un autre lockfile : garder Turbopack dans ce projet.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
