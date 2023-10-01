import { connectToDatabase } from "../config";
import { Query } from "../helpers/Query";

export async function executeQuery(query: Query, name?: string) {
  const conn = await connectToDatabase();

  if (!conn)
    return console.error(
      "Error executing query: Connection to database failed."
    );

  try {
    const [rows] = await conn.query(query.get());

    return rows;
  } catch (err: any) {
    console.error(
      `Error executing\n\n${query.get()} \n\n ${name}:`,
      err.message
    );

    return null;
  } finally {
    conn.end();
  }
}
