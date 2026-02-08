import type { ResumeData, ResumeBlock } from "@resume/types";

/**
 * Validates resume data structure
 */
export function validateResumeData(data: unknown): data is ResumeData {
  if (!data || typeof data !== "object") return false;
  
  const resumeData = data as Partial<ResumeData>;
  
  // Check required fields
  if (!resumeData.id || typeof resumeData.id !== "string") return false;
  if (!resumeData.version || typeof resumeData.version !== "number") return false;
  if (!resumeData.metadata || typeof resumeData.metadata !== "object") return false;
  if (!Array.isArray(resumeData.blocks)) return false;
  
  return true;
}

/**
 * Validates a single resume block
 */
export function validateBlock(block: unknown): block is ResumeBlock {
  if (!block || typeof block !== "object") return false;
  
  const resumeBlock = block as Partial<ResumeBlock>;
  
  if (!resumeBlock.type || typeof resumeBlock.type !== "string") return false;
  if (resumeBlock.data === undefined) return false;
  
  return true;
}

/**
 * Safely gets a block by index with bounds checking
 */
export function safeGetBlock(
  blocks: ResumeBlock[],
  index: number
): ResumeBlock | null {
  if (!Array.isArray(blocks)) return null;
  if (index < 0 || index >= blocks.length) return null;
  
  const block = blocks[index];
  return validateBlock(block) ? block : null;
}

/**
 * Capitalizes section name safely
 */
export function capitalizeSectionName(type: string): string {
  if (!type || typeof type !== "string") return "Section";
  return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Validates array data with type guard
 */
export function isValidArray<T>(data: unknown): data is T[] {
  return Array.isArray(data);
}

/**
 * Safely parses JSON with fallback
 */
export function safeJSONParse<T>(json: string, fallback: T): T {
  try {
    const parsed = JSON.parse(json);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Validates string input with max length
 */
export function validateStringInput(
  value: unknown,
  maxLength: number = 1000
): string {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLength);
}

/**
 * Sanitizes user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  
  // Basic sanitization - remove potentially dangerous characters
  return input
    .replace(/[<>]/g, "") // Remove angle brackets
    .trim();
}
