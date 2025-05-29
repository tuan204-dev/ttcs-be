import { Request, Response } from 'express'
import { getResponse } from '~/utils/common'
import { GetJobsQuery, ICreateJob, IEditJob } from './type'
import Job from '~/db/models/jobModel'
import { RecruitingStatus } from '~/constants/enum'

export const createJob = async (req: Request<unknown, unknown, ICreateJob>, res: Response) => {
    try {
        const { title, description, location, salaryRange, jobType, skillRequired, companyId } = req.body

        const recruiterId = req.user?.id

        const newJob = await Job.create({
            title,
            description,
            location,
            salaryRange,
            jobType,
            skillRequired,
            recruiterId,
            companyId,
            recruitingStatus: RecruitingStatus.DRAFT
        })

        res.status(201).json(
            getResponse({
                message: 'Create job successfully',
                data: newJob.toJSON()
            })
        )
    } catch (e) {
        console.log(e)
        res.status(500).json(
            getResponse({
                message: 'Create job failed'
            })
        )
    }
}

export const editJob = async (req: Request<{ id: string }, unknown, IEditJob>, res: Response) => {
    try {
        const jobId = req.params.id
        const recruiterId = req.user?.id
        const { title, description, location, salaryRange, jobType, skillRequired } = req.body

        const job = await Job.findById(jobId)

        if (!job || String(job?.toJSON().recruiterId) !== String(recruiterId)) {
            res.status(404).json(
                getResponse({
                    message: 'Job not found'
                })
            )
            return
        }

        const newJob = await Job.findByIdAndUpdate(
            jobId,
            {
                title,
                description,
                location,
                salaryRange,
                jobType,
                skillRequired
            },
            { new: true }
        )

        res.status(200).json(
            getResponse({
                message: 'Edit job successfully',
                data: newJob?.toJSON()
            })
        )
    } catch (e) {
        console.log(e)
        res.status(500).json(
            getResponse({
                message: 'Edit job failed'
            })
        )
    }
}

export const getJobs = async (req: Request<unknown, unknown, unknown, GetJobsQuery>, res: Response) => {
    try {
        const { recruiterId, companyId } = req.query

        const query: any = {}
        if (recruiterId) {
            query.recruiterId = recruiterId
        }
        if (companyId) {
            query.companyId = companyId
        }

        const jobs = await Job.find(query).sort({ createdAt: -1 })

        res.status(200).json(
            getResponse({
                message: 'Get jobs successfully',
                data: jobs.map((job) => job.toJSON())
            })
        )
    } catch (e) {
        console.log(e)
        res.status(200).json(
            getResponse({
                message: 'Get jobs failed',
                data: [],
                success: false
            })
        )
    }
}

export const publicJob = async (req: Request, res: Response) => {
    try {
        const recruiterId = req.user?.id
        const jobId = req.params.id

        const job = await Job.findById(jobId)

        if (!job || String(job?.toJSON().recruiterId) !== String(recruiterId)) {
            res.status(404).json(
                getResponse({
                    message: 'Job not found'
                })
            )
            return
        }

        const newJob = await Job.findByIdAndUpdate(jobId, { recruitingStatus: RecruitingStatus.PUBLIC }, { new: true })

        res.status(200).json(
            getResponse({
                message: 'Public job successfully',
                data: newJob?.toJSON()
            })
        )
    } catch (e) {
        console.log(e)
        res.status(500).json(
            getResponse({
                message: 'Public job failed'
            })
        )
    }
}

export const pauseJob = async (req: Request, res: Response) => {
    try {
        const recruiterId = req.user?.id
        const jobId = req.params.id

        const job = await Job.findById(jobId)

        if (!job || String(job?.toJSON().recruiterId) !== String(recruiterId)) {
            res.status(404).json(
                getResponse({
                    message: 'Job not found'
                })
            )
            return
        }

        const newJob = await Job.findByIdAndUpdate(jobId, { recruitingStatus: RecruitingStatus.PAUSED }, { new: true })

        res.status(200).json(
            getResponse({
                message: 'Pause job successfully',
                data: newJob?.toJSON()
            })
        )
    } catch (e) {
        console.log(e)
        res.status(500).json(
            getResponse({
                message: 'Pause job failed'
            })
        )
    }
}

export const closeJob = async (req: Request, res: Response) => {
    try {
        const recruiterId = req.user?.id
        const jobId = req.params.id

        const job = await Job.findById(jobId)

        if (!job || String(job?.toJSON().recruiterId) !== String(recruiterId)) {
            res.status(404).json(
                getResponse({
                    message: 'Job not found'
                })
            )
            return
        }

        const newJob = await Job.findByIdAndUpdate(jobId, { recruitingStatus: RecruitingStatus.CLOSED }, { new: true })

        res.status(200).json(
            getResponse({
                message: 'Close job successfully',
                data: newJob?.toJSON()
            })
        )
    } catch (e) {
        console.log(e)
        res.status(500).json(
            getResponse({
                message: 'Close job failed'
            })
        )
    }
}
