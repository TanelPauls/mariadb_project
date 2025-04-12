import { db } from "./connectMariaDB.js";

class tableOperations {
  static async dropTableTOOTED() {
    const query = `
          DROP TABLE IF EXISTS TOOTED;
        `;
    try {
      await db.query(query);
    } catch (error) {
      console.error("Error tabeli TOOTED kustutamisel:", error.stack);
      throw error;
    }
  }
  static async dropTableTOOTJA() {
    const query = `
          DROP TABLE IF EXISTS TOOTJA;
        `;
    try {
      await db.query(query);
    } catch (error) {
      console.error("Error tabeli TOOTJA kustutamisel:", error.stack);
      throw error;
    }
  }
  static async dropTableLIIK() {
    const query = `
          DROP TABLE IF EXISTS LIIK;
        `;
    try {
      await db.query(query);
    } catch (error) {
      console.error("Error tabeli LIIK kustutamisel:", error.stack);
      throw error;
    }
  }

  static async unSorted() {
    const query = `
          SELECT Nimetus, Kaal, Hind FROM TOOTED;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli sorteerimisel: ", error.stack);
      throw error;
    }
  }

  static async sortUp() {
    const query = `
          SELECT Nimetus, Kaal, Hind FROM TOOTED ORDER BY Hind ASC;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli sorteerimisel: ", error.stack);
      throw error;
    }
  }

  static async sortDown() {
    const query = `
          SELECT Nimetus, Kaal, Hind FROM TOOTED ORDER BY Hind DESC;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli sorteerimisel: ", error.stack);
      throw error;
    }
  }

  static async priceKG() {
    const query = `
          SELECT Nimetus, Kaal, Hind, ROUND(Hind / (Kaal / 1000), 2) AS Kilo_hind FROM TOOTED;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabelis kilohind: ", error.stack);
      throw error;
    }
  }

  static async priceKGsortDown() {
    const query = `
          SELECT Nimetus, Kaal, Hind, ROUND(Hind / (Kaal / 1000), 2) AS Kilo_hind FROM TOOTED ORDER BY Kilo_hind DESC;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli kilohind sorteerimisel: ", error.stack);
      throw error;
    }
  }

  static async priceKGsortUp() {
    const query = `
          SELECT Nimetus, Kaal, Hind, ROUND(Hind / (Kaal / 1000), 2) AS Kilo_hind FROM TOOTED ORDER BY Kilo_hind ASC;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli kilohind sorteerimisel: ", error.stack);
      throw error;
    }
  }

  static async search(name, price) {
    const query = `
      SELECT Nimetus, Kaal, Hind FROM TOOTED WHERE Nimetus LIKE ? AND Hind > ?;
      `;
    try {
      const nameSearch = `%${name}%`;
      const [rows] = await db.query(query, [nameSearch, price]);
      return rows;
    } catch (error) {
      console.error("Error otsimisel:", error.message);
      throw error;
    }
  }

  static async updateProduct(id, fields) {
    console.log("something comes in!");
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      throw new Error("No valid fields to update.");
    }

    const query = `UPDATE TOOTED SET ${updates.join(", ")} WHERE id = ?;`;

    values.push(id);

    try {
      const [result] = await db.query(query, values);
      return result;
    } catch (error) {
      console.error("Error updating product:", error.message);
      throw error;
    }
  }

  static async namePriceVariety() {
    const query = `
          SELECT TOOTED.Nimetus AS Toode, TOOTED.Hind, LIIK.Nimetus AS Liik
          FROM 
            TOOTED
          JOIN 
            LIIK ON TOOTED.Liik = LIIK.Liigi_id;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli koostamisel: ", error.stack);
      throw error;
    }
  }

  static async namePriceVarietyCompany() {
    const query = `
          SELECT TOOTED.Nimetus AS Toode, TOOTED.Hind, LIIK.Nimetus AS Liik, TOOTJA.Tootja AS Tootja
          FROM 
            TOOTED
          JOIN 
            LIIK ON TOOTED.Liik = LIIK.Liigi_id
          JOIN 
            TOOTJA ON TOOTED.Tootja_id = TOOTJA.Tootja_id;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli koostamisel: ", error.stack);
      throw error;
    }
  }

  static async breads() {
    const query = `
          SELECT 
            LIIK.Nimetus AS Liik,
            COUNT(*) AS Kogus
          FROM 
            TOOTED
          JOIN 
            LIIK ON TOOTED.Liik = LIIK.Liigi_id
          WHERE 
            LIIK.Nimetus IN ('sai', 'leib')
          GROUP BY 
            LIIK.Nimetus;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli koostamisel: ", error.stack);
      throw error;
    }
  }

  static async helper() {
    const query = `
          SELECT COUNT(*) AS Count
          FROM information_schema.columns 
          WHERE LOWER(table_name) = 'tooted' 
          AND column_name = 'Allahindlus';
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error(
        "Error kontrollis kas allahindluse väli on olemas: ",
        error.stack
      );
      throw error;
    }
  }
  static async addDiscount() {
    const query = `
          ALTER TABLE TOOTED
          ADD COLUMN Allahindlus INT DEFAULT 0;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error allahindluse lisamisel: ", error.stack);
      throw error;
    }
  }

  static async applyDiscount(searchTerm, discountValue) {
    const query = `
      UPDATE TOOTED
      SET Allahindlus = ?
      WHERE Nimetus LIKE ?;
    `;

    try {
      const [result] = await db.query(query, [
        discountValue,
        `%${searchTerm}%`,
      ]);
      return result;
    } catch (error) {
      console.error("Error allahindluse lisamisel:", error.message);
      throw error;
    }
  }

  static async allDiscounts() {
    const query = `
          SELECT 
            Nimetus AS Toode,
            Hind AS Vana_Hind,
            Allahindlus,
            ROUND(Hind * (1 - Allahindlus / 100), 2) AS Uus_Hind
          FROM 
            TOOTED
          WHERE 
            Allahindlus > 0;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli koostamisel: ", error.stack);
      throw error;
    }
  }

  static async oldDiscounts() {
    const query = `
          SELECT 
            Nimetus AS Toode,
            Hind AS Vana_Hind,
            Allahindlus,
            ROUND(Hind * (1 - Allahindlus / 100), 2) AS Uus_Hind
          FROM 
            TOOTED;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli koostamisel: ", error.stack);
      throw error;
    }
  }

  static async cheapest() {
    const query = `
          SELECT * FROM (
            SELECT T.Nimetus, T.Hind, L.Nimetus AS Liik
            FROM TOOTED T
            JOIN LIIK L ON T.Liik = L.Liigi_id
            WHERE L.Nimetus = 'Sai'
            ORDER BY T.Hind ASC
            LIMIT 1
          ) AS SaiToode

          UNION ALL

          SELECT * FROM (
            SELECT T.Nimetus, T.Hind, L.Nimetus AS Liik
            FROM TOOTED T
            JOIN LIIK L ON T.Liik = L.Liigi_id
            WHERE L.Nimetus = 'Leib'
            ORDER BY T.Hind ASC
            LIMIT 1
          ) AS LeibToode;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli koostamisel: ", error.stack);
      throw error;
    }
  }

  static async mostexpensive() {
    const query = `
          SELECT * FROM (
            SELECT T.Nimetus, T.Hind, L.Nimetus AS Liik
            FROM TOOTED T
            JOIN LIIK L ON T.Liik = L.Liigi_id
            WHERE L.Nimetus = 'Leib'
            ORDER BY T.Hind DESC
            LIMIT 3
          ) AS TopLeivad

          UNION ALL

          SELECT * FROM (
            SELECT T.Nimetus, T.Hind, L.Nimetus AS Liik
            FROM TOOTED T
            JOIN LIIK L ON T.Liik = L.Liigi_id
            WHERE L.Nimetus = 'Sai'
            ORDER BY T.Hind DESC
            LIMIT 3
          ) AS TopSaid;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli koostamisel: ", error.stack);
      throw error;
    }
  }

  static async loadEdit() {
    const query = `
          SELECT id, Nimetus, Kaal, Hind FROM TOOTED;
        `;
    try {
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error("Error tabeli laadimisel: ", error.stack);
      throw error;
    }
  }
}

export default tableOperations;
