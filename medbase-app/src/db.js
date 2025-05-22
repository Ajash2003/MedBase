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
        phone TEXT CHECK (phone IS NULL OR (LENGTH(phone) = 10 AND phone ~ '^\\d+$')),
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    return db;
  } catch (err) {
    console.error("Database initialization failed:", err);
    throw err;
  }
}

export async function queryDB(sql, params = []) {
  try {
    // Validate phone number for INSERT/UPDATE operations
    if (sql.includes('patients') && (sql.includes('INSERT') || sql.includes('UPDATE'))) {
      const phoneParamIndex = sql.split(/,\s|\s|,/).findIndex(col => col.includes('phone'));
      if (phoneParamIndex > -1 && params[phoneParamIndex] && !/^\d{10}$/.test(params[phoneParamIndex])) {
        throw new Error('Phone number must be exactly 10 digits');
      }
    }

    const result = await db.query(sql, params);
    return result;
  } catch (err) {
    console.error("Database query failed:", err);
    throw err;
  }
}