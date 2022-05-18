const format = require('pg-format')
const db = require('../db/connection')

exports.valueExists = (table, column, value) => {
    const queryStr = format('SELECT * FROM %I WHERE %I = $1;', table, column)
    return db.query(queryStr, [value])
    .then(result => {
        return result.rows.length >= 1
    })
}