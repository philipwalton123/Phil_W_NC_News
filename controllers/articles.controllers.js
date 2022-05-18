const { getThisArticle, incrementArticleVotes, readAllArticles, getTheseComments, addThisComment } = require("../models/articles.models")

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


exports.getCommentsByArticleId = (req, res, next) => {
    getTheseComments(req.params.article_id)
    .then(comments => {
        res.status(200).send({comments})
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