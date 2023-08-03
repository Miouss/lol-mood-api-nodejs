export function getColumns(data: Record<string, string | number>) {
  return `(${Object.keys(data).join(", ")})`;
}
