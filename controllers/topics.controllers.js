const { readAllTopics, getThisArticle } = require("../models/topics.models")

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

exports.getArticle = (req, res, next) => {
    getThisArticle(req.params.article_id)
    .then(article => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err, req.params.article_id)
    })
}