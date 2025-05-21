import { PGlite } from "@electric-sql/pglite";

const db = new PGlite('idb://patient-registration-db', {
  persistence: true,
  relaxedDurability: true
});


export async function initDB() {
  try {
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
    console.log("Database initialized with persistent storage");
    return db;
  } catch (err) {
    console.error("Database initialization failed:", err);
    throw err;
  }
}


export async function queryDB(sql, params = []) {
  try {
    const result = await db.query(sql, params);
    return result;
  } catch (err) {
    console.error("Database query failed:", { sql, params, error: err });
    throw err;
  }
}


export async function verifyPersistence() {
  const result = await queryDB("SELECT COUNT(*) FROM patients");
  return result.rows[0].count;
}