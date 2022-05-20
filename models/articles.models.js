const db = require('../db/connection')
const { valueExists } = require('./modelUtils')
const { convertTimestampToDate } = require('../db/helpers/utils')


exports.getThisArticle = (id) => {
    return db.query('SELECT articles.article_id, articles.title, articles.body, articles.topic, articles.author, articles. created_at, articles.votes, CAST(COUNT (comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id', [id])
    .then(result => {
        if(result.rows.length === 0){
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
        if(result.rows.length === 0){
            return Promise.reject({status: 404, msg: `no such article with id ${id}`})
        } else {
            return result.rows[0]
            }
        })
    }
}


exports.getTheseComments = (id, query) => {
    let queryStr = 'SELECT * FROM comments WHERE article_id = $1'

    //Handles 'limit' query
    let L = 10
    if (query.limit) {
        if (parseInt(query.limit) < 1 || parseInt(query.limit) > 50) {
            return Promise.reject({status:400, msg: 'limit must be int 0 < _ > 50'})
        } else {
            L = query.limit
        }
    }
    queryStr += ` LIMIT ${L}`
    
    //Handles 'p' query
    if(query.p) {
        if (parseInt(query.p) < 1 || parseInt(query.p) == NaN) {
            return Promise.reject({status:400, msg: 'p must be a positive int'})
        } else {
            const p = parseInt(query.p)
            queryStr += ` OFFSET ${((p - 1) * L)}`
        }
    }

    const selection = db.query(queryStr, [id])

    const total = db.query('SELECT * FROM comments WHERE article_id = $1', [id])
    
    const thisArticleExists = valueExists('articles', 'article_id', id)

    return Promise.all([selection, total, thisArticleExists])
    .then(([selection, total, thisArticleExists]) => {
        if (thisArticleExists) {
            return {comments: selection.rows, comment_count: total.rows.length }
        } else {
            return Promise.reject({status: 404, msg: `no such article with id ${id}`})
        }
    })
} 

exports.readAllArticles = (query) => {
    let queryStr = "SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.body, articles. created_at, articles.votes, CAST (COUNT (comments.article_id) AS INT) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id"

    //handles 'topic' filter query first
    const topicArr = []
    if (query.topic) {
        queryStr += ' WHERE articles.topic = $1'
        topicArr.push(query.topic)
    }

    //group by
    queryStr += ' GROUP BY articles.article_id'

    //handles sort_by query
    const greenList = ['article_id', 'title', 'created_at', 'author', 'topic', 'votes', 'body', 'comment_count']

    if(query.sort_by) {
        if (!greenList.includes(query.sort_by)) {
            return Promise.reject({status:400, msg: 'invalid query'})
        } else {
            queryStr += query.sort_by == 'comment_count' ? ` ORDER BY comment_count` : ` ORDER BY articles.${query.sort_by}`
        }

    } else {
        queryStr += ' ORDER BY articles.created_at'
    }


    //handles 'order' query
    const orderGreenList = ['ASC', 'DESC']
    
    if(query.order) {
        const order = query.order.toUpperCase()
        if(!orderGreenList.includes(order)) {
            return Promise.reject({status:400, msg: 'invalid query'})
        } else {
            queryStr += ' ' + order
        }  
    } else {
        queryStr += ' DESC'
    }

    //handles 'limit' query
    let L = 10
    if (query.limit) {
        if (parseInt(query.limit) < 1 || parseInt(query.limit) > 50) {
            return Promise.reject({status:400, msg: 'limit must be int 0 < _ > 50'})
        } else {
            L = query.limit
        }
    }
    queryStr += ` LIMIT ${L}`
    

    //handles 'p' query
    if(query.p) {
        if (parseInt(query.p) < 1 || parseInt(query.p) == NaN) {
            return Promise.reject({status:400, msg: 'p must be a positive int'})
        } else {
            const p = parseInt(query.p)
            queryStr += ` OFFSET ${((p - 1) * L)}`
        }
    }

    const selection = db.query(queryStr, topicArr)
    const total = db.query('SELECT * FROM articles')
        
    return Promise.all([selection, total])
    .then(([selection, total]) => {
        return { articles: selection.rows, article_count: total.rows.length}
    })
}

exports.addThisComment = (id, body) => {

    if(Object.keys(body).length === 0 || !body.hasOwnProperty('body') || !body.hasOwnProperty('username')) {
        return Promise.reject({status: 400, msg: "malformed post"})
        
    } else if (typeof body.body != 'string' || typeof body.username != 'string') {
        return Promise.reject({status: 400, msg: "invalid value type"})
        
    } else {
        const date = new Date(Date.now())
        const queryStr = 'INSERT INTO comments (body, votes, author, article_id, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *'
        return db.query(queryStr, [body.body, 0, body.username, id, date])
        .then(result => {
            return result.rows[0]
        })
    }
}

exports.addThisArticle = (body) => {
    if(Object.keys(body).length === 0 || !body.hasOwnProperty('body') || !body.hasOwnProperty('author') || !body.hasOwnProperty('title') || !body.hasOwnProperty('topic')) {
        return Promise.reject({status: 400, msg: "malformed post"})
        
    } else if (typeof body.body != 'string' || typeof body.author != 'string' || typeof body.title != 'string' || typeof body.topic != 'string') {
        return Promise.reject({status: 400, msg: "invalid value type"})
        
    } else {
        const date = new Date(Date.now())
        const queryStr = 'INSERT INTO articles (title, topic, author, body, created_at, votes) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *'
        return db.query(queryStr, [body.title, body.topic, body.author, body.body, date, 0])
        .then(result => {
            result.rows[0].comment_count = 0
            return result.rows[0]
        })
    }
}