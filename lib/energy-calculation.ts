/**
 * Calculates seismic energy released by an earthquake using the
 * Gutenberg-Richter energy-magnitude relation.
 *
 * @param mag - Earthquake magnitude.
 * @returns Estimated seismic energy in joules.
 *
 * @example
 * calculateSeismicEnergy(5.0) // 1995262314.968879
 */
export function calculateSeismicEnergy(mag: number): number {
  return 10 ** (1.5 * mag + 4.8);
}

/**
 * Sums the seismic energy of multiple earthquakes by magnitude, skipping
 * any `null` entries.
 *
 * @param mags - List of magnitudes, where `null` represents a missing value.
 * @returns Total combined seismic energy in joules.
 *
 * @example
 * calculateTotalEnergy([5.0, null, 4.2]) // sums energy for 5.0 and 4.2, skips null
 */
export function calculateTotalEnergy(mags: (number | null)[]): number {
  return mags.reduce<number>((sum, mag) => {
    if (mag === null) return sum;

    return sum + calculateSeismicEnergy(mag);
  }, 0);
}

/**
 * Formats a joule value as a human-readable scientific notation string with
 * a Unicode superscript exponent.
 *
 * @param joules - Energy value in joules.
 * @returns A string like `"1.99 × 10⁹ J"`, or `"0 J"` if the value is zero
 * or not finite (e.g. `NaN`, `Infinity`).
 *
 * @example
 * formatScientific(1995262314.97) // "2.00 × 10⁹ J"
 * formatScientific(0)             // "0 J"
 * formatScientific(500)           // "5.00 × 10² J"
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
