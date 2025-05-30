import { Router } from 'express'
import { recruiterAuthentication, workerAuthentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import {
    applyJob,
    closeJob,
    createJob,
    editJob,
    getJobs,
    pauseJob,
    publicJob,
    rejectRecruiting,
    upProgressStatusRecruiting
} from './controller'
import { createJobSchema, editJobSchema } from './schema'

const jobRoutes = Router()

jobRoutes.post('/', recruiterAuthentication, validateBody(createJobSchema), createJob)
jobRoutes.put('/:id', recruiterAuthentication, validateBody(editJobSchema), editJob)
jobRoutes.get('/', getJobs)
jobRoutes.post('/:id/public', recruiterAuthentication, publicJob)
jobRoutes.post('/:id/pause', recruiterAuthentication, pauseJob)
jobRoutes.post('/:id/close', recruiterAuthentication, closeJob)
jobRoutes.post('/:id/apply', workerAuthentication, applyJob)
jobRoutes.post('/recruiting/:id/reject', recruiterAuthentication, rejectRecruiting)
jobRoutes.post('/recruiting/:id/up', recruiterAuthentication, upProgressStatusRecruiting)

export default jobRoutes
