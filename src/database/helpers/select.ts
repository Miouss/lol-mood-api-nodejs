import { whereQuery } from ".";

export function select(...columns: string[]) {
  return {
    from: (table: string) => ({
      where: (whereData: Record<string, string>) =>
        selectFromWhere(columns, table, whereData),
    }),
  };
}

function selectFromWhere(
  columns: string[],
  table: string,
  whereData: Record<string, string>,
  innerJoin?: string
) {
  const where = whereQuery(whereData);

  return `SELECT ${columns.join(
    ", "
  )} FROM ${table} ${innerJoin} WHERE ${where}`;
}
