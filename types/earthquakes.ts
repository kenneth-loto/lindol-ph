export interface RegionGroup {
  name: string;
  count: number;
  avgMag: number | null;
  avgDepth: number | null;
  totalEnergy: number;
}

export interface EarthquakeMetrics {
  totalCount: number;
  peakMag: number | null;
  peakLocation: string;
  topRegion: string;
  topRegionEnergy: number;
}

export interface MagnitudeBuckets {
  minor: number;
  light: number;
  strong: number;
}
