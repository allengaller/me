import { Locale, Localized } from '../types/base.js';

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get current ISO timestamp
 */
export function now(): string {
  return new Date().toISOString();
}

/**
 * Deep merge two objects
 */
export function mergeDeep<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const output = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = output[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      (output as Record<string, unknown>)[key] = mergeDeep(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else {
      (output as Record<string, unknown>)[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return output;
}

/**
 * Check if value is a plain object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Pick localized value based on locale preference
 */
export function pickLocale<T>(localized: Localized<T>, preferredLocale: Locale): T {
  if (preferredLocale !== 'en' && localized[preferredLocale]) {
    return localized[preferredLocale]!;
  }
  return localized.en;
}

/**
 * Create a localized string
 */
export function createLocalized(en: string, zh?: string): Localized<string> {
  const result: Localized<string> = { en };
  if (zh) result.zh = zh;
  return result;
}

/**
 * Deep clone an object
 */
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Pick specific keys from an object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result as Omit<T, K>;
}
