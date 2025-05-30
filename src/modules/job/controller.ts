import { Request, Response } from 'express'
import { getResponse } from '~/utils/common'
import { GetJobsQuery, ICreateJob, IEditJob } from './type'
import Job from '~/db/models/jobModel'
import { RecruitingProgress, RecruitingStatus } from '~/constants/enum'
import Recruiting from '~/db/models/recruitingModel'

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

export const applyJob = async (req: Request, res: Response) => {
    try {
        const workerId = req.user?.id
        const jobId = req.params.id

        const job = await Job.findById(jobId)

        if (!job) {
            res.status(404).json(
                getResponse({
                    message: 'Job not found'
                })
            )
            return
        }

        const recruitingDoc = await Recruiting.findOne({
            jobId,
            workerId
        })

        if (recruitingDoc) {
            res.status(400).json(
                getResponse({
                    message: 'You have already applied for this job'
                })
            )
            return
        }

        const newRecruiting = await Recruiting.create({
            jobId,
            workerId,
            progress: RecruitingProgress.APPLIED
        })

        res.status(200).json(
            getResponse({
                message: 'Apply job successfully',
                data: newRecruiting.toJSON()
            })
        )
    } catch (e) {
        console.log('Apply job failed', e)
        res.status(500).json(
            getResponse({
                message: 'Apply job failed'
            })
        )
    }
}

export const rejectRecruiting = async (req: Request, res: Response) => {
    try {
        const recruitingId = req.params.id
        const recruiterId = req.user?.id

        const recruiting = await Recruiting.findById(recruitingId).populate('jobId')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!recruiting || String(recruiting.jobId?.toObject().recruiterId) !== String(recruiterId)) {
            res.status(404).json(
                getResponse({
                    message: 'Recruiting not found'
                })
            )
            return
        }

        const updatedRecruiting = await Recruiting.findByIdAndUpdate(
            recruitingId,
            { progress: RecruitingProgress.REJECTED },
            { new: true }
        )

        res.status(200).json(
            getResponse({
                message: 'Reject recruiting successfully',
                data: updatedRecruiting?.toJSON()
            })
        )
    } catch (e) {
        console.log('Reject recruiting failed', e)
        res.status(500).json(
            getResponse({
                message: 'Reject recruiting failed'
            })
        )
    }
}

export const upProgressStatusRecruiting = async (req: Request, res: Response) => {
    try {
        const recruitingId = req.params.id
        const recruiterId = req.user?.id

        const recruiting = await Recruiting.findById(recruitingId).populate('jobId')

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (!recruiting || String(recruiting.jobId?.toObject().recruiterId) !== String(recruiterId)) {
            res.status(404).json(
                getResponse({
                    message: 'Recruiting not found'
                })
            )
            return
        }

        let newStatus = RecruitingProgress.DOCUMENT_READING

        switch (recruiting.progress) {
            case RecruitingProgress.APPLIED:
                newStatus = RecruitingProgress.DOCUMENT_READING
                break
            case RecruitingProgress.DOCUMENT_READING:
                newStatus = RecruitingProgress.INTERVIEW
                break
            case RecruitingProgress.INTERVIEW:
                newStatus = RecruitingProgress.TECH_ASSESSMENT
                break
            case RecruitingProgress.TECH_ASSESSMENT:
                newStatus = RecruitingProgress.OFFER
                break
            case RecruitingProgress.OFFER:
                newStatus = RecruitingProgress.HIRED
                break
            default:
                break
        }

        const updatedRecruiting = await Recruiting.findByIdAndUpdate(
            recruitingId,
            { progress: newStatus },
            { new: true }
        )

        res.status(200).json(
            getResponse({
                message: 'Up progress recruiting successfully',
                data: updatedRecruiting?.toJSON()
            })
        )
    } catch (e) {
        console.log('Up progress recruiting failed', e)
        res.status(500).json(
            getResponse({
                message: 'Up progress recruiting failed'
            })
        )
    }
}
