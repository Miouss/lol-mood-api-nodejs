import { sanitizeValue } from "../utils";

export function setQuery(data: Record<string, string | number>) {
  return Object.keys(data)
    .map((key) => `${key} = ${sanitizeValue(data[key])}`)
    .join(", ");
}