// tests/itemRoutes.test.js

const request = require("supertest");
const app = require("../../app");
const Item = require("../../models/item");
const { NotFoundError } = require("../../expressError");
const { db } = require("../../config/db");

// Mock the Item model
jest.mock("../../models/item");

describe("Item Routes Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /************************************** POST /items */
  describe("POST /items", () => {
    test("works: creates a new item", async () => {
      const newItem = {
        description: "Kitchen appliance",
        box: 1,
        image: "test.jpg"
      };

      // Mock successful creation
      Item.create.mockResolvedValue({
        id: 1,
        ...newItem
      });

      const resp = await request(app)
        .post("/items")
        .send(newItem);

      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        item: {
          id: 1,
          ...newItem
        }
      });
    });

    test("bad request with missing data", async () => {
      // Don't need to mock here - should fail validation before hitting model

      const resp = await request(app)
        .post("/items")
        .send({
          description: "Missing box field"
        });

      expect(resp.statusCode).toBe(400);
    });

    test("bad request with invalid data type", async () => {
      // Don't need to mock here - should fail validation before hitting model

      const resp = await request(app)
        .post("/items")
        .send({
          description: "Test description",
          box: "not-a-number"
        });

      expect(resp.statusCode).toBe(400);
    });
  });

  /************************************** GET /items */
  describe("GET /items", () => {
    test("works: gets all items", async () => {
      const mockItems = [
        {
          id: 1,
          description: "Kitchen appliance",
          box: 1,
          image: "test1.jpg"
        },
        {
          id: 2,
          description: "Fiction books",
          box: 2,
          image: "test2.jpg"
        }
      ];

      Item.findAll.mockResolvedValue(mockItems);

      const resp = await request(app).get("/items");
      expect(resp.statusCode).toBe(200);
      expect(resp.body.items).toEqual(mockItems);
    });

    test("works: filtering with query", async () => {
      const mockItems = [
        {
          id: 1,
          description: "Kitchen appliance",
          box: 1,
          image: "test1.jpg"
        }
      ];

      Item.findAll.mockResolvedValue(mockItems);

      const resp = await request(app)
        .get("/items")
        .query({ box: 1 });

      expect(resp.statusCode).toBe(200);
      expect(Item.findAll).toHaveBeenCalledWith({ box: "1" });
    });
  });

  /************************************** GET /items/:id */
  describe("GET /items/:id", () => {
    test("works: gets item by id", async () => {
      Item.get.mockResolvedValue({
        id: 1,
        description: "Kitchen appliance",
        box: 1,
        image: "test.jpg"
      });

      const resp = await request(app).get("/items/1");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        item: {
          id: 1,
          description: "Kitchen appliance",
          box: 1,
          image: "test.jpg"
        }
      });
    });

    test("not found for non-existent item", async () => {
      Item.get.mockRejectedValue(new NotFoundError("No item: 0"));
      
      const resp = await request(app).get("/items/0");
      expect(resp.statusCode).toBe(404);
    });
  });

  /************************************** PATCH /items/:id */
  describe("PATCH /items/:id", () => {
    test("works: updates item", async () => {
      const updateData = {
        description: "Updated Kitchen appliance",
        box: 2,
        image: "updated.jpg"
      };

      Item.update.mockResolvedValue({
        id: 1,
        ...updateData
      });

      const resp = await request(app)
        .patch("/items/1")
        .send(updateData);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        item: {
          id: 1,
          ...updateData
        }
      });
    });

    test("bad request with invalid data", async () => {
      const resp = await request(app)
        .patch("/items/1")
        .send({
          box: "not-a-number"
        });

      expect(resp.statusCode).toBe(400);
    });

    test("not found for non-existent item", async () => {
      Item.update.mockRejectedValue(new NotFoundError("No item: 0"));

      const resp = await request(app)
        .patch("/items/0")
        .send({
          description: "Updated description"
        });

      expect(resp.statusCode).toBe(404);
    });
  });

  /************************************** DELETE /items/:id */
  describe("DELETE /items/:id", () => {
    test("works: deletes item", async () => {
      Item.remove.mockResolvedValue(undefined);

      const resp = await request(app).delete("/items/1");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ deleted: 1 });
    });

    test("not found for non-existent item", async () => {
      Item.remove.mockRejectedValue(new NotFoundError("No item: 0"));

      const resp = await request(app).delete("/items/0");
      expect(resp.statusCode).toBe(404);
    });
  });

  afterAll(async () => {
  await db.end();  // Close database connection
  jest.resetModules();
  jest.clearAllMocks();
}); 
});
