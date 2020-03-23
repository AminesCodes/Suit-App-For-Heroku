const db = require('../database/db');

const formatStringInputs = (str) => {
    const arr = str.split(' ')
    const nameHolder = [];
    for (let word of arr) {
        if (typeof word === 'string' && word !== '') {
            nameHolder.push(word[0].toUpperCase() + (word.slice(1, word.length)).toLowerCase());
        }
    }
    if (nameHolder.length) {
        return nameHolder.join(' ')
    }
    return str
}

const formatUsername = username => {
    return username.replace(/[^a-z0-9]/g, '')
}

// CREATING THE USER
const createUser = async (user, password) => {
    try {
        let { username, firstname, lastname, email } = user;

        const normalizedUsername = formatUsername(username.toLowerCase());
        firstname = formatStringInputs(firstname);
        lastname = formatStringInputs(lastname);
        email = email.toLowerCase();

      const insertQuery = `
        INSERT INTO users
            (username, firstname, lastname, user_password, email, normalized_username)
        VALUES
            ($1, $2, $3, $4, $5, $6) 
        RETURNING *
        `;
      let newUser = await db.one(insertQuery, [username, firstname, lastname, password, email, normalizedUsername])
      delete newUser.user_password
      return newUser;
    } catch (err) {
        throw err;
    }
  }

const getUserByUsername = async (username) => {
    try {
        const normalizedUsername = formatUsername(username.toLowerCase())
        const requestQuery = `SELECT * FROM users WHERE normalized_username = $1`
        const user = await db.one(requestQuery, normalizedUsername);
        delete user.password
        return user;
    } catch (err) {
        if (err.message === 'No data returned from the query.') {
            return 'no match'
        }
        throw err;
    }
}

const getUserById = async (id) => {
    try {
        const requestQuery = `SELECT * FROM users WHERE id = $1`
        const user = await db.one(requestQuery, id);
        delete user.user_password;
        return user;
    } catch (err) {
        if (err.message === 'No data returned from the query.') {
            return 'no match'
        }
        throw err;
    }
}

const getAllUsers = async () => {
    try {
        
        const requestQuery = `
            SELECT id, firstname, lastname, username, normalized_username, email, avatar_url, bio, light_theme, time_created
            FROM users
        `
        const users = await db.any(requestQuery);
        return users;
    } catch (err) {
        throw err;
    }
}

const updateUserInfo = async (userId, user, avatarUrl) => {
    try {
        let { username, firstname, lastname, email, bio } = user;
        const normalizedUsername = formatUsername(username.toLowerCase());
        firstname = formatStringInputs(firstname);
        lastname = formatStringInputs(lastname);
        email = email.toLowerCase();

        let updateQuery = `UPDATE users 
        SET username=$2, normalized_username=$3, firstname=$4, lastname=$5, email=$6
        WHERE id = $1 
        RETURNING *`
        if (avatarUrl && bio) {
            updateQuery = `UPDATE users 
                SET username=$2, normalized_username=$3, firstname=$4, lastname=$5, email=$6, bio=$7, avatar_url=$8
                WHERE id = $1 
                RETURNING *`
        } else if (bio) {
            updateQuery = `UPDATE users 
                SET username=$2, normalized_username=$3, firstname=$4, lastname=$5, email=$6, bio=$7
                WHERE id = $1 
                RETURNING *`
        } else if (avatarUrl) {
            updateQuery = `UPDATE users 
                SET username=$2, normalized_username=$3, firstname=$4, lastname=$5, email=$6, avatar_url=$8
                WHERE id = $1 
                RETURNING *`
        }
        const updatedUser = await db.one(updateQuery, [userId, username, normalizedUsername, firstname, lastname, email, bio, avatarUrl]);
        delete updatedUser.user_password;
        return updatedUser;
    } catch (err) {
        throw err;
    }
}


const updateUserPassword = async (userId, password) => {
    try {
        const updateQuery = `UPDATE users 
        SET user_password = $1
        WHERE id = $2 
        RETURNING *
        `
        const user = await db.one(updateQuery, [password, userId])
        delete user.user_password;
        return user;
    } catch (err) {
        throw err;
    }
}

const updateUserTheme = async (userId, theme) => {
    try {
        const updateQuery = `UPDATE users 
        SET light_theme = $2
        WHERE id = $1 
        RETURNING *`
        let user = false;
        if (theme === 'dark') {
            user = await db.one(updateQuery, [userId, 'FALSE']);
        } else {
            user = await db.one(updateQuery, [userId, 'TRUE']);
        }
        delete user.user_password;
        return user;
    } catch (err) {
        throw err;
    }
}


const deleteUser = async (userId) => {
    try {
        const deleteQuery = `DELETE FROM users
        WHERE id = $1 
        RETURNING *
        `
        const user = await db.one(deleteQuery, userId)
        delete user.user_password
        return user;
    } catch (err) {
        if (err.message) {
            if (err.message === 'No data returned from the query.') {
                return false;
            }
        }
        throw err;
    }
}

const getUserByEmail = async (email) => {
    try {
        email = email.toLowerCase();
        const requestQuery = `
        Select * FROM users WHERE email = $1
        `
        return await db.oneOrNone(requestQuery, email)
    } catch (err) {
        throw err;
    }
}

const logUser = async (email, password) => {
    try {
        email = email.toLowerCase();
        const requestQuery = `
        Select * FROM users WHERE email = $1
        `
        const registeredUser = await db.one(requestQuery, email)
        if (password === registeredUser.user_password) {
            delete registeredUser.user_password
            return registeredUser
        }
        return false
    } catch (err) {
        if (err.message) {
            if (err.message === 'No data returned from the query.') {
                return false;
            }
        }
        throw err;
    }
}



module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    getAllUsers,
    updateUserInfo,
    updateUserPassword,
    deleteUser,
    logUser,
    getUserByEmail,
    updateUserTheme,
  }