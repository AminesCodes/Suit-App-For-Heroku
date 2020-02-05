/*
Follows Route Queries | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


// DATABASE CONNECTION
const db = require('../database/db');


const getFollows = async (currentUserId) => {
  try {
    const getQuery = `
      SELECT username AS follow
        , followed_user_id
        , avatar_url
      FROM follows INNER JOIN users ON (follows.followed_user_id = users.id)
      WHERE follower_id = $/id/
      ORDER BY username ASC;
    `;
    return await db.any(getQuery, { id: currentUserId });
  } catch(err) {
    throw(err);
  }
}

const getFollowers = async (currentUserId) => {
  try {
    const getQuery = `
      SELECT username AS follower
        , follower_id
        , avatar_url
      FROM follows INNER JOIN users ON (follows.follower_id = users.id)
      WHERE followed_user_id = $/id/
      ORDER BY username ASC;
    `;
    return await db.any(getQuery, { id: currentUserId });
  } catch(err) {
    throw(err);
  }
}

const createFollow = async (currentUserId, targetUserId) => {
  try {
    const postQuery = `
      INSERT INTO follows (follower_id
        , followed_user_id
      ) VALUES ($/currentUserId/
        , $/targetUserId/
      ) RETURNING *;
    `;
    return await db.one(postQuery, { currentUserId, targetUserId });
  } catch(err) {
    if (err.code === "23503") { // violation of foreign key constraint aka !userId
      throw new Error("404__error: at least one user_id does not exist");
    }
    throw(err);
  }
}

const deleteFollow = async (currentUserId, targetUserId) => {
  try {
    const deleteQuery = `
      DELETE FROM follows
      WHERE follower_id = $/currentUserId/
        AND followed_user_id = $/targetUserId/
      RETURNING *;
    `;
    return await db.one(deleteQuery, { currentUserId, targetUserId });
  } catch(err) {
    if (err.message === "No data returned from the query.") {
      throw new Error(`404__error: target follow ${currentUserId} -> ${targetUserId} does not exist`);
    }
    throw(err);
  }
}

const checkFollowAlreadyExists = async (currentUserId, targetUserId) => {
  try {
    const getQuery = `
      SELECT id
        , follower_id
        , followed_user_id
      FROM follows
      WHERE follower_id = $/currentUserId/
        AND followed_user_id = $/targetUserId/
    `;
    const follow = await db.any(getQuery, { currentUserId, targetUserId });
    if (follow.length) {
      throw new Error("403__error: follow already exists");
    }
    return;
  } catch(err) {
    throw(err);
  }
}


/* EXPORT */
module.exports = {
  getFollows,
  getFollowers,
  createFollow,
  deleteFollow,
  checkFollowAlreadyExists
}
