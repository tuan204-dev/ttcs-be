import mongoose, { Document, Schema } from 'mongoose'
import { JobType, RecruitingStatus } from '~/constants/enum'
import { ILocation } from '~/types/ILocation'
import { ISalaryRange } from '~/types/job'
import { ISkill } from '~/types/skill'

export interface IJob extends Document {
    title: string
    recruitingStatus: RecruitingStatus
    description: string
    location: ILocation
    salaryRange: ISalaryRange
    jobType: JobType
    skillRequired: ISkill[]
    recruiterId: mongoose.Types.ObjectId
    companyId: mongoose.Types.ObjectId
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
            type: {
                province: { type: String, required: true, trim: true, maxlength: 100 },
                district: { type: String, required: true, trim: true, maxlength: 100 },
                ward: { type: String, required: true, trim: true, maxlength: 100 }
            },
            default: {}
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
        skillRequired: {
            type: [
                {
                    name: { type: String, required: true, trim: true, maxlength: 50 },
                    level: { type: Number, required: true, default: 1 } // Giả sử level là số từ 1 đến 5
                }
            ],
            default: []
        },
        recruiterId: {
            type: Schema.Types.ObjectId,
            ref: 'Recruiter',
            required: true
        },
        companyId: {
            type: Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

jobSchema.index({ token: 1 })

const Job = mongoose.model<IJob>('Job', jobSchema)

export default Job
