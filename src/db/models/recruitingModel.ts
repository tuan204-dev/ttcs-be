import mongoose, { Document, Schema } from 'mongoose'
import { RecruitingProgress } from '~/constants/enum'
import { IMessage } from '~/types/message'

export interface IRecruiting extends Document {
    jobId: mongoose.Types.ObjectId
    workerId: mongoose.Types.ObjectId
    messages: IMessage[]
    readMessageId: mongoose.Types.ObjectId
    progress: RecruitingProgress
    lastMessage?: IMessage
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
        },
        messages: {
            type: [
                {
                    senderType: {
                        type: String,
                        enum: ['worker', 'recruiter'],
                        required: true
                    },
                    content: { type: String, required: true, trim: true },
                    createdAt: { type: Date, default: Date.now }
                }
            ],
            default: []
        },
        readMessageId: {
            type: Schema.Types.ObjectId,
            default: null
        },
        lastMessage: {
            type: {
                senderType: {
                    type: String,
                    enum: ['worker', 'recruiter'],
                    required: true
                },
                content: { type: String, required: true, trim: true },
                createdAt: { type: Date, default: Date.now }
            },
            default: null
        },
    },
    {
        timestamps: true,
        versionKey: false
    }
)

recruitingSchema.index({ jobId: 1, workerId: 1 })

const Recruiting = mongoose.model<IRecruiting>('Recruiting', recruitingSchema)

export default Recruiting
