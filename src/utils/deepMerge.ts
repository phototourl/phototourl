// Simple deep merge for plain objects/arrays, enough for messages fallback
export function merge<T>(target: T, source: T): T {
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source] as T;
  }
  if (isObject(target) && isObject(source)) {
    const result: Record<string, unknown> = { ...target };
    for (const key of Object.keys(source)) {
      const tv = (target as Record<string, unknown>)[key];
      const sv = (source as Record<string, unknown>)[key];
      if (isObject(tv) && isObject(sv)) {
        result[key] = merge(tv, sv);
      } else {
        result[key] = sv;
      }
    }
    return result as T;
  }
  return source;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

