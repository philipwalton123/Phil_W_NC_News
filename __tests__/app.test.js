const app = require ('../app')
const supertest = require('supertest')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const testData = require('../db/data/test-data/index')

beforeEach(() => {
return seed(testData)
})

afterAll(() => {
    db.end()
})

describe('Catch-all bad paths', () => {
    it('404: typo in url should respond with not found', () => {
        return supertest(app).get('/api/topis')
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe("not found")
        })
    });
});

describe('GET /api/topics', () => {
    it('200: should return an array of all topics', () => {
        return supertest(app).get('/api/topics')
        .expect(200)
        .then(response => {
            expect(Array.isArray(response.body.topics)).toBe(true)
            expect(response.body.topics).toHaveLength(3)
        })
    });
});
