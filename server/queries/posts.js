/*
Posts Route Queries | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


// DATABASE CONNECTION
const db = require('../database/db');


const getAllPosts = async (offset) => {
  try {
    const getQuery = `
      SELECT posts.id
        , username
        , avatar_url
        , posts.time_created
        , title
        , image_url
        , caption
        , hashtag_str
      FROM posts INNER JOIN users ON (posts.owner_id = users.id)
      ORDER BY posts.time_created DESC
        , posts.id ASC
      LIMIT 10 OFFSET $/offset/;
    `;
    return await db.any(getQuery, { offset });
  } catch(err) {
    throw(err);
  }
}

const getAllPostsByUser = async (numId, offset) => {
  try {
    const getQuery = `
      SELECT posts.id
        , username
        , avatar_url
        , posts.time_created
        , title
        , image_url
        , caption
        , hashtag_str
      FROM posts INNER JOIN users ON (posts.owner_id = users.id)
      WHERE owner_id = $/id/
      ORDER BY posts.time_created DESC
        , posts.id ASC
      LIMIT 10 OFFSET $/offset/;
    `;
    return await db.any(getQuery, { id: numId, offset });
  } catch(err) {
    throw(err);
  }
}

const getAllPostsByUsersFollows = async (numId, offset) => {
  try {
    const getQuery = `
      SELECT posts.id
      , username
      , avatar_url
      , posts.time_created
      , title
      , image_url
      , caption
      , hashtag_str
      FROM posts INNER JOIN users ON (posts.owner_id = users.id)
      WHERE owner_id IN (
          SELECT followed_user_id
          FROM follows
          WHERE follower_id = $/id/
          )
      ORDER BY posts.time_created DESC
      , posts.id ASC
      LIMIT 10 OFFSET $/offset/;
    `;
    return await db.any(getQuery, { id: numId, offset });
  } catch(err) {
    throw(err);
  }
}

const getAllPostsByHashtags = async (hashArr, offset) => {
  try {
    const getQuery = `
      SELECT posts.id
        , username
        , avatar_url
        , posts.time_created
        , title
        , image_url
        , caption
        , hashtag_str
      FROM posts INNER JOIN users ON (posts.owner_id = users.id)
      WHERE hashtag_str ILIKE ANY($/hashArr/)
      ORDER BY posts.time_created DESC
      LIMIT 10 OFFSET $/offset/;
    `;
    return await db.any(getQuery, { hashArr, offset });
  } catch(err) {
    throw(err);
  }
}

const getOnePost = async (numId) => {
  try {
    const getQuery = `
      SELECT posts.id
        , username
        , avatar_url
        , posts.time_created
        , title
        , image_url
        , caption
        , hashtag_str
      FROM posts INNER JOIN users ON (posts.owner_id = users.id)
      WHERE posts.id = $/id/
    `;
    return await db.one(getQuery, { id: numId });
  } catch(err) {
    if (err.message === "No data returned from the query.") {
      throw new Error(`404__error: post ${numId} does not exist`);
    }
    throw(err);
  }
}

const createPost = async (bodyObj) => {
  try {
    const postQuery = `
      INSERT INTO posts (owner_id
        , title
        , caption
        , hashtag_str
        , image_url
      ) VALUES ($/ownerId/
        , $/title/
        , $/caption/
        , $/formattedHashtags/
        , $/imageUrl/
      ) RETURNING *;
    `;
    return await db.one(postQuery, bodyObj);
  } catch(err) {
    throw(err);
  }
}

const editPost = async (bodyObj) => {
  try {
    const patchQuery = `
      UPDATE posts
      SET title = $/title/
        , caption = $/caption/
        , hashtag_str = $/formattedHashtags/
      WHERE id = $/id/
        AND owner_id = $/currUserId/
      RETURNING *;
    `;
    return await db.one(patchQuery, bodyObj);
  } catch(err) {
    if (err.message === "No data returned from the query.") {
      throw new Error(`404__error: post ${bodyObj.id} by owner ${
        bodyObj.currUserId} does not exist`);
    }
    throw(err);
  }
}

const deletePost = async (postId, currUserId) => {
  try {
    const deleteQuery = `
      DELETE FROM posts
      WHERE id = $/id/
        AND owner_id = $/currUserId/
      RETURNING *;
    `;
    return await db.one(deleteQuery, { id: postId, currUserId });
  } catch(err) {
    if (err.message === "No data returned from the query.") {
      throw new Error(`404__error: post ${postId} by owner ${
        currUserId} does not exist`);
    }
    throw(err);
  }
}



/* EXPORT */
module.exports = {
  getAllPosts,
  getAllPostsByUser,
  getAllPostsByUsersFollows,
  getAllPostsByHashtags,
  getOnePost,
  createPost,
  editPost,
  deletePost
}
