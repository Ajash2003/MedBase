import { PGlite } from "@electric-sql/pglite";

let db;

export async function initDB() {
  if (!db) {
    db = new PGlite();
    await createTables();
  }
  return db;
}

async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      date_of_birth DATE NOT NULL,
      gender TEXT NOT NULL,
      address TEXT,
      phone TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function queryDB(sql, params = []) {
  const db = await initDB();
  return db.query(sql, params);
}