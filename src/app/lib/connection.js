import mysql from "mysql2/promise";

export async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: "root",
    port: 3307,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  });
  const [results] = await connection.execute(sql, params);
  connection.end();
  return results;
}
