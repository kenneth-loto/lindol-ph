import "server-only";

import { cacheLife } from "next/cache";
import * as v from "valibot";
import { serverEnv } from "@/env";
import { filterPhilippineEarthquakes } from "@/lib/earthquake-analytics";
import {
  type USGSResponse,
  USGSResponseSchema,
} from "@/lib/schema/usgs-feature";
import type { EarthquakeFeed } from "@/types/earthquakes";

async function fetchWeeklyEarthquakes(): Promise<USGSResponse> {
  const fallbackResponse: USGSResponse = {
    metadata: { generated: 0 },
    features: [],
  };

  try {
    const response = await fetch(serverEnv.USGS_URL, { cache: "no-store" });

    if (!response.ok) {
      console.error(
        `USGS API responded with error: ${response.status} ${response.statusText}`,
      );
      return fallbackResponse;
    }

    const json: unknown = await response.json();
    const validated = v.parse(USGSResponseSchema, json);

    return validated;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(
        `Failed to fetch or validate USGS weekly earthquakes: ${error.message}`,
      );
    } else {
      console.error("An unexpected error occurred during USGS fetch:", error);
    }

    return fallbackResponse;
  }
}

export async function getWeeklyPhilippineEarthquakes(): Promise<EarthquakeFeed> {
  "use cache";
  cacheLife("hours");

  const response = await fetchWeeklyEarthquakes();

  return {
    features: filterPhilippineEarthquakes(response.features),
    generatedAt: response.metadata.generated,
  };
}
