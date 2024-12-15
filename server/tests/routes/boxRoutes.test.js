// tests/boxRoutes.test.js

const request = require("supertest");
const app = require("../app");
const db = require("../config/db"); 
const Box = require("../models/box");

describe("Box Routes Automated Tests", () => {
    // Test data
    const testBoxes = [
        {
            name: "Box 1",
            description: "First test box",
            location: "Location 1"
        },
        {
            name: "Box 2",
            description: "Second test box",
            location: "Location 2"
        }
    ];

    let createdBoxes = [];

    beforeAll(async () => {
        // Clear boxes table before tests
        await db.query("DELETE FROM boxes");
    });

    afterAll(async () => {
        // Clean up
        await db.query("DELETE FROM boxes");
        await db.end();
    });

    describe("Automated CRUD Testing", () => {
        test("CREATE: should create multiple boxes", async () => {
            for (let boxData of testBoxes) {
                const response = await request(app)
                    .post("/boxes")
                    .send(boxData);
                
                expect(response.statusCode).toBe(201);
                expect(response.body.box).toHaveProperty("id");
                expect(response.body.box.name).toBe(boxData.name);
                
                createdBoxes.push(response.body.box);
            }
        });

        test("READ: should retrieve all created boxes", async () => {
            const response = await request(app).get("/boxes");
            
            expect(response.statusCode).toBe(200);
            expect(response.body.boxes.length).toBe(testBoxes.length);
            
            // Verify each box exists in response
            for (let testBox of testBoxes) {
                const found = response.body.boxes.some(
                    box => box.name === testBox.name
                );
                expect(found).toBe(true);
            }
        });

        test("UPDATE: should update each box", async () => {
            for (let box of createdBoxes) {
                const updateData = {
                    description: `Updated description for ${box.name}`,
                    location: `Updated location for ${box.name}`
                };

                const response = await request(app)
                    .patch(`/boxes/${box.id}`)
                    .send(updateData);

                expect(response.statusCode).toBe(200);
                expect(response.body.box.description).toBe(updateData.description);
                expect(response.body.box.location).toBe(updateData.location);
            }
        });

        test("DELETE: should delete all created boxes", async () => {
            for (let box of createdBoxes) {
                const response = await request(app)
                    .delete(`/boxes/${box.id}`);

                expect(response.statusCode).toBe(200);
                expect(response.body).toEqual({ deleted: box.id });
            }

            // Verify all boxes are deleted
            const finalResponse = await request(app).get("/boxes");
            expect(finalResponse.body.boxes.length).toBe(0);
        });
    });

    describe("Error Handling Tests", () => {
        test("should handle invalid box creation", async () => {
            const invalidBoxes = [
                { name: "" },  // Empty name
                { location: "Only Location" },  // Missing name
                { name: 123 },  // Invalid type
                {}  // Empty object
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
            
            // Try to get non-existent box
            const getResponse = await request(app)
                .get(`/boxes/${nonExistentId}`);
            expect(getResponse.statusCode).toBe(404);

            // Try to update non-existent box
            const updateResponse = await request(app)
                .patch(`/boxes/${nonExistentId}`)
                .send({ name: "New Name" });
            expect(updateResponse.statusCode).toBe(404);

            // Try to delete non-existent box
            const deleteResponse = await request(app)
                .delete(`/boxes/${nonExistentId}`);
            expect(deleteResponse.statusCode).toBe(404);
        });
    });

    describe("Query Parameter Tests", () => {
        beforeAll(async () => {
            // Create test boxes with various locations
            const locations = ["Warehouse A", "Warehouse B", "Warehouse A"];
            for (let i = 0; i < locations.length; i++) {
                await request(app)
                    .post("/boxes")
                    .send({
                        name: `Query Test Box ${i}`,
                        description: "Test box for query",
                        location: locations[i]
                    });
            }
        });

        test("should filter boxes by location", async () => {
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
