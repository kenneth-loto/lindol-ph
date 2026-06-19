export interface USGSFeature {
  id: string;
  properties: {
    mag: number | null; // USGS returns null for unreviewed/automatic events
    place: string;
    time: number; // epoch ms
  };
  geometry: {
    coordinates: [number, number, number]; // [lon, lat, depth_km]
  };
}

export interface RegionGroup {
  name: string;
  count: number;
  avgMag: number | null; // null when count is 0 or no rated events yet
  avgDepth: number | null;
  totalEnergy: number;
}

export interface EarthquakeMetrics {
  totalCount: number;
  peakMag: number | null; // null if no rated event found in the batch
  peakLocation: string;
  topRegion: string;
  topRegionEnergy: number;
}

export interface MagnitudeBuckets {
  minor: number; // < 3.0
  light: number; // 3.0 – 4.9
  strong: number; // 5.0+
}
