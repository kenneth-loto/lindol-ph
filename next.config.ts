import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import { serverEnv } from "./env/server";
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
  authToken: serverEnv.SENTRY_AUTH_TOKEN,
  silent: !serverEnv.CI,
});
