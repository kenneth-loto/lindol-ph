import type { RegionGroup } from "@/types/earthquakes";

export function calculateSeismicEnergy(mag: number): number {
  return 10 ** (1.5 * mag + 4.8);
}

export function sortRegionsByEnergy(groups: RegionGroup[]): RegionGroup[] {
  return [...groups].sort((a, b) => b.totalEnergy - a.totalEnergy);
}

export function calculateTotalEnergy(mags: (number | null)[]): number {
  return mags.reduce<number>((sum, mag) => {
    if (mag === null) return sum;

    return sum + calculateSeismicEnergy(mag);
  }, 0);
}

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
