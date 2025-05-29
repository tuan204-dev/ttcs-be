import mongoose, { Document, Schema } from 'mongoose'

export interface IRecruiterVerifyToken extends Document {
    email: string
    token: string
    expiredAt: Date
}

const recruiterVerifyTokenSchema = new Schema<IRecruiterVerifyToken>(
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

recruiterVerifyTokenSchema.index({ token: 1 })

const RecruiterVerifyToken = mongoose.model<IRecruiterVerifyToken>('RecruiterVerifyToken', recruiterVerifyTokenSchema)

export default RecruiterVerifyToken
