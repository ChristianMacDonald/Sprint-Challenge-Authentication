const db = require('../database/dbConfig');

function get(id = 0) {
    if (id) {
        return db('users').where({ id }).first();
    } else {
        return db('users');
    }
}

function getByUsername(username) {
    return db('users').where({ username }).first();
}

async function insert(user) {
    let [id] = await db('users').insert(user);
    let new_user = get(id);
    return new_user;
}

module.exports = {
    get,
    getByUsername,
    insert
}