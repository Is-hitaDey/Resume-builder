const {Router}= require('express')
const { registerUserController, loginUserController, logoutUserController } = require('../controllers/auth.controller')

const authRouter= Router() 

/**
 * @route POST /api/auth/resgister
 * @description Register a new user
 * @access Public
 */

authRouter.post("/register",registerUserController)

/**
 * @route POST /api/auth/login
 * @description login an user
 * @access Public
 */

authRouter.post("/login", loginUserController)

/**
 * @route GET /api/auth/logout
 * @description clear token from user cookie and add the token in blacklist
 * @access public
 */

authRouter.get("/logout",logoutUserController)


module.exports = authRouter