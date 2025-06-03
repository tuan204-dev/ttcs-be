import { Router } from 'express'
import { recruiterAuthentication, userAuthentication, workerAuthentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import { getAllRecruiting, getRecruitingDetail, recruiterSendMessage, workerSendMessage } from './controller'
import { sendMessageSchema } from './schema'

const recruitingRoutes = Router()

recruitingRoutes.get('/', workerAuthentication, getAllRecruiting)
recruitingRoutes.post('/worker', workerAuthentication, validateBody(sendMessageSchema), workerSendMessage)
recruitingRoutes.post('/recruiter', recruiterAuthentication, validateBody(sendMessageSchema), recruiterSendMessage)
recruitingRoutes.get('/:id', userAuthentication, getRecruitingDetail)

export default recruitingRoutes
