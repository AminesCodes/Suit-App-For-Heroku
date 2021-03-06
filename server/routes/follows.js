/*
Follows Route | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


/* IMPORTS */
//    external
const express = require('express');
    const router = express.Router();
    
//    local
const { handleError, checkDoesUserExist } = require('../helpers/globalHelp.js');
const { processInput, handleSuccess } = require('../helpers/followsHelp.js');
const { 
  getFollows,
  getFollowers,
  createFollow,
  deleteFollow,
} = require('../queries/follows.js');


/* ROUTE HANDLES */
//    getFollows: get all others the user is following
router.get("/:currUserId", async (req, res, next) => {
    try {
      const currUserId = processInput(req, "currUserId");
      const follows = await getFollows(currUserId);
      await checkDoesUserExist(follows, currUserId);
      handleSuccess(res, follows, currUserId, "follows");
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    getFollowers: get all following current user
router.get("/followers/:currUserId", async (req, res, next) => {
    try {
      const currUserId = processInput(req, "currUserId");
      const followers = await getFollowers(currUserId);
      await checkDoesUserExist(followers, currUserId);
      handleSuccess(res, followers, currUserId, "followers");
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    createFollow: make new follow relationship
router.post("/add/:currUserId/:targetUserId", async (req, res, next) => {
    try {
      const currUserId = processInput(req, "currUserId");
      const targetUserId = processInput(req, "targetUserId");
      if (currUserId === targetUserId) {
        throw new Error("400__error: current and target user_ids are identical")
      }
      
      if (currUserId === req.user.id) {
        const response = await createFollow(currUserId, targetUserId);
        res.json({
            status: "success",
            message: `follow ${currUserId} -> ${targetUserId} created`,
            payload: response
        });
      } else {
        throw new Error("401__error: authentication failure");
      }
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    deleteFollow: delete follow relationship
router.patch("/delete/:currUserId/:targetUserId", async (req, res, next) => {
    try {
      const currUserId = processInput(req, "currUserId");
      const targetUserId = processInput(req, "targetUserId");;
      
      if (currUserId === req.user.id) {
        const response = await deleteFollow(currUserId, targetUserId);
        res.json({
            status: "success",
            message: "follow deleted",
            payload: response
        });
      } else {
        throw new Error("401__error: authentication issue");
      }
    } catch (err) {
      handleError(err, req, res, next);
    }
});


/* EXPORT */
module.exports = router;
