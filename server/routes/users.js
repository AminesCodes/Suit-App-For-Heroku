const express = require('express');
const router = express.Router();
const multer = require('multer');

const usersQueries = require('../queries/users');
const passport = require('../auth/passport')
const { checkUserLogged, hashPassword } = require('../auth/helpers')

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

const sendError = (response, err) => {
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
            sendError(response, err)
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
    const user = request.user
    delete user.user_password
    response.json({
        status: 'success',
        message: 'Successfully logged user',
        payload: user,
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
//             sendError(response, err)
//         }
//     }
// })

const signupUser = async (request, response, next) => {
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
            // request.body.password = await hashPassword(request.body.password)
            const newUser = await usersQueries.createUser(request.body)
            next()

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
                sendError(response, err)
            }
        }
    }
}
 
router.post('/signup', signupUser, passport.authenticate('local'), (request, response) => {
    const user = request.user
    delete user.user_password
    response.status(201)
    response.json({
        status: 'success',
        message: 'Successfully signed up',
        payload: user,
    })
})

router.get("/logout", /*checkUserLogged,*/ (request, response) => {
    request.logOut()
    response.json({
        status: 'success',
        message: 'User logged out successfully',
        payload: null,
    })
})
  
router.get("/isUserLoggedIn", checkUserLogged, (request, response) => {
    const user = request.user
    delete user.user_password
    response.json({
        status: 'success',
        message: 'User is logged in. Session active',
        payload: user,
    })
})


// GET ALL USERS
router.get('/all', checkUserLogged, async (request, response) => {
    try {
        const allUsers = await usersQueries.getAllUsers();
        response.json({
            status: 'success',
            message: 'Successfully retrieved all users',
            payload: allUsers,
        })
    } catch (err) {
        sendError(response, err)
    }
})



router.get('/:username', checkUserLogged, async (request, response) => {
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
            sendError(response, err)
        }
    } else {
        try {
            const targetUser = await usersQueries.getUserByUsername(username);
            handleResponse(response, targetUser)

        } catch (err) {
            sendError(response, err)
        }
    }
})


const updateUser = async (request, response, next) => {
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
                message: 'Missing information or invalid username',
                payload: null,
            })
    } else {
        let avatarUrl = null;
        if (request.file) {
            avatarUrl = 'http://' + request.headers.host + '/images/avatars/' + request.file.filename
        } 
        try {
            if (parseInt(userId) === request.user.id) {
                await usersQueries.updateUserInfo(userId, request.body, avatarUrl)
                next()
            } else {
                console.log('Not authorized to update')
                response.status(403)
                response.json({
                    status: 'fail',
                    message: 'Not authorized to update',
                    payload: null,
                })
            }
            
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
                sendError(response, err)
            }
        }
    }
}

router.put('/:userId', checkUserLogged, upload.single('avatar'), updateUser, passport.authenticate('local'), (request, response) => {
    const user = request.user
    delete user.user_password
    response.json({
        status: 'success',
        message: 'Successfully update information',
        payload: user,
    })
})


const updatePassword = async (request, response, next) => {
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
            if (parseInt(userId) === request.user.id) {
                // const password = hashPassword(newPassword)
                // const updatedUser = await usersQueries.updateUserPassword(userId, password)
                const updatedUser = await usersQueries.updateUserPassword(userId, newPassword)
                request.body.password = newPassword
                request.body.email = updatedUser.email
                next()

            } else {
                console.log('Not authorized to update')
                response.status(401)
                response.json({
                    status: 'fail',
                    message: 'Not authorized to update',
                    payload: null,
                })
            }
            
        } catch (err) {
            sendError(response, err)
        }
    }
}

router.patch('/:userId/password', checkUserLogged, updatePassword, passport.authenticate('local'), (request, response) => {
    const user = request.user
    delete user.user_password
    response.json({
        status: 'success',
        message: 'Successfully updated the password',
        payload: user,
    })
})


const updateTheme = async (request, response, next) => {
    const { userId, theme } = request.params;
    const password = request.body.password;

    if ((theme === 'dark' || theme === 'light') && password && !isNaN(parseInt(userId)) && parseInt(userId)+'' === userId) { 
        try {
            if (parseInt(userId) === request.user.id) {
                const updatedTheme = await usersQueries.updateUserTheme(userId, theme)
                request.body.email = updatedTheme.email;
                next();

            } else {
                console.log('Not authorized to update')
                response.status(401)
                response.json({
                    status: 'fail',
                    message: 'Not authorized to update',
                    payload: null,
                })
            }
            
        } catch (err) {
            sendError(response, err)
        }

    } else {
        console.log('Invalid route')
        response.status(404)
        response.json({
            status: 'fail',
            message: 'Invalid route',
            payload: null,
        })
    }
}
router.patch('/:userId/theme/:theme', checkUserLogged, updateTheme, passport.authenticate('local'), async (request, response) => {
    const user = request.user
    delete user.user_password
    response.json({
        status: 'success',
        message: `Successfully updated the theme`,
        payload: user,
    })
})


router.patch('/:userId/delete', checkUserLogged, async (request, response) => {
    const userId = request.params.userId;
    const { password } = request.body

    if (!password || isNaN(parseInt(userId)) || parseInt(userId) + '' !== userId) {
        response.status(400)
            response.json({
                status: 'fail',
                message: 'Missing Information',
                payload: null,
            })
    } else {
        try {
            if (parseInt(userId) === request.user.id) {
                const deletedUser = await usersQueries.deleteUser(userId)
                request.logOut()
                response.json({
                    status: 'success',
                    message: 'Successfully delete user',
                    payload: deletedUser,
                })

            } else {
                console.log('Not authorized to update')
                response.status(401)
                response.json({
                    status: 'fail',
                    message: 'Not authorized to update',
                    payload: null,
                })
            }
            
        } catch (err) {
            sendError(response, err)
        }
    }
})

module.exports = router