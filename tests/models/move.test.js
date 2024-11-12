// tests/move.test.js

const db = require("../db");
const Move = require("../models/move");
const { BadRequestError, NotFoundError } = require("../expressError");

describe("Move Model Tests", () => {
  beforeEach(async () => {
    // Clear the moves table before each test
    await db.query("DELETE FROM moves");
  });

  afterAll(async () => {
    await db.end();
  });

  /************************************** create */
  describe("create", () => {
    const newMove = {
      location: "New York",
      date: "2024-06-01",
      username: "testuser"
    };

    test("works", async () => {
      const move = await Move.create(newMove);
      expect(move).toEqual({
        location: "New York",
        date: "2024-06-01",
        username: "testuser"
      });

      // Verify it's in database
      const result = await db.query(
        `SELECT location, date, username
         FROM moves
         WHERE date = $1`,
        [newMove.date]
      );
      expect(result.rows[0]).toEqual(newMove);
    });

    test("bad request with duplicate date", async () => {
      try {
        await Move.create(newMove);
        await Move.create(newMove); // Try to create duplicate
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
        expect(err.message).toEqual(`Duplicate move: ${newMove.date}`);
      }
    });
  });

  /************************************** get */
  describe("get", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO moves (location, date, username)
         VALUES ('New York', '2024-06-01', 'testuser')
         RETURNING id`
      );
      const moveId = result.rows[0].id;

      const move = await Move.get(moveId);
      expect(move).toEqual({
        id: moveId,
        location: "New York",
        date: "2024-06-01",
        username: "testuser"
      });
    });

    test("not found if no such move", async () => {
      try {
        await Move.get(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /************************************** update */
  describe("update", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO moves (location, date, username)
         VALUES ('New York', '2024-06-01', 'testuser')
         RETURNING id`
      );
      const moveId = result.rows[0].id;

      const updateData = {
        location: "Los Angeles",
        date: "2024-07-01"
      };

      const move = await Move.update(moveId, updateData);
      expect(move).toEqual({
        id: moveId,
        location: "Los Angeles",
        date: "2024-07-01",
        username: "testuser"
      });

      // Verify in database
      const found = await db.query(
        "SELECT * FROM moves WHERE id = $1",
        [moveId]
      );
      expect(found.rows[0]).toEqual({
        id: moveId,
        location: "Los Angeles",
        date: "2024-07-01",
        username: "testuser"
      });
    });

    test("not found if no such move", async () => {
      try {
        await Move.update(0, {
          location: "Los Angeles"
        });
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });

    test("works: partial update", async () => {
      const result = await db.query(
        `INSERT INTO moves (location, date, username)
         VALUES ('New York', '2024-06-01', 'testuser')
         RETURNING id`
      );
      const moveId = result.rows[0].id;

      const updateData = {
        location: "Los Angeles"
        // date stays the same
      };

      const move = await Move.update(moveId, updateData);
      expect(move).toEqual({
        id: moveId,
        location: "Los Angeles",
        date: "2024-06-01",
        username: "testuser"
      });
    });
  });

  /************************************** findAll */
  describe("findAll", () => {
    test("works: finds all moves for user", async () => {
      // Create test moves
      await db.query(
        `INSERT INTO moves (location, date, username)
         VALUES ('New York', '2024-06-01', 'testuser'),
                ('Los Angeles', '2024-07-01', 'testuser'),
                ('Chicago', '2024-08-01', 'otheruser')`
      );

      const moves = await Move.findAll("testuser");
      expect(moves).toEqual([
        {
          id: expect.any(Number),
          location: "New York",
          date: "2024-06-01",
          username: "testuser"
        },
        {
          id: expect.any(Number),
          location: "Los Angeles",
          date: "2024-07-01",
          username: "testuser"
        }
      ]);
    });

    test("works: returns empty array if no moves found", async () => {
      const moves = await Move.findAll("nonexistentuser");
      expect(moves).toEqual([]);
    });
  });

  /************************************** remove */
  describe("remove", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO moves (location, date, username)
         VALUES ('New York', '2024-06-01', 'testuser')
         RETURNING id`
      );
      const moveId = result.rows[0].id;

      await Move.remove(moveId);

      // Verify it's gone
      const found = await db.query(
        "SELECT * FROM moves WHERE id = $1",
        [moveId]
      );
      expect(found.rows.length).toEqual(0);
    });

    test("not found if no such move", async () => {
      try {
        await Move.remove(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
});
