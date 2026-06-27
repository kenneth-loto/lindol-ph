import { describe, expect, test } from "bun:test";
import {
  calculateSeismicEnergy,
  calculateTotalEnergy,
  formatScientific,
} from "../energy-calculation";

describe("calculateSeismicEnergy", () => {
  test("computes Gutenberg-Richter formula correctly for mag 5.0", () => {
    const energy = calculateSeismicEnergy(5.0);

    // 10^(1.5*5.0 + 4.8) = 10^12.3 ≈ 1.99526 × 10¹²
    expect(energy).toBeGreaterThan(1.99e12);
    expect(energy).toBeLessThan(2.0e12);
  });

  test("computes for mag 0.0", () => {
    const energy = calculateSeismicEnergy(0);

    // 10^(0 + 4.8) = 10^4.8 ≈ 63095.7
    expect(energy).toBeCloseTo(63_095.7, -1);
  });

  test("computes for mag 9.5 (largest recorded)", () => {
    const energy = calculateSeismicEnergy(9.5);

    // 10^(1.5*9.5 + 4.8) = 10^19.05 ≈ 1.122 × 10¹⁹
    expect(energy).toBeGreaterThan(1e19);
    expect(energy).toBeLessThan(1.2e19);
  });

  test("handles negative magnitude", () => {
    const energy = calculateSeismicEnergy(-2);

    // Still valid mathematically: 10^(-3 + 4.8) = 10^1.8 ≈ 63
    expect(energy).toBeGreaterThan(0);
    expect(energy).toBeCloseTo(63.1, -1);
  });
});

describe("calculateTotalEnergy", () => {
  test("sums energy for multiple valid magnitudes", () => {
    const total = calculateTotalEnergy([5.0, 4.0]);
    const e5 = calculateSeismicEnergy(5.0);
    const e4 = calculateSeismicEnergy(4.0);

    expect(total).toBeCloseTo(e5 + e4, 0);
  });

  test("skips null entries", () => {
    const total = calculateTotalEnergy([5.0, null, 4.0, null]);
    const e5 = calculateSeismicEnergy(5.0);
    const e4 = calculateSeismicEnergy(4.0);

    expect(total).toBeCloseTo(e5 + e4, 0);
  });

  test("returns 0 for empty array", () => {
    expect(calculateTotalEnergy([])).toBe(0);
  });

  test("returns 0 when all entries are null", () => {
    expect(calculateTotalEnergy([null, null, null])).toBe(0);
  });

  test("handles single element array", () => {
    const energy = calculateSeismicEnergy(3.5);

    expect(calculateTotalEnergy([3.5])).toBeCloseTo(energy, 0);
  });

  test("does not mutate the input array", () => {
    const input: (number | null)[] = [5.0, null, 4.0];
    const copy = [...input];

    calculateTotalEnergy(input);
    expect(input).toEqual(copy);
  });
});

describe("formatScientific", () => {
  test("formats positive energy correctly", () => {
    const energy = calculateSeismicEnergy(5.0);

    expect(formatScientific(energy)).toBe("2.00 × 10¹² J");
  });

  test("returns 0 J for zero input", () => {
    expect(formatScientific(0)).toBe("0 J");
  });

  test("returns 0 J for NaN", () => {
    expect(formatScientific(NaN)).toBe("0 J");
  });

  test("returns 0 J for Infinity", () => {
    expect(formatScientific(Infinity)).toBe("0 J");
    expect(formatScientific(-Infinity)).toBe("0 J");
  });

  test("formats exponent with Unicode superscripts", () => {
    expect(formatScientific(500)).toBe("5.00 × 10² J");
    expect(formatScientific(1_234_567)).toBe("1.23 × 10⁶ J");
    expect(formatScientific(5e-10)).toBe("5.00 × 10⁻¹⁰ J");
  });

  test("handles values with exponent 0", () => {
    // Values between 0.5 and 5 or so may have exp 0
    const result = formatScientific(2);

    expect(result).toBe("2.00 J");
  });
});
