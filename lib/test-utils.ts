/**
 * Test utilities for API route testing
 */

/**
 * Creates a params object compatible with Next.js API route params
 */
export function createParams<T extends Record<string, string>>(
  params: T
): Promise<T> {
  return Promise.resolve(params);
}

/**
 * Compares objects with Date fields by converting dates to ISO strings
 * Useful for testing API responses where dates are serialized as strings
 */
export function expectWithSerializedDates<T extends Record<string, any>>(
  received: T,
  expected: T
): void {
  const serializeValue = (value: any): any => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(serializeValue);
    }
    if (value && typeof value === 'object') {
      return Object.fromEntries(
        Object.entries(value).map(([k, v]) => [k, serializeValue(v)])
      );
    }
    return value;
  };

  expect(received).toEqual(serializeValue(expected));
}
