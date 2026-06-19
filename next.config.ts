import type { NextConfig } from "next";
import "./env/server";
import "./env/client";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
};

export default nextConfig;
