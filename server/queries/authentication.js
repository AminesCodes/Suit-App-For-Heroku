const db = require('../database/db');

const authenticateUser = async (userId, password) => {
    try {
        const requestQuery = `
        Select user_password FROM users WHERE id = $1
        `
        const targetUser = await db.one(requestQuery, userId)
        if (password === targetUser.user_password) {
            return true
        }
        return false
    } catch (err) {
        throw err;
    }
}

module.exports = { authenticateUser }