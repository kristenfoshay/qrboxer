// tests/user.test.js

const db = require("../../config/db");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { 
  NotFoundError, 
  BadRequestError, 
  UnauthorizedError 
} = require("../expressError");
const { BCRYPT_WORK_FACTOR } = require("../config/config");

describe("User Model Tests", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM users");
  });

  afterAll(async () => {
    await db.end();
  });

  /************************************** authenticate */
  describe("authenticate", () => {
    beforeEach(async () => {
      await User.register({
        username: "testuser",
        password: "password123",
        email: "test@test.com"
      });
    });

    test("works with valid credentials", async () => {
      const user = await User.authenticate("testuser", "password123");
      expect(user).toEqual({
        username: "testuser",
        email: "test@test.com"
      });
    });

    test("fails with wrong password", async () => {
      try {
        await User.authenticate("testuser", "wrongpassword");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });

    test("fails with non-existent user", async () => {
      try {
        await User.authenticate("nonexistent", "password123");
        fail();
      } catch (err) {
        expect(err instanceof UnauthorizedError).toBeTruthy();
      }
    });
  });

  /************************************** register */
  describe("register", () => {
    const newUser = {
      username: "newuser",
      password: "password123",
      email: "new@test.com"
    };

    test("works", async () => {
      const user = await User.register(newUser);
      expect(user).toEqual({
        username: "newuser",
        email: "new@test.com"
      });

      // Verify password was hashed
      const found = await db.query(
        "SELECT * FROM users WHERE username = 'newuser'"
      );
      expect(found.rows.length).toEqual(1);
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("fails with duplicate username", async () => {
      try {
        await User.register(newUser);
        await User.register(newUser);
        fail();
      } catch (err) {
        expect(err instanceof BadRequestError).toBeTruthy();
      }
    });
  });

  /************************************** findAll */
  describe("findAll", () => {
    test("works", async () => {
      await User.register({
        username: "user1",
        password: "password1",
        email: "user1@test.com"
      });
      await User.register({
        username: "user2",
        password: "password2",
        email: "user2@test.com"
      });

      const users = await User.findAll();
      expect(users).toEqual([
        {
          username: "user1",
          password: expect.any(String),
          email: "user1@test.com",
          admin: false
        },
        {
          username: "user2",
          password: expect.any(String),
          email: "user2@test.com",
          admin: false
        }
      ]);
    });
  });

  /************************************** get */
  describe("get", () => {
    test("works", async () => {
      await User.register({
        username: "testuser",
        password: "password123",
        email: "test@test.com"
      });

      // Add a move for the user
      await db.query(
        `INSERT INTO moves (location, date, username)
         VALUES ('Test Location', '2024-01-01', 'testuser')`
      );

      const user = await User.get("testuser");
      expect(user).toEqual({
        username: "testuser",
        email: "test@test.com",
        admin: false,
        moves: [
          {
            id: expect.any(Number),
            location: "Test Location",
            date: new Date("2024-01-01"),
            username: "testuser"
          }
        ]
      });
    });

    test("not found if no such user", async () => {
      try {
        await User.get("nonexistent");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  /************************************** update */
  describe("update", () => {
    beforeEach(async () => {
      await User.register({
        username: "testuser",
        password: "password123",
        email: "test@test.com"
      });
    });

    test("works", async () => {
      const updateData = {
        email: "new@test.com",
        password: "newpassword"
      };

      const user = await User.update("testuser", updateData);
      expect(user).toEqual({
        username: "testuser",
        email: "new@test.com",
        admin: false
      });

      // Verify password was hashed
      const found = await db.query(
        "SELECT password FROM users WHERE username = 'testuser'"
      );
      expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
      const isValid = await bcrypt.compare(
        "newpassword",
        found.rows[0].password
      );
      expect(isValid).toBeTruthy();
    });

    test("not found if no such user", async () => {
      try {
        await User.update("nonexistent", {
          email: "new@test.com"
        });
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });

    test("works: partial update", async () => {
      const updateData = {
        email: "new@test.com"
      };

      const user = await User.update("testuser", updateData);
      expect(user).toEqual({
        username: "testuser",
        email: "new@test.com",
        admin: false
      });
    });
  });

  /************************************** remove */
  describe("remove", () => {
    test("works", async () => {
      await User.register({
        username: "testuser",
        password: "password123",
        email: "test@test.com"
      });

      await User.remove("testuser");
      const found = await db.query(
        "SELECT * FROM users WHERE username = 'testuser'"
      );
      expect(found.rows.length).toEqual(0);
    });

    test("not found if no such user", async () => {
      try {
        await User.remove("nonexistent");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });
});
