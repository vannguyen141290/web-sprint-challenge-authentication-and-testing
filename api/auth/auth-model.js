const db = require('../../data/dbConfig')

function findById(id) {
    return db('users').where({ id }).first()
}

function findBy(filter) {
    return db('users').select('users.*').where(filter)
}

async function add(user) {
    const [id] = await db('users').insert(user)
    return await findById(id)
}

module.exports = {
    findById,
    add,
    findBy
}
