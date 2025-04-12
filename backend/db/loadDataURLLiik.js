import https from "https";
import { db } from "./connectMariaDB.js";

const url = "https://vso24pauls.ita.voco.ee/databaseMaria/Liik.txt";

async function fetchAndInsert() {
  let data = "";

  // 1. Fetch the file
  await new Promise((resolve, reject) => {
    https.get(url, (res) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => (data += chunk));
      res.on("end", resolve);
      res.on("error", reject);
    });
  });

  const lines = data.replace(/\r/g, "").trim().split("\n");
  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    return Object.fromEntries(headers.map((key, i) => [key, values[i]]));
  });

  const insertQuery = `INSERT INTO LIIK (Liigi_id, Nimetus) VALUES (?, ?)`;

  const connection = await db.getConnection();

  await connection.beginTransaction();
  try {
    for (const row of rows) {
      const { Liigi_id, Nimetus } = row;
      await connection.execute(insertQuery, [Liigi_id, Nimetus]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default fetchAndInsert;
