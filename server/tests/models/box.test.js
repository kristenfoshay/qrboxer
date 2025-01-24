const { db, closeDb } = require("../../config/db");
const { NotFoundError } = require("../../expressError");
const Box = require("../../models/box");

describe("Box Model Tests", () => {
  let testMoveId;

  beforeEach(async () => {
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM boxes");
    await db.query("DELETE FROM moves");
    await db.query("DELETE FROM users");

    await db.query(`
      INSERT INTO users (username, password, email, admin)
      VALUES ('testuser', 'password', 'test@test.com', false)`
    );

    const moveRes = await db.query(`
      INSERT INTO moves (location, date, username)
      VALUES ('Test Location', '2024-01-01', 'testuser')
      RETURNING id`
    );
    testMoveId = moveRes.rows[0].id;
  });

  afterAll(async () => {
    await closeDb();
  });

  describe("create", () => {
    test("works", async () => {
      const box = await Box.create({
        name: "Box 1",
        room: "Living Room",
        move: testMoveId
      });
      expect(box).toEqual({
        id: expect.any(Number),
        name: "Box 1",
        room: "Living Room",
        move: testMoveId,
        description: null,
        location: null
      });
    });
  });

  describe("findAll", () => {
    test("works: no filter", async () => {
      await Box.create({
        name: "Box 1",
        room: "Living Room",
        move: testMoveId
      });
      await Box.create({
        name: "Box 2",
        room: "Kitchen",
        move: testMoveId
      });

      const boxes = await Box.findAll();
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          name: "Box 1",
          room: "Living Room",
          move: testMoveId,
          description: null,
          location: null
        },
        {
          id: expect.any(Number),
          name: "Box 2",
          room: "Kitchen",
          move: testMoveId,
          description: null,
          location: null
        }
      ]);
    });
  });

  describe("findAllbyUser", () => {
    test("works with move filter", async () => {
      const secondMoveRes = await db.query(`
        INSERT INTO moves (location, date, username)
        VALUES ('Second Location', '2024-02-01', xx

  describe("get", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO boxes (name, room, move)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ["Box 1", "Living Room", testMoveId]
      );
      const boxId = result.rows[0].id;

      const box = await Box.get(boxId);
      expect(box).toEqual({
        id: boxId,
        name: "Box 1",
        room: "Living Room",
        move: testMoveId,
        description: null,
        location: null
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

  describe("getMoveBoxes", () => {
    test("works", async () => {
      await Box.create({
        name: "Box 1",
        room: "Living Room",
        move: testMoveId
      });
      await Box.create({
        name: "Box 2",
        room: "Kitchen",
        move: testMoveId
      });

      const boxes = await Box.getMoveBoxes(testMoveId);
      expect(boxes).toEqual([
        {
          id: expect.any(Number),
          name: "Box 1",
          room: "Living Room",
          move: testMoveId,
          description: null,
          location: null
        },
        {
          id: expect.any(Number),
          name: "Box 2",
          room: "Kitchen",
          move: testMoveId,
          description: null,
          location: null
        }
      ]);
    });

    test("returns empty array if no boxes found", async () => {
      const boxes = await Box.getMoveBoxes(999);
      expect(boxes).toEqual([]);
    });
  });

  describe("update", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO boxes (name, room, move)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ["Box 1", "Living Room", testMoveId]
      );
      const boxId = result.rows[0].id;

      const updateData = {
        room: "Master Bedroom"
      };

      const box = await Box.update(boxId, updateData);
      expect(box).toEqual({
        id: boxId,
        name: "Box 1",
        room: "Master Bedroom",
        move: testMoveId,
        description: null,
        location: null
      });

      const found = await db.query(
        `SELECT * FROM boxes WHERE id = $1`,
        [boxId]
      );
      expect(found.rows[0]).toEqual({
        id: boxId,
        name: "Box 1",
        room: "Master Bedroom",
        move: testMoveId,
        description: null,
        location: null
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

  describe("remove", () => {
    test("works", async () => {
      const result = await db.query(
        `INSERT INTO boxes (name, room, move)
         VALUES ($1, $2, $3)
         RETURNING id`,
        ["Box 1", "Living Room", testMoveId]
      );
      const boxId = result.rows[0].id;

      await Box.remove(boxId);

      const found = await db.query(
        "SELECT * FROM boxes WHERE id = $1",
        [boxId]
      );
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
