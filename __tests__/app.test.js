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
            console.log(response.body, '<<<<in test')
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
    it('200: response should include the total comment count for the requested article', () => {
        return supertest(app).get('/api/articles/3')
        .expect(200)
        .then(response => {
            expect(response.body.article).toHaveProperty('comment_count')
            expect(response.body.article.comment_count).toBe(2)
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
    })
})
          
describe('PATCH /api/articles/:article_id', () => {
    it('200: should increment votes and respond with the updated article', () => {
        const votesBeforePatch = testData.articleData[1].votes
        return supertest(app).patch('/api/articles/2').send({inc_votes: 3})
        .expect(200)
        .then(response => {
            expect(response.body.article).toEqual ({
                article_id: 2,
                title: "Sony Vaio; or, The Laptop",
                topic: "mitch",
                author: "icellusedkars",
                body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                created_at: expect.any(String),
                votes: votesBeforePatch + 3,
              })
        })
    });
    it('404: should respond with a msg if article does not exist', () => {
        return supertest(app).patch('/api/articles/13').send({inc_votes: 3})
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe("no such article with id 13")
        })
    });
    it('400: should respond with a msg if given wrong type of argument', () => {
        return supertest(app).patch('/api/articles/bananas').send({inc_votes: 3})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("not a valid request")
        })
    });
    it('400: should respond with a msg if no body is sent in the request', () => {
        return supertest(app).patch('/api/articles/2').send()
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("inc_votes must be provided")
        })
    });
    it('400: should respond with a msg if body does not have inc_count property', () => {
        return supertest(app).patch('/api/articles/2').send({id: 8})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("inc_votes must be provided")
        })
    });
    it('400: should respond with a msg if inc_count is not a number', () => {
        return supertest(app).patch('/api/articles/2').send({inc_votes: true})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("inc_votes must be an integer")
        })
    });
});
