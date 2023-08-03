import { whereQuery, setQuery } from "./";

export function updateSetWhere(
  table: string,
  setData: Record<string, string | number>,
  whereData: Record<string, string>
) {
  const set = setQuery(setData);

  const where = whereQuery(whereData);

  return `UPDATE ${table} SET ${set} WHERE ${where}`;
}
