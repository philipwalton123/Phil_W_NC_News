const articleRouter = require('express').Router()

articleRouter.get('/', (req, res) => {
    res.status(200).send("All is well from api/articles")
})

articleRouter
    .route('/:article_id')
    .get((req, res) => {
        res.status(200).send("All is well from GET api/articles/:article_id")
    })
    .patch((req, res) => {
        res.status(200).send("All is well from PATCH api/articles/:article_id")
    });

articleRouter
    .route('/:article_id/comments')
    .get((req, res) => {
        res.status(200).send("All is well from GET api/articles/:article_id/comments")
    })
    .post((req, res) => {
        res.status(200).send("All is well from POST api/articles/:article_id/comments")
    })

module.exports = articleRouter