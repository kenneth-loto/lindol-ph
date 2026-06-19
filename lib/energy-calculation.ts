import type { RegionGroup } from "@/types/earthquakes";

/**
 * Gutenberg-Richter energy relation
 * E = 10^(1.5M + 4.8) joules
 * Source: Gutenberg & Richter (1956)
 */
export function calculateSeismicEnergy(mag: number): number {
  return 10 ** (1.5 * mag + 4.8);
}

/**
 * Sorts already-aggregated region groups by total energy, descending.
 *
 * Deliberately does NOT compute totalEnergy here. Energy must be summed
 * per-quake during the raw-data reduction pass (see calculateTotalEnergy below),
 * NOT derived from avgMag — magnitude->energy is exponential, so
 * energy(avg(mags)) is wildly smaller than sum(energy(mag) for mag in mags)
 * whenever quake sizes vary within a region.
 */
export function sortRegionsByEnergy(groups: RegionGroup[]): RegionGroup[] {
  return [...groups].sort((a, b) => b.totalEnergy - a.totalEnergy);
}

/**
 * Sums energy across a list of magnitudes, skipping unreviewed (null) events.
 * Call this inside your raw-feature reduction pass, while you still have
 * access to individual quake.properties.mag values per region.
 */
export function calculateTotalEnergy(mags: (number | null)[]): number {
  return mags.reduce<number>((sum, mag) => {
    if (mag === null) return sum;

    return sum + calculateSeismicEnergy(mag);
  }, 0);
}

/**
 * Format a large joule value to scientific notation string.
 * e.g. 2400000000000 -> "2.40 × 10¹² J"
 *
 * Uses toExponential() rather than manual log10/floor math, which can
 * misround near float precision boundaries on some inputs.
 */
export function formatScientific(joules: number): string {
  if (joules === 0 || !Number.isFinite(joules)) return "0 J";

  const [coeff, expPart] = joules.toExponential(2).split("e");
  const expInt = parseInt(expPart, 10);

  if (expInt === 0) return `${coeff} J`;

  const superscripts: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
    "-": "⁻",
    "+": "",
  };

  const formattedExponent = String(expInt)
    .split("")
    .map((digit) => superscripts[digit] ?? digit)
    .join("");

  return `${coeff} × 10${formattedExponent} J`;
}
