const User = require('./auth-model')

async function checkUsernameExist(req, res, next) {
    const { username } = req.body
    const exist = await User.findBy({ username }).first()
    if (exist) {
        next({
            status: 400,
            message: 'username taken'
        })
    } else {
        next()
    }
}

function validateUserPayload(req, res, next) {
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

async function checkLoginUsername(req, res, next) {
    const { username } = req.body

    const exist = await User.findBy({ username }).first()
    if (!exist) {
        next({
            status: 401,
            message: 'invalid credentials'
        })
    } else {
        next()
    }
}

module.exports = {
    checkUsernameExist,
    validateUserPayload,
    checkLoginUsername
}
