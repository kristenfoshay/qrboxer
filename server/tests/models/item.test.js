const { db, closeDb } = require("../../config/db");
const { NotFoundError } = require("../../expressError");
const Item = require("../../models/item");

describe("Item Model Tests", () => {
  let testBoxId;

  beforeEach(async () => {
    // Clean tables in correct order
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM boxes");
    await db.query("DELETE FROM moves");
    await db.query("DELETE FROM users");

    // Create test user
    await db.query(`
      INSERT INTO users (username, password, email, admin)
      VALUES ('testuser', 'password', 'test@test.com', false)`
    );

    // Create test move
    const moveRes = await db.query(`
      INSERT INTO moves (location, date, username)
      VALUES ('Test Location', '2024-01-01', 'testuser')
      RETURNING id`
    );
    const testMoveId = moveRes.rows[0].id;

    // Create test box
    const boxRes = await db.query(`
      INSERT INTO boxes (name, room, move)
      VALUES ('Test Box', 'Living Room', $1)
      RETURNING id`,
      [testMoveId]
    );
    testBoxId = boxRes.rows[0].id;
  });

  afterAll(async () => {
    await closeDb();
  });

  test("can create an item", async () => {
    const item = await Item.create({
      description: "Test Item",
      image: "test.jpg",
      box: testBoxId
    });

    expect(item).toEqual({
      id: expect.any(Number),
      description: "Test Item",
      image: "test.jpg",
      box: testBoxId
    });
  });

  test("can find all items", async () => {
    await Item.create({
      description: "Test Item 1",
      image: "test1.jpg",
      box: testBoxId
    });
    await Item.create({
      description: "Test Item 2",
      image: "test2.jpg",
      box: testBoxId
    });

    const items = await Item.findAll();
    expect(items).toEqual([
      {
        id: expect.any(Number),
        description: "Test Item 1",
        image: "test1.jpg",
        box: testBoxId
      },
      {
        id: expect.any(Number),
        description: "Test Item 2",
        image: "test2.jpg",
        box: testBoxId
      }
    ]);
  });

  test("can get item by id", async () => {
    const result = await db.query(
      `INSERT INTO items (description, image, box)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ["Test Item", "test.jpg", testBoxId]
    );
    const itemId = result.rows[0].id;

    const item = await Item.get(itemId);
    expect(item).toEqual({
      id: itemId,
      description: "Test Item",
      image: "test.jpg",
      box: testBoxId
    });
  });

  test("can find items by box", async () => {
    await Item.create({
      description: "Test Item 1",
      image: "test1.jpg",
      box: testBoxId
    });
    await Item.create({
      description: "Test Item 2",
      image: "test2.jpg",
      box: testBoxId
    });

    const items = await Item.findBoxItems(testBoxId);  // Changed from getBoxItems to findBoxItems
    expect(items).toEqual([
      {
        id: expect.any(Number),
        description: "Test Item 1",
        image: "test1.jpg",
        box: testBoxId
      },
      {
        id: expect.any(Number),
        description: "Test Item 2",
        image: "test2.jpg",
        box: testBoxId
      }
    ]);
  });

  test("can update item", async () => {
    const result = await db.query(
      `INSERT INTO items (description, image, box)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ["Test Item", "test.jpg", testBoxId]
    );
    const itemId = result.rows[0].id;

    const updatedItem = await Item.update(itemId, {
      description: "Updated Item",
      image: "updated.jpg"
    });

    expect(updatedItem).toEqual({
      id: itemId,
      description: "Updated Item",
      image: "updated.jpg",
      box: testBoxId
    });
  });

  test("not found if no such item", async () => {
    try {
      await Item.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("can delete item", async () => {
    const result = await db.query(
      `INSERT INTO items (description, image, box)
       VALUES ($1, $2, $3)
       RETURNING id`,
      ["Test Item", "test.jpg", testBoxId]
    );
    const itemId = result.rows[0].id;

    await Item.remove(itemId);

    const found = await db.query(
      "SELECT * FROM items WHERE id = $1",
      [itemId]
    );
    expect(found.rows.length).toEqual(0);
  });
});
