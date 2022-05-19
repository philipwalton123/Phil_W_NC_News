const apiRouter = require('express').Router()

apiRouter.get('/', (req, res) => {
    res.status(200).send("All is well from apiRouter")
})

module.exports = apiRouter