import { Router } from 'express'
import { workerAuthentication } from '~/middlewares/auth'
import { getAllRecruiting } from './controller'

const recruitingRoutes = Router()

recruitingRoutes.get('/', workerAuthentication, getAllRecruiting)

export default recruitingRoutes
