import mongoose from 'mongoose'

export interface IRefreshToken extends Document {
    userId: mongoose.Types.ObjectId
    token: string
    expiresAt: Date
    isRevoked: boolean
    createdAt: Date
    updatedAt: Date

    // Methods
    // comparePassword(candidatePassword: string): Promise<boolean>
}

// Schema định nghĩa cấu trúc collection
const refreshTokenSchema = new mongoose.Schema<IRefreshToken>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
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

refreshTokenSchema.index({ token: 1 })

// Tạo và export model
const RefreshToken = mongoose.model<IRefreshToken>('RefreshToken', refreshTokenSchema)

export default RefreshToken
