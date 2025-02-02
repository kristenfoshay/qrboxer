const request = require("supertest");
const app = require("../../app");
const { db, closeDb } = require("../../config/db");
const Box = require("../../models/box");

describe("Box Routes Automated Tests", () => {
  let testMoveId;
  
  beforeAll(async () => {
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM boxes");
    await db.query("DELETE FROM moves");
    await db.query("DELETE FROM users");

    await db.query("INSERT INTO users (username, password, email, admin) VALUES ($1, $2, $3, $4)",
      ["testuser", "password", "test@test.com", false]
    );

    const moveRes = await db.query(
      "INSERT INTO moves (location, date, username) VALUES ($1, $2, $3) RETURNING id",
      ["Test Location", "2024-01-01", "testuser"]
    );
    testMoveId = moveRes.rows[0].id;
  });

  beforeEach(async () => {
    await db.query("DELETE FROM boxes");
  });

  afterAll(async () => {
    await db.query("DELETE FROM items");
    await db.query("DELETE FROM boxes");
    await db.query("DELETE FROM moves");
    await db.query("DELETE FROM users");
    await closeDb();
  });

  const testBoxes = [
    {
      name: "Box 1",
      description: "First test box",
      location: "Location 1",
      room: "Living Room",
      move: null
    },
    {
      name: "Box 2",
      description: "Second test box",
      location: "Location 2",
      room: "Kitchen",
      move: null
    }
  ];

  describe("Automated CRUD Testing", () => {
    test("CREATE: should create multiple boxes", async () => {
      for (let boxData of testBoxes) {
        boxData.move = testMoveId;
        const response = await request(app)
          .post("/boxes")
          .send(boxData);
        
        expect(response.statusCode).toBe(201);
        expect(response.body.box).toHaveProperty("id");
        expect(response.body.box.name).toBe(boxData.name);
      }
    });

    test("READ: should retrieve all created boxes", async () => {
      for (let boxData of testBoxes) {
        boxData.move = testMoveId;
        await request(app)
          .post("/boxes")
          .send(boxData);
      }
      
      const response = await request(app).get("/boxes");
      expect(response.statusCode).toBe(200);
      expect(response.body.boxes.length).toBe(testBoxes.length);
      
      for (let testBox of testBoxes) {
        const found = response.body.boxes.some(
          box => box.name === testBox.name
        );
        expect(found).toBe(true);
      }
    });

    test("UPDATE: should update each box", async () => {
      const createdBoxes = [];
      
      for (let boxData of testBoxes) {
        boxData.move = testMoveId;
        const response = await request(app)
          .post("/boxes")
          .send(boxData);
        createdBoxes.push(response.body.box);
      }

      for (let box of createdBoxes) {
        const updateData = {
          description: `Updated description for ${box.name}`,
          location: `Updated location for ${box.name}`,
          room: `Updated room for ${box.name}`
        };

        const response = await request(app)
          .patch(`/boxes/${box.id}`)
          .send(updateData);

        expect(response.statusCode).toBe(200);
        expect(response.body.box.description).toBe(updateData.description);
        expect(response.body.box.location).toBe(updateData.location);
        expect(response.body.box.room).toBe(updateData.room);
      }
    });

    test("DELETE: should delete all created boxes", async () => {
      const createdBoxes = [];
      
      for (let boxData of testBoxes) {
        boxData.move = testMoveId;
        const response = await request(app)
          .post("/boxes")
          .send(boxData);
        createdBoxes.push(response.body.box);
      }

      for (let box of createdBoxes) {
        const response = await request(app)
          .delete(`/boxes/${box.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ deleted: box.id });
      }

      const finalResponse = await request(app).get("/boxes");
      expect(finalResponse.body.boxes.length).toBe(0);
    });
  });

  describe("Error Handling Tests", () => {
    test("should handle invalid box creation", async () => {
      const invalidBoxes = [
        { description: "Missing required fields" },
        { name: "", room: "Living Room", move: testMoveId },
        { name: "Box", room: "", move: testMoveId },
        { name: "Box", room: "Living Room", move: null }
      ];

      for (let invalidBox of invalidBoxes) {
        const response = await request(app)
          .post("/boxes")
          .send(invalidBox);
        expect(response.statusCode).toBe(400);
      }
    });

    test("should handle non-existent box operations", async () => {
      const nonExistentId = 99999;
      
      const getResponse = await request(app)
        .get(`/boxes/${nonExistentId}`);
      expect(getResponse.statusCode).toBe(404);

      const updateResponse = await request(app)
        .patch(`/boxes/${nonExistentId}`)
        .send({ name: "New Name" });
      expect(updateResponse.statusCode).toBe(404);

      const deleteResponse = await request(app)
        .delete(`/boxes/${nonExistentId}`);
      expect(deleteResponse.statusCode).toBe(404);
    });
  });

  describe("Query Parameter Tests", () => {
    test("should filter boxes by location", async () => {
      const testLocations = ["Warehouse A", "Warehouse B"];
      
      for (let location of testLocations) {
        const boxData = {
          name: `Box in ${location}`,
          description: "Test box for query",
          location: location,
          room: "Storage",
          move: testMoveId
        };
        await request(app)
          .post("/boxes")
          .send(boxData);
      }

      const response = await request(app)
        .get("/boxes")
        .query({ location: "Warehouse A" });

      expect(response.statusCode).toBe(200);
      expect(response.body.boxes.every(
        box => box.location === "Warehouse A"
      )).toBe(true);
    });
  });
});
