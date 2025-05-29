import mongoose, { Document, Schema } from 'mongoose'

export interface IVerifyToken extends Document {
    email: string
    token: string
    expiredAt: Date
}

const verifyTokenSchema = new Schema<IVerifyToken>(
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

verifyTokenSchema.index({ token: 1 })

const VerifyToken = mongoose.model<IVerifyToken>('VerifyToken', verifyTokenSchema)

export default VerifyToken
