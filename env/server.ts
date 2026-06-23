import { createEnv } from "@t3-oss/env-nextjs";
import * as v from "valibot";

export const serverEnv = createEnv({
  server: {
    USGS_URL: v.pipe(v.string(), v.url()),
    FDSN_BASE_URL: v.pipe(v.string(), v.url()),
    SENTRY_AUTH_TOKEN: v.pipe(v.string(), v.minLength(1)),
    CI: v.optional(v.string()),
    NODE_ENV: v.optional(
      v.picklist(["development", "test", "production"]),
      "development",
    ),
    NEXT_RUNTIME: v.optional(v.picklist(["nodejs", "edge"])),
  },
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
