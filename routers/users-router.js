const { getUsers, getUser } = require('../controllers/users.controllers')

const usersRouter =require('express').Router()

usersRouter.get('/', getUsers)

usersRouter.get('/:username', getUser)

module.exports = usersRouter