/*
Posts Route | Server | SUITAPP Web App
GROUP 1: Amine Bensalem, Douglas MacKrell, Savita Madray, Joseph P. Pasaoa
*/


/* MODULE INITS */
//    external
const express = require('express');
    const router = express.Router();

const storage = require('../helpers/s3Service');

// const multer = require('multer');
//     const storage = multer.diskStorage({
//         destination: (request, file, cb) => {
//           cb(null, './public/images/posts');
//         },
//         filename: (request, file, cb) => {
//           const fileName = Date.now() + "-" + file.originalname;
//           cb(null, fileName);
//         }
//     });
//     const fileFilter = (request, file, cb) => {
//       if ((file.mimetype).slice(0, 6) === 'image/') {
//           cb(null, true);
//       } else {
//           cb(null, false);
//       }
//     };
//     const upload = multer({ storage, fileFilter });
//    local

const { handleError, checkDoesUserExist } = require('../helpers/globalHelp.js');
const { processInput } = require('../helpers/postsHelp.js');
const { 
  getAllPosts,
  getAllPostsByUser,
  getAllPostsByUsersFollows,
  getAllPostsByHashtags,
  getOnePost,
  createPost,
  editPost,
  deletePost,
} = require('../queries/posts.js');


/* ROUTE HANDLES */
//    getAllPosts: get global user posts. limit 10, optional offset
router.get("/", async (req, res, next) => {
    try {
      const offset = processInput(req, "offset");
      const allPosts = await getAllPosts(offset);
      res.json({
          status: "success",
          message: "all posts retrieved",
          payload: allPosts
      });
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    getAllPostsByUser: get all of a single user's posts. limit 10, optional offset
router.get("/userid/:id", async (req, res, next) => {
    try {
      const userId = processInput(req, "userId");
      const offset = processInput(req, "offset");
      const allPostsByUser = await getAllPostsByUser(userId, offset);
      await checkDoesUserExist(allPostsByUser, userId);
      res.json({
          status: "success",
          message: `all posts of user ${userId} retrieved`,
          payload: allPostsByUser
      });
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    getAllPostsByUsersFollows: get all posts by a single user's follows. limit 10, optional offset
router.get("/follows/:id", async (req, res, next) => {
  try {
    const currUserId = processInput(req, "userId");
    const offset = processInput(req, "offset");
    const allPostsByUsersFollows = await getAllPostsByUsersFollows(currUserId, offset);
    await checkDoesUserExist(allPostsByUsersFollows, currUserId);
    res.json({
        status: "success",
        message: `all posts by user ${currUserId}'s follows retrieved`,
        payload: allPostsByUsersFollows
    });
  } catch (err) {
    handleError(err, req, res, next);
  }
});

//    getAllPostsByHashtags: get all users' posts by hashtags. limit 10, optional offset
router.get("/tags", async (req, res, next) => {
    try {
      const hashtags = processInput(req, "search hashtags");
      const offset = processInput(req, "offset");
      const allPostsByHashtags = await getAllPostsByHashtags(hashtags.formatted, offset);
      res.json({
          status: "success",
          message: `all posts with hashtags '${hashtags.parsed}' retrieved`,
          payload: allPostsByHashtags
      });
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    getOnePost: get one single post by post_id
router.get("/:postId", async (req, res, next) => {
    try {
      const postId = processInput(req, "postId");
      const onePost = await getOnePost(postId);
      res.json({
          status: "success",
          message: `post ${postId} retrieved`,
          payload: onePost
      });
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    createPost: create a single post
router.post("/add", storage.upload.single("posts"), async (req, res, next) => {
    try {
      const imageUrl = processInput(req, "imageUrl");
      const { caption, formattedHashtags } = processInput(req, "caption");
      const title = processInput(req, "title");
      const currUserId = processInput(req, "currUserId");

      if (currUserId === req.user.id) {
        const response = await createPost({
            ownerId: currUserId,
            title,
            caption,
            formattedHashtags,
            imageUrl
        });
        res.json({
            status: "success",
            message: "new post created",
            payload: response
        });
      } else {
        throw new Error("401__error: authentication failure");
      }
    } catch (err) {
      handleError(err, req, res, next);
    }
});

//    editPost: edit a post by post_id
router.patch("/edit/:postId", async (req, res, next) => {
  try {
    const postId = processInput(req, "postId");
    const { caption, formattedHashtags } = processInput(req, "caption");
    const title = processInput(req, "title");
    const currUserId = processInput(req, "currUserId");
    
    if (currUserId === req.user.id) {
      const response = await editPost({ id: postId, currUserId, title, caption, formattedHashtags });
      res.json({
          status: "success",
          message: `post ${postId} edited`,
          payload: response
      });
    } else {
      throw new Error("401__error: authentication failure");
    }
  } catch (err) {
    handleError(err, req, res, next);
  }
});

//    deletePost: delete a post by post_id
router.patch("/delete/:postId", async (req, res, next) => {
    try {
      const postId = processInput(req, "postId");
      const currUserId = processInput(req, "currUserId");
      
      if (currUserId === req.user.id) {
        const response = await deletePost(postId, currUserId);
        storage.deleteFile(response.image_url)
        res.json({
            status: "success",
            message: `post ${postId} deleted`,
            payload: response
        });
      } else {
        throw new Error("401__error: authentication failure");
      }
    } catch (err) {
      handleError(err, req, res, next);
    }
});


/* EXPORT */
module.exports = router;
