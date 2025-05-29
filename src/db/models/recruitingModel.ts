import mongoose, { Document, Schema } from 'mongoose'
import { RecruitingProgress } from '~/constants/enum'

export interface IRecruiting extends Document {
    jobId: mongoose.Types.ObjectId
    workerId: mongoose.Types.ObjectId
    progress: RecruitingProgress
    expiredAt: Date
    updatedAt: Date
}

const recruitingSchema = new Schema<IRecruiting>(
    {
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        },
        workerId: {
            type: Schema.Types.ObjectId,
            ref: 'Worker',
            required: true
        },
        progress: {
            type: Number,
            default: RecruitingProgress.APPLIED,
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

recruitingSchema.index({ token: 1 })

const Recruiting = mongoose.model<IRecruiting>('Recruiting', recruitingSchema)

export default Recruiting
