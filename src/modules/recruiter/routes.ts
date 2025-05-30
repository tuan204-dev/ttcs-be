import { Router } from 'express'
import recruiterAuthRoutes from './auth/routes'

const recruiterRoutes = Router()

recruiterRoutes.use('/auth', recruiterAuthRoutes)

export default recruiterRoutes
