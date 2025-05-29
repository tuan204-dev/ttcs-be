import { Router } from 'express'
import { authentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import { createUser, getUserInfo, login, logout, refreshToken, sendVerifyEmailHandler } from './controller'
import {
    createUserSchema,
    loginUserSchema,
    logoutUserSchema,
    refreshTokenSchema,
    sendVerifyEmailSchema
} from './schema'

const authRoutes = Router()

authRoutes.post('/login', validateBody(loginUserSchema), login)
authRoutes.post('/logout', validateBody(logoutUserSchema), logout)
authRoutes.post('/refresh', validateBody(refreshTokenSchema), refreshToken)
authRoutes.get('/info', authentication, getUserInfo)
authRoutes.post('/send-mail', validateBody(sendVerifyEmailSchema), sendVerifyEmailHandler)
authRoutes.post('/register', validateBody(createUserSchema), createUser)

export default authRoutes
