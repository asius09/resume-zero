import { FLUFF_WORDS, WEAK_PHRASES_MAP } from './constants';

export function cleanText(text: string): string {
  let cleaned = text.trim();
  
  // Replace weak phrases first (so they get upgraded before fluff removal)
  Object.entries(WEAK_PHRASES_MAP).forEach(([weak, strong]) => {
    const regex = new RegExp(`\\b${weak}\\b`, 'gi');
    cleaned = cleaned.replace(regex, strong);
  });
  
  // Remove fluff words (case-insensitive)
  FLUFF_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });

  // Basic whitespace cleanup
  cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
  
  return cleaned;
}

export function normalizeBullet(bullet: string): string {
  let cleaned = cleanText(bullet);
  
  // Capitalize first letter
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }
  
  // Ensure it ends with a period if it's long enough
  if (cleaned.length > 10 && !cleaned.endsWith('.')) {
    cleaned += '.';
  }
  
  return cleaned;
}

export interface GuidanceHint {
  type: 'info' | 'warning' | 'suggestion';
  message: string;
}

export function analyzeBullet(bullet: string): GuidanceHint[] {
  const hints: GuidanceHint[] = [];
  const lowerBullet = bullet.toLowerCase();

  // Check for impact (numbers)
  if (!/\d+%|\d+\s?x|\$|million|billion|thousand/i.test(bullet)) {
    hints.push({
      type: 'suggestion',
      message: 'Consider adding quantifiable results (e.g., %, $, numbers).',
    });
  }

  // Check for length
  if (bullet.split(' ').length > 25) {
    hints.push({
      type: 'warning',
      message: 'This bullet is quite long. Try to keep it concise (under 20 words).',
    });
  }

  // Check for weak start
  const weakStarts = ['responsible for', 'worked on', 'helped', 'assisted', 'managed'];
  if (weakStarts.some(weak => lowerBullet.startsWith(weak))) {
    hints.push({
      type: 'suggestion',
      message: 'Start with a stronger action verb (e.g., Orchestrated, Spearheaded, Optimized).',
    });
  }

  return hints;
}
