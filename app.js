const express = require('express')
const { getTopics, getArticle } = require('./controllers/topics.controllers')
const { getUsers } = require('./controllers/users.controllers')

const app = express()

//GET all topics
app.get('/api/topics', getTopics)

//GET article by article_id number
app.get('/api/articles/:article_id', getArticle)

//GET all users
app.get('/api/users', getUsers)

app.use('/*', (req, res, next) => {
    res.status(404).send({msg: "not found"})
    next()
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: `not a valid request`})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.hasOwnProperty('status') && err.hasOwnProperty('msg')) {
        res.status(err.status).send({msg: err.msg})
    } else {
        res.status(500).send({msg: 'internal server error'})
    }
})

module.exports = app