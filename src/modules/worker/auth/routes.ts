import { Router } from 'express'
import { workerAuthentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import {
    createWorker,
    getWorkerInfo,
    refreshWorkerToken,
    sendVerifyEmailHandler,
    workerLogin,
    workerLogout
} from './controller'
import {
    createWorkerSchema,
    loginWorkerSchema,
    logoutWorkerSchema,
    refreshTokenSchema,
    sendVerifyEmailSchema
} from './schema'

const workerAuthRoutes = Router()

workerAuthRoutes.post('/login', validateBody(loginWorkerSchema), workerLogin)
workerAuthRoutes.post('/logout', validateBody(logoutWorkerSchema), workerLogout)
workerAuthRoutes.post('/refresh', validateBody(refreshTokenSchema), refreshWorkerToken)
workerAuthRoutes.get('/info', workerAuthentication, getWorkerInfo)
workerAuthRoutes.post('/send-mail', validateBody(sendVerifyEmailSchema), sendVerifyEmailHandler)
workerAuthRoutes.post('/register', validateBody(createWorkerSchema), createWorker)

export default workerAuthRoutes
