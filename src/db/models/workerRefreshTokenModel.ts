import mongoose, { Document } from 'mongoose'

export interface IWorkerRefreshToken extends Document {
    workerId: mongoose.Types.ObjectId
    token: string
    expiresAt: Date
    isRevoked: boolean
    createdAt: Date
    updatedAt: Date
}

// Schema định nghĩa cấu trúc collection
const workerRefreshTokenSchema = new mongoose.Schema<IWorkerRefreshToken>(
    {
        workerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Worker'
        },
        token: {
            type: String,
            required: true,
            unique: true
        },
        expiresAt: {
            type: Date,
            required: true
        },
        isRevoked: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
        versionKey: false
    }
)

workerRefreshTokenSchema.index({ token: 1 })

// Tạo và export model
const WorkerRefreshToken = mongoose.model<IWorkerRefreshToken>('WorkerRefreshToken', workerRefreshTokenSchema)

export default WorkerRefreshToken
