import { db } from "./connectMariaDB.js";

class CreateTables {
  static async createTableTOOTED() {
    const query = `
          CREATE TABLE IF NOT EXISTS TOOTED (
          id INT AUTO_INCREMENT PRIMARY KEY,
          Nimetus VARCHAR(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
          Kaal INT NOT NULL,
          Hind DECIMAL(10, 2) NOT NULL,
          Liik INT NOT NULL,
          FOREIGN KEY (Liik) REFERENCES LIIK(Liigi_id) ON DELETE CASCADE,
          Tootja_id INT NOT NULL,
          FOREIGN KEY (Tootja_id) REFERENCES TOOTJA(Tootja_id) ON DELETE CASCADE
          ) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
        `;
    try {
      await db.query(query);
    } catch (error) {
      console.error("Error creating table TOOTED:", error.stack);
      throw error;
    }
  }
  static async createTableTOOTJA() {
    const query = `
          CREATE TABLE IF NOT EXISTS TOOTJA (
          Tootja_id INT AUTO_INCREMENT PRIMARY KEY,
          Tootja VARCHAR(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE
          ) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
        `;
    try {
      await db.query(query);
    } catch (error) {
      console.error("Error creating table TOOTJA:", error.stack);
      throw error;
    }
  }
  static async createTableLIIK() {
    const query = `
          CREATE TABLE IF NOT EXISTS LIIK (
          Liigi_id INT AUTO_INCREMENT PRIMARY KEY,
          Nimetus VARCHAR(2048) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE
          ) CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
        `;
    try {
      await db.query(query);
    } catch (error) {
      console.error("Error creating table LIIK:", error.stack);
      throw error;
    }
  }
}

export default CreateTables;
