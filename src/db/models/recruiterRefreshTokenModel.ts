import mongoose, { Document } from 'mongoose'

export interface IRecruiterRefreshToken extends Document {
    recruiterId: mongoose.Types.ObjectId
    token: string
    expiresAt: Date
    isRevoked: boolean
    createdAt: Date
    updatedAt: Date
}

// Schema định nghĩa cấu trúc collection
const recruiterRefreshTokenSchema = new mongoose.Schema<IRecruiterRefreshToken>(
    {
        recruiterId: {
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

recruiterRefreshTokenSchema.index({ token: 1 })

// Tạo và export model
const RecruiterRefreshToken = mongoose.model<IRecruiterRefreshToken>(
    'RecruiterRefreshToken',
    recruiterRefreshTokenSchema
)

export default RecruiterRefreshToken
