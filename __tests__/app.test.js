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

describe('GET /api/topics', () => {
    it('should return an array of all topics', () => {
        return supertest(app).get('/api/topics')
        .expect(200)
        .then(result => {
            expect(Array.isArray(result.body.topics)).toBe(true)
        })
    });
});
