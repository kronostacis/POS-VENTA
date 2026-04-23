import mysql from "mysql2/promise";

export async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER || "root",
    port: Number(process.env.MYSQL_PORT) || 3306,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  const [results] = await connection.execute(sql, params);
  connection.end();
  return results;
}
