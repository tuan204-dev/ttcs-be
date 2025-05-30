import { Router } from 'express'
import { recruiterAuthentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import {
    createRecruiter,
    getRecruiterInfo,
    recruiterLogin,
    recruiterLogout,
    refreshRecruiterToken,
    sendVerifyEmailHandler
} from './controller'
import {
    createRecruiterSchema,
    loginRecruiterSchema,
    logoutRecruiterSchema,
    refreshTokenSchema,
    sendVerifyEmailSchema
} from './schema'

const recruiterAuthRoutes = Router()

recruiterAuthRoutes.post('/login', validateBody(loginRecruiterSchema), recruiterLogin)
recruiterAuthRoutes.post('/logout', validateBody(logoutRecruiterSchema), recruiterLogout)
recruiterAuthRoutes.post('/refresh', validateBody(refreshTokenSchema), refreshRecruiterToken)
recruiterAuthRoutes.get('/info', recruiterAuthentication, getRecruiterInfo)
recruiterAuthRoutes.post('/send-mail', validateBody(sendVerifyEmailSchema), sendVerifyEmailHandler)
recruiterAuthRoutes.post('/register', validateBody(createRecruiterSchema), createRecruiter)

export default recruiterAuthRoutes
