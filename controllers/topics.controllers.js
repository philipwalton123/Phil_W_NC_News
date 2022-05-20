const { readAllTopics, addThisTopic} = require("../models/topics.models")

exports.getTopics = (req, res, next) => {
    readAllTopics()
    .then(topics => {
        res.status(200).send({topics})
    })
    .catch(err => {
        next(err)
    })
}

exports.postTopic = (req, res, next) => {
    addThisTopic(req.body)
    .then(topic => {
        res.status(201).send({topic})
    })
    .catch(err => {
        next(err)
    })
}