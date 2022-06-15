const { readAllVotes, addThisVote, removeThisVote } = require("../models/votes.models")

exports.getVotes = (req, res, next) => {
    readAllVotes(req.query)
    .then(votes => {
        res.status(200).send(votes)
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
    console.log('in controller')
    removeThisVote(req.body)
    .then((vote)=> {
        res.status(204).send()
    })
    .catch(err => {
        next(err)
    })
}