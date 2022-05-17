const express = require('express')

const { getUsers } = require('./controllers/users.controllers')
const { getTopics } = require('./controllers/topics.controllers')
const { updateArticleVotes, getArticle, getCommentsByArticleId } = require('./controllers/articles.controllers')


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



//GET all comments for specified article id
app.get('/api/articles/:article_id/comments', getCommentsByArticleId)


app.use('/*', (req, res, next) => {
    res.status(404).send({msg: "not found"})
    next()
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        //console.log("caught as a psql error")
        res.status(400).send({msg: `not a valid request`})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if(err.hasOwnProperty('status') && err.hasOwnProperty('msg')) {
        //console.log("caught as a custom error")
        res.status(err.status).send({msg: err.msg})
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    //console.log("err in last error catcher", Object.keys(err))
    res.status(500).send({msg: 'internal server error'})
})

module.exports = app