const { readAllUsers, readThisUser } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    readAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
    .catch(err => {
        next(err)
    })
}

exports.getUser = (req, res, next) => {
    readThisUser(req.params.username)
    .then(user => {
        res.status(200).send({user})
    })
    .catch(err => {
        next(err)
    })
}