import https from "https";
import { db } from "./connectMariaDB.js";

const url = "https://vso24pauls.ita.voco.ee/databaseMaria/Tooted.txt";

async function fetchAndInsertTooted() {
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

  const insertQuery = `INSERT INTO TOOTED (Nimetus, Kaal, Hind, Liik, Tootja_id) VALUES (?, ?, ?, ?, ?)`;

  const connection = await db.getConnection();

  await connection.beginTransaction();
  try {
    for (const row of rows) {
      const { Nimetus, Kaal, Hind, Liik, Tootja } = row;
      await connection.execute(insertQuery, [
        Nimetus,
        Kaal,
        Hind,
        Liik,
        Tootja,
      ]);
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

export default fetchAndInsertTooted;
