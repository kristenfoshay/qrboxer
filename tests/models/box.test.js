// tests/box.test.js

const db = require("../db");
const { NotFoundError } = require("../expressError");
const Box = require("../models/box");

describe("Box Model Tests", () => {
  // Clear database tables before all tests
  beforeAll(async () => {
    await db.query("DELETE FROM boxes");
  });

  // Clear database tables before each test
  beforeEach(async () => {
    await db.query("DELETE FROM boxes");
  });

  afterAll(async () => {
    await db.end();
  });

  /************************************** create */
  describe("create", () => {
    const newBox = {
      room: "Living Room",
      move: 1
    };

    test("works", async () => {
      const box = await Box.create(newBox);
      expect(box).toEqual({
        room: "Living Room",
        move: 1
      });

      // Verify it's in database
      const result = await db.query(
        `SELECT room, move
         FROM boxes
         WHERE room = 'Living Room'`);
      expect(result.rows[0]).toEqual({
        room: "Living Room",
        move: 1
      });
    });
  });

  /************************************** findAll */
  describe("findAll", () => {
    test("works: no filter", async () => {
      // Create two boxes
      await Box.create({
        room: "Living Room",
        move: 1
      });
      await Box.create({
        room: "Kitchen",
        move: 1
      });

      const boxes = await Box.findAll();
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          room: "Living Room",
          move: 1
        },
        {
          id: expect.any(Number),
          room: "Kitchen",
          move: 1
        }
      ]);
    });
  });

  /************************************** findAllbyUser */
  describe("findAllbyUser", () => {
    test("works with move filter", async () => {
      // Create boxes for different moves
      await Box.create({
        room: "Living Room",
        move: 1
      });
      await Box.create({
        room: "Kitchen",
        move: 2
      });

      const boxes = await Box.findAllbyUser({ move: 1 });
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          room: "Living Room",
          move: 1
        }
      ]);
    });

    test("returns empty array if no boxes found", async () => {
      const boxes = await Box.findAllbyUser({ move: 999 });
      expect(boxes).toEqual([]);
    });
  });

  /************************************** get */
  describe("get", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO boxes (room, move)
         VALUES ('Living Room', 1)
         RETURNING id`);
      const boxId = result.rows[0].id;

      const box = await Box.get(boxId);
      expect(box).toEqual({
        id: boxId,
        room: "Living Room",
        move: 1
      });
    });

    test("not found if no such box", async () => {
      try {
        await Box.get(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /************************************** getMoveBoxes */
  describe("getMoveBoxes", () => {
    test("works", async () => {
      // Create boxes for a move
      await Box.create({
        room: "Living Room",
        move: 1
      });
      await Box.create({
        room: "Kitchen",
        move: 1
      });

      const boxes = await Box.getMoveBoxes(1);
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          room: "Living Room",
          move: 1
        },
        {
          id: expect.any(Number),
          room: "Kitchen",
          move: 1
        }
      ]);
    });

    test("returns empty array if no boxes found", async () => {
      const boxes = await Box.getMoveBoxes(999);
      expect(boxes).toEqual([]);
    });
  });

  /************************************** update */
  describe("update", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO boxes (room, move)
         VALUES ('Living Room', 1)
         RETURNING id`);
      const boxId = result.rows[0].id;

      const updatedBox = await Box.update(boxId, {
        room: "Master Bedroom"
      });
      expect(updatedBox).toEqual({
        id: boxId,
        room: "Master Bedroom",
        move: 1
      });

      // Verify in database
      const found = await db.query(
        `SELECT * FROM boxes WHERE id = $1`,
        [boxId]);
      expect(found.rows[0]).toEqual({
        id: boxId,
        room: "Master Bedroom",
        move: 1
      });
    });

    test("not found if no such box", async () => {
      try {
        await Box.update(0, {
          room: "Master Bedroom"
        });
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /************************************** remove */
  describe("remove", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO boxes (room, move)
         VALUES ('Living Room', 1)
         RETURNING id`);
      const boxId = result.rows[0].id;

      await Box.remove(boxId);
      const found = await db.query(
        "SELECT * FROM boxes WHERE id = $1",
        [boxId]);
      expect(found.rows.length).toEqual(0);
    });

    test("not found if no such box", async () => {
      try {
        await Box.remove(0);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
});
