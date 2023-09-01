import { whereQuery } from ".";

export function select(...columns: string[]) {
  return {
    from: (table: string) => ({
      where: (whereData: Record<string, string>) =>
        selectFromWhere(columns, table, whereData),
      innerJoin: (...tablesJoin: string[]) => ({
        where: (whereData: Record<string, string>) =>
          selectFromWhere(columns, table, whereData, tablesJoin),
      }),
      done: () => `SELECT ${columns.join(", ")} FROM ${table}`,
    }),
  };
}

function selectFromWhere(
  columns: string[],
  table: string,
  whereData: Record<string, string>,
  tablesJoin?: string[]
) {
  const where = whereQuery(whereData);

  let innerJoin = "";

  if (tablesJoin) {
    innerJoin = tablesJoin.reduce((acc, tableJoin) => {
      return `${acc} INNER JOIN ${tableJoin} ON ${table}.${tableJoin}Id = ${tableJoin}.id`;
    }, "");
  }

  return `SELECT ${columns.join(
    ", "
  )} FROM ${table} ${innerJoin} WHERE ${where}`;
}
