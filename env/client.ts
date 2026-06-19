import { createEnv } from "@t3-oss/env-nextjs";
import * as v from "valibot";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_SITE_URL: v.optional(
      v.pipe(v.string(), v.url()),
      "http://localhost:3000",
    ),
  },
  runtimeEnv: {
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  },
});
