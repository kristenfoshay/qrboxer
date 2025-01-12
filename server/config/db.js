"use strict";

const { Client } = require("pg");
const { getDatabaseUri } = require("./config.js");

let db;

if (process.env.NODE_ENV === "test") {
  db = new Client({
    user: "test_user",
    password: "test_password",
    host: "test-db",
    port: 5432,
    database: "test_db"
  });
} else if (process.env.NODE_ENV === "production") {
  db = new Client({
    connectionString: getDatabaseUri(),
    ssl: {
      rejectUnauthorized: false
    }
  });
} else if (process.env.NODE_ENV === "development") {
  db = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
} else {
  db = new Client({
    connectionString: getDatabaseUri()
  });
}

db.connect()
  .catch(err => {
    console.error('Database connection error:', err.stack);
    process.exit(1);
  });

db.on('error', err => {
  console.error('Unexpected database error:', err);
});

process.on('SIGINT', async () => {
  try {
    await db.end();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});

async function closeDb() {
  try {
    await db.end();
    console.log('Database connection closed.');
  } catch (err) {
    console.error('Error closing database connection:', err);
    throw err;
  }
}

module.exports = {
  db,
  closeDb
};
