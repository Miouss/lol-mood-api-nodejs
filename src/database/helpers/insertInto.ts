import { getQueryParams } from "../utils";

export function insertIntoValues(
  table: string,
  data: Record<string, string | number>
) {
  const { cols, values } = getQueryParams(data);

  const query = `INSERT INTO ${table} ${cols} VALUES ${values}`;

  return query;
}

export function insertInto(table: string) {
  return {
    values: (data: Record<string, string | number>) => {
      return insertIntoValues(table, data);
    },
  };
}
