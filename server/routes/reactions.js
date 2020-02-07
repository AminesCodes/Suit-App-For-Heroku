const express = require('express');
const router = express.Router();

const {
    getAllReactionsByPostId,
    getAllReactionsByCommentId,
    getOneReactionByCommentId,
    getOneReactionByPostId,
    addReactionToPost,
    addReactionToComment,
    deleteReaction
} = require('../queries/reactions');


const handleError = (response, err) => {
    if (err.message === "No data returned from the query.") {
        response.status(404)
        response.json({
            status: 'fail',
            message: 'Unexpected route',
            payload: null,
        })
    } else if (err.constraint === 'comments_post_id_fkey') {
        response.status(404)
        response.json({
            status: 'fail',
            message: 'Wrong route',
            payload: null,
        })
    } else { 
        console.log(err)
        response.status(500)
        response.json({
            status: 'fail',
            message: 'Sorry, Something Went Wrong (BE)',
            payload: null,
        })
    }
}

const isValidId = (id) => {
    if (!isNaN(parseInt(id)) && id.length === (parseInt(id) + '').length) {
        return true
    }
    return false
}


// GET ALL REACTIONS BY POST ID

router.get('/post/all/:postId', async (request, response) => {
    const postId = request.params.postId;
    const validId = isValidId(postId);

    if (!validId) {
        response.status(404)
            response.json({
                status: 'fail',     
                message: 'Wrong route',
                payload: null,
            })
    } else {
        try {
            const allReactionsByPostId = await getAllReactionsByPostId(postId);
            if (allReactionsByPostId.length) {
                response.json({
                    status: 'success',
                    message: `Successfully retrieved all reactions related to the post: ${postId}`,
                    payload: allReactionsByPostId,
                })
            } else {
                response.json({
                    status: 'success',
                    message: 'No reactions returned.',
                    payload: [],
                })
            }
        } catch (err) {
            handleError(response, err)
        }
    }
})

// GET ALL REACTIONS BY COMMENT ID

router.get('/comment/all/:commentId', async (request, response) => {
    const commentId = request.params.commentId;
    const validId = isValidId(commentId);

    if (!validId) {
        response.status(404)
            response.json({
                status: 'fail',     
                message: 'Wrong route',
                payload: null,
            })
    } else {
        try {
            const allReactionsByCommentId = await getAllReactionsByCommentId(commentId);
            if (allReactionsByCommentId.length) {
                response.json({
                    status: 'success',
                    message: `Successfully retrieved all reactions related to the comment: ${commentId}`,
                    payload: allReactionsByCommentId,
                })
            } else {
                response.status(400)
                response.json({
                    status: 'fail',
                    message: 'No reactions returned.',
                    payload: null,
                })
            }
        } catch (err) {
            handleError(response, err)
        }
    }
})

// GET SINGLE REACTION BY POST ID

router.get('/post/:postId/:reactorId', async (request, response) => {
    const postId = request.params.postId;
    const reactorId = request.params.reactorId;
    const validPostId = isValidId(postId);
    const validReactorId = isValidId(reactorId);

    if (!validPostId || !validReactorId) {
        response.status(404)
            response.json({
                status: 'fail',     
                message: 'Wrong route',
                payload: null,
            })
    } else {
        try {
            const reactionByPostId = await getOneReactionByPostId(postId, reactorId);
            response.json({
                status: 'success',
                message: `Successfully retrieved the reaction related to the post: ${postId}`,
                payload: reactionByPostId,
            })
        } catch (err) {
            handleError(response, err)
        }
    }
})

// GET SINGLE REACTION BY COMMENT ID

router.get('/comment/:commentId/:reactorId', async (request, response) => {
    const commentId = request.params.commentId;
    const reactorId = request.params.reactorId;
    const validCommentId = isValidId(commentId);
    const validReactorId = isValidId(reactorId);

    if (!validCommentId || !validReactorId) {
        response.status(404)
            response.json({
                status: 'fail',     
                message: 'Wrong route',
                payload: null,
            })
    } else {
        try {
            const reactionByCommentId = await getOneReactionByCommentId(commentId, reactorId);
            response.json({
                status: 'success',
                message: `Successfully retrieved the reaction related to the comment: ${commentId}`,
                payload: reactionByCommentId,
            })
        } catch (err) {
            handleError(response, err)
        }
    }
})

// ADD A REACTION TO A SPECIFIC POST

router.post('/add/post/:postId', async (request, response) => {
    const postId = request.params.postId;
    const { reactorId, emojiType } = request.body;
    const validPostId = isValidId(postId);
    const validReactorId = isValidId(reactorId);

    if (!validPostId || !validReactorId) {
        response.status(404)
        response.json({
            status: 'fail',     
            message: 'Wrong route',
            payload: null,
        })
    } else {
        try {
            if (reactorId !== req.user.id) {
                response.status(401)
                    response.json({
                        status: 'fail',
                        message: 'Authentication issue',
                        payload: null,
                    })
            } else {
                try {
                    const addReactionToSpecificPost = await addReactionToPost(postId, reactorId, emojiType);
                    response.status(201)
                    response.json({
                        status: 'success',
                        message: `Successfully added a reaction to the post: ${postId}`,
                        payload: addReactionToSpecificPost,
                    })
                } catch (err) {
                    handleError(response, err)
                }
            }
        } catch (err) {
            handleError(response, err)
        }
    }
})

// ADD A REACTION TO A SPECIFIC COMMENT

router.post('/add/comment/:commentId', async (request, response) => {
    const commentId = request.params.commentId;
    const { reactorId, emojiType } = request.body;
    const validCommentId = isValidId(commentId);
    const validReactorId = isValidId(reactorId);

    if (!validCommentId || !validReactorId) {
        response.status(404)
        response.json({
            status: 'fail',     
            message: 'Wrong route',
            payload: null,
        })
    } else {
        try {
            if (reactorId !== req.user.id) {
                response.status(401)
                    response.json({
                        status: 'fail',
                        message: 'Authentication issue',
                        payload: null,
                    })
            } else {
                try {
                    const addReactionToSpecificComment = await addReactionToComment(commentId, reactorId, emojiType);
                    response.status(201)
                    response.json({
                        status: 'success',
                        message: `Successfully added a reaction to the comment: ${commentId}`,
                        payload: addReactionToSpecificComment,
                    })
                } catch (err) {
                    handleError(response, err)
                }
            }
        } catch (err) {
            handleError(response, err)
        }
    }
})

// DELETE A REACTION

router.patch('/delete/:reactionId', async (request, response) => {
    const reactionId = request.params.reactionId;
    const reactorId = request.body.reactorId;
    const validReactionId = isValidId(reactionId);
    const validReactorId = isValidId(reactorId);

    if (!validReactionId || !validReactorId) {
        response.status(404)
        response.json({
            status: 'fail',     
            message: 'Wrong route',
            payload: null,
        })
    } else {
        try {
            if (reactorId !== req.user.id) {
                response.status(401)
                    response.json({
                        status: 'fail',
                        message: 'Authentication issue',
                        payload: null,
                    })
            } else {
                try {
                    const deleteExistingReaction = await deleteReaction(reactionId, reactorId);
                    response.json({
                        status: 'success',
                        message: `Successfully deleted the reaction: ${reactionId}`,
                        payload: deleteExistingReaction,
                    })
                } catch (err) {
                    handleError(response, err)
                }
            }
        } catch (err) {
            handleError(response, err)
        }
    }
})

module.exports = router