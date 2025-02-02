const { Client } = require("pg");

let db;

function getDatabase() {
  if (!db) {
    db = new Client({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "postgres",
      database: process.env.NODE_ENV === "test" ? "test_db" : "dev_db"
    });
  }
  return db;
}

async function connect() {
  const client = getDatabase();
  await client.connect();
  return client;
}

async function closeDb() {
  if (db) {
    await db.end();
    db = null;
  }
}

async function query(text, params) {
  const client = getDatabase();
  try {
    return await client.query(text, params);
  } catch (err) {
    console.error("Database query error:", err);
    throw err;
  }
}

module.exports = {
  query,
  connect,
  closeDb,
  getDatabase
};
