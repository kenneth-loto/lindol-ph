import "server-only";

import { cacheLife } from "next/cache";
import * as v from "valibot";
import { serverEnv } from "@/env";
import { filterPhilippineEarthquakes } from "@/lib/earthquake-analytics";
import {
  type USGSFeature,
  USGSResponseSchema,
} from "@/lib/schema/usgs-feature";

async function fetchWeeklyPhilippinesEarthuakes(): Promise<USGSFeature[]> {
  const res = await fetch(serverEnv.USGS_URL, { cache: "no-store" });

  // TODO: improve error handling isntead of just throwing
  if (!res.ok) {
    throw new Error(`USGS fetch failed: ${res.status} ${res.statusText}`);
  }

  const json: unknown = await res.json();

  const validated = v.parse(USGSResponseSchema, json);

  // TODO: add a fallback or empty array
  return validated.features;
}

export async function getCachedWeeklyPhilippineQuakes(): Promise<
  USGSFeature[]
> {
  "use cache";
  cacheLife("hours");

  const allQuakes = await fetchWeeklyPhilippinesEarthuakes();

  return filterPhilippineEarthquakes(allQuakes);
}
