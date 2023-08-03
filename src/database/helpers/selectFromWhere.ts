import { whereQuery } from "./";

export function selectFromWhere(
  table: string,
  columns: string[],
  whereData: Record<string, string>
) {
  const where = whereQuery(whereData);

  return `SELECT ${columns.join(", ")} FROM ${table} WHERE ${where}`;
}
