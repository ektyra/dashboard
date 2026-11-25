type Plain = Record<string, unknown>;

const isPlain = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Merges objects deeply: nested objects are merged, everything else (including arrays) is replaced. */
export function deepMerge<T extends Plain>(base: T, ...overrides: Plain[]): T {
  const result: Plain = { ...base };
  for (const override of overrides) {
    for (const [key, value] of Object.entries(override)) {
      const current = result[key];
      result[key] = isPlain(current) && isPlain(value) ? deepMerge(current, value) : value;
    }
  }
  return result as T;
}
