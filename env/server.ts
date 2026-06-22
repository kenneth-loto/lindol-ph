import { createEnv } from "@t3-oss/env-nextjs";
import * as v from "valibot";

export const serverEnv = createEnv({
  server: {
    USGS_URL: v.pipe(v.string(), v.url()),
    NODE_ENV: v.optional(
      v.picklist(["development", "test", "production"]),
      "development",
    ),
  },
  experimental__runtimeEnv: process.env,
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
