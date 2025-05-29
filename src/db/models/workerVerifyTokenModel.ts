import mongoose, { Document, Schema } from 'mongoose'

export interface IWorkerVerifyToken extends Document {
    email: string
    token: string
    expiredAt: Date
}

const workerVerifyTokenSchema = new Schema<IWorkerVerifyToken>(
    {
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        expiredAt: {
            type: Date,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

workerVerifyTokenSchema.index({ token: 1 })

const WorkerVerifyToken = mongoose.model<IWorkerVerifyToken>('WorkerVerifyToken', workerVerifyTokenSchema)

export default WorkerVerifyToken
