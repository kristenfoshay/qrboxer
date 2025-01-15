// tests/box.test.js

const { db, closeDb } = require("../../config/db");
const { NotFoundError } = require("../../expressError");
const Box = require("../../models/box");

describe("Box Model Tests", () => {

  beforeAll(async () => {
    await db.query("DELETE FROM boxes");
  });

  beforeEach(async () => {
    await db.query("DELETE FROM boxes");
  });

  afterAll(async () => {
    await closeDb();
  });

  /************************************** create */
  describe("create", () => {
    const newBox = {
      name: "Box 1",
      room: "Living Room",
      move: 1
    };

    test("works", async () => {
      const box = await Box.create(newBox);
      expect(box).toEqual({
        name: "Box 1",
        room: "Living Room",
        move: 1
      });

      const result = await db.query(
        `SELECT name, room, move
         FROM boxes
         WHERE room = 'Living Room'`);
      expect(result.rows[0]).toEqual({
        name: "Box 1",
        room: "Living Room",
        move: 1
      });
    });
  });

  /************************************** findAll */
  describe("findAll", () => {
    test("works: no filter", async () => {

      await Box.create({
        name: "Box 2",
        room: "Living Room",
        move: 1
      });
      await Box.create({
        name: "Box 3",
        room: "Kitchen",
        move: 1
      });

      const boxes = await Box.findAll();
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          name: "Box 2",
          room: "Living Room",
          move: 1
        },
        {
          id: expect.any(Number),
          name: "Box 3",
          room: "Kitchen",
          move: 1
        }
      ]);
    });
  });

  /************************************** findAllbyUser */
  describe("findAllbyUser", () => {
    test("works with move filter", async () => {

      await Box.create({
        name: "Box 4",
        room: "Living Room",
        move: 1
      });
      await Box.create({
        name: "Box 5",
        room: "Kitchen",
        move: 2
      });

      const boxes = await Box.findAllbyUser({ move: 1 });
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          name: "Box 4",
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
        `INSERT INTO boxes (name, room, move)
         VALUES ('Box 6', 'Living Room', 1)
         RETURNING id`);
      const boxId = result.rows[0].id;

      const box = await Box.get(boxId);
      expect(box).toEqual({
        id: boxId,
        name: "Box 6",
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

      await Box.create({
        name: "Box 7",
        room: "Living Room",
        move: 1
      });
      await Box.create({
        name: "Box 8",
        room: "Kitchen",
        move: 1
      });

      const boxes = await Box.getMoveBoxes(1);
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          name: "Box 7",
          room: "Living Room",
          move: 1
        },
        {
          id: expect.any(Number),
          name: "Box 8",
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
        `INSERT INTO boxes (name, room, move)
         VALUES ('Box 9', 'Living Room', 1)
         RETURNING id`);
      const boxId = result.rows[0].id;

      const updatedBox = await Box.update(boxId, {
        room: "Master Bedroom"
      });
      expect(updatedBox).toEqual({
        id: boxId,
        name: "Box 9",
        room: "Master Bedroom",
        move: 1
      });

      const found = await db.query(
        `SELECT * FROM boxes WHERE id = $1`,
        [boxId]);
      expect(found.rows[0]).toEqual({
        id: boxId,
        name: "Box 9",
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
        `INSERT INTO boxes (name, room, move)
         VALUES ('Box 10', 'Living Room', 1)
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
