import { whereQuery } from ".";

export function select(...columns: string[]) {
  return {
    from: (table: string) => ({
      where: (whereData: Record<string, string>) =>
        selectFromWhere(columns, table, whereData),
      innerJoin: (innerJoin: string) => ({
        where: (whereData: Record<string, string>) =>
          selectFromWhere(columns, table, whereData, innerJoin),
      }),
      done: () => `SELECT ${columns.join(", ")} FROM ${table}`,
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

  if(!innerJoin){
    innerJoin = "";
  }

  return `SELECT ${columns.join(
    ", "
  )} FROM ${table} ${innerJoin} WHERE ${where}`;
}
