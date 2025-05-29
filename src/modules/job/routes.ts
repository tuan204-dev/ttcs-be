import { Router } from 'express'
import { recruiterAuthentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import { closeJob, createJob, editJob, getJobs, pauseJob, publicJob } from './controller'
import { createJobSchema, editJobSchema } from './schema'

const jobRoutes = Router()

jobRoutes.post('/', recruiterAuthentication, validateBody(createJobSchema), createJob)
jobRoutes.put('/:id', recruiterAuthentication, validateBody(editJobSchema), editJob)
jobRoutes.get('/', getJobs)
jobRoutes.post('/:id/public', recruiterAuthentication, publicJob)
jobRoutes.post('/:id/pause', recruiterAuthentication, pauseJob)
jobRoutes.post('/:id/close', recruiterAuthentication, closeJob)

export default jobRoutes
