import mongoose, { Document, Schema } from 'mongoose'
import { IMessage } from '~/types/message'

export interface IConversation extends Document {
    workerId: mongoose.Types.ObjectId
    jobId: mongoose.Types.ObjectId
    messages: IMessage[]
    readMessageId: mongoose.Types.ObjectId
    expiredAt: Date
    updatedAt: Date
}

const conversationSchema = new Schema<IConversation>(
    {
        workerId: {
            type: Schema.Types.ObjectId,
            ref: 'Worker',
            required: true
        },
        jobId: {
            type: Schema.Types.ObjectId,
            ref: 'Job',
            required: true
        },
        messages: {
            type: [
                {
                    senderId: { type: Schema.Types.ObjectId, required: true },
                    receiverId: { type: Schema.Types.ObjectId, required: true },
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
    },
    {
        timestamps: true,
        versionKey: false
    }
)

conversationSchema.index({ token: 1 })

const Company = mongoose.model<IConversation>('Company', conversationSchema)

export default Company
