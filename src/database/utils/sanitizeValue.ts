export function sanitizeValue(value: string | number) {
  return typeof value === "string" ? `'${value}'` : `${value}`;
}
