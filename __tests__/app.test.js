const app = require ('../app')
const supertest = require('supertest')

describe('GET /api/topics', () => {
    it('should return an array of all topics', () => {
        return supertest(app).get('/api/topics')
        .expect(200)
        .then(result => {
            expect(Array.isArray(result.body)).toBe(true)
        })
    });
});
