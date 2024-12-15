// tests/itemRoutes.test.js

const request = require("supertest");
const app = require("../app");
const Item = require("../models/item");

// Mock the Item model
jest.mock("../models/item");

describe("Item Routes Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /************************************** POST /items */
  describe("POST /items", () => {
    test("works: creates a new item", async () => {
      const newItem = {
        name: "Coffee Maker",
        description: "Kitchen appliance",
        box_id: 1
      };

      Item.create.mockResolvedValue({
        id: 1,
        ...newItem,
        notes: null
      });

      const resp = await request(app)
        .post("/items")
        .send(newItem);

      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        item: {
          id: 1,
          ...newItem,
          notes: null
        }
      });
      expect(Item.create).toHaveBeenCalledWith(newItem);
    });

    test("bad request with missing data", async () => {
      const resp = await request(app)
        .post("/items")
        .send({
          description: "Missing name and box_id"
        });

      expect(resp.statusCode).toBe(400);
    });

    test("bad request with invalid data type", async () => {
      const resp = await request(app)
        .post("/items")
        .send({
          name: "Test Item",
          description: "Test description",
          box_id: "not-a-number"  // should be a number
        });

      expect(resp.statusCode).toBe(400);
    });
  });

  /************************************** GET /items */
  describe("GET /items", () => {
    test("works: gets all items", async () => {
      Item.findAll.mockResolvedValue([
        {
          id: 1,
          name: "Coffee Maker",
          description: "Kitchen appliance",
          box_id: 1,
          notes: null
        },
        {
          id: 2,
          name: "Books",
          description: "Fiction books",
          box_id: 2,
          notes: "Fragile"
        }
      ]);

      const resp = await request(app).get("/items");
      expect(resp.statusCode).toBe(200);
      expect(resp.body.items).toEqual([
        {
          id: 1,
          name: "Coffee Maker",
          description: "Kitchen appliance",
          box_id: 1,
          notes: null
        },
        {
          id: 2,
          name: "Books",
          description: "Fiction books",
          box_id: 2,
          notes: "Fragile"
        }
      ]);
    });

    test("works: filtering with query", async () => {
      Item.findAll.mockResolvedValue([
        {
          id: 1,
          name: "Coffee Maker",
          description: "Kitchen appliance",
          box_id: 1,
          notes: null
        }
      ]);

      const resp = await request(app)
        .get("/items")
        .query({ box_id: 1 });

      expect(resp.statusCode).toBe(200);
      expect(Item.findAll).toHaveBeenCalledWith({ box_id: "1" });
    });
  });

  /************************************** GET /items/:id */
  describe("GET /items/:id", () => {
    test("works: gets item by id", async () => {
      Item.get.mockResolvedValue({
        id: 1,
        name: "Coffee Maker",
        description: "Kitchen appliance",
        box_id: 1,
        notes: null
      });

      const resp = await request(app).get("/items/1");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        item: {
          id: 1,
          name: "Coffee Maker",
          description: "Kitchen appliance",
          box_id: 1,
          notes: null
        }
      });
      expect(Item.get).toHaveBeenCalledWith("1");
    });

    test("not found for non-existent item", async () => {
      Item.get.mockRejectedValue(new Error("Item not found"));
      
      const resp = await request(app).get("/items/0");
      expect(resp.statusCode).toBe(500);
    });
  });

  /************************************** PATCH /items/:id */
  describe("PATCH /items/:id", () => {
    test("works: updates item", async () => {
      const updateData = {
        name: "Updated Coffee Maker",
        notes: "Handle with care"
      };

      Item.update.mockResolvedValue({
        id: 1,
        name: "Updated Coffee Maker",
        description: "Kitchen appliance",
        box_id: 1,
        notes: "Handle with care"
      });

      const resp = await request(app)
        .patch("/items/1")
        .send(updateData);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        item: {
          id: 1,
          name: "Updated Coffee Maker",
          description: "Kitchen appliance",
          box_id: 1,
          notes: "Handle with care"
        }
      });
      expect(Item.update).toHaveBeenCalledWith("1", updateData);
    });

    test("bad request with invalid data", async () => {
      const resp = await request(app)
        .patch("/items/1")
        .send({
          box_id: "not-a-number"
        });

      expect(resp.statusCode).toBe(400);
    });

    test("not found for non-existent item", async () => {
      Item.update.mockRejectedValue(new Error("Item not found"));

      const resp = await request(app)
        .patch("/items/0")
        .send({
          name: "Updated Name"
        });

      expect(resp.statusCode).toBe(500);
    });
  });

  /************************************** DELETE /items/:id */
  describe("DELETE /items/:id", () => {
    test("works: deletes item", async () => {
      Item.remove.mockResolvedValue(undefined);

      const resp = await request(app).delete("/items/1");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ deleted: 1 });
      expect(Item.remove).toHaveBeenCalledWith("1");
    });

    test("not found for non-existent item", async () => {
      Item.remove.mockRejectedValue(new Error("Item not found"));

      const resp = await request(app).delete("/items/0");
      expect(resp.statusCode).toBe(500);
    });
  });
});
