import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import "./env/server";
import "./env/client";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  output: "standalone",
};

export default withSentryConfig(nextConfig, {
  org: "kenzu-org",
  project: "lindol-ph",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
});
