# LindolPH — Feature Checklist

Track progress by feature, not by day. A feature is done when every box under it is checked.

---

## Project Setup

- [x] Next.js 16 scaffolded with TypeScript and Tailwind
- [x] shadcn/ui initialized
- [x] Recharts installed
- [x] Folder structure in place: `app/`, `components/`, `utils/`, `types/`
- [x] Git repo initialized, first commit pushed

---

## TypeScript Types — `types/earthquakes.ts`

- [x] `USGSFeature` interface defined (id, properties.mag, properties.place, properties.time, geometry.coordinates)
  - Note: `mag` is `number | null` — USGS returns `null` for unreviewed/automatic events
  - Note: depth lives at `geometry.coordinates[2]`, not as a separate `properties.depth` field
- [x] `RegionGroup` interface defined (name, count, avgMag, avgDepth, totalEnergy)
  - Note: `avgMag` and `avgDepth` are `number | null` to handle zero-count or all-unrated groups
- [x] `EarthquakeMetrics` interface defined (totalCount, peakMag, peakLocation, topRegion, topRegionEnergy)
  - Renamed from `QuakeMetrics`
  - Note: `peakMag` is `number | null`, never defaults to `0`
- [x] `MagnitudeBuckets` interface defined (minor, light, strong counts)

---

## Data Utilities — `utils/earthquake-analytics.ts`

- [x] `filterPhilippineQuakes()` — filters global feed to PH events only
- [x] `stripPrefix()` — removes "12km NW of " style distance prefix
- [x] `extractRegion()` — extracts city/province from cleaned place string
- [x] `groupByRegion()` — tallies by region; excludes null-magnitude events from `avgMag`/energy, but still counts them toward `count`/`avgDepth`
- [x] `getMagnitudeBuckets()` — returns counts for `<3.0`, `3.0–4.9`, `5.0+`; skips unrated (null) events
- [x] `getMetrics()` — returns totalCount, peakMag + location, topRegion, topRegionEnergy; returns `null` (not `0`) for peakMag when no rated event exists
- [x] All functions verified against mock USGS JSON data via real `bun test` run (8/8 passing)

---

## Data Utilities — `utils/energy-calculation.ts`

- [x] `calculateSeismicEnergy(mag)` — implements `E = 10^(1.5M + 4.8)`, returns joules
  - Renamed from `calcSeismicEnergy`
- [x] `calculateTotalEnergy(mags)` — sums energy across a list of magnitudes, skipping nulls
  - Replaces the old `calcRegionEnergy(groups)` approach, which approximated energy from `avgMag` — confirmed to undercount real total energy by orders of magnitude whenever quake sizes vary within a region. Energy is now summed per-quake inside `groupByRegion()`, not derived from an average afterward.
- [x] `sortRegionsByEnergy(groups)` — sorts already-aggregated region groups by `totalEnergy` descending
- [x] `formatScientific(joules)` — formats number to `2.40 × 10¹² J` style string using `toExponential()` (avoids float `log10`/`floor` rounding edge cases)
- [x] Formula output verified for known magnitudes (mag 5.0 → 1.995×10¹² J, formats as `2.00 × 10¹² J`)

---

## Server Data Fetch — `app/dal/earthquakes.ts`

- [x] `getWeeklyQuakes()` fetches USGS GeoJSON endpoint server-side
- [x] `revalidate: 3600` set on fetch for 1-hour ISR cache
- [x] Error handling in place for failed fetch
- [x] Returns typed `USGSFeature[]`

---

## Data Pipeline — `app/page.tsx`

- [x] Page is a server component (no `"use client"`)
- [x] Calls `getWeeklyQuakes()`, runs PH filter, runs all utilities
- [x] All computed values passed as typed props to child components
- [x] Real data confirmed flowing correctly in terminal logs

---

## Feature: MetricStrips

- [x] 3 cards in a responsive row (stacks on mobile)
- [x] Card 1: Total PH Incidents — large number, label below
- [x] Card 2: Peak Magnitude — value + location subtext
- [x] Card 3: Highest Energy Region — name + formatted energy value
- [x] Wired to real data from `page.tsx`

---

## Feature: Energy Release Table

- [x] Table columns: Rank | Region | Quakes | Avg Mag | Avg Depth | Est. Energy (J)
- [x] Rows sorted by total energy descending
- [x] Energy values rendered in scientific notation format
- [x] Footnote or tooltip citing the Gutenberg-Richter formula
- [x] Wired to real data from `page.tsx`

---

## Feature: Regional Charts

- [x] `"use client"` declared (Recharts requirement)
- [x] Horizontal `BarChart` — Top 5 regions by quake count, hover tooltip
- [x] `PieChart` donut — severity breakdown, hover tooltip, legend
- [x] Both charts wrapped in `ResponsiveContainer`
- [x] Color palette consistent with dashboard theme
- [x] Wired to real data from `page.tsx`

---

## Feature: Incident Feed

- [x] `"use client"` declared
- [x] Text search input filters list in real time
- [x] Magnitude dropdown filters: < 3.0 / 3.0 - 4.9 / 5.0+
- [x] Both filters work simultaneously via derived state
- [x] Each row: magnitude badge | clean location | formatted timestamp
- [x] List sorted by time descending (most recent first)
- [x] Empty state shown when no results match filters
- [x] Wired to real data from `page.tsx`

---

## Polish

- [x] Loading skeletons on each component
- [x] Empty state if USGS returns zero PH events
- [x] Mobile layout verified — all components stack cleanly
- [x] No console errors or hydration warnings in browser

---

## Monitoring — Sentry (Post-MVP)

- [x] `@sentry/nextjs` installed and configured via `bunx @sentry/wizard@latest -i nextjs`
- [x] `SENTRY_AUTH_TOKEN` set as a masked env var in Render dashboard
- [x] `SENTRY_AUTH_TOKEN` passed as a secret in Dockerfile (for source map upload during `bun run build`)
- [x] DAL error paths updated — `console.error` replaced with `Sentry.captureMessage` / `Sentry.captureException`
- [x] Source maps confirmed uploading and stack traces readable in Sentry dashboard
- [x] Alert rules configured (email / Slack / Discord) for USGS fetch failures and Valibot validation errors

---

## Docker

- [x] `output: 'standalone'` added to `next.config.ts`
- [x] Multi-stage `Dockerfile` written (builder → runner)
- [x] `.dockerignore` created
- [x] `docker-compose.yml` created for local dev
- [x] App builds successfully: `docker-compose up --build`
- [x] App confirmed working at `localhost:3000` inside container
- [x] Image size checked and acceptable

---

## Render Deployment (Web Service — Docker)

- [ ] GitHub repo connected to Render as a new Web Service (Docker runtime)
- [ ] `USGS_URL` set as a masked environment variable in Render dashboard
- [ ] Build Command set to: `echo "$USGS_URL" > /tmp/usgs_url && docker build --secret id=usgs_url,src=/tmp/usgs_url .`
- [ ] Initial deploy triggered from `main` branch
- [ ] App accessible at `https://lindolph.onrender.com`
- [ ] Auto-deploy on git push verified

---

## Final Wrap-Up

- [ ] Render demo URL added to README
- [ ] Screenshot of live dashboard added to README
- [ ] `DEPLOYMENT.md` written with exact steps used
- [ ] All checklist items above checked off
- [ ] Final commit pushed to GitHub
