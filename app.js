const express = require('express')
const { getTopics } = require('./controllers/topics.controllers')

const app = express()

app.get('/api/topics', getTopics)

app.use('/*', (req, res, next) => {
    console.log("caught the error in /*")
    res.status(404).send({msg: "not found"})
})

module.exports = app