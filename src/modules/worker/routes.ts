import { Router } from 'express'
import workerAuthRoutes from './auth/routes'

const workerRoutes = Router()

workerRoutes.use('/auth', workerAuthRoutes)

export default workerRoutes
