import mongoose, { Document, Schema } from 'mongoose'
import { JobType, RecruitingStatus } from '~/constants/enum'
import { ISalaryRange } from '~/types/job'

export interface IJob extends Document {
    title: string
    recruitingStatus: RecruitingStatus
    description: string
    location: string
    salaryRange: ISalaryRange
    responsibilities?: string[]
    requirements?: string[]
    benefits?: string[]
    jobType: JobType
    recruiterId: mongoose.Types.ObjectId
    // companyId: mongoose.Types.ObjectId
    expiredAt: Date
    updatedAt: Date
}

const jobSchema = new Schema<IJob>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },
        recruitingStatus: {
            type: Number,
            default: RecruitingStatus.DRAFT
        },
        description: {
            type: String,
            required: true,
            trim: true,
            default: ''
        },
        location: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200 
        },
        salaryRange: {
            type: {
                min: { type: Number, required: true, default: 0 },
                max: { type: Number, required: true, default: 0 }
            },
            default: {}
        },
        jobType: {
            type: Number,
            required: true,
        },
        recruiterId: {
            type: Schema.Types.ObjectId,
            ref: 'Recruiter',
            required: true
        },
        responsibilities: {
            type: [String],
            default: []
        },
        requirements: {
            type: [String],
            default: []
        },
        benefits: {
            type: [String],
            default: []
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

const Job = mongoose.model<IJob>('Job', jobSchema)

export default Job
