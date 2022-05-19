const { deleteComment, updateCommentVotes } = require('../controllers/comments.controllers')

const commentsRouter = require('express').Router()

commentsRouter.route('/:comment_id')
    .delete(deleteComment)
    .patch(updateCommentVotes)

module.exports = commentsRouter