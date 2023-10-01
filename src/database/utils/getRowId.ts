import { RowDataPacket } from "mysql2/promise";
import { Query } from "../helpers";
import { executeQuery } from ".";

export async function getRowId(table: string, where: Record<string, string>) {
  const query = new Query().select("id").from(table).where(where);

  const rows = (await executeQuery(query, `get${table}Id`)) as RowDataPacket[];

  if (rows && rows.length > 0 && rows[0]?.id) {
    return rows[0].id;
  }

  return null;
}
