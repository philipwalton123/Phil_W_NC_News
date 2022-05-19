const { getArticles, getArticle, updateArticleVotes, getCommentsByArticleId, postComment } = require('./controllers/articles.controllers');

const articleRouter = require('express').Router()

articleRouter.get('/', getArticles)

articleRouter
    .route('/:article_id')
    .get(getArticle)
    .patch(updateArticleVotes);

articleRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postComment)

module.exports = articleRouter