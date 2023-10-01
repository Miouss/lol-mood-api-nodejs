import { getQueryParams, sanitizeValue } from "../utils";

export class Query {
  private query: string = "";
  private table: string = "";

  public get() {
    return this.query;
  }

  select(...columns: string[]) {
    this.query += `SELECT ${columns.join(", ")}`;
    return this;
  }

  from(table: string) {
    this.query += ` FROM ${table}`;
    this.table = table;

    return this;
  }

  where(data: Record<string, string | number>) {
    const where = Object.keys(data)
      .map((key) => `${key} = ${sanitizeValue(data[key])}`)
      .join(" AND ");

    this.query += ` WHERE ${where}`;
    return this;
  }

  innerJoin(tableJoin: string) {
    this.query += ` INNER JOIN ${tableJoin} ON ${this.table}.${tableJoin}Id = ${tableJoin}.id`;

    return this;
  }

  insertInto(table: string) {
    this.query += `INSERT INTO ${table}`;

    return this;
  }

  values(data: Record<string, string | number>) {
    const { cols, values } = getQueryParams(data);

    this.query += ` ${cols} VALUES ${values}`;

    return this;
  }

  update(table: string) {
    this.query += `UPDATE ${table}`;

    return this;
  }

  set(data: Record<string, string | number>) {
    const set = Object.keys(data)
      .map((key) => `${key} = ${sanitizeValue(data[key])}`)
      .join(", ");

    this.query += ` SET ${set}`;

    return this;
  }
}
