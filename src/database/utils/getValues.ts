import { sanitizeValue } from "./";

export function getValues(data: Record<string, string | number>) {
  return `(${Object.values(data)
    .map((value) => sanitizeValue(value))
    .join(", ")})`;
}
