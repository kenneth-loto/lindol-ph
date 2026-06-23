import * as Sentry from "@sentry/nextjs";
import { serverEnv } from "./env";

export async function register() {
  if (serverEnv.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (serverEnv.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
