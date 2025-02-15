const { Client } = require("pg");

let db;

async function getDatabase() {
  if (!db) {
    db = new Client({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.NODE_ENV === "test" ? "test_db" : "dev_db"
    });
    await db.connect();
  }
  return db;
}

async function query(text, params) {
  const client = await getDatabase();
  try {
    return await client.query(text, params);
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}

async function closeDb() {
  if (db) {
    await db.end();
    db = null;
  }
}

module.exports = {
  query,
  closeDb,
  getDatabase
};
