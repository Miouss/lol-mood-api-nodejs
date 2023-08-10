import { select } from "../helpers";
import { executeQuery } from "./executeQuery";

export async function isStored(table: string, where: Record<string, string>) {
  const query = select("id").from(table).where(where);

  const rows = await executeQuery(query, `is${table}Stored`);

  if (rows) {
    console.log(`${table} found`);
    return true;
  }

  console.log(`${table} not found`);

  return false;
}
