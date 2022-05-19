const db = require('../db/connection')

exports.removeThisComment = (id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [id])
    .then(result => {
        if(result.rows.length) {
            return result.rows[0]
        } else {
            return Promise.reject({status:404, msg: 'comment not found'})
        }
        
    })
}

exports.incrementCommentVotes = (id, body) => {
    if(Object.keys(body).length === 0 || !body.hasOwnProperty('inc_votes')) {
        return Promise.reject({status: 400, msg: "inc_votes must be provided"})
        
    } else if (typeof body.inc_votes != 'number') {
        return Promise.reject({status: 400, msg: "inc_votes must be an integer"})
        
    } else {
        return db.query('UPDATE comments set votes = votes + $1 WHERE comment_id = $2 RETURNING *', [body.inc_votes, id])
        .then(result => {
        if(!result.rows.length){
            return Promise.reject({status: 404, msg: `no such comment with id ${id}`})
        } else {
            return result.rows[0]
            }
        })
    }
}