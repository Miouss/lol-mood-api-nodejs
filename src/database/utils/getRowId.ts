import { RowDataPacket } from "mysql2/promise";
import { select } from "../helpers";
import { executeQuery } from ".";

export async function getRowId(table: string, where: Record<string, string>) {
  const query = select("id").from(table).where(where);

  const rows = (await executeQuery(query, `get${table}Id`)) as RowDataPacket[];

  if (rows && rows.length > 0 && rows[0]?.id) {
    console.log(`${table}'s table ID found`);

    return rows[0].id;
  }

  console.log(`${table}'s table ID not found`);

  return null;
}
