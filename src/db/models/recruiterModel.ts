import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose, { Document, Schema } from 'mongoose'
import { Gender } from '~/constants/enum'

export interface IRecruiter extends Document {
    email: string
    password: string
    firstName: string
    lastName: string
    phone?: string
    gender: Gender
    avatar?: string
    createdAt: Date
    updatedAt: Date

    // Methods
    comparePassword(candidatePassword: string): Promise<boolean>
    genJWTAccessToken(): string
}

// Schema định nghĩa cấu trúc collection
const recruiterSchema = new Schema<IRecruiter>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 50
        },
        phone: {
            type: String,
            trim: true,
            maxlength: 15,
            default: ''
        },
        gender: {
            type: Number,
            enum: Object.values(Gender),
            default: Gender.UNKNOWN
        },
        avatar: {
            type: String,
            trim: true,
            default: ''
        }
    },
    {
        timestamps: true, // Tự động tạo createdAt và updatedAt
        versionKey: false
    }
)

// Index để tối ưu hóa truy vấn
recruiterSchema.index({ email: 1 })

// Middleware để hash password trước khi save
recruiterSchema.pre('save', async function (next) {
    // Chỉ hash password khi password được thay đổi
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(12)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error as Error)
    }
})

// Method để so sánh password
recruiterSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password)
}

// Method để tạo JWT access token
recruiterSchema.methods.genJWTAccessToken = function (): string {
    const payload = {
        id: this._id,
        email: this.email
    }

    const secretKey = process.env.JWT_ACCESS_TOKEN_SECRET

    if (!secretKey) {
        throw new Error('JWT secret key is not defined')
    }

    const accessToken = jwt.sign(payload, secretKey, {
        expiresIn: '1h'
    })

    return accessToken
}

// Transform để loại bỏ password khỏi JSON response
recruiterSchema.methods.toJSON = function () {
    const recruiterObject = this.toObject()
    delete recruiterObject.password
    return recruiterObject
}

// Tạo và export model
const Recruiter = mongoose.model<IRecruiter>('Recruiter', recruiterSchema)

export default Recruiter
