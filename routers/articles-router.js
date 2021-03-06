const { getArticles, getArticle, updateArticleVotes, getCommentsByArticleId, postComment, postArticle, deleteArticle } = require('../controllers/articles.controllers');

const articleRouter = require('express').Router()

articleRouter.route('/')
.get(getArticles)
.post(postArticle)

articleRouter
    .route('/:article_id')
    .get(getArticle)
    .patch(updateArticleVotes)
    .delete(deleteArticle)

articleRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postComment)

module.exports = articleRouter