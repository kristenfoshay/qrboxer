// tests/moveRoutes.test.js

const request = require("supertest");
const app = require("../app");
const Move = require("../models/move");
const Box = require("../models/box");

// Mock the Move and Box models
jest.mock("../models/move");
jest.mock("../models/box");

describe("Move Routes Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /************************************** POST /moves */
  describe("POST /moves", () => {
    test("works: creates a new move", async () => {
      const newMove = {
        name: "Big Move 2024",
        from_address: "123 Start St",
        to_address: "456 End Ave",
        date: "2024-06-01"
      };

      Move.create.mockResolvedValue({
        id: 1,
        ...newMove
      });

      const resp = await request(app)
        .post("/moves")
        .send(newMove);

      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        move: {
          id: 1,
          ...newMove
        }
      });
      expect(Move.create).toHaveBeenCalledWith(newMove);
    });

    test("bad request with missing data", async () => {
      const resp = await request(app)
        .post("/moves")
        .send({
          name: "Big Move 2024"
          // missing required fields
        });

      expect(resp.statusCode).toBe(400);
    });
  });

  /************************************** GET /moves */
  describe("GET /moves", () => {
    test("works: gets all moves", async () => {
      Move.findAll.mockResolvedValue([
        {
          id: 1,
          name: "Move 1",
          from_address: "Start 1",
          to_address: "End 1",
          date: "2024-06-01"
        },
        {
          id: 2,
          name: "Move 2",
          from_address: "Start 2",
          to_address: "End 2",
          date: "2024-07-01"
        }
      ]);

      const resp = await request(app).get("/moves");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        moves: [
          {
            id: 1,
            name: "Move 1",
            from_address: "Start 1",
            to_address: "End 1",
            date: "2024-06-01"
          },
          {
            id: 2,
            name: "Move 2",
            from_address: "Start 2",
            to_address: "End 2",
            date: "2024-07-01"
          }
        ]
      });
    });

    test("works: filtering with query", async () => {
      Move.findAll.mockResolvedValue([
        {
          id: 1,
          name: "Move 1",
          from_address: "Start 1",
          to_address: "End 1",
          date: "2024-06-01"
        }
      ]);

      const resp = await request(app)
        .get("/moves")
        .query({ date: "2024-06-01" });

      expect(resp.statusCode).toBe(200);
      expect(Move.findAll).toHaveBeenCalledWith({ date: "2024-06-01" });
    });
  });

  /************************************** GET /moves/:id */
  describe("GET /moves/:id", () => {
    test("works: gets move by id", async () => {
      Move.get.mockResolvedValue({
        id: 1,
        name: "Move 1",
        from_address: "Start 1",
        to_address: "End 1",
        date: "2024-06-01"
      });

      const resp = await request(app).get("/moves/1");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        move: {
          id: 1,
          name: "Move 1",
          from_address: "Start 1",
          to_address: "End 1",
          date: "2024-06-01"
        }
      });
      expect(Move.get).toHaveBeenCalledWith("1");
    });

    test("not found for no such move", async () => {
      Move.get.mockRejectedValue(new Error("Move not found"));
      
      const resp = await request(app).get("/moves/0");
      expect(resp.statusCode).toBe(500);
    });
  });

  /************************************** GET /moves/:id/boxes */
  describe("GET /moves/:id/boxes", () => {
    test("works: gets boxes for move", async () => {
      Box.getMoveBoxes.mockResolvedValue([
        {
          id: 1,
          name: "Kitchen Box 1",
          description: "Plates and cups",
          move_id: 1
        },
        {
          id: 2,
          name: "Living Room Box 1",
          description: "Books",
          move_id: 1
        }
      ]);

      const resp = await request(app).get("/moves/1/boxes");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        boxes: [
          {
            id: 1,
            name: "Kitchen Box 1",
            description: "Plates and cups",
            move_id: 1
          },
          {
            id: 2,
            name: "Living Room Box 1",
            description: "Books",
            move_id: 1
          }
        ]
      });
      expect(Box.getMoveBoxes).toHaveBeenCalledWith("1");
    });
  });

  /************************************** PATCH /moves/:id */
  describe("PATCH /moves/:id", () => {
    test("works: updates move", async () => {
      const updateData = {
        name: "Updated Move Name",
        date: "2024-07-01"
      };

      Move.update.mockResolvedValue({
        id: 1,
        name: "Updated Move Name",
        from_address: "Original Start",
        to_address: "Original End",
        date: "2024-07-01"
      });

      const resp = await request(app)
        .patch("/moves/1")
        .send(updateData);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        move: {
          id: 1,
          name: "Updated Move Name",
          from_address: "Original Start",
          to_address: "Original End",
          date: "2024-07-01"
        }
      });
      expect(Move.update).toHaveBeenCalledWith("1", updateData);
    });

    test("bad request with invalid data", async () => {
      const resp = await request(app)
        .patch("/moves/1")
        .send({
          date: "not-a-date"
        });

      expect(resp.statusCode).toBe(400);
    });
  });

  /************************************** DELETE /moves/:id */
  describe("DELETE /moves/:id", () => {
    test("works: deletes move", async () => {
      Move.remove.mockResolvedValue(undefined);

      const resp = await request(app).delete("/moves/1");
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({ deleted: "1" });
      expect(Move.remove).toHaveBeenCalledWith("1");
    });
  });
});
