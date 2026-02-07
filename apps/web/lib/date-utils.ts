import { MONTHS } from "./constants";

export interface ParsedDate {
  month: string;
  year: string;
}

/**
 * Parse a date string into month and year components
 * Supports formats: "Jan 2026", "2026", "January", "YYYY-MM"
 */
export function parseDate(dateStr: string): ParsedDate {
  if (!dateStr) return { month: "", year: "" };
  
  const parts = dateStr.trim().split(" ");
  
  // Check for "Jan 2026" format
  if (parts.length === 2 && parts[0] !== "" && parts[1] !== "") {
    const [shortMonth, year] = parts;
    const fullMonth = MONTHS.find(m => m.startsWith(shortMonth));
    if (fullMonth) return { month: fullMonth, year };
  }

  // Check for single parts (month OR year)
  if (parts.length === 1) {
    // Is it a 4-digit year?
    if (/^\d{4}$/.test(parts[0])) {
      return { month: "", year: parts[0] };
    }
    // Assume it's a month
    const fullMonth = MONTHS.find(m => m.startsWith(parts[0]));
    if (fullMonth) return { month: fullMonth, year: "" };
  }

  // Fallback for "YYYY-MM" format
  if (dateStr.includes("-")) {
    const [year, month] = dateStr.split("-");
    const monthName = MONTHS[parseInt(month) - 1] || "";
    return { month: monthName, year };
  }

  return { month: "", year: "" };
}

/**
 * Format month and year into a display string
 * Returns format: "Jan 2026", "Jan", "2026", or empty string
 */
export function formatDate(month: string, year: string): string {
  const m = month ? month.slice(0, 3) : "";
  const y = year || "";
  return `${m} ${y}`.trim();
}
