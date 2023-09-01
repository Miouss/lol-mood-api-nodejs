import { connectToDatabase } from "../config";

export async function executeQuery(query: string, name?: string) {
  const conn = await connectToDatabase();

  if (!conn)
    return console.error(
      "Error executing query: Connection to database failed."
    );

  try {
    const [rows] = await conn.query(query);
    console.log(`Query ${name} executed successfully.`);
    return rows;
  } catch (err: any) {
    console.error(`Error executing\n\n${query} \n\n ${name}:`, err.message);

    return null;
  } finally {
    conn.end();
  }
}
