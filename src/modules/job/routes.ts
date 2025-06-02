import { Router } from 'express'
import { recruiterAuthentication, workerAuthentication } from '~/middlewares/auth'
import { validateBody } from '~/middlewares/validation'
import {
    applyJob,
    closeJob,
    createJob,
    editJob,
    getAllRecruitingByJobId,
    getJobs,
    getPublicJobById,
    getPublicJobs,
    pauseJob,
    publicJob,
    rejectRecruiting,
    upProgressStatusRecruiting
} from './controller'
import { createJobSchema, editJobSchema } from './schema'

const jobRoutes = Router()

jobRoutes.post('/', recruiterAuthentication, validateBody(createJobSchema), createJob)
jobRoutes.put('/:id', recruiterAuthentication, validateBody(editJobSchema), editJob)
jobRoutes.get('/', recruiterAuthentication, getJobs)
jobRoutes.get('/worker', workerAuthentication, getPublicJobs)
jobRoutes.get('/worker/:id', workerAuthentication, getPublicJobById)
jobRoutes.post('/:id/public', recruiterAuthentication, publicJob)
jobRoutes.post('/:id/pause', recruiterAuthentication, pauseJob)
jobRoutes.post('/:id/close', recruiterAuthentication, closeJob)
jobRoutes.post('/:id/apply', workerAuthentication, applyJob)
jobRoutes.get('/:id/recruiting', recruiterAuthentication, getAllRecruitingByJobId)
jobRoutes.post('/recruiting/:id/reject', recruiterAuthentication, rejectRecruiting)
jobRoutes.post('/recruiting/:id/up', recruiterAuthentication, upProgressStatusRecruiting)

export default jobRoutes
