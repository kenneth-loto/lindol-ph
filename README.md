# LindolPH

A minimalist seismic analytics dashboard that surfaces real-time earthquake activity across the Philippines. Pulls live data from the USGS Earthquake Hazards Program, isolates Philippine events, and computes estimated energy released per region using the Gutenberg-Richter energy relation.

<!--Built to demonstrate three distinct engineering skills: public API integration with server-side data processing, client-side data visualization, and containerized cloud deployment on AWS.-->

<!-----

## Live Demo

> Deployed on AWS EC2 (t2.micro) via Docker
> `http://<ec2-public-ip>` — link added after deployment-->

---

## The Problem

The Philippines sits on the Pacific Ring of Fire, making it one of the most seismically active countries in the world. PHIVOLCS monitors local activity, but their public data interface is not developer-friendly. The USGS API is free, unauthenticated, and updates continuously — but it returns global data with no regional breakdown or energy analysis out of the box.

LindolPH solves this by filtering, grouping, and computing actionable metrics from that raw global feed.

---

## Features

### KPI Metric Strips

Three at-a-glance cards at the top of the dashboard:

- **Total PH Incidents** — count of Philippine earthquakes in the past 7 days
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

| Layer     | Choice                               | Reason                                    |
| --------- | ------------------------------------ | ----------------------------------------- |
| Framework | Next.js 16 (App Router) + TypeScript | Server-side fetch with ISR caching        |
| Styling   | Tailwind CSS + shadcn/ui             | Utility-first, accessible components      |
| Charts    | Recharts                             | Included via shadcn charts, composable    |
| Runtime   | Bun                                  | Faster installs, native TS test runner    |
| Container | Docker (multi-stage build)           | Lean production image                     |
| Cloud     | AWS EC2 t2.micro                     | Free tier, real infrastructure deployment |

---

## Architecture

```
[ USGS GeoJSON API ]
        │
        ▼ Server-side fetch (Next.js App Router)
        │ revalidate: 3600 (1-hour ISR cache)
        │
        ▼ utils/earthquake-analytics.ts
        │ filterPhilippineQuakes()   → isolate PH events from global feed
        │ groupByRegion()            → strip prefix, extract city/province,
        │                               sum per-quake energy via calculateTotalEnergy()
        │ getMagnitudeBuckets()      → bucket into severity tiers (skips unrated events)
        │ getMetrics()               → derive KPI values (peakMag stays null, never 0,
        │                               when no rated event exists)
        │
        ▼ utils/energy-calculation.ts
        │ calculateSeismicEnergy(mag)   → E = 10^(1.5M + 4.8), per single quake
        │ calculateTotalEnergy(mags)    → sums energy across a region's quakes,
        │                                  skipping unrated (null-magnitude) events
        │ sortRegionsByEnergy(groups)   → ranks already-aggregated regions descending
        │
        ▼ app/page.tsx (passes typed props to components)
        │
        ├── components/MetricStrips.tsx
        ├── components/EnergyTable.tsx
        ├── components/RegionalCharts.tsx
        └── components/IncidentFeed.tsx
```

> **Note on energy calculation:** total energy per region is summed from individual quake magnitudes, not derived from the region's average magnitude. Because the magnitude→energy relationship is exponential, converting an averaged magnitude back to energy can understate the true total by orders of magnitude whenever quake sizes vary within a region — e.g. one M7.0 alongside several smaller quakes.

---

## Project Structure

```
lindolph/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Server component, data fetch entry point
│   └── services/
│       └── quakes.ts               # USGS fetch function
├── components/
│   ├── MetricStrips.tsx            # KPI cards
│   ├── EnergyTable.tsx             # Ranked energy release table
│   ├── RegionalCharts.tsx          # Bar chart + donut chart
│   └── IncidentFeed.tsx            # Searchable, filterable incident log
├── utils/
│   ├── earthquake-analytics.ts     # Filter, group, aggregate utilities
│   └── energy-calculation.ts       # Gutenberg-Richter formula + region ranking
├── types/
│   └── earthquakes.ts              # TypeScript interfaces for USGS GeoJSON
├── Dockerfile
├── .dockerignore
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
docker-compose up --build
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment (AWS EC2)

> Full deployment steps documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md)

**Summary:**

1. Launch EC2 t2.micro (Amazon Linux 2), open port 80 in Security Group
2. SSH into instance, install Docker
3. Copy project or clone from GitHub
4. `docker build -t lindolph .`
5. `docker run -d -p 80:3000 lindolph`
6. Access via public EC2 IP

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

<!--## What This Project Demonstrates

- Consuming and processing a real public REST API with typed TypeScript utilities
- Server-side data fetching and ISR caching in Next.js App Router
- Client-side filtering and search with React state
- Application of a real scientific formula to raw data
- Multi-stage Docker builds for lean production images
- Manual cloud deployment to AWS EC2 free tier-->

---

## License

MIT — see [LICENSE](LICENSE).
