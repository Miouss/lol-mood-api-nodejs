import { sanitizeValue } from "../utils";

export function whereQuery(data: Record<string, string | number>) {
  return Object.keys(data)
    .map((key) => `${key} = ${sanitizeValue(data[key])}`)
    .join(" AND ");
}
