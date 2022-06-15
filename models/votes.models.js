const db = require('../db/connection')

exports.readAllVotes = () => {
    return db.query('SELECT * FROM votes')
    .then(result => {
        return result.rows
    })
}

exports.addThisVote = (body) => {

    if(Object.keys(body).length === 0 || !body.hasOwnProperty('article') || !body.hasOwnProperty('voter')) {
        return Promise.reject({status: 400, msg: "malformed post"})
        
    } else if (typeof body.article!= 'number' || typeof body.voter != 'string') {
        return Promise.reject({status: 400, msg: "invalid value type"})
    } else {
        return db.query('INSERT INTO votes (article, voter) VALUES ($1, $2) RETURNING *', [body.article, body.voter])
        .then(result => {
            return result.rows[0]
        })
    }
}

exports.removeThisVote = (body) => {


    if(Object.keys(body).length === 0 || !body.hasOwnProperty('article') || !body.hasOwnProperty('voter')) {
        return Promise.reject({status: 400, msg: "malformed post"})
        
    } else if (typeof body.article!= 'number' || typeof body.voter != 'string') {
        return Promise.reject({status: 400, msg: "invalid value type"})
    } else {
        return db.query('DELETE FROM votes WHERE article = $1 AND voter = $2 RETURNING *', [body.article, body.voter])
        .then(result => {
            console.log(result.rows, '<<<<controller')
            return result.rows[0]
        })
    }
}