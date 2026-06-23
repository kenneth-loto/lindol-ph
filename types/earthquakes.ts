import type { USGSFeature } from "@/lib/schema/usgs-feature";

export interface EarthquakeFeed {
  features: USGSFeature[];
  previousWeekFeatures: USGSFeature[];
  generatedAt: number;
}

export interface RegionGroup {
  name: string;
  count: number;
  avgMag: number | null;
  avgDepth: number | null;
  totalEnergy: number;
}

export interface RegionAccumulator {
  validMags: number[];
  depths: number[];
  totalEnergy: number;
  totalCount: number;
}

export interface EarthquakeMetrics {
  totalCount: number;
  peakMag: number | null;
  peakLocation: string;
  topRegion: string;
  topRegionEnergy: number;
  vsLastWeek: number | null;
}

export interface IncidentFeedItem {
  id: string;
  mag: number | null;
  location: string;
  time: number;
}

export interface MagnitudeBuckets {
  minor: number;
  light: number;
  strong: number;
}
