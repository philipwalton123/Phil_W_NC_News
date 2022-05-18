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