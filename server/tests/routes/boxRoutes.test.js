const request = require("supertest");
const app = require("../../app");
const { db, closeDb } = require("../../config/db");
const Box = require("../../models/box");

describe("Box Routes Automated Tests", () => {
    const testBoxes = [
        {
            name: "Box 1",
            description: "First test box",
            location: "Location 1",
            room: "Living Room",
            move: 1
        },
        {
            name: "Box 2",
            description: "Second test box",
            location: "Location 2",
            room: "Kitchen",
            move: 1
        }
    ];

    let createdBoxes = [];

    beforeAll(async () => {
        await db.query("DELETE FROM boxes");
    });

    afterAll(async () => {
        await db.query("DELETE FROM boxes");
        await closeDb();
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
                expect(response.body.box.description).toBe(boxData.description);
                expect(response.body.box.location).toBe(boxData.location);
                expect(response.body.box.room).toBe(boxData.room);
                expect(response.body.box.move).toBe(boxData.move);
                
                createdBoxes.push(response.body.box);
            }
        });

        test("READ: should retrieve all created boxes", async () => {
            const response = await request(app).get("/boxes");
            
            expect(response.statusCode).toBe(200);
            expect(response.body.boxes.length).toBe(testBoxes.length);
            
            for (let testBox of testBoxes) {
                const found = response.body.boxes.some(
                    box => box.name === testBox.name &&
                          box.description === testBox.description &&
                          box.location === testBox.location &&
                          box.room === testBox.room &&
                          box.move === testBox.move
                );
                expect(found).toBe(true);
            }
        });

        test("UPDATE: should update each box", async () => {
            for (let box of createdBoxes) {
                const updateData = {
                    name: `Updated ${box.name}`,
                    description: `Updated description for ${box.name}`,
                    location: `Updated location for ${box.name}`,
                    room: `Updated room for ${box.name}`,
                    move: 2
                };

                const response = await request(app)
                    .patch(`/boxes/${box.id}`)
                    .send(updateData);

                expect(response.statusCode).toBe(200);
                expect(response.body.box.name).toBe(updateData.name);
                expect(response.body.box.description).toBe(updateData.description);
                expect(response.body.box.location).toBe(updateData.location);
                expect(response.body.box.room).toBe(updateData.room);
                expect(response.body.box.move).toBe(updateData.move);
            }
        });

        test("DELETE: should delete all created boxes", async () => {
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
                { name: "", room: "Room", move: 1 },
                { name: "Box", location: "Only Location" },
                { name: "Box", room: "Room", move: "invalid" },
                { name: 123, room: "Room", move: 1 },
                { room: "Room", move: 1 },
                {}
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
                .send({
                    name: "New Name",
                    description: "New Description",
                    location: "New Location",
                    room: "New Room",
                    move: 1
                });
            expect(updateResponse.statusCode).toBe(404);

            const deleteResponse = await request(app)
                .delete(`/boxes/${nonExistentId}`);
            expect(deleteResponse.statusCode).toBe(404);
        });
    });

    describe("Query Parameter Tests", () => {
        beforeAll(async () => {
            await db.query("DELETE FROM boxes");
            
            const testData = [
                {
                    name: "Query Test Box 1",
                    description: "Test box for query",
                    location: "Warehouse A",
                    room: "Test Room",
                    move: 1
                },
                {
                    name: "Query Test Box 2",
                    description: "Test box for query",
                    location: "Warehouse B",
                    room: "Test Room",
                    move: 1
                },
                {
                    name: "Query Test Box 3",
                    description: "Test box for query",
                    location: "Warehouse A",
                    room: "Test Room",
                    move: 1
                }
            ];

            for (let boxData of testData) {
                await request(app)
                    .post("/boxes")
                    .send(boxData);
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
            expect(response.body.boxes.every(
                box => box.name && box.room && box.move !== undefined
            )).toBe(true);
        });

        test("should filter boxes by move number", async () => {
            const response = await request(app)
                .get("/boxes")
                .query({ move: 1 });

            expect(response.statusCode).toBe(200);
            expect(response.body.boxes.every(
                box => box.move === 1
            )).toBe(true);
            expect(response.body.boxes.every(
                box => box.name && box.room && box.location
            )).toBe(true);
        });

        test("should return empty array for non-matching filters", async () => {
            const response = await request(app)
                .get("/boxes")
                .query({ location: "Non Existent Warehouse" });

            expect(response.statusCode).toBe(200);
            expect(response.body.boxes).toEqual([]);
        });
    });
});
