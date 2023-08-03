export function sanitizeValue(value: string | number) {
  if (typeof value === "string") {
    return `'${value}'`;
  }

  return `${value}`;
}
