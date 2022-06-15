const { getVotes, postVote, deleteVote } = require('../controllers/votes.controllers')


const votesRouter = require('express').Router()

votesRouter.route('/')
.get(getVotes)
.post(postVote)
.delete(deleteVote)


module.exports = votesRouter