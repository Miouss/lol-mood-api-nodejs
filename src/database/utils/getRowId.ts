import { RowDataPacket } from "mysql2/promise";
import { selectFromWhere } from "../helpers";
import { executeQuery } from ".";

export async function getRowId(table: string, where: Record<string, string>) {
  const query = selectFromWhere(table, ["id"], where);

  const rows = (await executeQuery(query, `get${table}Id`)) as RowDataPacket[];

  if (rows && rows.length > 0 && rows[0]?.id) {
    console.log(`${table}'s table ID found`);

    return rows[0].id;
  }

  console.log(`${table}'s table ID not found`);

  return null;
}
