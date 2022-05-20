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

describe.only('GET /api/articles/:article_id/comments', () => {
    it('200: should respond with all comments for the specified article', () => {
        return supertest(app).get('/api/articles/3/comments')
        .expect(200)
        .then(response => {
            expect(response.body.comments).toHaveLength(2)
            response.body.comments.forEach(comment => {
                expect(comment).toMatchObject({
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    comment_id: expect.any(Number),
                    created_at: expect.any(String)
                })
            })
        })
    })
    it('200: should respond with empty array if article exists with 0 comments', () => {
        return supertest(app).get('/api/articles/4/comments')
        .expect(200)
        .then(response => {
            expect(response.body.comments).toEqual([])
        })
    });
    it('404: should respond with a msg if that article does not exist', () => {
        return supertest(app).get('/api/articles/999/comments')
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe('no such article with id 999')
        })
    });
    it('400: should respond with a msg if given wrong type of argument', () => {
        return supertest(app).get('/api/articles/bananas/comments')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe('not a valid request')
        })
    });
    it("200: should accept 'limit' query to display first n comment only", () => {
        return supertest(app).get('/api/articles/1/comments?limit=5')
        .expect(200)
        .then(response => {
            expect(response.body.comments).toHaveLength(5)
        })
    });
    // it("200: should default 'limit' to 10 if not specified", () => {
    //     return supertest(app).get('/api/articles')
    //     .expect(200)
    //     .then(response => {
    //         expect(response.body.articles).toHaveLength(10)
    //     })
    // });
    // it("200: should accept 'p' query to display next n articles (?p=2 second page)", () => {
    //     return supertest(app).get('/api/articles?sort_by=article_id&order=ASC&p=2')
    //     .expect(200)
    //     .then(response => {
    //         response.body.articles.forEach(article => {
    //             expect(article.article_id).toBeGreaterThan(10)
    //         })
    //     })
    // });
    // it("200: should accept 'p=1' query (same as not specifing p)", () => {
    //     return supertest(app).get('/api/articles?sort_by=article_id&order=ASC&p=1')
    //     .expect(200)
    //     .then(response => {
    //         response.body.articles.forEach(article => {
    //             expect(article.article_id).toBeLessThan(11)
    //         })
    //     })
    // });
    // it("200: should accept combination of 'limit' and 'p' queries", () => {
    //     return supertest(app).get('/api/articles?sort_by=article_id&order=ASC&limit=4&p=3')
    //     .expect(200)
    //     .then(response => {
    //         response.body.articles.forEach(article => {
    //             expect(article.article_id).toBeGreaterThan(8)
    //             expect(article.article_id).toBeLessThan(13)
    //         })
    //     })
    // });
    // it('400: should respond with a msg if limit query is invalid', () => {
    //     return supertest(app).get('/api/articles?limit=ten')
    //     .expect(400)
    //     .then(response => {
    //         expect(response.body.msg).toBe(`not a valid query`)
    //     })
    // });
    // it('400: should respond with a msg if limit query is negative', () => {
    //     return supertest(app).get('/api/articles?limit=-5')
    //     .expect(400)
    //     .then(response => {
    //         expect(response.body.msg).toBe('limit must be int 0 < _ > 50')
    //     })
    // });
    // it('400: should respond with a msg if p query is invalid', () => {
    //     return supertest(app).get('/api/articles?p=two')
    //     .expect(400)
    //     .then(response => {
    //         expect(response.body.msg).toBe(`not a valid query`)
    //     })
    // });
    // it('400: should respond with a msg if p query is negative', () => {
    //     return supertest(app).get('/api/articles?p=-2')
    //     .expect(400)
    //     .then(response => {
    //         expect(response.body.msg).toBe(`p must be a positive int`)
    //     })
    // });
    // it('200: should respond with no articles if p > no. of pages', () => {
    //     return supertest(app).get('/api/articles?sort_by=article_id&order=asc&p=8')
    //     .expect(200)
    //     .then(response => {
    //         expect(response.body.articles).toEqual([])
    //     })
    // });
    // it('200: response should include a key of article_count', () => {
    //     return supertest(app).get('/api/articles')
    //     .expect(200)
    //     .then(response => {
    //         expect(response.body.article_count).toBe(12)
    //     })
    // });
})

describe('GET /api/articles', () => {
    it('200: should return all articles including comment count (default to limit 10)', () => {
        return supertest(app).get('/api/articles')
        .expect(200)
        .then(response => {
            response.body.articles.forEach(article => {
                expect(article).toMatchObject({
                    title: expect.any(String),
                    topic: expect.any(String),
                    author: expect.any(String),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_id: expect.any(Number),
                    comment_count: expect.any(Number)
                })
            })
        })
    });
    it('200: should default sort the results by created_at (newest first)', () => {
        return supertest(app).get('/api/articles')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toBeSortedBy('created_at', {descending: true})
        })
    });
    it('200: should accept query to sort by title (Z - A)', () => {
        return supertest(app).get('/api/articles?sort_by=title')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toBeSortedBy('title', {descending: true})
        })
    });
    it('200: should accept query to sort by author (Z - A)', () => {
        return supertest(app).get('/api/articles?sort_by=author')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toBeSortedBy('author', {descending: true})
        })
    });
    it('200: should accept query to sort by topic (Z - A)', () => {
        return supertest(app).get('/api/articles?sort_by=topic')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toBeSortedBy('topic', {descending: true})
        })
    });
    it('200: should accept query to sort by votes (descending)', () => {
        return supertest(app).get('/api/articles?sort_by=votes')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toBeSortedBy('votes', {descending: true})
        })
    });
    it('400: should respond with a msg if sort_by query is invalid', () => {
        return supertest(app).get('/api/articles?sort_by=age')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe('invalid query')
        })
    });
    it("200: should accept 'order' query to overwrite default order", () => {
        return supertest(app).get('/api/articles?sort_by=votes&order=ASC')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toBeSortedBy('votes', {ascending: true})
        })
    });
    it("200: 'order' query overwrite, also works for a-z fields ", () => {
        return supertest(app).get('/api/articles?sort_by=author&order=desc')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toBeSortedBy('author', {descending: true})
        })
    });
    it('400: should respond with a msg if order query is invalid', () => {
        return supertest(app).get('/api/articles?order=UP')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe('invalid query')
        })
    });
    it("200: accepts query to filter by topic", () => {
        return supertest(app).get('/api/articles?topic=mitch&limit=20')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toHaveLength(11)
            response.body.articles.forEach(article => {
                expect(article.topic).toBe('mitch')
            })
        })
    });
    it("200: accepts query to filter by topic (test for different topic", () => {
        return supertest(app).get('/api/articles?topic=cats')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toHaveLength(1)
            response.body.articles.forEach(article => {
                expect(article.topic).toBe('cats')
            })
        })
    });
    it('200: should respond with empty array if topic does not exist', () => {
        return supertest(app).get('/api/articles?topic=dogs')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toEqual([])
        })
    });
    it("200: should accept 'limit' query to display first n arictles only", () => {
        return supertest(app).get('/api/articles?limit=5')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toHaveLength(5)
        })
    });
    it("200: should default 'limit' to 10 if not specified", () => {
        return supertest(app).get('/api/articles')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toHaveLength(10)
        })
    });
    it("200: should accept 'p' query to display next n articles (?p=2 second page)", () => {
        return supertest(app).get('/api/articles?sort_by=article_id&order=ASC&p=2')
        .expect(200)
        .then(response => {
            response.body.articles.forEach(article => {
                expect(article.article_id).toBeGreaterThan(10)
            })
        })
    });
    it("200: should accept 'p=1' query (same as not specifing p)", () => {
        return supertest(app).get('/api/articles?sort_by=article_id&order=ASC&p=1')
        .expect(200)
        .then(response => {
            response.body.articles.forEach(article => {
                expect(article.article_id).toBeLessThan(11)
            })
        })
    });
    it("200: should accept combination of 'limit' and 'p' queries", () => {
        return supertest(app).get('/api/articles?sort_by=article_id&order=ASC&limit=4&p=3')
        .expect(200)
        .then(response => {
            response.body.articles.forEach(article => {
                expect(article.article_id).toBeGreaterThan(8)
                expect(article.article_id).toBeLessThan(13)
            })
        })
    });
    it('400: should respond with a msg if limit query is invalid', () => {
        return supertest(app).get('/api/articles?limit=ten')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`not a valid query`)
        })
    });
    it('400: should respond with a msg if limit query is negative', () => {
        return supertest(app).get('/api/articles?limit=-5')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe('limit must be int 0 < _ > 50')
        })
    });
    it('400: should respond with a msg if p query is invalid', () => {
        return supertest(app).get('/api/articles?p=two')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`not a valid query`)
        })
    });
    it('400: should respond with a msg if p query is negative', () => {
        return supertest(app).get('/api/articles?p=-2')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`p must be a positive int`)
        })
    });
    it('200: should respond with no articles if p > no. of pages', () => {
        return supertest(app).get('/api/articles?sort_by=article_id&order=asc&p=8')
        .expect(200)
        .then(response => {
            expect(response.body.articles).toEqual([])
        })
    });
    it('200: response should include a key of article_count', () => {
        return supertest(app).get('/api/articles')
        .expect(200)
        .then(response => {
            expect(response.body.article_count).toBe(12)
        })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('200: should return the new comment', () => {
        const testComment = { username: 'rogersop', body: 'I like the way you think.'}
        const commentsBeforePost = testData.commentData.length
        return supertest(app).post('/api/articles/3/comments').send(testComment)
        .expect(201)
        .then(response => {
            expect(response.body.comment).toEqual({
                article_id: 3,
                author: 'rogersop',
                body: 'I like the way you think.',
                comment_id: commentsBeforePost + 1,
                created_at: expect.any(String),
                votes: 0
            })
        })
    });
    it('404: should respond with a msg if article id does not exist', () => {
        const testComment = { username: 'rogersop', body: 'I like the way you think.'}
        return supertest(app).post('/api/articles/13/comments').send(testComment)
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe(`not found: invalid article id`)
        })
    });
    it('400: should respond with a msg if article id is no an int', () => {
        const testComment = { username: 'rogersop', body: 'I like the way you think.'}
        return supertest(app).post('/api/articles/three/comments').send(testComment)
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`not a valid request`)
        })
    });
    it('400: should respond with a msg if no body is sent in the request', () => {
        return supertest(app).post('/api/articles/3/comments').send()
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`malformed post`)
        })
    });
    it('400: should respond with a msg if body does not have username property', () => {
        return supertest(app).post('/api/articles/3/comments').send({body: 'hi'})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`malformed post`)
        })
    });
    it('400: should respond with a msg if body does not have body property', () => {
        return supertest(app).post('/api/articles/3/comments').send({username: 'rogersop'})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`malformed post`)
        })
    });
    it('400: should respond with a msg if body is not a string', () => {
        return supertest(app).post('/api/articles/3/comments').send({username: 'rogersop', body: true})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`invalid value type`)
        })
    });
    it('404: should respond with a msg if username is not an existing author', () => {
        return supertest(app).post('/api/articles/3/comments').send({username: 'phil', body: 'hi'})
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe(`not found: invalid user`)
        })
    });
});


describe('DELETE /api/comments/:comment_id', () => {
    it('204: should respond with no content if row was successfully deleted', () => {
        return supertest(app).delete('/api/comments/3')
        .expect(204)
        .then(()=> {
            return supertest(app).get('/api/articles/1/comments')
        })
        .then(response => {
            response.body.comments.forEach(comment => {
                expect(comment.comment_id).not.toBe(3)
            })
        })
    });
    it('404: should respond with a msg if comment_id not found', () => {
        return supertest(app).delete('/api/comments/25')
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe('comment not found')
        })
    });
    it('400: should respond with a msg if comment_id is not a number', () => {
        return supertest(app).delete('/api/comments/first')
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe(`not a valid request`)
        })
    });
});

describe('GET /api', () => {
    it('200: should respond with a json describing all available endpoints', () => {
        return supertest(app).get('/api')
        .expect(200)
        .then(response => {
            expect(response.body.endpoints).toMatchObject({
                "GET /api": expect.any(Object),
                "GET /api/topics": expect.any(Object),
                "GET /api/users": expect.any(Object),
                "GET /api/articles": expect.any(Object),
                "GET /api/articles/:article_id": expect.any(Object),
                "GET /api/articles/:article_id/comments": expect.any(Object),
                "PATCH /api/articles/:article_id": expect.any(Object),
                "POST /api/articles/:article_id/comments": expect.any(Object),
                "DELETE /api/comments/:comment_id": expect.any(Object),
            })
        })
    });
});

describe('GET /api/users/:username', () => {
    it('200: should return the specified user\s details', () => {
       return supertest(app).get('/api/users/lurker')
       .expect(200)
       .then(response => {
           expect(response.body.user).toMatchObject({
            username: 'lurker',
            name: 'do_nothing',
            avatar_url:
              'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
          })
       })
    });
    it('404: respond with a msg if user does not exist', () => {
        return supertest(app).get('/api/users/thor')
       .expect(404)
       .then(response => {
           expect(response.body.msg).toBe("not found")
       })
    });
});

describe('PATCH /api/comments/:comment_id', () => {
    it('200: should increment votes and respond with the updated comment', () => {
        const votesBeforePatch = testData.commentData[1].votes
        return supertest(app).patch('/api/comments/2').send({inc_votes: 3})
        .expect(200)
        .then(response => {
            expect(response.body.comment).toEqual ({
                comment_id: 2,
                body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
                votes: votesBeforePatch + 3,
                author: "butter_bridge",
                article_id: 1,
                created_at: expect.any(String)
              })
        })
    });
    it('404: should respond with a msg if comment does not exist', () => {
        return supertest(app).patch('/api/comments/20').send({inc_votes: 3})
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe("no such comment with id 20")
        })
    });
    it('400: should respond with a msg if given wrong type of argument', () => {
        return supertest(app).patch('/api/comments/bananas').send({inc_votes: 3})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("not a valid request")
        })
    });
    it('400: should respond with a msg if no body is sent in the request', () => {
        return supertest(app).patch('/api/comments/2').send()
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("inc_votes must be provided")
        })
    });
    it('400: should respond with a msg if body does not have inc_count property', () => {
        return supertest(app).patch('/api/comments/2').send({id: 8})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("inc_votes must be provided")
        })
    });
    it('400: should respond with a msg if inc_count is not a number', () => {
        return supertest(app).patch('/api/comments/2').send({inc_votes: true})
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("inc_votes must be an integer")
        })
    });
});

describe('POST /api/articles', () => {
    it('200: should add the article and return it to client', () => {
        const testArticle= { author: 'rogersop', body: 'This is MY story.', topic: 'cats', title: 'The Real Me'}
        return supertest(app).post('/api/articles').send(testArticle)
        .expect(201)
        .then(response => {
            expect(response.body.article).toEqual({
                article_id: 13,
                author: 'rogersop',
                title: 'The Real Me',
                body: 'This is MY story.',
                topic: 'cats',
                created_at: expect.any(String),
                votes: 0,
                comment_count: 0
            })
        })
        .then(() => {
            return supertest(app).get('/api/articles/13')
            .expect(200)
            .then(response => {
                expect(response.body.article).toEqual({
                    article_id: 13,
                    author: 'rogersop',
                    title: 'The Real Me',
                    body: 'This is MY story.',
                    topic: 'cats',
                    created_at: expect.any(String),
                    votes: 0,
                    comment_count: 0
                })
            })
        })
    });
    it('404: should respond with a msg if author is not an existing user', () => {
        const testArticle= { author: 'phil', body: 'This is MY story.', topic: 'cats', title: 'The Real Me'}
        return supertest(app).post('/api/articles').send(testArticle)
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe("not found: invalid user")
        })
    });
    it('404: should respond with a msg if topic is not an existing topic', () => {
        const testArticle= { author: 'rogersop', body: 'This is MY story.', topic: 'gardening', title: 'The Real Me'}
        return supertest(app).post('/api/articles').send(testArticle)
        .expect(404)
        .then(response => {
            expect(response.body.msg).toBe("not found: invalid topic")
        })
    });
    it('400: should respond with a msg if post has no body property', () => {
        const testArticle= { author: 'rogersop', topic: 'cats', title: 'The Real Me'}
        return supertest(app).post('/api/articles').send(testArticle)
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("malformed post")
        })
    });
    it('400: should respond with a msg if post has no title property', () => {
        const testArticle= { author: 'rogersop', body: 'This is MY story.', topic: 'cats'}
        return supertest(app).post('/api/articles').send(testArticle)
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("malformed post")
        })
    });
    it('400: should respond with a msg if post has no author property', () => {
        const testArticle= { body: 'This is MY story.', topic: 'cats', title: 'The Real Me'}
        return supertest(app).post('/api/articles').send(testArticle)
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("malformed post")
        })
    });
    it('400: should respond with a msg if post has no topic property', () => {
        const testArticle= { author: 'rogersop', body: 'This is MY story.', title: 'The Real Me'}
        return supertest(app).post('/api/articles').send(testArticle)
        .expect(400)
        .then(response => {
            expect(response.body.msg).toBe("malformed post")
        })
    });
});