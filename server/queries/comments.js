const db = require('../database/db');

const getAllCommentsByPostId = async (postId) => {
    try {
        const requestQuery = `
            SELECT comments.id AS comment_id
                , username
                , commenter_id
                , avatar_url
                , post_id
                , comment_body
                , comments.time_created
            FROM comments INNER JOIN users
            ON commenter_id = users.id
            WHERE post_id = $1
            ORDER BY comments.id ASC`
        return await db.any(requestQuery, postId)
    } catch (err) {
        throw err
    }
}

const addCommentToPost = async (postId, commenterId, body) => {
    try {
        const requestQuery = `
            INSERT INTO comments
                (post_id, commenter_id, comment_body)
            VALUES
                ($1, $2, $3)
            RETURNING *`
        return await db.one(requestQuery, [postId, commenterId, body])
    } catch (err) {
        throw err
    }
}

const editComment = async (commentId, commenterId, body) => {
    try {
        const requestQuery = `
            UPDATE comments
            SET comment_body = $3
            WHERE id = $1 AND commenter_id = $2
            RETURNING *`
        return await db.one(requestQuery, [commentId, commenterId, body])
    } catch (err) {
        throw err
    }
}

const deleteComment = async (commentId, commenterId) => {
    try {
        const requestQuery = `
        DELETE FROM comments
        WHERE id = $1 AND commenter_id = $2
        RETURNING *`
        return await db.one(requestQuery, [commentId, commenterId])
    } catch (err) {
        throw err
    }
}


module.exports = {
    getAllCommentsByPostId,
    addCommentToPost,
    editComment,
    deleteComment
}