import { Router } from 'express'
import { workerAuthentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import {
    getRecruiterInfo,
    recruiterLogin,
    recruiterLogout,
    refreshRecruiterToken,
    sendVerifyEmailHandler
} from './controller'
import {
    createWorkerSchema,
    loginWorkerSchema,
    logoutWorkerSchema,
    refreshTokenSchema,
    sendVerifyEmailSchema
} from './schema'
import { createWorker } from '~/modules/worker/auth/controller'

const recruiterAuthRoutes = Router()

recruiterAuthRoutes.post('/login', validateBody(loginWorkerSchema), recruiterLogin)
recruiterAuthRoutes.post('/logout', validateBody(logoutWorkerSchema), recruiterLogout)
recruiterAuthRoutes.post('/refresh', validateBody(refreshTokenSchema), refreshRecruiterToken)
recruiterAuthRoutes.get('/info', workerAuthentication, getRecruiterInfo)
recruiterAuthRoutes.post('/send-mail', validateBody(sendVerifyEmailSchema), sendVerifyEmailHandler)
recruiterAuthRoutes.post('/register', validateBody(createWorkerSchema), createWorker)

export default recruiterAuthRoutes
