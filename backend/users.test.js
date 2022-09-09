const request = require("supertest");

//import {request} from 'express';

const app = require("./app");
const db = require("./db");

    test("creates a new user", async function() {
        const response = await request(app)
        .post('/users')
        .send({
			username: "David",
			password: "password",
			email: "new@email.com "
        });
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
user: { username: "David" }
        });
        const getUsersResponse = await request(app). get('/users')
        expect(response.body[0]).toEqual({
            email: "new@email.com ",
            username:"David"
        });
        
    });
    afterAll(function () {
        db.end();
      });