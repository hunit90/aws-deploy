import request from "supertest";
import {createApp, RedisClient} from "./app";
import * as redis from "redis";
import {App} from "supertest/types";

let app: App
let client: RedisClient;

beforeAll(async() => {
    client = redis.createClient({url:"redis://localhost:6379"});
    await client.connect();
    app = createApp(client);
});

beforeEach(async () => {
    await client.flushDb();
});

afterAll(async () => {
    await client.flushDb();
    await client.quit();
})

describe("POST /messages", () => {
    it("response with a success message", async() => {
        const response = await request(app)
            .post("/messages")
            .send({ message: "testing with redis" });

        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Message added to list");
    })
})

describe("GET /messages", () => {
    it("response with all message", async () => {
        const response = await request(app).get("/messages");
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    })
})