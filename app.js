const express = require('express')

const { getUsers } = require('./controllers/users.controllers')
const { getTopics } = require('./controllers/topics.controllers')
const { updateArticleVotes, getArticle, getArticles, getCommentsByArticleId, postComment } = require('./controllers/articles.controllers')
const { deleteComment } = require('./controllers/comments.controllers')
const { getEndpoints } = require('./controllers/endpoints.controller.js')
const app = express()
app.use(express.json())

//GET all topics
app.get('/api/topics', getTopics)

//GET article by article_id number
app.get('/api/articles/:article_id', getArticle)


//GET all users
app.get('/api/users', getUsers)

//PATCH change number of votes for an article
app.patch('/api/articles/:article_id', updateArticleVotes)

//GET all articles
app.get('/api/articles', getArticles)

//GET all comments for specified article id
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)

//POST a comment to a specified article
app.post('/api/articles/:article_id/comments', postComment)


//POST a comment to a specified article
app.post('/api/articles/:article_id/comments', postComment)

// GET a json describing all available endpoints
app.get('/api', getEndpoints)


//DELETE a comment
app.delete('/api/comments/:comment_id', deleteComment)


app.use('/*', (req, res, next) => {
    res.status(404).send({msg: "not found"})
    next()
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: `not a valid request`})
    } else if(err.code === '23503') {
        if (/not present in table "users"/.test(err.detail)){
            res.status(404).send({msg: `not found: invalid user`})
        } else {
            res.status(404).send({msg: `not found: invalid article id`})
        }
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.hasOwnProperty('status') && err.hasOwnProperty('msg')) {
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app