import { Router } from 'express'
import workerAuthRoutes from './auth/routes'

const recruiterRoutes = Router()

recruiterRoutes.use('/auth', workerAuthRoutes)

export default recruiterRoutes
