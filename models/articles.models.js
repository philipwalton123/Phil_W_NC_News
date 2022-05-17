const db = require('../db/connection')

exports.getThisArticle = (id) => {
    // const article = db.query('SELECT * FROM articles WHERE article_id = $1', [id])
    // .then(result => {
    //     if(result.rows.length == 0){
    //         return Promise.reject({status: 404, msg: `no such article with id ${id}`})
    //     } else {
    //         return result.rows[0]
    //     }
    // })

    // const count = db.query('SELECT COUNT (article_id) FROM comments WHERE article_id = $1', [id])
    // .then(result => {
    //     return result.rows[0].count
    // })

    // return Promise.all([article, count])
    // .then(([article, count]) => {
    //     article.comment_count = parseInt(count, 10)
    //     return article
    // })

    //REFACTOR INTO A SINGLE QUERY

    return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles. created_at, articles.votes, CAST(COUNT (*) AS INT) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE comments.article_id = $1 GROUP BY articles.article_id', [id])
    .then(result => {
        console.log(result.rows, '<<<model')
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