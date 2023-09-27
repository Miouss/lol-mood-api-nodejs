import mysql from "mysql2/promise";

async function connectToDatabase() {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
  });

  return connection;
}

export { connectToDatabase };
