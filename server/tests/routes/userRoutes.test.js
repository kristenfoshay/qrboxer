const request = require("supertest");
const app = require("../../app");
const User = require("../../models/user");
const { createToken } = require("../../helpers/tokens");
const db = require("../../config/db");

jest.mock("../../models/user");
jest.mock("../../helpers/tokens");

describe("User Routes Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /************************************** POST /users */
  describe("POST /users", () => {
    test("works: creates a new user", async () => {
      const newUser = {
        username: "newuser",
        password: "password123",
        firstName: "New",
        lastName: "User",
        email: "new@test.com"
      };

      User.register.mockResolvedValue({
        username: "newuser",
        email: "new@test.com"
      });

      createToken.mockReturnValue("test-token");

      const resp = await request(app)
        .post("/users")
        .send(newUser);

      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        user: {
          username: "newuser",
          email: "new@test.com"
        },
        token: "test-token"
      });
      expect(User.register).toHaveBeenCalledWith(newUser);
    });

    test("bad request with missing fields", async () => {
      const resp = await request(app)
        .post("/users")
        .send({
          username: "newuser"
        });

      expect(resp.statusCode).toBe(400);
    });

    test("bad request with invalid data", async () => {
      const resp = await request(app)
        .post("/users")
        .send({
          username: "newuser",
          password: "pass", // too short
          email: "not-an-email"
        });

      expect(resp.statusCode).toBe(400);
    });
  });

  /************************************** GET /users */
  describe("GET /users", () => {
    test("works: gets all users", async () => {
      User.findAll.mockResolvedValue([
        {
          username: "user1",
          email: "user1@test.com"
        },
        {
          username: "user2",
          email: "user2@test.com"
        }
      ]);

      const resp = await request(app)
        .get("/users");

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        users: [
          {
            username: "user1",
            email: "user1@test.com"
          },
          {
            username: "user2",
            email: "user2@test.com"
          }
        ]
      });
    });

    test("works: empty list on no users", async () => {
      User.findAll.mockResolvedValue([]);

      const resp = await request(app)
        .get("/users");

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        users: []
      });
    });
  });

  /************************************** GET /users/:username */
  describe("GET /users/:username", () => {
    test("works: gets user by username", async () => {
      User.get.mockResolvedValue({
        username: "testuser",
        email: "test@test.com",
        moves: [
          {
            id: 1,
            location: "Test Location",
            date: "2024-01-01",
            username: "testuser"
          }
        ]
      });

      const resp = await request(app)
        .get("/users/testuser");

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        user: {
          username: "testuser",
          email: "test@test.com",
          moves: [
            {
              id: 1,
              location: "Test Location",
              date: "2024-01-01",
              username: "testuser"
            }
          ]
        }
      });
      expect(User.get).toHaveBeenCalledWith("testuser");
    });

    test("not found if user doesn't exist", async () => {
      User.get.mockRejectedValue(new Error("Not Found"));

      const resp = await request(app)
        .get("/users/nonexistent");

      expect(resp.statusCode).toBe(404);
      expect(resp.body).toEqual({
        error: "User not found"
      });
    });
  });

  /************************************** PATCH /users/:username */
  describe("PATCH /users/:username", () => {
    test("works: updates user", async () => {
      const updateData = {
        email: "new@test.com"
      };

      User.update.mockResolvedValue({
        username: "testuser",
        email: "new@test.com"
      });

      const resp = await request(app)
        .patch("/users/testuser")
        .send(updateData);

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        user: {
          username: "testuser",
          email: "new@test.com"
        }
      });
      expect(User.update).toHaveBeenCalledWith("testuser", updateData);
    });

    test("bad request with invalid data", async () => {
      const resp = await request(app)
        .patch("/users/testuser")
        .send({
          email: "not-an-email"
        });

      expect(resp.statusCode).toBe(400);
      expect(resp.body).toEqual({
        error: "Invalid email format"
      });
    });

    test("bad request with empty update", async () => {
      const resp = await request(app)
        .patch("/users/testuser")
        .send({});

      expect(resp.statusCode).toBe(400);
      expect(resp.body).toEqual({
        error: "No update data provided"
      });
    });

    test("not found if user doesn't exist", async () => {
      User.update.mockRejectedValue(new Error("Not Found"));

      const resp = await request(app)
        .patch("/users/nonexistent")
        .send({
          email: "new@test.com"
        });

      expect(resp.statusCode).toBe(404);
      expect(resp.body).toEqual({
        error: "User not found"
      });
    });
  });

  /************************************** DELETE /users/:username */
  describe("DELETE /users/:username", () => {
    test("works: deletes user", async () => {
      User.remove.mockResolvedValue(undefined);

      const resp = await request(app)
        .delete("/users/testuser");

      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        deleted: "testuser"
      });
      expect(User.remove).toHaveBeenCalledWith("testuser");
    });

    test("not found if user doesn't exist", async () => {
      User.remove.mockRejectedValue(new Error("Not Found"));

      const resp = await request(app)
        .delete("/users/nonexistent");

      expect(resp.statusCode).toBe(404);
      expect(resp.body).toEqual({
        error: "User not found"
      });
    });
  });
});
