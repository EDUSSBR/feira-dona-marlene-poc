import supertest from "supertest";
import app from "../src/index";
import { faker } from '@faker-js/faker';

const api = supertest(app);
describe("POST /fruits", () => {
    it("Should return 201 when inserting a fruit", async () => {
        const result = await api.post('/fruits').send({
            name: faker.person.firstName(),
            price: faker.commerce.price()
        })
        expect(result.status).toBe(201);
    })
    it("Should return 409 when inserting a fruit that is already registered", async () => {
        await api.post('/fruits').send({
            name: "Banana",
            price: faker.commerce.price()
        })
        const result = await api.post('/fruits').send({
            name: "Banana",
            price: faker.commerce.price()
        })
        expect(result.status).toBe(409);
    })
    it("should return 422 when inserting a fruit with data missing", async () => {
        const result = await api.post('/fruits').send({})
        const result1 = await api.post('/fruits').send({
            name: faker.person.firstName()
        })
        const result2 = await api.post('/fruits').send({
            price: faker.commerce.price()
        })
        expect(result.status).toBe(422);
        expect(result1.status).toBe(422);
        expect(result2.status).toBe(422);
    })
})
describe("GET /fruits", () => {
    it("Shoud return 404 when trying to get a fruit that doesn't exists", async () => {
        const result = await api.get(`/fruits/123123123123123123123`)
        expect(result.status).toBe(404);
    })
    it("Should return 400 when id param is not valid", async () => {
        const result = await api.get('/fruits/sadasdasd')
        expect(result.status).toBe(400);
    })
    it("should return a fruit given an id", async () => {
        const result = await api.get(`/fruits/2`)
        console.log(result.body)
        expect(result.status).toBe(200);
        expect(parseInt(result.body.id)).toBe(2);
        expect(parseFloat(result.body.price)).toEqual(expect.any(Number));
        expect(result.body.name).toBe("Banana");

     })
    it("should return all fruits", async () => {
        const result = await api.get(`/fruits`)
        console.log(result.body)
        expect(result.status).toBe(200);
        expect(result.body).toHaveLength(2);

        expect(result.body)
            .toEqual(expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    price: expect.any(String)
                })
            ]))
    })
})