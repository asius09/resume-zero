import { MONTHS } from "./constants";

export interface ParsedDate {
  month: string;
  year: string;
}

/**
 * Validates if a year string is valid
 */
function isValidYear(year: string): boolean {
  const yearNum = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  return !isNaN(yearNum) && yearNum >= 1900 && yearNum <= currentYear + 10;
}

/**
 * Validates if a month string is valid
 */
function isValidMonth(month: string): boolean {
  return MONTHS.some(m => m === month || m.startsWith(month));
}

/**
 * Parse a date string into month and year components
 * Supports formats: "Jan 2026", "2026", "January", "YYYY-MM"
 * Returns empty strings for invalid input
 */
export function parseDate(dateStr: string): ParsedDate {
  // Validate input
  if (!dateStr || typeof dateStr !== "string") {
    return { month: "", year: "" };
  }

  try {
    const trimmed = dateStr.trim();
    if (!trimmed) return { month: "", year: "" };

    const parts = trimmed.split(" ");
    
    // Check for "Jan 2026" format
    if (parts.length === 2 && parts[0] && parts[1]) {
      const [shortMonth, year] = parts;
      
      // Validate year first
      if (!isValidYear(year)) {
        return { month: "", year: "" };
      }

      const fullMonth = MONTHS.find(m => m.startsWith(shortMonth));
      if (fullMonth && isValidMonth(fullMonth)) {
        return { month: fullMonth, year };
      }
    }

    // Check for single parts (month OR year)
    if (parts.length === 1 && parts[0]) {
      const part = parts[0];
      
      // Is it a 4-digit year?
      if (/^\d{4}$/.test(part) && isValidYear(part)) {
        return { month: "", year: part };
      }
      
      // Assume it's a month
      const fullMonth = MONTHS.find(m => m.startsWith(part));
      if (fullMonth && isValidMonth(fullMonth)) {
        return { month: fullMonth, year: "" };
      }
    }

    // Fallback for "YYYY-MM" format
    if (trimmed.includes("-")) {
      const [year, monthNum] = trimmed.split("-");
      
      if (!isValidYear(year)) {
        return { month: "", year: "" };
      }

      const monthIndex = parseInt(monthNum, 10) - 1;
      if (monthIndex >= 0 && monthIndex < MONTHS.length) {
        const monthName = MONTHS[monthIndex];
        return { month: monthName, year };
      }
    }

    return { month: "", year: "" };
  } catch (error) {
    console.error("Error parsing date:", error);
    return { month: "", year: "" };
  }
}

/**
 * Format month and year into a display string
 * Returns format: "Jan 2026", "Jan", "2026", or empty string
 * Validates input before formatting
 */
export function formatDate(month: string, year: string): string {
  try {
    // Validate inputs
    if (typeof month !== "string" || typeof year !== "string") {
      return "";
    }

    const validMonth = month && isValidMonth(month) ? month.slice(0, 3) : "";
    const validYear = year && isValidYear(year) ? year : "";
    
    return `${validMonth} ${validYear}`.trim();
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
}
