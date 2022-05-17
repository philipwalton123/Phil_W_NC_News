const { readAllUsers } = require("../models/users.models")

exports.getUsers = (req, res, next) => {
    readAllUsers()
    .then(users => {
        res.status(200).send({users})
    })
    .catch(err => {
        next(err)
    })
}