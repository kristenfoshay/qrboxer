// tests/move.test.js

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("../jest.setup");  
const { db, closeDb } = require("../../config/db");
const Move = require("../../models/move");
const { BadRequestError, NotFoundError } = require("../../expressError");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../../config/config");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

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
        id: expect.any(Number),
        location: "New York",
        date: "2024-06-01",
        username: "testuser",
        boxes: []
      });

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
        await Move.create(newMove);
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

    const boxResult = await db.query(
      `INSERT INTO boxes (name, room, move)
       VALUES ($1, $2, $3)
       RETURNING id`, 
      ["Test Box 1", "Living Room", moveId]
    );

    const move = await Move.get(moveId);
    expect(move).toEqual({
      id: moveId,
      location: "New York",
      date: "2024-06-01",
      username: "testuser",
      boxes: [{
        id: boxResult.rows[0].id,
        name: "Test Box 1",
        room: "Living Room",
        move: moveId
      }]
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

    await db.query(
      `INSERT INTO boxes (name, room, move)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ["Test Box 1", "Living Room", moveId]
    );

    const updateData = {
      location: "Los Angeles",
      date: "2024-07-01"
    };

    const move = await Move.update(moveId, updateData);
    expect(move).toEqual({
      id: moveId,
      location: "Los Angeles",
      date: "2024-07-01",
      username: "testuser",
      boxes: [{
        id: expect.any(Number),
        name: "Test Box 1",
        room: "Living Room",
        move: moveId
      }]
    });

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

    await db.query(
      `INSERT INTO boxes (name, room, move)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ["Test Box 1", "Living Room", moveId]
    );

    const updateData = {
      location: "Los Angeles"
    };

    const move = await Move.update(moveId, updateData);
    expect(move).toEqual({
      id: moveId,
      location: "Los Angeles",
      date: "2024-06-01",
      username: "testuser",
      boxes: [{
        id: expect.any(Number),
        name: "Test Box 1",
        room: "Living Room",
        move: moveId
      }]
    });
  });
});

  /************************************** findAll */
  describe("findAll", () => {
  test("works: finds all moves for user", async () => {
    // Create only otheruser since testuser is already created in beforeEach
    const hashedPassword = await bcrypt.hash("password123", BCRYPT_WORK_FACTOR);
    await db.query(
      `INSERT INTO users (username, password, email, admin)
       VALUES ($1, $2, $3, $4)`,
      ["otheruser", hashedPassword, "test2@test.com", false]
    );

    // Insert test moves
    await db.query(
      `INSERT INTO moves (location, date, username)
       VALUES ('New York', '2024-06-01', 'testuser'),
              ('Los Angeles', '2024-07-01', 'testuser'),
              ('Chicago', '2024-08-01', 'otheruser')`
    );

    // Create box for first move
    const moveResult = await db.query(
      `SELECT id FROM moves WHERE location = 'New York'`
    );
    const moveId = moveResult.rows[0].id;

    await db.query(
      `INSERT INTO boxes (name, room, move)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ["Test Box 1", "Living Room", moveId]
    );

    const moves = await Move.findAll("testuser");
    expect(moves).toEqual([
      {
        id: expect.any(Number),
        location: "New York",
        date: "2024-06-01",
        username: "testuser",
        boxes: [{
          id: expect.any(Number),
          name: "Test Box 1",
          room: "Living Room",
          move: moveId
        }]
      },
      {
        id: expect.any(Number),
        location: "Los Angeles",
        date: "2024-07-01",
        username: "testuser",
        boxes: []
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
  test("works: removes move and boxes cascade", async () => {
    const result = await db.query(
      `INSERT INTO moves (location, date, username)
       VALUES ('New York', '2024-06-01', 'testuser')
       RETURNING id`
    );
    const moveId = result.rows[0].id;

    await db.query(
      `INSERT INTO boxes (name, room, move)
       VALUES ($1, $2, $3)`,
      ["Test Box 1", "Living Room", moveId]
    );

    await Move.remove(moveId);

    const foundMove = await db.query(
      "SELECT * FROM moves WHERE id = $1",
      [moveId]
    );
    expect(foundMove.rows.length).toEqual(0);

    const foundBoxes = await db.query(
      "SELECT * FROM boxes WHERE move = $1",
      [moveId]
    );
    expect(foundBoxes.rows.length).toEqual(0);
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
