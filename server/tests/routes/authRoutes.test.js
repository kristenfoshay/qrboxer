const request = require("supertest");
const app = require("../app");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const db = require("../config/db");

describe("Auth Routes Test", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM users");
    
    // Create test user
    await User.register({
      username: "testuser",
      password: "password123",
      firstName: "Test",
      lastName: "User",
      email: "test@test.com",
      admin: false,
    });
  });

  afterAll(async () => {
    await db.end();
  });

  /************************************** POST /auth/token */

  describe("POST /auth/token", () => {
    test("works: can login with valid credentials", async () => {
      const resp = await request(app)
        .post("/auth/token")
        .send({
          username: "testuser",
          password: "password123",
        });
      expect(resp.statusCode).toBe(200);
      expect(resp.body).toEqual({
        token: expect.any(String),
      });
    });

    test("unauth with non-existent user", async () => {
      const resp = await request(app)
        .post("/auth/token")
        .send({
          username: "no-such-user",
          password: "password123",
        });
      expect(resp.statusCode).toBe(401);
    });

    test("unauth with wrong password", async () => {
      const resp = await request(app)
        .post("/auth/token")
        .send({
          username: "testuser",
          password: "wrong",
        });
      expect(resp.statusCode).toBe(401);
    });

    test("bad request with missing data", async () => {
      const resp = await request(app)
        .post("/auth/token")
        .send({
          username: "testuser",
        });
      expect(resp.statusCode).toBe(400);
    });

    test("bad request with invalid data", async () => {
      const resp = await request(app)
        .post("/auth/token")
        .send({
          username: 42,
          password: "password123",
        });
      expect(resp.statusCode).toBe(400);
    });
  });

  /************************************** POST /auth/register */

  describe("POST /auth/register", () => {
    test("works: can register", async () => {
      const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "newuser",
          password: "password123",
          firstName: "New",
          lastName: "User",
          email: "new@test.com",
        });
      expect(resp.statusCode).toBe(201);
      expect(resp.body).toEqual({
        token: expect.any(String),
      });
    });

    test("bad request with duplicate username", async () => {
      const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "testuser", // already exists
          password: "password123",
          firstName: "Test",
          lastName: "User",
          email: "test2@test.com",
        });
      expect(resp.statusCode).toBe(400);
    });

    test("bad request with invalid email", async () => {
      const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "newuser",
          password: "password123",
          firstName: "New",
          lastName: "User",
          email: "not-an-email",
        });
      expect(resp.statusCode).toBe(400);
    });

    test("bad request with missing fields", async () => {
      const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "newuser",
        });
      expect(resp.statusCode).toBe(400);
    });

    test("bad request with invalid data types", async () => {
      const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "newuser",
          password: 123, // should be string
          firstName: "New",
          lastName: "User",
          email: "new@test.com",
        });
      expect(resp.statusCode).toBe(400);
    });

    test("cannot set admin to true", async () => {
      const resp = await request(app)
        .post("/auth/register")
        .send({
          username: "newuser",
          password: "password123",
          firstName: "New",
          lastName: "User",
          email: "new@test.com",
          admin: true, // should be ignored
        });
      expect(resp.statusCode).toBe(201);
      
      // Verify user was created as non-admin
      const user = await User.get("newuser");
      expect(user.admin).toBe(false);
    });
  });
});

/************************************** Test Config */

// Mock token creation to return predictable values in tests
jest.mock("../helpers/tokens", () => ({
  createToken: jest.fn(() => "test-token"),
}));

// Optional: Add these to your package.json
/*
{
  "scripts": {
    "test": "jest -i",
    "test:watch": "jest -i --watchAll"
  },
  "jest": {
    "testEnvironment": "node",
    "testPathIgnorePatterns": ["/node_modules/"],
    "setupFilesAfterEnv": ["./jest.setup.js"]
  }
}
*/
