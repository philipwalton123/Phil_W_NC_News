const { removeThisComment } = require("../models/comments.models")

exports.deleteComment = (req, res, next) => {
    removeThisComment(req.params.comment_id)
    .then((comment)=> {
        res.status(204).send()
    })
    .catch(err => {
        next(err)
    })
}