const apiRouter = require('express').Router()
const articleRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const endpointsRouter = require('./endpoints-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter.use('/api', endpointsRouter );

apiRouter.use('/api/articles', articleRouter)

apiRouter.use('/api/topics', topicsRouter)

apiRouter.use('/api/users', usersRouter)

apiRouter.use('/api/comments', commentsRouter)

module.exports = apiRouter