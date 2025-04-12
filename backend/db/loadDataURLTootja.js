import https from "https";
import { db } from "./connectMariaDB.js";
import { TextDecoder } from "util";

const url = "https://vso24pauls.ita.voco.ee/databaseMaria/Tootja.txt";

async function fetchAndInsertTootja() {
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

  const insertQuery = `INSERT INTO TOOTJA (Tootja_id, Tootja) VALUES (?, ?)`;

  const connection = await db.getConnection();

  await connection.beginTransaction();
  try {
    for (const row of rows) {
      const { Tootja_id, Tootja } = row;
      await connection.execute(insertQuery, [Tootja_id, Tootja]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default fetchAndInsertTootja;
