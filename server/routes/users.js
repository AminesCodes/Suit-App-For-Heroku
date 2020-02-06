const express = require('express');
const router = express.Router();
const multer = require('multer');

const usersQueries = require('../queries/users');
const { authenticateUser } = require('../queries/authentication')
const authHelpers = require('../auth/helpers')
const passport = require('../auth/passport')

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, './public/images/avatars') // UNEXPECTED BUG!! while '../public/images/avatars' looks like it's the correct route, for some reason it doesn't work
  },
  filename: (request, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname
    cb(null, fileName)
  }
});

const fileFilter = (request, file, cb) => {
    if ((file.mimetype).slice(0, 6) === 'image/') {
        
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ 
        storage: storage,
        fileFilter: fileFilter,
    });

const handleError = (response, err) => {
    console.log(err)
    response.status(500)
    response.json({
        status: 'fail',
        message: 'Sorry, Something Went Wrong (BE)',
        payload: null,
    })
}

const handleResponse = (response, data) => {
    if (data === 'no match') {
        response.status(444)
        response.json({
            status: 'fail',
            message: `No match!`,
            payload: null,
        })
    } else {
        response.json({
            status: 'success',
            message: `Successfully retrieved the user`,
            payload: data,
        })
    }
}

// PASSPORT CONFIGURED FOR DEBUGGING PURPOSE
const passportAuthentication = (request, response, next) => {
    passport.authenticate('local', (err, user) => {
        if (err) {
            console.log('ERROR: ', err);
            handleError(response, err)
        } else if (!user) {
            response.status(401).json({
                status: 'fail',
                message: 'Authentication issue',
                payload: null,
            })
        } else {
            next();
        }
    })(request, response);
}

router.post("/login", /*passportAuthentication*/passport.authenticate('local'), (request, response) => {
    response.json({
        status: 'success',
        message: 'Successfully logged user',
        payload: request.user,
    })
})
// Log a registered user
// router.post('/login', async (request, response) => {
//     let { password, email } = request.body
    
//     if (!password || !email) {
//         response.status(400)
//         response.json({
//             status: 'fail',
//             message: 'Missing Information',
//             payload: null,
//         })
//     } else {
//         try {
//             const userToLog = await usersQueries.logUser(email, password)
//             if (userToLog) {
//                 response.json({
//                     status: 'success',
//                     message: 'Successfully logged user',
//                     payload: userToLog,
//                 })
//             } else {
//                 response.status(401)
//                 response.json({
//                     status: 'fail',
//                     message: 'User Authentication Issue',
//                     payload: null,
//                 })
//             }
//         } catch (err) {
//             handleError(response, err)
//         }
//     }
// })

 
router.post('/signup', async (request, response) => {
    const { username, firstname, lastname, password, email, ageCheck } = request.body
    if (!username || !firstname || !lastname || !password || !email || !ageCheck || ageCheck !== 'true') {
        response.status(400)
            response.json({
                status: 'fail',
                message: 'Missing Information, all fields are required',
                payload: null,
            })
    } else {
        try {
            request.body.password = await authHelpers.hashPassword(req.body.password)
            const newUser = await usersQueries.createUser(request.body)
            response.status(201)
            response.json({
                status: 'success',
                message: 'Successfully signed up',
                payload: newUser,
            })
        } catch (err) {
            // Username/email already taken 
            if (err.code === "23505" && err.detail.includes("already exists")) {
                console.log('Attempt to register a new user with a taken email/username')
                response.status(403)
                response.json({
                    status: 'fail',
                    message: 'Username already taken AND/OR email address already registered',
                    payload: null,
                })
            } else {
                handleError(response, err)
            }
        }
    }
})

router.get("/logout", /*authHelpers.checkUserLogged,*/ (request, response) => {
    request.logOut()
    response.json({
        status: 'success',
        message: 'User logged out successfully',
        payload: null,
    })
})
  
router.get("/isUserLoggedIn", authHelpers.checkUserLogged, (request, response) => {
    console.log('ROUTER, ISUSERLOGGEDIN: ', request.user)
    response.json({
        status: 'success',
        message: 'User is logged in. Session active',
        payload: request.user,
    })
})


// GET ALL USERS
router.get('/all', authHelpers.checkUserLogged, async (request, response) => {
    try {
        const allUsers = await usersQueries.getAllUsers();
        response.json({
            status: 'success',
            message: 'Successfully retrieved all users',
            payload: allUsers,
        })
    } catch (err) {
        handleError(response, err)
    }
})



router.get('/:username', authHelpers.checkUserLogged, async (request, response) => {
    const username = request.params.username
    let userId = false

    if (!isNaN(parseInt(username)) && username.length === (parseInt(username) + '').length) {
        userId = username
    }

    if (userId) {
        try {
            const targetUser = await usersQueries.getUserById(userId);
            handleResponse(response, targetUser)
        } catch (err) {
            handleError(response, err)
        }
    } else {
        try {
            const targetUser = await usersQueries.getUserByUsername(username);
            handleResponse(response, targetUser)

        } catch (err) {
            handleError(response, err)
        }
    }
})


router.put('/:userId', authHelpers.checkUserLogged, upload.single('avatar'), async (request, response) => {
    const userId = request.params.userId;
    const { username, firstname, lastname, password, email} = request.body

    if (isNaN(parseInt(userId)) || parseInt(userId) + '' !== userId) {
        response.status(404)
            response.json({
                status: 'fail',     
                message: 'Wrong route',
                payload: null,
            })
    } else if (username === 'undefined' || !username || !firstname || !lastname || !password || !email) {
        response.status(400)
            response.json({
                status: 'fail',
                message: 'Missing Information or invalid username',
                payload: null,
            })
    } else {
        let avatarUrl = null;
        if (request.file) {
            avatarUrl = 'http://' + request.headers.host + '/images/avatars/' + request.file.filename
        } 
        try {
            const authorizedToUpdate = await authenticateUser(userId, password)
            if (authorizedToUpdate) {
                try {
                    const updatedUser = await usersQueries.updateUserInfo(userId, request.body, avatarUrl)
                    response.json({
                        status: 'success',
                        message: 'Successfully update information',
                        payload: updatedUser,
                    })
                } catch (err) {
                    // Username/email already taken 
                    if (err.code === "23505" && err.detail.includes("already exists")) {
                        console.log('Attempt to update user information with a taken email/username')
                        response.status(403)
                        response.json({
                            status: 'fail',
                            message: 'Username already taken AND/OR email address already registered',
                            payload: null,
                        })
                    } else {
                        handleError(response, err)
                    }
                }
            } else {
                console.log('Authentication issue')
                response.status(401)
                response.json({
                    status: 'fail',
                    message: 'Authentication issue',
                    payload: null,
                })
            }
        } catch (err) {
            if (err.message === "No data returned from the query.") {
                response.status(404)
                response.json({
                    status: 'fail',
                    message: 'User does not exist',
                    payload: null,
                })
            } else {
                handleError(response, err)
            }
        }
    }
})


router.patch('/:userId/password', authHelpers.checkUserLogged, async (request, response) => {
    const userId = request.params.userId;
    const { oldPassword, newPassword, confirmedPassword } = request.body

    if (!oldPassword || !newPassword || !confirmedPassword || newPassword !== confirmedPassword) {
        response.status(400)
            response.json({
                status: 'fail',
                message: 'Missing Information',
                payload: null,
            })
    } else {
        try {
            const authorizedToUpdate = await authenticateUser(userId, oldPassword)
            if (authorizedToUpdate) {
                try {
                    const updatedUser = await usersQueries.updateUserPassword(userId, newPassword)
                    response.json({
                        status: 'success',
                        message: 'Successfully updated the password',
                        payload: updatedUser,
                    })
                } catch (err) {
                    handleError(response, err)
                }
            } else {
                console.log('Authentication issue')
                response.status(401)
                response.json({
                    status: 'fail',
                    message: 'Authentication issue',
                    payload: null,
                })
            }
        } catch (err) {
            if (err.message === "No data returned from the query.") {
                response.status(404)
                response.json({
                    status: 'fail',
                    message: 'User does not exist',
                    payload: null,
                })
            } else {
                handleError(response, err)
            }
        }
    }
})

router.patch('/:userId/theme/:theme', authHelpers.checkUserLogged, async (request, response) => {
    const { userId, theme } = request.params;
    const { password } = request.body;

    if (!password) {
        response.status(400)
            response.json({
                status: 'fail',
                message: 'Missing Information',
                payload: null,
            })
    } else if (theme === 'dark' || theme === 'light') { 
        try {
            const authorizedToUpdate = await authenticateUser(userId, password)
            if (authorizedToUpdate) {
                try {
                    const updatedTheme = await usersQueries.updateUserTheme(userId, theme)
                    response.json({
                        status: 'success',
                        message: `Successfully updated the theme to ${theme}`,
                        payload: updatedTheme,
                    })
                } catch (err) {
                    handleError(response, err)
                }
            } else {
                console.log('Authentication issue')
                response.status(401)
                response.json({
                    status: 'fail',
                    message: 'Authentication issue',
                    payload: null,
                })
            }
        } catch (err) {
            if (err.message === "No data returned from the query.") {
                response.status(404)
                response.json({
                    status: 'fail',
                    message: 'User does not exist',
                    payload: null,
                })
            } else {
                handleError(response, err)
            }
        }
    } else {
        console.log('Invalid route for changing the theme')
        response.status(404)
        response.json({
            status: 'fail',
            message: 'Invalid route',
            payload: null,
        })
    }
})


router.patch('/:userId/delete', authHelpers.checkUserLogged, async (request, response) => {
    const userId = request.params.userId;
    const { password } = request.body

    if (!password) {
        response.status(400)
            response.json({
                status: 'fail',
                message: 'Missing Information',
                payload: null,
            })
    } else {
        try {
            const authorizedToUpdate = await authenticateUser(userId, password)
            if (authorizedToUpdate) {
                try {
                    const deletedUser = await usersQueries.deleteUser(userId)
                    if (deletedUser) {
                        response.json({
                            status: 'success',
                            message: 'Successfully delete user',
                            payload: deletedUser,
                        })
                    } else {
                        response.status(401)
                        response.json({
                            status: 'fail',
                            message: 'Invalid user',
                            payload: null,
                        })
                    }
                } catch (err) {
                    handleError(response, err)
                }
            } else {
                console.log('Authentication issue')
                response.status(401)
                response.json({
                    status: 'fail',
                    message: 'Authentication issue',
                    payload: null,
                })
            }
        } catch (err) {
            if (err.message === "No data returned from the query.") {
                response.status(404)
                response.json({
                    status: 'fail',
                    message: 'User does not exist',
                    payload: null,
                })
            } else {
                handleError(response, err)
            }
        }
    }
})

module.exports = router