const db = require('../db/connection')

exports.valueExists = (table, column, value) => {
    const tableGreenList = ["users", "topics", "articles", "comments"]
    const columnsGreenLists = ["title", "topic", "author", "body", "created_at", "votes", "article_id", "description", "slug", "username", "name", "avatar_url"]
    
    if(!tableGreenList.includes(table) || !columnsGreenLists.includes(column)) {
        return false
    }
    
    return db.query(`SELECT * FROM ${table} WHERE ${column} = $1`, [value])
    .then(result => {
        return result.rows.length >= 1
    })
}