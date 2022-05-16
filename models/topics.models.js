const db = require('../db/connection')


exports.readAllTopics = () => {
    return db.query('SELECT * FROM topics')
    .then(result => {
        return result.rows})
}

exports.getThisArticle = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    .then(result => {
        if(result.rows.length == 0){
            return Promise.reject({status: 404, msg: `no such article with id ${id}`})
        } else {
            return result.rows[0]
        }
    })
}

exports.incrementArticleVotes = (id, increment) => {
    return db.query('UPDATE articles set votes = votes + $1 WHERE article_id = $2 RETURNING *', [increment, id])
    .then(result => {
        if(result.rows.length == 0){
            return Promise.reject({status: 404, msg: `no such article with id ${id}`})
        } else {
            return result.rows[0]
        }
    })
}