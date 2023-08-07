import { whereQuery } from "./";

export function selectFromWhere(
  table: string,
  columns: string[],
  whereData: Record<string, string>,
  innerJoin?: string
) {
  const where = whereQuery(whereData);

  return `SELECT ${columns.join(", ")} FROM ${table} ${innerJoin} WHERE ${where}`;
}
