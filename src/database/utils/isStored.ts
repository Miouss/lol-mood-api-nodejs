import { Query } from "../helpers";
import { executeQuery } from "./executeQuery";

export async function isStored(table: string, where: Record<string, string>) {
  const query = new Query().select("id").from(table).where(where);

  const rows = await executeQuery(query, `is${table}Stored`);

  if (Array.isArray(rows) && rows.length > 0) {
    return true;
  }

  return false;
}
