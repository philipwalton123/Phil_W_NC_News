const fs = require('fs/promises')

exports.readEndpoints = () => {
    return fs.readFile('./endpoints.json', 'utf8')
    .then(result => {
        return JSON.parse(result)
    })
}
