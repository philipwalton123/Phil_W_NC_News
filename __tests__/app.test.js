const app = require ('../app')
const supertest = require('supertest')
const seed = require('../db/seeds/seed')
const db = require('../db/connection')
const testData = require('../db/data/test-data/index')
const { forEach } = require('../db/data/test-data/articles')

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

describe('GET /api/articles/:article_id', () => {
    it('should respond with the correct article object with the correct properties', () => {
        return supertest(app).get('/api/articles/3')
        .expect(200)
        .then(response => {
            expect(response.body.article).toMatchObject({
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: expect.any(String),
                votes: 0,
                article_id: expect.any(Number)
            })
        })
    });
    it('404: should respond with a msg if article does not exist', () => {
        return supertest(app).get('/api/articles/13')
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe("no such article with id 13")
        })
    });
    it('400: should respond with a msg if given wrong type of argument', () => {
        return supertest(app).get('/api/articles/bananas')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("not a valid request")
        })
    });
});

describe('GET /api/users', () => {
    it('200: returns object with key of users = array of all users ', () => {
        return supertest(app).get('/api/users')
        .expect(200)
        .then(response => {
            expect(Array.isArray(response.body.users)).toBe(true)
            expect(response.body.users).toHaveLength(4)
            response.body.users.forEach(user => {
                expect(user).toMatchObject({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String)
                })
            })
        })
    });
});
