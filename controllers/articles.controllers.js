const { getThisArticle, incrementArticleVotes, readAllArticles, addThisComment } = require("../models/articles.models")

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
    .catch(err => {
        next(err)
    })
}


exports.postComment = (req, res, next) => {
    addThisComment(req.params.article_id, req.body)
    .then(comment => {
        res.status(201).send({comment})
    })
    .catch(err => {
        console.log(err)
        next(err)
    })
}