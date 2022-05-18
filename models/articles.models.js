const db = require('../db/connection')
const { valueExists } = require('./modelUtils')

exports.getThisArticle = (id) => {
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

exports.incrementArticleVotes = (id, body) => {

    if(Object.keys(body).length === 0 || !body.hasOwnProperty('inc_votes')) {
        return Promise.reject({status: 400, msg: "inc_votes must be provided"})
        
    } else if (typeof body.inc_votes != 'number') {
        return Promise.reject({status: 400, msg: "inc_votes must be an integer"})
        
    } else {
        return db.query('UPDATE articles set votes = votes + $1 WHERE article_id = $2 RETURNING *', [body.inc_votes, id])
        .then(result => {
        if(result.rows.length == 0){
            return Promise.reject({status: 404, msg: `no such article with id ${id}`})
        } else {
            return result.rows[0]
            }
        })
    }
}


exports.getTheseComments = (id) => {
    const comments = db.query('SELECT * FROM comments WHERE article_id = $1', [id])
    
    const thisArticleExists = valueExists('articles', 'article_id', id)

    return Promise.all([comments, thisArticleExists])
    .then(([comments, thisArticleExists]) => {
        console.log(comments.rows)
        console.log(thisArticleExists, '<<<<<<<<')
        if (thisArticleExists) {
            return comments.rows
        } else {
            return Promise.reject({status: 404, msg: `no such article with id ${id}`})
        }
    })
} 

exports.readAllArticles = () => {
    return db.query('SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles. created_at, articles.votes, CAST (COUNT (*) AS INT) AS comment_count FROM articles JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id')
    .then(result => {
        return result.rows
    })
}
