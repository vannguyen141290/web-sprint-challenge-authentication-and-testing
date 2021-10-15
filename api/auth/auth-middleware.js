const db = require('../../data/dbConfig')

async function checkUserExist(req, res, next) {
    const { username } = req.body
    const exist = await db('users')
        .where({ username })
        .first()
    if (exist) {
        next({
            status: 400,
            message: 'username taken'
        })
    } else {
        next()
    }
}

function validateUsername(req, res, next) {
    const { username, password } = req.body
    if (
        username === undefined ||
        password === undefined
    ) {
        next({
            status: 400,
            message: 'username and password required'
        })
    } else {
        next()
    }
}

module.exports = {
    checkUserExist,
    validateUsername
}
