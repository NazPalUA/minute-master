/**
 * Replaces placeholders in a string with provided values
 * @param text String containing placeholders like {placeholder}
 * @param values Object with keys matching the placeholder names and values to replace them
 * @returns String with placeholders replaced by their values
 * @example replacePlaceholders("Cannot exceed {max} characters.", { max: 100 }) => "Cannot exceed 100 characters."
 */
export function replacePlaceholders(
  text: string,
  values: Record<string, string | number>
): string {
  return Object.entries(values).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    text
  )
}

export type DeepIntersection<T, U, V> = {
  [K in keyof T & keyof U & keyof V as T[K] extends Record<string, unknown>
    ? U[K] extends Record<string, unknown>
      ? V[K] extends Record<string, unknown>
        ? K
        : never
      : never
    : K]: T[K] extends Record<string, unknown>
    ? U[K] extends Record<string, unknown>
      ? V[K] extends Record<string, unknown>
        ? DeepIntersection<T[K], U[K], V[K]>
        : never
      : never
    : T[K]
}
