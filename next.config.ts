import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import "./env/server";
import "./env/client";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  output: "standalone",
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: "kenzu-org",
  project: "lindol-ph",
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
});
