// tests/testSetup.js

const { db } = require("../db");

async function commonBeforeAll() {
  // Clean database
  await db.query("DELETE FROM boxes");
  
  // Add test data if needed
  await db.query(`
    INSERT INTO boxes (room, move)
    VALUES ('Test Room', 1)
  `);
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
};
