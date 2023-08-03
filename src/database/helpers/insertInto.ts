import { getQueryParams } from "../utils";

export function insertInto(
  table: string,
  data: Record<string, string | number>
) {
  const { cols, values } = getQueryParams(data);

  const query = `INSERT INTO ${table} ${cols} VALUES ${values}`;

  return query;
}