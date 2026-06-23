# LindolPH

A minimalist seismic analytics dashboard that surfaces real-time earthquake activity across the Philippines. Pulls live data from the USGS Earthquake Hazards Program, isolates Philippine events, and computes estimated energy released per region using the Gutenberg-Richter energy relation.

## Live Demo

> [lindol-ph.onrender.com](https://lindol-ph.onrender.com/)

![Preview](public/images/lindol-ph-preview.webp)

---

## The Problem

The Philippines sits on the Pacific Ring of Fire, making it one of the most seismically active countries in the world. PHIVOLCS monitors local activity, but their public data interface is not developer-friendly. The USGS API is free, unauthenticated, and updates continuously — but it returns global data with no regional breakdown or energy analysis out of the box.

LindolPH solves this by filtering, grouping, and computing actionable metrics from that raw global feed.

---

## Features

### KPI Metric Strips

Three at-a-glance cards at the top of the dashboard:

- **Total PH Incidents** — count of Philippine earthquakes in the past 7 days, with % change vs the previous week
- **Peak Magnitude** — strongest recorded event this week and its location
- **Highest Energy Region** — region with the greatest total estimated energy released

### Energy Release Table

Regions ranked by total estimated seismic energy released, calculated using the Gutenberg-Richter energy relation. Columns include quake count, average magnitude, average depth, and total estimated energy in joules (scientific notation).

> **Formula:** `E = 10^(1.5M + 4.8)` joules  
> Source: Gutenberg & Richter (1956), _Earthquake magnitude, intensity, energy, and acceleration_

### Regional Charts

- Horizontal bar chart — Top 5 most active Philippine regions by quake count
- Donut chart — Severity distribution: Minor (< 3.0), Light (3.0–4.9), Strong (5.0+)

### Incident Feed

Scrollable log of every Philippine earthquake in the dataset. Filterable by magnitude threshold and searchable by location string. Each entry shows magnitude badge, location, and humanized timestamp.

---

## Tech Stack

| Layer     | Choice                               | Reason                                 |
| --------- | ------------------------------------ | -------------------------------------- |
| Framework | Next.js 16 (App Router) + TypeScript | Server-side fetch with ISR caching     |
| Styling   | Tailwind CSS + shadcn/ui             | Utility-first, accessible components   |
| Charts    | Recharts                             | Included via shadcn charts, composable |
| Runtime   | Bun                                  | Faster installs, native TS test runner |
| Container | Docker (multi-stage build)           | Lean production image                  |
| Cloud     | Render (existing image from GHCR)    | GitOps pipeline, auto-deploy on push   |

---

## Architecture

```
[ USGS GeoJSON API ]
        │
        ▼ app/dal/earthquakes.ts
        │ fetch + parse, revalidate: 3600
        │
        ▼ lib/earthquake-analytics.ts
        │ filterPhilippineQuakes()   → isolate PH events from global feed
        │ groupByRegion()            → strip prefix, extract city/province,
        │                               sum per-quake energy via calculateTotalEnergy()
        │ getMagnitudeBuckets()      → bucket into severity tiers (skips unrated events)
        │ getMetrics()               → derive KPI values
        │
        ▼ lib/energy-calculation.ts
        │ calculateSeismicEnergy(mag)   → E = 10^(1.5M + 4.8), per single quake
        │ calculateTotalEnergy(mags)    → sums energy across a region's quakes,
        │                                  skipping unrated (null-magnitude) events
        │ sortRegionsByEnergy(groups)   → ranks already-aggregated regions descending
        │
        ▼ app/page.tsx → features/
        │
        ├── features/metric-strips/
        ├── features/energy-table/
        ├── features/regional-charts/
        └── features/incident-feed-table/
```

> **Note on energy calculation:** total energy per region is summed from individual quake magnitudes, not derived from the region's average magnitude. Because the magnitude→energy relationship is exponential, converting an averaged magnitude back to energy can understate the true total by orders of magnitude whenever quake sizes vary within a region — e.g. one M7.0 alongside several smaller quakes.

---

## Project Structure

```
lindolph/
├── .github/workflows/
│   ├── ci.yml                      # Lint → typecheck → test → image → deploy
│   ├── codeql.yml                  # Security analysis
│   └── auto-target-develop.yml     # PR routing
├── app/
│   ├── dal/
│   │   └── earthquakes.ts          # USGS fetch + response parsing
│   ├── layout.tsx
│   ├── page.tsx                    # Server component, data fetch entry point
│   ├── error.tsx                   # Sentry-captured error boundary
│   ├── global-error.tsx            # Root error boundary
│   ├── not-found.tsx               # 404 page
│   └── globals.css
├── components/
│   ├── data-table/                 # Reusable data table primitives
│   ├── ui/                         # shadcn/ui primitives
│   ├── theme-provider.tsx
│   └── mode-toggle.tsx
├── features/
│   ├── metric-strips/              # KPI cards
│   ├── energy-table/               # Ranked energy release table
│   ├── regional-charts/            # Bar chart + donut chart
│   └── incident-feed-table/        # Searchable, filterable incident log
├── lib/
│   ├── earthquake-analytics.ts     # Filter, group, aggregate utilities
│   ├── energy-calculation.ts       # Gutenberg-Richter formula + region ranking
│   ├── earthquakes.ts              # USGS data parsing utilities
│   ├── data-table-parsers.ts       # Table column definitions + formatters
│   ├── relative-time.ts            # Humanized timestamps
│   ├── constants.ts                # App-wide constants
│   ├── utils.ts                    # Shared helpers
│   ├── schema/
│   │   └── usgs-feature.ts         # Valibot schema for USGS response
│   └── __tests__/
│       └── earthquake-analytics.test.ts
├── types/
│   ├── earthquakes.ts              # TypeScript interfaces for USGS GeoJSON
│   └── data-table.ts               # Table type definitions
├── env/
│   ├── server.ts                   # T3 env: server-side validation
│   ├── client.ts                   # T3 env: client-side validation
│   └── index.ts                    # Barrel exports
├── public/
│   └── images/
│       └── lindol-ph-preview.webp
├── secrets/                        # Local docker-compose secret files
├── instrumentation.ts              # Sentry server instrumentation
├── instrumentation-client.ts       # Sentry client instrumentation
├── sentry.server.config.ts
├── sentry.edge.config.ts
├── next.config.ts
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Running Locally

### With Bun (default)

```bash
bun install
bun dev
```

Open [http://localhost:3000](http://localhost:3000)

### With Docker (local test)

```bash
docker compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

> Full steps in [`DEPLOYMENT.md`](./DEPLOYMENT.md)

Push to `main` → GitHub Actions builds the Docker image with BuildKit secrets, pushes to GHCR, then triggers Render to pull and deploy.

---

## Data Source

**USGS Earthquake Hazards Program**  
Feed: `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`  
License: Public domain, no authentication required  
Update frequency: Every 5 minutes at source, cached at 1 hour in this app

---

## Scientific Reference

Gutenberg, B., & Richter, C. F. (1956). Earthquake magnitude, intensity, energy, and acceleration. _Bulletin of the Seismological Society of America_, 46(2), 105–145.

> The energy values produced by this app are **estimates** for analytical and educational purposes. They are not equivalent to official PHIVOLCS or USGS energy calculations, which use more complex physics-based models.

---

## License

MIT — see [LICENSE](LICENSE).
