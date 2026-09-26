import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.DOCKER_BUILD ? { output: "standalone" } : {}),
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
