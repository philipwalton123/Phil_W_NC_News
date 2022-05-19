const { removeThisComment, incrementCommentVotes } = require("../models/comments.models")

exports.deleteComment = (req, res, next) => {
    removeThisComment(req.params.comment_id)
    .then((comment)=> {
        res.status(204).send()
    })
    .catch(err => {
        next(err)
    })
}

exports.updateCommentVotes = (req, res, next) => {
    incrementCommentVotes(req.params.comment_id, req.body)
    .then(comment => {
        res.status(200).send({comment})
    })
    .catch(err => {
        next(err)
    })
}