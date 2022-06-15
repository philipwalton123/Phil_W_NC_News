const { readAllVotes, addThisVote, removeThisVote } = require("../models/votes.models")

exports.getVotes = (req, res, next) => {
    readAllVotes(req.query)
    .then(votes => {
        res.status(200).send({votes})
    })
    .catch(err => {
        next(err)
    })
}

exports.postVote = (req, res, next) => {
    addThisVote(req.body)
    .then(vote => {
        res.status(201).send({vote})
    })
    .catch(err => {
        next(err)
    })
}

exports.deleteVote = (req, res, next) => {
    removeThisVote(req.body)
    .then(vote => {
        console.log(vote, '<<<responding with')
        res.status(200).send({vote})
    })
    .catch(err => {
        next(err)
    })
}