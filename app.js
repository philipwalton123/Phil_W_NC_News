const express = require('express')
const apiRouter = require('./routers/api-router')
const { getUsers } = require('./controllers/users.controllers')
const { getTopics } = require('./controllers/topics.controllers')
const { updateArticleVotes, getArticle, getArticles, getCommentsByArticleId, postComment } = require('./controllers/articles.controllers')
const { deleteComment } = require('./controllers/comments.controllers')
const { getEndpoints } = require('./controllers/endpoints.controller.js')
const app = express()
app.use(express.json())

//Use the router
app.use('/', apiRouter)

// Handle any request to non-existant paths
app.use('/api/*', (req, res, next) => {
    res.status(404).send({msg: "not found"})
    next()
})

//Handle sql errors
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: `not a valid request`})
    } else if(err.code === '23503') {
        if (/not present in table "users"/.test(err.detail)){
            res.status(404).send({msg: `not found: invalid user`})
        } else if (/not present in table "topics"/.test(err.detail)){
            res.status(404).send({msg: `not found: invalid topic`})
        } else {
            res.status(404).send({msg: `not found: invalid article id`})
        }
    } else if (err.code === '42703') {
        res.status(400).send({msg: `not a valid query`})
    } else {
        next(err)
    }
})

//Handle custom errors
app.use((err, req, res, next) => {
    if(err.hasOwnProperty('status') && err.hasOwnProperty('msg')) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

//Back-stop error msg
app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app