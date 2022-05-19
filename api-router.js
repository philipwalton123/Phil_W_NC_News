const apiRouter = require('express').Router()
const articleRouter = require('./articles-router')

apiRouter.get('/', (req, res) => {
    res.status(200).send("All is well from apiRouter")
})

apiRouter.get('/articles', articleRouter)

module.exports = apiRouter