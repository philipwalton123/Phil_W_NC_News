const { getThisArticle, incrementArticleVotes, readAllArticles } = require("../models/articles.models")

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
    incrementArticleVotes(req.params.article_id, req.body)
    .then(article => {
        res.status(200).send({article})
    })
    .catch(err => {
        next(err)
    })
}

exports.getArticles = (req, res, next) => {
    readAllArticles()
    .then(articles => {
        res.status(200).send({articles})
    })
}