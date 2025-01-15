// tests/item.test.js

const { db, closeDb } = require("../../config/db");
const Item = require("../../models/item");
const { NotFoundError } = require("../../expressError");

describe("Item Model Tests", () => {

  beforeEach(async () => {
    await db.query("DELETE FROM items");
  });

  afterAll(async () => {
    await closeDb();
  });

  /************************************** create */
  test("can create an item", async () => {
    const newItem = {
      description: "Coffee Table Books",
      image: "books.jpg",
      box: 1
    };

    const item = await Item.create(newItem);
    expect(item).toEqual({
      description: "Coffee Table Books",
      image: "books.jpg",
      box: 1
    });

    const found = await db.query("SELECT * FROM items WHERE description = $1", 
      ["Coffee Table Books"]);
    expect(found.rows[0]).toEqual({
      id: expect.any(Number),
      ...newItem
    });
  });

  /************************************** findAll */
  test("can find all items", async () => {

    const item1 = await Item.create({
      description: "Coffee Table Books",
      image: "books.jpg",
      box: 1
    });
    const item2 = await Item.create({
      description: "Desk Lamp",
      image: "lamp.jpg",
      box: 2
    });

    const items = await Item.findAll();
    expect(items).toEqual([
      {
        id: expect.any(Number),
        description: "Coffee Table Books",
        image: "books.jpg",
        box: 1
      },
      {
        id: expect.any(Number),
        description: "Desk Lamp",
        image: "lamp.jpg",
        box: 2
      }
    ]);
  });

  /************************************** get */
  test("can get item by id", async () => {
    const result = await db.query(
      `INSERT INTO items (description, image, box)
       VALUES ('Test Item', 'test.jpg', 1)
       RETURNING id`);
    const itemId = result.rows[0].id;

    const item = await Item.get(itemId);
    expect(item).toEqual({
      id: itemId,
      description: "Test Item",
      image: "test.jpg",
      box: 1
    });
  });

  test("not found if no such item exists", async () => {
    try {
      await Item.get(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  /************************************** getitemsbyBox */
  test("can get items by box", async () => {

    await Item.create({
      description: "Item 1",
      image: "item1.jpg",
      box: 1
    });
    await Item.create({
      description: "Item 2",
      image: "item2.jpg",
      box: 1
    });

    await Item.create({
      description: "Item 3",
      image: "item3.jpg",
      box: 2
    });

    const items = await Item.getitemsbyBox(1);
    expect(items).toEqual([
      {
        id: expect.any(Number),
        description: "Item 1",
        image: "item1.jpg",
        box: 1
      },
      {
        id: expect.any(Number),
        description: "Item 2",
        image: "item2.jpg",
        box: 1
      }
    ]);
  });

  /************************************** update */
  test("can update item", async () => {
    const result = await db.query(
      `INSERT INTO items (description, image, box)
       VALUES ('Original Item', 'orig.jpg', 1)
       RETURNING id`);
    const itemId = result.rows[0].id;

    const updateData = {
      description: "Updated Item",
      image: "new.jpg"
    };

    const item = await Item.update(itemId, updateData);
    expect(item).toEqual({
      id: itemId,
      description: "Updated Item",
      image: "new.jpg",
      box: 1
    });
  });

  test("not found if no such item exists on update", async () => {
    try {
      await Item.update(0, {
        description: "test"
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  /************************************** remove */
  test("can delete item", async () => {
    const result = await db.query(
      `INSERT INTO items (description, image, box)
       VALUES ('Test Item', 'test.jpg', 1)
       RETURNING id`);
    const itemId = result.rows[0].id;

    await Item.remove(itemId);
    
    const res = await db.query(
      "SELECT * FROM items WHERE id = $1",
      [itemId]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such item exists on delete", async () => {
    try {
      await Item.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  /************************************** boxremoveitem */
  test("can remove all items from a box", async () => {

    await Item.create({
      description: "Item 1",
      image: "item1.jpg",
      box: 1
    });
    await Item.create({
      description: "Item 2",
      image: "item2.jpg",
      box: 1
    });

    await Item.boxremoveitem(1);
    
    const res = await db.query(
      "SELECT * FROM items WHERE box = $1",
      [1]);
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such box exists", async () => {
    try {
      await Item.boxremoveitem(null);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
