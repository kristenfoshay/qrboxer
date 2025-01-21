const request = require("supertest");
const app = require("../../app");
const Move = require("../../models/move");
const Box = require("../../models/box");
const { NotFoundError, BadRequestError } = require("../../expressError");

// Mock the Move and Box models
jest.mock("../../models/move");
jest.mock("../../models/box");

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
        ...newMove,
        boxes: []
      });

      const resp = await request(app)
        .post("/moves")
        .send(newMove);

      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        move: {
          id: 1,
          ...newMove,
          boxes: []
        }
      });
    });

    test("bad request with missing data", async () => {
      const resp = await request(app)
        .post("/moves")
        .send({
          name: "Big Move 2024"
        });

      expect(resp.statusCode).toBe(400);
      expect(resp.body).toEqual({
        error: {
          message: [
            "instance requires property \"from_address\"",
            "instance requires property \"to_address\"",
            "instance requires property \"date\""
          ],
          status: 400
        }
      });
    });
  });
});
