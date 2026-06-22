import type { NextConfig } from "next";
import "./env/server";
import "./env/client";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  output: "standalone",
};

export default nextConfig;
