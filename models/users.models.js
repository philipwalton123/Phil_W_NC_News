const db = require('../db/connection')

exports.readAllUsers = () => {
    return db.query('SELECT * FROM users')
    .then(result => {
        return result.rows
    })
}

exports.readThisUser = (username) => {
    return db.query('SELECT * FROM users WHERE username LIKE $1', [username])
    .then(({rows}) => {
        return rows.length ? rows[0] : Promise.reject({status: 404, msg: "not found"})
    })
}