export const SECONDS = 1000;
export const MINUTES = 60 * SECONDS;
export const HOURS = 60 * MINUTES;
export const DAYS = 24 * HOURS;
export const WEEKS = 7 * DAYS;

export const PH_BOUNDS = {
  latMin: 4.5,
  latMax: 21.5,
  lonMin: 116,
  lonMax: 127,
} as const;

export const THEME_TOGGLE_KEY = "m";

export const HOMEPAGE_TABS = [
  "overview",
  "energy-table",
  "incident-feed-table",
] as const;

export const MOBILE_BREAKPOINT = 768;
export const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;
