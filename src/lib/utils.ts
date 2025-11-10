import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Automatically determines badge variant based on performance score
 * @param value - Performance score (number or string with %, ₹, K, etc.)
 * @returns Badge variant type
 */
export function getPerformanceBadgeVariant(
  value: number | string
): "success" | "warning" | "danger" | "neutral" {
  // Convert string values to numbers
  let numValue: number;

  if (typeof value === "string") {
    // Remove common suffixes and prefixes
    const cleanValue = value
      .replace("%", "")
      .replace("₹", "")
      .replace("K", "")
      .replace("k", "")
      .replace(",", "")
      .trim();

    numValue = parseFloat(cleanValue);

    // If parsing failed, return neutral
    if (isNaN(numValue)) {
      return "neutral";
    }
  } else {
    numValue = value;
  }

  // Determine variant based on score thresholds
  if (numValue >= 80) return "success";
  if (numValue >= 60) return "warning";
  if (numValue >= 40) return "danger";
  return "neutral";
}
