const { getEndpoints } = require('./controllers/endpoints.controller')

const endpointsRouter = require('express').Router()

endpointsRouter.get('/', getEndpoints)

module.exports = endpointsRouter