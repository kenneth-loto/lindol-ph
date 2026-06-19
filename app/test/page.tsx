import {
  filterPhilippineEarthquakes,
  getMagnitudeBuckets,
  getMetrics,
  groupByRegion,
} from "@/lib/earthquake-analytics";
import { formatScientific } from "@/lib/energy-calculation";
import { getCachedWeeklyPhilippineQuakes } from "../dal/earthquake";

export default async function Home() {
  // --- 1. Fetch ---
  const allQuakes = await getCachedWeeklyPhilippineQuakes();
  console.log(`\n[USGS] Total global quakes fetched: ${allQuakes.length}`);

  // --- 2. Filter ---
  const phQuakes = filterPhilippineEarthquakes(allQuakes);
  console.log(`[Filter] Philippine quakes this week: ${phQuakes.length}`);

  // --- 3. Group ---
  const regionGroups = groupByRegion(phQuakes);
  console.log(`[Groups] Unique regions: ${regionGroups.length}`);
  console.log("[Groups] Top 5 by energy:");
  regionGroups.slice(0, 5).forEach((r, i) => {
    console.log(
      `  ${i + 1}. ${r.name} — ${r.count} quakes — ${formatScientific(r.totalEnergy)}`,
    );
  });

  // --- 4. Buckets ---
  const buckets = getMagnitudeBuckets(phQuakes);
  console.log(
    `[Buckets] Minor(<3.0): ${buckets.minor} | Light(3-4.9): ${buckets.light} | Strong(5+): ${buckets.strong}`,
  );

  // --- 5. Metrics ---
  const metrics = getMetrics(phQuakes, regionGroups);
  console.log("[Metrics]", metrics);

  // --- 6. Spot-check: print first 5 raw PH events ---
  console.log("\n[Feed] First 5 PH events (raw):");
  phQuakes.slice(0, 5).forEach((q) => {
    console.log(
      `  M${q.properties.mag} — ${q.properties.place} — ${new Date(q.properties.time).toISOString()}`,
    );
  });

  return (
    <main>
      <p>Day 2 pipeline check — open your terminal.</p>
      <p>PH quakes this week: {phQuakes.length}</p>
    </main>
  );
}
