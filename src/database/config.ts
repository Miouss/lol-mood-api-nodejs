import mysql from "mysql2/promise";

async function connectToDatabase() {
  const isProduction = process.env.NODE_ENV === "production";

  const {
    DB_HOST,
    DB_HOST_DEV,
    DB_USER,
    DB_PASSWORD,
    DB_PASSWORD_DEV,
    DB_NAME,
  } = process.env;

  const connection = await mysql.createConnection({
    host: isProduction ? DB_HOST : DB_HOST_DEV,
    user: DB_USER,
    password: isProduction ? DB_PASSWORD : DB_PASSWORD_DEV,
    database: DB_NAME,
  });

  return connection;
}

export { connectToDatabase };
