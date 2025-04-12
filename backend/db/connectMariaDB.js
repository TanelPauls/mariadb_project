import mysql from "mysql2/promise";
import dotenv from "dotenv";
import CreateTables from "./initTables.js";

dotenv.config();

const db = mysql.createPool({
  host: process.env.MYSQL_IP,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PW,
  database: process.env.MYSQL_DB,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
});

const connectMySQL = async () => {
  try {
    await db.query("SELECT 1");
    console.log("MySQL connected!");
    await CreateTables.createTableTOOTJA();
    await CreateTables.createTableLIIK();
    await CreateTables.createTableTOOTED();
  } catch (err) {
    console.error(`Error connecting to MySQL: ${err.message}`);
    process.exit(1);
  }
};

export { db, connectMySQL };
