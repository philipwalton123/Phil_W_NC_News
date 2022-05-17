const { getThisArticle, incrementArticleVotes } = require("../models/articles.models")

exports.getArticle = (req, res, next) => {
    getThisArticle(req.params.article_id)
    .then(article => {
        console.log(article, '<<<<< controller')
        res.status(200).send({article})
    })
    .catch(err => {
        next(err, req.params.article_id)
    })

}

exports.updateArticleVotes = (req, res, next) => {
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
            next(err)
        })
    }
}