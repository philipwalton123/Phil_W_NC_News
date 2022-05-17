const { readAllTopics, getThisArticle, incrementArticleVotes } = require("../models/topics.models")

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

exports.updateArticleVotes = (req, res, next) => {
    console.log(req.body, "<<<< in controller")
    if(Object.keys(req.body).length === 0 || !req.body.hasOwnProperty('inc_votes')) {
        return Promise.reject({status: 400, msg: "inc_votes must be provided"})
        .catch(err => {
            next(err)
        })
    } else if (typeof req.body.inc_votes != 'number') {
        return Promise.reject({status: 400, msg: "inc_votes must be an integer"})
        .catch(err => {
            next(err)
        })
    } else {
        incrementArticleVotes(req.params.article_id, req.body.inc_votes)
        .then(article => {
            res.status(200).send({article})
        })
        .catch(err => {
            console.log("catch block")
            next(err)
        })
    }
    
}