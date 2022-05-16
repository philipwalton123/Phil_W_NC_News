const { readAllTopics } = require("../models/topics.models")

exports.getTopics = (req, res, next) => {
    readAllTopics()
    .then(topics => {
        res.status(200).send({topics})
    })
    .catch(err => {
        console.log(err, '<<<< in controller')
        next(err)
    })
}