import "server-only";

import * as Sentry from "@sentry/nextjs";
import { cacheLife } from "next/cache";
import * as v from "valibot";
import { serverEnv } from "@/env";
import { filterPhilippineEarthquakes } from "@/lib/earthquake-analytics";
import { subtractWeeks } from "@/lib/relative-time";
import {
  type USGSResponse,
  USGSResponseSchema,
} from "@/lib/schema/usgs-feature";
import { fdnsUrl } from "@/lib/utils";
import type { EarthquakeFeed } from "@/types/earthquakes";

const fallbackResponse: USGSResponse = {
  metadata: { generated: 0 },
  features: [],
};

async function fetchWeeklyEarthquakes(): Promise<USGSResponse> {
  try {
    const response = await fetch(serverEnv.USGS_URL, { cache: "no-store" });

    if (!response.ok) {
      Sentry.captureMessage(
        `USGS API responded with error: ${response.status} ${response.statusText}`,
        "error",
      );
      return fallbackResponse;
    }

    const json: unknown = await response.json();
    const validated = v.parse(USGSResponseSchema, json);

    return validated;
  } catch (error: unknown) {
    Sentry.captureException(error, { tags: { source: "usgs-weekly-fetch" } });

    return fallbackResponse;
  }
}

async function fetchPreviousWeekEarthquakes(): Promise<USGSResponse> {
  try {
    const now = new Date();
    const startTime = subtractWeeks(now, 2);
    const endTime = subtractWeeks(now, 1);

    const url = fdnsUrl(startTime, endTime);
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      Sentry.captureMessage(
        `FDSN API responded with error: ${response.status} ${response.statusText}`,
        "error",
      );
      return fallbackResponse;
    }

    const json: unknown = await response.json();
    const validated = v.parse(USGSResponseSchema, json);

    return validated;
  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: { source: "fdsn-previous-week-fetch" },
    });

    return fallbackResponse;
  }
}

export async function getWeeklyPhilippineEarthquakes(): Promise<EarthquakeFeed> {
  "use cache";
  cacheLife("hours");

  const [thisWeek, previousWeek] = await Promise.all([
    fetchWeeklyEarthquakes(),
    fetchPreviousWeekEarthquakes(),
  ]);

  return {
    features: filterPhilippineEarthquakes(thisWeek.features),
    previousWeekFeatures: filterPhilippineEarthquakes(previousWeek.features),
    generatedAt: thisWeek.metadata.generated,
  };
}
