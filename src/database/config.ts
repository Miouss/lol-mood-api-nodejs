import mysql from "mysql2/promise";

async function connectToDatabase() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });

    return connection;
  } catch (err: any) {
    console.error("Error connecting to MySQL:", err.message);

    return null;
  }
}

export { connectToDatabase };
